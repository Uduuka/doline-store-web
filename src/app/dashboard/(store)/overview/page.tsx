import Link from "next/link";
import { SalesChart } from "@/components/sales-chart";
import { batchCost, type BatchCost } from "@/lib/profit";
import { Icon } from "@/components/icons";
import { Empty, PAYMENT_INK, Stat } from "@/components/ui";
import { buyerOf, requireStore } from "@/lib/store";
import { dayKey, money, shortDate, startOfDayISO, time, weekday } from "@/lib/format";

export const dynamic = "force-dynamic";

const COUNTED = (s: string | null) => s !== "CANCELLED" && s !== "RETURNED" && s !== "DRAFT";

export default async function OverviewPage() {
  const { supabase, store, currency } = await requireStore();
  const weekStart = startOfDayISO(6);

  const [weekOrders, recent, credit, low, online, weekCosts] = await Promise.all([
    supabase.from("orders").select("amount, created_at, fulfilment_status").eq("store_id", store.id).is("deleted_at", null).gte("created_at", weekStart),
    supabase.from("orders_view").select("id, created_at, buyer_name, client_name, payment_status, amount, currency").eq("store_id", store.id).order("created_at", { ascending: false }).limit(6),
    supabase.from("orders_view").select("client_id, buyer_name, client_name, balance, created_at").eq("store_id", store.id).eq("payment_status", "CREDIT").gt("balance", 0),
    supabase.from("inventory").select("product_id, name, available, low_stock_threshold").eq("store_id", store.id).eq("is_low_stock", true).order("available").limit(5),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("store_id", store.id).eq("channel", "online").in("fulfilment_status", ["PENDING", "READY"]).is("deleted_at", null),
    // What each item sold this week cost, from the batches it came out of (as Reports counts it).
    supabase
      .from("order_item_batches")
      .select("quantity, product_batches(buying_price, quantity), order_items!inner(created_at, orders!inner(store_id, fulfilment_status, deleted_at))")
      .eq("order_items.orders.store_id", store.id)
      .is("order_items.orders.deleted_at", null)
      .not("order_items.orders.fulfilment_status", "in", "(CANCELLED,RETURNED,DRAFT)")
      .gte("order_items.created_at", weekStart),
  ]);

  // Seven calendar days ending today, in the store's time zone.
  const keys = Array.from({ length: 7 }, (_, i) => dayKey(new Date(Date.now() - (6 - i) * 86_400_000)));
  const totals = new Map(keys.map((k) => [k, 0]));
  let todayCount = 0;
  const todayKey = keys[6]!;
  for (const o of weekOrders.data ?? []) {
    if (!COUNTED(o.fulfilment_status)) continue;
    const k = dayKey(o.created_at);
    if (totals.has(k)) totals.set(k, totals.get(k)! + Number(o.amount));
    if (k === todayKey) todayCount++;
  }
  const costs = new Map(keys.map((k) => [k, 0]));
  for (const c of weekCosts.data ?? []) {
    const k = dayKey((c.order_items as { created_at: string }).created_at);
    if (costs.has(k)) costs.set(k, costs.get(k)! + batchCost(c.product_batches as BatchCost, c.quantity));
  }
  const days = keys.map((k) => ({
    key: k,
    label: weekday(k),
    long: `${weekday(k)} ${new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short" }).format(new Date(`${k}T12:00:00Z`))}`,
    total: totals.get(k)!,
    profit: totals.get(k)! - costs.get(k)!,
  }));
  const today = totals.get(todayKey)!;
  const weekAvg = days.slice(0, 6).reduce((a, d) => a + d.total, 0) / 6;

  // Credit grouped by client.
  const owed = new Map<string, { name: string; balance: number; last: string }>();
  for (const o of credit.data ?? []) {
    const key = o.client_id ?? `walk-in:${o.buyer_name}`;
    const cur = owed.get(key) ?? { name: buyerOf(o, "Walk-in client"), balance: 0, last: o.created_at ?? "" };
    cur.balance += Number(o.balance);
    if ((o.created_at ?? "") > cur.last) cur.last = o.created_at ?? cur.last;
    owed.set(key, cur);
  }
  const debtors = [...owed.values()].sort((a, b) => b.balance - a.balance);
  const creditTotal = debtors.reduce((a, d) => a + d.balance, 0);
  const onlineOpen = online.count ?? 0;

  return (
    <>
      <main className="flex w-full max-w-[1360px] flex-col gap-6 p-4 sm:p-6">
        <h1 className="sr-only">Overview</h1>
        <div className="flex flex-wrap gap-4">
          <Stat
            label="Sales today"
            value={money(today, currency)}
            tone="text-primary"
            foot={weekAvg > 0 ? `${today >= weekAvg ? "▲" : "▼"} ${Math.abs(Math.round(((today - weekAvg) / weekAvg) * 100))}% vs this week's daily average` : "First sales of the week"}
          />
          <Stat label="Sales recorded today" value={todayCount} foot={todayCount ? `Avg. basket ${money(today / todayCount, currency)}` : "None yet today"} />
          <Stat label="Credit outstanding" value={money(creditTotal, currency)} tone="text-error" foot={`${debtors.length} ${debtors.length === 1 ? "client owes" : "clients owe"}`} />
          <Stat
            label="Low stock"
            value={`${low.data?.length ?? 0} items`}
            tone="text-on-amber-c"
            foot={
              <Link href="/dashboard/inventory?filter=Low%20stock" className="font-bold text-primary">
                Review stock →
              </Link>
            }
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <section className="card min-w-0 flex-[2_1_460px]">
            <SalesChart days={days} currency={currency} />
          </section>
          <section className="card flex min-w-0 flex-[1_1_300px] flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-lg font-extrabold">Running low</h2>
              <Link href="/dashboard/inventory?filter=Low%20stock" className="btn btn-tonal h-9 px-3 text-[13px]">
                View all
              </Link>
            </div>
            {low.data?.length ? (
              low.data.map((it) => (
                <div key={it.product_id} className="flex items-center gap-3 border-b border-surface-mid py-2.5 last:border-0">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-sm bg-amber-c font-extrabold text-on-amber-c">{it.name?.[0] ?? "?"}</span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[15px] font-bold">{it.name}</span>
                    <span className="text-[13px] font-bold text-on-amber-c">{Number(it.available ?? 0).toLocaleString("en-US")} left</span>
                  </span>
                </div>
              ))
            ) : (
              <p className="m-0 py-6 text-center text-ink-2">Nothing is running low.</p>
            )}
            {onlineOpen > 0 && (
              <div className="mt-auto flex items-center gap-3 rounded-sm bg-primary-container p-3.5 text-on-primary-container">
                <Icon name="pin" />
                <span className="flex-1 text-sm font-bold">
                  {onlineOpen} DolineMarket {onlineOpen === 1 ? "order needs" : "orders need"} you
                </span>
                <Link href="/dashboard/orders?channel=online" className="flex min-h-11 items-center font-extrabold text-primary">
                  Open
                </Link>
              </div>
            )}
          </section>
        </div>

        <div className="flex flex-wrap gap-4">
          <section className="card min-w-0 flex-[2_1_460px] overflow-hidden p-0">
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <h2 className="m-0 text-lg font-extrabold">Recent sales</h2>
              <Link href="/dashboard/orders" className="btn btn-tonal h-9 px-3 text-[13px]">
                All orders
              </Link>
            </div>
            {recent.data?.length ? (
              <div className="overflow-x-auto">
                <table className="tbl min-w-[520px]">
                  <thead>
                    <tr>
                      <th scope="col">Time</th>
                      <th scope="col">Client</th>
                      <th scope="col">Payment</th>
                      <th scope="col" className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.data.map((o) => (
                      <tr key={o.id}>
                        <td className="text-ink-2">
                          {dayKey(o.created_at ?? new Date()) === todayKey ? time(o.created_at) : `${shortDate(o.created_at)} ${time(o.created_at)}`}
                        </td>
                        <td>{buyerOf(o)}</td>
                        <td>
                          <span className={`text-[13px] font-extrabold ${PAYMENT_INK[o.payment_status ?? ""] ?? ""}`}>{o.payment_status}</span>
                        </td>
                        <td className="text-right font-bold text-primary">{money(o.amount, o.currency ?? currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty>No sales yet. Record your first one from Sell.</Empty>
            )}
          </section>
          <section className="card flex min-w-0 flex-[1_1_300px] flex-col gap-1">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="m-0 text-lg font-extrabold">Credit to chase</h2>
              <Link href="/dashboard/clients" className="btn btn-tonal h-9 px-3 text-[13px]">
                Credit book
              </Link>
            </div>
            {debtors.length ? (
              debtors.slice(0, 5).map((d) => (
                <div key={d.name + d.last} className="flex items-center justify-between gap-3 border-b border-surface-mid py-2.5 last:border-0">
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[15px] font-bold">{d.name}</span>
                    <span className="text-[13px] text-ink-2">Last credit sale {shortDate(d.last)}</span>
                  </span>
                  <span className="font-extrabold whitespace-nowrap text-error">{money(d.balance, currency)}</span>
                </div>
              ))
            ) : (
              <p className="m-0 py-6 text-center text-ink-2">Nobody owes you anything.</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
