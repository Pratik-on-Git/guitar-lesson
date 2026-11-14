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

const THIRD: Record<number, string> = { 2: "2", 3: "b3", 4: "3", 5: "4" };
const FIFTH: Record<number, string> = { 6: "b5", 7: "5", 8: "#5" };
const SEVENTH: Record<number, string> = { 9: "bb7", 10: "b7", 11: "7" };
/** A tertian formula from semitones above the root, e.g. [0, 4, 7, 10] → 1 3 5 b7. */
export function formulaFromSemis(semis: number[]) {
  const [, t, f, s] = semis.map((x) => mod(x, 12));
  return ["1", THIRD[t] ?? "3", FIFTH[f] ?? "5", ...(s === undefined ? [] : [SEVENTH[s] ?? "b7"])];
}

/** A progression or a scale's harmony as a row of chord boxes, one grip per chord. */
export function ChordStrip({ chords, label }: { chords: { name: string; caption?: string; rootPc: number; formula: string[] }[]; label: string }) {
  return (
    <ol className="flex gap-3 overflow-x-auto pb-2" aria-label={label}>
      {chords.map((c, i) => {
        const grip = findGrips(mod(c.rootPc, 12), c.formula, { limit: 1 })[0];
        return (
          <li key={i} className="bg-card flex min-w-28 flex-col items-center rounded-xl border px-2 py-2">
            {c.caption && <span className="text-muted-foreground font-serif text-xs">{c.caption}</span>}
            <span className="text-sm font-semibold">{c.name}</span>
            {grip ? <ChordBox grip={grip} size="sm" /> : <span className="text-muted-foreground my-8 text-xs">no grip</span>}
            {grip && <PlayNotes midis={gripMidis(grip)} simultaneous label="Strum" />}
          </li>
        );
      })}
    </ol>
  );
}
