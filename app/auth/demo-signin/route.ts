import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { isDemo, verifyDemo, DEMO_COOKIE, DEMO_PASSWORD } from "../../../lib/demo";

/*
  Demo sign-in. Only exists while WORKSPACE_DEMO=1 and no real Supabase
  project is configured — see lib/demo.ts. With a real project set, isDemo()
  is false and this route refuses every request, so it cannot be used as a
  way around Supabase auth.

  The cookie is an HMAC of the username keyed by the demo password, so it
  can't be forged by someone who doesn't already know the password, and it
  stops being valid the moment the password changes.
*/

export function demoToken(user: string) {
  return createHmac("sha256", DEMO_PASSWORD)
    .update(`osc-demo:${user.toLowerCase()}`)
    .digest("hex");
}

export async function POST(request: Request) {
  if (!isDemo()) {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");

  if (!verifyDemo(username, password)) {
    return NextResponse.json(
      { error: "That username or password doesn't look right." },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEMO_COOKIE, demoToken(username), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12, // a working day
  });
  return res;
}
