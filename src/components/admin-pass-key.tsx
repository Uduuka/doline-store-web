"use client";

import { useEffect, useRef, useState } from "react";
import { verifyAdminPassKey } from "@/app/dashboard/actions";

/*
 * Every write on the web asks for the admin pass key first, the one the Doline Store apps set up
 * on a device's first sign-in. The key is checked twice: here, so a wrong one is answered in the
 * prompt, and again by the server action that writes (lib/admin-pass-key), which is the check that
 * counts. Nothing remembers the key: each write asks again.
 *
 * Forms need nothing special. AdminPassKeyGate catches the submit of any form whose action is a
 * server action, before React sees it, asks for the key, adds it to the form as admin_pass_key and
 * submits the form again. A form that doesn't write (switching store, signing out) opts out with
 * data-no-passkey. Code that calls an action directly asks with askAdminPassKey() and passes the
 * key along itself.
 */

export const ADMIN_PASS_KEY_FIELD = "admin_pass_key";

let open: ((resolve: (key: string | null) => void) => void) | null = null;
let lastWriteAt = 0;

/** Asks for the admin pass key and checks it: the key once it's right, or null if cancelled. */
export function askAdminPassKey(): Promise<string | null> {
  if (!open) return Promise.resolve(null);
  const show = open;
  return new Promise((resolve) =>
    show((key) => {
      if (key) lastWriteAt = Date.now();
      resolve(key);
    }),
  );
}

/** Whether this tab sent a write in the last few seconds; LiveStore ignores the echo of those. */
export function wroteRecently(ms = 15_000) {
  return Date.now() - lastWriteAt < ms;
}

/** A form submit that runs a server action. React marks those with a javascript: URL. */
function isActionSubmit(form: HTMLFormElement, submitter: HTMLElement | null) {
  const target = submitter?.getAttribute("formaction") ?? form.getAttribute("action") ?? "";
  return target.startsWith("javascript:");
}

export function AdminPassKeyGate() {
  const [pending, setPending] = useState<((key: string | null) => void) | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    open = (resolve) => {
      setValue("");
      setError(null);
      setPending(() => resolve);
    };
    return () => {
      open = null;
    };
  }, []);

  // Catch write submits before React's own listener (on the app root) runs the action.
  useEffect(() => {
    const approved = new WeakSet<HTMLFormElement>();
    const onSubmit = (e: SubmitEvent) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement) || form.hasAttribute("data-no-passkey")) return;
      const submitter = e.submitter instanceof HTMLElement ? e.submitter : null;
      if (!isActionSubmit(form, submitter)) return;
      if (approved.has(form)) {
        approved.delete(form);
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      askAdminPassKey().then((key) => {
        if (!key || !form.isConnected) return;
        const field = document.createElement("input");
        field.type = "hidden";
        field.name = ADMIN_PASS_KEY_FIELD;
        field.value = key;
        form.appendChild(field);
        approved.add(form);
        form.requestSubmit(submitter && form.contains(submitter) ? submitter : undefined);
        // React has read the form's data by now; the key isn't left in the page.
        field.remove();
      });
    };
    document.addEventListener("submit", onSubmit, true);
    return () => document.removeEventListener("submit", onSubmit, true);
  }, []);

  useEffect(() => {
    if (pending) input.current?.focus();
  }, [pending]);

  if (!pending) return null;

  const close = (key: string | null) => {
    pending(key);
    setPending(null);
    setValue("");
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checking) return;
    if (!/^\d{6}$/.test(value)) {
      setError("Enter the admin pass key: 6 digits.");
      return;
    }
    setChecking(true);
    try {
      const r = await verifyAdminPassKey(value);
      if (r.ok) close(value);
      else {
        setError(r.error);
        setValue("");
        input.current?.focus();
      }
    } catch {
      setError("Couldn't check the pass key. Check your connection and try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && close(null)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          close(null);
        }
      }}
    >
      <form
        data-no-passkey
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-pass-key-title"
        onSubmit={confirm}
        className="flex w-full max-w-sm flex-col gap-4 rounded-md bg-surface p-6 shadow-fab"
      >
        <div className="flex flex-col gap-1">
          <h2 id="admin-pass-key-title" className="m-0 text-lg font-extrabold">
            Admin pass key
          </h2>
          <p className="m-0 text-sm text-ink-2">Enter the 6-digit admin pass key from the Doline Store app to save this change.</p>
        </div>
        <input
          ref={input}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          aria-label="Admin pass key"
          aria-invalid={!!error}
          value={value}
          onChange={(e) => {
            setValue(e.target.value.replace(/\D/g, "").slice(0, 6));
            setError(null);
          }}
          className="field text-center text-2xl tracking-[0.5em]"
        />
        {error && (
          <p role="alert" className="m-0 rounded-sm bg-error-container px-3.5 py-3 text-sm font-bold text-on-error-container">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button type="button" onClick={() => close(null)} className="btn btn-default flex-1">
            Cancel
          </button>
          <button type="submit" disabled={checking || value.length !== 6} className="btn btn-primary flex-1">
            {checking ? "Checking…" : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
}
