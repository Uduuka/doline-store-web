"use server";

import { pbkdf2Sync, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import type { Database } from "@/lib/database.types";
import { passKeyError } from "@/lib/admin-pass-key";
import { requireStore } from "@/lib/store";
import { ALL_PERMISSIONS, CURRENCIES, PAYMENT_METHODS, ROLE_PRESETS, WEEK_DAYS, encodePermissions, type TipRule } from "@/lib/settings-model";

/*
 * Settings, written the way the Doline Store apps write them (SettingsViewModel, SyncEngine):
 * store-wide settings to store_settings, the storefront facts buyers see to the stores row, and
 * the lists (hours, zones, recipients, staff) to their own tables. The apps pull all of these, so
 * a change here reaches every till on its next sync.
 */

type Update<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];

export type SettingsState = { error?: string; message?: string } | undefined;

const SAVED: SettingsState = { message: "Saved." };
const done = () => revalidatePath("/dashboard/settings");

type PlanInfo = { enforced?: boolean; limits?: { report_email_frequency?: string; email_recipients?: number | null; staff_permissions?: string } };
async function planOf(supabase: Awaited<ReturnType<typeof requireStore>>["supabase"]): Promise<PlanInfo> {
  const { data } = await supabase.rpc("my_plan");
  return (data ?? {}) as PlanInfo;
}

// ---------------------------------------------------------------- Single settings

const BOOL = (v: string) => (v === "true" ? true : v === "false" ? false : undefined);
const ONE_OF = (xs: readonly string[]) => (v: string) => (xs.includes(v) ? v : undefined);

/** Settings on store_settings, each with how its value is read from the form. */
const SETTINGS: Record<string, (v: string) => unknown> = {
  notify_new_orders: BOOL,
  notify_low_inventory: BOOL,
  notify_customer_review: BOOL,
  push_notification_mode: ONE_OF(["all", "urgent", "none"]),
  negative_stock_policy: ONE_OF(["allow", "deny", "ask"]),
  vat_mode: ONE_OF(["inclusive", "exclusive"]),
  daily_report_enabled: BOOL,
  weekly_report_enabled: BOOL,
  monthly_report_enabled: BOOL,
  weekly_report_day: ONE_OF(WEEK_DAYS),
  monthly_report_day: ONE_OF(["first", "last", ...Array.from({ length: 28 }, (_, i) => String(i + 1))]),
};
/** Storefront facts, on the stores row where buyers and buying stores read them. */
const STOREFRONT: Record<string, (v: string) => unknown> = {
  offer_delivery: BOOL,
  is_supplier: BOOL,
  is_wholesaler: BOOL,
};
const REPORT_SWITCHES = ["daily_report_enabled", "weekly_report_enabled", "monthly_report_enabled"];

/** One setting changed: a switch, or a choice among a few. */
export async function setSetting(_: SettingsState, form: FormData): Promise<SettingsState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const key = String(form.get("key") ?? "");
  const raw = String(form.get("value") ?? "");
  const { supabase, store } = await requireStore();

  if (key in STOREFRONT) {
    const value = STOREFRONT[key]!(raw);
    if (value === undefined) return { error: "That isn't a valid choice." };
    const { error } = await supabase
      .from("stores")
      .update({ [key]: value } as Update<"stores">)
      .eq("id", store.id);
    if (error) return { error: "That couldn't be saved. Try again." };
    done();
    return SAVED;
  }

  const read = SETTINGS[key];
  if (!read) return { error: "That setting can't be changed here." };
  const value = read(raw);
  if (value === undefined) return { error: "That isn't a valid choice." };

  // A schedule the plan doesn't send stays off, as in the apps (PlanGate.requireReportSchedule).
  if (REPORT_SWITCHES.includes(key) && value === true) {
    const p = await planOf(supabase);
    if (p.enforced && p.limits?.report_email_frequency === "none") return { error: "Scheduled report emails come with Duka and above." };
  }

  const { data, error } = await supabase
    .from("store_settings")
    .update({ [key]: value } as Update<"store_settings">)
    .eq("store_id", store.id)
    .select("store_id");
  if (error) return { error: "That couldn't be saved. Try again." };
  if (!data?.length) return { error: "This store's settings haven't synced from the app yet. Open the store in the app first." };
  done();
  return SAVED;
}

