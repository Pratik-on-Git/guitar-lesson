"use client";

import { titleCaseLabel } from "@/lib/title-case";

import { useState } from "react";
import { buildScale, degreeSemitones, intervalShort, mod, noteName, parseDegree, parseNote, prettyDegree, spellDegree } from "@/lib/music/theory";
import { findGrips } from "@/lib/music/chord-shapes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChordBox } from "./chord-box";
import { DegreeStrip, FormulaRows, MatrixTable, QualityStrip } from "./grids";
import { IntervalRuler } from "./interval-ruler";
import { BraceGroups, ChordStack, OneStringNeck, PitchCircle, SignatureCircle, TuningPanel } from "./misc-figures";
import { Notation } from "./notation";
import { PianoDiagram, PianoRange, type PianoMark } from "./piano-diagram";
import { RhythmCount } from "./rhythm-count";
import { CHART_VISUALS } from "./chart-figures";
import { RAGA_VISUALS } from "./raga-figures";
import { FRET_SHEETS } from "@/lib/content/fretboard-sheets";
import { FretSheetView, SheetHarmony } from "./fret-sheet";

/*
 * Every illustration from the supplied books, rebuilt as coded visuals. Notes,
 * intervals and spellings are computed by the app's theory engine rather than
 * copied, so a figure cannot drift from the explorers it links to.
 */

const PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const NAMES = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
const pretty = (d: string) => (d === "1" ? "R" : prettyDegree(d));
const COLS = ["R", "m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7", "8"];

function scale(root: string, formula: string) {
  return buildScale(parseNote(root), formula.split(" ").map(parseDegree));
}

/** A labelled scale on the keyboard, root to octave, with step brackets. */
function ScaleKeys({ root, formula, title, sub = "interval" }: { root: string; formula: string; title: string; sub?: "interval" | "none" }) {
  const notes = scale(root, formula);
  const base = PC[root[0]];
  const marks: Record<number, PianoMark> = {};
  notes.forEach((n) => { marks[base + n.semis] = { name: n.name, sub: sub === "interval" ? n.interval : undefined, root: n.semis === 0 }; });
  marks[base + 12] = { name: notes[0].name, sub: sub === "interval" ? "8" : undefined, root: true };
  const start = base === 0 ? 0 : base >= 5 ? 5 : 0;
  return <PianoDiagram start={start} length={Math.max(base + 12 - start + 2, 16)} marks={marks} steps title={title} />;
}

/** Rows of modes or scales against 12 chromatic columns. */
function ModeMatrix({ rows, caption }: { rows: { name: string; sub?: string; root: string; formula: string }[]; caption: string }) {
  return (
    <MatrixTable
      caption={caption}
      corner="Notes"
      head={Array.from({ length: 13 }, (_, i) => (i === 12 ? "Oct" : String(i + 1)))}
      subHead={COLS}
      rows={rows.map((r) => {
        const notes = scale(r.root, r.formula);
        const cells: (string | null)[] = Array(13).fill(null);
        notes.forEach((n) => { cells[n.semis] = n.name; });
        cells[12] = notes[0].name;
        return { label: r.name, sub: r.sub, cells, strong: [12] };
      })}
    />
  );
}

function rotations(root: string, formula: string, names: string[]) {
  const parent = scale(root, formula);
  return names.map((name, i) => {
    const rotated = parent.map((_, k) => parent[(i + k) % parent.length]);
    const start = rotated[0].semis;
    const degrees = rotated.map((n) => {
      const semi = mod(n.semis - start, 12);
      const num = (((n.degree.num - rotated[0].degree.num) % 7) + 7) % 7 + 1;
      const natural = [0, 2, 4, 5, 7, 9, 11][num - 1];
      const acc = semi - natural > 6 ? semi - natural - 12 : semi - natural < -6 ? semi - natural + 12 : semi - natural;
      return (acc > 0 ? "#".repeat(acc) : "b".repeat(-acc)) + num;
    });
    return { name, sub: `${["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"][i]} mode`, root: rotated[0].name.replace("♯", "#").replace("♭", "b"), formula: degrees.join(" ") };
  });
}

function formulaRows(rows: { name: string; formula: string }[]) {
  return rows.map((r) => {
    const degrees = r.formula.split(" ");
    return { name: r.name, intervals: degrees.map((d) => (d === "1" ? "R" : intervalShort(parseDegree(d)))), degrees: degrees.map((d) => (d === "1" ? "1" : prettyDegree(d))) };
  });
}

