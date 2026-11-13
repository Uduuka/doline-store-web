import type { Metadata } from "next";
import Link from "next/link";
import { SalesChart, type Bucket } from "@/components/sales-chart";
import { ShareReport } from "@/components/share-report";
import { EXPENSE_CATEGORIES, Empty, FilterChips, Stat } from "@/components/ui";
import { buyerOf, requireStore } from "@/lib/store";
import { batchCost, type BatchCost } from "@/lib/profit";
import { dayKey, dayLabel, hourOf, money, startOfDayISO, titleCase, weekday } from "@/lib/format";

export const metadata: Metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

/** Each period: how many days back it starts, and how its chart is bucketed. */
const PERIODS: Record<string, { back: number; by: "hour" | "day" | "week"; words: string; prev: string }> = {
  Today: { back: 0, by: "hour", words: "today", prev: "yesterday" },
  "7 days": { back: 6, by: "day", words: "last 7 days", prev: "the 7 days before" },
  "30 days": { back: 29, by: "day", words: "last 30 days", prev: "the 30 days before" },
  "90 days": { back: 89, by: "week", words: "last 90 days", prev: "the 90 days before" },
};
const NOT_SALES = ["CANCELLED", "RETURNED", "DRAFT"];
const NOT_SALES_SQL = `(${NOT_SALES.join(",")})`;
const CHANNEL: Record<string, string> = { online: "DolineMarket (online)", pos: "In store", store: "In store", offline: "In store" };
const METHOD: Record<string, string> = { cash: "Cash", mobile_money: "Mobile money", momo: "Mobile money", card: "Card", bank: "Bank" };

/**
 * The store's figures over a period: sales against the period before, what the goods cost, gross
 * and net profit, sales and profit charted over time, what sold, how people paid, where money
 * went, and who bought most. The whole summary can be shared as text or printed.
 */
