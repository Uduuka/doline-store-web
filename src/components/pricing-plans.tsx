"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import type { Plan } from "@/lib/pricing";

const fmt = (n: number, c: string) => `${c} ${Math.round(n).toLocaleString("en-US")}`;

const CTA: Record<string, string> = { free: "Start free", duka: "Choose Duka", business: "Start free trial", chain: "Choose Enterprise" };

export function PricingPlans({ plans, trialDays }: { plans: Plan[]; trialDays: number }) {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Billing period" className="flex w-fit gap-1 rounded-sm bg-ground p-1">
        {[
          { label: "Monthly", on: !yearly, set: false },
          { label: "Yearly · 2 months free", on: yearly, set: true },
        ].map((b) => (
          <button
            key={b.label}
            type="button"
            aria-pressed={b.on}
            onClick={() => setYearly(b.set)}
            className={`h-11 rounded-sm px-[18px] text-sm font-bold ${b.on ? "bg-primary text-white" : "text-ink"}`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-stretch gap-4">
        {plans.map((p) => {
          const featured = p.code === "business";
          const price = p.monthly === 0 ? 0 : yearly ? p.yearly : p.monthly;
          const per = p.monthly === 0 ? "Forever" : yearly ? "Per year" : "Per month";
          const note = p.monthly === 0 ? null : yearly ? `Saves ${fmt(p.monthly * 2, p.currency)} a year` : `or ${fmt(p.yearly, p.currency)} a year`;
          return (
            <div
              key={p.code}
              className={`flex min-w-0 flex-[1_1_250px] flex-col gap-5 rounded-md p-7 ${featured ? "bg-primary text-white shadow-fab" : "bg-ground"}`}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="m-0 text-xl font-extrabold">{p.label}</h3>
                  {featured && (
                    <span className="rounded-sm bg-primary-container px-2.5 py-1 text-[11px] font-extrabold whitespace-nowrap text-on-primary-container">
                      {trialDays}-DAY FREE TRIAL
                    </span>
                  )}
                </div>
                <p className={`m-0 text-sm ${featured ? "text-primary-container" : "text-ink-2"}`}>{p.tagline}</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className={`text-[30px] font-extrabold whitespace-nowrap ${featured ? "text-white" : "text-primary"}`}>
                    {fmt(price, p.currency)}
                  </span>
                  <span className={`text-sm font-bold ${featured ? "text-primary-container" : "text-ink-2"}`}>{per}</span>
                </div>
                {note && <span className={`text-[13px] ${featured ? "text-primary-container" : "text-ink-2"}`}>{note}</span>}
              </div>
              <ul className="m-0 flex flex-grow list-none flex-col gap-2.5 p-0 text-sm leading-normal">
                {p.features.map((f) => (
                  <li key={f.text} className={`flex items-start gap-2.5 ${f.included ? "" : featured ? "text-primary-container" : "text-ink-2"}`}>
                    <span className={`mt-0.5 ${f.included ? (featured ? "text-white" : "text-primary") : featured ? "text-inverse-primary" : "text-outline"}`}>
                      <Icon name={f.included ? "check" : "dash"} size={18} strokeWidth={2.5} />
                    </span>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/sign-up?plan=${p.code}`}
                className="btn btn-default w-full"
                style={{ letterSpacing: 3 }}
              >
                {CTA[p.code] ?? `Choose ${p.label}`}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
