"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WorkspaceShell from "../workspace/WorkspaceShell";
import EmailComposer from "../workspace/EmailComposer";
import { fmtDate, type Member } from "../../lib/members";
import {
  AUDIENCES, SEED_HISTORY, buildQueue, estimateCost, queueLabel,
  reachable, renderMessage, resolveAudience,
  type AudienceKey, type Channel, type QueuedMessage, type SentMessage,
} from "../../lib/messaging";

/*
  Messages — the command center.

  One place for both ends of the range: a birthday note that sounds like Fr. Eamon
  wrote it, and word that reaches everyone at once.

  Compose  — pick an audience, write, see who it reaches and what it costs.
  Queue    — pastoral messages drafted for today, one tap each. Drafted, never
             auto-sent: an automated note the pastor never read isn't care.
  History  — what went out, to whom.

  ⚠️ DEMO: nothing sends. See lib/messaging.ts.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const CONFIRM_OVER = 50; // messages to more than this many people need a confirm

const CHANNELS: { key: Channel; label: string; note: string }[] = [
  { key: "sms", label: "Text", note: "Highest open rate · costs money" },
  { key: "email", label: "Email", note: "Free · good for detail" },
  { key: "push", label: "App push", note: "Free · app users only" },
];

type Tab = "compose" | "queue" | "history";

export default function MessagesClient({ members }: { members: Member[] }) {
  const [tab, setTab] = useState<Tab>("compose");
  const queue = useMemo(() => buildQueue(members, 7), [members]);
  const [handled, setHandled] = useState<Set<string>>(new Set());

  const pending = queue.filter((q) => !handled.has(q.id));

  return (
    <WorkspaceShell active="Messages" title="Messages">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {([
          ["compose", "Compose"],
          ["queue", `Queue${pending.length ? ` · ${pending.length}` : ""}`],
          ["history", "History"],
        ] as const).map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k as Tab)}
            className={`rounded-full px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
              tab === k
                ? "bg-[#54132e] text-white"
                : "border border-[#2a1c14]/12 text-[#2a1c14]/55 hover:border-[#2a1c14]/35 hover:text-[#2a1c14]"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "compose" && <Compose members={members} />}
        {tab === "queue" && (
          <Queue queue={queue} handled={handled} onHandle={(id) => setHandled(new Set([...handled, id]))} />
        )}
        {tab === "history" && <History items={SEED_HISTORY} />}
      </div>
    </WorkspaceShell>
  );
}

/* ============================== COMPOSE ============================== */