export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const { period: raw } = await searchParams;
  const period = raw && raw in PERIODS ? raw : "7 days";
  const P = PERIODS[period]!;
  const span = P.back + 1; // days in the period
  const since = startOfDayISO(P.back);
  const prevSince = startOfDayISO(P.back + span);
  const { supabase, store, currency } = await requireStore();

  const [orders, payments, expenses, lines, costs] = await Promise.all([
    supabase
      .from("orders_view")
      .select("id, amount, fulfilment_status, payment_status, balance, channel, created_at, client_id, client_name, buyer_name")
      .eq("store_id", store.id)
      .gte("created_at", prevSince),
    supabase.from("order_payments").select("amount, method, orders!inner(store_id)").eq("orders.store_id", store.id).gte("created_at", since),
    supabase.from("expenses").select("amount, category, created_at").eq("store_id", store.id).is("deleted_at", null).gte("created_at", prevSince),
    supabase
      .from("order_items")
      .select("quantity, returned, units, product_id, products(name), orders!inner(store_id, fulfilment_status, deleted_at)")
      .eq("orders.store_id", store.id)
      .is("orders.deleted_at", null)
      .not("orders.fulfilment_status", "in", NOT_SALES_SQL)
      .gte("created_at", since),
    supabase
      .from("order_item_batches")
      .select("quantity, product_batches(buying_price, quantity), order_items!inner(created_at, orders!inner(store_id, fulfilment_status, deleted_at))")
      .eq("order_items.orders.store_id", store.id)
      .is("order_items.orders.deleted_at", null)
      .not("order_items.orders.fulfilment_status", "in", NOT_SALES_SQL)
      .gte("order_items.created_at", prevSince),
  ]);

  // ── Buckets for the charts ───────────────────────────────────────────────────────────────
  const now = Date.now();
  const keys = Array.from({ length: span }, (_, i) => dayKey(new Date(now - (P.back - i) * 86_400_000)));
  let buckets: Bucket[];
  let bucketOf: (iso: string) => string | undefined;
  if (P.by === "hour") {
    buckets = Array.from({ length: 24 }, (_, h) => ({
      key: `h${h}`,
      label: h % 6 === 0 ? `${String(h).padStart(2, "0")}:00` : "",
      long: `${String(h).padStart(2, "0")}:00–${String((h + 1) % 24).padStart(2, "0")}:00`,
      total: 0,
      profit: 0,
    }));
    bucketOf = (iso) => (dayKey(iso) === keys[0] ? `h${hourOf(iso)}` : undefined);
  } else if (P.by === "day") {
    const every = span > 14 ? 5 : 1;
    buckets = keys.map((k, idx) => ({
      key: k,
      label: (span - 1 - idx) % every === 0 ? (span > 14 ? dayLabel(k) : weekday(k)) : "",
      long: `${weekday(k)} ${dayLabel(k)}`,
      total: 0,
      profit: 0,
    }));
    bucketOf = (iso) => dayKey(iso);
  } else {
    // Weeks ending today; the oldest may be short.
    const weekOf = new Map<string, string>();
    buckets = [];
    for (let end = span; end > 0; end -= 7) {
      const chunk = keys.slice(Math.max(0, end - 7), end);
      const first = chunk[0]!;
      const last = chunk.at(-1)!;
      for (const k of chunk) weekOf.set(k, first);
      buckets.unshift({ key: first, label: dayLabel(first), long: `${dayLabel(first)} – ${dayLabel(last)}`, total: 0, profit: 0 });
    }
    buckets.forEach((b, idx) => {
      if ((buckets.length - 1 - idx) % 2) b.label = "";
    });
    bucketOf = (iso) => weekOf.get(dayKey(iso));
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]));

  // ── Sales ────────────────────────────────────────────────────────────────────────────────
  const all = (orders.data ?? []).filter((o) => !NOT_SALES.includes(o.fulfilment_status ?? "") && o.created_at);
  const sales = all.filter((o) => o.created_at! >= since);
  const prevSales = all.filter((o) => o.created_at! < since);
  const revenue = sum(sales.map((o) => o.amount));
  const prevRevenue = sum(prevSales.map((o) => o.amount));
  for (const o of sales) {
    const b = byKey.get(bucketOf(o.created_at!) ?? "");
    if (b) {
      b.total += Number(o.amount);
      b.profit += Number(o.amount);
    }
  }

  // ── Cost of goods, profit ────────────────────────────────────────────────────────────────
  let cogs = 0;
  let prevCogs = 0;
  for (const c of costs.data ?? []) {
    const at = (c.order_items as { created_at: string }).created_at;
    const cost = batchCost(c.product_batches as BatchCost, c.quantity);
    if (at >= since) {
      cogs += cost;
      const b = byKey.get(bucketOf(at) ?? "");
      if (b) b.profit -= cost;
    } else prevCogs += cost;
  }
  const gross = revenue - cogs;
  const margin = revenue > 0 ? Math.round((gross / revenue) * 100) : null;

  // ── Expenses ─────────────────────────────────────────────────────────────────────────────
  const curExpenses = (expenses.data ?? []).filter((e) => e.created_at >= since);
  const spent = sum(curExpenses.map((e) => e.amount));
  const prevSpent = sum((expenses.data ?? []).filter((e) => e.created_at < since).map((e) => e.amount));
  const net = gross - spent;
  const prevNet = prevRevenue - prevCogs - prevSpent;
  const byCategory = group(curExpenses, (e) => EXPENSE_CATEGORIES[e.category as keyof typeof EXPENSE_CATEGORIES]?.label ?? titleCase(e.category), (e) => Number(e.amount));

  // ── Counts, credit, channels, clients ────────────────────────────────────────────────────
  const avgBasket = sales.length ? revenue / sales.length : 0;
  const creditOwed = sum(sales.filter((o) => o.payment_status === "CREDIT").map((o) => o.balance));
  const byChannel = group(sales, (o) => CHANNEL[o.channel ?? ""] ?? titleCase(o.channel), (o) => Number(o.amount));
  const topClients = group(
    sales.filter((o) => o.client_id),
    (o) => buyerOf(o, "Client"),
    (o) => Number(o.amount),
  ).slice(0, 6);
  const best = buckets.reduce<Bucket | null>((a, b) => (b.total > (a?.total ?? 0) ? b : a), null);

  // ── Items ────────────────────────────────────────────────────────────────────────────────
  const sold = new Map<string, { name: string; qty: number; units: string }>();
  for (const l of lines.data ?? []) {
    const name = (l.products as { name: string } | null)?.name ?? "Item";
    const s = sold.get(l.product_id) ?? { name, qty: 0, units: l.units?.trim() || "" };
    s.qty += Number(l.quantity) - Number(l.returned ?? 0);
    sold.set(l.product_id, s);
  }
  const top = [...sold.values()].filter((t) => t.qty > 0).sort((a, b) => b.qty - a.qty).slice(0, 10);
  const itemsSold = [...sold.values()].reduce((a, s) => a + Math.max(0, s.qty), 0);

  // ── Payments ─────────────────────────────────────────────────────────────────────────────
  const mix = group(payments.data ?? [], (p) => METHOD[p.method] ?? titleCase(p.method), (p) => Number(p.amount));
  const collected = sum((payments.data ?? []).map((p) => p.amount));

  // ── Share text ───────────────────────────────────────────────────────────────────────────
  const range = span === 1 ? `${weekday(keys[0]!)} ${dayLabel(keys[0]!)}` : `${dayLabel(keys[0]!)} – ${dayLabel(keys.at(-1)!)}`;
  const m = (n: number) => money(n, currency);
  const pctOf = (rows: [string, number][], total: number) => rows.map(([k, v]) => `${k} ${total ? Math.round((v / total) * 100) : 0}%`).join(", ");
  const shareTitle = `${store.name}: report, ${P.words}`;
  const shareText = [
    `${store.name} — report, ${P.words} (${range})`,
    "",
    `Sales: ${m(revenue)} from ${sales.length} ${sales.length === 1 ? "sale" : "sales"}${change(revenue, prevRevenue) ? ` (${change(revenue, prevRevenue)} vs ${P.prev})` : ""}`,
    `Cost of goods: ${m(cogs)}`,
    `Gross profit: ${m(gross)}${margin != null ? ` (${margin}% margin)` : ""}`,
    `Expenses: ${m(spent)}`,
    `Net profit: ${m(net)}`,
    ...(sales.length ? [`Average sale: ${m(avgBasket)}`] : []),
    ...(creditOwed > 0 ? [`Sold on credit, still owed: ${m(creditOwed)}`] : []),
    ...(top.length ? ["", "Top items:", ...top.slice(0, 5).map((t, i) => `${i + 1}. ${t.name} × ${qtyText(t.qty)}${t.units && t.units !== "units" ? ` ${t.units}` : ""}`)] : []),
    ...(mix.length ? ["", `Payments: ${pctOf(mix, collected)}`] : []),
    ...(byCategory.length ? [`Spending: ${byCategory.map(([k, v]) => `${k} ${m(v)}`).join(", ")}`] : []),
    "",
    "Sent from Doline Store",
  ].join("\n");

  return (
    <main className="flex w-full max-w-[1360px] flex-col gap-4 p-4 sm:p-6">
      <h1 className="sr-only">Reports</h1>
      <div className="hidden print:block">
        <p className="m-0 text-2xl font-extrabold">{store.name}</p>
        <p className="m-0 text-ink-2">
          Report, {P.words} · {range}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <FilterChips items={Object.keys(PERIODS)} active={period} param="period" base="/dashboard/reports" defaultItem="7 days" />
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-2">{range}</span>
          <ShareReport title={shareTitle} text={shareText} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Stat label="Sales" value={m(revenue)} tone="text-primary" foot={<Delta now={revenue} before={prevRevenue} vs={P.prev} />} />
        <Stat label="Gross profit" value={m(gross)} tone={gross >= 0 ? "text-success" : "text-error"} foot={margin != null ? `${margin}% margin, after ${m(cogs)} cost of goods` : "Sales less what the goods cost"} />
        <Stat label="Expenses" value={m(spent)} foot={<Delta now={spent} before={prevSpent} vs={P.prev} upIsGood={false} />} />
        <Stat label="Net profit" value={m(net)} tone={net >= 0 ? "text-success" : "text-error"} foot={<Delta now={net} before={prevNet} vs={P.prev} />} />
      </div>
      <div className="flex flex-wrap gap-4">
        <Stat label="Sales recorded" value={sales.length.toLocaleString("en-US")} foot={sales.length ? `Average sale ${m(avgBasket)}` : "None in this period"} />
        <Stat label="Items sold" value={qtyText(itemsSold)} foot={`${sold.size} different ${sold.size === 1 ? "item" : "items"}`} />
        <Stat
          label="Sold on credit, still owed"
          value={m(creditOwed)}
          tone={creditOwed > 0 ? "text-error" : undefined}
          foot={
            <Link href="/dashboard/clients" className="font-bold text-primary print:hidden">
              Credit book →
            </Link>
          }
        />
        <Stat label="Payments received" value={m(collected)} tone="text-success" foot="Including credit paid off" />
      </div>

      <section className="card min-w-0 break-inside-avoid">
        <SalesChart
          days={buckets}
          currency={currency}
          period={P.words}
          totalLabel="Total"
          profitTitle="Gross profit"
          note={`Gross profit is sales less what the goods sold cost, from each batch's buying price where it was entered.${best ? ` Best ${P.by}: ${best.long}, ${m(best.total)}.` : ""}`}
        />
      </section>

      <div className="flex flex-wrap gap-4">
        <section className="card min-w-0 flex-[2_1_460px] break-inside-avoid overflow-hidden p-0">
          <h2 className="m-0 px-5 pt-5 pb-2 text-lg font-extrabold">Top items</h2>
          {top.length ? (
            <div className="overflow-x-auto">
              <table className="tbl min-w-[360px]">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col" className="text-right">
                      Sold
                    </th>
                    <th scope="col" className="w-[30%]">
                      <span className="sr-only">Share of top seller</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {top.map((t) => (
                    <tr key={t.name}>
                      <td className="font-bold">{t.name}</td>
                      <td className="text-right whitespace-nowrap">
                        {qtyText(t.qty)} {t.units && t.units !== "units" ? <span className="text-ink-2">{t.units}</span> : null}
                      </td>
                      <td>
                        <div className="h-2 overflow-hidden rounded-[4px] bg-surface-mid">
                          <div className="h-full rounded-[4px] bg-primary" style={{ width: `${Math.round((t.qty / top[0]!.qty) * 100)}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>No sales in this period.</Empty>
          )}
        </section>

        <Breakdown title="How customers paid" rows={mix} currency={currency} empty="No payments in this period." />
      </div>

      <div className="flex flex-wrap gap-4">
        <Breakdown title="Where the money went" rows={byCategory} currency={currency} empty="No expenses in this period." tone="bg-error" />
        <Breakdown title="Where sales came from" rows={byChannel} currency={currency} empty="No sales in this period." />
        <Breakdown title="Top clients" rows={topClients} currency={currency} empty="No sales to saved clients in this period." tone="bg-success" />
      </div>
    </main>
  );
}

/** A card of labelled amounts, each with its share of the total as a bar. */
function Breakdown({ title, rows, currency, empty, tone = "bg-primary" }: { title: string; rows: [string, number][]; currency: string; empty: string; tone?: string }) {
  const total = rows.reduce((a, [, v]) => a + v, 0);
  return (
    <section className="card flex min-w-0 flex-[1_1_300px] break-inside-avoid flex-col gap-4">
      <h2 className="m-0 text-lg font-extrabold">{title}</h2>
      {rows.length ? (
        rows.map(([label, amount]) => {
          const pct = total ? Math.round((amount / total) * 100) : 0;
          return (
            <div key={label} className="flex flex-col gap-1.5">
              <div className="flex justify-between gap-3 text-sm">
                <span className="truncate font-bold">{label}</span>
                <span className="flex-none text-ink-2">
                  {money(amount, currency)} · {pct}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-[4px] bg-surface-mid">
                <div className={`h-full rounded-[4px] ${tone}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })
      ) : (
        <p className="m-0 py-6 text-center text-ink-2">{empty}</p>
      )}
    </section>
  );
}

/** "▲ 12% vs the 7 days before", coloured by whether the change is good news. */
function Delta({ now, before, vs, upIsGood = true }: { now: number; before: number; vs: string; upIsGood?: boolean }) {
  const c = change(now, before);
  if (!c) return <span>Nothing to compare with {vs}</span>;
  const good = now >= before === upIsGood;
  return (
    <span>
      <strong className={good ? "text-success" : "text-error"}>{c}</strong> vs {vs}
    </span>
  );
}

function change(now: number, before: number): string | null {
  if (!before) return null;
  const pct = Math.round(((now - before) / Math.abs(before)) * 100);
  return `${pct >= 0 ? "▲" : "▼"} ${Math.abs(pct)}%`;
}

function sum(xs: (number | string | null | undefined)[]): number {
  return xs.reduce<number>((a, x) => a + Number(x ?? 0), 0);
}

/** Totals by label, largest first. */
function group<T>(xs: T[], label: (x: T) => string, amount: (x: T) => number): [string, number][] {
  const m = new Map<string, number>();
  for (const x of xs) m.set(label(x), (m.get(label(x)) ?? 0) + amount(x));
  return [...m.entries()].filter(([, v]) => v !== 0).sort((a, b) => b[1] - a[1]);
}

function qtyText(n: number): string {
  return (+n.toFixed(2)).toLocaleString("en-US");
}
