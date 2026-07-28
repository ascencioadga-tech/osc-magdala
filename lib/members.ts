// Member care data — the heart of the workspace.
//
// The shape only. Real records live in Supabase and arrive through
// lib/queries.ts, which reads them as the signed-in user so row-level
// security decides what comes back. Nothing in this file is invented data.

export type Memorial = { name: string; relation: string; date: string };
export type Milestone = { label: string; date: string };
/* A standing prayer intention. `since` is when it was entrusted to us —
   an intention nobody has revisited in a year is itself worth noticing. */
export type Intention = { text: string; since: string };
// Mirrors the person_status enum in 0001_schema.sql. Keep the two in step —
// a value here that the UI has no style for renders as an unlabelled chip.
export type MemberStatus = "member" | "regular" | "guest" | "inactive" | "moved";

export type Member = {
  id: string;
  first: string;
  last: string;
  /** The real household key. Group on this, never on the display name. */
  householdId?: string;
  household: string;
  status: MemberStatus;
  joined: string;
  birthday?: string;
  email?: string;
  phone?: string;
  anniversary?: { date: string; spouse: string };
  memorials: Memorial[];
  milestones: Milestone[];
  ministries: string[];
  group?: string;
  lastContact: string;
  notes?: string;

  /* ---- the fuller portrait ----
     A pilgrimage work is international and relational; a directory that
     knows only a phone number cannot help anyone pastor. */
  /** Their Christian tradition, and the community they belong to. The two
      fields the work at Magdala exists for. */
  tradition?: string;
  church?: string;
  city?: string;
  country?: string;
  /** So nobody is written to in a language they merely tolerate. */
  languages?: string[];
  /** How they first came to the work — the beginning of the relationship. */
  origin?: string;
  /** What they have asked us to carry. */
  intentions?: Intention[];
};

/*
  Deliberately empty, and kept only so older imports keep compiling.
  Every screen now receives real members as a prop from a server component.
  Do not reintroduce demo rows here: a screen that silently falls back to
  seed data looks like it works while showing nobody the truth.
*/
export const SEED_MEMBERS: Member[] = [];

/* ---------- date math ---------- */

export type CareEvent = {
  memberId: string;
  memberName: string;
  kind: "birthday" | "anniversary" | "memorial" | "milestone";
  title: string;
  sub: string;
  daysAway: number;
  years: number;
  when: Date;
};

function nextAnnual(iso: string, from: Date) {
  const [y, m, d] = iso.split("-").map(Number);
  const next = new Date(from.getFullYear(), m - 1, d);
  next.setHours(0, 0, 0, 0);
  const today = new Date(from);
  today.setHours(0, 0, 0, 0);
  if (next < today) next.setFullYear(next.getFullYear() + 1);
  const daysAway = Math.round((next.getTime() - today.getTime()) / 86400000);
  return { next, years: next.getFullYear() - y, daysAway };
}

export function whenLabel(daysAway: number): string {
  if (daysAway === 0) return "Today";
  if (daysAway === 1) return "Tomorrow";
  return `In ${daysAway} days`;
}

export function daysSince(iso: string, now: Date = new Date()): number {
  const [y, m, d] = iso.split("-").map(Number);
  const then = new Date(y, m - 1, d).getTime();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - then) / 86400000);
}

export function ageFrom(iso?: string, now: Date = new Date()): number | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  let age = now.getFullYear() - y;
  const had = now.getMonth() + 1 > m || (now.getMonth() + 1 === m && now.getDate() >= d);
  if (!had) age -= 1;
  return age;
}

export function upcomingMilestones(
  members: Member[],
  windowDays = 45,
  now: Date = new Date(),
): CareEvent[] {
  const out: CareEvent[] = [];
  for (const m of members) {
    const name = `${m.first} ${m.last}`;
    if (m.birthday) {
      const { next, years, daysAway } = nextAnnual(m.birthday, now);
      out.push({ memberId: m.id, memberName: name, kind: "birthday",
        title: `${name} turns ${years}`, sub: "Birthday", daysAway, years, when: next });
    }
    if (m.anniversary) {
      const { next, years, daysAway } = nextAnnual(m.anniversary.date, now);
      out.push({ memberId: m.id, memberName: name, kind: "anniversary",
        title: `${m.first} & ${m.anniversary.spouse.split(" ")[0]} — ${years} years married`,
        sub: "Wedding anniversary", daysAway, years, when: next });
    }
    for (const mem of m.memorials) {
      const { next, years, daysAway } = nextAnnual(mem.date, now);
      out.push({ memberId: m.id, memberName: name, kind: "memorial",
        title: `Remembering ${mem.name}`,
        sub: `${m.first}'s ${mem.relation} — ${years} ${years === 1 ? "year" : "years"}`,
        daysAway, years, when: next });
    }
  }
  return out.filter((e) => e.daysAway <= windowDays).sort((a, b) => a.daysAway - b.daysAway);
}

export function fmtDate(iso?: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

export function fmtShort(iso?: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
