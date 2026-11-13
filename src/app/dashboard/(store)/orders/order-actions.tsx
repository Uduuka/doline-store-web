"use client";

import { useActionState, useState } from "react";
import { FormMessage, SubmitButton } from "@/components/form-bits";
import { recordOrderPayment, returnOrderItems, setOrderClient, setOrderStatus } from "@/app/dashboard/actions";

const NEXT: Record<string, { target: string; label: string; tone: "primary" | "tonal" | "danger" }[]> = {
  DRAFT: [
    { target: "PENDING", label: "Confirm order", tone: "primary" },
    { target: "CANCELLED", label: "Cancel order", tone: "danger" },
  ],
  PENDING: [
    { target: "READY", label: "Mark ready", tone: "primary" },
    { target: "COMPLETED", label: "Complete", tone: "tonal" },
    { target: "CANCELLED", label: "Cancel order", tone: "danger" },
  ],
  READY: [
    { target: "COMPLETED", label: "Complete", tone: "primary" },
    { target: "SHIPPING", label: "Out for delivery", tone: "tonal" },
    { target: "CANCELLED", label: "Cancel order", tone: "danger" },
  ],
  SHIPPING: [{ target: "COMPLETED", label: "Mark delivered", tone: "primary" }],
};

const TONE = {
  primary: "btn btn-primary",
  tonal: "btn btn-tonal",
  danger: "btn border border-error bg-surface text-error hover:bg-error-container",
};

/** The stage buttons the order can move to from where it is. Cancelling asks first. */
export function StatusActions({ orderId, status }: { orderId: string; status: string }) {
  const [state, action] = useActionState(setOrderStatus, undefined);
  const moves = NEXT[status] ?? [];
  if (!moves.length) return null;
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="order_id" value={orderId} />
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-2">
        {moves.map((m) => (
          <button
            key={m.target}
            type="submit"
            name="target"
            value={m.target}
            onClick={(e) => {
              if (m.target === "CANCELLED" && !confirm("Cancel this order? Its stock goes back on the shelf.")) e.preventDefault();
            }}
            className={`${TONE[m.tone]} flex-[1_1_120px]`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </form>
  );
}

/** Takes a payment against the order, prefilled with what's still owed. */
export function PaymentForm({ orderId, due, currency }: { orderId: string; due: number; currency: string }) {
  const [state, action] = useActionState(recordOrderPayment, undefined);
  return (
    <form action={action} className="flex flex-col gap-3 rounded-md bg-surface-low p-4">
      <input type="hidden" name="order_id" value={orderId} />
      <h3 className="m-0 text-base font-extrabold">Take a payment</h3>
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-3">
        <label className="flex min-w-0 flex-[1_1_140px] flex-col gap-1">
          <span className="label">Amount ({currency})</span>
          <input name="amount" inputMode="decimal" defaultValue={Math.round(due)} key={due} className="field" />
        </label>
        <label className="flex min-w-0 flex-[1_1_140px] flex-col gap-1">
          <span className="label">Method</span>
          <select name="method" defaultValue="cash" className="field px-3">
            <option value="cash">Cash</option>
            <option value="mobile_money">Mobile money</option>
          </select>
        </label>
      </div>
      <SubmitButton className="btn btn-primary" pendingText="Recording…">
        Record payment
      </SubmitButton>
    </form>
  );
}

/** Puts the sale on one of the store's clients, or takes it off. */
export function ClientForm({ orderId, clientId, clients }: { orderId: string; clientId: string | null; clients: { id: string; name: string }[] }) {
  const [state, action] = useActionState(setOrderClient, undefined);
  const [value, setValue] = useState(clientId ?? "");
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="order_id" value={orderId} />
      <FormMessage state={state} />
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="order-client">
          Client
        </label>
        <select id="order-client" name="client_id" value={value} onChange={(e) => setValue(e.target.value)} className="field min-w-0 flex-1 px-3">
          <option value="">Walk-in (no client)</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <SubmitButton className="btn btn-tonal" pendingText="Saving…">
          Save
        </SubmitButton>
      </div>
    </form>
  );
}

type Line = { id: string; name: string; quantity: number; returned: number; units: string | null };

/** Takes items back: a quantity per line, up to what's left on it. Restocks the batches. */
export function ReturnForm({ orderId, lines }: { orderId: string; lines: Line[] }) {
  const [state, action] = useActionState(returnOrderItems, undefined);
  const [open, setOpen] = useState(false);
  const open_ = lines.filter((l) => l.quantity - l.returned > 0);
  if (!open_.length) return null;
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-default">
        Return items
      </button>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-3 rounded-md bg-surface-low p-4">
      <input type="hidden" name="order_id" value={orderId} />
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-base font-extrabold">Return items</h3>
        <button type="button" onClick={() => setOpen(false)} className="min-h-11 text-sm font-bold text-ink-2">
          Close
        </button>
      </div>
      <FormMessage state={state} />
      {open_.map((l) => {
        const left = l.quantity - l.returned;
        return (
          <label key={l.id} className="flex items-center gap-3">
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[15px] font-bold">{l.name}</span>
              <span className="text-[13px] text-ink-2">
                Up to {+left.toFixed(4)} {l.units ?? ""}
              </span>
            </span>
            <input name={`return_${l.id}`} type="number" min={0} max={left} step="any" defaultValue={0} className="field w-24 text-right" />
          </label>
        );
      })}
      <SubmitButton className="btn btn-primary" pendingText="Recording…">
        Record return
      </SubmitButton>
    </form>
  );
}
