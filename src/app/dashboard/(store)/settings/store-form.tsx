"use client";

import { useActionState } from "react";
import { saveStoreDetails } from "@/app/dashboard/settings-actions";
import { Field, FormMessage, SubmitButton } from "@/components/form-bits";

/** The store's public face: what DolineMarket shows buyers. Currency lives in Payments & tenders. */
export function StoreSettingsForm({ name, slug, address, description }: { name: string; slug: string; address: string; description: string }) {
  const [state, action] = useActionState(saveStoreDetails, undefined);
  return (
    <form action={action} className="flex flex-col gap-5">
      <FormMessage state={state} />
      <Field id="name" label="Store name" defaultValue={name} required />
      <Field id="slug" label="Slug" defaultValue={slug} placeholder="e.g. mama-janes-shop" hint="The store's web address on DolineMarket. Small letters, numbers and dashes." />
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea id="description" name="description" rows={3} defaultValue={description} placeholder="What the shop sells" className="field h-auto py-3 leading-relaxed" />
      </div>
      <Field id="address" label="Address" defaultValue={address} placeholder="Where to find the shop" />
      <SubmitButton className="btn btn-primary self-start" pendingText="Saving…">
        Save store details
      </SubmitButton>
    </form>
  );
}
