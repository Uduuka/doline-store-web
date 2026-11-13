"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form-bits";
import { receiveStock, updateBatch, updateItem } from "@/app/dashboard/actions";

/** Receives a delivery of this one item as a new batch. */
export function ReceiveItemForm({ productId, currency }: { productId: string; currency: string }) {
  const [state, action] = useActionState(receiveStock, undefined);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.message) ref.current?.reset();
  }, [state]);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-primary flex-[1_1_140px]">
        Receive stock
      </button>
    );
  }
  return (
    <form ref={ref} action={action} className="flex w-full flex-col gap-3 rounded-md bg-surface-low p-4">
      <input type="hidden" name="product_id" value={productId} />
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-base font-extrabold">Receive a delivery</h3>
        <button type="button" onClick={() => setOpen(false)} className="min-h-11 text-sm font-bold text-ink-2">
          Close
        </button>
      </div>
      <FormMessage state={state} />
      <Field id="quantity" label="Quantity received" inputMode="numeric" required autoFocus />
      <Field id="cost" label={`Cost each (${currency})`} inputMode="numeric" placeholder="Optional" />
      <Field id="expiry_date" label="Expiry date" type="date" />
      <SubmitButton className="btn btn-primary" pendingText="Saving…">
        Save delivery
      </SubmitButton>
    </form>
  );
}

/** Edits the item's name, category, description and low-stock level. */
export function EditItemForm({
  productId,
  name,
  category,
  description,
  lowAt,
}: {
  productId: string;
  name: string;
  category: string;
  description: string;
  lowAt: number;
}) {
  const [state, action] = useActionState(updateItem, undefined);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-tonal flex-[1_1_140px]">
        Edit details
      </button>
    );
  }
  return (
    <form action={action} className="flex w-full flex-col gap-3 rounded-md bg-surface-low p-4">
      <input type="hidden" name="product_id" value={productId} />
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-base font-extrabold">Edit details</h3>
        <button type="button" onClick={() => setOpen(false)} className="min-h-11 text-sm font-bold text-ink-2">
          Close
        </button>
      </div>
      <FormMessage state={state} />
      <Field id="name" label="Item name" defaultValue={name} required />
      <Field id="category" label="Category" defaultValue={category} />
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea id="description" name="description" defaultValue={description} rows={3} className="field h-auto py-3" />
      </div>
      <Field id="low_stock_threshold" label="Warn when stock falls to" inputMode="numeric" defaultValue={String(lowAt)} />
      <p className="m-0 text-[13px] text-ink-2">Prices and units are set in the Doline Store app.</p>
      <SubmitButton className="btn btn-primary" pendingText="Saving…">
        Save changes
      </SubmitButton>
    </form>
  );
}

/**
 * Edits a batch in place. Cost is per item (stored for the whole batch). "Stock left" is a count
 * correction: set it to what's really on the shelf.
 */
export function EditBatchForm({
  batchId,
  batchNumber,
  costEach,
  available,
  received,
  units,
  expiry,
  manufactured,
  currency,
}: {
  batchId: string;
  batchNumber: string;
  costEach: number | null;
  available: number;
  received: number;
  units: string;
  expiry: string;
  manufactured: string;
  currency: string;
}) {
  const [state, action] = useActionState(updateBatch, undefined);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-tonal">
        Edit batch
      </button>
    );
  }
  return (
    <form action={action} className="flex w-full flex-col gap-3 rounded-md bg-surface-low p-4">
      <input type="hidden" name="batch_id" value={batchId} />
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-base font-extrabold">Edit batch</h3>
        <button type="button" onClick={() => setOpen(false)} className="min-h-11 text-sm font-bold text-ink-2">
          Close
        </button>
      </div>
      <FormMessage state={state} />
      <Field id="batch_number" label="Batch number" defaultValue={batchNumber} required />
      <Field
        id="cost"
        label={`Cost each (${currency})`}
        inputMode="decimal"
        defaultValue={costEach != null ? String(+costEach.toFixed(2)) : ""}
        placeholder="Not entered"
        hint={`For all ${+received.toFixed(4)} ${units} received.`}
      />
      <Field
        id="available"
        label={`Stock left (${units})`}
        inputMode="decimal"
        defaultValue={String(+available.toFixed(4))}
        required
        hint="Correct this to what's on the shelf after a count."
      />
      <Field id="expiry_date" label="Expiry date" type="date" defaultValue={expiry} />
      <Field id="manufacture_date" label="Manufactured" type="date" defaultValue={manufactured} />
      <SubmitButton className="btn btn-primary" pendingText="Saving…">
        Save batch
      </SubmitButton>
    </form>
  );
}
