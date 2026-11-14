"use client";

import { Check } from "lucide-react";
import { useStudied } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Marks a page as studied; the overview tracks progress from these. */
export function StudyToggle({ href, className }: { href: string; className?: string }) {
  const { isStudied, toggle } = useStudied();
  const done = isStudied(href);
  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={() => toggle(href)}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-caption font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        done
          ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/85"
          : "border-border bg-card text-foreground hover:border-muted-foreground",
        className,
      )}
    >
      {done ? (
        <Check className="size-4" strokeWidth={2} aria-hidden />
      ) : (
        <span aria-hidden className="size-2 rounded-full bg-ember" />
      )}
      {done ? "Studied" : "Mark as studied"}
    </button>
  );
}