/** Chords spelled from C with their formula, notes and a playable shape. */
function ChordFormulaTable({ rows, caption }: { rows: { name: string; formula: string }[]; caption: string }) {
  const width = Math.max(...rows.map((r) => r.formula.split(" ").length));
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[560px] border-collapse text-center text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-muted/70"><tr><th className="px-3 py-2 text-left">{titleCaseLabel(<>Chord</>)}</th><th colSpan={width} className="border-l">{titleCaseLabel(<>Formula</>)}</th><th className="border-l">{titleCaseLabel(<>Notes in C</>)}</th><th className="border-l">{titleCaseLabel(<>Shape</>)}</th></tr></thead>
        <tbody>
          {rows.map((r) => {
            const f = r.formula.split(" ");
            const notes = f.map((d) => noteName(spellDegree(parseNote("C"), parseDegree(d))));
            const grip = findGrips(0, f, { limit: 1 })[0];
            return (
              <tr key={r.name} className="border-t">
                <th scope="row" className="px-3 py-1 text-left font-medium">{titleCaseLabel(<>{r.name}</>)}</th>
                {Array.from({ length: width }, (_, i) => <td key={i} className="border-l px-2 font-mono">{f[i] ? pretty(f[i]) : ""}</td>)}
                <td className="border-l px-2 font-semibold whitespace-nowrap">{notes.join(" ")}</td>
                <td className="border-l px-1 py-1">{grip ? <ChordBox grip={grip} size="sm" className="mx-auto" /> : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const TRIAD_COLS = ["R", "m2", "M2", "m3", "M3", "P4", "d5", "P5", "A5", "M6", "m7", "M7"];
function ChordIntervalMatrix({ rows, caption }: { rows: { name: string; formula: string }[]; caption: string }) {
  return (
    <MatrixTable
      caption={caption}
      corner="Chords"
      head={TRIAD_COLS}
      rows={rows.map((r) => {
        const cells: (string | null)[] = Array(12).fill(null);
        for (const d of r.formula.split(" ")) {
          const semi = degreeSemitones(parseDegree(d));
          const col = d === "#5" ? 8 : d === "6" || d === "bb7" ? 9 : semi === 8 ? 8 : semi;
          cells[col] = d === "1" ? "R" : intervalShort(parseDegree(d));
        }
        return { label: r.name, cells };
      })}
    />
  );
}

const EXT_HEAD = ["1", "♭2", "2", "♭3", "3", "4", "♯4", "5", "♭6", "6", "♭7", "7", "8", "♭2", "2", "♭3", "3", "4", "♯4", "5", "♭6", "6", "♭7", "7", "8"];
const EXT_SUB = ["R", "m2", "M2", "m3", "M3", "P4", "A4", "P5", "m6", "M6", "m7", "M7", "P8", "m9", "M9", "m10", "M10", "P11", "A11", "P12", "m13", "M13", "m14", "M14", "P15"];
function ExtendedMatrix() {
  const chords: [string, string, string][] = [["9's", "Major 9", "1 3 5 7 9"], ["9's", "minor 9", "1 b3 5 b7 9"], ["9's", "Dominant 9", "1 3 5 b7 9"], ["11's", "Major 11", "1 3 5 7 9 11"], ["11's", "minor 11", "1 b3 5 b7 9 11"], ["11's", "Dominant 11", "1 3 5 b7 9 11"], ["13's", "Major 13", "1 3 5 7 9 11 13"], ["13's", "minor 13", "1 b3 5 b7 9 11 13"], ["13's", "Dominant 13", "1 3 5 b7 9 11 13"]];
  return (
    <MatrixTable
      caption="Extended chords across two octaves: chord tones in the first, extensions in the second"
      corner="Extended chords"
      groups={[["7th-chord notes · core", 13], ["Extensions · second octave", 12]]}
      head={EXT_HEAD}
      subHead={EXT_SUB}
      rows={chords.map(([family, name, f]) => {
        const cells: (string | null)[] = Array(25).fill(null);
        for (const d of f.split(" ")) {
          const s = degreeSemitones(parseDegree(d));
          const n = parseDegree(d).num;
          cells[n > 7 ? s : s] = d === "1" ? "R" : EXT_SUB[s];
        }
        return { label: name, sub: family, cells, strong: cells.map((c, i) => (c && i > 12 ? i : -1)).filter((i) => i > 12) };
      })}
    />
  );
}

const ALT_HEAD = ["m9", "M9", "m10", "M10", "P11", "A11", "P12", "m13", "M13", "m14", "M14", "P15"];
function AlteredMatrix({ family, core, rows }: { family: string; core: string[]; rows: [string, Record<string, string>][] }) {
  return (
    <MatrixTable
      caption={`${family} altered chords: core chord plus the added tensions`}
      corner={`${family} type`}
      groups={[["Core chord", 4], ["Extended part", 12]]}
      head={[...core.map((_, i) => ["1", "3", "5", "7"][i]), ...ALT_HEAD]}
      rows={rows.map(([alt, ext]) => ({ label: alt, cells: [...core, ...ALT_HEAD.map((h) => ext[h] ?? null)], strong: ALT_HEAD.map((h, i) => (ext[h] && ext[h] === alt ? i + 4 : -1)).filter((i) => i >= 0) }))}
    />
  );
}

function KeyGrid({ exercise }: { exercise?: boolean }) {
  const [reveal, setReveal] = useState(!exercise);
  const keys = ["C", "G", "D", "A", "E", "B", "F", "Bb", "Eb", "Ab", "Db", "Gb", "C#", "G#", "D#", "A#", "F#"];
  const given = new Set(["C", "Eb", "A#"]);
  return (
    <div className="space-y-3">
      <MatrixTable
        caption="Major scales in every key"
        corner="Key"
        head={["1", "2", "3", "4", "5", "6", "7", "8"]}
        subHead={["T", "T", "S", "T", "T", "T", "S", ""]}
        rootColumn
        rows={keys.map((k) => {
          const notes = scale(k, "1 2 3 4 5 6 7").map((n) => n.name);
          const show = reveal || given.has(k);
          const theoretical = notes.some((n) => /𝄪|♯♯/.test(n));
          return { label: noteName(parseNote(k)), sub: theoretical ? "theoretical key" : undefined, cells: show ? [...notes, notes[0]] : [notes[0], ...Array(7).fill(null)] };
        })}
      />
      {exercise && <Button variant="outline" size="sm" onClick={() => setReveal((r) => !r)}>{titleCaseLabel(<>{reveal ? "Hide answers" : "Reveal every scale"}</>)}</Button>}
    </div>
  );
}

function ChromaticIntervalTable() {
  const rows: [string, string, string, string, number, string][] = [
    ["Perfect unison", "P1", "Diminished 2nd", "d2", 0, "C to C"], ["minor 2nd", "m2", "Augmented unison", "A1", 1, "C to C♯"], ["Major 2nd", "M2", "Diminished 3rd", "d3", 2, "C to D"],
    ["minor 3rd", "m3", "Augmented 2nd", "A2", 3, "C to D♯"], ["Major 3rd", "M3", "Diminished 4th", "d4", 4, "C to E"], ["Perfect 4th", "P4", "Augmented 3rd", "A3", 5, "C to F"],
    ["—", "", "Diminished 5th (tritone)", "d5", 6, "C to G♭"], ["—", "", "Augmented 4th (tritone)", "A4", 6, "C to F♯"], ["Perfect 5th", "P5", "Diminished 6th", "d6", 7, "C to G"],
    ["minor 6th", "m6", "Augmented 5th", "A5", 8, "C to G♯"], ["Major 6th", "M6", "Diminished 7th", "d7", 9, "C to A"], ["minor 7th", "m7", "Augmented 6th", "A6", 10, "C to A♯"],
    ["Major 7th", "M7", "Diminished octave", "d8", 11, "C to B"], ["Perfect octave", "P8", "Augmented 7th", "A7", 12, "C to C"],
  ];
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">Chromatic intervals: every major, minor and perfect interval with its enharmonic augmented or diminished name</caption>
        <thead className="bg-muted/70 text-left text-xs"><tr><th className="px-3 py-2">{titleCaseLabel(<>Major, minor & perfect</>)}</th><th>{titleCaseLabel(<>Abbr.</>)}</th><th>{titleCaseLabel(<>Enharmonic aug./dim. name</>)}</th><th>{titleCaseLabel(<>Abbr.</>)}</th><th className="w-[30%]">{titleCaseLabel(<>Distance</>)}</th><th>{titleCaseLabel(<>Example (aug./dim. column)</>)}</th></tr></thead>
        <tbody>
          {rows.map(([a, ab, d, db, semis, ex], i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-1.5 font-medium">{a}</td><td className="font-mono">{ab}</td><td>{d}</td><td className="font-mono">{db}</td>
              <td className="pr-3"><span className="flex items-center gap-2"><span className="bg-series-1 h-2.5 rounded-sm" style={{ width: `${(semis / 12) * 100}%`, minWidth: 2 }} aria-hidden /><span className="text-xs whitespace-nowrap">{semis} st</span></span></td>
              <td className="text-xs">{ex}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PENT_NAMES = ["Minor pentatonic mode 1", "Mode 2 · major pentatonic", "Minor pentatonic mode 3", "Minor pentatonic mode 4", "Minor pentatonic mode 5"];
const MAJOR_MODES = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];
const HARMONIC_MODES = ["Harmonic minor (Aeolian ♮7)", "Locrian ♮6", "Ionian ♯5", "Dorian ♯4", "Phrygian dominant", "Lydian ♯2", "Ultra Locrian (altered 𝄫7)"];
const MELODIC_MODES = ["Melodic minor (Dorian ♮7)", "Dorian ♭2", "Lydian augmented", "Lydian dominant", "Mixolydian ♭6", "Locrian ♮2", "Altered (super Locrian)"];
const fromRot = (root: string, f: string, names: string[]) => rotations(root, f, names).map((r) => ({ name: r.name, formula: r.formula }));

const TRIADS = [["Major", "1 3 5"], ["Minor", "1 b3 5"], ["Augmented", "1 3 #5"], ["Diminished", "1 b3 b5"], ["Suspended 2nd", "1 2 5"], ["Suspended 4th", "1 4 5"], ["Sus2 ♯5", "1 2 #5"], ["Sus2 ♭5", "1 2 b5"], ["Sus4 ♯5", "1 4 #5"], ["Sus4 ♭5", "1 4 b5"]].map(([name, formula]) => ({ name, formula }));
const SEVENTHS = [["Major 7", "1 3 5 7"], ["Dominant 7", "1 3 5 b7"], ["minor 7", "1 b3 5 b7"], ["minor 7♭5", "1 b3 b5 b7"], ["diminished 7", "1 b3 b5 bb7"], ["Major 6", "1 3 5 6"], ["minor 6", "1 b3 5 6"]].map(([name, formula]) => ({ name, formula }));

function TriadsOfC({ chords }: { chords?: boolean }) {
  const c = scale("C", "1 2 3 4 5 6 7");
  const names = ["C major", "D minor", "E minor", "F major", "G major", "A minor", "B diminished"];
  return (
    <MatrixTable caption="Triads built on each C-major degree" corner="Scale degree" head={chords ? ["R", "3", "5", "Chord"] : ["R", "3", "5"]} rootColumn={false}
      rows={c.map((_, i) => ({ label: String(i + 1), cells: [c[i].name, c[(i + 2) % 7].name, c[(i + 4) % 7].name, ...(chords ? [names[i]] : [])] }))} />
  );
}

function SlashFigure() {
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
      <ChordStack kind="slash" upper="Cmaj7" lower="G" />
      <PianoDiagram start={5} length={19} marks={{ 7: { name: "G", sub: "bass" }, 12: { name: "C", sub: "R", root: true }, 16: { name: "E", sub: "3" }, 19: { name: "G", sub: "5" }, 23: { name: "B", sub: "7" } }} title="Cmaj7 over G: G in the bass, then C E G B" />
    </div>
  );
}
function PolyFigure({ upper, lower, low, high }: { upper: string; lower: string; low: Record<number, PianoMark>; high: Record<number, PianoMark> }) {
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
      <ChordStack kind="poly" upper={upper} lower={lower} />
      <PianoDiagram start={0} length={35} marks={{ ...low, ...Object.fromEntries(Object.entries(high).map(([k, v]) => [k, { ...v, root: false }])) }} title={`${upper} layered above ${lower}`} />
    </div>
  );
}

export const THEORY_VISUALS: Record<string, () => React.ReactNode> = {
  "p15-1": () => <PianoDiagram start={9} length={12} keyNames={(k) => NAMES[k % 12]} title="One octave of keys from A: white keys A B C D E F G, black keys with both sharp and flat names" />,
  "p16-1": () => <PitchCircle />,
  "p18-1": () => <PianoRange />,
  "p20-1": () => <TuningPanel />,
  "p26-1": () => <ChromaticIntervalTable />,
  "p36-1": () => <ScaleKeys root="A" formula="1 b3 4 5 b7" title="A minor pentatonic: A C D E G A, steps TS T T TS T" />,
  "p38-1": () => <ScaleKeys root="C" formula="1 2 3 5 6" title="C major pentatonic: C D E G A C, steps T T TS T TS" />,
  "p44-1": () => <ModeMatrix caption="The five modes of the A minor pentatonic collection" rows={rotations("A", "1 b3 4 5 b7", PENT_NAMES).map((r) => ({ ...r, sub: undefined }))} />,
  "p45-1": () => <FormulaRows caption="Pentatonic modes as intervals and degrees" rows={formulaRows(fromRot("A", "1 b3 4 5 b7", PENT_NAMES))} />,
  "p49-1": () => <ScaleKeys root="C" formula="1 2 3 4 5 6 7" title="Major-scale pattern T T S T T T S, shown on C" />,
  "p49-2": () => <OneStringNeck frets={[0, 2, 4, 5, 7, 9, 11, 12]} labels={["R", "M2", "M3", "P4", "P5", "M6", "M7", "R"]} title="E major on the low E string: frets 0 2 4 5 7 9 11 12" />,
  "p50-1": () => <ScaleKeys root="A" formula="1 2 3 4 5 6 7" title="A major on the keyboard: A B C♯ D E F♯ G♯ A" />,
  "p51-1": () => <DegreeStrip caption="C major degrees; the 6th degree A is the relative minor's tonic" rows={[["C", "D", "E", "F", "G", "A", "B"], ["1", "2", "3", "4", "5", "6", "7"]]} highlight={[5]} />,
  "p52-1": () => <OneStringNeck frets={[0, 2, 3, 5, 7, 8, 10, 12]} labels={["R", "M2", "m3", "P4", "P5", "m6", "m7", "R"]} title="E natural minor on the low E string: frets 0 2 3 5 7 8 10 12" />,
  "p53-1": () => <ScaleKeys root="A" formula="1 2 b3 4 5 b6 b7" title="A natural minor: A B C D E F G A, steps T S T T S T T" />,
  "p56-1": () => <KeyGrid exercise />,
  "p66-1": () => <ModeMatrix caption="The seven modes of C major" rows={rotations("C", "1 2 3 4 5 6 7", MAJOR_MODES)} />,
  "p67-1": () => <FormulaRows caption="Major modes as intervals and degrees" rows={formulaRows(fromRot("C", "1 2 3 4 5 6 7", MAJOR_MODES))} />,
  "p73-1": () => <ScaleKeys root="A" formula="1 2 b3 4 5 b6 7" title="A harmonic minor: A B C D E F G♯ A, steps T S T T S TS S" />,
  "p79-1": () => <ModeMatrix caption="The seven modes of A harmonic minor" rows={rotations("A", "1 2 b3 4 5 b6 7", HARMONIC_MODES)} />,
  "p80-1": () => <FormulaRows caption="Harmonic-minor modes as intervals and degrees" rows={formulaRows(fromRot("A", "1 2 b3 4 5 b6 7", HARMONIC_MODES))} />,
  "p82-1": () => <ScaleKeys root="A" formula="1 2 b3 4 5 6 7" title="A melodic minor: A B C D E F♯ G♯ A, steps T S T T T T S" />,
  "p87-1": () => <ModeMatrix caption="The seven modes of A melodic minor" rows={rotations("A", "1 2 b3 4 5 6 7", MELODIC_MODES)} />,
  "p88-1": () => <FormulaRows caption="Melodic-minor modes as intervals and degrees" rows={formulaRows(fromRot("A", "1 2 b3 4 5 6 7", MELODIC_MODES))} />,
  "p89-1": () => <ModeMatrix caption="Seven scales compared on one chromatic grid" rows={[
    { name: "Chromatic", root: "C", formula: "1 b2 2 b3 3 4 #4 5 b6 6 b7 7" }, { name: "Natural major", root: "C", formula: "1 2 3 4 5 6 7" }, { name: "Major pentatonic", root: "C", formula: "1 2 3 5 6" },
    { name: "Natural minor", sub: "6th mode of major", root: "A", formula: "1 2 b3 4 5 b6 b7" }, { name: "Minor pentatonic", root: "A", formula: "1 b3 4 5 b7" }, { name: "Harmonic minor", root: "A", formula: "1 2 b3 4 5 b6 7" }, { name: "Melodic minor", root: "A", formula: "1 2 b3 4 5 6 7" },
  ]} />,
  "p89-2": () => (
    <div className="grid gap-4 lg:grid-cols-2">
      {[["Major", "1 2 3 4 5 6 7"], ["Natural minor", "1 2 b3 4 5 b6 b7"], ["Harmonic minor", "1 2 b3 4 5 b6 7"], ["Melodic minor", "1 2 b3 4 5 6 7"], ["Minor pentatonic", "1 b3 4 5 b7"], ["Major pentatonic", "1 2 3 5 6"]].map(([name, f]) => (
        <div key={name} className="rounded-xl border p-3"><p className="mb-1 text-sm font-semibold">{name}</p><IntervalRuler formula={f.split(" ")} steps="TS" /></div>
      ))}
    </div>
  ),
  "p93-1": () => <SignatureCircle />,
  "p95-1": () => <DegreeStrip caption="Stacking thirds in C: degrees 1, 3, 5 and 7" rows={[["C", "D", "E", "F", "G", "A", "B"], ["1", "2", "3", "4", "5", "6", "7"]]} highlight={[0, 2, 4, 6]} />,
  "p101-1": () => <ChordFormulaTable caption="Triad formulas spelled from C" rows={TRIADS} />,
  "p102-1": () => <ChordIntervalMatrix caption="Triad interval structures" rows={TRIADS} />,
  "p105-1": () => <ChordFormulaTable caption="Four-note chord formulas spelled from C" rows={SEVENTHS} />,
  "p105-2": () => <ChordIntervalMatrix caption="Four-note chord interval structures" rows={SEVENTHS} />,
  "p107-1": () => <DegreeStrip caption="Degree numbers repeat each octave" rows={[["1", "2", "3", "4", "5", "6", "7", "1", "2", "3", "4", "5", "6", "7"]]} />,
  "p108-1": () => <DegreeStrip caption="Counting past the octave: chord extensions are the odd numbers 9, 11 and 13" rows={[["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"]]} highlight={[0, 2, 4, 6, 8, 10, 12]} />,
  "p111-1": () => <ExtendedMatrix />,
  "p117-1": () => <AlteredMatrix family="Major" core={["R", "M3", "P5", "M7"]} rows={[["♭9", { m9: "♭9" }], ["♯9", { m10: "♯9" }], ["♯11", { M9: "M9", A11: "♯11" }], ["♭13", { M9: "M9", P11: "P11", m13: "♭13" }], ["♯13", { M9: "M9", P11: "P11", m14: "♯13" }]]} />,
  "p118-1": () => <AlteredMatrix family="Minor" core={["R", "m3", "P5", "m7"]} rows={[["♭9", { m9: "♭9" }], ["♭11", { M10: "♭11" }], ["♯11", { M9: "M9", A11: "♯11" }], ["♭13", { M9: "M9", P11: "P11", m13: "♭13" }]]} />,
  "p120-1": () => <AlteredMatrix family="Dominant" core={["R", "M3", "P5", "m7"]} rows={[["♭9", { m9: "♭9" }], ["♯9", { m10: "♯9" }], ["♯11", { M9: "M9", A11: "♯11" }], ["♭13", { M9: "M9", P11: "P11", m13: "♭13" }]]} />,
  "p123-1": () => <DegreeStrip caption="C7 shell: C E B♭" rows={[["C", "E", "B♭"], ["R", "3", "♭7"]]} />,
  "p123-2": () => <DegreeStrip caption="C7 with altered tensions" rows={[["C", "D♭", "D♯", "E", "G♭", "G♯", "B♭"], ["R", "♭9", "♯9", "3", "♭5", "♯5", "♭7"]]} highlight={[1, 2, 4, 5]} />,
  "p123-3": () => <DegreeStrip caption="The C altered collection as a seven-letter scale: C D♭ E♭ F♭ G♭ A♭ B♭ (E♭ sounds the ♯9, F♭ the 3rd)" rows={[["C", "D♭", "E♭", "F♭", "G♭", "A♭", "B♭"], ["R", "♭9", "♯9", "3", "♭5", "♯5", "♭7"]]} highlight={[1]} />,
  "p124-1": () => <DegreeStrip caption="C Mixolydian contains C7 (C E B♭ plus G)" rows={[["C", "D", "E", "F", "G", "A", "B♭"], ["1", "2", "3", "4", "5", "6", "♭7"]]} highlight={[0, 2, 6]} />,
  "p125-1": () => <DegreeStrip caption="Stacking fourths from C through two octaves of C major: C F B E" rows={[["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C"], Array.from({ length: 15 }, (_, i) => String(i + 1))]} highlight={[0, 3, 6, 9]} />,
  "p126-1": () => <DegreeStrip caption="C major through the thirteenth" rows={[Array.from({ length: 13 }, (_, i) => String(i + 1)), ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A"]]} highlight={[0, 2, 4, 6, 8, 10, 12]} />,
  "p126-2": () => <TriadsOfC />,
  "p127-1": () => <DegreeStrip caption="D major" rows={[scale("D", "1 2 3 4 5 6 7").map((n, i) => `${n.name} (${i + 1})`).concat("D (8)")]} />,
  "p128-1": () => <DegreeStrip caption="B major" rows={[scale("B", "1 2 3 4 5 6 7").map((n) => n.name)]} />,
  "p128-2": () => <TriadsOfC chords />,
  "p129-1": () => <QualityStrip caption="Major-key triads" items={["I", "ii", "iii", "IV", "V", "vi", "vii°"].map((numeral, i) => ({ numeral, quality: ["Maj", "min", "min", "Maj", "Maj", "min", "dim"][i], chord: ["C", "Dm", "Em", "F", "G", "Am", "B°"][i] }))} />,
  "p130-1": () => <QualityStrip caption="Major-key seventh chords" items={["I", "ii", "iii", "IV", "V", "vi", "vii"].map((numeral, i) => ({ numeral, quality: ["Maj7", "min7", "min7", "Maj7", "(Dom)7", "min7", "min7♭5"][i], chord: ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bø7"][i] }))} />,
  "p131-1": () => <QualityStrip caption="Natural-minor triads" items={["i", "ii°", "III", "iv", "v", "VI", "VII"].map((numeral, i) => ({ numeral, quality: ["min", "dim", "Maj", "min", "min", "Maj", "Maj"][i], chord: ["Am", "B°", "C", "Dm", "Em", "F", "G"][i] }))} />,
  "p131-2": () => <QualityStrip caption="Natural-minor seventh chords" items={["i", "ii", "III", "iv", "v", "VI", "VII"].map((numeral, i) => ({ numeral, quality: ["min7", "min7♭5", "Maj7", "min7", "min7", "Maj7", "(Dom)7"][i], chord: ["Am7", "Bø7", "Cmaj7", "Dm7", "Em7", "Fmaj7", "G7"][i] }))} />,
  "p137-1": () => <SlashFigure />,
  "p140-1": () => <PolyFigure upper="Gmaj7" lower="Am" low={{ 9: { name: "A", sub: "R", root: true }, 12: { name: "C", sub: "m3" }, 16: { name: "E", sub: "P5" } }} high={{ 19: { name: "G", sub: "m7" }, 23: { name: "B", sub: "9" }, 26: { name: "D", sub: "11" }, 30: { name: "F♯", sub: "13" } }} />,
  "p141-1": () => <BraceGroups groups={[{ label: "Am", notes: ["A (R)", "C (m3)", "E (P5)"] }, { label: "Gmaj7", notes: ["G (m7)", "B (M9)", "D (P11)", "F♯ (M13)"] }]} />,
  "p141-2": () => <PolyFigure upper="G" lower="Dm" low={{ 2: { name: "D", sub: "R", root: true }, 5: { name: "F", sub: "m3" }, 9: { name: "A", sub: "P5" } }} high={{ 19: { name: "G", sub: "11" }, 23: { name: "B", sub: "13" }, 26: { name: "D", sub: "R" } }} />,
  "p153-1": () => <RhythmCount time={[4, 4]} beats={4} syllables={[]} callout="Four beats in each bar of 4/4" />,
  "p153-2": () => <RhythmCount time={[4, 4]} beats={4} syllables={["and"]} highlight="offbeats" callout="Beats on the numbers; off-beats on each “and” (+)" />,
  "p154-1": () => <RhythmCount time={[4, 4]} beats={4} syllables={["e", "+", "a"]} callout="Sixteenths: 1 e + a, four syllables per beat" />,
  "p156-1": () => <RhythmCount time={[6, 8]} beats={6} syllables={[]} beatUnit="eighth notes, felt in two groups of three" callout="Six eighth-note units per bar of 6/8" bpm={150} />,
  "p218-1": () => <KeyGrid />,
};

/* The five notation images from the original personal notes. */
const tab = (str: number, fret: number) => [{ str, fret }];
export const NOTE_VISUALS: Record<string, () => React.ReactNode> = {
  "c-major-scale-tab": () => (
    <Notation title="C major scale, one octave in notation and tab: C D E F G A B C from the A string, 3rd fret" time="4/4" withTab measures={[
      [{ keys: ["c/4"], label: "C", tab: tab(5, 3) }, { keys: ["d/4"], label: "D", tab: tab(4, 0) }, { keys: ["e/4"], label: "E", tab: tab(4, 2) }, { keys: ["f/4"], label: "F", tab: tab(4, 3) }],
      [{ keys: ["g/4"], label: "G", tab: tab(3, 0) }, { keys: ["a/4"], label: "A", tab: tab(3, 2) }, { keys: ["b/4"], label: "B", tab: tab(2, 0) }, { keys: ["c/5"], label: "C", tab: tab(2, 1) }],
    ]} />
  ),
  "c-major-intervals-tab": () => (
    <Notation title="C major intervals: each scale note answered by the root C, in notation and tab" time="4/4" withTab beam noteWidth={40} measures={[
      [{ keys: ["c/4"], label: "Root", tab: tab(5, 3) }, { keys: ["d/4"], duration: "8", label: "M2", tab: tab(4, 0) }, { keys: ["c/4"], duration: "8", tab: tab(5, 3) }, { keys: ["e/4"], duration: "8", label: "M3", tab: tab(4, 2) }, { keys: ["c/4"], duration: "8", tab: tab(5, 3) }, { keys: ["f/4"], duration: "8", label: "P4", tab: tab(4, 3) }, { keys: ["c/4"], duration: "8", tab: tab(5, 3) }],
      [{ keys: ["g/4"], duration: "8", label: "P5", tab: tab(3, 0) }, { keys: ["c/4"], duration: "8", tab: tab(5, 3) }, { keys: ["a/4"], duration: "8", label: "M6", tab: tab(3, 2) }, { keys: ["c/4"], duration: "8", tab: tab(5, 3) }, { keys: ["b/4"], duration: "8", label: "M7", tab: tab(2, 0) }, { keys: ["c/4"], duration: "8", tab: tab(5, 3) }, { keys: ["c/5"], label: "Octave", tab: tab(2, 1) }],
    ]} />
  ),
  "augmented-diminished": () => (
    <div className="space-y-2">
      <Notation title="Fifth F to C: augmented F–C♯, perfect F–C, diminished F–C♭" noteWidth={90} measures={[[{ keys: ["f/4", "c#/5"], duration: "w", label: "Augmented" }], [{ keys: ["f/4", "c/5"], duration: "w", label: "Perfect" }], [{ keys: ["f/4", "cb/5"], duration: "w", label: "Diminished" }]]} />
      <Notation title="Sixth G to E: augmented G–E♯, major G–E, minor G–E♭, diminished G–E𝄫" noteWidth={70} measures={[[{ keys: ["g/4", "e#/5"], duration: "w", label: "Augmented" }], [{ keys: ["g/4", "e/5"], duration: "w", label: "Major" }], [{ keys: ["g/4", "eb/5"], duration: "w", label: "Minor" }], [{ keys: ["g/4", "ebb/5"], duration: "w", label: "Diminished" }]]} />
    </div>
  ),
  "chromatic-ascending": () => {
    const names = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B", "C"];
    const keys = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c"];
    return <Notation title="Ascending chromatic scale from C, written with sharps, treble and bass clef" noteWidth={36} measures={[keys.map((k, i) => ({ keys: [`${k}/${i === 12 ? 5 : 4}`], label: names[i] }))]} bass={[keys.map((k, i) => ({ keys: [`${k}/${i === 12 ? 4 : 3}`] }))]} />;
  },
  "chromatic-descending": () => {
    const names = ["C", "B", "B♭", "A", "A♭", "G", "G♭", "F", "E", "E♭", "D", "D♭", "C"];
    const keys = ["c", "b", "bb", "a", "ab", "g", "gb", "f", "e", "eb", "d", "db", "c"];
    return <Notation title="Descending chromatic scale from C, written with flats, treble and bass clef" noteWidth={36} measures={[keys.map((k, i) => ({ keys: [`${k}/${i === 0 ? 5 : 4}`], label: names[i] }))]} bass={[keys.map((k, i) => ({ keys: [`${k}/${i === 0 ? 4 : 3}`] }))]} />;
  },
};

export function TheoryVisual({ id, className }: { id: string; className?: string }) {
  const sheet = id.startsWith("sheet-") ? FRET_SHEETS.find((s) => s.page === Number(id.slice(6))) : undefined;
  if (id.startsWith("harmony-")) {
    const page = Number(id.slice(8));
    const s = FRET_SHEETS.find((x) => x.page === page);
    return s ? <div className={cn("min-w-0", className)}><SheetHarmony page={page} formula={s.groups[0].formula} rootPc={9} /></div> : null;
  }
  if (sheet) return <div className={cn("min-w-0", className)}><FretSheetView sheet={sheet} /></div>;
  const render = THEORY_VISUALS[id] ?? NOTE_VISUALS[id] ?? CHART_VISUALS[id] ?? RAGA_VISUALS[id];
  if (!render) return null;
  return <div className={cn("min-w-0", className)}>{render()}</div>;
}
