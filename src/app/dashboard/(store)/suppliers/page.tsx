import type { Metadata } from "next";
import Link from "next/link";
import { Empty } from "@/components/ui";
import { SupplierPanel } from "./supplier-panel";
import { requireStore } from "@/lib/store";
import { initials } from "@/lib/format";

export const metadata: Metadata = { title: "Suppliers" };
export const dynamic = "force-dynamic";

export default async function SuppliersPage({ searchParams }: { searchParams: Promise<{ supplier?: string }> }) {
  const { supplier } = await searchParams;
  const { supabase, store } = await requireStore();
  const here = (id?: string) => (id ? `/dashboard/suppliers?supplier=${id}` : "/dashboard/suppliers");
  const { data } = await supabase
    .from("suppliers")
    .select("id, supplier_store_id, store_contacts(name, phone, address), product_suppliers(count)")
    .eq("store_id", store.id)
    .is("deleted_at", null);

  // Names of linked Doline Store shops (store-to-store suppliers).
  const linkedIds = [...new Set((data ?? []).map((s) => s.supplier_store_id).filter(Boolean))] as string[];
  const { data: linked } = linkedIds.length ? await supabase.from("stores").select("id, name, address").in("id", linkedIds) : { data: [] };
  const linkedById = new Map((linked ?? []).map((s) => [s.id, s]));

  const rows = (data ?? []).map((s) => {
    const c = s.store_contacts as { name: string; phone: string | null; address: string | null } | null;
    const shop = s.supplier_store_id ? linkedById.get(s.supplier_store_id) : undefined;
    const items = (s.product_suppliers as { count: number }[] | null)?.[0]?.count ?? 0;
    return { id: s.id, name: shop?.name ?? c?.name ?? "Supplier", place: shop?.address ?? c?.address ?? null, phone: c?.phone ?? null, onDoline: !!s.supplier_store_id, items };
  });

  return (
    <>
      <main className="flex w-full max-w-[1360px] flex-col gap-4 p-4 sm:p-6">
        <h1 className="sr-only">Suppliers</h1>
        {rows.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
            {rows.map((s) => (
              <Link
                key={s.id}
                href={here(s.id)}
                scroll={false}
                prefetch={false}
                aria-current={supplier === s.id ? "true" : undefined}
                className={`card flex min-w-0 flex-col gap-3.5 text-ink no-underline transition-shadow hover:shadow-fab ${supplier === s.id ? "ring-2 ring-primary" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-sm bg-purple-c font-extrabold text-on-purple-c">{initials(s.name)}</span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-base font-extrabold">{s.name}</span>
                    {s.place && <span className="truncate text-[13px] text-ink-2">{s.place}</span>}
                  </span>
                </div>
                <span className={`pill self-start ${s.onDoline ? "bg-primary-container text-primary" : "bg-slate-c text-on-slate-c"}`}>
                  {s.onDoline ? "ON DOLINE STORE · WHOLESALE" : "YOUR SUPPLIER"}
                </span>
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-ink-2">Items supplied</span>
                    <span className="font-bold">{s.items}</span>
                  </div>
                  {s.phone && (
                    <div className="flex justify-between gap-3">
                      <span className="text-ink-2">Phone</span>
                      <span className="font-bold">{s.phone}</span>
                    </div>
                  )}
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-primary">View details and goods →</span>
              </Link>
            ))}
          </div>
        ) : (
          <section className="card p-0">
            <Empty>No suppliers yet. Add and link suppliers in the Doline Store app.</Empty>
          </section>
        )}
      </main>
      {supplier && <SupplierPanel supplierId={supplier} closeHref={here()} />}
    </>
  );
}
