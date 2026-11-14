"use client";

import { useState } from "react";
import type { WidgetName } from "@/lib/content/types";
import { CIRCLE, KEY_CHARACTERS, keySignature, relativeMinor } from "@/lib/music/keys";
import { MODE_FAMILIES } from "@/lib/music/modes";
import { SCALE_SIZES } from "@/lib/music/scales";
import {
  buildScale,
  degreeSemitones,
  degreeText,
  harmonize,
  intervalLong,
  intervalShort,
  invertDegree,
  modeDegrees,
  noteFromLetter,
  noteName,
  parseDegree,
  parseNote,
  pc,
  spellDegree,
  spellRoot,
  type FretNote,
} from "@/lib/music/theory";
import { cn } from "@/lib/utils";
import { Segmented } from "@/components/ui/segmented";
import { SimpleTable, TableWrap, tableCls, tdCls, thCls } from "@/components/ui/table";
import { Fretboard } from "@/components/music/fretboard";
import { Keyboard, type KeyMark } from "@/components/music/keyboard";
import { NoteCircle } from "@/components/music/note-circle";
import { RootPicker } from "@/components/music/controls";

/* Interactive diagrams embedded in the notes, keyed by WidgetName. */

export function Widget({ name }: { name: WidgetName }) {
  const Component = WIDGETS[name];
  return (
    <div className="max-w-[920px] rounded-2xl bg-background/60 p-4 ring-1 ring-border sm:p-5 dark:bg-background/40">
      <Component />
    </div>
  );
}

const MAJOR = ["1", "2", "3", "4", "5", "6", "7"].map(parseDegree);
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-caption text-muted-foreground">{children}</p>;
}

/* ---------------------------------------------------------------- notes */

function NoteCircleWidget() {
  const [view, setView] = useState<"all" | "major">("all");
  return (
    <div className="flex flex-col items-center gap-3">
      <Segmented
        label="Show"
        size="sm"
        value={view}
        onChange={setView}
        options={[
          { value: "all", label: "All 12 notes" },
          { value: "major", label: "C major inside it" },
        ]}
      />
      <NoteCircle
        pcs={view === "major" ? [0, 2, 4, 5, 7, 9, 11] : undefined}
        rootPc={view === "major" ? 0 : undefined}
        title={view === "major" ? "C major's seven notes joined on the note circle" : "The 12 notes on a circle"}
      />
      <Caption>
        {view === "major"
          ? "A 7-note scale picks 7 of the 12 notes; joined up they form the scale's shape."
          : "Moving one step around the circle is one half step; twelve steps returns to the same note an octave up."}
      </Caption>
    </div>
  );
}

const SHARP_NAMES = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];

function KeyboardEnharmonics() {
  return (
    <>
      <Keyboard
        length={12}
        title="One octave of piano keys, with both names on each black key"
        keyNames={(k) => {
          const name = SHARP_NAMES[k % 12];
          if (k % 12 === 4) return "E (F♭)";
          if (k % 12 === 11) return "B (C♭)";
          return name;
        }}
        minWidth={360}
      />
      <Caption>White keys are the natural notes; each black key has a sharp name and a flat name.</Caption>
    </>
  );
}

function KeyboardOctaves() {
  return (
    <>
      <Keyboard
        start={9}
        length={87}
        size="sm"
        title="Full 88-key piano from A0 to C8 with every C labelled"
        keyNames={(k) => (k % 12 === 0 ? `C${k / 12}` : undefined)}
        marks={{ 48: { label: "" }, 57: { label: "" } }}
        minWidth={680}
      />
      <Caption>88 keys, A0 to C8. Shaded: C4 (middle C) and A4 (440 Hz). Each C starts a new octave register.</Caption>
    </>
  );
}

/* ---------------------------------------------------------------- rhythm */

