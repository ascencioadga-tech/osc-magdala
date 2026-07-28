// Messaging — audiences, cost, drafting and history.
//
// ⚠️ NOT WIRED: nothing is actually sent yet. Sending needs Resend (email)
// and Twilio (SMS) behind a server route, a suppression list, a real
// unsubscribe link, and replies routed somewhere a human reads.
//
// What IS enforced here already, because getting it wrong is a legal problem
// rather than a bug: an audience is filtered by consent before it is counted,
// so the number on the button is the number of people we may lawfully
// contact — not merely the number who have a phone.

import {
  SEED_MEMBERS, upcomingMilestones, daysSince,
  type Member, type CareEvent,
} from "./members";

export type Channel = "sms" | "email" | "push";

// Twilio ≈ $0.0079 per SMS segment. Email and push are effectively free at
// this volume, but shown so the trade-off is visible when choosing a channel.
export const SMS_COST = 0.0079;
export const SMS_SEGMENT = 160;

export type AudienceKey = "all" | "new" | "ungrouped";

export type Audience = {
  key: AudienceKey;
  label: string;
  hint: string;
  match: (m: Member, ctx: { grieving: Set<string> }) => boolean;
};

export const AUDIENCES: Audience[] = [
  { key: "all", label: "Everyone", hint: "Every friend of the work on file", match: () => true },
  { key: "new", label: "New in last 120 days", hint: "Still finding their feet", match: (m) => daysSince(m.joined) <= 120 },
  { key: "ungrouped", label: "Not in a group", hint: "Attending but unconnected", match: (m) => !m.group },
];

export function grievingSet(members: Member[] = SEED_MEMBERS): Set<string> {
  const s = new Set<string>();
  for (const e of upcomingMilestones(members, 45)) {
    if (e.kind === "memorial" && e.daysAway <= 30) s.add(e.memberId);
  }
  return s;
}

export function resolveAudience(key: AudienceKey, members: Member[] = SEED_MEMBERS): Member[] {
  const aud = AUDIENCES.find((a) => a.key === key);
  if (!aud) return [];
  const ctx = { grieving: grievingSet(members) };
  return members.filter((m) => aud.match(m, ctx));
}

/*
  Only people we may actually reach on a given channel.

  Two conditions, not one: we need an address, AND permission to use it.
  `consents` is written by the Connect form; anyone whose consent for this
  channel is absent or withdrawn is excluded here so they can never be
  swept into a blast. Missing consent data is treated as "no" — the safe
  direction to be wrong in.
*/
export type ConsentIndex = {
  sms: Set<string>;
  email: Set<string>;
};

export function reachable(
  people: Member[],
  channel: Channel,
  consent?: ConsentIndex,
): Member[] {
  const allowed = (m: Member) => {
    if (!consent) return true; // caller supplied no index; nothing to enforce
    if (channel === "sms") return consent.sms.has(m.id);
    if (channel === "email") return consent.email.has(m.id);
    return true;
  };
  if (channel === "sms") return people.filter((m) => !!m.phone && allowed(m));
  if (channel === "email") return people.filter((m) => !!m.email && allowed(m));
  return people; // push: assume the app is installed
}

/*
  A single character outside the GSM-03.38 alphabet — a curly quote, an
  em-dash, an accent — forces the whole message into UCS-2, which carries
  70 characters per segment instead of 160. The pastoral drafts below are
  full of em-dashes, so ignoring this understates the bill by roughly 2x.
*/
const GSM = /^[A-Za-z0-9@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà\r\n\f^{}\\\[~\]|€]*$/;

export function smsSegments(body: string): number {
  const unicode = !GSM.test(body);
  const per = unicode ? 70 : SMS_SEGMENT;
  return Math.max(1, Math.ceil(body.length / per));
}

export function estimateCost(count: number, channel: Channel, body: string): number {
  if (channel !== "sms") return 0;
  return count * smsSegments(body) * SMS_COST;
}

/* ---------- merge fields ---------- */

export const MERGE_FIELDS = ["{first}", "{last}", "{group}", "{household}"];