/** The daily close-out report's time, "18:30". */
export async function setDailyReportTime(_: SettingsState, form: FormData): Promise<SettingsState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const m = String(form.get("time") ?? "").match(/^(\d{1,2}):(\d{2})/);
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return { error: "Choose a time of day." };
  const { supabase, store } = await requireStore();
  const { error } = await supabase
    .from("store_settings")
    .update({ daily_report_hour: Number(m[1]), daily_report_minute: Number(m[2]) })
    .eq("store_id", store.id);
  if (error) return { error: "The time couldn't be saved." };
  done();
  return SAVED;
}

// ---------------------------------------------------------------- Store details

export async function saveStoreDetails(_: SettingsState, form: FormData): Promise<SettingsState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store } = await requireStore();
  const name = String(form.get("name") ?? "").trim();
  const slug = String(form.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const description = String(form.get("description") ?? "").trim();
  const address = String(form.get("address") ?? "").trim();
  if (!name) return { error: "Your store needs a name." };
  if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { error: "A slug uses small letters, numbers and dashes only, like mama-janes-shop." };
  const { error } = await supabase
    .from("stores")
    .update({ name, slug: slug || null, description: description || null, address: address || null })
    .eq("id", store.id);
  if (error) return { error: error.code === "23505" ? "Another store already uses that slug. Try another." : "Your changes couldn't be saved." };
  revalidatePath("/dashboard", "layout");
  return SAVED;
}

// ---------------------------------------------------------------- Payments and currency

/** Which payment methods the store accepts, as buyers see on DolineMarket. */
export async function togglePaymentMethod(_: SettingsState, form: FormData): Promise<SettingsState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const code = String(form.get("value") ?? "");
  if (!PAYMENT_METHODS.some((m) => m.code === code)) return { error: "Unknown payment method." };
  const { supabase, store } = await requireStore();
  const { data } = await supabase.from("stores").select("accepted_payment_method_codes").eq("id", store.id).single();
  const codes = new Set(data?.accepted_payment_method_codes ?? []);
  if (codes.has(code)) codes.delete(code);
  else codes.add(code);
  const ordered = PAYMENT_METHODS.map((m) => m.code).filter((c) => codes.has(c));
  const { error } = await supabase.from("stores").update({ accepted_payment_method_codes: ordered }).eq("id", store.id);
  if (error) return { error: "That couldn't be saved." };
  done();
  return SAVED;
}

/** Accepts or stops accepting a currency. Dropping the default moves the default to one still accepted. */
export async function toggleCurrency(_: SettingsState, form: FormData): Promise<SettingsState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const code = String(form.get("value") ?? "");
  if (!CURRENCIES.some((c) => c.code === code)) return { error: "Unknown currency." };
  const { supabase, store } = await requireStore();
  const cur = await currencyState(supabase, store.id);
  if (!cur) return { error: "This store's settings haven't synced from the app yet." };
  const codes = cur.accepted.includes(code) ? cur.accepted.filter((c) => c !== code) : [...cur.accepted, code];
  if (!codes.length) return { error: "A store accepts at least one currency." };
  const next = codes.includes(cur.default) ? cur.default : codes[0]!;
  return writeCurrency(supabase, store.id, cur, codes, next);
}

/** Makes a currency the default (accepting it too), locking today's rate as the apps do. */
export async function setDefaultCurrency(_: SettingsState, form: FormData): Promise<SettingsState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const code = String(form.get("value") ?? "");
  if (!CURRENCIES.some((c) => c.code === code)) return { error: "Unknown currency." };
  const { supabase, store } = await requireStore();
  const cur = await currencyState(supabase, store.id);
  if (!cur) return { error: "This store's settings haven't synced from the app yet." };
  if (cur.default === code) return SAVED;
  const codes = cur.accepted.includes(code) ? cur.accepted : [...cur.accepted, code];
  return writeCurrency(supabase, store.id, cur, codes, code);
}

type Supa = Awaited<ReturnType<typeof requireStore>>["supabase"];
type CurrencyState = { accepted: string[]; default: string; locked: Record<string, number> };

