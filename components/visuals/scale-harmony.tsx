
import { titleCaseLabel } from "@/lib/title-case";
import { BOOK_CHORD_TYPES } from "@/lib/content/book";
import { degreeSemitones, mod, noteName, parseDegree, spellDegree, spellRoot } from "@/lib/music/theory";

/*
 * The harmony the book derives for scales without their own tertian sevenths:
 * pentatonics borrow the seventh chord each degree has in its parent modes
 * (Fretboard Concepts pp. 18–19); symmetric scales list every chord type whose
 * tones all lie inside the collection (pp. 51–53).
 */

const semisOf = (formula: string[]) => formula.map((d) => mod(degreeSemitones(parseDegree(d)), 12));
const QUALITY: Record<string, string> = { "4,7,11": "maj7", "4,7,10": "7", "3,7,10": "m7", "3,7,11": "m(maj7)", "3,6,10": "ø", "3,6,9": "°7", "4,8,11": "+maj7", "4,8,10": "+7", "4,6,10": "7♭5", "4,6,11": "maj7♭5", "3,6,11": "°(maj7)" };

export const PENTATONIC_PARENTS: Record<string, { formula: string[]; parents: [string, string][]; blue?: { degree: string; chords: string } }> = {
  "major-pentatonic": { formula: ["1", "2", "3", "5", "6"], parents: [["Ionian", "1 2 3 4 5 6 7"], ["Lydian", "1 2 3 #4 5 6 7"], ["Mixolydian", "1 2 3 4 5 6 b7"], ["Lydian ♭7", "1 2 3 #4 5 6 b7"]] },
  "minor-pentatonic": { formula: ["1", "b3", "4", "5", "b7"], parents: [["Dorian", "1 2 b3 4 5 6 b7"], ["Phrygian", "1 b2 b3 4 5 b6 b7"], ["Aeolian", "1 2 b3 4 5 b6 b7"], ["Dorian ♭2", "1 b2 b3 4 5 6 b7"]] },
};

export function ParentHarmony({ scale, rootPc = 9 }: { scale: "major-pentatonic" | "minor-pentatonic"; rootPc?: number }) {
  const { formula, parents } = PENTATONIC_PARENTS[scale];
  const root = spellRoot(rootPc, formula.map(parseDegree));
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <caption className="sr-only">Seventh chords available on each pentatonic degree, by parent mode</caption>
        <thead className="bg-muted/70 text-left text-xs"><tr><th className="px-3 py-2">{titleCaseLabel(<>Degree</>)}</th>{parents.map(([name]) => <th key={name} className="border-l px-2">{titleCaseLabel(<>{name}</>)}</th>)}<th className="border-l px-2">{titleCaseLabel(<>Choices</>)}</th></tr></thead>
        <tbody>
          {formula.map((degree) => {
            const per = parents.map(([, f]) => {
              const parent = f.split(" ");
              const s = semisOf(parent);
              const i = parent.findIndex((d) => mod(degreeSemitones(parseDegree(d)), 12) === mod(degreeSemitones(parseDegree(degree)), 12));
              const tones = [2, 4, 6].map((k) => mod(s[(i + k) % 7] - s[i], 12));
              return QUALITY[tones.join(",")] ?? "?";
            });
            const unique = [...new Set(per)];
            const name = noteName(spellDegree(root, parseDegree(degree)));
            return (
              <tr key={degree} className="border-t">
                <th scope="row" className="px-3 py-1.5 text-left font-semibold">{titleCaseLabel(<>{name} <span className="text-muted-foreground text-xs font-normal">({degree === "1" ? "I" : ["I", "II", "III", "IV", "V", "VI", "VII"][parseDegree(degree).num - 1]})</span></>)}</th>
                {per.map((q, i) => <td key={i} className="border-l px-2 font-mono text-xs">{name}{q}</td>)}
                <td className="border-l px-2"><span className="flex flex-wrap gap-1">{unique.map((q) => <span key={q} className="bg-seq-1 rounded-md px-1.5 py-0.5 font-mono text-xs font-semibold">{name}{q}</span>)}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Every book chord type contained in a collection, on each of its degrees. */
export function ContainedChords({ formula, rootPc = 9 }: { formula: string[]; rootPc?: number }) {
  const set = new Set(semisOf(formula));
  const root = spellRoot(rootPc, formula.map(parseDegree));
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[640px] border-collapse text-center text-xs">
        <caption className="sr-only">Chord types whose tones all lie inside the scale, on each degree</caption>
        <thead className="bg-muted/70"><tr><th className="px-3 py-2 text-left">{titleCaseLabel(<>Root</>)}</th>{BOOK_CHORD_TYPES.map((c) => <th key={c.id} className="border-l px-1 py-1.5 font-semibold">{titleCaseLabel(<>{c.symbol || "maj"}</>)}</th>)}</tr></thead>
        <tbody>
          {formula.map((degree) => {
            const base = mod(degreeSemitones(parseDegree(degree)), 12);
            return (
              <tr key={degree} className="border-t">
                <th scope="row" className="px-3 py-1 text-left font-semibold whitespace-nowrap">{titleCaseLabel(<>{noteName(spellDegree(root, parseDegree(degree)))}</>)}</th>
                {BOOK_CHORD_TYPES.map((c) => {
                  const ok = semisOf(c.formula).every((s) => set.has(mod(base + s, 12)));
                  return <td key={c.id} className="border-l p-0.5">{ok ? <span className="bg-series-1 mx-auto block size-5 rounded-full" title={`${c.name} on this degree`}><span className="sr-only">contained</span></span> : <span className="text-muted-foreground/40">·</span>}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
