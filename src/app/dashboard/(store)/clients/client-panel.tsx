import Link from "next/link";
import { SidePanel } from "@/components/side-panel";
import { PAYMENT_INK, ProgressPill } from "@/components/ui";
import { requireStore } from "@/lib/store";
import { money, shortDate, time } from "@/lib/format";
import { EditContactForm } from "@/components/contact-form";
import { updateClient } from "@/app/dashboard/actions";
import { ClientPaymentForm } from "./client-actions";

const NOT_SALES = ["CANCELLED", "RETURNED", "DRAFT"];
const METHOD: Record<string, string> = { cash: "Cash", mobile_money: "Mobile money", card: "Card", bank: "Bank" };

/**
 * One client: how to reach them, what they owe and which sales it's on, what they've bought and
 * paid, with taking a payment and editing their details. Only a client of the open store.
 */
export async function ClientPanel({ clientId, closeHref }: { clientId: string; closeHref: string }) {
  const { supabase, store, currency } = await requireStore();

  const [{ data: client }, { data: orders }, { data: payments }] = await Promise.all([
    supabase
      .from("clients")
      .select("id, created_at, store_contacts(name, phone, email, address)")
      .eq("id", clientId)
      .eq("store_id", store.id)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("orders_view")
      .select("id, created_at, payment_status, fulfilment_status, amount, balance, currency, item_count")
      .eq("store_id", store.id)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false }),
    supabase
      .from("order_payments")
      .select("id, amount, method, created_at, order_id, orders!inner(store_id, client_id)")
      .eq("orders.store_id", store.id)
      .eq("orders.client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (!client) {
    return (
      <SidePanel closeHref={closeHref} title="Client not found">
        <p className="m-0 text-ink-2">This client isn&apos;t in {store.name}. They may have been removed.</p>
      </SidePanel>
    );
  }

  const c = (client.store_contacts as { name: string; phone: string | null; email: string | null; address: string | null } | null) ?? {
    name: "Client",
    phone: null,
    email: null,
    address: null,
  };
  const all = orders ?? [];
  const sales = all.filter((o) => !NOT_SALES.includes(o.fulfilment_status ?? ""));
  // Settled oldest first, so that's the order they're listed in.
  const unpaid = all.filter((o) => o.payment_status === "CREDIT" && Number(o.balance) > 0).reverse();
  const owed = unpaid.reduce((a, o) => a + Number(o.balance), 0);
  const bought = sales.reduce((a, o) => a + Number(o.amount), 0);
  const first = sales.at(-1)?.created_at;
  const wa = c.phone ? c.phone.replace(/[^\d]/g, "") : "";

  return (
    <SidePanel closeHref={closeHref} title={c.name}>
      <div className="flex flex-wrap items-center gap-2">
        {owed > 0 ? (
          <span className="pill bg-error-container text-on-error-container">OWES</span>
        ) : (
          <span className="pill bg-success-container text-on-success-container">CLEARED</span>
        )}
        <span className="text-sm text-ink-2">Client since {shortDate(client.created_at)}</span>
      </div>

      {(c.phone || c.email || c.address) && (
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[15px]">
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
          {c.address && (
            <>
              <dt className="text-ink-2">Address</dt>
              <dd className="m-0 font-bold">{c.address}</dd>
            </>
          )}
        </dl>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Tile label="Owes you" value={money(owed, currency)} tone={owed > 0 ? "text-error" : "text-success"} foot={unpaid.length ? `On ${unpaid.length} ${unpaid.length === 1 ? "sale" : "sales"}` : undefined} />
        <Tile label="Bought in all" value={money(bought, currency)} tone="text-primary" />
        <Tile label="Sales" value={sales.length.toLocaleString("en-US")} />
        <Tile label="First purchase" value={first ? shortDate(first) : "None yet"} />
      </div>

      <div className="flex flex-wrap gap-2">
        {owed > 0 && <ClientPaymentForm clientId={client.id} owed={owed} currency={currency} />}
        <EditContactForm action={updateClient} idField="client_id" id={client.id} name={c.name} phone={c.phone ?? ""} email={c.email ?? ""} address={c.address ?? ""} />
      </div>

      {unpaid.length > 0 && (
        <section className="flex flex-col">
          <h3 className="m-0 mb-1 text-base font-extrabold">Unpaid sales</h3>
          {unpaid.map((o) => (
            <OrderLine key={o.id} id={o.id!} at={o.created_at!} sub={`${money(o.amount, o.currency ?? currency)} sale`}>
              <span className="font-extrabold text-error">{money(o.balance, o.currency ?? currency)}</span>
              <span className="text-[12px] text-ink-2">still owed</span>
            </OrderLine>
          ))}
        </section>
      )}

      <section className="flex flex-col">
        <h3 className="m-0 mb-1 text-base font-extrabold">Recent sales</h3>
        {all.length ? (
          all.slice(0, 10).map((o) => (
            <OrderLine key={o.id} id={o.id!} at={o.created_at!} sub={`${o.item_count ?? 0} ${o.item_count === 1 ? "item" : "items"}`}>
              <span className="font-extrabold text-primary">{money(o.amount, o.currency ?? currency)}</span>
              {o.fulfilment_status === "COMPLETED" ? (
                <span className={`text-[12px] font-extrabold ${PAYMENT_INK[o.payment_status ?? ""] ?? ""}`}>{(o.payment_status ?? "").replace("_", " ")}</span>
              ) : (
                <ProgressPill status={o.fulfilment_status} />
              )}
            </OrderLine>
          ))
        ) : (
          <p className="m-0 text-ink-2">No sales to this client yet.</p>
        )}
      </section>

      <section className="flex flex-col">
        <h3 className="m-0 mb-1 text-base font-extrabold">Payments received</h3>
        {payments?.length ? (
          payments.map((p) => (
            <OrderLine key={p.id} id={p.order_id} at={p.created_at} sub={METHOD[p.method] ?? p.method}>
              <span className="font-extrabold text-success">{money(Number(p.amount), currency)}</span>
            </OrderLine>
          ))
        ) : (
          <p className="m-0 text-ink-2">No payments yet.</p>
        )}
      </section>
    </SidePanel>
  );
}

/** A line about one order, opening it on the Orders page. */
function OrderLine({ id, at, sub, children }: { id: string; at: string; sub: string; children: React.ReactNode }) {
  return (
    <Link
      href={`/dashboard/orders?order=${id}`}
      className="-mx-2 flex items-center justify-between gap-3 rounded-sm border-b border-surface-mid px-2 py-2.5 text-ink no-underline last:border-0 hover:bg-surface-low"
    >
      <span className="flex min-w-0 flex-col">
        <span className="text-[15px] font-bold">
          {shortDate(at)} · {time(at)}
        </span>
        <span className="text-[13px] text-ink-2">
          #{id.slice(-6).toUpperCase()} · {sub}
        </span>
      </span>
      <span className="flex flex-none flex-col items-end gap-0.5 text-sm">{children}</span>
    </Link>
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
