"use client";

import { useState } from "react";

export type Bucket = {
  key: string;
  /** The axis label; empty to leave this bucket unlabelled when there are many. */
  label: string;
  /** Its full name in the readout, e.g. "Tue 12 Nov". */
  long: string;
  total: number;
  profit: number;
};
type Day = Bucket;

/** Above this many buckets, only the highlighted one shows its figure, so labels never collide. */
const DENSE = 14;

// Profit's line colour: passes 3:1 on white (dataviz validate_palette.js); sales keeps brand blue.
const PROFIT = "#e8590c";
const PLOT_H = 220;
const LINE_H = 140;

/**
 * Two charts over a run of buckets (hours, days or weeks), one measure each so neither borrows the
 * other's scale: sales as bars, then profit (sales less what the goods cost) as a line below, with
 * its own axis that drops below zero when a bucket made a loss. Hovering or focusing a bucket
 * highlights it in both and reads its values in each title row. The latest is the default readout.
 */
export function SalesChart({
  days,
  currency,
  period = "last 7 days",
  totalLabel = "Week",
  profitTitle = "Profit",
  note = "Profit is sales less what the goods sold cost, from each batch's buying price where it was entered. Expenses are counted in Reports.",
}: {
  days: Day[];
  currency: string;
  /** Completes the titles: "Sales, last 7 days". */
  period?: string;
  /** Names the sum under each title: "Week: UGX 1,200,000". */
  totalLabel?: string;
  profitTitle?: string;
  note?: string;
}) {
  const dense = days.length > DENSE;
  const [hover, setHover] = useState<number | null>(null);
  const i = hover ?? days.length - 1;
  const cur = days[i];
  const fmt = (n: number) => `${n < 0 ? "−" : ""}${currency} ${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
  const weekSales = days.reduce((a, d) => a + d.total, 0);
  const weekProfit = days.reduce((a, d) => a + d.profit, 0);

  // Sales axis: 0 up to a round top.
  const sStep = niceStep(Math.max(1, ...days.map((d) => d.total)) / 3);
  const sTop = sStep * 3;

  // Profit axis: round steps covering both the highest day and the lowest (a loss goes below 0).
  const pMax = Math.max(0, ...days.map((d) => d.profit));
  const pMin = Math.min(0, ...days.map((d) => d.profit));
  const pStep = niceStep(Math.max(1, pMax - pMin) / 3);
  const pTop = Math.ceil(pMax / pStep) * pStep || pStep;
  const pBottom = Math.floor(pMin / pStep) * pStep;
  const pTicks: number[] = [];
  for (let v = pTop; v >= pBottom - 1e-9; v -= pStep) pTicks.push(v);
  const y = (v: number) => ((pTop - v) / (pTop - pBottom)) * 100; // % from the top
  const x = (idx: number) => ((idx + 0.5) / days.length) * 100; // % from the left, centred on the day
  const path = smoothPath(days.map((d, idx) => [x(idx), y(d.profit)] as [number, number]));

  const hoverProps = (idx: number) => ({
    onMouseEnter: () => setHover(idx),
    onMouseLeave: () => setHover(null),
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Sales */}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="m-0 text-lg font-extrabold">Sales, {period}</h2>
          <span className="text-[13px] text-ink-2">
            {totalLabel}: {fmt(weekSales)}
          </span>
        </div>
        <span className="text-sm text-ink-2" aria-live="polite">
          {cur?.long} · <strong className="text-ink">{fmt(cur?.total ?? 0)}</strong>
        </span>
      </div>
      <div className="relative mt-5 flex pl-11" style={{ height: PLOT_H }}>
        {[0, 1, 2].map((g) => (
          <div key={g} aria-hidden="true" className="absolute right-0 left-11 border-t border-dashed border-surface-variant" style={{ top: `${(g / 3) * 100}%` }} />
        ))}
        <div aria-hidden="true" className="absolute right-0 bottom-0 left-11 border-t border-outline-variant" />
        {[3, 2, 1].map((g) => (
          <span key={g} aria-hidden="true" className="absolute left-0 text-[11px] text-ink-2" style={{ top: `calc(${((3 - g) / 3) * 100}% - 8px)` }}>
            {axis(sStep * g)}
          </span>
        ))}
        {days.map((d, idx) => (
          <button
            key={d.key}
            type="button"
            aria-label={`${d.long}: sales ${fmt(d.total)}, profit ${fmt(d.profit)}`}
            {...hoverProps(idx)}
            onFocus={() => setHover(idx)}
            onBlur={() => setHover(null)}
            className="flex h-full min-w-0 flex-1 cursor-pointer flex-col items-center justify-end"
          >
            {(!dense || idx === i) && <Figure value={d.total} active={idx === i} />}
            <span
              className={`w-3/5 max-w-11 shrink-0 rounded-t-[4px] ${idx === i ? "bg-primary-hover" : "bg-primary"}`}
              style={{ height: `${Math.max(d.total > 0 ? 1 : 0, (d.total / sTop) * 100)}%` }}
            />
          </button>
        ))}
      </div>
      <DayLabels days={days} i={i} />

      {/* Profit */}
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-surface-mid pt-4">
        <div className="flex flex-col">
          <h2 className="m-0 text-lg font-extrabold">
            {profitTitle}, {period}
          </h2>
          <span className="text-[13px] text-ink-2">
            {totalLabel}: {fmt(weekProfit)}
          </span>
        </div>
        <span className="text-sm text-ink-2" aria-live="polite">
          {cur?.long} · <strong className={cur && cur.profit < 0 ? "text-error" : "text-ink"}>{fmt(cur?.profit ?? 0)}</strong>
        </span>
      </div>
      <div className="relative mt-5 mb-3 pl-11" style={{ height: LINE_H }} aria-hidden="true">
        {pTicks.map((v) => (
          <div key={v} className="absolute right-0 left-11" style={{ top: `${y(v)}%` }}>
            <div className={`border-t ${v === 0 ? "border-outline-variant" : "border-dashed border-surface-variant"}`} />
            <span className="absolute -left-11 -translate-y-1/2 text-[11px] text-ink-2">{axis(v)}</span>
          </div>
        ))}
        <div className="absolute inset-y-0 right-0 left-11">
          <div className="absolute inset-y-0 rounded-sm bg-surface-low" style={{ left: `${(i / days.length) * 100}%`, width: `${100 / days.length}%` }} />
          <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={path} fill="none" stroke={PROFIT} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {days.map((d, idx) => (
            <span
              key={d.key}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface"
              style={{
                left: `${x(idx)}%`,
                top: `${y(d.profit)}%`,
                width: idx === i ? 12 : dense ? 4 : 8,
                height: idx === i ? 12 : dense ? 4 : 8,
                background: PROFIT,
                boxSizing: "content-box",
              }}
            />
          ))}
          {days.map((d, idx) =>
            dense && idx !== i ? null : (
            <span
              key={d.key}
              className="absolute flex -translate-x-1/2"
              // Above the point, or below it on a loss so the label never sits on the line's dip.
              style={{ left: `${x(idx)}%`, top: `calc(${y(d.profit)}% ${d.profit < 0 ? "+ 9px" : "- 24px"})` }}
            >
              <Figure value={d.profit} active={idx === i} negative={d.profit < 0} />
            </span>
            ),
          )}
          <div className="absolute inset-0 flex">
            {days.map((d, idx) => (
              <div key={d.key} className="h-full flex-1 cursor-pointer" {...hoverProps(idx)} />
            ))}
          </div>
        </div>
      </div>
      <DayLabels days={days} i={i} />
      {note && <p className="m-0 text-xs text-ink-2">{note}</p>}
    </div>
  );
}

/** A day's figure on its bar or point: the full number, or the short form on narrow screens. */
function Figure({ value, active, negative = false }: { value: number; active: boolean; negative?: boolean }) {
  if (!value) return <span className="mb-1 shrink-0 text-[11px] leading-4 text-ink-2">0</span>;
  const sign = value < 0 ? "−" : "";
  const full = `${sign}${Math.abs(Math.round(value)).toLocaleString("en-US")}`;
  return (
    <span
      className={`mb-1 shrink-0 whitespace-nowrap text-[11px] leading-4 tabular-nums ${negative ? "text-error" : active ? "text-ink" : "text-ink-2"} ${active ? "font-extrabold" : "font-semibold"}`}
    >
      <span className="hidden sm:inline">{full}</span>
      <span className="sm:hidden">{sign}{axis(Math.abs(value))}</span>
    </span>
  );
}

/**
 * A smooth line through the points that never overshoots them (monotone cubic, Fritsch–Carlson),
 * so a curve between two equal days stays flat and no day looks higher or lower than it was.
 */
function smoothPath(pts: [number, number][]): string {
  const n = pts.length;
  if (n < 2) return n ? `M ${pts[0]![0]} ${pts[0]![1]}` : "";
  const dx = pts.slice(1).map((p, k) => p[0] - pts[k]![0]);
  const m = pts.slice(1).map((p, k) => (p[1] - pts[k]![1]) / dx[k]!);
  const t = pts.map((_, k) => (k === 0 ? m[0]! : k === n - 1 ? m[n - 2]! : m[k - 1]! * m[k]! <= 0 ? 0 : (m[k - 1]! + m[k]!) / 2));
  for (let k = 0; k < n - 1; k++) {
    if (m[k] === 0) {
      t[k] = 0;
      t[k + 1] = 0;
      continue;
    }
    const a = t[k]! / m[k]!;
    const b = t[k + 1]! / m[k]!;
    const h = a * a + b * b;
    if (h > 9) {
      const s = 3 / Math.sqrt(h);
      t[k] = s * a * m[k]!;
      t[k + 1] = s * b * m[k]!;
    }
  }
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
  for (let k = 0; k < n - 1; k++) {
    const [x0, y0] = pts[k]!;
    const [x1, y1] = pts[k + 1]!;
    const h = dx[k]! / 3;
    d += ` C ${x0 + h} ${y0 + t[k]! * h} ${x1 - h} ${y1 - t[k + 1]! * h} ${x1} ${y1}`;
  }
  return d;
}

function DayLabels({ days, i }: { days: Day[]; i: number }) {
  return (
    <div aria-hidden="true" className="-mt-2 flex pl-11">
      {days.map((d, idx) => (
        <span key={d.key} className={`min-w-0 flex-1 text-center text-xs whitespace-nowrap ${idx === i ? "font-extrabold text-ink" : "font-semibold text-ink-2"}`}>
          {d.label}
        </span>
      ))}
    </div>
  );
}

function axis(n: number): string {
  const a = Math.abs(n);
  const s = a >= 1_000_000 ? `${+(a / 1_000_000).toFixed(1)}M` : a >= 1000 ? `${+(a / 1000).toFixed(a < 10_000 ? 1 : 0)}K` : String(Math.round(a));
  return n < 0 ? `−${s}` : s;
}

function niceStep(raw: number) {
  const pow = 10 ** Math.floor(Math.log10(Math.max(raw, 1)));
  const f = raw / pow;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * pow;
}
