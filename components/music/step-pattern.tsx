import { stepLabel, stepLabelTS, stepSizes, type ScaleNote } from "@/lib/music/theory";
import { cn } from "@/lib/utils";

/*
 * Scale notes as a chain, with the step between each pair:
 * R –W– 2 –W– 3 –H– 4 …, closing back on the octave.
 */
export function StepPattern({ scale, className }: { scale: ScaleNote[]; className?: string }) {
  const steps = stepSizes(scale.map((s) => s.semis));
  const items = [...scale, { ...scale[0], label: "8", interval: "P8" }];
  return (
    <ol className={cn("flex flex-wrap items-center gap-y-3", className)} aria-label="Notes and the steps between them">
      {items.map((note, i) => (
        <li key={i} className="flex items-center">
          <span className="flex min-w-12 flex-col items-center rounded-xl border border-border bg-card px-2.5 py-1.5">
            <span className="text-body font-medium text-foreground">{note.name}</span>
            <span className="text-[12px] text-muted-foreground">{i === 0 ? "R" : note.label}</span>
          </span>
          {i < steps.length && (
            <span className="flex flex-col items-center px-1.5" title={`${steps[i]} semitone${steps[i] > 1 ? "s" : ""}`}>
              <span
                className={cn(
                  "rounded-md px-1.5 text-[12px] font-semibold",
                  steps[i] > 2 ? "bg-foreground text-background" : "text-foreground",
                )}
              >
                {stepLabel(steps[i])}
              </span>
              {/* Half steps carry the ember mark: they are what gives a scale its character. */}
              <span aria-hidden className={cn("mt-1 h-0.5 w-5 rounded-full", steps[i] === 1 ? "bg-ember" : "bg-fog")} />
              <span className="sr-only">({stepLabelTS(steps[i])})</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
