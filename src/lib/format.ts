export const TIME_ZONE = process.env.NEXT_PUBLIC_TIME_ZONE || "Africa/Kampala";

/** "UGX 12,400". Money is never shown bare: always with its currency. */
export function money(amount: number | null | undefined, currency = "UGX"): string {
  const n = Math.round(Number(amount ?? 0));
  return `${currency} ${n.toLocaleString("en-US")}`;
}

/** 12400 → "12.4K", 1284500 → "1.28M": for chart axes only. */
export function compact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(Math.round(n));
}

/** The calendar day of an instant in the store's time zone, as "2026-11-12". */
export function dayKey(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** Start of the calendar day `daysAgo` days back, in the store's time zone, as an ISO instant. */
export function startOfDayISO(daysAgo = 0): string {
  const now = new Date();
  const key = dayKey(new Date(now.getTime() - daysAgo * 86_400_000));
  // Offset of the zone at that day, e.g. "+03:00".
  const offset = zoneOffset(new Date(`${key}T12:00:00Z`));
  return new Date(`${key}T00:00:00${offset}`).toISOString();
}

function zoneOffset(at: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, timeZoneName: "longOffset" }).formatToParts(at);
  const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = name.match(/GMT([+-]\d{2}:\d{2})/);
  return m ? m[1] : "+00:00";
}

export function time(d: string | null | undefined): string {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" }).format(new Date(d));
}

export function shortDate(d: string | null | undefined): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short" }).format(new Date(d));
}

export function longToday(): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, weekday: "long", day: "numeric", month: "long" }).format(new Date());
}

export function weekday(key: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short" }).format(new Date(`${key}T12:00:00Z`));
}

export function greeting(): string {
  const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "numeric", hourCycle: "h23" }).format(new Date()));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function initials(name: string | null | undefined): string {
  return (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .join("")
    .slice(0, 2);
}

/** "Pending" from "PENDING". */
export function titleCase(s: string | null | undefined): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace(/_/g, " ");
}

/** Start of the current calendar month in the store's time zone, as an ISO instant. */
export function startOfMonthISO(): string {
  const key = dayKey(new Date());
  const first = `${key.slice(0, 8)}01`;
  return new Date(`${first}T00:00:00${zoneOffset(new Date(`${first}T12:00:00Z`))}`).toISOString();
}

/** The hour of the day (0–23) of an instant in the store's time zone. */
export function hourOf(d: Date | string): number {
  const date = typeof d === "string" ? new Date(d) : d;
  return Number(new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "numeric", hourCycle: "h23" }).format(date));
}

/** "12 Nov" for a day key such as "2026-11-12". */
export function dayLabel(key: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short" }).format(new Date(`${key}T12:00:00Z`));
}
