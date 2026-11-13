"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { FormMessage, SubmitButton } from "@/components/form-bits";
import { Icon } from "@/components/icons";
import { placeSupplierOrder } from "@/app/dashboard/actions";

export type CatalogueLine = {
  pricingId: string;
  name: string;
  units: string;
  price: number;
  currency: string;
  stock: number | null;
  /** The matching item in our store, when we restock it from them. */
  ours?: { name: string; low: boolean };
};
export type Address = { id: string; label: string };

const fmt = (n: number, c: string) => `${c} ${Math.round(n).toLocaleString("en-US")}`;

function Stepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <span className="flex flex-none items-center gap-0.5 rounded-sm bg-ground">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} aria-label={`One less ${label}`} className="flex h-10 w-10 items-center justify-center">
        <Icon name="minus" size={16} strokeWidth={2.5} />
      </button>
      <input
        aria-label={`Quantity of ${label}`}
        inputMode="decimal"
        value={value || ""}
        placeholder="0"
        onChange={(e) => onChange(Math.max(0, Number(e.target.value.replace(/[^\d.]/g, "")) || 0))}
        className="w-10 bg-transparent text-center font-extrabold outline-none"
      />
      <button type="button" onClick={() => onChange(value + 1)} aria-label={`One more ${label}`} className="flex h-10 w-10 items-center justify-center">
        <Icon name="plus" size={16} strokeWidth={2.5} />
      </button>
    </span>
  );
}

/**
 * A restock order to a linked Doline Store supplier: quantities against their catalogue (items we
 * restock from them and running low come first), pickup or delivery, how we'll pay. Their shop
 * prices it, so the total here is a guide; the placed total comes back from the cloud.
 */
export function DolineOrderForm({ supplierId, supplierName, lines, addresses }: { supplierId: string; supplierName: string; lines: CatalogueLine[]; addresses: Address[] }) {
  const [state, action] = useActionState(placeSupplierOrder, undefined);
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [fulfilment, setFulfilment] = useState<"pickup" | "delivery">("pickup");
  const [method, setMethod] = useState<"cash" | "momo" | "card">("cash");
  const [query, setQuery] = useState("");
  // A placed order empties the list, ready for the next.
  useEffect(() => {
    if (state?.message) setQty({});
  }, [state]);

  const chosen = lines.filter((l) => (qty[l.pricingId] ?? 0) > 0);
  const total = chosen.reduce((a, l) => a + l.price * qty[l.pricingId]!, 0);
  const currency = chosen[0]?.currency ?? lines[0]?.currency ?? "";
  const shown = useMemo(() => lines.filter((l) => !query || `${l.name} ${l.ours?.name ?? ""}`.toLowerCase().includes(query.toLowerCase())), [lines, query]);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-primary flex-[1_1_140px]" disabled={!lines.length} title={lines.length ? undefined : "They have nothing listed to order"}>
        <Icon name="sell" size={18} /> Place order
      </button>
    );
  }

  return (
    <form action={action} className="flex w-full flex-col gap-3 rounded-md bg-surface-low p-4">
      <input type="hidden" name="supplier_id" value={supplierId} />
      <input type="hidden" name="items" value={JSON.stringify(chosen.map((l) => ({ pricing_id: l.pricingId, quantity: qty[l.pricingId] })))} />
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-base font-extrabold">Order from {supplierName}</h3>
        <button type="button" onClick={() => setOpen(false)} className="min-h-11 text-sm font-bold text-ink-2">
          Close
        </button>
      </div>
      <FormMessage state={state} />
      {state?.message && state.total && <p className="m-0 text-sm font-bold">Order total: {state.total}</p>}

      {lines.length > 6 && (
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find an item" aria-label="Find an item" className="field h-11" />
      )}
      <div className="flex max-h-[340px] flex-col overflow-y-auto rounded-sm bg-surface">
        {shown.map((l) => (
          <div key={l.pricingId} className="flex items-center gap-3 border-b border-surface-mid px-3 py-2 last:border-0">
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[15px] font-bold">{l.name}</span>
              <span className="text-[13px] text-ink-2">
                {fmt(l.price, l.currency)} / {l.units}
                {l.stock != null && ` · ${(+l.stock.toFixed(2)).toLocaleString("en-US")} in stock`}
              </span>
              {l.ours && <span className={`text-[12px] font-bold ${l.ours.low ? "text-on-amber-c" : "text-ink-2"}`}>{l.ours.low ? "You're running low" : "You stock this"}</span>}
            </span>
            <Stepper value={qty[l.pricingId] ?? 0} onChange={(n) => setQty((q) => ({ ...q, [l.pricingId]: n }))} label={l.name} />
          </div>
        ))}
        {!shown.length && <p className="m-0 p-4 text-center text-ink-2">Nothing matches that.</p>}
      </div>

      <div role="group" aria-label="Pickup or delivery" className="flex gap-2">
        {(["pickup", "delivery"] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={fulfilment === f}
            onClick={() => setFulfilment(f)}
            disabled={f === "delivery" && !addresses.length}
            className={`chip flex-1 disabled:opacity-50 ${fulfilment === f ? "bg-primary text-white" : "bg-surface text-ink"}`}
          >
            {f === "pickup" ? "I'll pick up" : "Deliver to me"}
          </button>
        ))}
      </div>
      <input type="hidden" name="fulfilment" value={fulfilment} />
      {fulfilment === "delivery" && (
        <select name="address_id" aria-label="Deliver to" className="field px-3" defaultValue={addresses[0]?.id}>
          {addresses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      )}
      {!addresses.length && <p className="m-0 text-[12px] text-ink-2">Delivery needs a saved address. Add one in the DolineMarket app.</p>}

      <div className="flex gap-2">
        <select name="payment_method" aria-label="How you'll pay" value={method} onChange={(e) => setMethod(e.target.value as typeof method)} className="field flex-1 px-3">
          <option value="cash">Pay cash</option>
          <option value="momo">Mobile money</option>
          <option value="card">Card</option>
        </select>
        {method === "momo" && (
          <select name="momo_network" aria-label="Network" className="field w-28 px-3" defaultValue="MTN">
            <option value="MTN">MTN</option>
            <option value="Airtel">Airtel</option>
          </select>
        )}
      </div>
      <textarea name="message" rows={2} placeholder="Message for the supplier (optional)" aria-label="Message for the supplier" className="field h-auto py-2.5" />

      <div className="flex items-baseline justify-between">
        <span className="text-sm text-ink-2">
          {chosen.length} {chosen.length === 1 ? "item" : "items"} · before their fees
        </span>
        <span className="text-xl font-extrabold text-primary">{fmt(total, currency)}</span>
      </div>
      <SubmitButton className="btn btn-primary" pendingText="Placing…">
        Place order
      </SubmitButton>
    </form>
  );
}

