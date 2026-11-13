"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";

/**
 * "Share" for a report: a menu that sends its summary through the phone's share sheet (where the
 * browser has one), WhatsApp or email, copies it, or prints the page (which also saves a PDF).
 * The dashboard needs a sign-in, so it shares the figures as text rather than a link.
 */
export function ShareReport({ title, text }: { title: string; text: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function"), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const item = "flex min-h-11 w-full items-center gap-3 rounded-sm px-3 text-left text-[15px] font-bold text-ink no-underline hover:bg-surface-mid";

  return (
    <div ref={root} className="relative print:hidden">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" className="btn btn-primary h-10 px-4">
        <Icon name="share" size={18} /> Share report
      </button>
      {open && (
        <div role="menu" aria-label="Share report" className="absolute right-0 z-30 mt-2 flex w-64 flex-col gap-1 rounded-md bg-surface p-2 shadow-fab">
          {canShare && (
            <button
              type="button"
              role="menuitem"
              className={item}
              onClick={async () => {
                try {
                  await navigator.share({ title, text });
                } catch {
                  // Dismissed: nothing to do.
                }
                setOpen(false);
              }}
            >
              <Icon name="share" size={20} /> Share…
            </button>
          )}
          <a role="menuitem" className={item} href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            <Icon name="phone" size={20} /> WhatsApp
          </a>
          <a role="menuitem" className={item} href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`} onClick={() => setOpen(false)}>
            <Icon name="mail" size={20} /> Email
          </a>
          <button
            type="button"
            role="menuitem"
            className={item}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {
                setCopied(false);
              }
            }}
          >
            <Icon name={copied ? "check" : "copy"} size={20} /> {copied ? "Copied" : "Copy summary"}
          </button>
          <button
            type="button"
            role="menuitem"
            className={item}
            onClick={() => {
              setOpen(false);
              setTimeout(() => window.print(), 50);
            }}
          >
            <Icon name="printer" size={20} /> Print or save as PDF
          </button>
        </div>
      )}
    </div>
  );
}
