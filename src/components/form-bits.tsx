"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pendingText, className = "btn btn-primary w-full" }: { children: React.ReactNode; pendingText?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} style={{ letterSpacing: 3 }}>
      {pending ? (pendingText ?? "Working…") : children}
    </button>
  );
}

export function Field({
  id,
  label,
  hint,
  ...input
}: { id: string; label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input id={id} name={id} className="field" {...input} />
      {hint && <span className="text-[13px] text-ink-2">{hint}</span>}
    </div>
  );
}

export function FormMessage({ state }: { state?: { error?: string; message?: string } }) {
  if (!state?.error && !state?.message) return null;
  const err = !!state.error;
  return (
    <p role={err ? "alert" : "status"} className={`m-0 rounded-sm px-3.5 py-3 text-sm font-bold ${err ? "bg-error-container text-on-error-container" : "bg-success-container text-on-success-container"}`}>
      {state.error ?? state.message}
    </p>
  );
}
