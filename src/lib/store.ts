import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const STORE_COOKIE = "doline_store";

export type StoreSummary = { id: string; name: string; address: string | null; status: string };

/**
 * The signed-in shop owner, their stores and the store the dashboard is showing. Cached per
 * request, so the layout and the page share one lookup.
 *
 * Stores are the ones this account keeps (stores.keeper_id), which is what every store-scoped
 * RLS policy checks (private.is_store_member).
 */
export const getContext = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const [{ data: stores }, { data: profile }] = await Promise.all([
    supabase.from("stores").select("id, name, address, status").eq("keeper_id", user.id).is("deleted_at", null).order("created_at"),
    supabase.from("profiles").select("name, full_name").eq("user_id", user.id).maybeSingle(),
  ]);

  const list: StoreSummary[] = stores ?? [];
  const chosen = (await cookies()).get(STORE_COOKIE)?.value;
  // Only a store this account keeps can be open; anything else in the cookie is ignored.
  const store = list.find((s) => s.id === chosen) ?? null;

  let currency = "UGX";
  if (store) {
    const { data: settings } = await supabase.from("store_settings").select("default_currency").eq("store_id", store.id).maybeSingle();
    currency = settings?.default_currency || currency;
  }

  const displayName =
    profile?.full_name || profile?.name || (user.user_metadata?.full_name as string | undefined) || user.email?.split("@")[0] || "there";

  return { supabase, user, stores: list, store, currency, displayName };
});

/**
 * As getContext, for pages that work on one store: an account with no stores goes to set one up,
 * and one that hasn't opened a store (or opened one it doesn't keep) goes to its store list.
 */
export async function requireStore() {
  const ctx = await getContext();
  if (!ctx.stores.length) redirect("/onboarding");
  if (!ctx.store) redirect("/dashboard");
  return { ...ctx, store: ctx.store };
}

/** Who an order was for: the online buyer, else the store's client, else a walk-in. */
export function buyerOf(o: { buyer_name?: string | null; client_name?: string | null }, walkIn = "Walk-in"): string {
  return o.buyer_name || o.client_name || walkIn;
}
