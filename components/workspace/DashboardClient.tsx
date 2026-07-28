"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CrossPulse from "../CrossPulse";
import { motion, AnimatePresence } from "framer-motion";
import WorkspaceShell from "../workspace/WorkspaceShell";
import { upcomingMilestones, type Member } from "../../lib/members";

/*
  Overview — the app launcher.

  Cards for every app built for One Step Closer: art panel on top, badge pill,
  then title, description and an Open action. Every card here is live — there
  are no placeholder apps.

  On entry the milestone notification still fires here — this is where Fr. Eamon
  lands after signing in — but the detail lives inside Friends.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

type App = {
  title: string;
  badge: string;
  desc: string;
  href?: string;
  live?: boolean;
  art: React.ReactElement;
};

/* ---- card art: simple ink geometry, one motif per app ---- */

const ArtMembers = (
  <svg viewBox="0 0 200 110" fill="none" className="h-full w-full">
    <circle cx="100" cy="55" r="15" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="100" cy="55" r="30" stroke="currentColor" strokeWidth="0.7" opacity=".55" />
    <circle cx="100" cy="55" r="45" stroke="currentColor" strokeWidth="0.5" opacity=".28" />
    {[0, 60, 120, 180, 240, 300].map((deg) => {
      const r = (deg * Math.PI) / 180;
      return (
        <circle
          key={deg}
          cx={100 + Math.cos(r) * 30}
          cy={55 + Math.sin(r) * 30}
          r="4.5"
          fill="currentColor"
          opacity={deg === 0 ? 1 : 0.45}
        />
      );
    })}
  </svg>
);

const ArtMessages = (
  <svg viewBox="0 0 200 110" fill="none" className="h-full w-full">
    <rect x="45" y="26" width="80" height="46" rx="3" stroke="currentColor" strokeWidth="1.2" />
    <rect x="72" y="46" width="80" height="46" rx="3" stroke="currentColor" strokeWidth="0.8" opacity=".5" />
    <path d="M57 40h50M57 50h34" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".7" />
  </svg>
);

const ArtEvents = (
  <svg viewBox="0 0 200 110" fill="none" className="h-full w-full">
    <rect x="58" y="22" width="84" height="70" rx="3" stroke="currentColor" strokeWidth="1.2" />
    <path d="M58 40h84M78 16v12M122 16v12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {[0, 1, 2, 3].map((c) =>
      [0, 1, 2].map((r) => (
        <rect
          key={`${c}-${r}`}
          x={70 + c * 18} y={50 + r * 13} width="8" height="8" rx="1.4"
          fill="currentColor"
          opacity={c === 2 && r === 1 ? 1 : 0.2}
        />
      )),
    )}
  </svg>
);

const ArtMedia = (
  <svg viewBox="0 0 200 110" fill="none" className="h-full w-full">
    <rect x="50" y="26" width="100" height="58" rx="3" stroke="currentColor" strokeWidth="1.2" />
    <path d="M90 44l22 13-22 13V44Z" fill="currentColor" opacity=".85" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
      <rect
        key={i} x={54 + i * 12.5} y={92} width="3" height={[6, 12, 8, 16, 9, 14, 7, 11][i]}
        fill="currentColor" opacity=".3"
      />
    ))}
  </svg>
);

const ArtGroups = (
  <svg viewBox="0 0 200 110" fill="none" className="h-full w-full">
    <circle cx="82" cy="55" r="26" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="118" cy="55" r="26" stroke="currentColor" strokeWidth="1.2" opacity=".55" />
    <circle cx="100" cy="55" r="5" fill="currentColor" opacity=".7" />
  </svg>
);

