"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Icon } from "@/components/icons";
import { recordSale } from "@/app/dashboard/actions";

export type PosProduct = { id: string; name: string; category: string; available: number; low: boolean; pricingId: string; price: number; currency: string };
export type PosClient = { id: string; name: string };

type Method = "cash" | "mobile_money" | "credit";
const METHODS: { id: Method; label: string }[] = [
  { id: "cash", label: "Cash" },
  { id: "mobile_money", label: "Mobile money" },
  { id: "credit", label: "Credit" },
];

export function Pos({ products, clients, currency }: { products: PosProduct[]; clients: PosClient[]; currency: string }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [method, setMethod] = useState<Method>("cash");
  const [clientId, setClientId] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const fmt = (n: number) => `${currency} ${Math.round(n).toLocaleString("en-US")}`;
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const cats = useMemo(() => ["All", ...[...new Set(products.map((p) => p.category))].sort()], [products]);

  const shown = products.filter((p) => (cat === "All" || p.category === cat) && (!query || p.name.toLowerCase().includes(query.toLowerCase())));
  const lines = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, q]) => ({ p: byId.get(id)!, q }))
    .filter((l) => l.p);
  const count = lines.reduce((a, l) => a + l.q, 0);
  // Shown for guidance: the cloud prices every line itself when the sale is recorded.
  const estimate = lines.reduce((a, l) => a + l.q * l.p.price, 0);

  const add = (id: string, d: number) => {
    setResult(null);
    setCart((c) => {
      const n = Math.max(0, (c[id] ?? 0) + d);
      const next = { ...c, [id]: n };
      if (!n) delete next[id];
      return next;
    });
  };

  const submit = () => {
    if (!lines.length || pending) return;
    startTransition(async () => {
      const r = await recordSale({
        lines: lines.map((l) => ({ productId: l.p.id, pricingId: l.p.pricingId, quantity: l.q })),
        method,
        clientId: method === "credit" ? clientId || null : null,
      });
      if (r.ok) {
        setCart({});
        setClientId("");
        setResult({ ok: true, text: `Sale recorded · ${r.currency} ${Math.round(r.total).toLocaleString("en-US")} · ${METHODS.find((m) => m.id === method)!.label}` });
      } else {
        setResult({ ok: false, text: r.error });
      }
    });
  };

  if (!products.length) {
    return (
      <div className="card flex flex-col items-center gap-3 py-12 text-center">
        <p className="m-0 text-lg font-bold">No items to sell yet</p>
        <p className="m-0 max-w-md text-ink-2">Add items with a price and some stock in Inventory, here or in the Doline Store app. They show up here straight away.</p>
        <Link href="/dashboard/inventory" className="btn btn-tonal">
          Go to inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-5 lg:h-full lg:flex-nowrap">
      <section aria-label="Items" className="flex min-w-0 flex-[999_1_420px] flex-col gap-4 lg:h-full">
        <label className="relative block">
          <span className="sr-only">Find an item</span>
          <span className="absolute top-3.5 left-4 text-ink-2"><Icon name="search" size={20} /></span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for an item" className="field pl-12" />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {cats.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={`chip ${cat === c ? "bg-primary text-white" : "bg-surface text-ink"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pb-1">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
          {shown.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => add(p.id, 1)}
              aria-label={`Add ${p.name}, ${fmt(p.price)}`}
              className="flex min-h-[150px] flex-col gap-2.5 rounded-md bg-surface p-3.5 text-left hover:shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-slate-c text-lg font-extrabold text-on-slate-c">{p.name[0]}</span>
              <span className="text-[15px] leading-snug font-bold">{p.name}</span>
              <span className="mt-auto flex flex-col gap-0.5">
                <span className="font-extrabold text-primary">{`${p.currency} ${Math.round(p.price).toLocaleString("en-US")}`}</span>
                <span className={`text-xs font-bold ${p.low ? "text-on-amber-c" : "text-ink-2"}`}>
                  {p.low ? "Only " : ""}
                  {p.available.toLocaleString("en-US")} left
                </span>
              </span>
            </button>
          ))}
        </div>
        {!shown.length && <p className="m-0 p-8 text-center text-ink-2">Nothing matches that. Try another name or category.</p>}
        </div>
      </section>

      <section aria-label="Current sale" className="flex h-[calc(100dvh-92px)] min-w-0 flex-[1_1_340px] flex-col overflow-hidden rounded-md bg-surface lg:h-full lg:w-[380px] lg:flex-none">
        <div className="flex flex-none items-center justify-between bg-surface-low px-5 py-4">
          <h2 className="m-0 text-lg font-extrabold">Current sale</h2>
          <button type="button" onClick={() => setCart({})} className="min-h-11 text-sm font-bold text-error">
            Clear
          </button>
        </div>
        {result && (
          <div
            role={result.ok ? "status" : "alert"}
            className={`mx-5 mt-4 flex flex-none items-center gap-2.5 rounded-sm p-3.5 text-sm font-bold ${result.ok ? "bg-success-container text-on-success-container" : "bg-error-container text-on-error-container"}`}
          >
            {result.ok && <Icon name="check" size={20} strokeWidth={2.5} />}
            {result.text}
          </div>
        )}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-2">
          {!lines.length && <p className="m-0 py-8 text-center text-ink-2">Tap an item to add it to this sale.</p>}
          {lines.map(({ p, q }) => (
            <div key={p.id} className="flex items-center gap-3 border-b border-surface-mid py-3">
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[15px] font-bold">{p.name}</span>
                <span className="text-[13px] text-ink-2">
                  {q} × {fmt(p.price)}
                </span>
              </span>
              <span className="flex items-center gap-0.5 rounded-sm bg-ground">
                <button type="button" onClick={() => add(p.id, -1)} aria-label={`Remove one ${p.name}`} className="flex h-11 w-11 items-center justify-center">
                  <Icon name="minus" size={18} strokeWidth={2.5} />
                </button>
                <span className="min-w-6 text-center font-extrabold">{q}</span>
                <button type="button" onClick={() => add(p.id, 1)} aria-label={`Add one ${p.name}`} className="flex h-11 w-11 items-center justify-center">
                  <Icon name="plus" size={18} strokeWidth={2.5} />
                </button>
              </span>
              <span className="min-w-24 text-right font-bold text-primary">{fmt(q * p.price)}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-none flex-col gap-3.5 bg-surface-low px-5 pt-4 pb-5">
          <div className="flex justify-between text-sm text-ink-2">
            <span>
              {count} {count === 1 ? "item" : "items"}
            </span>
            <span>Priced by your store&apos;s current prices</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-bold text-ink-2">Total</span>
            <span className="text-[28px] font-extrabold text-primary">{fmt(estimate)}</span>
          </div>
          <div role="group" aria-label="Payment method" className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={method === m.id}
                onClick={() => setMethod(m.id)}
                className={`chip flex-[1_1_90px] ${method === m.id ? "bg-primary text-white" : "bg-surface text-ink"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          {method === "credit" && (
            <div className="flex flex-col gap-1">
              <label htmlFor="pos-client" className="label">
                Client on credit
              </label>
              {clients.length ? (
                <select id="pos-client" value={clientId} onChange={(e) => setClientId(e.target.value)} className="field px-3">
                  <option value="">Choose a client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="m-0 text-sm text-ink-2">
                  No clients yet.{" "}
                  <Link href="/dashboard/clients" className="font-bold text-primary">
                    Add one
                  </Link>{" "}
                  to sell on credit.
                </p>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!lines.length || pending || (method === "credit" && !clientId)}
            className="btn btn-primary h-[52px] text-base"
            style={{ letterSpacing: 3 }}
          >
            {pending ? "Recording…" : "Record sale"}
          </button>
        </div>
      </section>
    </div>
  );
}
