import type { Metadata } from "next";
import Link from "next/link";
import { Fab, FabForm } from "@/components/fab";
import { ClickableRow } from "@/components/side-panel";
import { ClientPanel } from "./client-panel";
import { Field } from "@/components/form-bits";
import { Empty, Stat } from "@/components/ui";
import { requireStore } from "@/lib/store";
import { initials, money, shortDate, startOfDayISO } from "@/lib/format";
import { addClient, recordClientPayment } from "@/app/dashboard/actions";

export const metadata: Metadata = { title: "Clients & credit" };
export const dynamic = "force-dynamic";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  const { client } = await searchParams;
  const { supabase, store, currency } = await requireStore();
  const here = (id?: string) => (id ? `/dashboard/clients?client=${id}` : "/dashboard/clients");

  const [clients, orders, collected] = await Promise.all([
    supabase.from("clients").select("id, store_contacts(name, phone)").eq("store_id", store.id).is("deleted_at", null),
    supabase.from("orders_view").select("client_id, balance, payment_status, created_at").eq("store_id", store.id).not("client_id", "is", null),
    supabase
      .from("order_payments")
      .select("amount, orders!inner(store_id, client_id)")
      .eq("orders.store_id", store.id)
      .not("orders.client_id", "is", null)
      .gte("created_at", startOfDayISO(6)),
  ]);

  const stats = new Map<string, { balance: number; lastBuy: string }>();
  for (const o of orders.data ?? []) {
    if (!o.client_id) continue;
    const s = stats.get(o.client_id) ?? { balance: 0, lastBuy: "" };
    if (o.payment_status === "CREDIT") s.balance += Number(o.balance ?? 0);
    if ((o.created_at ?? "") > s.lastBuy) s.lastBuy = o.created_at ?? "";
    stats.set(o.client_id, s);
  }

  const rows = (clients.data ?? [])
    .map((c) => {
      const contact = c.store_contacts as { name: string; phone: string | null } | null;
      const s = stats.get(c.id) ?? { balance: 0, lastBuy: "" };
      return { id: c.id, name: contact?.name ?? "Client", phone: contact?.phone ?? null, ...s };
    })
    .sort((a, b) => b.balance - a.balance || a.name.localeCompare(b.name));

  const owing = rows.filter((r) => r.balance > 0);
  const owed = owing.reduce((a, r) => a + r.balance, 0);
  const collectedWeek = (collected.data ?? []).reduce((a, p) => a + Number(p.amount), 0);

  return (
    <>
      <main className="flex w-full max-w-[1360px] flex-col gap-4 p-4 pb-24 sm:p-6 sm:pb-24">
        <h1 className="sr-only">Clients &amp; credit</h1>
        <div className="flex flex-wrap gap-4">
          <Stat label="Owed to you" value={money(owed, currency)} tone="text-error" foot={`${owing.length} ${owing.length === 1 ? "client owes" : "clients owe"}`} />
          <Stat label="Collected from clients, last 7 days" value={money(collectedWeek, currency)} tone="text-success" />
          <Stat label="Clients" value={rows.length} />
        </div>

        <section className="card overflow-hidden p-0">
          {rows.length ? (
            <div className="overflow-x-auto">
              <table className="tbl min-w-[640px]">
                <thead>
                  <tr>
                    <th scope="col">Client</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Last purchase</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <ClickableRow key={r.id} href={here(r.id)} selected={client === r.id}>
                      <td>
                        <span className="flex items-center gap-3">
                          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ground text-[13px] font-extrabold">{initials(r.name)}</span>
                          <Link href={here(r.id)} scroll={false}
                prefetch={false} className="font-bold text-ink no-underline hover:text-primary">
                            {r.name}
                          </Link>
                        </span>
                      </td>
                      <td className="text-ink-2">{r.phone ? <a href={`tel:${r.phone}`}>{r.phone}</a> : "—"}</td>
                      <td className="text-ink-2">{shortDate(r.lastBuy || null)}</td>
                      <td>
                        {r.balance > 0 ? (
                          <span className="pill bg-error-container text-on-error-container">OWES</span>
                        ) : (
                          <span className="pill bg-success-container text-on-success-container">CLEARED</span>
                        )}
                      </td>
                      <td className={`text-right font-extrabold ${r.balance > 0 ? "text-error" : "text-success"}`}>{money(r.balance, currency)}</td>
                    </ClickableRow>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>No clients yet. Add the people you sell to on credit with the + button.</Empty>
          )}
        </section>
      </main>
      {client && <ClientPanel clientId={client} closeHref={here()} />}
      <Fab
        label="Record a payment or add a client"
        options={[
          {
            key: "payment",
            label: "Record a payment",
            icon: "check",
            title: "Record a payment",
            disabled: !owing.length,
            hint: owing.length ? undefined : "Nobody owes you anything",
            panel: (
              <FabForm action={recordClientPayment} submit="Save payment">
                <div className="flex flex-col gap-1">
                  <label htmlFor="client_id" className="label">
                    Client
                  </label>
                  <select id="client_id" name="client_id" className="field px-3" required autoFocus>
                    {owing.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — owes {money(r.balance, currency)}
                      </option>
                    ))}
                  </select>
                </div>
                <Field id="amount" label={`Amount paid (${currency})`} inputMode="numeric" required />
                <div className="flex flex-col gap-1">
                  <label htmlFor="method" className="label">
                    Paid by
                  </label>
                  <select id="method" name="method" className="field px-3">
                    <option value="cash">Cash</option>
                    <option value="mobile_money">Mobile money</option>
                  </select>
                </div>
              </FabForm>
            ),
          },
          {
            key: "client",
            label: "Add client",
            icon: "clients",
            title: "Add a client",
            panel: (
              <FabForm action={addClient} submit="Save client">
                <Field id="name" label="Name" required autoFocus />
                <Field id="phone" label="Phone" type="tel" placeholder="+256 7XX XXX XXX" />
              </FabForm>
            ),
          },
        ]}
      />
    </>
  );
}
