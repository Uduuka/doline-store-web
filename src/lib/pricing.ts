import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * The plans Doline Store sells. What each one allows comes from the cloud's public
 * `plan_limits` table — the same rows the Android and desktop apps read — so a limit changed
 * there shows here without a release.
 *
 * Prices come from the same rows (`monthly_price`, `extra_store_price`, `currency`), the one
 * place they're kept: the website and the apps read them there too, so a price changed in the
 * table shows everywhere without a release.
 */
export type PlanCode = "free" | "duka" | "business" | "chain";

/** A year costs this many months. */
export const MONTHS_PER_YEAR_PRICE = 10;
export const TRIAL_DAYS = 14;
export const ONLINE_ORDER_FEE_PERCENT = 0.5;

export const PLAN_LABELS: Record<PlanCode, string> = { free: "Free", duka: "Duka", business: "Business", chain: "Enterprise" };
export const PLAN_TAGLINES: Record<PlanCode, string> = {
  free: "Get your shop organised",
  duka: "One shop with a few helpers",
  business: "A busy shop, or two",
  chain: "A chain of stores",
};

type LimitsRow = Database["public"]["Tables"]["plan_limits"]["Row"];

export type Plan = {
  code: PlanCode;
  label: string;
  tagline: string;
  monthly: number;
  yearly: number;
  currency: string;
  extraStore: number | null;
  features: { text: string; included: boolean }[];
};

const n = (v: number | null | undefined, unit: string, unlimited = "Unlimited") =>
  v == null ? `${unlimited} ${unit}` : `${v.toLocaleString("en-US")} ${unit}`;

function features(r: LimitsRow, code: PlanCode, extraStore: number | null, currency: string): Plan["features"] {
  const f: Plan["features"] = [];
  const stores = r.stores ?? 0;
  const devices = r.devices_per_store ? `${r.devices} devices per store` : `up to ${r.devices ?? "unlimited"} device${r.devices === 1 ? "" : "s"}`;
  f.push({ text: `${stores} store${stores === 1 ? "" : "s"} on ${devices}`, included: true });
  if (code === "chain" && extraStore) f.push({ text: `More stores at ${currency} ${extraStore.toLocaleString("en-US")} each a month`, included: true });
  f.push({ text: `${n(r.items, "items")}, ${r.suppliers == null ? "unlimited suppliers" : `${r.suppliers} suppliers`}`, included: true });
  if (r.staff === 0) f.push({ text: "No staff accounts", included: false });
  else {
    const perms = r.staff_permissions === "presets" ? "ready-made roles" : r.staff_permissions === "custom" ? "custom permissions" : "store admins";
    f.push({ text: `${r.staff == null ? "Unlimited" : r.staff} staff with ${perms}`, included: true });
  }
  f.push({ text: r.report_days == null ? "Full report history" : `Reports for the last ${r.report_days} days`, included: true });
  if (!r.marketplace) f.push({ text: "Not listed on DolineMarket", included: false });
  else f.push({ text: r.listings == null ? `Unlimited DolineMarket listings${r.featured_listings ? ", featured" : ""}` : `Sell on DolineMarket: ${r.listings} listings`, included: true });
  if (r.promotions) f.push({ text: "Promotions and discounts", included: true });
  if (r.pdf_export) f.push({ text: "PDF export of reports", included: true });
  if (r.combined_reports) f.push({ text: "Combined reports across stores", included: true });
  if (r.report_email_frequency !== "none") {
    const who = r.email_recipients == null ? "unlimited people" : `${r.email_recipients} ${r.email_recipients === 1 ? "person" : "people"}`;
    f.push({ text: `${titleFreq(r.report_email_frequency)} report emails to ${who}`, included: true });
  }
  if (r.log_days !== 0) f.push({ text: r.log_days == null ? "Unlimited activity log" : `${r.log_days === 365 ? "1-year" : `${r.log_days}-day`} activity log`, included: true });
  f.push({ text: `Lilli: ${n(r.lilli_messages, "messages a month")}`, included: true });
  f.push({ text: code === "free" ? "Backs up once a day" : "Backs up continuously", included: true });
  return f;
}

function titleFreq(f: string) {
  return f.charAt(0).toUpperCase() + f.slice(1);
}

/** Every plan, smallest first, from the cloud. Public data: read with the anonymous key. */
export async function getPlans(): Promise<Plan[]> {
  const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await supabase.from("plan_limits").select("*").order("rank");
  if (error || !data?.length) return [];
  return (data as LimitsRow[]).map((r) => {
    const code = r.plan as PlanCode;
    const currency = r.currency;
    const monthly = Number(r.monthly_price);
    const extraStore = r.extra_store_price == null ? null : Number(r.extra_store_price);
    return {
      code,
      label: PLAN_LABELS[code] ?? r.plan,
      tagline: PLAN_TAGLINES[code] ?? "",
      monthly,
      yearly: monthly * MONTHS_PER_YEAR_PRICE,
      currency,
      extraStore,
      features: features(r, code, extraStore, currency),
    };
  });
}
