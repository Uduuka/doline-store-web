import type { Metadata } from "next";
import Link from "next/link";
import { requireStore } from "@/lib/store";
import { initials, shortDate, time } from "@/lib/format";
import { PLAN_LABELS, type PlanCode } from "@/lib/pricing";
import { CURRENCIES, PAYMENT_METHODS, WEEK_DAYS, decodePermissions, presetMatching, type TipRule } from "@/lib/settings-model";
import { setPublished } from "@/app/dashboard/actions";
import { deleteZone, removeRecipient, signOutDevice } from "@/app/dashboard/settings-actions";
import { StoreSettingsForm } from "./store-form";
import { Currencies, DailyReportTime, MonthlyDay, PaymentMethods, SettingChoice, SettingSwitch, StaffForm, TipRules, WorkingHours, ZoneForm } from "./controls";
import { AddRecipientForm } from "./recipient-form";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

/** The apps' settings sections, in their groups (SettingsScreen.kt). */
const SECTIONS = [
  { key: "store", label: "Store details", group: "Store" },
  { key: "hours", label: "Working hours", group: "Store" },
  { key: "payments", label: "Payments & tenders", group: "Operations" },
  { key: "shipping", label: "Shipping & deliveries", group: "Operations" },
  { key: "inventory", label: "Inventory", group: "Operations" },
  { key: "reports", label: "Reports & analytics", group: "Operations" },
  { key: "notifications", label: "Notifications", group: "Operations" },
  { key: "taxation", label: "Taxation", group: "Operations" },
  { key: "staff", label: "Staff & security", group: "Access" },
  { key: "activity", label: "Activity", group: "Access" },
  { key: "plan", label: "Plan", group: "Account" },
  { key: "devices", label: "Active devices", group: "Account" },
  { key: "device", label: "On each device", group: "Device" },
] as const;
type SectionKey = (typeof SECTIONS)[number]["key"];

