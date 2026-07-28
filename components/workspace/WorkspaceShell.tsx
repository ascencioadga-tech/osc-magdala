"use client";

import { motion } from "framer-motion";
import { useStaff, initialsOf, roleLabel } from "./StaffContext";

/*
  WorkspaceShell — sidebar + header chrome for the Magdala workspace.

  The sidebar floats: an ivory card inset from the page edges with its own
  radius and hairline, rather than a full-bleed panel. Wine marks the active
  app; a gold tessera rides along beside it.

  Three apps, all of them real: Overview, Friends, Messages. Nothing is dimmed
  or tagged "soon" — the sidebar shows only what actually works.

  The person in the header comes from the signed-in staff row, not a constant.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

const APPS: { label: string; href: string; icon: React.ReactElement }[] = [
  {
    label: "Overview",
    href: "/workspace/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
      </svg>
    ),
  },
  {
    label: "Friends",
    href: "/workspace/friends",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" strokeLinecap="round" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M16 14.7c2 .2 3.6 1.4 4.3 3.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Messages",
    href: "/workspace/messages",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" />
        <path d="m4.5 7 7.5 6 7.5-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function WorkspaceShell({
  active,
  title,
  children,
}: {
  active: string;
  title: string;
  children: React.ReactNode;
}) {
  const staff = useStaff();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-[100svh] bg-[#f0efec]">
      {/* Sidebar */}
      <aside className="fixed inset-y-5 left-5 z-40 hidden w-[228px] flex-col rounded-[6px] border border-[#2a1c14]/8 bg-[#faf8f2] shadow-[0_1px_2px_rgba(42,28,20,0.05),0_18px_48px_-30px_rgba(84,19,46,0.35)] lg:flex">
        <div className="px-6 pt-7">
          <a href="/workspace/dashboard" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="One Step Closer — Hospitality Together"
              width={1400}
              height={322}
              className="h-9 w-auto"
            />
          </a>
          <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.3em] text-[#2a1c14]/35">
            Workspace
          </p>
        </div>

        <nav className="mt-9 flex-1 space-y-1 px-4">
          {APPS.map((app) => {
            const isActive = app.label === active;
            return (
              <a
                key={app.label}
                href={app.href}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3.5 rounded-[4px] px-3.5 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
                  isActive
                    ? "bg-[#54132e] text-[#faf8f2]"
                    : "text-[#2a1c14]/60 hover:bg-[#54132e]/6 hover:text-[#54132e]"
                }`}
              >
                <span className="h-[18px] w-[18px] shrink-0">{app.icon}</span>
                {app.label}
                {isActive && (
                  <motion.span
                    layoutId="ws-dot"
                    className="ml-auto h-[7px] w-[7px] rotate-45 bg-[#b19277]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="px-6 pb-6">
          <form action="/auth/signout" method="post" className="border-t border-[#2a1c14]/10 pt-5">
            <button
              type="submit"
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2a1c14]/40 transition-colors duration-300 hover:text-[#54132e]"
            >
              Sign out →
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1 lg:pl-[268px]">
        <header className="flex items-center justify-between gap-6 px-6 pb-2 pt-7 sm:px-10">
          <div>
            <h1 className="font-display text-[27px] leading-tight text-[#54132e]">
              {title}
            </h1>
            <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.2em] text-[#2a1c14]/40">
              {today}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-right text-[12px] leading-tight text-[#2a1c14]/60 sm:block">
              {staff.full_name}
              <br />
              <span className="text-[9.5px] uppercase tracking-[0.16em] text-[#2a1c14]/35">
                {roleLabel(staff.role)}
              </span>
            </span>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#54132e] text-[12px] font-medium tracking-wide text-[#faf8f2]"
              aria-hidden="true"
            >
              {initialsOf(staff.full_name)}
            </span>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="px-6 py-8 sm:px-10"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
