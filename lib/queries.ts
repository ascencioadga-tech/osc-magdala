import "server-only";
import { getSupabaseServer, supabaseReady } from "./supabase-server";
import type { Member } from "./members";
import { isDemo, demoMembers } from "./demo";

/*
  Server-side reads for the workspace.

  These run as the SIGNED-IN USER, not as an admin. Row-level security does
  the filtering, so a pastor's query returns memorial dates and care notes,
  and a volunteer's identical query silently does not. The UI never has to
  remember to hide anything — Postgres refuses to hand it over.

  They map the relational schema back into the flat `Member` shape the
  Members UI already speaks, so the interface didn't change when the
  database arrived.

  `import "server-only"` makes the build fail if this is ever imported into
  a client component, which would leak the key to the browser.
*/

/*
  PostgREST caps an unbounded select (1,000 rows by default) and returns the
  truncation silently. With ~1,000 people, contact_methods and key_dates are
  several thousand rows each — an unpaged read would quietly drop the tail and
  hundreds of people would render with no phone or email, which the messaging
  screen would then read as "unreachable". So every table is read in pages
  until it's exhausted.
*/
const PAGE = 1000;

async function fetchAll<T = Record<string, unknown>>(
  build: () => { range: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }> },
): Promise<{ rows: T[]; error: unknown }> {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build().range(from, from + PAGE - 1);
    if (error) return { rows, error };
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < PAGE) break;
  }
  return { rows, error: null };
}

export type FetchMembersResult = {
  members: Member[];
  /** Set when the read failed outright, so the UI can say so instead of
      showing an empty directory that looks like "nobody is here yet". */
  error?: string;
};

