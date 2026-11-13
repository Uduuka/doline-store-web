"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/icons";

/**
 * A table row that opens its details panel: the whole row is clickable, and the order number inside it
 * should be a real link, for keyboards and screen readers.
 */
export function ClickableRow({ href, selected, children }: { href: string; selected: boolean; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <tr
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        router.push(href, { scroll: false });
      }}
      aria-selected={selected}
      className={`cursor-pointer ${selected ? "bg-primary-container/60" : "hover:bg-surface-low"}`}
    >
      {children}
    </tr>
  );
}

/**
 * A details panel (an order, an item…): slides in on the right over the list, full height, scrolling on its own.
 * Escape, the close button or a click on the dimmed list closes it.
 */
export function SidePanel({ closeHref, title, children }: { closeHref: string; title: string; children: React.ReactNode }) {
  const router = useRouter();
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push(closeHref, { scroll: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeHref, router]);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <Link href={closeHref} scroll={false} aria-label="Close panel" tabIndex={-1} className="absolute inset-0 bg-ink/30" />
      <aside
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex h-dvh w-full max-w-[480px] flex-col bg-surface shadow-fab outline-none"
      >
        <div className="flex flex-none items-center gap-3 border-b border-surface-mid px-5 py-4">
          <h2 className="m-0 flex-1 text-lg font-extrabold">{title}</h2>
          <Link href={closeHref} scroll={false} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-sm hover:bg-surface-mid">
            <Icon name="close" />
          </Link>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">{children}</div>
      </aside>
    </div>
  );
}