async function currencyState(supabase: Supa, storeId: string): Promise<CurrencyState | null> {
  const [{ data: s }, { data: st }] = await Promise.all([
    supabase.from("store_settings").select("default_currency, locked_rates").eq("store_id", storeId).maybeSingle(),
    supabase.from("stores").select("accepted_currency_codes").eq("id", storeId).single(),
  ]);
  if (!s) return null;
  const locked = (s.locked_rates && typeof s.locked_rates === "object" && !Array.isArray(s.locked_rates) ? s.locked_rates : {}) as Record<string, number>;
  return { accepted: st?.accepted_currency_codes ?? [], default: s.default_currency, locked };
}

async function writeCurrency(supabase: Supa, storeId: string, cur: CurrencyState, accepted: string[], next: string): Promise<SettingsState> {
  let locked = cur.locked;
  if (next !== cur.default) {
    const { data: rates } = await supabase.from("currency_rates").select("code, rate").in("code", [cur.default, next]);
    const per = new Map((rates ?? []).map((r) => [r.code, Number(r.rate)]));
    const from = per.get(cur.default);
    const to = per.get(next);
    locked = withDefaultCurrency(cur.locked, cur.default, next, from && to ? to / from : null);
  }
  const ordered = CURRENCIES.map((c) => c.code as string).filter((c) => accepted.includes(c));
  const [a, b] = await Promise.all([
    supabase.from("stores").update({ accepted_currency_codes: ordered }).eq("id", storeId),
    supabase.from("store_settings").update({ default_currency: next, locked_rates: locked }).eq("store_id", storeId),
  ]);
  if (a.error || b.error) return { error: "The currency couldn't be saved." };
  revalidatePath("/dashboard", "layout");
  return SAVED;
}

/**
 * The locked rates after a switch from `current` to `next` (ExchangeRates.kt withDefaultCurrency):
 * going back along the trail drops the locks from there on; going on to a new currency locks
 * today's rate between the two, after dropping any stale locks past the currency being left.
 */
function withDefaultCurrency(locked: Record<string, number>, current: string, next: string, live: number | null): Record<string, number> {
  const trail = asTrail(locked);
  const fromOf = (k: string) => k.split(">")[0];
  const back = trail.findIndex(([k]) => fromOf(k) === next);
  let updated: [string, number][];
  if (back >= 0) updated = trail.slice(0, back);
  else {
    const leaving = trail.findIndex(([k]) => fromOf(k) === current);
    const base = leaving >= 0 ? trail.slice(0, leaving) : trail;
    updated = live != null ? [...base, [`${current}>${next}`, live]] : base;
  }
  return Object.fromEntries(updated);
}

function asTrail(locked: Record<string, number>): [string, number][] {
  const entries = Object.entries(locked);
  const byFrom = new Map(entries.map(([k, v]) => [k.split(">")[0]!, [k, v] as [string, number]]));
  const tos = new Set(entries.map(([k]) => k.split(">")[1]));
  let at = [...byFrom.keys()].find((f) => !tos.has(f));
  const ordered: [string, number][] = [];
  while (at && ordered.length < entries.length) {
    const nextPair = byFrom.get(at);
    if (!nextPair) break;
    ordered.push(nextPair);
    at = nextPair[0].split(">")[1];
  }
  return ordered.length === entries.length ? ordered : entries;
}

/** The tip ladder: lowest order amount first, one rule per amount. */
export async function saveTipRules(_: SettingsState, form: FormData): Promise<SettingsState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const type = String(form.get("type")) === "amount" ? "amount" : "percent";
  let raw: { amount: string; tip: string }[];
  try {
    raw = JSON.parse(String(form.get("rules") ?? "[]"));
  } catch {
    return { error: "The rules couldn't be read." };
  }
  const byAmount = new Map<number, TipRule>();
  for (const r of raw) {
    const amount = Number(String(r.amount).replace(/[, ]/g, ""));
    const tip = Number(String(r.tip).replace(/[, ]/g, ""));
    if (!Number.isFinite(amount) || !Number.isFinite(tip) || String(r.amount).trim() === "" || String(r.tip).trim() === "") continue;
    if (amount < 0 || tip < 0) return { error: "Amounts and tips can't be negative." };
    if (type === "percent" && tip > 100) return { error: "A tip can't be more than 100% of the order." };
    byAmount.set(amount, { min_order_amount: amount, value: tip, type });
  }
  const rules = [...byAmount.values()].sort((a, b) => a.min_order_amount - b.min_order_amount);
  const { supabase, store } = await requireStore();
  const { error } = await supabase.from("store_settings").update({ tip_rules: rules }).eq("store_id", store.id);
  if (error) return { error: "The tip rules couldn't be saved." };
  done();
  return { message: rules.length ? "Tip rules saved." : "Tip rules cleared." };
}