export async function fetchMembersResult(): Promise<FetchMembersResult> {
  // Demo mode short-circuits before Supabase is touched at all.
  if (isDemo()) return { members: demoMembers() };

  /*
    No project configured. This has to be checked HERE and not only in the
    layout's requireStaff(), because Next renders a layout and its page
    concurrently — so this query runs even on a request the layout is about
    to redirect. Without the guard, creating a client from undefined values
    throws and the whole route 500s instead of redirecting to the login.
  */
  if (!supabaseReady()) {
    return { members: [], error: "The workspace database isn't connected yet." };
  }

  const db = await getSupabaseServer();

  const [people, households, contacts, dates, miles, serving, groups, notes, intentions] =
    await Promise.all([
      fetchAll(() => db.from("people").select("*").is("archived_at", null) as never),
      fetchAll(() => db.from("households").select("id,name") as never),
      fetchAll(() => db.from("contact_methods").select("person_id,kind,value,is_primary") as never),
      fetchAll(() => db.from("key_dates").select("person_id,kind,date,label,relation") as never),
      fetchAll(() => db.from("milestones").select("person_id,label,date") as never),
      fetchAll(() => db.from("serving").select("person_id,is_interest,ended_on,ministries(name)") as never),
      fetchAll(() => db.from("group_members").select("person_id,left_on,groups(name)") as never),
      // Pastor-only by RLS. A non-pastor gets zero rows here rather than an
      // error, so the same query is safe for everyone on the team.
      fetchAll(() => db.from("care_notes").select("person_id,body,created_at") as never),
      // Standing intentions. RLS shows the private ones to pastors only, so
      // the same query is safe for everyone on the team.
      fetchAll(() => db.from("prayer_requests").select("person_id,body,created_at,status") as never),
    ]);

  if (people.error) {
    return { members: [], error: "The directory could not be loaded." };
  }

  type Row = { person_id: string } & Record<string, unknown>;
  const householdName = new Map(
    (households.rows as { id: string; name: string }[]).map((h) => [h.id, h.name]),
  );

  const byPerson = (rows: unknown[]): Map<string, Row[]> => {
    const m = new Map<string, Row[]>();
    for (const r of rows as Row[]) {
      const list = m.get(r.person_id) ?? [];
      list.push(r);
      m.set(r.person_id, list);
    }
    return m;
  };

  const contactsBy = byPerson(contacts.rows);
  const datesBy = byPerson(dates.rows);
  const milesBy = byPerson(miles.rows);
  const servingBy = byPerson(serving.rows);
  const groupsBy = byPerson(groups.rows);
  const notesBy = byPerson(notes.rows);
  const intentionsBy = byPerson(intentions.rows);

  const members = (people.rows as Record<string, never>[]).map((p): Member => {
    const c = (contactsBy.get(p.id) ?? []) as unknown as {
      kind: string; value: string; is_primary: boolean;
    }[];
    const d = (datesBy.get(p.id) ?? []) as unknown as {
      kind: string; date: string; label: string | null; relation: string | null;
    }[];
    const sv = (servingBy.get(p.id) ?? []) as unknown as {
      is_interest: boolean; ended_on: string | null; ministries: { name: string } | null;
    }[];
    const gm = (groupsBy.get(p.id) ?? []) as unknown as {
      left_on: string | null; groups: { name: string } | null;
    }[];
    const nt = (notesBy.get(p.id) ?? []) as unknown as {
      body: string; created_at: string;
    }[];
    const it = (intentionsBy.get(p.id) ?? []) as unknown as {
      body: string; created_at: string; status: string;
    }[];

    const pick = (kind: string) =>
      c.find((x) => x.kind === kind && x.is_primary)?.value ??
      c.find((x) => x.kind === kind)?.value;

    const anniversary = d.find((x) => x.kind === "anniversary");

    return {
      id: p.id,
      first: p.first_name,
      last: p.last_name,
      // Keep the real key alongside the label: grouping on the display name
      // would merge every unrelated household that happens to share a surname.
      householdId: p.household_id ?? undefined,
      household: householdName.get(p.household_id ?? "") ?? `${p.last_name} Family`,
      status: p.status,
      joined: p.member_since ?? p.first_visit_at ?? String(p.created_at).slice(0, 10),
      birthday: p.date_of_birth ?? undefined,
      email: pick("email"),
      phone: pick("mobile") ?? pick("home"),

      anniversary: anniversary
        ? { date: anniversary.date, spouse: anniversary.label ?? "" }
        : undefined,

      // Memorial dates are the sensitive ones. They arrive only if RLS says
      // this signed-in person may see them — pastors and admins.
      memorials: d
        .filter((x) => x.kind === "memorial")
        .map((x) => ({
          name: x.label ?? "",
          relation: x.relation ?? "family",
          date: x.date,
        })),

      milestones: ((milesBy.get(p.id) ?? []) as unknown as { label: string; date: string }[])
        .map((m) => ({ label: m.label, date: m.date }))
        .sort((a, b) => a.date.localeCompare(b.date)),

      // Currently serving only — interests are a follow-up, not a role.
      ministries: sv
        .filter((s) => !s.is_interest && !s.ended_on && s.ministries)
        .map((s) => s.ministries!.name),

      group: gm.find((g) => !g.left_on && g.groups)?.groups?.name,

      // The fields Magdala needs that a parish database never had. Without
      // these mapped, the drawer's "How they came" and tradition lines would
      // render blank against a real database while looking fine in the demo.
      tradition: p.tradition ?? undefined,
      church: p.church ?? undefined,
      city: p.city ?? undefined,
      country: p.country ?? undefined,
      languages: (p.languages as string[] | null) ?? undefined,
      origin: p.how_they_heard ?? undefined,

      intentions: it
        .filter((x) => x.status !== "closed")
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map((x) => ({ text: x.body, since: x.created_at.slice(0, 10) })),

      lastContact: String(p.updated_at ?? p.created_at).slice(0, 10),

      // Pastor-only by RLS; most recent first.
      notes: nt.length
        ? nt.sort((a, b) => b.created_at.localeCompare(a.created_at))[0].body
        : undefined,
    };
  });

  return { members };
}

/** Convenience wrapper for callers that don't distinguish empty from failed. */
export async function fetchMembers(): Promise<Member[]> {
  return (await fetchMembersResult()).members;
}
