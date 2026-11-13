"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form-bits";

type State = { error?: string; message?: string } | undefined;

/**
 * "Edit details" for a contact (a client, a supplier): name, phone, email and address, behind a
 * button that opens the form in place. `idField` names the hidden id the action expects.
 */
export function EditContactForm({
  action,
  idField,
  id,
  name,
  phone,
  email,
  address,
  note,
}: {
  action: (s: State, f: FormData) => Promise<State>;
  idField: string;
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  note?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-tonal flex-[1_1_140px]">
        Edit details
      </button>
    );
  }
  return (
    <form action={formAction} className="flex w-full flex-col gap-3 rounded-md bg-surface-low p-4">
      <input type="hidden" name={idField} value={id} />
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-base font-extrabold">Edit details</h3>
        <button type="button" onClick={() => setOpen(false)} className="min-h-11 text-sm font-bold text-ink-2">
          Close
        </button>
      </div>
      <FormMessage state={state} />
      <Field id="name" label="Name" defaultValue={name} required />
      <Field id="phone" label="Phone" type="tel" defaultValue={phone} placeholder="+256 7XX XXX XXX" />
      <Field id="email" label="Email" type="email" defaultValue={email} placeholder="Optional" />
      <Field id="address" label="Address" defaultValue={address} placeholder="Optional" />
      {note && <p className="m-0 text-[13px] text-ink-2">{note}</p>}
      <SubmitButton className="btn btn-primary" pendingText="Saving…">
        Save changes
      </SubmitButton>
    </form>
  );
}
