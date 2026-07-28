import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../lib/supabase-server";
import { isDemo, DEMO_COOKIE } from "../../../lib/demo";

// POST so a stray link-prefetch can't sign someone out mid-Sunday.
export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/workspace", request.url), { status: 303 });

  if (isDemo()) {
    res.cookies.delete(DEMO_COOKIE);
    return res;
  }

  const db = await getSupabaseServer();
  await db.auth.signOut();
  return res;
}
