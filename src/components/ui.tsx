import Link from "next/link";

/** Order progress → pill colours, the app's fixed mapping (status-and-category-colour.md). */
export const PROGRESS: Record<string, [string, string]> = {
  DRAFT: ["bg-slate-c", "text-on-slate-c"],
  PENDING: ["bg-surface-variant", "text-ink-2"],
  READY: ["bg-primary-container", "text-primary"],
  SHIPPING: ["bg-amber-c", "text-on-amber-c"],
  COMPLETED: ["bg-success-container", "text-on-success-container"],
  RETURNED: ["bg-error-container", "text-on-error-container"],
  CANCELLED: ["bg-error-container", "text-on-error-container"],
};

/** Payment status → ink. Always a word as well as a colour. */
export const PAYMENT_INK: Record<string, string> = {
  PAID: "text-success",
  CREDIT: "text-error",
  DRAFT: "text-secondary",
  NOT_PAID: "text-on-amber-c",
};

/** Expense category → its fixed container pair and icon. */
export const EXPENSE_CATEGORIES = {
  INVENTORY: { label: "Inventory", cls: "bg-blue-c text-on-blue-c", icon: "inventory" },
  LOGISTICS: { label: "Logistics", cls: "bg-purple-c text-on-purple-c", icon: "suppliers" },
  UTILITIES: { label: "Utilities", cls: "bg-amber-c text-on-amber-c", icon: "bolt" },
  MARKETING: { label: "Marketing", cls: "bg-pink-c text-on-pink-c", icon: "megaphone" },
  STAFF: { label: "Staff", cls: "bg-primary-container text-primary", icon: "users" },
  OTHERS: { label: "Others", cls: "bg-slate-c text-on-slate-c", icon: "dots" },
} as const;

export function ProgressPill({ status }: { status: string | null }) {
  const s = status ?? "PENDING";
  const [bg, fg] = PROGRESS[s] ?? PROGRESS.PENDING!;
  return <span className={`pill ${bg} ${fg}`}>{s.charAt(0) + s.slice(1).toLowerCase()}</span>;
}

export function Stat({ label, value, tone, foot }: { label: string; value: React.ReactNode; tone?: string; foot?: React.ReactNode }) {
  return (
    <div className="card flex min-w-0 flex-[1_1_220px] flex-col gap-2">
      <span className="text-[13px] font-bold text-ink-2">{label}</span>
      <span className={`text-[26px] font-extrabold ${tone ?? ""}`}>{value}</span>
      {foot && <span className="text-[13px] text-ink-2">{foot}</span>}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="m-0 px-6 py-10 text-center text-ink-2">{children}</p>;
}

export function FilterChips({
  items,
  active,
  param,
  base,
  defaultItem,
  keep = {},
  className = "",
}: {
  items: string[];
  active: string;
  param: string;
  base: string;
  defaultItem?: string;
  /** Other query params the chips carry along, such as the current search. */
  keep?: Record<string, string | undefined>;
  className?: string;
}) {
  return (
    <div className={`flex gap-2 overflow-x-auto pb-0.5 ${className}`}>
      {items.map((it) => {
        const on = it === active;
        const sp = new URLSearchParams();
        for (const [k, v] of Object.entries(keep)) if (v) sp.set(k, v);
        if (it !== (defaultItem ?? items[0])) sp.set(param, it);
        const qs = sp.toString();
        const href = qs ? `${base}?${qs}` : base;
        return (
          <Link key={it} href={href} aria-current={on ? "true" : undefined} className={`chip inline-flex items-center no-underline ${on ? "bg-primary text-white" : "bg-surface text-ink"}`}>
            {it}
          </Link>
        );
      })}
    </div>
  );
}
