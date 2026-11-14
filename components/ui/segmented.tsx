"use client";

import { cn } from "@/lib/utils";

/*
 * The dashboards' segmented control (emp-dashboard `line-tabs.tsx`): a muted,
 * bordered track; the selected item is a raised card in the brand colour.
 * The class strings are exported so other pickers (keys, modes, chord
 * categories) match it exactly.
 */
export const SEGMENTED_TRACK =
  "rounded-xl border border-border/70 bg-muted/60 p-1";

export const SEGMENTED_ITEM =
  "text-muted-foreground hover:text-foreground hover:bg-card/50 inline-flex items-center justify-center gap-1.5 rounded-lg whitespace-nowrap border border-transparent font-medium shadow-none transition-all duration-150 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] [&_svg:not([class*='size-'])]:size-3.5";

export const SEGMENTED_ITEM_ACTIVE =
  "bg-card text-primary hover:bg-card hover:text-primary border-border/80 font-semibold shadow-xs";

/** Arrow-key movement across a radiogroup's items, as native radios have. Put it on the group. */
export function onRadioGroupKeyDown(event: React.KeyboardEvent<HTMLElement>) {
  const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
  if (!keys.includes(event.key)) return;
  const items = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')];
  const current = items.indexOf(document.activeElement as HTMLElement);
  if (current < 0) return;
  event.preventDefault();
  const last = items.length - 1;
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? last
        : event.key === "ArrowRight" || event.key === "ArrowDown"
          ? (current + 1) % items.length
          : (current - 1 + items.length) % items.length;
  items[next].focus();
  items[next].click();
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
  size = "default",
  className,
}: {
  options: readonly { value: T; label: React.ReactNode; title?: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "default" | "sm";
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onRadioGroupKeyDown}
      className={cn("inline-flex max-w-full flex-wrap items-center gap-1", SEGMENTED_TRACK, className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            data-slot="segmented-item"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              "group/segment",
              SEGMENTED_ITEM,
              size === "sm" ? "px-2.5 py-1 text-caption" : "px-3 py-1.5 text-body",
              selected && SEGMENTED_ITEM_ACTIVE,
            )}
          >
            {option.label}
            {option.count !== undefined ? (
              <span
                className={cn(
                  "rounded-full px-1.5 text-caption tabular-nums",
                  selected ? "bg-primary/10 text-primary" : "bg-muted-foreground/10 text-muted-foreground",
                )}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