// ---------------------------------------------------------------- Working hours

/** The week's hours, saved together. Only rows already set up for this store are changed. */
export async function saveWorkingHours(_: SettingsState, form: FormData): Promise<SettingsState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store } = await requireStore();
  const ids = form.getAll("id").map(String);
  const minutes = (t: string) => {
    const m = t.match(/^(\d{1,2}):(\d{2})/);
    return m ? Number(m[1]) * 60 + Number(m[2]) : null;
  };
  for (const id of ids) {
    const open = String(form.get(`status_${id}`)) === "OPEN";
    const allDay = form.get(`allday_${id}`) === "on";
    const from = minutes(String(form.get(`open_${id}`) ?? ""));
    const to = minutes(String(form.get(`close_${id}`) ?? ""));
    if (open && !allDay && (from == null || to == null)) return { error: "Give each open day an opening and closing time, or mark it 24 hours." };
    const { error } = await supabase
      .from("working_hours")
      .update({
        status: open ? "OPEN" : "CLOSED",
        open_24_hours: allDay,
        ...(from != null ? { open_minute_of_day: from } : {}),
        ...(to != null ? { close_minute_of_day: to } : {}),
      })
      .eq("id", id)
      .eq("store_id", store.id);
    if (error) return { error: "The hours couldn't be saved." };
  }
  done();
  return { message: "Working hours saved." };
}

// ---------------------------------------------------------------- Report recipients

export async function addRecipient(_: SettingsState, form: FormData): Promise<SettingsState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const email = String(form.get("email") ?? "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Enter a valid email address." };
  const { supabase, store } = await requireStore();
  const { data: current } = await supabase.from("report_email_recipients").select("email").eq("store_id", store.id).is("deleted_at", null);
  if ((current ?? []).some((r) => r.email.toLowerCase() === email.toLowerCase())) return { error: `${email} already receives reports.` };
  const p = await planOf(supabase);
  const limit = p.limits?.email_recipients;
  if (p.enforced && limit != null && (current?.length ?? 0) >= limit) {
    return { error: limit === 0 ? "Report emails come with Duka and above." : `Your plan sends reports to ${limit} ${limit === 1 ? "address" : "addresses"}. Upgrade for more.` };
  }
  const { error } = await supabase.from("report_email_recipients").insert({ store_id: store.id, email });
  if (error) return { error: "The recipient couldn't be added." };
  done();
  return { message: `${email} will receive reports.` };
}

export async function removeRecipient(form: FormData) {
  if (await passKeyError(form)) return;
  const { supabase, store } = await requireStore();
  await supabase
    .from("report_email_recipients")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", String(form.get("id")))
    .eq("store_id", store.id);
  done();
}

// ---------------------------------------------------------------- Delivery zones

export async function saveZone(_: SettingsState, form: FormData): Promise<SettingsState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const id = String(form.get("id") ?? "");
  const num = (k: string) => Number(String(form.get(k) ?? "").replace(/[, ]/g, ""));
  const distance = num("distance");
  const price = num("price");
  const time = Math.round(num("delivery_time"));
  if (!(distance > 0)) return { error: "Enter how far the zone reaches." };
  if (!(price >= 0) || String(form.get("price") ?? "").trim() === "") return { error: "Enter what delivery costs in this zone." };
  if (!(time > 0)) return { error: "Enter how long delivery takes." };
  const { supabase, store } = await requireStore();
  const row = { distance, price, delivery_time: time };
  const { error } = id
    ? await supabase.from("delivery_zones").update(row).eq("id", id).eq("store_id", store.id)
    : await supabase.from("delivery_zones").insert({ ...row, store_id: store.id, distance_units: "KM", time_units: "Mins" });
  if (error) return { error: "The zone couldn't be saved." };
  done();
  return { message: id ? "Zone saved." : "Zone added." };
}