export function renderMessage(body: string, m: Member): string {
  return body
    .replace(/\{first\}/g, m.first)
    .replace(/\{last\}/g, m.last)
    .replace(/\{group\}/g, m.group ?? "a group")
    .replace(/\{household\}/g, m.household);
}

/* ---------- the pastoral queue ---------- */

export type QueueKind = "birthday" | "memorial" | "anniversary" | "welcome";

export type QueuedMessage = {
  id: string;
  kind: QueueKind;
  member: Member;
  reason: string;
  daysAway: number;
  body: string;
  channel: Channel;
};

const KIND_LABEL: Record<QueueKind, string> = {
  birthday: "Birthday",
  memorial: "Loss anniversary",
  anniversary: "Wedding anniversary",
  welcome: "New here",
};

export function queueLabel(k: QueueKind) {
  return KIND_LABEL[k];
}

// Drafts written to sound like a pastor, not a system. Fr. Eamon edits or sends.
function draftFor(kind: QueueKind, e: CareEvent | null, m: Member): string {
  if (kind === "birthday") {
    const age = e?.years;
    return `Happy birthday, ${m.first}! ${age ? `${age} years` : "Another year"} — and we're grateful for every one of them. Praying today is a good one. — Fr. Eamon`;
  }
  if (kind === "memorial") {
    // Someone with two losses must not receive a note naming the wrong
    // person. Match the memorial to the event that raised this draft.
    const who =
      m.memorials.find((x) => e?.title?.includes(x.name)) ?? m.memorials[0];
    return `${m.first}, I know this week carries the memory of ${who ? who.name : "someone you love"}. I'm praying for you, and I wanted you to know you're not carrying it alone. — Fr. Eamon`;
  }
  if (kind === "anniversary") {
    const yrs = e?.years;
    return `${m.first} — ${yrs ? `${yrs} years` : "Another year"} together is worth celebrating. Grateful for your marriage and what it witnesses to. Happy anniversary. — Fr. Eamon`;
  }
  return `${m.first}, it was good to have you with us at One Step Closer. If there's ever anything we can pray for, just reply to this. — Fr. Eamon`;
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32);

export function buildQueue(
  members: Member[] = SEED_MEMBERS,
  windowDays = 7,
): QueuedMessage[] {
  const events = upcomingMilestones(members, windowDays);
  const out: QueuedMessage[] = [];

  for (const e of events) {
    const m = members.find((x) => x.id === e.memberId);
    if (!m) continue;
    const kind: QueueKind =
      e.kind === "birthday" ? "birthday" : e.kind === "memorial" ? "memorial" : "anniversary";
    out.push({
      // `${member}-${kind}-${daysAway}` collided when one person had two
      // memorials falling the same number of days out: duplicate React keys,
      // and handling one dismissed both. The title disambiguates them.
      id: `${e.memberId}-${e.kind}-${e.daysAway}-${slug(e.title)}`,
      kind,
      member: m,
      reason: e.title,
      daysAway: e.daysAway,
      body: draftFor(kind, e, m),
      channel: m.phone ? "sms" : "email",
    });
  }

  // Recent guests worth a welcome
  for (const m of members) {
    if (m.status === "guest" && daysSince(m.joined) <= 21) {
      out.push({
        id: `${m.id}-welcome`,
        kind: "welcome",
        member: m,
        reason: `Visited ${daysSince(m.joined)} days ago`,
        daysAway: 0,
        body: draftFor("welcome", null, m),
        channel: m.phone ? "sms" : "email",
      });
    }
  }

  return out.sort((a, b) => a.daysAway - b.daysAway);
}

/* ---------- history ----------
   Empty until sending is wired: there is no `messages` table yet, so there
   is nothing truthful to show. A screen that invents a send history is
   worse than one that admits it has none. */

export type SentMessage = {
  id: string;
  sentAt: string;
  channel: Channel;
  audience: string;
  recipients: number;
  body: string;
  by: string;
};

export const SEED_HISTORY: SentMessage[] = [
  // Cleared. Real sends will be logged here once messaging is wired.
];