function Compose({ members }: { members: Member[] }) {
  // Two ways to pick: a saved segment, or hand-picked people.
  const [mode, setMode] = useState<"segment" | "people">("segment");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [pickQuery, setPickQuery] = useState("");
  const [audience, setAudience] = useState<AudienceKey>("all");
  const [channel, setChannel] = useState<Channel>("sms");
  const [body, setBody] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sent, setSent] = useState<{ n: number } | null>(null);
  const [designing, setDesigning] = useState(false);

  const people = useMemo(
    () =>
      mode === "people"
        ? members.filter((m) => picked.has(m.id))
        : resolveAudience(audience, members),
    [mode, picked, audience],
  );

  const pickList = useMemo(() => {
    const q = pickQuery.trim().toLowerCase();
    const base = q
      ? members.filter((m) =>
          `${m.first} ${m.last} ${m.household}`.toLowerCase().includes(q),
        )
      : members;
    return base.slice(0, 60);
  }, [pickQuery]);

  // Functional update — reading `picked` directly drops selections when
  // several are toggled before React re-renders.
  const togglePick = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const canReach = useMemo(() => reachable(people, channel), [people, channel]);
  const missing = people.length - canReach.length;
  const cost = estimateCost(canReach.length, channel, body);
  const segments = Math.max(1, Math.ceil(body.length / 160));
  const sample: Member | undefined = canReach[0];

  const audienceLabel =
    mode === "people"
      ? people.length === 1
        ? `${people[0].first} ${people[0].last}`
        : `${people.length} hand-picked`
      : AUDIENCES.find((a) => a.key === audience)?.label ?? "";

  if (designing) {
    return <EmailComposer onBack={() => setDesigning(false)} recipients={canReach.length} />;
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="rounded-[6px] border border-[#2a1c14]/10 bg-white p-10 text-center"
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-[#2a1c14]/45">Sent</p>
        <p className="mt-4 font-display text-[28px] font-light text-[#2a1c14]">
          Delivered to {sent.n} {sent.n === 1 ? "person" : "people"}.
        </p>
        <button
          type="button"
          onClick={() => { setSent(null); setBody(""); }}
          className="mt-7 rounded-full bg-[#54132e] px-7 py-3 text-[10.5px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#3f0e22]"
        >
          Write another
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* Left: audience + composer */}
      <div className="min-w-0 space-y-6">
        <div className="rounded-[6px] border border-[#2a1c14]/10 bg-white py-7">
          <p className="px-8 text-[10px] font-medium uppercase tracking-[0.24em] text-[#2a1c14]/45">
            Who is this for?
          </p>

          {/* One scrolling row — bleeds to the panel edge so it reads as more */}
          <div className="relative mt-6">
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
            <div className="ws-track flex gap-3 overflow-x-auto px-8 py-1">
              {AUDIENCES.map((a) => {
                const n = resolveAudience(a.key, members).length;
                const on = audience === a.key;
                return (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => { setAudience(a.key); setMode("segment"); }}
                    title={a.hint}
                    className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.13em] transition-colors duration-300 ${
                      on
                        ? "bg-[#54132e] text-white"
                        : "border border-[#2a1c14]/12 text-[#2a1c14]/55 hover:border-[#2a1c14]/35 hover:text-[#2a1c14]"
                    }`}
                  >
                    {a.label}
                    <span className={on ? "ml-2 text-white/55" : "ml-2 text-[#2a1c14]/35"}>{n}</span>
                  </button>
                );
              })}

              {/* Hand-pick one person or several */}
              <button
                type="button"
                onClick={() => setMode("people")}
                title="Search and choose individuals"
                className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.13em] transition-colors duration-300 ${
                  mode === "people"
                    ? "bg-[#54132e] text-white"
                    : "border border-dashed border-[#2a1c14]/25 text-[#2a1c14]/55 hover:border-[#2a1c14]/50 hover:text-[#2a1c14]"
                }`}
              >
                Specific people
                <span className={mode === "people" ? "ml-2 text-white/55" : "ml-2 text-[#2a1c14]/35"}>
                  {picked.size}
                </span>
              </button>
            </div>
          </div>

          <p className="mt-6 px-8 text-[12.5px] text-[#2a1c14]/45">
            {mode === "people"
              ? picked.size === 0
                ? "Search below and choose who this goes to"
                : `${picked.size} ${picked.size === 1 ? "person" : "people"} selected`
              : AUDIENCES.find((a) => a.key === audience)?.hint}
          </p>
        </div>

        {/* Person picker — only when hand-picking */}
        <AnimatePresence>
          {mode === "people" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="rounded-[6px] border border-[#2a1c14]/10 bg-white p-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#2a1c14]/45">
                    Choose people
                  </p>
                  {picked.size > 0 && (
                    <button
                      type="button"
                      onClick={() => setPicked(new Set())}
                      className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#2a1c14]/40 transition-colors hover:text-[#2a1c14]"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Selected tokens */}
                {picked.size > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {members.filter((m) => picked.has(m.id)).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => togglePick(m.id)}
                        className="group flex items-center gap-2 rounded-full bg-[#54132e] py-1.5 pl-3 pr-2.5 text-[12px] text-white transition-colors hover:bg-[#3f0e22]"
                      >
                        {m.first} {m.last}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="opacity-50 group-hover:opacity-100">
                          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}

                {/* Search */}
                <label className="relative mt-6 block">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-[#2a1c14]/35">
                    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
                  </svg>
                  <input
                    value={pickQuery}
                    onChange={(e) => setPickQuery(e.target.value)}
                    placeholder="Search by name or household…"
                    className="w-full border-b border-[#2a1c14]/20 bg-transparent pb-2.5 pl-7 text-[14px] text-[#2a1c14] outline-none transition-colors placeholder:text-[#2a1c14]/35 focus:border-[#54132e]"
                  />
                </label>

                {/* Results */}
                <div className="mt-4 max-h-[280px] overflow-y-auto">
                  {pickList.map((m) => {
                    const on = picked.has(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => togglePick(m.id)}
                        className="flex w-full items-center gap-3 border-b border-[#2a1c14]/6 py-2.5 text-left transition-colors last:border-b-0 hover:bg-[#2a1c14]/4"
                      >
                        <span
                          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                            on ? "border-[#54132e] bg-[#54132e]" : "border-[#2a1c14]/25"
                          }`}
                        >
                          {on && (
                            <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6.5 4.5 9 10 3" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2a1c14]/85 text-[9.5px] font-medium text-white">
                          {m.first[0]}{m.last[0]}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] text-[#2a1c14]">
                            {m.first} {m.last}
                          </span>
                          <span className="block truncate text-[11px] text-[#2a1c14]/45">
                            {m.household}
                          </span>
                        </span>
                        <span className="shrink-0 text-[10.5px] text-[#2a1c14]/30">
                          {m.phone ? "text" : m.email ? "email" : "no contact"}
                        </span>
                      </button>
                    );
                  })}
                  {pickList.length === 0 && (
                    <p className="py-6 text-center text-[13px] text-[#2a1c14]/45">
                      Nobody matches that.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Panel label="How should it reach them?">
          <div className="grid gap-2 sm:grid-cols-3">
            {CHANNELS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setChannel(c.key)}
                className={`rounded-[4px] border px-4 py-3 text-left transition-colors duration-300 ${
                  channel === c.key
                    ? "border-[#54132e] bg-[#54132e] text-white"
                    : "border-[#2a1c14]/12 text-[#2a1c14]/70 hover:border-[#2a1c14]/35"
                }`}
              >
                <span className="block text-[12.5px] font-medium">{c.label}</span>
                <span className={`mt-0.5 block text-[10.5px] ${channel === c.key ? "text-white/55" : "text-[#2a1c14]/40"}`}>
                  {c.note}
                </span>
              </button>
            ))}
          </div>
        </Panel>

        {channel === "email" ? (
          <Panel label="Message">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="max-w-sm">
                <p className="text-[14px] leading-relaxed text-[#2a1c14]/65">
                  Email gets the full designer — branded blocks, live sermon and
                  event content, and a preview of exactly what arrives.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDesigning(true)}
                className="shrink-0 rounded-full bg-[#54132e] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-500 hover:bg-[#3f0e22]"
              >
                Design this email
              </button>
            </div>
          </Panel>
        ) : (
        <Panel label="Message">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Write it the way you'd say it…"
            className="w-full resize-none border-b border-[#2a1c14]/20 bg-transparent pb-3 text-[15px] leading-relaxed text-[#2a1c14] outline-none transition-colors placeholder:text-[#2a1c14]/30 focus:border-[#54132e]"
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#2a1c14]/35">Insert</span>
            {["{first}", "{last}", "{group}"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setBody((b) => b + f)}
                className="rounded-full border border-[#2a1c14]/15 px-3 py-1 text-[11px] text-[#2a1c14]/60 transition-colors hover:border-[#2a1c14]/40 hover:text-[#2a1c14]"
              >
                {f}
              </button>
            ))}
            {channel === "sms" && (
              <span className="ml-auto text-[11px] text-[#2a1c14]/40">
                {body.length} chars · {segments} {segments === 1 ? "segment" : "segments"}
              </span>
            )}
          </div>
        </Panel>
        )}
      </div>

      {/* Right: the reckoning */}
      <div className="space-y-4">
        <div className="rounded-[6px] border border-[#2a1c14]/10 bg-white p-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#2a1c14]/45">
            This will reach
          </p>
          <p className="mt-3 font-display text-[46px] font-light leading-none text-[#2a1c14]">
            {canReach.length}
          </p>
          <p className="mt-2 text-[12.5px] text-[#2a1c14]/50">{audienceLabel}</p>

          {missing > 0 && (
            <p className="mt-4 rounded-[4px] border border-[#b19277]/40 bg-[#b19277]/10 px-3.5 py-2.5 text-[11.5px] leading-snug text-[#8a5a14]">
              {missing} {missing === 1 ? "person has" : "people have"} no{" "}
              {channel === "sms" ? "phone number" : "email address"} on file and won&apos;t
              receive this.
            </p>
          )}

          <div className="mt-5 space-y-2 border-t border-[#2a1c14]/10 pt-4">
            <Line k="Channel" v={CHANNELS.find((c) => c.key === channel)!.label} />
            <Line k="Estimated cost" v={cost > 0 ? `$${cost.toFixed(2)}` : "Free"} />
          </div>
        </div>

        {/* Preview as one real person receives it */}
        {sample && (
          <div className="rounded-[6px] border border-[#2a1c14]/10 bg-white p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#2a1c14]/45">
              As {sample.first} receives it
            </p>
            <div className="mt-4 rounded-[10px] rounded-bl-[3px] bg-[#54132e] px-4 py-3">
              <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-white">
                {body.trim() ? renderMessage(body, sample) : "…"}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          disabled={!body.trim() || canReach.length === 0}
          onClick={() => (canReach.length > CONFIRM_OVER ? setConfirming(true) : setSent({ n: canReach.length }))}
          className="w-full rounded-full bg-[#54132e] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors duration-500 hover:bg-[#3f0e22] disabled:opacity-30"
        >
          Send to {canReach.length}
        </button>
        <p className="text-center text-[10.5px] text-[#2a1c14]/35">
          A sent message can&apos;t be recalled.
        </p>
      </div>

      {/* Confirm — you cannot unsend a text to 700 people */}
      <AnimatePresence>
        {confirming && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/35" onClick={() => setConfirming(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="fixed left-1/2 top-1/2 z-50 w-[420px] max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-[6px] bg-white p-7 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.5)]"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#2a1c14]/45">
                Confirm
              </p>
              <p className="mt-4 font-display text-[24px] font-light leading-snug text-[#2a1c14]">
                Send to {canReach.length} people?
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-[#2a1c14]/55">
                {audienceLabel} · {CHANNELS.find((c) => c.key === channel)!.label}
                {cost > 0 && ` · about $${cost.toFixed(2)}`}. This can&apos;t be undone.
              </p>
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setConfirming(false); setSent({ n: canReach.length }); }}
                  className="flex-1 rounded-full bg-[#54132e] px-6 py-3.5 text-[10.5px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#3f0e22]"
                >
                  Yes, send it
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-full border border-[#2a1c14]/15 px-6 py-3.5 text-[10.5px] font-medium uppercase tracking-[0.18em] text-[#2a1c14]/60 transition-colors hover:border-[#2a1c14]/40 hover:text-[#2a1c14]"
                >
                  Wait
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =============================== QUEUE =============================== */

function Queue({
  queue, handled, onHandle,
}: {
  queue: QueuedMessage[];
  handled: Set<string>;
  onHandle: (id: string) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const pending = queue.filter((q) => !handled.has(q.id));

  return (
    <div>
      <div className="rounded-[6px] border border-[#2a1c14]/10 bg-white p-6">
        <p className="font-display text-[24px] font-light leading-snug text-[#2a1c14]">
          {pending.length > 0
            ? `${pending.length} ${pending.length === 1 ? "message" : "messages"} ready for you.`
            : "All caught up."}
        </p>
        <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-[#2a1c14]/55">
          Written for you from what&apos;s happening in your people&apos;s lives — but nothing
          goes out until you send it. Edit anything that doesn&apos;t sound like you.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {pending.map((q, i) => {
          const body = drafts[q.id] ?? q.body;
          const isEditing = editing === q.id;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
              className="rounded-[6px] border border-[#2a1c14]/10 bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2a1c14]/88 text-[10.5px] font-medium text-white">
                    {q.member.first[0]}{q.member.last[0]}
                  </span>
                  <div>
                    <p className="text-[14.5px] text-[#2a1c14]">
                      {q.member.first} {q.member.last}
                    </p>
                    <p className="text-[11.5px] text-[#2a1c14]/45">{q.reason}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-[9px] font-medium uppercase tracking-[0.14em] ${
                    q.kind === "memorial"
                      ? "border-[#2a1c14]/30 bg-[#54132e] text-white"
                      : q.kind === "birthday"
                        ? "border-[#b19277]/50 text-[#a06a1a]"
                        : "border-[#2a1c14]/20 text-[#2a1c14]/60"
                  }`}
                >
                  {queueLabel(q.kind)}
                </span>
              </div>

              {isEditing ? (
                <textarea
                  autoFocus
                  value={body}
                  onChange={(e) => setDrafts({ ...drafts, [q.id]: e.target.value })}
                  onBlur={() => setEditing(null)}
                  rows={4}
                  className="mt-5 w-full resize-none rounded-[4px] border border-[#2a1c14]/20 bg-transparent p-3.5 text-[13.5px] leading-relaxed text-[#2a1c14] outline-none focus:border-[#54132e]"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(q.id)}
                  className="mt-5 block w-full rounded-[10px] rounded-bl-[3px] bg-[#f2f1ee] p-4 text-left transition-colors hover:bg-[#eceae5]"
                >
                  <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-[#2a1c14]/85">
                    {body}
                  </p>
                </button>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onHandle(q.id)}
                  className="rounded-full bg-[#54132e] px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#3f0e22]"
                >
                  Send {q.channel === "sms" ? "text" : "email"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(q.id)}
                  className="rounded-full border border-[#2a1c14]/15 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#2a1c14]/60 transition-colors hover:border-[#2a1c14]/40 hover:text-[#2a1c14]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onHandle(q.id)}
                  className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#2a1c14]/35 transition-colors hover:text-[#2a1c14]/70"
                >
                  Skip
                </button>
                <span className="ml-auto text-[11px] text-[#2a1c14]/35">
                  {q.member.phone ?? q.member.email}
                </span>
              </div>
            </motion.div>
          );
        })}

        {pending.length === 0 && (
          <p className="rounded-[6px] border border-[#2a1c14]/10 bg-white px-6 py-12 text-center text-[13px] text-[#2a1c14]/45">
            Nothing waiting. The queue fills itself as dates come around.
          </p>
        )}
      </div>
    </div>
  );
}

/* ============================== HISTORY ============================== */

function History({ items }: { items: SentMessage[] }) {
  return (
    <div className="overflow-hidden rounded-[6px] border border-[#2a1c14]/10 bg-white">
      {items.map((h, i) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="border-b border-[#2a1c14]/8 px-6 py-5 last:border-b-0"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#2a1c14]/15 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#2a1c14]/55">
              {h.channel === "sms" ? "Text" : h.channel === "email" ? "Email" : "Push"}
            </span>
            <span className="text-[13.5px] text-[#2a1c14]">{h.audience}</span>
            <span className="text-[12px] text-[#2a1c14]/40">{h.recipients} recipients</span>
            <span className="ml-auto text-[11.5px] text-[#2a1c14]/35">
              {fmtDate(h.sentAt)} · {h.by}
            </span>
          </div>
          <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-[#2a1c14]/60">{h.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================== bits ============================== */

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[6px] border border-[#2a1c14]/10 bg-white p-6">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#2a1c14]/45">{label}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[11px] uppercase tracking-[0.14em] text-[#2a1c14]/40">{k}</span>
      <span className="text-[13px] text-[#2a1c14]/80">{v}</span>
    </div>
  );
}
