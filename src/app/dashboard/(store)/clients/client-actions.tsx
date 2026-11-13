"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form-bits";
import { recordClientPayment } from "@/app/dashboard/actions";

/** Takes a payment from this client, prefilled with what they owe; it settles their oldest unpaid sales first. */
export function ClientPaymentForm({ clientId, owed, currency }: { clientId: string; owed: number; currency: string }) {
  const [state, action] = useActionState(recordClientPayment, undefined);
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-primary flex-[1_1_140px]">
        Take a payment
      </button>
    );
  }
  return (
    <form action={action} className="flex w-full flex-col gap-3 rounded-md bg-surface-low p-4">
      <input type="hidden" name="client_id" value={clientId} />
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-base font-extrabold">Take a payment</h3>
        <button type="button" onClick={() => setOpen(false)} className="min-h-11 text-sm font-bold text-ink-2">
          Close
        </button>
      </div>
      <FormMessage state={state} />
      <Field id="amount" label={`Amount (${currency})`} inputMode="decimal" defaultValue={String(Math.round(owed))} key={owed} required autoFocus />
      <div className="flex flex-col gap-1">
        <label htmlFor="method" className="label">
          Paid by
        </label>
        <select id="method" name="method" className="field px-3">
          <option value="cash">Cash</option>
          <option value="mobile_money">Mobile money</option>
        </select>
      </div>
      <p className="m-0 text-[13px] text-ink-2">Settles the oldest unpaid sales first.</p>
      <SubmitButton className="btn btn-primary" pendingText="Recording…">
        Record payment
      </SubmitButton>
    </form>
  );
}
