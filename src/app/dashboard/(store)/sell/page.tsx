import type { Metadata } from "next";
import { requireStore } from "@/lib/store";
import { Pos, type PosClient, type PosProduct } from "./pos";

export const metadata: Metadata = { title: "Sell" };
export const dynamic = "force-dynamic";

/** The same rule as the cloud's effective_price(): a running flash sale, else the amount less its discount. */
function effective(p: { amount: number; discount: number | null; flash_amount: number | null; flash_starts_at: string | null; flash_expires_at: string | null }) {
  const now = Date.now();
  if (p.flash_amount != null && p.flash_expires_at && Date.parse(p.flash_expires_at) > now && (!p.flash_starts_at || Date.parse(p.flash_starts_at) <= now)) {
    return Number(p.flash_amount);
  }
  return Number(p.amount) - Number(p.discount ?? 0);
}

export default async function SellPage() {
  const { supabase, store, currency } = await requireStore();

  const [inv, pricings, clients] = await Promise.all([
    supabase.from("inventory").select("product_id, name, available, category_label, is_low_stock").eq("store_id", store.id).order("name"),
    supabase
      .from("product_pricings")
      .select("id, product_id, amount, discount, flash_amount, flash_starts_at, flash_expires_at, currency, updated_at, products!inner(store_id)")
      .eq("products.store_id", store.id)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false }),
    supabase.from("clients").select("id, store_contacts(name)").eq("store_id", store.id).is("deleted_at", null),
  ]);

  // One price per product: its most recently updated pricing row.
  const priceOf = new Map<string, { id: string; price: number; currency: string }>();
  for (const p of pricings.data ?? []) {
    if (!priceOf.has(p.product_id)) priceOf.set(p.product_id, { id: p.id, price: effective(p), currency: p.currency });
  }

  const products: PosProduct[] = (inv.data ?? [])
    .filter((r) => r.product_id && priceOf.has(r.product_id))
    .map((r) => {
      const pr = priceOf.get(r.product_id!)!;
      return {
        id: r.product_id!,
        name: r.name ?? "Item",
        category: r.category_label || "Other",
        available: Number(r.available ?? 0),
        low: !!r.is_low_stock,
        pricingId: pr.id,
        price: pr.price,
        currency: pr.currency,
      };
    });

  const posClients: PosClient[] = (clients.data ?? [])
    .map((c) => ({ id: c.id, name: (c.store_contacts as { name: string } | null)?.name ?? "Client" }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    // No page header: the items and the sale fill the window, each scrolling on its own.
    <main className="w-full max-w-[1360px] p-4 sm:p-6 lg:h-dvh">
      <h1 className="sr-only">Sell</h1>
      <Pos products={products} clients={posClients} currency={currency} />
    </main>
  );
}