type MyPlan = {
  plan: string;
  status: "trial" | "active" | "grace";
  expires_at: string | null;
  grace_ends_at: string | null;
  enforced: boolean;
  limits: {
    marketplace?: boolean;
    items?: number | null;
    stores?: number | null;
    staff?: number | null;
    devices?: number | null;
    log_days?: number | null;
    email_recipients?: number | null;
    report_email_frequency?: string;
    staff_permissions?: string;
  };
  usage: { items?: number; stores?: number; staff?: number; devices?: number };
};

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const { section: raw } = await searchParams;
  const section: SectionKey = SECTIONS.some((s) => s.key === raw) ? (raw as SectionKey) : "store";
  const current = SECTIONS.find((s) => s.key === section)!;
  const groups = [...new Set(SECTIONS.map((s) => s.group))];
  const href = (k: string) => (k === "store" ? "/dashboard/settings" : `/dashboard/settings?section=${k}`);

  return (
    <main className="flex w-full max-w-[1360px] flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-start lg:gap-8">
      <h1 className="sr-only">Settings</h1>
      {/* Sections: a list on wide screens, a row of chips on narrow ones. */}
      <nav aria-label="Settings sections" className="flex-none lg:sticky lg:top-6 lg:w-[220px]">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
          {SECTIONS.map((s) => (
            <Link key={s.key} href={href(s.key)} prefetch={false} aria-current={s.key === section ? "page" : undefined} className={`chip inline-flex items-center no-underline ${s.key === section ? "bg-primary text-white" : "bg-surface text-ink"}`}>
              {s.label}
            </Link>
          ))}
        </div>
        <div className="hidden flex-col lg:flex">
          {groups.map((g) => (
            <div key={g} className="flex flex-col">
              <span className="px-3 pt-4 pb-1.5 text-[11px] font-bold tracking-[3px] text-ink-2">{g.toUpperCase()}</span>
              {SECTIONS.filter((s) => s.group === g).map((s) => (
                <Link
                  key={s.key}
                  href={href(s.key)}
                  prefetch={false}
                  aria-current={s.key === section ? "page" : undefined}
                  className={`flex min-h-10 items-center rounded-sm px-3 text-[15px] no-underline ${s.key === section ? "bg-surface font-extrabold text-primary" : "font-semibold text-ink hover:bg-surface"}`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </nav>

      <div className="flex min-w-0 max-w-[780px] flex-1 flex-col gap-4">
        <h2 className="m-0 text-2xl font-extrabold">{current.label}</h2>
        <Section section={section} />
      </div>
    </main>
  );
}

async function Section({ section }: { section: SectionKey }) {
  switch (section) {
    case "store":
      return <StoreSection />;
    case "hours":
      return <HoursSection />;
    case "payments":
      return <PaymentsSection />;
    case "shipping":
      return <ShippingSection />;
    case "inventory":
      return <InventorySection />;
    case "reports":
      return <ReportsSection />;
    case "notifications":
      return <NotificationsSection />;
    case "taxation":
      return <TaxationSection />;
    case "staff":
      return <StaffSection />;
    case "activity":
      return <ActivitySection />;
    case "plan":
      return <PlanSection />;
    case "devices":
      return <DevicesSection />;
    case "device":
      return <DeviceOnlySection />;
  }
}

// ---------------------------------------------------------------- Pieces

function Card({ title, sub, children }: { title?: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="card flex flex-col gap-3 p-6">
      {(title || sub) && (
        <div className="flex flex-col gap-0.5">
          {title && <h3 className="m-0 text-lg font-extrabold">{title}</h3>}
          {sub && <p className="m-0 text-sm text-ink-2">{sub}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

/** Whether the apps act on a setting yet, said up front (the apps' own Effect notes). */
function Effect({ live, children }: { live: boolean; children: React.ReactNode }) {
  return (
    <p className={`m-0 rounded-sm px-3.5 py-3 text-[13px] leading-normal font-semibold ${live ? "bg-success-container text-on-success-container" : "bg-amber-c text-on-amber-c"}`}>{children}</p>
  );
}

function NotSynced() {
  return (
    <Card>
      <p className="m-0 text-ink-2">This store&apos;s settings haven&apos;t synced from the Doline Store app yet. Open the store in the app, and they&apos;ll appear here after its next sync.</p>
    </Card>
  );
}

async function settingsRow() {
  const { supabase, store, currency } = await requireStore();
  const { data } = await supabase.from("store_settings").select("*").eq("store_id", store.id).maybeSingle();
  return { supabase, store, currency, s: data };
}

async function myPlan() {
  const { supabase } = await requireStore();
  const { data } = await supabase.rpc("my_plan");
  return (data ?? null) as MyPlan | null;
}

// ---------------------------------------------------------------- Store

async function StoreSection() {
  const { supabase, store } = await requireStore();
  const [{ data: details }, p] = await Promise.all([supabase.from("stores").select("slug, description, marketplace_published_at").eq("id", store.id).single(), myPlan()]);
  const canPublish = !p?.enforced || !!p?.limits?.marketplace;
  const published = !!details?.marketplace_published_at;
  return (
    <>
      <Card title="Store" sub="The name and description reach the DolineMarket storefront, so this is the shop's public face.">
        <StoreSettingsForm name={store.name} slug={details?.slug ?? ""} address={store.address ?? ""} description={details?.description ?? ""} />
      </Card>
      <section className="card flex items-center gap-4 p-6">
        <div className="min-w-0 flex-1">
          <h3 className="m-0 mb-1 text-lg font-extrabold">DolineMarket</h3>
          <p className="m-0 text-sm leading-normal text-ink-2">
            {published
              ? `Published since ${shortDate(details?.marketplace_published_at)}. Buyers near you can see your store and order.`
              : canPublish
                ? "Not published. Publish to let nearby buyers find your store."
                : "Publishing on DolineMarket is part of Duka and above."}
          </p>
        </div>
        <form action={setPublished}>
          <input type="hidden" name="publish" value={String(!published)} />
          <button
            type="submit"
            role="switch"
            aria-checked={published}
            aria-label="Show on DolineMarket"
            disabled={!published && !canPublish}
            className={`flex h-8 w-14 flex-none cursor-pointer rounded-full p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${published ? "justify-end bg-primary" : "justify-start bg-outline"}`}
          >
            <span className="h-6 w-6 rounded-full bg-white shadow" />
          </button>
        </form>
      </section>
      <Card title="Store front picture">
        <p className="m-0 text-sm text-ink-2">Shown on your DolineMarket storefront. Choose or change it in the Doline Store app, under Settings → Store details.</p>
      </Card>
    </>
  );
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

async function HoursSection() {
  const { supabase, store } = await requireStore();
  const { data } = await supabase
    .from("working_hours")
    .select("id, day, status, open_24_hours, open_minute_of_day, close_minute_of_day")
    .eq("store_id", store.id)
    .is("deleted_at", null);
  const hours = (data ?? []).sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));
  return (
    <>
      <Effect live>Published on DolineMarket so buyers can see when you&apos;re open. The till itself isn&apos;t locked outside these hours.</Effect>
      <Card>
        {hours.length ? (
          <WorkingHours hours={hours} />
        ) : (
          <p className="m-0 text-ink-2">Working hours haven&apos;t been set up yet. Open Settings → Working hours in the Doline Store app once, and you can change them here after it syncs.</p>
        )}
      </Card>
    </>
  );
}

// ---------------------------------------------------------------- Operations

async function PaymentsSection() {
  const { supabase, store, s } = await settingsRow();
  if (!s) return <NotSynced />;
  const { data: st } = await supabase.from("stores").select("accepted_currency_codes, accepted_payment_method_codes").eq("id", store.id).single();
  const rules = (Array.isArray(s.tip_rules) ? (s.tip_rules as TipRule[]) : []).map((r) => ({ amount: Number(r.min_order_amount), tip: Number(r.value ?? r.percent ?? 0), type: r.type ?? "percent" }));
  return (
    <>
      <Card title="Accepted payment methods" sub="Published for buyers on DolineMarket.">
        <PaymentMethods options={[...PAYMENT_METHODS]} accepted={st?.accepted_payment_method_codes ?? []} />
      </Card>
      <Card title="Currency" sub="Which currencies the shop prices in. Published for buyers.">
        <Currencies options={[...CURRENCIES]} accepted={st?.accepted_currency_codes ?? []} current={s.default_currency} />
      </Card>
      <Card title="Tips" sub="Orders from an amount take a tip; an order takes the highest rule it reaches.">
        <Effect live>Added to the total at the till. Turning tips on or off is done on each till, in the app.</Effect>
        <TipRules rules={rules} currency={s.default_currency} />
      </Card>
      <Card title="Loyalty program">
        <Effect live={false}>Set on each till in the app. It&apos;s saved there, but no points are awarded anywhere yet.</Effect>
      </Card>
    </>
  );
}

async function ShippingSection() {
  const { supabase, store, currency } = await requireStore();
  const [{ data: st }, { data: zones }] = await Promise.all([
    supabase.from("stores").select("offer_delivery").eq("id", store.id).single(),
    supabase.from("delivery_zones").select("id, distance, price, delivery_time, distance_units, time_units").eq("store_id", store.id).is("deleted_at", null).order("distance"),
  ]);
  return (
    <>
      <Effect live>Published on DolineMarket, where the zone prices are what a buyer is actually charged. Worth keeping accurate.</Effect>
      <Card>
        <SettingSwitch k="offer_delivery" label="Do you offer delivery?" description="The switch buyers see." checked={!!st?.offer_delivery} />
      </Card>
      <Card title="Delivery zone pricing" sub="Each zone covers up to a distance from the shop.">
        {zones?.length ? (
          <div className="flex flex-col">
            {zones.map((z) => (
              <details key={z.id} className="group border-b border-surface-mid py-1 last:border-0">
                <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 rounded-sm px-1 hover:bg-surface-low">
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-bold">
                      Up to {Number(z.distance).toLocaleString("en-US")} {z.distance_units.toLowerCase()}
                    </span>
                    <span className="text-[13px] text-ink-2">
                      About {z.delivery_time} {z.time_units.toLowerCase()}
                    </span>
                  </span>
                  <span className="font-extrabold">
                    {currency} {Number(z.price).toLocaleString("en-US")}
                  </span>
                  <span className="text-sm font-bold text-primary group-open:hidden">Edit</span>
                </summary>
                <div className="flex flex-col gap-3 px-1 pt-2 pb-4">
                  <ZoneForm zone={{ id: z.id, distance: Number(z.distance), price: Number(z.price), delivery_time: z.delivery_time }} currency={currency} />
                  <form action={deleteZone}>
                    <input type="hidden" name="id" value={z.id} />
                    <button type="submit" className="min-h-10 text-sm font-bold text-error">
                      Delete this zone
                    </button>
                  </form>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <p className="m-0 text-ink-2">No delivery zones yet.</p>
        )}
        <details className="rounded-md bg-surface-low p-4">
          <summary className="cursor-pointer font-bold text-primary">Add delivery zone</summary>
          <div className="pt-3">
            <ZoneForm currency={currency} />
          </div>
        </details>
      </Card>
    </>
  );
}

async function InventorySection() {
  const { supabase, store, s } = await settingsRow();
  const { data: st } = await supabase.from("stores").select("is_supplier, is_wholesaler").eq("id", store.id).single();
  return (
    <>
      <Card title="Supplying other stores" sub="Published on the store, where buying stores can find you.">
        <div className="flex flex-col divide-y divide-surface-mid">
          <SettingSwitch k="is_wholesaler" label="Wholesaler" description="You sell wholesale to any store." checked={!!st?.is_wholesaler} />
          <SettingSwitch k="is_supplier" label="Supplier" description="You distribute, or supply particular products to stores." checked={!!st?.is_supplier} />
        </div>
      </Card>
      {s ? (
        <Card title="Stock">
          <Effect live={false}>Saved, but not enforced yet: Deny doesn&apos;t stop a sale going negative.</Effect>
          <span className="label">Negative stock policy</span>
          <SettingChoice
            k="negative_stock_policy"
            label="Negative stock policy"
            value={s.negative_stock_policy}
            options={[
              { value: "allow", label: "Allow negative stock" },
              { value: "deny", label: "Deny negative stock" },
              { value: "ask", label: "Ask manager's approval" },
            ]}
          />
        </Card>
      ) : (
        <NotSynced />
      )}
      <Card title="Barcodes and auto re-order">
        <Effect live={false}>Set on each till in the app. Scanning works whether or not these are on, and auto re-order orders nothing yet.</Effect>
      </Card>
    </>
  );
}

async function ReportsSection() {
  const { supabase, store, s } = await settingsRow();
  if (!s) return <NotSynced />;
  const [{ data: recipients }, p] = await Promise.all([
    supabase.from("report_email_recipients").select("id, email").eq("store_id", store.id).is("deleted_at", null).order("created_at"),
    myPlan(),
  ]);
  const noEmails = !!p?.enforced && p.limits?.report_email_frequency === "none";
  const limit = p?.limits?.email_recipients;
  return (
    <>
      <Effect live={false}>
        The schedule and recipients are saved to the cloud; whether an email arrives is up to the server. Meanwhile, share any report by hand from{" "}
        <Link href="/dashboard/reports" className="font-extrabold underline">
          Reports
        </Link>
        .
      </Effect>
      {noEmails && <p className="m-0 text-sm font-bold text-ink-2">Scheduled report emails come with Duka and above.</p>}
      <Card title="Automatic reporting schedule">
        <div className="flex flex-col divide-y divide-surface-mid">
          <div className="flex flex-col gap-2 pb-3">
            <SettingSwitch k="daily_report_enabled" label="Daily close-out report" checked={s.daily_report_enabled} disabled={noEmails && !s.daily_report_enabled} />
            {s.daily_report_enabled && <DailyReportTime hour={s.daily_report_hour} minute={s.daily_report_minute} />}
          </div>
          <div className="flex flex-col gap-2 py-3">
            <SettingSwitch k="weekly_report_enabled" label="Weekly summary report" checked={s.weekly_report_enabled} disabled={noEmails && !s.weekly_report_enabled} />
            {s.weekly_report_enabled && (
              <SettingChoice k="weekly_report_day" label="Weekly report day" value={s.weekly_report_day} options={WEEK_DAYS.map((d) => ({ value: d, label: d }))} />
            )}
          </div>
          <div className="flex flex-col gap-2 pt-3">
            <SettingSwitch k="monthly_report_enabled" label="Monthly report" checked={s.monthly_report_enabled} disabled={noEmails && !s.monthly_report_enabled} />
            {s.monthly_report_enabled && <MonthlyDay value={s.monthly_report_day} />}
          </div>
        </div>
      </Card>
      <Card title="Email recipients" sub={limit != null && p?.enforced ? `Your plan sends to ${limit} ${limit === 1 ? "address" : "addresses"}.` : undefined}>
        {recipients?.length ? (
          <div className="flex flex-col">
            {recipients.map((r) => (
              <div key={r.id} className="flex items-center gap-3 border-b border-surface-mid py-2 last:border-0">
                <span className="min-w-0 flex-1 truncate">{r.email}</span>
                <form action={removeRecipient}>
                  <input type="hidden" name="id" value={r.id} />
                  <button type="submit" className="min-h-10 px-2 text-sm font-bold text-error">
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="m-0 text-ink-2">Nobody receives reports yet.</p>
        )}
        <AddRecipientForm />
      </Card>
    </>
  );
}

async function NotificationsSection() {
  const { s } = await settingsRow();
  if (!s) return <NotSynced />;
  return (
    <>
      <Effect live>Shared by every device on this store. Notifications collect under the bell in the app.</Effect>
      <Card title="What to notify about">
        <div className="flex flex-col divide-y divide-surface-mid">
          <SettingSwitch k="notify_new_orders" label="New marketplace orders" description="Orders placed on DolineMarket, to pack or deliver." checked={s.notify_new_orders} />
          <SettingSwitch k="notify_low_inventory" label="Stock" description="Items out of stock or running low, and batches expiring within a week." checked={s.notify_low_inventory} />
          <SettingSwitch k="notify_customer_review" label="Reviews and ratings" description="What buyers say about the store and its listings." checked={s.notify_customer_review} />
        </div>
      </Card>
      <Card title="Pop-ups" sub="As well as the bell: a notification on phones, a toast on computers.">
        <SettingChoice
          k="push_notification_mode"
          label="Pop-ups"
          value={s.push_notification_mode}
          options={[
            { value: "all", label: "Everything" },
            { value: "urgent", label: "Urgent only" },
            { value: "none", label: "Off" },
          ]}
        />
        <p className="m-0 text-[13px] text-ink-2">
          {s.push_notification_mode === "all"
            ? "Every notification pops up."
            : s.push_notification_mode === "none"
              ? "Nothing pops up; check the bell."
              : "Only marketplace orders and changes stuck on their way to the cloud pop up."}
        </p>
      </Card>
    </>
  );
}

async function TaxationSection() {
  const { s } = await settingsRow();
  if (!s) return <NotSynced />;
  return (
    <>
      <Effect live={false}>Not wired to anything yet: no VAT is added to or taken out of a sale, and nothing is filed with EFRIS.</Effect>
      <Card title="VAT / sales tax" sub="Whether prices include VAT or have it added on top.">
        <SettingChoice
          k="vat_mode"
          label="VAT mode"
          value={s.vat_mode}
          options={[
            { value: "inclusive", label: "Inclusive" },
            { value: "exclusive", label: "Exclusive" },
          ]}
        />
        <p className="m-0 text-[13px] text-ink-2">The VAT percentage and the EFRIS API key are kept on each till; set them in the app.</p>
      </Card>
    </>
  );
}

// ---------------------------------------------------------------- Access

async function StaffSection() {
  const { supabase, store, user } = await requireStore();
  const [{ data }, p] = await Promise.all([
    supabase
      .from("store_staff")
      .select("id, role, is_admin, permissions, locked_until, store_contacts(name, linked_profile_id), store_staff_stores(store_id, role)")
      .eq("keeper_id", user.id)
      .is("deleted_at", null),
    myPlan(),
  ]);
  // The account's admins work at every store; anyone else at the stores they're linked to.
  const people = (data ?? [])
    .filter((m) => m.is_admin || (m.store_staff_stores as { store_id: string }[]).some((l) => l.store_id === store.id))
    .map((m) => {
      const c = m.store_contacts as { name: string; linked_profile_id: string | null } | null;
      const link = (m.store_staff_stores as { store_id: string; role: string | null }[]).find((l) => l.store_id === store.id);
      const perms = decodePermissions(m.permissions);
      return {
        id: m.id,
        name: c?.name ?? "Staff",
        role: link?.role ?? m.role ?? (m.is_admin ? "Admin" : "Staff"),
        isAdmin: m.is_admin,
        self: c?.linked_profile_id === user.id,
        locked: !!m.locked_until && Date.parse(m.locked_until) > Date.now(),
        permissions: perms,
        preset: m.is_admin ? null : presetMatching(perms),
      };
    })
    .sort((a, b) => Number(b.isAdmin) - Number(a.isAdmin) || a.name.localeCompare(b.name));
  const mode = p?.limits?.staff_permissions;
  const customAllowed = !p?.enforced || mode === "custom" || mode === "custom_store_admins";
  const staffLimit = p?.limits?.staff;

  return (
    <>
      <Card title="Staff" sub="Each person unlocks the till with their own 6-digit pass key.">
        {people.length ? (
          <div className="flex flex-col">
            {people.map((m) => (
              <details key={m.id} className="group border-b border-surface-mid py-1 last:border-0">
                <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-sm px-1 hover:bg-surface-low">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-container text-[13px] font-extrabold text-on-primary-container">{initials(m.name)}</span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-bold">{m.name}</span>
                    <span className="truncate text-[13px] text-ink-2">
                      {m.role}
                      {m.preset ? ` · ${m.preset}` : !m.isAdmin ? " · Custom permissions" : ""}
                    </span>
                  </span>
                  {m.locked && <span className="pill bg-error-container text-on-error-container">LOCKED OUT</span>}
                  {m.isAdmin && <span className="pill bg-primary-container text-primary">ADMIN</span>}
                  {m.self && <span className="pill bg-slate-c text-on-slate-c">YOU</span>}
                  <span className="text-sm font-bold text-primary group-open:hidden">Edit</span>
                </summary>
                <div className="px-1 pt-2 pb-4">
                  <StaffForm member={m} customAllowed={customAllowed} />
                </div>
              </details>
            ))}
          </div>
        ) : (
          <p className="m-0 text-ink-2">No staff on this store yet.</p>
        )}
        <p className="m-0 text-[13px] text-ink-2">
          Add or remove staff in the Doline Store app, under Settings → Staff &amp; security, which ties each person to their store.
          {staffLimit != null && p?.enforced ? ` Your plan allows ${staffLimit} staff besides admins (${p.usage?.staff ?? 0} used).` : ""}
        </p>
      </Card>
      <Card title="Lock screen">
        <Effect live>Set on each phone or computer in the app: how long it sits unused before it locks and asks who&apos;s on shift.</Effect>
      </Card>
    </>
  );
}

async function ActivitySection() {
  const { supabase, store } = await requireStore();
  const p = await myPlan();
  const days = p?.limits?.log_days;
  if (p?.enforced && days === 0) {
    return (
      <Card>
        <p className="m-0 text-ink-2">The activity log, of who did what and which admin allowed it, comes with Duka and above.</p>
        <Link href="/#pricing" className="btn btn-tonal self-start">
          See plans
        </Link>
      </Card>
    );
  }
  let q = supabase.from("activity_log").select("id, at, actor_name, approved_by_name, summary").eq("store_id", store.id).order("at", { ascending: false }).limit(150);
  if (p?.enforced && days) q = q.gte("at", new Date(Date.now() - days * 86_400_000).toISOString());
  const { data } = await q;
  return (
    <section className="card overflow-hidden p-0">
      <p className="m-0 px-5 pt-5 pb-2 text-sm text-ink-2">Who did what, and which admin allowed it.{p?.enforced && days ? ` Your plan keeps ${days} days.` : ""}</p>
      {data?.length ? (
        <div className="flex flex-col">
          {data.map((a) => (
            <div key={a.id} className="flex gap-4 border-b border-surface-mid px-5 py-3 last:border-0">
              <span className="w-[92px] flex-none text-[13px] text-ink-2">
                {shortDate(a.at)}
                <br />
                {time(a.at)}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[15px]">{a.summary}</span>
                <span className="text-[13px] text-ink-2">
                  {a.actor_name ?? "Someone"}
                  {a.approved_by_name ? ` · allowed by ${a.approved_by_name}` : ""}
                </span>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="m-0 px-5 pb-6 text-ink-2">Nothing recorded yet.</p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- Account

async function PlanSection() {
  const p = await myPlan();
  const code = (p?.plan ?? "free") as PlanCode;
  const planName = `${PLAN_LABELS[code] ?? code}${p?.status === "trial" ? " trial" : ""}`;
  const usage = (label: string, used?: number, limit?: number | null) =>
    used == null ? null : (
      <div key={label} className="flex justify-between gap-3 border-b border-surface-mid py-2.5 text-sm last:border-0">
        <span className="text-ink-2">{label}</span>
        <span className="font-bold">
          {used.toLocaleString("en-US")} {limit == null ? "· no limit" : `of ${limit.toLocaleString("en-US")}`}
        </span>
      </div>
    );
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[26px] font-extrabold text-primary">{planName}</div>
        {p?.status === "trial" && <span className="pill bg-primary-container text-primary">TRIAL</span>}
        {p?.status === "grace" && <span className="pill bg-error-container text-on-error-container">PAYMENT OVERDUE</span>}
        {p?.status === "active" && code !== "free" && <span className="pill bg-success-container text-on-success-container">ACTIVE</span>}
      </div>
      {p?.status === "trial" && p.expires_at && <p className="m-0 text-sm text-ink-2">Trial ends on {shortDate(p.expires_at)}, then your shop moves to Free.</p>}
      {p?.status === "grace" && p.grace_ends_at && <p className="m-0 text-sm text-error">Renew by {shortDate(p.grace_ends_at)} to keep your plan.</p>}
      {p?.status === "active" && p.expires_at && <p className="m-0 text-sm text-ink-2">Renews on {shortDate(p.expires_at)}.</p>}
      <div className="flex flex-col">
        {usage("Stores", p?.usage?.stores, p?.limits?.stores)}
        {usage("Items", p?.usage?.items, p?.limits?.items)}
        {usage("Staff", p?.usage?.staff, p?.limits?.staff)}
        {usage("Devices", p?.usage?.devices, p?.limits?.devices)}
      </div>
      <Link href="/#pricing" className="btn btn-tonal self-start">
        See plans
      </Link>
    </Card>
  );
}

async function DevicesSection() {
  const { supabase, user } = await requireStore();
  const [{ data }, p] = await Promise.all([
    supabase.from("account_devices").select("device_id, name, platform, app_version, last_seen_at, signed_out_at, pending_changes, synced_at").eq("keeper_id", user.id).order("last_seen_at", { ascending: false }),
    myPlan(),
  ]);
  const active = (data ?? []).filter((d) => !d.signed_out_at);
  const out = (data ?? []).filter((d) => d.signed_out_at).slice(0, 10);
  const limit = p?.limits?.devices;
  return (
    <>
      <Card title="Signed in" sub={`Phones and computers signed in to this account.${limit != null && p?.enforced ? ` Your plan allows ${limit}.` : ""}`}>
        {active.length ? (
          <div className="flex flex-col">
            {active.map((d) => (
              <div key={d.device_id} className="flex flex-wrap items-center gap-3 border-b border-surface-mid py-3 last:border-0">
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-bold">{d.name || d.platform}</span>
                  <span className="text-[13px] text-ink-2">
                    {d.platform}
                    {d.app_version ? ` · v${d.app_version}` : ""} · last seen {shortDate(d.last_seen_at)} {time(d.last_seen_at)}
                  </span>
                  {(d.pending_changes ?? 0) > 0 && (
                    <span className="text-[13px] font-bold text-on-amber-c">
                      {d.pending_changes} {d.pending_changes === 1 ? "change" : "changes"} not backed up yet
                    </span>
                  )}
                </span>
                <form action={signOutDevice}>
                  <input type="hidden" name="device_id" value={d.device_id} />
                  <button type="submit" className="btn btn-tonal h-10 px-4 text-sm">
                    Sign out
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="m-0 text-ink-2">No phones or computers are signed in.</p>
        )}
        <p className="m-0 text-[13px] text-ink-2">A device that&apos;s signed out asks for a sign-in the next time it&apos;s opened. Anything it hasn&apos;t backed up stays on it until then.</p>
      </Card>
      {out.length > 0 && (
        <Card title="Signed out recently">
          {out.map((d) => (
            <div key={d.device_id} className="flex justify-between gap-3 text-sm">
              <span className="text-ink-2">{d.name || d.platform}</span>
              <span className="text-ink-2">{shortDate(d.signed_out_at)}</span>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}

function DeviceOnlySection() {
  const items = [
    ["Backup & sync", "When the device backs up, and what it hasn't yet."],
    ["POS hardware", "Receipt printers, barcode scanners, cash drawers and scales."],
    ["Lock screen", "How long the device sits unused before it asks who's on shift."],
    ["Tips on or off", "Whether the till adds tips. The tip rules themselves are in Payments & tenders."],
    ["Loyalty program", "Points per amount spent."],
    ["Barcodes", "Generating, scanning and printing barcode labels."],
    ["Auto re-order", "Re-ordering stock that runs low."],
    ["VAT percentage and EFRIS", "The tax rate and the EFRIS API key."],
    ["Vibration", "Whether the device vibrates for notifications."],
  ];
  return (
    <Card sub="These belong to each phone or computer, so they're set in the Doline Store app on that device.">
      <div className="flex flex-col">
        {items.map(([t, d]) => (
          <div key={t} className="flex flex-col border-b border-surface-mid py-3 last:border-0">
            <span className="font-bold">{t}</span>
            <span className="text-[13px] text-ink-2">{d}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
