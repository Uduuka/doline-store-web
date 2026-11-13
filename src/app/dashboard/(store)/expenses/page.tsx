import type { Metadata } from "next";
import Link from "next/link";
import { Fab, FabForm } from "@/components/fab";
import { Field } from "@/components/form-bits";
import { Icon } from "@/components/icons";
import { EXPENSE_CATEGORIES, Empty } from "@/components/ui";
import { requireStore } from "@/lib/store";
import { money, shortDate, startOfMonthISO, TIME_ZONE } from "@/lib/format";
import { addExpense } from "@/app/dashboard/actions";

export const metadata: Metadata = { title: "Expenses" };
export const dynamic = "force-dynamic";

type Cat = keyof typeof EXPENSE_CATEGORIES;
const CATS = Object.keys(EXPENSE_CATEGORIES) as Cat[];
/** A category the apps don't know is counted, shown and filtered as Others. */
const catOf = (c: string): Cat => ((CATS as string[]).includes(c) ? (c as Cat) : "OTHERS");

/**
 * This month's expenses: the total, a card per category, and the list. Each card filters the list
 * to its category; clicking the active card shows everything again.
 */
export default async function ExpensesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: raw } = await searchParams;
  const active = raw && (CATS as string[]).includes(raw) ? (raw as Cat) : null;
  const { supabase, store, currency } = await requireStore();

  // This calendar month, in the store's time zone.
  const monthStart = startOfMonthISO();
  const monthName = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, month: "long" }).format(new Date());

  const { data } = await supabase
    .from("expenses")
    .select("id, amount, category, currency, description, created_at")
    .eq("store_id", store.id)
    .is("deleted_at", null)
    .gte("created_at", monthStart)
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  const byCat = new Map<string, number>();
  for (const e of rows) byCat.set(catOf(e.category), (byCat.get(catOf(e.category)) ?? 0) + Number(e.amount));
  const total = rows.reduce((a, e) => a + Number(e.amount), 0);
  const shown = active ? rows.filter((e) => catOf(e.category) === active) : rows;

  return (
    <>
      <main className="flex w-full max-w-[1360px] flex-col gap-4 p-4 pb-24 sm:p-6 sm:pb-24">
        <h1 className="sr-only">Expenses</h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[13px] font-bold text-ink-2">Spent in {monthName}</div>
            <div className="text-[28px] font-extrabold">{money(total, currency)}</div>
          </div>
        </div>

        <nav aria-label="Filter by category" className="flex flex-wrap gap-3">
          {CATS.map((k) => {
            const c = EXPENSE_CATEGORIES[k];
            const on = active === k;
            return (
              <Link
                key={k}
                href={on ? "/dashboard/expenses" : `/dashboard/expenses?category=${k}`}
                scroll={false}
                prefetch={false}
                aria-current={on ? "true" : undefined}
                title={on ? "Show all expenses" : `Show only ${c.label.toLowerCase()}`}
                className={`card flex min-w-0 flex-[1_1_170px] flex-col gap-3 text-ink no-underline transition-shadow hover:shadow-fab ${on ? "ring-2 ring-primary" : ""} ${active && !on ? "opacity-60 hover:opacity-100" : ""}`}
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-sm ${c.cls}`}>
                  <Icon name={c.icon} />
                </span>
                <span className="text-[13px] font-bold text-ink-2">{c.label}</span>
                <span className="text-lg font-extrabold">{money(byCat.get(k) ?? 0, currency)}</span>
              </Link>
            );
          })}
        </nav>

        <section className="card overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-5 pb-2">
            <h2 className="m-0 text-lg font-extrabold">{active ? `${EXPENSE_CATEGORIES[active].label} this month` : "This month"}</h2>
            {active && (
              <Link href="/dashboard/expenses" scroll={false} prefetch={false} className="btn btn-tonal h-9 px-3 text-[13px]">
                Show all
              </Link>
            )}
          </div>
          {shown.length ? (
            <div className="overflow-x-auto">
              <table className="tbl min-w-[560px]">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col">Category</th>
                    <th scope="col" className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((e) => {
                    const c = EXPENSE_CATEGORIES[catOf(e.category)];
                    return (
                      <tr key={e.id}>
                        <td className="text-ink-2">{shortDate(e.created_at)}</td>
                        <td className="font-bold whitespace-normal">{e.description}</td>
                        <td>
                          <span className={`pill ${c.cls}`}>{c.label.toUpperCase()}</span>
                        </td>
                        <td className="text-right font-bold">{money(e.amount, e.currency)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>{active ? `No ${EXPENSE_CATEGORIES[active].label.toLowerCase()} expenses this month.` : "No expenses recorded this month."}</Empty>
          )}
        </section>
      </main>
      <Fab
        label="Add an expense"
        options={[
          {
            key: "expense",
            label: "Add expense",
            icon: "expenses",
            title: "Add an expense",
            panel: (
              <FabForm action={addExpense} submit="Save expense">
                <Field id="description" label="What was it for?" placeholder="e.g. Electricity tokens" required autoFocus />
                <div className="flex flex-col gap-1">
                  <label htmlFor="category" className="label">
                    Category
                  </label>
                  <select id="category" name="category" className="field px-3" defaultValue="OTHERS">
                    {CATS.map((k) => (
                      <option key={k} value={k}>
                        {EXPENSE_CATEGORIES[k].label}
                      </option>
                    ))}
                  </select>
                </div>
                <Field id="amount" label={`Amount (${currency})`} inputMode="numeric" required />
              </FabForm>
            ),
          },
        ]}
      />
    </>
  );
}
