import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * The cloud, read with the publishable key and no session. The site only reads public tables
 * (`plan_limits`, `app_releases`), which RLS opens to everyone.
 */
export function publicClient() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false },
  });
}
