import { cn } from "@/lib/utils";

/*
 * Label/value tiles in one hairline-divided block: the scale, mode and key
 * read-outs. One component so every page lays its facts out the same way.
 */
export function FactGrid({
  children,
  columns = 2,
  className,
}: {
  children: React.ReactNode;
  columns?: 2 | 3;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "bg-border ring-border grid gap-px overflow-hidden rounded-lg ring-1",
        // The 1px gaps show the border colour through, so a lone last tile spans the row instead of leaving a grey hole.
        columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-full",
        className,
      )}
    >
      {children}
    </dl>
  );
}

export function Fact({
  label,
  value,
  wide = false,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Spans the full row: long lists like every triad of a key. */
  wide?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("bg-card px-4 py-3", wide && "sm:col-span-full", className)}>
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</dt>
      <dd className="text-foreground mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}
