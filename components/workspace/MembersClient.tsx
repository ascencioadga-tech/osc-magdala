"use client";

import { useMemo, useState } from "react";
import CrossPulse from "../CrossPulse";
import { motion, AnimatePresence } from "framer-motion";
import WorkspaceShell from "./WorkspaceShell";
import {
  upcomingMilestones, whenLabel, fmtDate, fmtShort,
  daysSince, ageFrom, type Member, type CareEvent,
} from "../../lib/members";

/*
  Members — Fr. Eamon's power tool.

  Not a contact list: a working view of the congregation. Segments answer the
  questions a pastor actually asks on a Monday — who's new, who's slipping,
  who's grieving, who isn't connected. The drawer assembles a person's whole
  life at One Step Closer into one timeline.

  Data comes from Supabase, fetched on the server and passed in as a prop —
  see lib/queries.ts. The shape is unchanged from the demo version, so the
  interface below didn't need rewriting when the database arrived.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

const KIND_STYLE: Record<string, string> = {
  birthday: "border-[#b19277]/50 text-[#a06a1a]",
  anniversary: "border-[#2a1c14]/20 text-[#2a1c14]/60",
  memorial: "border-[#2a1c14]/30 bg-[#2a1c14]/90 text-white",
  milestone: "border-[#2a1c14]/20 text-[#2a1c14]/60",
};

const STATUS_STYLE: Record<string, string> = {
  member: "bg-[#54132e] text-white",
  regular: "border border-[#2a1c14]/25 text-[#2a1c14]/70",
  guest: "border border-[#b19277]/60 bg-[#b19277]/12 text-[#8a5a14]",
  inactive: "border border-[#2a1c14]/12 text-[#2a1c14]/35",
  moved: "border border-[#2a1c14]/12 text-[#2a1c14]/35",
};
// Any status the design hasn't styled still has to render as something.
const statusStyle = (s: string) =>
  STATUS_STYLE[s] ?? "border border-[#2a1c14]/12 text-[#2a1c14]/35";

type SegKey = "all" | "new" | "grieving" | "serving" | "ungrouped" | "guests";

export default function MembersClient({ members }: { members: Member[] }) {
  const [query, setQuery] = useState("");
  const [seg, setSeg] = useState<SegKey>("all");
  const [sort, setSort] = useState<"name" | "upcoming" | "recent">("upcoming");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const upcoming = useMemo(() => upcomingMilestones(members, 45), [members]);

  const nextByMember = useMemo(() => {
    const map = new Map<string, CareEvent>();
    for (const e of upcoming) if (!map.has(e.memberId)) map.set(e.memberId, e);
    return map;
  }, [upcoming]);

  const grievingIds = useMemo(() => {
    const s = new Set<string>();
    for (const e of upcoming) if (e.kind === "memorial" && e.daysAway <= 30) s.add(e.memberId);
    return s;
  }, [upcoming]);

  const segments: { key: SegKey; label: string; count: number }[] = useMemo(() => {
    const isNew = (m: Member) => daysSince(m.joined) <= 120;
    return [
      { key: "all", label: "Everyone", count: members.length },
      { key: "new", label: "New", count: members.filter(isNew).length },
      { key: "grieving", label: "Grieving", count: members.filter((m) => grievingIds.has(m.id)).length },
      { key: "guests", label: "Guests", count: members.filter((m) => m.status === "guest").length },
      { key: "serving", label: "Serving", count: members.filter((m) => m.ministries.length > 0).length },
      { key: "ungrouped", label: "No group", count: members.filter((m) => !m.group).length },
    ];
  }, [members, grievingIds]);

  const list = useMemo(() => {
    let out = members.filter((m) =>
      `${m.first} ${m.last} ${m.household} ${m.group ?? ""} ${m.ministries.join(" ")}`
        .toLowerCase().includes(query.toLowerCase()),
    );
    if (seg === "new") out = out.filter((m) => daysSince(m.joined) <= 120);
    if (seg === "grieving") out = out.filter((m) => grievingIds.has(m.id));
    if (seg === "guests") out = out.filter((m) => m.status === "guest");
    if (seg === "serving") out = out.filter((m) => m.ministries.length > 0);
    if (seg === "ungrouped") out = out.filter((m) => !m.group);

    return [...out].sort((a, b) => {
      if (sort === "name") return `${a.last}${a.first}`.localeCompare(`${b.last}${b.first}`);
      if (sort === "recent") return b.joined.localeCompare(a.joined);
      const ea = nextByMember.get(a.id)?.daysAway ?? 999;
      const eb = nextByMember.get(b.id)?.daysAway ?? 999;
      return ea - eb;
    });
  }, [members, query, seg, sort, grievingIds, nextByMember]);

  const selected = members.find((m) => m.id === selectedId) ?? null;
  /*
    Group on householdId, never on the household *name*. Anyone without a
    household row falls back to "<Last> Family" for display, so matching on
    the label would fuse every unrelated family that shares a surname into
    one household — and show strangers as each other's relatives.
  */
  const household = selected
    ? members.filter(
        (m) =>
          m.id !== selected.id &&
          (selected.householdId
            ? m.householdId === selected.householdId
            : // No household on file: only trust an exact same-surname match
              // when neither side has a real household key.
              !m.householdId && m.household === selected.household),
      )
    : [];

  const thisWeek = upcoming.filter((e) => e.daysAway <= 7);

  return (
    <WorkspaceShell active="Friends" title="Friends">
      {/* Care band — the week at a glance */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-[6px] border border-[#2a1c14]/10 bg-white p-6">
          <div className="flex items-center gap-2.5">
            <CrossPulse size={12} className="text-[#b19277]" />
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-[#2a1c14]/45">
              This week
            </p>
          </div>
          <p className="mt-4 font-display text-[26px] font-light leading-tight text-[#2a1c14]">
            {thisWeek.length} {thisWeek.length === 1 ? "date" : "dates"} with your people
          </p>
          <div className="mt-5 space-y-2.5">
            {thisWeek.slice(0, 4).map((e, i) => (
              <button
                key={`${e.memberId}-${i}`}
                type="button"
                onClick={() => setSelectedId(e.memberId)}
                className="flex w-full items-center gap-3 text-left"
              >
                <span className="w-[74px] shrink-0 text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#2a1c14]/45">
                  {whenLabel(e.daysAway)}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13.5px] text-[#2a1c14]/80">
                  {e.title}
                </span>
                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[8.5px] font-medium uppercase tracking-[0.14em] ${KIND_STYLE[e.kind]}`}>
                  {e.kind === "memorial" ? "In Memory" : e.kind}
                </span>
              </button>
            ))}
            {thisWeek.length === 0 && (
              <p className="text-[13px] text-[#2a1c14]/45">A quiet week — good time to reach back.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { n: members.length, l: "People" },
            { n: new Set(members.map((m) => m.householdId ?? `name:${m.household}`)).size, l: "Households" },
            { n: upcoming.filter((e) => e.kind === "memorial" && e.daysAway <= 30).length, l: "Memorial dates · 30d" },
            { n: members.filter((m) => m.ministries.length > 0).length, l: "Serving" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.05 + i * 0.06 }}
              className="rounded-[6px] border border-[#2a1c14]/10 bg-white px-5 py-4"
            >
              <p className="font-display text-[28px] font-light leading-none text-[#2a1c14]">{s.n}</p>
              <p className="mt-2 text-[9.5px] font-medium uppercase tracking-[0.16em] text-[#2a1c14]/45">{s.l}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Segments */}
      <div className="mt-10 flex flex-wrap items-center gap-2">
        {segments.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSeg(s.key)}
            className={`rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
              seg === s.key
                ? "bg-[#54132e] text-white"
                : "border border-[#2a1c14]/12 text-[#2a1c14]/55 hover:border-[#2a1c14]/35 hover:text-[#2a1c14]"
            }`}
          >
            {s.label}
            <span className={seg === s.key ? "ml-2 text-white/55" : "ml-2 text-[#2a1c14]/35"}>
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + sort */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <label className="relative block w-full max-w-[340px]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
            className="absolute left-0 top-1/2 -translate-y-1/2 text-[#2a1c14]/35">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, household, group, ministry…"
            className="w-full border-b border-[#2a1c14]/20 bg-transparent pb-2.5 pl-7 text-[15px] text-[#2a1c14] outline-none transition-colors placeholder:text-[#2a1c14]/35 focus:border-[#54132e]"
          />
        </label>

        <div className="flex items-center gap-1">
          {([["upcoming","Upcoming"],["recent","Newest"],["name","A–Z"]] as const).map(([k,l]) => (
            <button
              key={k} type="button" onClick={() => setSort(k)}
              className={`rounded-full px-3.5 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                sort === k ? "bg-[#2a1c14]/8 text-[#2a1c14]" : "text-[#2a1c14]/40 hover:text-[#2a1c14]/75"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#2a1c14]/40">
          {list.length} {list.length === 1 ? "person" : "people"}
        </p>
        {/* The welcome form is public and lives outside the console — this is
            the link you open on a tablet and hand to someone. */}
        <a
          href="/welcome"
          target="_blank"
          rel="noopener"
          className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#54132e]/70 underline-offset-4 transition-colors hover:text-[#54132e] hover:underline"
        >
          Welcome someone →
        </a>
      </div>

      {/* Directory */}
      <div className="mt-3 overflow-hidden rounded-[6px] border border-[#2a1c14]/10 bg-white">
        {list.map((m, i) => {
          const next = nextByMember.get(m.id);
          const age = ageFrom(m.birthday);
          return (
            <motion.button
              key={m.id} type="button" onClick={() => setSelectedId(m.id)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: Math.min(i, 14) * 0.02 }}
              className={`flex w-full items-center gap-4 border-b border-[#2a1c14]/8 px-5 py-3.5 text-left transition-colors duration-200 last:border-b-0 hover:bg-[#2a1c14]/4 ${
                selectedId === m.id ? "bg-[#2a1c14]/5" : ""
              }`}
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2a1c14]/88 text-[10.5px] font-medium text-white">
                {m.first[0]}{m.last[0]}
                {grievingIds.has(m.id) && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#54132e]" />
                )}
              </span>

              <span className="min-w-0 flex-[1.4]">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[14.5px] text-[#2a1c14]">{m.first} {m.last}</span>
                  {age !== null && age < 18 && (
                    <span className="shrink-0 text-[10px] text-[#2a1c14]/35">{age}</span>
                  )}
                </span>
                <span className="block truncate text-[11.5px] text-[#2a1c14]/45">{m.household}</span>
              </span>

              <span className="hidden min-w-0 flex-1 sm:block">
                <span className="block truncate text-[12px] text-[#2a1c14]/55">
                  {m.ministries.length ? m.ministries.join(" · ") : <span className="text-[#2a1c14]/25">Not serving</span>}
                </span>
                <span className="block truncate text-[11px] text-[#2a1c14]/35">
                  {m.group ?? "No group"}
                </span>
              </span>

              <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[8.5px] font-medium uppercase tracking-[0.14em] md:block ${statusStyle(m.status)}`}>
                {m.status}
              </span>

              <span className="w-[112px] shrink-0 text-right">
                {next ? (
                  <span className={`inline-block rounded-full border px-2.5 py-1 text-[8.5px] font-medium uppercase tracking-[0.12em] ${KIND_STYLE[next.kind]}`}>
                    {next.kind === "memorial" ? "In memory" : next.kind} · {next.daysAway}d
                  </span>
                ) : (
                  <span className="text-[10.5px] text-[#2a1c14]/20">—</span>
                )}
              </span>
            </motion.button>
          );
        })}
        {list.length === 0 && (
          <p className="px-5 py-10 text-center text-[13px] text-[#2a1c14]/45">
            Nobody here yet.
          </p>
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }} onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-40 bg-black/25"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="fixed inset-y-0 right-0 z-50 w-[480px] max-w-full overflow-y-auto bg-white px-8 py-8 shadow-[-24px_0_60px_-30px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[8.5px] font-medium uppercase tracking-[0.16em] ${STATUS_STYLE[selected.status]}`}>
                    {selected.status}
                  </span>
                  <h2 className="mt-3 font-display text-[30px] font-light leading-tight text-[#2a1c14]">
                    {selected.first} {selected.last}
                  </h2>
                  <p className="mt-1 text-[12.5px] text-[#2a1c14]/50">
                    {selected.household}
                    {ageFrom(selected.birthday) !== null && ` · ${ageFrom(selected.birthday)} years old`}
                    {` · with One Step Closer since ${fmtShort(selected.joined)}`}
                  </p>
                </div>
                <button type="button" onClick={() => setSelectedId(null)} aria-label="Close"
                  className="-m-2 shrink-0 p-2 text-[#2a1c14]/40 transition-colors hover:text-[#2a1c14]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Quick actions */}
              <div className="mt-6 flex flex-wrap gap-2">
                {selected.phone && (
                  <a href={`tel:${selected.phone.replace(/-/g, "")}`} className="rounded-full bg-[#54132e] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3f0e22]">Call</a>
                )}
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="rounded-full border border-[#2a1c14]/20 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#2a1c14]/70 transition-colors hover:border-[#2a1c14]/50 hover:text-[#2a1c14]">Email</a>
                )}
                {selected.phone && (
                  <a href={`sms:${selected.phone.replace(/-/g, "")}`} className="rounded-full border border-[#2a1c14]/20 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#2a1c14]/70 transition-colors hover:border-[#2a1c14]/50 hover:text-[#2a1c14]">Text</a>
                )}
              </div>

              {(selected.tradition || selected.church) && (
                <Section label="Where they pray">
                  {selected.tradition && <Row k="Tradition" v={selected.tradition} />}
                  {selected.church && <Row k="Community" v={selected.church} />}
                </Section>
              )}

              <Section label="Contact">
                <Row k="Email" v={selected.email ?? "—"} />
                <Row k="Phone" v={selected.phone ?? "—"} />
                {(selected.city || selected.country) && (
                  <Row k="Home" v={[selected.city, selected.country].filter(Boolean).join(", ")} />
                )}
                {selected.languages?.length ? (
                  <Row k="Speaks" v={selected.languages.join(", ")} />
                ) : null}
              </Section>

              {selected.origin && (
                <Section label="How they came">
                  <p className="text-[13.5px] leading-relaxed text-[#2a1c14]/75">
                    {selected.origin}
                  </p>
                </Section>
              )}

              <Section label="Involvement">
                <Row k="Serving" v={selected.ministries.length ? selected.ministries.join(", ") : "Not serving"} />
                <Row k="Small group" v={selected.group ?? "Not in a group"} />
              </Section>

              <Section label="Key dates">
                <Row k="Birthday" v={fmtDate(selected.birthday)} />
                {selected.anniversary && (
                  <Row k="Married" v={`${fmtDate(selected.anniversary.date)} · ${selected.anniversary.spouse}`} />
                )}
              </Section>

              {selected.intentions && selected.intentions.length > 0 && (
                <Section label="What they have asked us to carry">
                  <ul className="space-y-2.5">
                    {selected.intentions.map((it) => (
                      <li
                        key={it.text + it.since}
                        className="rounded-[4px] border-l-2 border-[#b19277] bg-[#efe6d3]/45 px-3.5 py-2.5"
                      >
                        <p className="text-[13.5px] leading-snug text-[#2a1c14]/85">{it.text}</p>
                        <p className="mt-1 text-[11px] text-[#2a1c14]/40">
                          Entrusted to us {fmtDate(it.since)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {selected.memorials.length > 0 && (
                <Section label="In memory">
                  {selected.memorials.map((mem) => (
                    <div key={mem.name + mem.date} className="rounded-[4px] bg-[#54132e] px-4 py-3.5">
                      <p className="text-[14px] text-white">{mem.name}</p>
                      <p className="mt-0.5 text-[12px] text-white/55">
                        {selected.first}&apos;s {mem.relation} · passed {fmtDate(mem.date)}
                      </p>
                    </div>
                  ))}
                </Section>
              )}

              {selected.milestones.length > 0 && (
                <Section label={`Their story at One Step Closer — ${selected.milestones.length} milestones`}>
                  <ol className="relative space-y-4 pl-5">
                    <span className="absolute left-[3px] bottom-1.5 top-1.5 w-px bg-[#2a1c14]/12" />
                    {selected.milestones.map((ms) => (
                      <li key={ms.label + ms.date} className="relative">
                        <span className="absolute -left-5 top-1.5 h-[7px] w-[7px] rounded-full border border-[#2a1c14]/40 bg-white" />
                        <p className="text-[13.5px] text-[#2a1c14]">{ms.label}</p>
                        <p className="text-[11.5px] text-[#2a1c14]/40">{fmtDate(ms.date)}</p>
                      </li>
                    ))}
                  </ol>
                </Section>
              )}

              {household.length > 0 && (
                <Section label="Household">
                  {household.map((h) => (
                    <button key={h.id} type="button" onClick={() => setSelectedId(h.id)}
                      className="flex w-full items-center gap-3 text-left transition-opacity hover:opacity-70">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2a1c14]/85 text-[9.5px] font-medium text-white">
                        {h.first[0]}{h.last[0]}
                      </span>
                      <span className="text-[13.5px] text-[#2a1c14]/80">{h.first} {h.last}</span>
                      <span className="ml-auto text-[11px] text-[#2a1c14]/35">
                        {ageFrom(h.birthday) !== null ? `${ageFrom(h.birthday)}` : ""}
                      </span>
                    </button>
                  ))}
                </Section>
              )}

              {selected.notes && (
                <Section label="Pastoral notes">
                  <p className="text-[13.5px] leading-relaxed text-[#2a1c14]/70">{selected.notes}</p>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#2a1c14]/35">
                    Visible to pastors only
                  </p>
                </Section>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </WorkspaceShell>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-7 border-t border-[#2a1c14]/10 pt-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#2a1c14]/40">{label}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-[#2a1c14]/40">{k}</span>
      <span className="text-right text-[13.5px] text-[#2a1c14]/80">{v}</span>
    </div>
  );
}
