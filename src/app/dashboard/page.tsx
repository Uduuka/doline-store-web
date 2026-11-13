import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { Icon } from "@/components/icons";
import { DownloadButton } from "@/components/download-button";
import { signOut } from "@/app/(auth)/actions";
import { openStore } from "@/app/dashboard/actions";
import { getContext } from "@/lib/store";
import { initials, money, startOfDayISO } from "@/lib/format";

export const metadata: Metadata = { title: "Your stores" };
export const dynamic = "force-dynamic";

const COUNTED = (s: string | null) => s !== "CANCELLED" && s !== "RETURNED" && s !== "DRAFT";

/** The dashboard's front door: every store this account keeps, each opening its own overview. */
export default async function StoresPage() {
  const { supabase, stores, displayName } = await getContext();
  if (!stores.length) redirect("/onboarding");

  const ids = stores.map((s) => s.id);
  const [{ data: today }, { data: settings }] = await Promise.all([
    supabase.from("orders").select("store_id, amount, fulfilment_status").in("store_id", ids).is("deleted_at", null).gte("created_at", startOfDayISO(0)),
    supabase.from("store_settings").select("store_id, default_currency").in("store_id", ids),
  ]);

  const sales = new Map<string, { total: number; count: number }>();
  for (const o of today ?? []) {
    if (!COUNTED(o.fulfilment_status)) continue;
    const cur = sales.get(o.store_id) ?? { total: 0, count: 0 };
    cur.total += Number(o.amount);
    cur.count++;
    sales.set(o.store_id, cur);
  }
  const currencyOf = new Map((settings ?? []).map((s) => [s.store_id, s.default_currency || "UGX"]));

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <header className="bg-ground shadow-appbar">
        <div className="mx-auto flex min-h-[72px] max-w-[1200px] items-center gap-4 px-4 py-3 sm:px-6">
          <Logo href="/dashboard" />
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-sm font-bold sm:inline">{displayName}</span>
            <form action={signOut}>
              <button type="submit" aria-label="Sign out" className="flex h-11 w-11 items-center justify-center rounded-sm text-ink-2 hover:bg-surface-high">
                <Icon name="logout" size={20} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="m-0 text-[28px] font-extrabold">Your stores</h1>
            <p className="m-0 mt-1 text-[15px] text-ink-2">
              {stores.length} {stores.length === 1 ? "store" : "stores"} on this account. Choose one to open its dashboard.
            </p>
          </div>
          <Link href="/onboarding" className="btn btn-primary">
            <Icon name="plus" size={18} strokeWidth={2.5} /> Add a store
          </Link>
        </div>

        <ul className="m-0 flex list-none flex-wrap gap-4 p-0">
          {stores.map((s) => {
            const t = sales.get(s.id);
            const currency = currencyOf.get(s.id) ?? "UGX";
            return (
              <li key={s.id} className="flex min-w-0 flex-[1_1_320px]">
                <form action={openStore} className="flex w-full">
                  <input type="hidden" name="store_id" value={s.id} />
                  <button
                    type="submit"
                    className="flex w-full flex-col gap-4 rounded-md bg-surface p-5 text-left shadow-card transition-shadow hover:shadow-fab focus-visible:shadow-fab"
                  >
                    <span className="flex w-full items-center gap-3">
                      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-sm bg-primary text-lg font-extrabold text-white">
                        {initials(s.name)}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-lg font-extrabold">{s.name}</span>
                        <span className="flex items-center gap-1 truncate text-[13px] text-ink-2">
                          <Icon name="pin" size={14} /> {s.address || "No location set"}
                        </span>
                      </span>
                      <span className="text-primary"><Icon name="arrowRight" /></span>
                    </span>
                    <span className="flex w-full items-end justify-between gap-3 border-t border-surface-mid pt-3">
                      <span className="flex flex-col">
                        <span className="text-xs font-bold tracking-[1px] text-ink-2">SALES TODAY</span>
                        <span className="text-lg font-extrabold text-primary">{money(t?.total ?? 0, currency)}</span>
                      </span>
                      <span className="text-[13px] text-ink-2">
                        {t?.count ? `${t.count} ${t.count === 1 ? "sale" : "sales"}` : "No sales yet"}
                      </span>
                    </span>
                  </button>
                </form>
              </li>
            );
          })}
        </ul>

        <section className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-md bg-surface p-5">
          <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-1">
            <h2 className="m-0 text-lg font-extrabold">Take the counter with you</h2>
            <p className="m-0 text-[15px] text-ink-2">The app keeps selling when the network drops and syncs with this dashboard.</p>
          </div>
          <DownloadButton />
        </section>
      </main>
    </div>
  );
}
