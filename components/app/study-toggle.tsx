"use client";

import { CircleCheck, CircleDashed } from "lucide-react";
import { useStudied } from "@/lib/store";
import { Button } from "@/components/ui/button";

/** Marks a page as studied; the overview and sidebar track progress from these. */
export function StudyToggle({ href, className }: { href: string; className?: string }) {
  const { isStudied, toggle } = useStudied();
  const done = isStudied(href);
  return (
    <Button
      variant={done ? "success" : "outline"}
      aria-pressed={done}
      onClick={() => toggle(href)}
      className={className}
    >
      {done ? <CircleCheck aria-hidden /> : <CircleDashed aria-hidden />}
      {done ? "Studied" : "Mark as Studied"}
    </Button>
  );
}
