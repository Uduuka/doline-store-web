import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { DEVICE_COOKIE, DEVICE_HEADER, isWebDeviceId } from "@/lib/device";

/**
 * A Supabase client for Server Components, Server Actions and Route Handlers, as the signed-in user.
 * Every request carries this browser's device id (lib/device), so the cloud can tag the writes.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const device = cookieStore.get(DEVICE_COOKIE)?.value;
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      ...(isWebDeviceId(device) && { global: { headers: { [DEVICE_HEADER]: device } } }),
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component, which cannot set cookies. The middleware refreshes
            // the session, so this is safe to ignore.
          }
        },
      },
    },
  );
}
