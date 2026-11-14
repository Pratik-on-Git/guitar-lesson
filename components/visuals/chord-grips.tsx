"use client";

import { findGrips, gripMidis, type ChordGrip } from "@/lib/music/chord-shapes";
import { mod, noteName, parseDegree, spellDegree, spellRoot } from "@/lib/music/theory";
import { PlayNotes } from "@/components/music/study-controls";
import { cn } from "@/lib/utils";
import { ChordBox } from "./chord-box";

/** Note names per string for a grip, spelled from the chord root. */
export function gripNoteLabels(grip: ChordGrip, rootPc: number, formula: string[]) {
  const root = spellRoot(rootPc, formula.map(parseDegree));
  return grip.degrees.map((d) => (d ? noteName(spellDegree(root, parseDegree(d))) : null));
}

/** Up to four playable grips for a chord, each a chord box you can hear. */
export function ChordGrips({ rootPc, formula, name, limit = 4, notes = false, compact = false, className }: { rootPc: number; formula: string[]; name: string; limit?: number; notes?: boolean; compact?: boolean; className?: string }) {
  const grips = findGrips(mod(rootPc, 12), formula, { limit });
  if (!grips.length) return <p className="text-muted-foreground text-sm">No compact six-string grip contains every essential tone; use a partial voicing or the neck map.</p>;
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-4", className)} aria-label={`${name} playable shapes`}>
      {grips.map((grip, i) => (
        <li key={grip.frets.join(",")} className="flex flex-col items-center gap-2">
          <ChordBox grip={grip} size={compact ? "sm" : "md"} labels={notes ? gripNoteLabels(grip, rootPc, formula) : undefined} name={compact ? undefined : i === 0 ? name : `${name} · fret ${grip.baseFret}`} />
          {!compact && <PlayNotes midis={gripMidis(grip)} simultaneous label="Strum" />}
        </li>
      ))}
    </ul>
  );
}
