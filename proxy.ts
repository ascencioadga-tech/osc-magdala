import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isDemo, DEMO_COOKIE } from "./lib/demo";

/*
  Gate on /workspace/*.

  Next 16 renamed the `middleware` file convention to `proxy`; this is that
  file. The behaviour is unchanged.

  Two jobs:
   1. Refresh the auth session on every request, so a signed-in staff member
      isn't logged out mid-Sunday.
   2. Bounce anyone without a session away from the workspace.

  This runs before the page does, so an unauthenticated request never reaches
  a server component that could query member data. The RLS policies are the
  real protection; this is the first door.
*/

/*
  Is a real Supabase project configured? Checked here rather than imported,
  because proxy runs on the edge runtime and should pull in as little as
  possible. Without it we must NOT construct a client: @supabase/ssr throws
  "Your project's URL and Key are required", which turns every /workspace
  request into a 500 rather than a login page.
*/
function supabaseReady() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("placeholder"));
}

export async function proxy(request: NextRequest) {
  const { pathname: path } = request.nextUrl;

  /* Demo mode: the session is a cookie, not a Supabase token. requireStaff()
     verifies it properly server-side; this only decides routing. */
  if (isDemo()) {
    const hasDemo = !!request.cookies.get(DEMO_COOKIE)?.value;
    const onLogin = path === "/workspace";
    if (path.startsWith("/workspace") && !onLogin && !hasDemo) {
      const url = request.nextUrl.clone();
      url.pathname = "/workspace";
      return NextResponse.redirect(url);
    }
    if (onLogin && hasDemo) {
      const url = request.nextUrl.clone();
      url.pathname = "/workspace/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  /*
    Neither a database nor demo mode. Let the request through: the login page
    renders an honest "not connected yet" panel, which is a great deal better
    than a 500.
  */
  if (!supabaseReady()) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the token if it's near expiry. Must not be removed.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/workspace";
  const isWorkspace = pathname.startsWith("/workspace");

  if (isWorkspace && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/workspace";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Already signed in and sitting on the login page — send them through.
  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.searchParams.get("next") ?? "/workspace/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/workspace/:path*"],
};
