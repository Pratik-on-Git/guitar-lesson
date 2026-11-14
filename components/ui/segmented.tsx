"use client";

import { cn } from "@/lib/utils";

/*
 * The design system's pill switch (cream well, white raised selection),
 * generalised from the original audience toggle.
 */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
  size = "default",
  className,
}: {
  options: readonly { value: T; label: React.ReactNode; title?: string }[];
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
      className={cn("inline-flex flex-wrap gap-0.5 rounded-xl bg-muted p-1", className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-[10px] font-medium text-foreground transition-[background-color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              size === "sm" ? "px-2.5 py-1 text-[13px]" : "px-3.5 py-1.5 text-caption",
              selected ? "bg-card shadow-soft" : "text-muted-foreground hover:bg-card/50 hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
