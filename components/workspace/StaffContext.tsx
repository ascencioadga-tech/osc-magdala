"use client";

import { createContext, useContext } from "react";

/*
  Who is signed in, made available to the client chrome.

  The console header used to hardcode a name. That is fine with one user and
  wrong the moment a second person on the team signs in — everyone would see
  the director's name over their own session. The layout resolves the real
  staff row on the server and hands it down through here.
*/

export type StaffIdentity = {
  full_name: string;
  role: "volunteer" | "staff" | "pastor" | "admin";
  email: string;
};

const StaffCtx = createContext<StaffIdentity | null>(null);

export function StaffProvider({
  value,
  children,
}: {
  value: StaffIdentity;
  children: React.ReactNode;
}) {
  return <StaffCtx.Provider value={value}>{children}</StaffCtx.Provider>;
}

export function useStaff(): StaffIdentity {
  const v = useContext(StaffCtx);
  // Every console route sits under the provider; this only trips in a stray
  // render outside it, and a readable fallback beats a crash.
  return v ?? { full_name: "Signed in", role: "staff", email: "" };
}

/** "Fr. Eamon Kelly, LC" → "EK". Titles and suffixes are not initials. */
export function initialsOf(name: string) {
  const skip = /^(fr\.?|father|rev\.?|dr\.?|mr\.?|mrs\.?|ms\.?|sr\.?|br\.?)$/i;
  const parts = name
    .replace(/,.*$/, "")
    .split(/\s+/)
    .filter((w) => w && !skip.test(w));
  if (!parts.length) return "—";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const ROLE_LABEL: Record<StaffIdentity["role"], string> = {
  volunteer: "Volunteer",
  staff: "Team",
  pastor: "Pastoral",
  admin: "Administrator",
};

export function roleLabel(role: StaffIdentity["role"]) {
  return ROLE_LABEL[role] ?? "Team";
}
