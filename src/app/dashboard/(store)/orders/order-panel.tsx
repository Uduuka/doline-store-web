import { ProgressPill, PAYMENT_INK } from "@/components/ui";
import { buyerOf, requireStore } from "@/lib/store";
import { money, shortDate, time } from "@/lib/format";
import { ClientForm, PaymentForm, ReturnForm, StatusActions } from "./order-actions";
import { SidePanel } from "@/components/side-panel";

type Item = { order_item_id: string; name: string; quantity: number; returned: number; units: string | null };

const METHOD: Record<string, string> = { cash: "Cash", mobile_money: "Mobile money", card: "Card", bank: "Bank" };

/** An address however the app stored it: text, or an object of named parts. */
function addressText(a: unknown): string | null {
  if (!a) return null;
  if (typeof a === "string") return a;
  if (typeof a === "object") {
    const parts = Object.values(a as Record<string, unknown>).filter((v) => typeof v === "string" && v.trim());
    return parts.length ? parts.join(", ") : null;
  }
  return null;
}

/**
 * One order, in full: who, what, how it was paid and where it stands, with what can be done to
 * it next. Only an order of the store that's open is shown.
 */
export async function OrderPanel({ orderId, closeHref }: { orderId: string; closeHref: string }) {
  const { supabase, store, currency: storeCurrency } = await requireStore();

  const [{ data: o }, { data: v }, { data: payments }, { data: clients }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, created_at, channel, client_id, staff_id, payment_status, fulfilment_status, amount, discount, delivery_fee, service_fee, tip, received, currency, delivery_address, message, has_returns")
      .eq("id", orderId)
      .eq("store_id", store.id)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase.from("orders_view").select("items, buyer_name, client_name").eq("id", orderId).eq("store_id", store.id).maybeSingle(),
    supabase.from("order_payments").select("id, amount, method, created_at").eq("order_id", orderId).order("created_at"),
    supabase.from("clients").select("id, store_contacts(name)").eq("store_id", store.id).is("deleted_at", null),
  ]);

  if (!o) {
    return (
      <SidePanel closeHref={closeHref} title="Order not found">
        <p className="m-0 text-ink-2">This order isn&apos;t in {store.name}. It may have been deleted, or belong to another of your stores.</p>
      </SidePanel>
    );
  }

  let staffName: string | null = null;
  if (o.staff_id) {
    const { data: staff } = await supabase.from("store_staff").select("store_contacts(name)").eq("id", o.staff_id).maybeSingle();
    staffName = (staff?.store_contacts as { name: string | null } | null)?.name ?? null;
  }

  const currency = o.currency || storeCurrency;
  const fmt = (n: number) => money(n, currency);
  const total = Number(o.amount) - Number(o.discount) + Number(o.delivery_fee) + Number(o.service_fee);
  const due = Math.max(0, total - Number(o.received));
  const items = ((v?.items as Item[] | null) ?? []).map((i) => ({
    id: i.order_item_id,
    name: i.name,
    quantity: Number(i.quantity),
    returned: Number(i.returned ?? 0),
    units: i.units,
  }));
  const clientList = (clients ?? [])
    .map((c) => ({ id: c.id, name: (c.store_contacts as { name: string | null } | null)?.name || "Client" }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const online = o.channel === "online";
  const address = addressText(o.delivery_address);
  const live = o.fulfilment_status !== "CANCELLED" && o.fulfilment_status !== "DRAFT";
  const ref = `#${o.id.slice(-6).toUpperCase()}`;

  return (
    <SidePanel closeHref={closeHref} title={`Order ${ref}`}>
      {/* Where it stands */}
      <div className="flex flex-wrap items-center gap-2">
        <ProgressPill status={o.fulfilment_status} />
        <span className={`text-[13px] font-extrabold ${PAYMENT_INK[o.payment_status] ?? ""}`}>{o.payment_status.replace("_", " ")}</span>
        <span className={`ml-auto text-sm font-bold ${online ? "text-primary" : "text-ink-2"}`}>{online ? "DolineMarket" : "In store"}</span>
      </div>

      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[15px]">
        <dt className="text-ink-2">When</dt>
        <dd className="m-0 font-bold">
          {shortDate(o.created_at)} · {time(o.created_at)}
        </dd>
        <dt className="text-ink-2">{online ? "Buyer" : "Client"}</dt>
        <dd className="m-0 font-bold">{buyerOf(v ?? {})}</dd>
        {staffName && (
          <>
            <dt className="text-ink-2">Sold by</dt>
            <dd className="m-0 font-bold">{staffName}</dd>
          </>
        )}
        {address && (
          <>
            <dt className="text-ink-2">Deliver to</dt>
            <dd className="m-0 font-bold">{address}</dd>
          </>
        )}
      </dl>
      {o.message && <p className="m-0 rounded-sm bg-surface-low p-3 text-[15px] italic">&ldquo;{o.message}&rdquo;</p>}

      {/* Actions on the order's stage */}
      <StatusActions orderId={o.id} status={o.fulfilment_status} />

      {/* Items */}
      <section className="flex flex-col">
        <h3 className="m-0 mb-1 text-base font-extrabold">
          {items.length} {items.length === 1 ? "item" : "items"}
        </h3>
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between gap-3 border-b border-surface-mid py-2.5 last:border-0">
            <span className="min-w-0 truncate text-[15px] font-bold">{i.name}</span>
            <span className="flex flex-none flex-col items-end text-sm">
              <span className="font-bold">
                {+i.quantity.toFixed(4)} {i.units ?? ""}
              </span>
              {i.returned > 0 && <span className="text-[13px] font-bold text-error">{+i.returned.toFixed(4)} returned</span>}
            </span>
          </div>
        ))}
      </section>
      {o.fulfilment_status === "COMPLETED" && <ReturnForm orderId={o.id} lines={items} />}

      {/* Money */}
      <section className="flex flex-col gap-1.5 rounded-md bg-surface-low p-4 text-[15px]">
        <Row label="Items" value={fmt(Number(o.amount))} />
        {Number(o.discount) > 0 && <Row label="Discount" value={`−${fmt(Number(o.discount))}`} />}
        {Number(o.delivery_fee) > 0 && <Row label="Delivery" value={fmt(Number(o.delivery_fee))} />}
        {Number(o.service_fee) > 0 && <Row label="Service fee" value={fmt(Number(o.service_fee))} />}
        <div className="mt-1 flex items-baseline justify-between border-t border-surface-variant pt-2">
          <span className="font-bold">Total</span>
          <span className="text-xl font-extrabold text-primary">{fmt(total)}</span>
        </div>
        <Row label="Paid" value={fmt(Number(o.received))} />
        <div className="flex justify-between">
          <span className="text-ink-2">Balance</span>
          <span className={`font-extrabold ${due > 0 ? "text-error" : "text-success"}`}>{due > 0 ? fmt(due) : "Settled"}</span>
        </div>
      </section>

      {payments?.length ? (
        <section className="flex flex-col">
          <h3 className="m-0 mb-1 text-base font-extrabold">Payments</h3>
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 border-b border-surface-mid py-2 text-sm last:border-0">
              <span>
                <span className="font-bold">{METHOD[p.method] ?? p.method}</span>
                <span className="text-ink-2">
                  {" "}
                  · {shortDate(p.created_at)} {time(p.created_at)}
                </span>
              </span>
              <span className="font-bold">{fmt(Number(p.amount))}</span>
            </div>
          ))}
        </section>
      ) : null}

      {live && due > 0 && <PaymentForm orderId={o.id} due={due} currency={currency} />}

      {!online && (
        <section className="flex flex-col gap-2">
          <h3 className="m-0 text-base font-extrabold">Client</h3>
          <ClientForm orderId={o.id} clientId={o.client_id} clients={clientList} />
        </section>
      )}
    </SidePanel>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-2">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
