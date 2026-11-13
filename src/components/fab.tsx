"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { FormMessage, SubmitButton } from "@/components/form-bits";
import { Icon, type IconName } from "@/components/icons";

export type FabOption = {
  key: string;
  label: string;
  icon: IconName;
  /** The panel's heading when this option's form is open. */
  title: string;
  /** The form, usually a <FabForm>. Rendered on the server and handed in. */
  panel: React.ReactNode;
  disabled?: boolean;
  hint?: string;
};

/**
 * A page's floating + button, bottom right. With several options it opens a small menu of them;
 * choosing one (or pressing + when there's only one) turns the menu into that option's form.
 * Escape or ✕ closes it; a click outside closes the menu but never a form being filled in.
 */
export function Fab({ label, options }: { label: string; options: FabOption[] }) {
  const [open, setOpen] = useState<string | null>(null); // null, "menu" or an option key
  const root = useRef<HTMLDivElement>(null);
  const single = options.length === 1 ? options[0]! : null;
  const current = options.find((o) => o.key === open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onDown = (e: MouseEvent) => open === "menu" && !root.current?.contains(e.target as Node) && setOpen(null);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <div ref={root} className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open === "menu" && (
        <div role="menu" aria-label={label} className="flex w-60 flex-col gap-1 rounded-md bg-surface p-2 shadow-fab">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              role="menuitem"
              onClick={() => setOpen(o.key)}
              disabled={o.disabled}
              className="flex min-h-12 items-center gap-3 rounded-sm px-3 text-left text-[15px] font-bold hover:bg-surface-mid disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-sm bg-primary-container text-primary">
                <Icon name={o.icon} size={20} />
              </span>
              <span className="flex flex-col">
                {o.label}
                {o.hint && <span className="text-xs font-semibold text-ink-2">{o.hint}</span>}
              </span>
            </button>
          ))}
        </div>
      )}

      {current && (
        <section
          role="dialog"
          aria-label={current.title}
          className="flex max-h-[calc(100dvh-112px)] w-[min(420px,calc(100vw-32px))] flex-col overflow-hidden rounded-md bg-surface shadow-fab"
        >
          <div className="flex flex-none items-center justify-between border-b border-surface-mid py-2 pr-2 pl-5">
            <h2 className="m-0 text-lg font-extrabold">{current.title}</h2>
            <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-sm hover:bg-surface-mid">
              <Icon name="close" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">{current.panel}</div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen(open ? null : single ? single.key : "menu")}
        aria-label={open ? "Close" : single ? single.label : label}
        aria-expanded={!!open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-fab hover:bg-primary-hover"
      >
        <span className={`transition-transform ${open ? "rotate-45" : ""}`}>
          <Icon name="plus" size={26} strokeWidth={2.5} />
        </span>
      </button>
    </div>
  );
}

type State = { error?: string; message?: string } | undefined;

/** A form for a Fab panel: shows the result, and clears itself after a save so another can follow. */
export function FabForm({ action, submit, children }: { action: (s: State, f: FormData) => Promise<State>; submit: string; children: React.ReactNode }) {
  const [state, formAction] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.message) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={formAction} className="flex flex-col gap-4">
      <FormMessage state={state} />
      {children}
      <SubmitButton className="btn btn-primary" pendingText="Saving…">
        {submit}
      </SubmitButton>
    </form>
  );
}
