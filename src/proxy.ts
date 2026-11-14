import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEVICE_COOKIE, isWebDeviceId, newWebDeviceId } from "@/lib/device";

const PROTECTED = ["/dashboard", "/onboarding"];
const AUTH_ONLY = ["/sign-in", "/sign-up"];

/**
 * Refreshes the Supabase session on every request and keeps signed-out people out of the app
 * and signed-in people out of the sign-in pages.
 */
export async function proxy(request: NextRequest) {
  // This browser's device id (lib/device), made on its first visit. Set on the request too, so
  // the page rendered for that first visit already writes with it.
  const device = request.cookies.get(DEVICE_COOKIE)?.value;
  const newDevice = isWebDeviceId(device) ? null : newWebDeviceId();
  if (newDevice) request.cookies.set(DEVICE_COOKIE, newDevice);
  const withDevice = (r: NextResponse) => {
    if (newDevice) r.cookies.set(DEVICE_COOKIE, newDevice, { path: "/", maxAge: 60 * 60 * 24 * 400, sameSite: "lax" });
    return r;
  };

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // Do not put code between createServerClient and getUser: it refreshes the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user && PROTECTED.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", path);
    return withDevice(NextResponse.redirect(url));
  }

  if (user && AUTH_ONLY.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return withDevice(NextResponse.redirect(url));
  }

  return withDevice(response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|logo.*\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
