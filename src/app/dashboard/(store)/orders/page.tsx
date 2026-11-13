import type { Metadata } from "next";
import Link from "next/link";
import { Empty, FilterChips, PAYMENT_INK, ProgressPill } from "@/components/ui";
import { buyerOf, requireStore } from "@/lib/store";
import { money, shortDate, time } from "@/lib/format";
import { ClickableRow } from "@/components/side-panel";
import { OrderPanel } from "./order-panel";

export const metadata: Metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

const STAGES = ["All", "Pending", "Ready", "Shipping", "Completed", "Returned", "Cancelled"];
const PAGE = 50;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ stage?: string; channel?: string; page?: string; order?: string }> }) {
  const { stage = "All", channel, page = "1", order } = await searchParams;
  const { supabase, store, currency } = await requireStore();
  const p = Math.max(1, Number(page) || 1);

  let q = supabase
    .from("orders_view")
    .select("id, created_at, buyer_name, client_name, channel, item_count, payment_status, fulfilment_status, amount, balance, currency", { count: "exact" })
    .eq("store_id", store.id)
    .order("created_at", { ascending: false })
    .range((p - 1) * PAGE, p * PAGE - 1);
  if (stage !== "All") q = q.eq("fulfilment_status", stage.toUpperCase());
  if (channel === "online" || channel === "pos") q = q.eq("channel", channel);
  const { data, count } = await q;
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE));

  const qs = (extra: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    const merged = { stage: stage !== "All" ? stage : undefined, channel, ...extra };
    for (const [k, v] of Object.entries(merged)) if (v) sp.set(k, v);
    const s = sp.toString();
    return `/dashboard/orders${s ? `?${s}` : ""}`;
  };
  // The list as it is (filters and page), with or without an order open on top of it.
  const here = (orderId?: string) => qs({ page: p > 1 ? String(p) : undefined, order: orderId });

  return (
    <>
      <main className="flex w-full max-w-[1360px] flex-col gap-4 p-4 sm:p-6">
        <h1 className="sr-only">Orders</h1>
        <div className="flex flex-wrap items-center gap-3">
          <FilterChips items={STAGES} active={stage} param="stage" base="/dashboard/orders" />
        </div>
        <div className="flex gap-2 text-sm font-bold">
          {[
            [undefined, "Every channel"],
            ["pos", "In store"],
            ["online", "DolineMarket"],
          ].map(([c, label]) => (
            <Link key={label} href={qs({ channel: c, page: undefined })} className={`rounded-sm px-3 py-2.5 no-underline ${channel === c ? "bg-primary-container text-primary" : "text-ink-2 hover:bg-surface-mid"}`}>
              {label}
            </Link>
          ))}
        </div>
        <section className="card overflow-hidden p-0">
          {data?.length ? (
            <div className="overflow-x-auto">
              <table className="tbl min-w-[860px]">
                <thead>
                  <tr>
                    <th scope="col">When</th>
                    <th scope="col">Client</th>
                    <th scope="col">Channel</th>
                    <th scope="col">Items</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Progress</th>
                    <th scope="col" className="text-right">Total</th>
                    <th scope="col" className="text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((o) => (
                    <ClickableRow key={o.id} href={here(o.id!)} selected={order === o.id}>
                      <td>
                        <span className="flex flex-col">
                          <span className="font-bold">{shortDate(o.created_at)}</span>
                          <Link href={here(o.id!)} scroll={false}
                prefetch={false} className="text-xs text-ink-2 no-underline hover:text-primary">
                            {time(o.created_at)} · #{o.id?.slice(-6).toUpperCase()}
                          </Link>
                        </span>
                      </td>
                      <td>{buyerOf(o)}</td>
                      <td className={`text-sm font-bold ${o.channel === "online" ? "text-primary" : "text-ink-2"}`}>{o.channel === "online" ? "DolineMarket" : "In store"}</td>
                      <td className="text-ink-2">{o.item_count ?? 0}</td>
                      <td>
                        <span className={`text-[13px] font-extrabold ${PAYMENT_INK[o.payment_status ?? ""] ?? ""}`}>{(o.payment_status ?? "").replace("_", " ")}</span>
                      </td>
                      <td>
                        <ProgressPill status={o.fulfilment_status} />
                      </td>
                      <td className="text-right font-bold text-primary">{money(o.amount, o.currency ?? currency)}</td>
                      <td className={`text-right ${Number(o.balance) > 0 ? "font-bold text-error" : "text-ink-2"}`}>{money(o.balance, o.currency ?? currency)}</td>
                    </ClickableRow>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>No orders at this stage right now.</Empty>
          )}
        </section>
        {pages > 1 && (
          <nav aria-label="Pages" className="flex items-center justify-between gap-3">
            {p > 1 ? (
              <Link href={qs({ page: String(p - 1) })} className="btn btn-default">
                Newer
              </Link>
            ) : (
              <span />
            )}
            <span className="text-sm text-ink-2">
              Page {p} of {pages}
            </span>
            {p < pages ? (
              <Link href={qs({ page: String(p + 1) })} className="btn btn-default">
                Older
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </main>
      {order && <OrderPanel orderId={order} closeHref={here()} />}
    </>
  );
}
