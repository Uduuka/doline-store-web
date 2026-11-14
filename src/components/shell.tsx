"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { Logo } from "@/components/logo";
import { signOut } from "@/app/(auth)/actions";
import { openStore } from "@/app/dashboard/actions";
import type { StoreSummary } from "@/lib/store";

const NAV: { href: string; label: string; icon: IconName; group?: string }[] = [
  { href: "/dashboard/overview", label: "Overview", icon: "overview", group: "COUNTER" },
  { href: "/dashboard/sell", label: "Sell", icon: "sell" },
  { href: "/dashboard/orders", label: "Orders", icon: "orders" },
  { href: "/dashboard/notes", label: "Notes", icon: "note" },
  { href: "/dashboard/inventory", label: "Inventory", icon: "inventory", group: "STOCK" },
  { href: "/dashboard/suppliers", label: "Suppliers", icon: "suppliers" },
  { href: "/dashboard/clients", label: "Clients & credit", icon: "clients", group: "MONEY" },
  { href: "/dashboard/expenses", label: "Expenses", icon: "expenses" },
  { href: "/dashboard/reports", label: "Reports", icon: "reports" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings", group: "STORE" },
];

function initials(s: string) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .join("")
    .slice(0, 2);
}

export function Shell({
  stores,
  store,
  displayName,
  onlineOpen,
  children,
}: {
  stores: StoreSummary[];
  store: StoreSummary;
  displayName: string;
  onlineOpen: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    setOpen(false);
    setSwitching(false);
  }, [pathname]);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="flex min-h-screen flex-wrap items-stretch bg-ground">
      {/* Phone bar */}
      <div className="flex w-full items-center gap-2 bg-surface px-3 py-2 shadow-[0_2px_6px_rgba(32,33,39,0.10)] lg:hidden print:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-sm hover:bg-surface-high"
        >
          <Icon name={open ? "close" : "menu"} size={26} />
        </button>
        <Logo href="/dashboard" size={34} textClass="text-[20px] text-primary" />
        <Link href="/dashboard/sell" className="btn btn-primary ml-auto h-11 px-3.5">
          <Icon name="plus" size={18} strokeWidth={2.5} />
          Sale
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        aria-label="App navigation"
        className={`${open ? "flex" : "hidden"} print:hidden h-[calc(100dvh-60px)] w-full flex-col bg-surface px-4 py-5 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-[264px] lg:flex-none lg:self-start`}
      >
        <div className="relative z-10 flex-none">
          <button
            type="button"
            onClick={() => setSwitching((s) => !s)}
            aria-expanded={switching}
            className="flex w-full items-center gap-3 rounded-sm bg-ground p-3 text-left"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-sm bg-primary font-extrabold text-white">{initials(store.name)}</span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-bold">{store.name}</span>
              <span className="truncate text-xs text-ink-2">{store.address || "No location set"}</span>
            </span>
            <span className="text-ink-2"><Icon name="chevronDown" size={18} /></span>
          </button>
          {switching && (
            <div className="absolute right-0 left-0 z-30 mt-1 flex flex-col gap-1 rounded-md bg-surface p-2 shadow-fab">
              {stores.map((s) => (
                <form key={s.id} action={openStore} data-no-passkey>
                  <input type="hidden" name="store_id" value={s.id} />
                  <button
                    type="submit"
                    className={`flex min-h-11 w-full items-center gap-2 rounded-sm px-3 text-left text-sm ${s.id === store.id ? "bg-primary-container font-extrabold text-primary" : "font-semibold hover:bg-surface-mid"}`}
                  >
                    {s.name}
                  </button>
                </form>
              ))}
              <Link href="/dashboard" className="flex min-h-11 items-center gap-2 rounded-sm px-3 text-sm font-bold text-primary hover:bg-surface-mid">
                <Icon name="overview" size={18} /> All stores
              </Link>
              <Link href="/onboarding" className="flex min-h-11 items-center gap-2 rounded-sm px-3 text-sm font-bold text-primary hover:bg-surface-mid">
                <Icon name="plus" size={18} /> Add a store
              </Link>
            </div>
          )}
        </div>

        <nav className="-mx-1 mt-4 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain px-1">
          {NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <div key={n.href} className="flex flex-col">
                {n.group && <span className="px-3 pt-3.5 pb-1.5 text-[11px] font-bold tracking-[3px] text-ink-2">{n.group}</span>}
                <Link
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[46px] items-center gap-3 rounded-sm px-3 text-[15px] no-underline ${active ? "bg-primary-container font-extrabold text-primary" : "font-semibold text-ink hover:bg-surface-mid"}`}
                >
                  <Icon name={n.icon} />
                  <span className="flex-1">{n.label}</span>
                  {n.href === "/dashboard/orders" && onlineOpen > 0 && (
                    <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-extrabold text-white" aria-label={`${onlineOpen} online orders waiting`}>
                      {onlineOpen}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="mt-10 flex flex-none items-center gap-3 rounded-sm bg-surface-low p-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-container text-sm font-extrabold text-on-primary-container">
            {initials(displayName)}
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-bold">{displayName}</span>
            <span className="text-xs text-ink-2">Owner</span>
          </span>
          <form action={signOut} data-no-passkey>
            <button type="submit" aria-label="Sign out" className="flex h-11 w-11 items-center justify-center rounded-sm text-ink-2 hover:bg-surface-high">
              <Icon name="logout" size={20} />
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-[999_1_560px] flex-col">{children}</div>
    </div>
  );
}