const MUSIC_FONT = { fontFamily: '"Segoe UI Symbol", "Noto Music", "Apple Symbols", serif' };
const DURATIONS = [
  { name: "Whole", note: "𝅝", rest: "𝄻", beats: 4, label: "4" },
  { name: "Dotted half", note: "𝅗𝅥.", rest: "", beats: 3, label: "3" },
  { name: "Half", note: "𝅗𝅥", rest: "𝄼", beats: 2, label: "2" },
  { name: "Dotted quarter", note: "♩.", rest: "", beats: 1.5, label: "1½" },
  { name: "Quarter", note: "♩", rest: "𝄽", beats: 1, label: "1" },
  { name: "Eighth", note: "♪", rest: "𝄾", beats: 0.5, label: "½" },
  { name: "Sixteenth", note: "𝅘𝅥𝅯", rest: "𝄿", beats: 0.25, label: "¼" },
];

function NoteDurations() {
  return (
    <TableWrap>
      <table className={tableCls}>
        <thead>
          <tr>
            <th className={thCls}>Note</th>
            <th className={thCls}>Rest</th>
            <th className={thCls}>Name</th>
            <th className={thCls}>Beats in 4/4</th>
            <th className={cn(thCls, "w-[40%]")}>Share of a 4/4 bar</th>
          </tr>
        </thead>
        <tbody>
          {DURATIONS.map((d) => (
            <tr key={d.name}>
              <td className={cn(tdCls, "text-[26px] leading-none")} style={MUSIC_FONT}>
                {d.note}
              </td>
              <td className={cn(tdCls, "text-[26px] leading-none")} style={MUSIC_FONT}>
                {d.rest || <span className="text-caption text-muted-foreground">—</span>}
              </td>
              <td className={cn(tdCls, "font-medium")}>{d.name}</td>
              <td className={cn(tdCls, "tabular-nums")}>{d.label}</td>
              <td className={tdCls}>
                <div className="flex h-3 gap-0.5" aria-hidden>
                  {[0, 1, 2, 3].map((beat) => (
                    <div key={beat} className="relative flex-1 overflow-hidden rounded-sm bg-fog/50 dark:bg-iron">
                      <div
                        className="absolute inset-y-0 left-0 bg-foreground"
                        style={{ width: `${Math.max(0, Math.min(1, d.beats - beat)) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

/* ---------------------------------------------------------------- steps & intervals */

const STEP_VIEWS: Record<string, { marks: Record<number, KeyMark>; caption: string }> = {
  half: {
    marks: {
      4: { label: "E", caption: "E" },
      5: { label: "F", caption: "F" },
      11: { label: "B", caption: "B" },
      12: { label: "C", caption: "C" },
    },
    caption: "Half steps: neighbouring keys with nothing between. E–F and B–C are the two white-key half steps.",
  },
  whole: {
    marks: {
      0: { label: "C", caption: "C" },
      2: { label: "D", caption: "D" },
      4: { label: "E", caption: "E" },
      6: { label: "F♯", caption: "F♯" },
    },
    caption: "Whole steps: one key between. C–D, and E–F♯ (E–F–F♯).",
  },
  "whole-tone": {
    marks: Object.fromEntries(
      ["C", "D", "E", "F♯", "G♯", "A♯", "C"].map((n, i) => [i * 2, { label: n, caption: n, root: i === 0 || i === 6 }]),
    ),
    caption: "The whole-tone scale from C: six whole steps, six notes, and one letter (B) never appears.",
  },
};

function StepKeyboards() {
  const [view, setView] = useState("half");
  const current = STEP_VIEWS[view];
  return (
    <>
      <Segmented
        label="Show"
        size="sm"
        value={view}
        onChange={setView}
        options={[
          { value: "half", label: "Half steps" },
          { value: "whole", label: "Whole steps" },
          { value: "whole-tone", label: "Whole-tone scale" },
        ]}
        className="mb-4"
      />
      <Keyboard length={12} marks={current.marks} title={current.caption} minWidth={360} />
      <Caption>{current.caption}</Caption>
    </>
  );
}

const INTERVAL_DEGREES = ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7", "8"].map(parseDegree);
const DIATONIC = new Set([0, 2, 4, 5, 7, 9, 11, 12]);

function IntervalTable() {
  const [rootPc, setRootPc] = useState(0);
  const root = spellRoot(rootPc, INTERVAL_DEGREES.slice(0, 12));
  return (
    <>
      <RootPicker value={rootPc} onChange={setRootPc} label="Root" className="mb-4" />
      <TableWrap>
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>Semitones</th>
              <th className={thCls}>Interval above {noteName(root)}</th>
              <th className={thCls}>Note</th>
              <th className={thCls}>Below (inversion)</th>
              <th className={thCls}>Diatonic</th>
            </tr>
          </thead>
          <tbody>
            {INTERVAL_DEGREES.map((degree) => {
              const semis = degreeSemitones(degree);
              const note = noteName(spellDegree(root, degree));
              const tritone = semis === 6;
              const name =
                semis === 0
                  ? "Perfect unison"
                  : semis === 12
                    ? "Perfect octave"
                    : tritone
                      ? "Augmented 4th (tritone)"
                      : intervalLong(degree);
              const short = semis === 0 ? "P1" : semis === 12 ? "P8" : intervalShort(degree);
              const inverted = semis === 0 || semis === 12 ? (semis === 0 ? "Perfect octave" : "Perfect unison") : tritone ? "Tritone" : intervalLong(invertDegree(degree));
              return (
                <tr key={semis}>
                  <td className={cn(tdCls, "tabular-nums")}>{semis}</td>
                  <td className={tdCls}>
                    <span className="font-medium">{name}</span>
                    <span className="ml-2 text-muted-foreground">{short}</span>
                  </td>
                  <td className={cn(tdCls, "font-medium")}>
                    {note}
                    {tritone && <span className="text-muted-foreground"> / {noteName(spellDegree(root, parseDegree("b5")))}</span>}
                  </td>
                  <td className={cn(tdCls, "text-muted-foreground")}>{inverted}</td>
                  <td className={tdCls}>
                    {DIATONIC.has(semis) ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span aria-hidden className="size-1.5 rounded-full bg-ember" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>
      <Caption>One semitone is one fret on the guitar, so the semitone count is also the fret distance on one string.</Caption>
    </>
  );
}

/* C major, one octave from the A string, 3rd fret (the notes' tab example). */
const C_MAJOR_TAB: FretNote[] = [
  { string: 1, fret: 3, index: 0 },
  { string: 2, fret: 0, index: 1 },
  { string: 2, fret: 2, index: 2 },
  { string: 2, fret: 3, index: 3 },
  { string: 3, fret: 0, index: 4 },
  { string: 3, fret: 2, index: 5 },
  { string: 4, fret: 0, index: 6 },
  { string: 4, fret: 1, index: 7 },
];
const C_MAJOR_STEPS = [
  ["C → D", "Major 2nd", "2 frets"],
  ["C → E", "Major 3rd", "4 frets"],
  ["C → F", "Perfect 4th", "5 frets"],
  ["C → G", "Perfect 5th", "7 frets"],
  ["C → A", "Major 6th", "9 frets"],
  ["C → B", "Major 7th", "11 frets"],
];

function IntervalOnGuitar() {
  const labels = ["R", "M2", "M3", "P4", "P5", "M6", "M7", "P8"];
  return (
    <>
      <SimpleTable columns={["From the root", "Interval", "Distance on one string"]} rows={C_MAJOR_STEPS} />
      <div className="mt-5">
        <Fretboard
          notes={C_MAJOR_TAB}
          frets={5}
          label={(i) => labels[i]}
          rootIndex={0}
          title="C major scale, one octave from the A string 3rd fret, labelled by interval"
        />
      </div>
      <Caption>The same scale in open position (A string 3rd fret up to the B string 1st fret), labelled by interval.</Caption>
    </>
  );
}

/* ---------------------------------------------------------------- scales */

function DoubleNote() {
  const scale = buildScale(parseNote("A"), MAJOR);
  const semis = scale.map((s) => s.semis);
  const notes: FretNote[] = [];
  [40, 45, 50, 55, 59, 64].forEach((open, string) => {
    for (let fret = 2; fret <= 7; fret++) {
      const index = semis.indexOf((((open + fret - 9) % 12) + 12) % 12);
      if (index >= 0) notes.push({ string, fret, index });
    }
  });
  return (
    <>
      <Fretboard
        notes={notes}
        frets={8}
        label={(i) => (i === 0 ? "R" : String(i + 1))}
        title="A major scale between frets 2 and 7, labelled by degree"
      />
      <Caption>
        A major, frets 2–7. At fret 2 the 3 on the B string sits beside the 6 on the high e. Every pair of neighbouring strings tuned a 4th apart (all except G–B) pairs degrees the same way at the same fret: 3 with 6, 7 with 3, R with 4, 2 with 5.
      </Caption>
    </>
  );
}

function ScaleSizes() {
  return <SimpleTable columns={["Name", "Notes per octave", "Where you'll find it"]} rows={SCALE_SIZES.map((s) => [s.name, s.notes, s.text])} />;
}

/* ---------------------------------------------------------------- chords & degrees */

const DEGREE_INFO = [
  ["Tonic", "The first degree and the tonal centre: the final resolution tone."],
  ["Supertonic", "One step above the tonic."],
  ["Mediant", "Halfway between the tonic and the dominant."],
  ["Subdominant", "The fourth degree: the \"lower dominant\"."],
  ["Dominant", "Second in importance after the tonic, hence \"dominant\"."],
  ["Submediant", "The \"lower mediant\": halfway between the tonic and the subdominant below it."],
  ["Leading tone", "Resolves or \"leads\" a semitone up to the tonic. Also called the subsemitone (leading note in the UK)."],
];

function ScaleDegrees() {
  const [rootPc, setRootPc] = useState(0);
  const scale = buildScale(spellRoot(rootPc, MAJOR), MAJOR);
  const chords = harmonize(scale);
  return (
    <>
      <RootPicker value={rootPc} onChange={setRootPc} label="Major key" className="mb-4" />
      <SimpleTable
        columns={["Degree", "Name", "Note", "Chord", "Seventh", "What it is"]}
        rows={[
          ...DEGREE_INFO.map(([name, text], i) => [
            ROMAN[i],
            name,
            scale[i].name,
            chords[i].triad,
            chords[i].seventh,
            <span key="t" className="text-muted-foreground">
              {text}
            </span>,
          ]),
          ["VIII", "Tonic", scale[0].name, chords[0].triad, chords[0].seventh, <span key="t" className="text-muted-foreground">The octave: back home.</span>],
        ]}
      />
    </>
  );
}

const NUMBER_TOKENS = ["1", "b2", "2", "b3", "3", "4", "#4", "b5", "5", "#5", "b6", "6", "b7", "7", "8", "b9", "9", "#9", "11", "#11", "13"];

function NumbersToNotes() {
  const [rootPc, setRootPc] = useState(0);
  const root = spellRoot(rootPc, MAJOR);
  const chords = harmonize(buildScale(root, MAJOR));
  return (
    <>
      <RootPicker value={rootPc} onChange={setRootPc} label="Key" className="mb-4" />
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {NUMBER_TOKENS.map((token) => (
          <li key={token} className="flex flex-col items-center rounded-xl border border-border bg-card py-2">
            <span className="text-[12px] text-muted-foreground">{token === "#5" ? "+5 / ♯5" : degreeText(parseDegree(token))}</span>
            <span className="text-body font-medium text-foreground">{noteName(spellDegree(root, parseDegree(token)))}</span>
          </li>
        ))}
      </ul>
      <Caption>
        Chords as numbers in {noteName(root)}: I = {chords[0].triad}, II = {chords[1].triad}, III = {chords[2].triad}, IV = {chords[3].triad}, V ={" "}
        {chords[4].triad} ({chords[4].seventh}).
      </Caption>
    </>
  );
}

/* ---------------------------------------------------------------- dominants */

function useMajorKey(initial: number) {
  const [rootPc, setRootPc] = useState(initial);
  const root = spellRoot(rootPc, MAJOR);
  const scale = buildScale(root, MAJOR);
  return { rootPc, setRootPc, root, scale };
}

function SecondaryDominants() {
  const { rootPc, setRootPc, scale } = useMajorKey(9);
  const pcs = new Set(scale.map((s) => pc(s.note)));
  const cells = scale.map((s, i) => {
    const dom = spellDegree(s.note, parseDegree("5"));
    const diatonicRoot = pcs.has(pc(dom));
    return {
      chord: diatonicRoot ? `${noteName(dom)}7` : "–",
      symbol: i === 0 ? "Primary dominant" : diatonicRoot ? `V7/${ROMAN[i]}` : "–",
    };
  });
  return (
    <>
      <RootPicker value={rootPc} onChange={setRootPc} label="Major key" className="mb-4" />
      <SimpleTable
        columns={["Scale note", ...scale.map((s) => s.name)]}
        firstColumnHeader
        rows={[
          ["Secondary dominant", ...cells.map((c) => c.chord)],
          ["Symbol", ...cells.map((c) => c.symbol)],
        ]}
      />
      <Caption>Each chord is the dominant 7th a perfect 5th above the note it resolves to.</Caption>
    </>
  );
}

function SubstituteDominants() {
  const { rootPc, setRootPc, scale } = useMajorKey(9);
  const pcs = new Set(scale.map((s) => pc(s.note)));
  const cells = scale.map((s, i) => {
    const sub = spellDegree(s.note, parseDegree("b2"));
    const nonDiatonic = !pcs.has(pc(sub));
    return { chord: nonDiatonic ? `${noteName(sub)}7` : "–", symbol: nonDiatonic ? `subV7/${ROMAN[i]}` : "–" };
  });
  return (
    <>
      <RootPicker value={rootPc} onChange={setRootPc} label="Major key" className="mb-4" />
      <SimpleTable
        columns={["Scale note", ...scale.map((s) => s.name)]}
        firstColumnHeader
        rows={[
          ["Substitute dominant", ...cells.map((c) => c.chord)],
          ["Symbol", ...cells.map((c) => c.symbol)],
        ]}
      />
      <Caption>Each chord is a dominant 7th a half step above the note it resolves to.</Caption>
    </>
  );
}

const DOM7 = ["1", "3", "5", "b7"];

function TritoneSubstitution() {
  const [rootPc, setRootPc] = useState(7);
  const root = spellRoot(rootPc, DOM7.map(parseDegree));
  const sub = spellDegree(root, parseDegree("b5"));
  const tones = (r: typeof root) => DOM7.map((d) => spellDegree(r, parseDegree(d)));
  const a = tones(root);
  const b = tones(sub);
  const row = (label: string, notes: typeof a, other: typeof a) => (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 text-body font-medium text-foreground">{label}</span>
      {notes.map((n, i) => (
        <span
          key={i}
          className={cn(
            "flex min-w-14 flex-col items-center rounded-xl border px-2.5 py-1.5",
            other.some((o) => pc(o) === pc(n)) ? "border-foreground bg-card" : "border-border",
          )}
        >
          <span className="text-body font-medium">{noteName(n)}</span>
          <span className="text-[12px] text-muted-foreground">{["R", "3", "5", "♭7"][i]}</span>
        </span>
      ))}
    </div>
  );
  return (
    <>
      <RootPicker value={rootPc} onChange={setRootPc} label="Dominant chord root" className="mb-4" />
      <div className="flex flex-col gap-3">
        {row(`${noteName(root)}7`, a, b)}
        {row(`${noteName(sub)}7`, b, a)}
      </div>
      <Caption>Outlined: the shared 3rd and 7th, which swap roles between the two chords.</Caption>
    </>
  );
}

/* ---------------------------------------------------------------- keys */

function RelativeKeys() {
  return (
    <SimpleTable
      columns={["Major key", "Relative minor", "Key signature", "Shared notes"]}
      rows={CIRCLE.map((k) => {
        const sig = keySignature(k.major);
        return [
          `${noteName(parseNote(k.major))} major`,
          `${relativeMinor(k.major)} minor`,
          sig.sharps ? `${sig.sharps} ♯` : sig.flats ? `${sig.flats} ♭` : "None",
          <span key="n" className="text-muted-foreground">
            {sig.scale.join(" ")}
          </span>,
        ];
      })}
    />
  );
}

function KeyCharacters() {
  const [mode, setMode] = useState<"all" | "major" | "minor">("all");
  const rows = KEY_CHARACTERS.filter((k) => mode === "all" || k.mode === mode);
  return (
    <>
      <Segmented
        label="Show"
        size="sm"
        value={mode}
        onChange={setMode}
        options={[
          { value: "all", label: "All keys" },
          { value: "major", label: "Major" },
          { value: "minor", label: "Minor" },
        ]}
        className="mb-4"
      />
      <SimpleTable
        columns={["Key", "Character"]}
        rows={rows.map((k) => [
          <span key="k" className="whitespace-nowrap">
            {noteName(parseNote(k.key))} {k.mode}
          </span>,
          <span key="t" className="text-foreground/85">
            {k.text}
          </span>,
        ])}
      />
    </>
  );
}

/* ---------------------------------------------------------------- modes */

function ModeParentFinder() {
  const family = MODE_FAMILIES[0];
  const [start, setStart] = useState(1);
  const [rootPc, setRootPc] = useState(9);
  const parent = family.parentFormula.map(parseDegree);
  const degrees = modeDegrees(parent, start);
  const modeRoot = spellRoot(rootPc, degrees);
  const parentRoot = noteFromLetter(modeRoot.letter - start, rootPc - degreeSemitones(parent[start]));
  const parentScale = buildScale(parentRoot, parent);
  const modeNotes = [...parentScale.slice(start), ...parentScale.slice(0, start)];
  const sig = keySignature(noteName(parentRoot, true));
  const mode = family.modes[start];
  return (
    <>
      <div className="mb-3 flex flex-wrap gap-2">
        <Segmented
          label="Mode"
          size="sm"
          value={start}
          onChange={setStart}
          options={family.modes.map((m) => ({ value: m.start, label: m.name }))}
        />
      </div>
      <RootPicker value={rootPc} onChange={setRootPc} label="Mode root" className="mb-4" />
      <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
        <div className="bg-card px-4 py-3">
          <dt className="text-[13px] text-muted-foreground">Mode</dt>
          <dd className="text-body font-medium">
            {noteName(modeRoot)} {mode.name}
          </dd>
        </div>
        <div className="bg-card px-4 py-3">
          <dt className="text-[13px] text-muted-foreground">Parent major scale</dt>
          <dd className="text-body font-medium">
            {noteName(parentRoot)} major ({degreeSemitones(parent[start])} half steps below)
          </dd>
        </div>
        <div className="bg-card px-4 py-3">
          <dt className="text-[13px] text-muted-foreground">Key signature</dt>
          <dd className="text-body font-medium">{sig.accidentals.length ? sig.accidentals.join(" ") : "No sharps or flats"}</dd>
        </div>
      </dl>
      <p className="mt-4 text-body">
        <span className="text-muted-foreground">Notes: </span>
        <span className="font-medium">{modeNotes.map((n) => n.name).join(" ")}</span>
      </p>
    </>
  );
}

const WIDGETS: Record<WidgetName, () => React.ReactNode> = {
  "note-circle": NoteCircleWidget,
  "keyboard-enharmonics": KeyboardEnharmonics,
  "keyboard-octaves": KeyboardOctaves,
  "note-durations": NoteDurations,
  "step-keyboards": StepKeyboards,
  "interval-table": IntervalTable,
  "interval-on-guitar": IntervalOnGuitar,
  "double-note": DoubleNote,
  "scale-sizes": ScaleSizes,
  "scale-degrees": ScaleDegrees,
  "numbers-to-notes": NumbersToNotes,
  "secondary-dominants": SecondaryDominants,
  "substitute-dominants": SubstituteDominants,
  "tritone-substitution": TritoneSubstitution,
  "relative-keys": RelativeKeys,
  "mode-parent-finder": ModeParentFinder,
  "key-characters": KeyCharacters,
};
