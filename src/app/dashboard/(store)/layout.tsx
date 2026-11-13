import { Shell } from "@/components/shell";
import { requireStore } from "@/lib/store";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { supabase, stores, store, displayName } = await requireStore();

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("store_id", store.id)
    .eq("channel", "online")
    .in("fulfilment_status", ["PENDING", "READY"])
    .is("deleted_at", null);

  return (
    <Shell stores={stores} store={store} displayName={displayName} onlineOpen={count ?? 0}>
      {children}
    </Shell>
  );
}
