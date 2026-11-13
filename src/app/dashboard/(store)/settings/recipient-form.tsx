"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormMessage, SubmitButton } from "@/components/form-bits";
import { addRecipient } from "@/app/dashboard/settings-actions";

/** Adds an address that receives the scheduled reports; clears itself after. */
export function AddRecipientForm() {
  const [state, action] = useActionState(addRecipient, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.message) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={action} className="flex flex-col gap-2">
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-2">
        <input name="email" type="email" required aria-label="Email address" placeholder="name@example.com" className="field h-11 min-w-0 flex-[1_1_220px]" />
        <SubmitButton className="btn btn-primary h-11 px-4 text-sm" pendingText="Adding…">
          Add recipient
        </SubmitButton>
      </div>
    </form>
  );
}
