"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/*
 * Small, honest charts in the app's ink: thin horizontal bars from a shared
 * zero, direct value labels, a legend whenever colour carries a category,
 * and a hover/focus readout. Colours come from the validated series tokens.
 */

export type Series = 1 | 2 | 3 | 4 | 5 | 6;
const FILL: Record<Series, string> = { 1: "bg-series-1", 2: "bg-series-2", 3: "bg-series-3", 4: "bg-series-4", 5: "bg-series-5", 6: "bg-series-6" };

export type Bar = { label: string; value: number; display?: string; series?: Series; detail?: string };

function Legend({ items }: { items: { series: Series; label: string }[] }) {
  return (
    <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
      {items.map((i) => <li key={i.label} className="flex items-center gap-1.5"><span className={cn("inline-block size-2.5 rounded-sm", FILL[i.series])} aria-hidden />{i.label}</li>)}
    </ul>
  );
}

/** Horizontal bars measured from zero. */
export function BarChart({ title, bars, unit, max, legend, labelWidth = "8rem" }: { title: string; bars: Bar[]; unit?: string; max?: number; legend?: { series: Series; label: string }[]; labelWidth?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const top = max ?? Math.max(...bars.map((b) => b.value));
  const focus = active === null ? null : bars[active];
  return (
    <figure className="space-y-3">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-muted-foreground min-h-4 text-xs" aria-live="polite">{focus ? `${focus.label}: ${focus.display ?? focus.value}${unit ? ` ${unit}` : ""}${focus.detail ? ` · ${focus.detail}` : ""}` : "Hover or focus a bar for detail"}</span>
      </figcaption>
      {legend && <Legend items={legend} />}
      <ol className="space-y-1.5">
        {bars.map((b, i) => (
          <li key={b.label} className="grid items-center gap-3" style={{ gridTemplateColumns: `${labelWidth} 1fr` }}>
            <span className="truncate text-right text-xs font-medium">{b.label}</span>
            <button
              type="button"
              className="group flex h-6 items-center gap-2 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              aria-label={`${b.label}: ${b.display ?? b.value}${unit ? ` ${unit}` : ""}`}
            >
              <span className={cn("h-3.5 rounded-r-[4px] transition-opacity", FILL[b.series ?? 1], active !== null && active !== i && "opacity-40")} style={{ width: `${Math.max(0.6, (b.value / top) * 100)}%` }} />
              <span className="text-xs font-semibold tabular-nums whitespace-nowrap">{b.display ?? b.value}</span>
            </button>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** Bars either side of a neutral centre line (e.g. sharps vs flats, raised vs lowered). */
export function DivergingChart({ title, bars, negative, positive, limit, unit }: { title: string; bars: Bar[]; negative: string; positive: string; limit?: number; unit?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const top = limit ?? Math.max(...bars.map((b) => Math.abs(b.value)));
  const focus = active === null ? null : bars[active];
  return (
    <figure className="space-y-3">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-muted-foreground min-h-4 text-xs" aria-live="polite">{focus ? `${focus.label}: ${focus.display ?? focus.value}${unit ? ` ${unit}` : ""}${focus.detail ? ` · ${focus.detail}` : ""}` : "Hover or focus a bar for detail"}</span>
      </figcaption>
      <Legend items={[{ series: 2, label: negative }, { series: 1, label: positive }]} />
      <ol className="space-y-1.5">
        {bars.map((b, i) => {
          const width = `${(Math.abs(b.value) / top) * 50}%`;
          return (
            <li key={b.label} className="grid grid-cols-[5.5rem_1fr] items-center gap-2">
              <span className="truncate text-right text-xs font-medium">{b.label}</span>
              <button
                type="button"
                className="relative h-6 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(i)} onBlur={() => setActive(null)}
                aria-label={`${b.label}: ${b.display ?? b.value}`}
              >
                <span className="bg-border absolute top-0 left-1/2 h-6 w-px" aria-hidden />
                {b.value !== 0 && (
                  <span className={cn("absolute top-1.5 h-3 transition-opacity", b.value < 0 ? "bg-series-2 rounded-l-[4px]" : "bg-series-1 rounded-r-[4px]", active !== null && active !== i && "opacity-40")} style={b.value < 0 ? { right: "50%", width } : { left: "50%", width }} />
                )}
                <span className="absolute top-1 text-[11px] font-semibold tabular-nums" style={b.value < 0 ? { right: `calc(50% + ${width} + 4px)` } : { left: `calc(50% + ${width} + 4px)` }}>{b.display ?? b.value}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

/** A proportional strip: segments sized by value, labelled inside (e.g. note durations in one bar). */
export function ProportionStrip({ title, rows }: { title: string; rows: { label: string; parts: number; each: string }[] }) {
  return (
    <figure className="space-y-2">
      <figcaption className="text-sm font-semibold">{title}</figcaption>
      <ol className="space-y-1.5">
        {rows.map((r, i) => (
          <li key={r.label} className="grid grid-cols-[7rem_1fr] items-center gap-3">
            <span className="text-right text-xs font-medium">{r.label}</span>
            <span className="flex gap-0.5" aria-label={`${r.label}: ${r.parts} per 4/4 bar, ${r.each} each`}>
              {Array.from({ length: r.parts }, (_, k) => (
                <span key={k} className={cn("bg-series-1 flex h-6 flex-1 items-center justify-center rounded-[3px] text-[10px] font-semibold text-white", i % 2 && "opacity-85")}>{r.parts <= 8 ? r.each : ""}</span>
              ))}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
