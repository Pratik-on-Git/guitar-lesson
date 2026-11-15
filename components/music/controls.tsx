"use client";

import { titleCaseLabel } from "@/lib/title-case";

import { ROOTS, ROOT_SLUGS, rootFromSlug } from "@/lib/music/theory";
import { useFretLabel, type FretLabel } from "@/lib/store";
import { useQueryState } from "@/lib/use-query-state";
import { cn } from "@/lib/utils";
import { SEGMENTED_ITEM, SEGMENTED_ITEM_ACTIVE, SEGMENTED_TRACK, Segmented, onRadioGroupKeyDown } from "@/components/ui/segmented";

/* Pick one of the 12 roots, on the segmented track. Black keys show both spellings. */
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
    <div className={cn("space-y-2", className)}>
      <p className="text-muted-foreground text-xs font-medium tracking-wide" aria-hidden>
        {titleCaseLabel(label)}
      </p>
      <div
        role="radiogroup"
        aria-label={label}
        onKeyDown={onRadioGroupKeyDown}
        className={cn("grid grid-cols-6 gap-1 sm:grid-cols-12", SEGMENTED_TRACK)}
      >
        {ROOTS.map((root) => {
          const selected = root.pc === value;
          const [first, second] = root.label.split("/");
          return (
            <button
              key={root.pc}
              type="button"
              role="radio"
              data-slot="segmented-item"
              aria-checked={selected}
              aria-label={root.label}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(root.pc)}
              className={cn(SEGMENTED_ITEM, "min-h-10 flex-col gap-0 px-1 leading-[1.15]", selected && SEGMENTED_ITEM_ACTIVE)}
            >{titleCaseLabel(<>
              <span className="text-sm">{first}</span>
              {second && <span className="text-xs font-normal opacity-80">{second}</span>}
            </>)}</button>
          );
        })}
      </div>
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
