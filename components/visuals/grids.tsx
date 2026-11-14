import { cn } from "@/lib/utils";

/*
 * Table-shaped figures as graphics: filled cells are tinted so the pattern
 * (which intervals a mode contains, where the chord tones fall) reads before
 * the labels do. Headers stay on the muted surface; text stays in ink.
 */

export type MatrixRow = { label: React.ReactNode; sub?: string; cells: (string | null)[]; strong?: number[] };

export function MatrixTable({
  caption,
  corner,
  head,
  subHead,
  rows,
  groups,
  rootColumn = true,
  className,
}: {
  caption: string;
  corner?: string;
  head: string[];
  subHead?: string[];
  rows: MatrixRow[];
  /** Optional header groups: [label, column count]. */
  groups?: [string, number][];
  rootColumn?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border", className)}>
      <table className="w-full min-w-[560px] border-collapse text-center text-xs">
        <caption className="sr-only">{caption}</caption>
        <thead>
          {groups && (
            <tr className="bg-muted/70">
              <th className="border-b" />
              {groups.map(([label, span]) => <th key={label} colSpan={span} className="border-b border-l px-2 py-1.5 font-semibold">{label}</th>)}
            </tr>
          )}
          <tr className="bg-muted/70">
            <th scope="col" rowSpan={subHead ? 2 : 1} className="px-3 py-2 text-left font-semibold">{corner}</th>
            {head.map((h, i) => <th key={i} scope="col" className="border-l px-1.5 py-1.5 font-semibold">{h}</th>)}
          </tr>
          {subHead && (
            <tr className="bg-muted/70">
              {subHead.map((h, i) => <th key={i} scope="col" className="text-muted-foreground border-l px-1.5 pb-1.5 font-medium">{h}</th>)}
            </tr>
          )}
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-t">
              <th scope="row" className="px-3 py-2 text-left font-medium whitespace-nowrap">
                {row.label}
                {row.sub && <span className="text-muted-foreground block text-[11px] font-normal">{row.sub}</span>}
              </th>
              {row.cells.map((cell, c) => (
                <td key={c} className="border-l p-0.5">
                  {cell ? (
                    <span className={cn("flex h-8 min-w-8 items-center justify-center rounded-md px-1 font-semibold", c === 0 && rootColumn ? "bg-primary text-primary-foreground" : row.strong?.includes(c) ? "bg-seq-3 text-white" : "bg-seq-1 text-foreground")}>{cell}</span>
                  ) : <span className="block h-8" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** One or more aligned rows of cells (note names over degrees), with optional emphasis. */
export function DegreeStrip({ rows, highlight = [], caption, className }: { rows: string[][]; highlight?: number[]; caption: string; className?: string }) {
  const n = rows[0].length;
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-separate border-spacing-1 text-center" style={{ minWidth: n * 44 }}>
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className={cn("rounded-lg border px-1 py-2 font-semibold", r === 0 ? "text-base" : "text-muted-foreground text-sm", highlight.includes(c) ? "border-primary bg-primary/10 text-primary" : "bg-card")}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const QUALITY: Record<string, { cls: string; legend: string }> = {
  maj: { cls: "border-l-series-1", legend: "Major" },
  min: { cls: "border-l-series-2", legend: "Minor" },
  dom: { cls: "border-l-series-3", legend: "Dominant" },
  dim: { cls: "border-l-series-5", legend: "Diminished / half-diminished" },
  aug: { cls: "border-l-series-4", legend: "Augmented" },
};
export function qualityOf(symbol: string): keyof typeof QUALITY {
  const s = symbol.toLowerCase();
  if (/dim|°|ø|m7b5|min7b5|m7♭5/.test(s)) return "dim";
  if (/aug|\+/.test(s)) return "aug";
  if (/dom|^7$|\(dom\)7/.test(s)) return "dom";
  if (/^m(?!aj)|min|minor/.test(s)) return "min";
  return "maj";
}

/** Chord qualities over Roman numerals, colour-coded by family with a legend. */
export function QualityStrip({ items, caption }: { items: { numeral: string; quality: string; chord?: string }[]; caption: string }) {
  const used = [...new Set(items.map((i) => qualityOf(i.quality)))];
  return (
    <figure className="space-y-2">
      <ol className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(3.5rem, 1fr))` }} aria-label={caption}>
        {items.map((item, i) => (
          <li key={i} className={cn("bg-card rounded-lg border border-l-4 px-1 py-2 text-center", QUALITY[qualityOf(item.quality)].cls)}>
            <span className="text-muted-foreground block text-xs">{item.quality}</span>
            <span className="block font-serif text-lg font-semibold">{item.numeral}</span>
            {item.chord && <span className="block text-xs font-semibold">{item.chord}</span>}
          </li>
        ))}
      </ol>
      <figcaption className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {used.map((q) => <span key={q} className="flex items-center gap-1.5"><span className={cn("inline-block h-3 w-1 rounded-full border-l-4", QUALITY[q].cls)} aria-hidden />{QUALITY[q].legend}</span>)}
      </figcaption>
    </figure>
  );
}
