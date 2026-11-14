"use client";

import { ROOTS, ROOT_SLUGS, rootFromSlug } from "@/lib/music/theory";
import { useFretLabel, type FretLabel } from "@/lib/store";
import { useQueryState } from "@/lib/use-query-state";
import { cn } from "@/lib/utils";
import { Segmented } from "@/components/ui/segmented";

/* Pick one of the 12 roots. Black keys show both spellings. */
export function RootPicker({
  value,
  onChange,
  label = "Key",
  className,
}: {
  value: number;
  onChange: (pc: number) => void;
  label?: string;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("grid grid-cols-6 gap-1 rounded-xl bg-muted p-1 sm:grid-cols-12", className)}>
      {ROOTS.map((root) => {
        const selected = root.pc === value;
        const [first, second] = root.label.split("/");
        return (
          <button
            key={root.pc}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={root.label}
            onClick={() => onChange(root.pc)}
            className={cn(
              "flex min-h-10 flex-col items-center justify-center rounded-[10px] px-1 leading-[1.1] font-medium outline-none transition-[background-color,box-shadow] focus-visible:ring-3 focus-visible:ring-ring/50",
              selected ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:bg-card/50 hover:text-foreground",
            )}
          >
            <span className="text-caption">{first}</span>
            {second && <span className="text-[11px]">{second}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Root picker bound to ?key= in the URL. */
export function useRootParam(fallback: number): [number, (pc: number) => void] {
  const [slug, setSlug] = useQueryState("key", ROOT_SLUGS[fallback]);
  return [rootFromSlug(slug, fallback), (pc: number) => setSlug(ROOT_SLUGS[pc])];
}

export function FretLabelToggle() {
  const [value, setValue] = useFretLabel();
  return (
    <Segmented<FretLabel>
      label="Label notes by"
      size="sm"
      value={value}
      onChange={setValue}
      options={[
        { value: "degree", label: "Degrees" },
        { value: "note", label: "Notes" },
        { value: "interval", label: "Intervals" },
      ]}
    />
  );
}
