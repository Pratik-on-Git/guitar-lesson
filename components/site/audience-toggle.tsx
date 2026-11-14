"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const AUDIENCES = ["Students", "Teachers"] as const;

export function AudienceToggle({ className }: { className?: string }) {
  const [active, setActive] = useState<(typeof AUDIENCES)[number]>("Students");

  return (
    <div
      role="tablist"
      aria-label="Audience"
      className={cn(
        "inline-flex gap-0.5 rounded-xl bg-muted p-1",
        className
      )}
    >
      {AUDIENCES.map((audience) => {
        const selected = audience === active;
        return (
          <button
            key={audience}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => setActive(audience)}
            className={cn(
              "rounded-[10px] px-4.5 py-2 text-caption font-medium text-charcoal-ink transition-[background-color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              selected ? "bg-white shadow-soft" : "hover:bg-white/50"
            )}
          >
            {audience}
          </button>
        );
      })}
    </div>
  );
}
