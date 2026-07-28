"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TRADITIONS, communityWord } from "../lib/traditions";

/*
  The welcome form — how someone becomes a friend of the work.

  Deliberately not a church connect card. A parish card asks which service you
  attended and whether you want to join a small group, because it assumes you
  are joining that parish. Nobody joins Magdala. They arrive already belonging
  to somewhere, and the whole purpose of the place is that they arrive
  belonging to *different* somewheres. So the two questions at the centre of
  this form — your tradition, and your community — are the ones a single-parish
  form would never think to ask.

  Three things it tries to get right:

  1. Asking someone's confession can read as sorting them. So the tradition
     question is framed as something we are glad of rather than something we
     are filing, and "Still finding my way" is offered plainly, not as an
     apology tucked at the end.
  2. The word for their community changes with their answer — a Catholic has a
     parish, a Baptist has a church. Getting that wrong is small and it stings.
  3. Answers are kept on the device as they type, and cleared only once the
     server confirms. Church wifi and pilgrimage coach wifi are both bad.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const DRAFT = "osc-welcome-draft";

type Result = { ok: boolean; reason: "saved" | "demo" | "error"; message?: string };

export default function WelcomeForm() {
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [tradition, setTradition] = useState("");
  const [traditionOther, setOther] = useState("");
  const [church, setChurch] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [origin, setOrigin] = useState("");
  const [intention, setIntention] = useState("");
  const [mayWeWrite, setMayWrite] = useState(true);

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [restored, setRestored] = useState(false);

  // ---- draft on the device -------------------------------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT);
      if (!saved) return;
      const d = JSON.parse(saved);
      setFirst(d.firstName ?? ""); setLast(d.lastName ?? "");
      setTradition(d.tradition ?? ""); setOther(d.traditionOther ?? "");
      setChurch(d.church ?? ""); setCity(d.city ?? ""); setCountry(d.country ?? "");
      setEmail(d.email ?? ""); setPhone(d.phone ?? "");
      setOrigin(d.origin ?? ""); setIntention(d.intention ?? "");
      setRestored(true);
    } catch { /* a corrupt draft is not worth an error */ }
  }, []);

  useEffect(() => {
    const d = { firstName, lastName, tradition, traditionOther, church, city, country, email, phone, origin, intention };
    if (Object.values(d).every((v) => !v)) return;
    try { localStorage.setItem(DRAFT, JSON.stringify(d)); } catch {}
  }, [firstName, lastName, tradition, traditionOther, church, city, country, email, phone, origin, intention]);

  const chosenTradition = tradition === "__other" ? traditionOther.trim() : tradition;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName,
          tradition: chosenTradition, church, city, country,
          email, phone, origin, intention, mayWeWrite,
        }),
      });
      const data: Result = await res.json();
      setResult(data);
      // Only forget the draft once the server says it truly has it.
      if (data.ok) { try { localStorage.removeItem(DRAFT); } catch {} }
    } catch {
      setResult({ ok: false, reason: "error" });
    } finally {
      setSending(false);
    }
  }

  const field =
    "w-full border-b border-[#2a1c14]/18 bg-transparent pb-2.5 text-[16px] text-[#2a1c14] outline-none transition-colors placeholder:text-[#2a1c14]/25 focus:border-[#54132e]";
  const label = "mb-2 block text-[11px] uppercase tracking-[0.2em] text-[#2a1c14]/45";

  /* ---------------- the thank-you, which never overstates ---------------- */
  if (result?.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto max-w-[520px] py-16 text-center"
      >
        <p className="font-display text-[38px] leading-tight text-[#54132e]">
          Thank you, {firstName}.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-[#2a1c14]/70">
          You&rsquo;re among the friends of this work now. Someone from Magdala
          will write to you — not a newsletter, a person.
        </p>
        {intention.trim() && (
          <p className="mt-6 rounded-[4px] border-l-2 border-[#b19277] bg-[#efe6d3]/50 px-5 py-4 text-left text-[14px] leading-relaxed text-[#633511]">
            What you asked us to carry has been written down, and it will be
            prayed for on the shore.
          </p>
        )}
        <p className="font-display mt-10 text-[19px] italic text-[#8a6746]">
          &ldquo;That they may all be one.&rdquo;
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[560px] pb-24">
      {restored && (
        <p className="mb-8 rounded-[3px] border border-[#8a6746]/25 bg-[#efe6d3]/45 px-4 py-2.5 text-[12.5px] text-[#633511]">
          We kept what you had already written.
        </p>
      )}

      {/* ---- who ---- */}
      <Section n="1" title="Your name">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className={label}>First name</span>
            <input required value={firstName} onChange={(e) => setFirst(e.target.value)} className={field} />
          </label>
          <label className="block">
            <span className={label}>Last name</span>
            <input required value={lastName} onChange={(e) => setLast(e.target.value)} className={field} />
          </label>
        </div>
      </Section>

      {/* ---- the question this work exists for ---- */}
      <Section
        n="2"
        title="Your Christian tradition"
        note="We ask because it is the best thing about this place — that the people who build it do not all come from one church."
      >
        <div className="flex flex-wrap gap-2">
          {TRADITIONS.map((t) => {
            const on = tradition === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => setTradition(on ? "" : t)}
                className={`rounded-full border px-4 py-2 text-[13.5px] transition-colors duration-200 ${
                  on
                    ? "border-[#54132e] bg-[#54132e] text-[#faf8f2]"
                    : "border-[#2a1c14]/15 text-[#2a1c14]/75 hover:border-[#54132e]/50 hover:text-[#54132e]"
                }`}
              >
                {t}
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={tradition === "__other"}
            onClick={() => setTradition(tradition === "__other" ? "" : "__other")}
            className={`rounded-full border px-4 py-2 text-[13.5px] transition-colors duration-200 ${
              tradition === "__other"
                ? "border-[#54132e] bg-[#54132e] text-[#faf8f2]"
                : "border-[#2a1c14]/15 text-[#2a1c14]/75 hover:border-[#54132e]/50 hover:text-[#54132e]"
            }`}
          >
            Another
          </button>
        </div>

        <AnimatePresence>
          {tradition === "__other" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: EASE }}
            >
              <label className="mt-6 block">
                <span className={label}>Then tell us, in your words</span>
                <input
                  value={traditionOther}
                  onChange={(e) => setOther(e.target.value)}
                  placeholder="Syro-Malabar, Coptic, Waldensian…"
                  className={field}
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        <label className="mt-8 block">
          <span className={label}>Your {communityWord(chosenTradition)}</span>
          <input
            value={church}
            onChange={(e) => setChurch(e.target.value)}
            placeholder="St Mary's, Monterrey"
            className={field}
          />
        </label>
      </Section>

      {/* ---- where ---- */}
      <Section n="3" title="Where you call home">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className={label}>City</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} className={field} />
          </label>
          <label className="block">
            <span className={label}>Country</span>
            <input value={country} onChange={(e) => setCountry(e.target.value)} className={field} />
          </label>
        </div>
      </Section>

      {/* ---- reaching them ---- */}
      <Section n="4" title="How we can reach you">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
          </label>
          <label className="block">
            <span className={label}>Phone</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
          </label>
        </div>

        <button
          type="button"
          role="checkbox"
          aria-checked={mayWeWrite}
          onClick={() => setMayWrite((v) => !v)}
          className="mt-7 flex items-start gap-3 text-left"
        >
          <span
            className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
              mayWeWrite ? "border-[#54132e] bg-[#54132e]" : "border-[#2a1c14]/30"
            }`}
          >
            {mayWeWrite && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6.5 4.5 9 10 3" stroke="#faf8f2" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-[13.5px] leading-relaxed text-[#2a1c14]/70">
            You may write to me about the work at Magdala. We will not pass your
            details to anyone, and one line from you ends it.
          </span>
        </button>
      </Section>

      {/* ---- the personal half ---- */}
      <Section n="5" title="How did you come to Magdala?" note="However you found your way here — we would like to know.">
        <textarea
          rows={3}
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="A pilgrimage, a friend, something you read…"
          className={`${field} resize-none leading-relaxed`}
        />
      </Section>

      <Section n="6" title="Is there something we can carry for you?" note="It will be prayed for on the shore. Only the priests here will read it.">
        <textarea
          rows={4}
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="An intention, a name, a burden…"
          className={`${field} resize-none leading-relaxed`}
        />
      </Section>

      {/* ---- honest outcomes ---- */}
      {result && !result.ok && (
        <div
          role="alert"
          className={`mt-10 rounded-[3px] border px-4 py-3.5 text-[13.5px] leading-relaxed ${
            result.reason === "demo"
              ? "border-[#8a6746]/30 bg-[#efe6d3]/55 text-[#633511]"
              : "border-[#9d3b3b]/25 bg-[#9d3b3b]/8 text-[#7e2b2b]"
          }`}
        >
          {result.reason === "demo"
            ? result.message
            : "That didn't go through. Your answers are saved on this device — try again in a moment, or hand it to someone from the team."}
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-10 w-full rounded-full bg-[#54132e] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#faf8f2] shadow-[0_1px_2px_rgba(84,19,46,0.4)] transition-colors duration-500 hover:bg-[#3f0e22] disabled:opacity-60"
      >
        {sending ? "Sending…" : "Count me among them"}
      </button>
    </form>
  );
}

function Section({
  n, title, note, children,
}: {
  n: string; title: string; note?: string; children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[#2a1c14]/10 py-9 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[15px] text-[#b19277]">{n}</span>
        <h2 className="font-display text-[24px] leading-tight text-[#54132e]">{title}</h2>
      </div>
      {note && (
        <p className="mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-[#2a1c14]/55">{note}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}
