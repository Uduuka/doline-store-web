"use client";

import { useActionState } from "react";
import { createStore } from "./actions";
import { Field, FormMessage, SubmitButton } from "@/components/form-bits";

export const CURRENCIES = [
  ["UGX", "Ugandan shilling"],
  ["KES", "Kenyan shilling"],
  ["TZS", "Tanzanian shilling"],
  ["RWF", "Rwandan franc"],
  ["USD", "US dollar"],
] as const;

export function StoreForm() {
  const [state, action] = useActionState(createStore, undefined);
  return (
    <form action={action} className="flex flex-col gap-6">
      <FormMessage state={state} />
      <Field id="name" label="Store name" placeholder="e.g. Mama Grace Supermarket" required />
      <Field id="address" label="Location" placeholder="Street, area, town" hint="Buyers on DolineMarket find you by this." />
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="label">
          What do you sell?
        </label>
        <input id="description" name="description" className="field" placeholder="e.g. Groceries and household goods" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="currency" className="label">
          Currency
        </label>
        <select id="currency" name="currency" defaultValue="UGX" className="field px-3">
          {CURRENCIES.map(([c, n]) => (
            <option key={c} value={c}>
              {c} — {n}
            </option>
          ))}
        </select>
      </div>
      <SubmitButton pendingText="Creating store…">Create store</SubmitButton>
    </form>
  );
}