export async function deleteZone(form: FormData) {
  if (await passKeyError(form)) return;
  const { supabase, store } = await requireStore();
  await supabase
    .from("delivery_zones")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", String(form.get("id")))
    .eq("store_id", store.id);
  done();
}

// ---------------------------------------------------------------- Staff

const PASS_KEY_ITERATIONS = 10_000;

/** The apps' pass key hash (PassKeyCrypto.kt): "pbkdf2-sha256:<iterations>:<hex>", with a hex salt. */
function hashPassKey(passKey: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const digest = pbkdf2Sync(passKey, Buffer.from(salt, "hex"), PASS_KEY_ITERATIONS, 32, "sha256").toString("hex");
  return { hash: `pbkdf2-sha256:${PASS_KEY_ITERATIONS}:${digest}`, salt };
}

/**
 * Changes an existing staff member: name, role, admin, permissions and, when one is typed, a new
 * pass key. Adding and removing staff stay in the app, which ties each person to their store.
 */
export async function saveStaff(_: SettingsState, form: FormData): Promise<SettingsState> {
  const denied = await passKeyError(form);
  if (denied) return { error: denied };
  const { supabase, store, user } = await requireStore();
  const id = String(form.get("staff_id") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const role = String(form.get("role") ?? "").trim();
  const isAdmin = form.get("is_admin") === "on";
  const passKey = String(form.get("pass_key") ?? "").trim();
  const permissions = form.getAll("permissions").map(String).filter((p) => (ALL_PERMISSIONS as string[]).includes(p));
  if (!name || !role) return { error: "Name and role are required." };
  if (passKey && !/^\d{6}$/.test(passKey)) return { error: "A pass key is exactly 6 digits." };

  const { data: member } = await supabase
    .from("store_staff")
    .select("id, is_admin, contact_id, store_contacts(linked_profile_id)")
    .eq("id", id)
    .eq("keeper_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!member) return { error: "That staff member isn't on this account." };

  if (member.is_admin && !isAdmin) {
    const self = (member.store_contacts as { linked_profile_id: string | null } | null)?.linked_profile_id === user.id;
    if (self) return { error: "You can't take admin away from yourself." };
    const { count } = await supabase.from("store_staff").select("id", { count: "exact", head: true }).eq("keeper_id", user.id).eq("is_admin", true).is("deleted_at", null);
    if ((count ?? 0) <= 1) return { error: "The account needs at least one admin." };
  }

  if (!isAdmin) {
    const p = await planOf(supabase);
    const mode = p.limits?.staff_permissions;
    const custom = !p.enforced || mode === "custom" || mode === "custom_store_admins";
    if (!custom && !ROLE_PRESETS.some((r) => encodePermissions(r.permissions) === encodePermissions(permissions))) {
      return { error: "Your plan uses the ready-made roles: Manager, Cashier or Stock keeper. Choosing each permission comes with Business." };
    }
  }

  const update: Update<"store_staff"> = { role, is_admin: isAdmin, permissions: encodePermissions(permissions) };
  if (passKey) {
    const { hash, salt } = hashPassKey(passKey);
    Object.assign(update, { pass_key_hash: hash, pass_key_salt: salt, failed_attempts: 0, locked_until: null });
  }
  const [a, b] = await Promise.all([
    supabase.from("store_staff").update(update).eq("id", id).eq("keeper_id", user.id),
    supabase.from("store_contacts").update({ name }).eq("id", member.contact_id).eq("keeper_id", user.id),
  ]);
  if (a.error || b.error) return { error: "The staff member couldn't be saved." };
  await supabase.from("store_staff_stores").update({ role }).eq("staff_id", id).eq("store_id", store.id);
  done();
  return { message: passKey ? `${name} saved, with a new pass key.` : `${name} saved.` };
}

// ---------------------------------------------------------------- Devices

/** Signs a phone or computer out of this account; it asks for a sign-in next time it's opened. */
export async function signOutDevice(form: FormData) {
  if (await passKeyError(form)) return;
  const { supabase } = await requireStore();
  await supabase.rpc("sign_out_device", { p_device_id: String(form.get("device_id")) });
  done();
}
