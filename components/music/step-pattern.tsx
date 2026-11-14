import { stepLabel, stepLabelTS, stepSizes, type ScaleNote } from "@/lib/music/theory";
import { cn } from "@/lib/utils";

/*
 * Scale notes as a chain, with the step between each pair:
 * R –W– 2 –W– 3 –H– 4 …, closing back on the octave. The root and octave are
 * brand-filled; half steps carry the brand underline (they give a scale its
 * character) and wider-than-whole steps a warning tint.
 */
export function StepPattern({ scale, className }: { scale: ScaleNote[]; className?: string }) {
  const steps = stepSizes(scale.map((s) => s.semis));
  const items = [...scale, { ...scale[0], label: "8", interval: "P8" }];
  return (
    <ol className={cn("flex flex-wrap items-center gap-y-3", className)} aria-label="Notes and the steps between them">
      {items.map((note, i) => {
        const root = i === 0 || i === items.length - 1;
        return (
          <li key={i} className="flex items-center">
            <span
              className={cn(
                "flex min-w-12 flex-col items-center rounded-lg border px-2.5 py-1.5 shadow-xs",
                root ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
              )}
            >
              <span className="text-sm font-semibold">{note.name}</span>
              <span className={cn("text-xs", root ? "text-primary-foreground/80" : "text-muted-foreground")}>{i === 0 ? "R" : note.label}</span>
            </span>
            {i < steps.length && (
              <span className="flex flex-col items-center px-1.5" title={`${steps[i]} semitone${steps[i] > 1 ? "s" : ""}`}>
                <span
                  className={cn(
                    "rounded-md px-1.5 text-xs font-semibold",
                    steps[i] > 2 ? "bg-warning/15 text-warning" : steps[i] === 1 ? "text-primary" : "text-foreground",
                  )}
                >
                  {stepLabel(steps[i])}
                </span>
                <span aria-hidden className={cn("mt-1 h-0.5 w-5 rounded-full", steps[i] === 1 ? "bg-primary" : "bg-border")} />
                <span className="sr-only">({stepLabelTS(steps[i])})</span>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
