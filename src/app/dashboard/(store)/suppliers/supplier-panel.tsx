import Link from "next/link";
import { EditContactForm } from "@/components/contact-form";
import { SidePanel } from "@/components/side-panel";
import { ProgressPill } from "@/components/ui";
import { requireStore } from "@/lib/store";
import { money, shortDate, time } from "@/lib/format";
import { updateSupplier } from "@/app/dashboard/actions";
import { DolineOrderForm, MessageOrderForm, type CatalogueLine } from "./supplier-order";

const qty = (n: number) => (+n.toFixed(2)).toLocaleString("en-US");

/**
 * One supplier: how to reach them and the goods they supply. Every supplier lists the store's
 * items linked to it (product_suppliers) with stock and the latest cost paid. A linked Doline Store
 * shop also lists the restock orders this account placed with it: the goods it actually sold us.
 * Only a supplier of the open store.
 */
export async function SupplierPanel({ supplierId, closeHref }: { supplierId: string; closeHref: string }) {
  const { supabase, store, user, currency } = await requireStore();
  const now = Date.now();
  // The same rule as the cloud's effective_price(): a running flash sale, else the amount less its discount.
  const effective = (p: { amount: number; discount: number | null; flash_amount: number | null; flash_starts_at: string | null; flash_expires_at: string | null }) =>
    p.flash_amount != null && p.flash_expires_at && Date.parse(p.flash_expires_at) > now && (!p.flash_starts_at || Date.parse(p.flash_starts_at) <= now)
      ? Number(p.flash_amount)
      : Number(p.amount) - Number(p.discount ?? 0);

  const { data: s } = await supabase
    .from("suppliers")
    .select("id, created_at, supplier_store_id, store_contacts(name, phone, email, address)")
    .eq("id", supplierId)
    .eq("store_id", store.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!s) {
    return (
      <SidePanel closeHref={closeHref} title="Supplier not found">
        <p className="m-0 text-ink-2">This supplier isn&apos;t in {store.name}. They may have been removed.</p>
      </SidePanel>
    );
  }

  const [{ data: links }, { data: shop }, { data: orders }] = await Promise.all([
    supabase.from("product_suppliers").select("product_id, supplier_product_id, supplier_sku").eq("supplier_id", s.id),
    s.supplier_store_id ? supabase.from("stores").select("name, address").eq("id", s.supplier_store_id).maybeSingle() : Promise.resolve({ data: null }),
    // Restock orders this account placed in the supplier's shop (it can read them as the buyer).
    s.supplier_store_id
      ? supabase
          .from("orders")
          .select("id, created_at, fulfilment_status, payment_status, amount, discount, delivery_fee, service_fee, currency")
          .eq("store_id", s.supplier_store_id)
          .eq("buyer_profile_id", user.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(20)
      : Promise.resolve({ data: [] as never[] }),
  ]);

  const productIds = (links ?? []).map((l) => l.product_id);
  const orderIds = (orders ?? []).map((o) => o.id);
  const [{ data: items }, { data: batches }, { data: lines }, { data: catalogue }, { data: addresses }] = await Promise.all([
    productIds.length
      ? supabase.from("inventory").select("product_id, name, available, is_low_stock, price, currency").in("product_id", productIds).eq("store_id", store.id)
      : Promise.resolve({ data: [] as never[] }),
    productIds.length
      ? supabase.from("product_batches").select("product_id, quantity, buying_price, units, created_at").in("product_id", productIds).is("deleted_at", null).order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as never[] }),
    orderIds.length ? supabase.from("order_items").select("order_id, product_id, quantity, units").in("order_id", orderIds) : Promise.resolve({ data: [] as never[] }),
    // What a linked shop sells: the items it lists on DolineMarket, each priced option orderable.
    s.supplier_store_id
      ? supabase
          .from("products")
          .select("id, name, product_pricings(id, amount, discount, flash_amount, flash_starts_at, flash_expires_at, currency, details, deleted_at), product_batches(available, deleted_at)")
          .eq("store_id", s.supplier_store_id)
          .is("deleted_at", null)
          .order("name")
      : Promise.resolve({ data: [] as never[] }),
    s.supplier_store_id
      ? supabase.from("addresses").select("id, label, address, area, is_default").eq("profile_id", user.id).is("deleted_at", null).order("is_default", { ascending: false })
      : Promise.resolve({ data: [] as never[] }),
  ]);

  const c = (s.store_contacts as { name: string; phone: string | null; email: string | null; address: string | null } | null) ?? {
    name: "Supplier",
    phone: null,
    email: null,
    address: null,
  };
  const name = shop?.name ?? c.name;
  const onDoline = !!s.supplier_store_id;
  const wa = c.phone ? c.phone.replace(/[^\d]/g, "") : "";

  // The latest batch of each item: when it last came in and what one cost.
  const lastBatch = new Map<string, { at: string; each: number | null; units: string | null }>();
  for (const b of batches ?? []) {
    if (lastBatch.has(b.product_id)) continue;
    const size = Number(b.quantity);
    lastBatch.set(b.product_id, { at: b.created_at, each: b.buying_price != null && size > 0 ? Number(b.buying_price) / size : null, units: b.units?.trim() || null });
  }
  type Good = { product_id: string; name: string | null; available: number | null; is_low_stock: boolean | null; price: number | null; currency: string | null };
  const goods = ((items ?? []) as Good[])
    .map((i) => ({ ...i, last: lastBatch.get(i.product_id) }))
    .sort((a, b) => Number(b.is_low_stock) - Number(a.is_low_stock) || (a.name ?? "").localeCompare(b.name ?? ""));
  const low = goods.filter((g) => g.is_low_stock).length;

  // Their catalogue, matched to our items through the links made when restocking from them.
  const oursBySupplierProduct = new Map<string, { name: string; low: boolean }>();
  for (const l of links ?? []) {
    const g = goods.find((x) => x.product_id === l.product_id);
    if (l.supplier_product_id && g) oursBySupplierProduct.set(l.supplier_product_id, { name: g.name ?? "Item", low: !!g.is_low_stock });
  }
  type CatProduct = {
    id: string;
    name: string;
    product_pricings: { id: string; amount: number; discount: number | null; flash_amount: number | null; flash_starts_at: string | null; flash_expires_at: string | null; currency: string; details: { units?: string } | null; deleted_at: string | null }[];
    product_batches: { available: number; deleted_at: string | null }[];
  };
  const orderLines: CatalogueLine[] = ((catalogue ?? []) as unknown as CatProduct[])
    .flatMap((p) => {
      const stock = p.product_batches?.length ? p.product_batches.filter((b) => !b.deleted_at).reduce((a, b) => a + Number(b.available), 0) : null;
      return (p.product_pricings ?? [])
        .filter((pp) => !pp.deleted_at)
        .map((pp) => ({
          pricingId: pp.id,
          name: p.name,
          units: pp.details?.units?.trim() || "units",
          price: effective(pp),
          currency: pp.currency,
          stock,
          ours: oursBySupplierProduct.get(p.id),
        }));
    })
    // What we restock from them first, running low before the rest; then everything else.
    .sort((a, b) => Number(!!b.ours) - Number(!!a.ours) || Number(!!b.ours?.low) - Number(!!a.ours?.low) || a.name.localeCompare(b.name));
  const addressList = (addresses ?? []).map((a) => ({ id: a.id, label: [a.label, a.address, a.area].filter(Boolean).join(" · ") || "Saved address" }));

  // Supplier's products → our names, through the links made when restocking from them.
  const ourName = new Map<string, string>();
  const nameOf = new Map((items ?? []).map((i) => [i.product_id, i.name]));
  for (const l of links ?? []) if (l.supplier_product_id) ourName.set(l.supplier_product_id, nameOf.get(l.product_id) ?? "Item");
  const linesOf = new Map<string, { name: string; quantity: number; units: string | null }[]>();
  for (const l of lines ?? []) {
    linesOf.set(l.order_id, [...(linesOf.get(l.order_id) ?? []), { name: ourName.get(l.product_id) ?? "Item", quantity: Number(l.quantity), units: l.units?.trim() || null }]);
  }
  const bought = (orders ?? []).filter((o) => o.fulfilment_status !== "CANCELLED" && o.fulfilment_status !== "DRAFT");
  const spent = bought.reduce((a, o) => a + Number(o.amount) - Number(o.discount) + Number(o.delivery_fee) + Number(o.service_fee), 0);

  return (
    <SidePanel closeHref={closeHref} title={name}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`pill ${onDoline ? "bg-primary-container text-primary" : "bg-slate-c text-on-slate-c"}`}>{onDoline ? "ON DOLINE STORE · WHOLESALE" : "YOUR SUPPLIER"}</span>
        <span className="text-sm text-ink-2">Since {shortDate(s.created_at)}</span>
      </div>

      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[15px]">
        {onDoline && c.name !== name && (
          <>
            <dt className="text-ink-2">Contact</dt>
            <dd className="m-0 font-bold">{c.name}</dd>
          </>
        )}
        {c.phone && (
          <>
            <dt className="text-ink-2">Phone</dt>
            <dd className="m-0 flex flex-wrap gap-x-3 font-bold">
              <a href={`tel:${c.phone}`}>{c.phone}</a>
              {wa.length >= 9 && (
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="text-primary">
                  WhatsApp
                </a>
              )}
            </dd>
          </>
        )}
        {c.email && (
          <>
            <dt className="text-ink-2">Email</dt>
            <dd className="m-0 truncate font-bold">
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </dd>
          </>
        )}
        {(shop?.address ?? c.address) && (
          <>
            <dt className="text-ink-2">Address</dt>
            <dd className="m-0 font-bold">{shop?.address ?? c.address}</dd>
          </>
        )}
      </dl>

      <div className="grid grid-cols-2 gap-3">
        <Tile label="Items supplied" value={goods.length.toLocaleString("en-US")} />
        <Tile label="Running low" value={low.toLocaleString("en-US")} tone={low ? "text-on-amber-c" : "text-ink"} />
        {onDoline && (
          <>
            <Tile label="Restock orders" value={bought.length.toLocaleString("en-US")} />
            <Tile label="Spent with them" value={money(spent, orders?.[0]?.currency ?? currency)} tone="text-primary" />
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {onDoline ? (
          <DolineOrderForm supplierId={s.id} supplierName={name} lines={orderLines} addresses={addressList} />
        ) : (
          <MessageOrderForm
            supplierName={c.name}
            storeName={store.name}
            phone={c.phone}
            lines={goods.map((g) => ({ id: g.product_id, name: g.name ?? "Item", units: g.last?.units ?? "units", low: !!g.is_low_stock }))}
          />
        )}
        <EditContactForm
          action={updateSupplier}
          idField="supplier_id"
          id={s.id}
          name={c.name}
          phone={c.phone ?? ""}
          email={c.email ?? ""}
          address={c.address ?? ""}
          note={onDoline ? "These are your own contact details for them. Their shop's name and address come from Doline Store." : undefined}
        />
      </div>

      {/* Goods they supply */}
      <section className="flex flex-col">
        <h3 className="m-0 mb-1 text-base font-extrabold">Goods they supply</h3>
        {goods.length ? (
          goods.map((g) => (
            <Link
              key={g.product_id}
              href={`/dashboard/inventory?item=${g.product_id}`}
              className="-mx-2 flex items-center justify-between gap-3 rounded-sm border-b border-surface-mid px-2 py-2.5 text-ink no-underline last:border-0 hover:bg-surface-low"
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[15px] font-bold">{g.name}</span>
                <span className="text-[13px] text-ink-2">
                  {g.last ? `Last in ${shortDate(g.last.at)}${g.last.each != null ? ` · ${money(g.last.each, g.currency ?? currency)} each` : ""}` : "Not received yet"}
                </span>
              </span>
              <span className="flex flex-none flex-col items-end gap-1">
                <span className="text-sm font-extrabold">
                  {qty(Number(g.available ?? 0))} {g.last?.units ?? ""} left
                </span>
                {g.is_low_stock ? <span className="pill bg-amber-c text-on-amber-c">LOW</span> : <span className="text-[12px] text-ink-2">Sells at {money(g.price, g.currency ?? currency)}</span>}
              </span>
            </Link>
          ))
        ) : (
          <p className="m-0 text-ink-2">No items linked to this supplier yet. Link them in the Doline Store app.</p>
        )}
      </section>

      {/* What a Doline Store supplier sold us */}
      {onDoline && (
        <section className="flex flex-col">
          <h3 className="m-0 mb-1 text-base font-extrabold">Bought from them</h3>
          {orders?.length ? (
            orders.map((o) => {
              const ls = linesOf.get(o.id) ?? [];
              const total = Number(o.amount) - Number(o.discount) + Number(o.delivery_fee) + Number(o.service_fee);
              return (
                <div key={o.id} className="flex flex-col gap-1.5 border-b border-surface-mid py-2.5 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex min-w-0 flex-col">
                      <span className="text-[15px] font-bold">
                        {shortDate(o.created_at)} · {time(o.created_at)}
                      </span>
                      <span className="text-[13px] text-ink-2">
                        #{o.id.slice(-6).toUpperCase()} · {ls.length} {ls.length === 1 ? "item" : "items"}
                      </span>
                    </span>
                    <span className="flex flex-none flex-col items-end gap-1">
                      <span className={`font-extrabold ${o.fulfilment_status === "CANCELLED" ? "text-ink-2 line-through" : "text-primary"}`}>{money(total, o.currency ?? currency)}</span>
                      <ProgressPill status={o.fulfilment_status} />
                    </span>
                  </div>
                  {ls.length > 0 && (
                    <ul className="m-0 flex list-none flex-col gap-0.5 p-0 text-[13px] text-ink-2">
                      {ls.map((l, i) => (
                        <li key={i} className="flex justify-between gap-3">
                          <span className="truncate">{l.name}</span>
                          <span className="flex-none font-bold text-ink">
                            {qty(l.quantity)} {l.units ?? ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          ) : (
            <p className="m-0 text-ink-2">No restock orders placed with {name} yet.</p>
          )}
        </section>
      )}
    </SidePanel>
  );
}

function Tile({ label, value, tone = "text-ink" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md bg-surface-low p-3">
      <span className="text-xs font-bold text-ink-2">{label}</span>
      <span className={`text-[17px] leading-snug font-extrabold ${tone}`}>{value}</span>
    </div>
  );
}