/**
 * An order for a supplier who isn't on Doline Store: quantities against the goods they supply
 * (low stock first), turned into a message to send on WhatsApp or copy. Nothing is recorded.
 */
export function MessageOrderForm({
  supplierName,
  storeName,
  phone,
  lines,
}: {
  supplierName: string;
  storeName: string;
  phone: string | null;
  lines: { id: string; name: string; units: string; low: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  const chosen = lines.filter((l) => (qty[l.id] ?? 0) > 0);
  const text = [
    `Hello ${supplierName}, ${storeName} would like to order:`,
    ...chosen.map((l) => `• ${l.name} × ${qty[l.id]} ${l.units}`),
    ...(note.trim() ? ["", note.trim()] : []),
    "",
    "Thank you.",
  ].join("\n");
  const wa = phone ? phone.replace(/[^\d]/g, "") : "";

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-primary flex-[1_1_140px]" disabled={!lines.length} title={lines.length ? undefined : "Link items to this supplier first"}>
        <Icon name="sell" size={18} /> Place order
      </button>
    );
  }
  return (
    <div className="flex w-full flex-col gap-3 rounded-md bg-surface-low p-4">
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-base font-extrabold">Order from {supplierName}</h3>
        <button type="button" onClick={() => setOpen(false)} className="min-h-11 text-sm font-bold text-ink-2">
          Close
        </button>
      </div>
      <p className="m-0 text-[13px] text-ink-2">{supplierName} isn&apos;t on Doline Store, so the order goes to them as a message.</p>
      <div className="flex max-h-[300px] flex-col overflow-y-auto rounded-sm bg-surface">
        {lines.map((l) => (
          <div key={l.id} className="flex items-center gap-3 border-b border-surface-mid px-3 py-2 last:border-0">
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[15px] font-bold">{l.name}</span>
              <span className={`text-[12px] font-bold ${l.low ? "text-on-amber-c" : "text-ink-2"}`}>{l.low ? "Running low" : l.units}</span>
            </span>
            <Stepper value={qty[l.id] ?? 0} onChange={(n) => setQty((q) => ({ ...q, [l.id]: n }))} label={l.name} />
          </div>
        ))}
      </div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Anything to add (optional)" aria-label="Anything to add" className="field h-auto py-2.5" />
      {chosen.length > 0 && <pre className="m-0 rounded-sm bg-surface p-3 font-sans text-[13px] whitespace-pre-wrap text-ink-2">{text}</pre>}
      <div className="flex flex-wrap gap-2">
        {wa.length >= 9 && (
          <a
            href={chosen.length ? `https://wa.me/${wa}?text=${encodeURIComponent(text)}` : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!chosen.length}
            className={`btn btn-primary flex-[1_1_160px] ${chosen.length ? "" : "pointer-events-none opacity-50"}`}
          >
            Send on WhatsApp
          </a>
        )}
        <button
          type="button"
          disabled={!chosen.length}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              setCopied(false);
            }
          }}
          className="btn btn-tonal flex-[1_1_120px]"
        >
          {copied ? "Copied" : "Copy order"}
        </button>
      </div>
    </div>
  );
}
