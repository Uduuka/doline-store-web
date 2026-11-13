import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { Empty, FilterChips, Stat } from "@/components/ui";
import { requireStore } from "@/lib/store";
import { money, shortDate } from "@/lib/format";
import Link from "next/link";
import { ClickableRow } from "@/components/side-panel";
import { Fab, FabForm } from "@/components/fab";
import { Field } from "@/components/form-bits";
import { addItem, receiveStock } from "@/app/dashboard/actions";
import { ItemPanel } from "./item-panel";

export const metadata: Metadata = { title: "Inventory" };
export const dynamic = "force-dynamic";

const FILTERS = ["All", "Low stock", "Expiring soon"];

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ q?: string; filter?: string; item?: string; batch?: string }> }) {
  const { q = "", filter = "All", item, batch } = await searchParams;
  // The list as it is (search and filter), with or without an item open on top of it.
  const here = (productId?: string) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (filter !== "All") sp.set("filter", filter);
    if (productId) sp.set("item", productId);
    const s = sp.toString();
    return `/dashboard/inventory${s ? `?${s}` : ""}`;
  };
  const { supabase, store, currency } = await requireStore();

  const { data } = await supabase.from("inventory").select("*").eq("store_id", store.id).order("name");
  const all = data ?? [];
  const soon = Date.now() + 30 * 86_400_000;
  const expiring = (r: (typeof all)[number]) => !!r.earliest_expiry && Date.parse(r.earliest_expiry) <= soon;

  const rows = all.filter(
    (r) =>
      (!q || `${r.name} ${r.sku ?? ""} ${r.upc ?? ""}`.toLowerCase().includes(q.toLowerCase())) &&
      (filter === "Low stock" ? r.is_low_stock : filter === "Expiring soon" ? expiring(r) : true),
  );
  const value = all.reduce((a, r) => a + Number(r.price ?? 0) * Math.max(0, Number(r.available ?? 0)), 0);

  return (
    <>
      <main className="flex w-full max-w-[1360px] flex-col gap-4 p-4 pb-24 sm:p-6 sm:pb-24">
        <h1 className="sr-only">Inventory</h1>
        <div className="flex flex-wrap gap-4">
          <Stat label="Items" value={all.length.toLocaleString("en-US")} />
          <Stat label="Stock value at selling price" value={money(value, currency)} tone="text-primary" />
          <Stat label="Low stock" value={all.filter((r) => r.is_low_stock).length} tone="text-on-amber-c" />
          <Stat label="Batches expiring in 30 days" value={all.filter(expiring).length} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <form className="relative min-w-0 flex-[1_1_260px]" action="/dashboard/inventory">
            <label htmlFor="inv-q" className="sr-only">
              Search inventory
            </label>
            <span className="absolute top-3 left-3.5 text-ink-2"><Icon name="search" size={20} /></span>
            <input id="inv-q" name="q" type="search" defaultValue={q} placeholder="Search by name, SKU or barcode" className="field h-[46px] pl-11" />
            {filter !== "All" && <input type="hidden" name="filter" value={filter} />}
          </form>
          <FilterChips items={FILTERS} active={filter} param="filter" base="/dashboard/inventory" keep={{ q: q || undefined }} className="ml-auto max-w-full" />
        </div>

        <section className="card overflow-hidden p-0">
          {rows.length ? (
            <div className="overflow-x-auto">
              <table className="tbl min-w-[820px]">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Category</th>
                    <th scope="col">Batches</th>
                    <th scope="col">In stock</th>
                    <th scope="col">Status</th>
                    <th scope="col">Earliest expiry</th>
                    <th scope="col" className="text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <ClickableRow key={r.product_id} href={here(r.product_id!)} selected={item === r.product_id}>
                      <td>
                        <span className="flex flex-col">
                          <Link href={here(r.product_id!)} scroll={false}
                prefetch={false} className="font-bold text-ink no-underline hover:text-primary">
                            {r.name}
                          </Link>
                          {r.sku && <span className="text-xs text-ink-2">{r.sku}</span>}
                        </span>
                      </td>
                      <td className="text-ink-2">{r.category_label}</td>
                      <td>{r.batch_count ?? 0}</td>
                      <td className="font-bold">{Number(r.available ?? 0).toLocaleString("en-US")}</td>
                      <td>
                        {r.is_low_stock ? (
                          <span className="pill bg-amber-c text-on-amber-c">LOW</span>
                        ) : (
                          <span className="pill bg-success-container text-on-success-container">IN STOCK</span>
                        )}
                      </td>
                      <td className={expiring(r) ? "font-bold text-error" : "text-ink-2"}>{shortDate(r.earliest_expiry)}</td>
                      <td className="text-right font-bold text-primary">{money(r.price, r.currency ?? currency)}</td>
                    </ClickableRow>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>{all.length ? "No items match that." : "No items yet. Add your first one with the + button."}</Empty>
          )}
        </section>
      </main>
      {item && <ItemPanel productId={item} batchId={batch} closeHref={here()} itemHref={here(item)} />}
      <Fab
        label="Add item or receive stock"
        options={[
          {
            key: "add",
            label: "Add item",
            icon: "plus",
            title: "Add an item",
            panel: (
              <FabForm action={addItem} submit="Save item">
                <Field id="name" label="Item name" placeholder="e.g. Rice 5kg" required autoFocus />
                <Field id="category" label="Category" placeholder="e.g. Food" />
                <Field id="price" label={`Selling price (${currency})`} inputMode="numeric" placeholder="0" required />
                <Field id="quantity" label="Opening stock" inputMode="numeric" placeholder="0" />
                <Field id="cost" label={`Cost each (${currency})`} inputMode="numeric" placeholder="Optional" />
                <Field id="low_stock_threshold" label="Warn when stock falls to" inputMode="numeric" defaultValue="5" />
              </FabForm>
            ),
          },
          {
            key: "receive",
            label: "Receive stock",
            icon: "inventory",
            title: "Receive a delivery",
            disabled: !all.length,
            hint: all.length ? undefined : "Add an item first",
            panel: (
              <FabForm action={receiveStock} submit="Save delivery">
                <div className="flex flex-col gap-1">
                  <label htmlFor="product_id" className="label">
                    Item
                  </label>
                  <select id="product_id" name="product_id" className="field px-3" required autoFocus>
                    {all.map((r) => (
                      <option key={r.product_id} value={r.product_id!}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Field id="quantity" label="Quantity received" inputMode="numeric" required />
                <Field id="cost" label={`Cost each (${currency})`} inputMode="numeric" placeholder="Optional" />
                <Field id="expiry_date" label="Expiry date" type="date" />
              </FabForm>
            ),
          },
        ]}
      />
    </>
  );
}
