"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STORE_COOKIE } from "@/lib/store";

export type StoreFormState = { error?: string } | undefined;

/**
 * Creates the account's profile (if it has none) and a store, the way the apps do: a `stores`
 * row kept by this user, then its settings with the chosen currency. The cloud starts the
 * 14-day Business trial when an account's first store is created.
 */
export async function createStore(_: StoreFormState, form: FormData): Promise<StoreFormState> {
  const name = String(form.get("name") ?? "").trim();
  const address = String(form.get("address") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const currency = String(form.get("currency") ?? "UGX").trim().toUpperCase();
  if (!name) return { error: "Give your store a name." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase.from("profiles").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!profile) {
    const fullName = (user.user_metadata?.full_name as string | undefined) || user.email?.split("@")[0] || "New user";
    await supabase.from("profiles").insert({
      user_id: user.id,
      name: `user_${user.id.slice(0, 8)}`,
      full_name: fullName,
      phone: (user.user_metadata?.phone as string | undefined) || null,
    });
  }

  const { data: store, error } = await supabase
    .from("stores")
    .insert({ keeper_id: user.id, name, address: address || null, description: description || null })
    .select("id")
    .single();
  if (error || !store) return { error: "Your store couldn't be created. Please try again." };

  await supabase.from("store_settings").upsert({ store_id: store.id, default_currency: currency }, { onConflict: "store_id" });

  (await cookies()).set(STORE_COOKIE, store.id, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  redirect("/dashboard/overview");
}
