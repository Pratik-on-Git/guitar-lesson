import { cn } from "@/lib/utils";

/*
 * Linear progress, matching @subtrait/ui's (a primary bar on a primary/20
 * track). `value` is 0–100. The bar grows in on mount unless motion is reduced.
 */
function Progress({
  value,
  className,
  indicatorClassName,
  label,
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
  /** Accessible name; omit when a visible label already describes the bar. */
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={cn("bg-primary/15 relative h-2 w-full overflow-hidden rounded-full", className)}
    >
      <div
        data-slot="progress-indicator"
        className={cn(
          "bg-primary animate-meter-grow h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:animate-none",
          indicatorClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export { Progress };
