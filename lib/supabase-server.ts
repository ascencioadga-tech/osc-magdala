import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac } from "crypto";
import { isDemo, DEMO_COOKIE, DEMO_STAFF, DEMO_USER, DEMO_PASSWORD } from "./demo";

/*
  Request-scoped Supabase client.

  This is the important one. It carries the signed-in user's session, so
  every query runs as that person and row-level security decides what comes
  back. A pastor gets memorial dates; a volunteer gets the directory and
  nothing else — enforced by Postgres, not by the UI remembering to hide
  things.

  Contrast with getSupabaseAdmin() in ./supabase, which bypasses RLS
  entirely and exists only for the public Connect form, where there is no
  signed-in user to run as.
*/

/** True only when a real project is configured — not a placeholder. */
export function supabaseReady() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("placeholder"));
}

export async function getSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Middleware refreshes the session instead, so this is safe.
          }
        },
      },
    },
  );
}

export type Staff = {
  id: string;
  email: string;
  full_name: string;
  role: "volunteer" | "staff" | "pastor" | "admin";
  active: boolean;
};

/** The signed-in staff member, or null. Includes their role. */
export async function getCurrentStaff() {
  // No project configured: there is nobody to be. Say so rather than
  // constructing a client from undefined values and throwing.
  if (!supabaseReady()) return null;
  const db = await getSupabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;

  const { data: staff } = await db
    .from("staff_users")
    .select("id, email, full_name, role, active")
    .eq("id", user.id)
    .maybeSingle();

  // Authenticated but not on staff = no access. Being able to sign up does
  // not make someone part of the team.
  if (!staff || !staff.active) return null;
  return staff as Staff;
}

/*
  Gate for every console route.

  proxy.ts only proves that *some* Supabase account is signed in. That is
  not the same as being on the team: anyone who obtains an auth account would
  otherwise reach the console shell. This is the check that actually consults
  staff_users, and it runs server-side before any console page renders.

  RLS still decides what data comes back — this decides whether the door opens
  at all.
*/
export async function requireStaff(): Promise<Staff> {
  // Demo mode: a valid demo cookie stands in for a staff_users row. This
  // branch is unreachable once a real Supabase project is configured.
  if (isDemo()) {
    const jar = await cookies();
    const tok = jar.get(DEMO_COOKIE)?.value;
    const expect = createHmac("sha256", DEMO_PASSWORD)
      .update(`osc-demo:${DEMO_USER.toLowerCase()}`)
      .digest("hex");
    if (tok && tok === expect) {
      return { id: "demo", active: true, ...DEMO_STAFF } as Staff;
    }
    redirect("/workspace");
  }

  const staff = await getCurrentStaff();
  if (!staff) redirect("/workspace?denied=1");
  return staff;
}
