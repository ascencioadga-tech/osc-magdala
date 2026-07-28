import type { Member, MemberStatus } from "./members";
import { FRIENDS } from "./demo-friends";

/*
  DEMO MODE — for showing the workspace before OSC has a Supabase project.

  ⚠️ Read this before touching it.

  This exists so the console can be *seen* without a database. It is a
  deliberate, loudly-marked side door, and it is built to fail closed:

    • It engages ONLY when no real Supabase project is configured. The
      moment NEXT_PUBLIC_SUPABASE_URL points at a real project, demo mode
      switches itself off — so it cannot survive into a real deployment by
      being forgotten. Set WORKSPACE_DEMO=0 to force it off sooner.
    • It carries no people. The directory opens empty, and there is no
      database behind it, so there is nothing real here to expose.
    • The credentials can be overridden by the environment; the fallback
      below exists so a demo deployment works without configuring anything.

  ⚠️ While this is on, the console is reachable by anyone with the address
  and the demo password. That is acceptable *only* because it is empty and
  database-less. Do not put a real person's details into a deployment
  running in this mode.

  When the real Supabase project exists: delete WORKSPACE_DEMO from
  .env.local and this whole path goes dark. Deleting this file entirely is
  better still.
*/

export const DEMO_COOKIE = "osc_demo_session";

/*
  Demo mode is the fallback, not the opt-in: if there is no real database,
  the console has nothing to protect and everything to demonstrate. An
  explicit WORKSPACE_DEMO=0 forces it off.
*/
export function isDemo(): boolean {
  if (process.env.WORKSPACE_DEMO === "0") return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const realProject = Boolean(url) && !url.includes("placeholder");
  return !realProject;
}

/** Overridable by the environment; the fallback lets a demo deploy work
 *  without configuring anything. */
export const DEMO_USER = process.env.WORKSPACE_DEMO_USER?.trim() || "Eamon";
export const DEMO_PASSWORD = process.env.WORKSPACE_DEMO_PASSWORD || "Magdala!";

export function verifyDemo(username: string, password: string): boolean {
  return (
    username.trim().toLowerCase() === DEMO_USER.toLowerCase() &&
    password === DEMO_PASSWORD
  );
}

export const DEMO_STAFF = {
  full_name: "Fr. Eamon Kelly, LC",
  role: "pastor" as const,
  email: "eamon@onestepcloser.org",
};

/* ------------------------------------------------------------------ people
   The roster lives in ./demo-friends. Everything below turns its relative
   offsets into real dates at read time, so the pastoral queue is populated
   whenever the demo is opened rather than decaying after a week.
*/

const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};
/** A date whose month/day is `n` days away, in a past year. */
const recurring = (n: number, yearsAgo: number) => {
  const d = daysFromNow(n);
  d.setFullYear(d.getFullYear() - yearsAgo);
  return iso(d);
};
const agoDays = (n: number) => iso(daysFromNow(-n));

export type Spec = {
  first: string;
  last: string;
  hh: string;
  status: MemberStatus;
  joinedAgo: number;
  bdayIn?: number;
  bdayAge?: number;
  annIn?: number;
  annYears?: number;
  spouse?: string;
  memorials?: { name: string; relation: string; in: number; yearsAgo: number }[];
  ministries?: string[];
  group?: string;
  milestones?: { label: string; agoDays: number }[];
  intentions?: { text: string; sinceAgo: number }[];
  tradition?: string;
  church?: string;
  city?: string;
  country?: string;
  languages?: string[];
  origin?: string;
  note?: string;
};

/** Country dial codes, so a Roman benefactor doesn't have a Carolina number. */
const DIAL: Record<string, string> = {
  Mexico: "+52", Spain: "+34", Ireland: "+353", Italy: "+39",
  "United States": "+1", Poland: "+48", Germany: "+49", Austria: "+43",
  France: "+33", Brazil: "+55", Philippines: "+63", Nigeria: "+234",
  Kenya: "+254", Lebanon: "+961", Israel: "+972", "South Korea": "+82",
  Canada: "+1", "United Kingdom": "+44", Australia: "+61", Portugal: "+351",
  Colombia: "+57", Chile: "+56", Argentina: "+54",
};

const HOUSEHOLD_NAME = new Map<string, string>();

/*
  The demo roster is OFF. The workspace opens empty.

  The hundred invented friends in ./demo-friends are kept — coherent households,
  key dates, memorials, intentions and pastoral notes — so they can be shown
  again by flipping this one line to `true`. Nothing else needs to change.
*/
const LOAD_DEMO_FRIENDS = false;

export function demoMembers(): Member[] {
  if (!LOAD_DEMO_FRIENDS) return [];

  return FRIENDS.map((s, i) => {
    if (!HOUSEHOLD_NAME.has(s.hh)) HOUSEHOLD_NAME.set(s.hh, `${s.last} Household`);
    return {
      id: `demo-${i + 1}`,
      first: s.first,
      last: s.last,
      householdId: s.hh,
      household: HOUSEHOLD_NAME.get(s.hh)!,
      status: s.status,
      joined: agoDays(s.joinedAgo),
      birthday: s.bdayIn !== undefined ? recurring(s.bdayIn, s.bdayAge ?? 40) : undefined,
      email: `${s.first.toLowerCase().replace(/[^a-z]/g, "")}.${s.last
        .toLowerCase()
        .replace(/[^a-z]/g, "")}@example.org`,
      // A handful deliberately have no phone, so "unreachable by text" is
      // something Fr. Eamon can actually see happening.
      phone: i % 9 === 4 ? undefined : `${DIAL[s.country ?? ""] ?? "+1"} ${String(700 + i)} ${String(1000 + i * 7).slice(-4)}`,
      anniversary:
        s.annIn !== undefined
          ? { date: recurring(s.annIn, s.annYears ?? 20), spouse: s.spouse ?? "" }
          : undefined,
      memorials: (s.memorials ?? []).map((m) => ({
        name: m.name,
        relation: m.relation,
        date: recurring(m.in, m.yearsAgo),
      })),
      milestones: (s.milestones ?? [])
        .map((m) => ({ label: m.label, date: agoDays(m.agoDays) }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      ministries: s.ministries ?? [],
      group: s.group,
      lastContact: agoDays((i * 13) % 90),
      notes: s.note,
      tradition: s.tradition,
      church: s.church,
      city: s.city,
      country: s.country,
      languages: s.languages,
      origin: s.origin,
      intentions: (s.intentions ?? []).map((x) => ({
        text: x.text,
        since: agoDays(x.sinceAgo),
      })),
    };
  });
}
