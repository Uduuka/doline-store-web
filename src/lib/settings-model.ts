/**
 * The store settings vocabulary the Doline Store apps use (AccessControl.kt, StoreSettingsEntity,
 * SettingsScreen.kt), kept identical here so a change made on the web reads the same on a till.
 */

/** What a staff member may do beyond selling, by the name the apps store (StaffPermission). */
export const PERMISSIONS = [
  { code: "SELL_ON_CREDIT", label: "Sell on credit", description: "Give goods on credit and record credit payments" },
  { code: "RETURNS", label: "Returns and cancellations", description: "Take returns and cancel orders" },
  { code: "EDIT_ORDERS", label: "Edit orders", description: "Change who an order is for after the sale" },
  { code: "RECEIVE_STOCK", label: "Receive stock", description: "Add batches and order from suppliers" },
  { code: "CORRECT_BATCHES", label: "Correct batches", description: "Change what a batch was received with or cost" },
  { code: "WRITE_OFF", label: "Write off stock", description: "Record damaged, expired or lost stock" },
  { code: "DECIDE_COUNTS", label: "Settle stock counts", description: "Accept or dismiss what a physical count found" },
  { code: "EDIT_ITEMS", label: "Add and edit items", description: "Create items and change their details" },
  { code: "MANAGE_PRICES", label: "Prices and promotions", description: "Set selling prices, discounts and flash sales" },
  { code: "MANAGE_LISTINGS", label: "Marketplace listings", description: "List and unlist items on DolineMarket" },
  { code: "MANAGE_SUPPLIERS", label: "Suppliers", description: "Add and change suppliers" },
  { code: "VIEW_REPORTS", label: "Reports", description: "Open Reports: sales, profit and losses" },
  { code: "VIEW_COSTS", label: "See costs and profit", description: "Buying prices, unit costs, profit and losses at cost, outside Reports" },
  { code: "MANAGE_SETTINGS", label: "Store settings", description: "Working hours, delivery, receipts, POS hardware and the rest" },
] as const;
export type Permission = (typeof PERMISSIONS)[number]["code"];
export const ALL_PERMISSIONS: Permission[] = PERMISSIONS.map((p) => p.code);

/** Starting points for a staff member's permissions (StaffRolePreset). Only the boxes are stored. */
export const ROLE_PRESETS: { key: string; label: string; permissions: Permission[] }[] = [
  { key: "MANAGER", label: "Manager", permissions: ALL_PERMISSIONS },
  { key: "CASHIER", label: "Cashier", permissions: [] },
  { key: "STOCK_KEEPER", label: "Stock keeper", permissions: ["RECEIVE_STOCK", "CORRECT_BATCHES", "WRITE_OFF", "DECIDE_COUNTS", "EDIT_ITEMS", "MANAGE_SUPPLIERS"] },
];

/** store_staff.permissions → the set. Null is a staff member from before permissions: everything. */
export function decodePermissions(stored: string | null): Permission[] {
  if (stored == null) return ALL_PERMISSIONS;
  const names = stored.split(",").map((s) => s.trim());
  return ALL_PERMISSIONS.filter((p) => names.includes(p));
}

/** The set as the apps store it: names in the enum's order, comma-separated. */
export function encodePermissions(ps: Iterable<string>): string {
  const set = new Set(ps);
  return ALL_PERMISSIONS.filter((p) => set.has(p)).join(",");
}

export function presetMatching(ps: Permission[]): string | null {
  const key = encodePermissions(ps);
  return ROLE_PRESETS.find((r) => encodePermissions(r.permissions) === key)?.label ?? null;
}

/** The currencies the apps know (Currency enum). */
export const CURRENCIES = [
  { code: "UGX", name: "Uganda Shillings" },
  { code: "KES", name: "Kenya Shillings" },
  { code: "TZS", name: "Tanzania Shillings" },
  { code: "USD", name: "US Dollars" },
] as const;

/** Payment methods a store can say it accepts (stores.accepted_payment_method_codes). */
export const PAYMENT_METHODS = [
  { code: "cash", label: "Cash" },
  { code: "mm", label: "Mobile Money" },
  { code: "card", label: "Card" },
] as const;

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** One rung of the tip ladder, as store_settings.tip_rules keeps it (TipRule). */
export type TipRule = { min_order_amount: number; value?: number | null; type?: string; percent?: number | null };