const ArtCare = (
  <svg viewBox="0 0 200 110" fill="none" className="h-full w-full">
    {[0, 1, 2].map((i) => (
      <g key={i} opacity={i === 0 ? 1 : 0.4}>
        <rect x="62" y={30 + i * 20} width="12" height="12" rx="2.4" stroke="currentColor" strokeWidth="1.1" />
        {i === 0 && (
          <path d="M65 36.5l2.4 2.4 4-4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        )}
        <path d={`M82 ${36 + i * 20}h56`} stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

const APPS: App[] = [
  {
    title: "Friends",
    badge: "Care",
    href: "/workspace/friends",
    live: true,
    desc: "Every person and household, with the dates that matter — birthdays, anniversaries, and the family they have lost.",
    art: ArtMembers,
  },
  {
    title: "Messages",
    badge: "Outreach",
    href: "/workspace/messages",
    live: true,
    desc: "Write once and send to everyone or to one family — email or text, with the reach shown before you send.",
    art: ArtMessages,
  },
];

export default function DashboardClient({ members }: { members: Member[] }) {
  const [thisWeek, setThisWeek] = useState(0);
  const [tender, setTender] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const all = upcomingMilestones(members, 45);
    const week = all.filter((e) => e.daysAway <= 7);
    setThisWeek(week.length);
    setTender(week.some((e) => e.kind === "memorial"));
    const t = setTimeout(() => setToast(true), 900);
    return () => clearTimeout(t);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const liveCount = APPS.filter((a) => a.live).length;

  // Carousel: track scroll position so the arrows know when they're at an end.
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateCtrl = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateCtrl();
    window.addEventListener("resize", updateCtrl);
    return () => window.removeEventListener("resize", updateCtrl);
  }, [updateCtrl]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (309 + 20) * 2, behavior: "smooth" });
  };

  return (
    <WorkspaceShell active="Overview" title="Overview">
      <p className="font-display text-[30px] font-light leading-tight text-[#2a1c14] sm:text-[36px]">
        {greeting}, Fr. Eamon.
      </p>
      <div className="mt-2 flex items-end justify-between gap-6">
        <p className="text-[14px] text-[#2a1c14]/55">
          Your tools for tending the work at Magdala.
        </p>
        <div className="hidden gap-2 sm:flex">
          {([-1, 1] as const).map((dir) => {
            const enabled = dir === -1 ? canPrev : canNext;
            return (
              <button
                key={dir}
                type="button"
                onClick={() => scrollBy(dir)}
                disabled={!enabled}
                aria-label={dir === -1 ? "Previous apps" : "More apps"}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 ${
                  enabled
                    ? "border-[#2a1c14]/20 text-[#2a1c14]/70 hover:border-[#2a1c14]/50 hover:text-[#2a1c14]"
                    : "cursor-default border-[#2a1c14]/8 text-[#2a1c14]/20"
                }`}
              >
                <svg width="13" height="11" viewBox="0 0 16 12" fill="none" style={{ transform: dir === -1 ? "scaleX(-1)" : undefined }}>
                  <path d="M10 1l5 5-5 5M1 6h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {/* Carousel — bleeds past the page padding to the viewport edge */}
      <div className="relative mt-9 -mr-6 sm:-mr-10">
        {/* Fade at the bleeding edge, hinting there's more */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f0efec] to-transparent" />

        <div
          ref={trackRef}
          onScroll={updateCtrl}
          className="ws-track flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 pr-6 sm:pr-10"
        >
        {APPS.map((app, i) => {
          const Card = (
            <>
              {/* Art panel */}
              <div className="relative flex h-[150px] items-center justify-center overflow-hidden border-b border-[#2a1c14]/8 bg-[#f7f7f8]">
                <span
                  className={`h-[110px] w-full px-8 ${
                    app.live ? "text-[#2a1c14]" : "text-[#2a1c14]/45"
                  } transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]`}
                >
                  {app.art}
                </span>
                <span className="absolute right-4 top-4 rounded-full border border-[#2a1c14]/15 bg-white px-3 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#2a1c14]/55">
                  {app.badge}
                </span>
              </div>

              {/* Foot */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-[20px] font-light text-[#2a1c14]">
                    {app.title}
                  </h3>
                  {app.live ? (
                    <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[#a06a1a]">
                      <motion.span
                        className="h-1.5 w-1.5 rounded-full bg-[#b19277]"
                        animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      Live
                    </span>
                  ) : (
                    <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#2a1c14]/30">
                      Soon
                    </span>
                  )}
                </div>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-[#2a1c14]/55">
                  {app.desc}
                </p>
                <span
                  className={`mt-5 inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.18em] ${
                    app.live ? "text-[#2a1c14]" : "text-[#2a1c14]/25"
                  }`}
                >
                  {app.live ? "Open" : "In development"}
                  {app.live && (
                    <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </span>
              </div>
            </>
          );

          const cls = `group flex h-[352px] flex-col overflow-hidden rounded-[6px] border bg-white transition-all duration-500 ${
            app.live
              ? "border-[#2a1c14]/12 hover:border-[#2a1c14]/30 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
              : "cursor-default border-[#2a1c14]/8"
          }`;

          return (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.07 }}
              className="w-[300px] shrink-0 snap-start sm:w-[318px]"
            >
              {app.live && app.href ? (
                <a href={app.href} className={cls}>
                  {Card}
                </a>
              ) : (
                <div className={cls}>{Card}</div>
              )}
            </motion.div>
          );
        })}
        </div>
      </div>

      {/* Entry notification */}
      <AnimatePresence>
        {toast && thisWeek > 0 && (
          <motion.aside
            role="status"
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="fixed bottom-6 right-6 z-50 w-[330px] max-w-[calc(100vw-3rem)] rounded-[4px] border border-[#2a1c14]/10 bg-white p-5 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center gap-2.5">
              <CrossPulse size={12} className="text-[#b19277]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#2a1c14]/50">
                This week
              </span>
              <button
                type="button"
                onClick={() => setToast(false)}
                aria-label="Dismiss"
                className="ml-auto -m-1 p-1 text-[#2a1c14]/35 transition-colors hover:text-[#2a1c14]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <p className="mt-3 font-display text-[18px] font-light leading-snug text-[#2a1c14]">
              {thisWeek} of your people {thisWeek === 1 ? "has" : "have"} a
              milestone this week.
            </p>
            <p className="mt-1.5 text-[12.5px] text-[#2a1c14]/55">
              {tender
                ? "One is a tender date — the anniversary of a loss."
                : "Birthdays and anniversaries — good reasons to reach out."}
            </p>
            <a
              href="/workspace/friends"
              className="mt-4 inline-block rounded-full bg-[#54132e] px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#faf8f2] transition-colors duration-500 hover:bg-[#3f0e22]"
            >
              See who
            </a>
          </motion.aside>
        )}
      </AnimatePresence>
    </WorkspaceShell>
  );
}
