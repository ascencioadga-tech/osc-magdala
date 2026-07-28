"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createBrowserClient } from "@supabase/ssr";

/*
  Workspace login — the entrance for the One Step Closer team at Magdala.

  Split screen: form left, the shore right. Rendered in OSC's own language —
  Cormorant display, wine on ivory, uppercase micro-labels.

  Real authentication via Supabase Auth. The session lives in an httpOnly
  cookie, proxy.ts gates every /workspace route, and queries run as the
  signed-in user so row-level security decides what they can see.

  Signing in is not the same as having access: an account with no row in
  staff_users is bounced back here by the console layout with ?denied=1.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

/* Demo mode swaps Supabase auth for a username + password checked on the
   server. See lib/demo.ts — it is off unless explicitly enabled, and a real
   Supabase project disables it outright. */
const DEMO = process.env.NEXT_PUBLIC_WORKSPACE_DEMO === "1";

function LoginInner() {
  const params = useSearchParams();
  const denied = params.get("denied") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    if (DEMO) {
      const body = new FormData();
      body.set("username", email.trim());
      body.set("password", password);
      const res = await fetch("/auth/demo-signin", { method: "POST", body });
      if (!res.ok) {
        setError("That username or password doesn't look right.");
        setSubmitting(false);
        return;
      }
      window.location.href = "/workspace/dashboard";
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      // Deliberately vague: saying which half was wrong helps an attacker
      // confirm which addresses have accounts.
      setError("That email or password doesn't look right.");
      setSubmitting(false);
      return;
    }

    // Full reload so proxy.ts sees the new session cookie.
    window.location.href = "/workspace/dashboard";
  };

  /* Real password reset. Supabase mails the link; we never confirm whether
     the address exists, for the same reason the sign-in error is vague. */
  const handleReset = async () => {
    setError("");
    if (!email.trim()) {
      setNotice("Enter your email above first, then ask for a reset link.");
      return;
    }
    await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/workspace`,
    });
    setNotice("If that address is on the team, a reset link is on its way.");
  };

  return (
    <div className="grid min-h-[100svh] grid-cols-1 bg-[#faf8f2] lg:grid-cols-2">
      {/* LEFT — the form */}
      <div className="flex items-center justify-center px-6 py-14 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="w-full max-w-[400px]"
        >
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="One Step Closer — Hospitality Together"
              width={1400}
              height={322}
              className="h-12 w-auto"
            />
            <span className="mt-3 block text-[9px] font-medium uppercase tracking-[0.28em] text-[#8a6746]">
              At Magdala · Sea of Galilee
            </span>
          </div>

          <p className="mt-14 text-[11px] font-medium uppercase tracking-[0.28em] text-[#2a1c14]/45">
            The Magdala Team
          </p>
          <h1 className="font-display mt-4 text-[42px] leading-[1.02] text-[#54132e]">
            Welcome back.
          </h1>
          <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-[#2a1c14]/60">
            Sign in to tend the friends of the work — their notes, their dates,
            and the messages that reach them.
          </p>

          {denied && !error && (
            <div
              role="alert"
              className="mt-8 rounded-[3px] border border-[#8a6746]/30 bg-[#efe6d3]/60 px-4 py-3 text-[13px] text-[#633511]"
            >
              That account isn&rsquo;t on the team yet. Ask an administrator to
              add you, then sign in again.
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              role="alert"
              className="mt-8 flex items-start gap-2.5 rounded-[3px] border border-[#9d3b3b]/25 bg-[#9d3b3b]/8 px-4 py-3 text-[13px] text-[#7e2b2b]"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="mt-px shrink-0"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5" strokeLinecap="round" />
                <path d="M12 16h.01" strokeLinecap="round" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          {notice && (
            <div
              role="status"
              className="mt-8 rounded-[3px] border border-[#8a6746]/25 bg-[#efe6d3]/50 px-4 py-3 text-[13px] text-[#633511]"
            >
              {notice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-10">
            <label className="block">
              <span className="mb-2.5 block text-[11px] uppercase tracking-[0.2em] text-[#2a1c14]/50">
                {DEMO ? "Username" : "Email"}
              </span>
              <input
                type={DEMO ? "text" : "email"}
                required
                autoCapitalize="none"
                spellCheck={false}
                autoComplete={DEMO ? "username" : "email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-[#2a1c14]/20 bg-transparent pb-2.5 text-[16px] text-[#2a1c14] outline-none transition-colors placeholder:text-[#2a1c14]/30 focus:border-[#54132e]"
                placeholder={DEMO ? "Eamon" : "you@onestepcloser.org"}
              />
            </label>

            <label className="mt-8 block">
              <span className="mb-2.5 block text-[11px] uppercase tracking-[0.2em] text-[#2a1c14]/50">
                Password
              </span>
              <span className="relative block">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-[#2a1c14]/20 bg-transparent pb-2.5 pr-10 text-[16px] text-[#2a1c14] outline-none transition-colors placeholder:text-[#2a1c14]/30 focus:border-[#54132e]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#2a1c14]/35 transition-colors duration-300 hover:text-[#54132e]"
                >
                  {showPw ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 3l18 18" strokeLinecap="round" />
                      <path d="M10.6 10.6a2 2 0 002.8 2.8" strokeLinecap="round" />
                      <path d="M9.4 5.2A9.7 9.7 0 0112 5c5 0 9 4.5 9 7 0 .9-.7 2.2-1.9 3.4M6.3 6.7C3.9 8.2 3 10.3 3 12c0 2.5 4 7 9 7 1.2 0 2.3-.2 3.3-.6" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" />
                      <circle cx="12" cy="12" r="2.6" />
                    </svg>
                  )}
                </button>
              </span>
            </label>

            <div className={`mt-7 flex justify-end ${DEMO ? "hidden" : ""}`}>
              <button
                type="button"
                onClick={handleReset}
                className="text-[13px] text-[#2a1c14]/45 underline-offset-4 transition-colors duration-300 hover:text-[#54132e] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full rounded-full bg-[#54132e] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#faf8f2] shadow-[0_1px_2px_rgba(84,19,46,0.4)] transition-colors duration-500 hover:bg-[#3f0e22] disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-10 flex items-center gap-2 text-[11px] text-[#2a1c14]/40">
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <path d="M3 6V4a3 3 0 116 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <rect x="1" y="6" width="10" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            Private to the One Step Closer team · encrypted connection
          </p>

          {DEMO && (
            <p className="mt-6 rounded-[3px] border border-[#8a6746]/25 bg-[#efe6d3]/45 px-3 py-2 text-[11px] leading-relaxed text-[#633511]">
              <b className="font-medium">Demo mode.</b> Sign-in only — no
              database is connected yet, so the workspace opens empty. Turns
              off automatically once the Supabase project is connected.
            </p>
          )}

          <p className="mt-4 text-[11px] text-[#2a1c14]/30">
            © {new Date().getFullYear()} One Step Closer · At Magdala
          </p>
        </motion.div>
      </div>

      {/* RIGHT — the shore */}
      <div className="relative hidden overflow-hidden bg-[#54132e] lg:block">
        <motion.img
          src="/hero-galilee.jpg"
          alt=""
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            opacity: { duration: 1.8, ease: EASE },
            scale: { duration: 14, ease: "easeOut" },
          }}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Wine scrim for legibility and brand tone */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(155deg, rgba(63,14,34,0.55) 0%, rgba(41,8,24,0.62) 55%, rgba(20,5,11,0.82) 100%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
          className="absolute bottom-12 left-12 right-12"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-white.png"
            alt=""
            width={1400}
            height={320}
            className="mb-7 h-11 w-auto"
          />
          <p className="font-display max-w-sm text-[30px] italic leading-snug text-[#faf8f2]/95">
            “That they may all be one.”
          </p>
          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.26em] text-[#b19277]">
            John 17:21 · Magdala, Sea of Galilee
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function WorkspaceLogin() {
  return (
    <Suspense fallback={<div className="min-h-[100svh] bg-[#faf8f2]" />}>
      <LoginInner />
    </Suspense>
  );
}
