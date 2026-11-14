import { Guitar } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * The app mark: a brand-gradient tile (the dashboards' `brand-tile`) holding
 * the guitar glyph. Used in the sidebar, the phone sheet and the loader.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("brand-tile grid size-9 shrink-0 place-items-center rounded-lg", className)}>
      <Guitar className="size-[55%]" strokeWidth={2} />
    </span>
  );
}
