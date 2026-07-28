// Supabase clients.
//
// Two of them, deliberately:
//
//   supabase       — the browser client, using the anon key. Every query it
//                    makes is filtered by row-level security, so a volunteer
//                    physically cannot fetch a pastoral note.
//
//   supabaseAdmin  — server-only, using the service_role key. It BYPASSES
//                    row-level security completely. Import it only inside
//                    route handlers or server actions, never in a component
//                    that ships to the browser.
//
// Keys live in .env.local (gitignored) and in Netlify's environment settings.
// They are never hardcoded here.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once the environment is configured. Lets the UI show an honest
 *  "not connected yet" state instead of throwing. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase =
  isSupabaseConfigured
    ? createClient(url!, anonKey!, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null;

/** Server-side only. Throws if called from the browser, because leaking the
 *  service_role key would hand out every pastoral note in the database. */
export function getSupabaseAdmin() {
  if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin must never be used in the browser.");
  }
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
