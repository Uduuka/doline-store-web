import Link from "next/link";
import { Icon } from "@/components/icons";
import { SidePanel } from "@/components/side-panel";
import { ProgressPill } from "@/components/ui";
import { buyerOf, requireStore } from "@/lib/store";
import { dayKey, money, shortDate, startOfDayISO, time } from "@/lib/format";
import { EditBatchForm, EditItemForm, ReceiveItemForm } from "./item-actions";

const NOT_SALES = ["CANCELLED", "RETURNED", "DRAFT"];
const qty = (n: number) => (+n.toFixed(4)).toLocaleString("en-US");
// Batch levels replayed from sales: fractional units (a bottle is 1/12 of a carton) leave dust past
// two decimals, so these round to two.
const lvl = (n: number) => (+n.toFixed(2)).toLocaleString("en-US");

/**
 * One item, in full: stock and prices, every batch with what it cost and when it expires, and
 * how it has sold lately, with receiving stock and editing its details. Only an item of the open
 * store is shown.
 */
export async function ItemPanel({ productId, batchId, closeHref, itemHref }: { productId: string; batchId?: string; closeHref: string; itemHref: string }) {
  const { supabase, store, currency: storeCurrency } = await requireStore();
  const since = startOfDayISO(29);

  const [{ data: product }, { data: inv }, { data: pricings }, { data: batches }, { data: sold }] = await Promise.all([
    supabase.from("products").select("id, name, description, category_label, sku, upc, low_stock_threshold, created_at").eq("id", productId).eq("store_id", store.id).is("deleted_at", null).maybeSingle(),
    supabase.from("inventory").select("available, is_low_stock, earliest_expiry, price, currency").eq("product_id", productId).eq("store_id", store.id).maybeSingle(),
    supabase.from("product_pricings").select("id, amount, discount, currency, details, flash_amount, flash_expires_at").eq("product_id", productId).is("deleted_at", null).order("updated_at", { ascending: false }),
    supabase
      .from("product_batches")
      .select("id, batch_number, quantity, available, units, buying_price, currency, expiry_date, created_at")
      .eq("product_id", productId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("order_items")
      .select("quantity, returned, units, orders!inner(id, store_id, fulfilment_status, deleted_at)")
      .eq("product_id", productId)
      .eq("orders.store_id", store.id)
      .is("orders.deleted_at", null)
      .not("orders.fulfilment_status", "in", `(${NOT_SALES.join(",")})`)
      .gte("created_at", since),
  ]);
  const recent = await recentSales(supabase, store.id, productId, batches ?? []);

  if (!product) {
    return (
      <SidePanel closeHref={closeHref} title="Item not found">
        <p className="m-0 text-ink-2">This item isn&apos;t in {store.name}. It may have been deleted.</p>
      </SidePanel>
    );
  }

  const currency = inv?.currency || storeCurrency;
  const available = Number(inv?.available ?? 0);
  const baseUnit = batches?.[0]?.units?.trim() || "units";
  const soon = Date.now() + 30 * 86_400_000;
  const stockValue = (batches ?? []).reduce((a, b) => {
    const size = Number(b.quantity);
    return b.buying_price != null && size > 0 ? a + (Number(b.buying_price) / size) * Math.max(0, Number(b.available)) : a;
  }, 0);
  const soldLines = sold ?? [];
  const soldOrders = new Set(soldLines.map((l) => (l.orders as { id: string }).id)).size;
  const soldByUnit = new Map<string, number>();
  for (const l of soldLines) {
    const u = (l.units ?? baseUnit).trim();
    soldByUnit.set(u, (soldByUnit.get(u) ?? 0) + Number(l.quantity) - Number(l.returned ?? 0));
  }

  const batch = batchId ? batches?.find((b) => b.id === batchId) : undefined;
  if (batchId) {
    return (
      <SidePanel closeHref={closeHref} title={batch ? `${product.name} · Batch ${batch.batch_number}` : "Batch not found"}>
        <Link href={itemHref} scroll={false}
                prefetch={false} className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-primary no-underline">
          <span className="rotate-180"><Icon name="arrowRight" size={16} strokeWidth={2.5} /></span> Back to {product.name}
        </Link>
        {batch ? (
          <BatchView batch={batch} baseUnit={baseUnit} currency={currency} />
        ) : (
          <p className="m-0 text-ink-2">This batch isn&apos;t on {product.name}. It may have been deleted.</p>
        )}
      </SidePanel>
    );
  }

  return (
    <SidePanel closeHref={closeHref} title={product.name}>
      <div className="flex flex-wrap items-center gap-2">
        {inv?.is_low_stock ? (
          <span className="pill bg-amber-c text-on-amber-c">LOW</span>
        ) : (
          <span className="pill bg-success-container text-on-success-container">IN STOCK</span>
        )}
        <span className="text-sm text-ink-2">{product.category_label || "No category"}</span>
      </div>

      {/* Stock at a glance */}
      <div className="grid grid-cols-2 gap-3">
        <Tile label="In stock" value={`${qty(available)} ${baseUnit}`} tone={inv?.is_low_stock ? "text-on-amber-c" : "text-ink"} />
        <Tile label="Warn at" value={`${qty(Number(product.low_stock_threshold ?? 0))} ${baseUnit}`} />
        <Tile label="Stock value at cost" value={stockValue > 0 ? money(stockValue, currency) : "—"} />
        <Tile label="Sold, last 30 days" value={soldByUnit.size ? [...soldByUnit].map(([u, n]) => `${qty(n)} ${u}`).join(" · ") : "None"} foot={soldOrders ? `${soldOrders} ${soldOrders === 1 ? "sale" : "sales"}` : undefined} />
      </div>

      <div className="flex flex-wrap gap-2">
        <ReceiveItemForm productId={product.id} currency={currency} />
        <EditItemForm
          productId={product.id}
          name={product.name}
          category={product.category_label ?? ""}
          description={product.description ?? ""}
          lowAt={Number(product.low_stock_threshold ?? 0)}
        />
      </div>

      {product.description && <p className="m-0 text-[15px] leading-relaxed text-ink-2">{product.description}</p>}
      {(product.sku || product.upc) && (
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {product.sku && (
            <>
              <dt className="text-ink-2">SKU</dt>
              <dd className="m-0 font-bold">{product.sku}</dd>
            </>
          )}
          {product.upc && (
            <>
              <dt className="text-ink-2">Barcode</dt>
              <dd className="m-0 font-bold">{product.upc}</dd>
            </>
          )}
        </dl>
      )}

      {/* Prices */}
      <section className="flex flex-col">
        <h3 className="m-0 mb-1 text-base font-extrabold">Prices</h3>
        {pricings?.length ? (
          pricings.map((p) => {
            const d = (p.details ?? {}) as { units?: string; conversionFactor?: number };
            const unit = d.units?.trim() || baseUnit;
            const factor = Number(d.conversionFactor ?? 1);
            const flash = p.flash_amount != null && p.flash_expires_at && Date.parse(p.flash_expires_at) > Date.now();
            return (
              <div key={p.id} className="flex items-center justify-between gap-3 border-b border-surface-mid py-2.5 last:border-0">
                <span className="flex min-w-0 flex-col">
                  <span className="text-[15px] font-bold">Per {unit}</span>
                  {factor !== 1 && unit !== baseUnit && (
                    <span className="text-[13px] text-ink-2">
                      {qty(factor)} {unit} to a {baseUnit}
                    </span>
                  )}
                </span>
                <span className="flex flex-col items-end">
                  <span className="font-extrabold text-primary">{money(flash ? Number(p.flash_amount) : Number(p.amount) - Number(p.discount ?? 0), p.currency || currency)}</span>
                  {flash ? (
                    <span className="text-[13px] font-bold text-error">Flash sale · was {money(Number(p.amount), p.currency || currency)}</span>
                  ) : Number(p.discount ?? 0) > 0 ? (
                    <span className="text-[13px] text-ink-2">{money(Number(p.discount), p.currency || currency)} off</span>
                  ) : null}
                </span>
              </div>
            );
          })
        ) : (
          <p className="m-0 text-ink-2">No price set. It can&apos;t be sold until it has one.</p>
        )}
      </section>

      {/* Batches */}
      <section className="flex flex-col">
        <h3 className="m-0 mb-1 text-base font-extrabold">
          {batches?.length ?? 0} {batches?.length === 1 ? "batch" : "batches"}
        </h3>
        {batches?.length ? (
          batches.map((b) => {
            const size = Number(b.quantity);
            const each = b.buying_price != null && size > 0 ? Number(b.buying_price) / size : null;
            const expSoon = !!b.expiry_date && Date.parse(b.expiry_date) <= soon;
            const empty = Number(b.available) <= 0;
            return (
              <Link
                key={b.id}
                href={`${itemHref}&batch=${b.id}`}
                scroll={false}
                prefetch={false}
                className={`-mx-2 flex items-start justify-between gap-3 rounded-sm border-b border-surface-mid px-2 py-2.5 text-ink no-underline last:border-0 hover:bg-surface-low ${empty ? "opacity-60" : ""}`}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="text-[15px] font-bold">Batch {b.batch_number}</span>
                  <span className="text-[13px] text-ink-2">
                    Received {shortDate(b.created_at)}
                    {each != null && ` · ${money(each, b.currency || currency)} each`}
                  </span>
                  {b.expiry_date && <span className={`text-[13px] ${expSoon ? "font-bold text-error" : "text-ink-2"}`}>Expires {shortDate(b.expiry_date)}</span>}
                </span>
                <span className="flex flex-none flex-col items-end text-sm">
                  <span className="font-extrabold">
                    {qty(Number(b.available))} left
                  </span>
                  <span className="text-[13px] text-ink-2">
                    of {qty(size)} {b.units?.trim() || baseUnit}
                  </span>
                </span>
              </Link>
            );
          })
        ) : (
          <p className="m-0 text-ink-2">No stock received yet.</p>
        )}
      </section>

      <SalesList title="Recent sales" sales={recent} baseUnit={baseUnit} empty="Not sold yet." />
    </SidePanel>
  );
}

function Tile({ label, value, tone = "text-ink", foot }: { label: string; value: string; tone?: string; foot?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md bg-surface-low p-3">
      <span className="text-xs font-bold text-ink-2">{label}</span>
      <span className={`text-[17px] leading-snug font-extrabold ${tone}`}>{value}</span>
      {foot && <span className="text-xs text-ink-2">{foot}</span>}
    </div>
  );
}

type Supabase = Awaited<ReturnType<typeof requireStore>>["supabase"];
type Movement = { batch: string; before: number; after: number; drawn: number; units: string; cancelled: boolean };
type Sale = { orderId: string; at: string; who: string; status: string; qty: number; returned: number; units: string | null; moves: Movement[] };
type BatchInfo = { id: string; batch_number: string; quantity: number | string; units: string | null };

/** Every draw on the given batches by a sale line, with what's needed to replay the batch's stock. */
async function batchDraws(supabase: Supabase, storeId: string, batchIds: string[]) {
  if (!batchIds.length) return [];
  const { data } = await supabase
    .from("order_item_batches")
    .select("batch_id, quantity, order_item_id, order_items!inner(order_id, created_at, quantity, returned, orders!inner(store_id, deleted_at, fulfilment_status))")
    .in("batch_id", batchIds)
    .eq("order_items.orders.store_id", storeId)
    .is("order_items.orders.deleted_at", null);
  type Row = {
    batch_id: string;
    quantity: number;
    order_item_id: string;
    order_items: { order_id: string; created_at: string; quantity: number; returned: number | null; orders: { fulfilment_status: string } };
  };
  return ((data ?? []) as unknown as Row[]).map((r) => ({
    batchId: r.batch_id,
    itemId: r.order_item_id,
    orderId: r.order_items.order_id,
    at: r.order_items.created_at,
    drawn: Number(r.quantity),
    lineQty: Number(r.order_items.quantity),
    lineReturned: Number(r.order_items.returned ?? 0),
    cancelled: r.order_items.orders.fulfilment_status === "CANCELLED",
  }));
}
type DrawRow = Awaited<ReturnType<typeof batchDraws>>[number];

/**
 * Replays each batch from what it received: every sale, oldest first, takes its draw; what an
 * earlier sale gave back (returns, or the whole draw if the order was cancelled) is back on the
 * shelf for the sales after it. There's no stock log, so a count corrected by hand between sales
 * doesn't show here. Keyed by "order item id:batch id".
 */
function replay(draws: DrawRow[], batches: BatchInfo[], baseUnit: string): Map<string, Movement> {
  const info = new Map(batches.map((b) => [b.id, b]));
  const out = new Map<string, Movement>();
  const byBatch = new Map<string, DrawRow[]>();
  for (const d of draws) byBatch.set(d.batchId, [...(byBatch.get(d.batchId) ?? []), d]);
  for (const [batchId, list] of byBatch) {
    const b = info.get(batchId);
    if (!b) continue;
    let level = Number(b.quantity);
    list.sort((x, y) => x.at.localeCompare(y.at) || x.itemId.localeCompare(y.itemId));
    for (const d of list) {
      const after = level - d.drawn;
      out.set(`${d.itemId}:${batchId}`, { batch: b.batch_number, before: level, after, drawn: d.drawn, units: b.units?.trim() || baseUnit, cancelled: d.cancelled });
      const kept = d.cancelled ? 0 : d.lineQty > 0 ? d.drawn * (1 - d.lineReturned / d.lineQty) : d.drawn;
      level -= kept;
    }
  }
  return out;
}

/** The item's last ten sale lines, newest first: who bought, where the order stands, and the batches each drew from. */
async function recentSales(supabase: Supabase, storeId: string, productId: string, batches: BatchInfo[]): Promise<Sale[]> {
  const [{ data: lines }, draws] = await Promise.all([
    supabase
      .from("order_items")
      .select("id, quantity, returned, units, created_at, order_id, orders!inner(store_id, deleted_at)")
      .eq("product_id", productId)
      .eq("orders.store_id", storeId)
      .is("orders.deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(10),
    batchDraws(supabase, storeId, batches.map((b) => b.id)),
  ]);
  const baseUnit = batches[0]?.units?.trim() || "units";
  const moves = replay(draws, batches, baseUnit);
  return withOrders(
    supabase,
    storeId,
    (lines ?? []).map((l) => ({
      orderId: l.order_id,
      at: l.created_at,
      qty: Number(l.quantity),
      returned: Number(l.returned ?? 0),
      units: l.units,
      moves: draws
        .filter((d) => d.itemId === l.id)
        .map((d) => moves.get(`${d.itemId}:${d.batchId}`))
        .filter((m): m is Movement => !!m),
    })),
  );
}

/** Adds each sale's buyer and order stage from orders_view. */
async function withOrders(supabase: Supabase, storeId: string, rows: Omit<Sale, "who" | "status">[]): Promise<Sale[]> {
  if (!rows.length) return [];
  const { data: orders } = await supabase
    .from("orders_view")
    .select("id, buyer_name, client_name, fulfilment_status")
    .eq("store_id", storeId)
    .in("id", [...new Set(rows.map((r) => r.orderId))]);
  const byId = new Map((orders ?? []).map((o) => [o.id, o]));
  return rows.map((r) => {
    const o = byId.get(r.orderId);
    return { ...r, who: buyerOf(o ?? {}), status: o?.fulfilment_status ?? "COMPLETED" };
  });
}

/** Sale lines, each opening its order on the Orders page, with each batch's stock before → after. */
function SalesList({ title, sales, baseUnit, empty, showBatch = true }: { title: string; sales: Sale[]; baseUnit: string; empty: string; showBatch?: boolean }) {
  return (
    <section className="flex flex-col">
      <h3 className="m-0 mb-1 text-base font-extrabold">{title}</h3>
      {sales.length ? (
        sales.map((s, i) => (
          <Link
            key={`${s.orderId}-${i}`}
            href={`/dashboard/orders?order=${s.orderId}`}
            className="-mx-2 flex items-start justify-between gap-3 rounded-sm border-b border-surface-mid px-2 py-2.5 text-ink no-underline last:border-0 hover:bg-surface-low"
          >
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-[15px] font-bold">{s.who}</span>
              <span className="text-[13px] text-ink-2">
                {shortDate(s.at)} · {time(s.at)} · #{s.orderId.slice(-6).toUpperCase()}
              </span>
              {s.moves.map((m) => (
                <span key={m.batch} className="text-[13px] text-ink-2 tabular-nums">
                  {showBatch && <span className="font-bold text-ink">Batch {m.batch} · </span>}
                  <span className={m.cancelled ? "line-through" : ""}>
                    {lvl(m.before)} → {lvl(m.after)} {m.units}
                  </span>{" "}
                  (drew {lvl(m.drawn)}
                  {m.cancelled ? ", put back" : ""})
                </span>
              ))}
            </span>
            <span className="flex flex-none flex-col items-end gap-1">
              <span className="text-sm font-extrabold">
                {qty(s.qty)} {(s.units ?? baseUnit).trim()}
              </span>
              {s.returned > 0 ? <span className="text-[12px] font-bold text-error">{qty(s.returned)} returned</span> : <ProgressPill status={s.status} />}
            </span>
          </Link>
        ))
      ) : (
        <p className="m-0 text-ink-2">{empty}</p>
      )}
    </section>
  );
}

type Batch = {
  id: string;
  batch_number: string;
  quantity: number;
  available: number;
  units: string | null;
  buying_price: number | null;
  currency: string | null;
  expiry_date: string | null;
  created_at: string;
};

/** One batch: what came in, what it cost, what's left and who it went to, editable in place. */
async function BatchView({ batch: b, baseUnit, currency }: { batch: Batch; baseUnit: string; currency: string }) {
  const { supabase, store } = await requireStore();
  const [{ data: full }, draws] = await Promise.all([
    supabase.from("product_batches").select("manufacture_date, updated_at").eq("id", b.id).maybeSingle(),
    batchDraws(supabase, store.id, [b.id]),
  ]);

  const units = b.units?.trim() || baseUnit;
  const size = Number(b.quantity);
  const left = Number(b.available);
  const each = b.buying_price != null && size > 0 ? Number(b.buying_price) / size : null;
  const cur = b.currency || currency;
  const soon = Date.now() + 30 * 86_400_000;
  const expSoon = !!b.expiry_date && Date.parse(b.expiry_date) <= soon;
  const expired = !!b.expiry_date && Date.parse(b.expiry_date) < Date.now();

  const moves = replay(draws, [b], units);
  const rows = [...draws]
    .sort((x, y) => y.at.localeCompare(x.at) || y.itemId.localeCompare(x.itemId))
    .map((d) => ({
      orderId: d.orderId,
      at: d.at,
      // What this batch gave the line, in the batch's own units.
      qty: d.drawn,
      returned: d.lineQty > 0 ? (d.drawn * d.lineReturned) / d.lineQty : 0,
      units,
      cancelled: d.cancelled,
      moves: [moves.get(`${d.itemId}:${b.id}`)].filter((m): m is Movement => !!m),
    }));
  // Net of returns and of cancelled orders, whose stock went back on the shelf.
  const live = rows.filter((r) => !r.cancelled);
  const out = live.reduce((a, r) => a + r.qty - r.returned, 0);
  const sales = await withOrders(supabase, store.id, rows.slice(0, 10).map(({ cancelled: _c, ...r }) => r));

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {left <= 0 ? (
          <span className="pill bg-surface-variant text-ink-2">EMPTY</span>
        ) : expired ? (
          <span className="pill bg-error-container text-on-error-container">EXPIRED</span>
        ) : expSoon ? (
          <span className="pill bg-amber-c text-on-amber-c">EXPIRES SOON</span>
        ) : (
          <span className="pill bg-success-container text-on-success-container">IN STOCK</span>
        )}
        <span className="text-sm text-ink-2">Received {shortDate(b.created_at)}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Tile label="Left" value={`${qty(left)} ${units}`} foot={`of ${qty(size)} received`} />
        <Tile label="Sold from this batch" value={`${qty(out)} ${units}`} foot={live.length ? `${live.length} ${live.length === 1 ? "sale" : "sales"}` : undefined} />
        <Tile label="Cost each" value={each != null ? money(each, cur) : "Not entered"} foot={b.buying_price != null ? `${money(Number(b.buying_price), cur)} for the batch` : undefined} />
        <Tile label="Value left at cost" value={each != null ? money(each * Math.max(0, left), cur) : "—"} />
      </div>

      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[15px]">
        <dt className="text-ink-2">Expires</dt>
        <dd className={`m-0 font-bold ${expSoon ? "text-error" : ""}`}>{b.expiry_date ? shortDate(b.expiry_date) : "No date"}</dd>
        <dt className="text-ink-2">Manufactured</dt>
        <dd className="m-0 font-bold">{full?.manufacture_date ? shortDate(full.manufacture_date) : "No date"}</dd>
        {full?.updated_at && (
          <>
            <dt className="text-ink-2">Last changed</dt>
            <dd className="m-0 font-bold">
              {shortDate(full.updated_at)} · {time(full.updated_at)}
            </dd>
          </>
        )}
      </dl>

      <EditBatchForm
        batchId={b.id}
        batchNumber={b.batch_number}
        costEach={each}
        available={left}
        received={size}
        units={units}
        expiry={b.expiry_date ? dayKey(b.expiry_date) : ""}
        manufactured={full?.manufacture_date ? dayKey(full.manufacture_date) : ""}
        currency={cur}
      />

      <SalesList title="Sold from this batch" sales={sales} baseUnit={units} empty="Nothing sold from this batch yet." showBatch={false} />
    </>
  );
}
