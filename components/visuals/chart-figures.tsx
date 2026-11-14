"use client";

import { BOOK_ASSIGNMENTS } from "@/lib/content/book-assignments";
import { BOOK_DIAGRAMS } from "@/lib/content/book";
import { FRET_SHEETS } from "@/lib/content/fretboard-sheets";
import { THEORY_CHAPTERS } from "@/lib/content/theory-book";
import { THEORY_FIGURES } from "@/lib/content/theory-book-assets";
import { CHORD_CATEGORIES, CHORDS } from "@/lib/music/chords";
import { SCALES } from "@/lib/music/scales";
import { BarChart, DivergingChart, ProportionStrip, type Series } from "./charts";

/* Charts that summarise the books' material, computed from the same data the explorers use. */

const span = (pages: string) => pages.split(/,\s*/).reduce((n, part) => {
  const [a, b] = part.split("–").map(Number);
  return n + (b ? b - a + 1 : 1);
}, 0);

const JUST: [string, number, string][] = [["m2", 16 / 15, "16:15"], ["M2", 9 / 8, "9:8"], ["m3", 6 / 5, "6:5"], ["M3", 5 / 4, "5:4"], ["P4", 4 / 3, "4:3"], ["P5", 3 / 2, "3:2"], ["m6", 8 / 5, "8:5"], ["M6", 5 / 3, "5:3"], ["m7", 9 / 5, "9:5"], ["M7", 15 / 8, "15:8"]];

export const CHART_VISUALS: Record<string, () => React.ReactNode> = {
  "chart-interval-sizes": () => {
    const rows: [string, number, Series][] = [["Unison P1", 0, 3], ["m2", 1, 2], ["M2", 2, 1], ["m3", 3, 2], ["M3", 4, 1], ["P4", 5, 3], ["Tritone A4/d5", 6, 5], ["P5", 7, 3], ["m6", 8, 2], ["M6", 9, 1], ["m7", 10, 2], ["M7", 11, 1], ["Octave P8", 12, 3]];
    return <BarChart title="Interval size in semitones (= frets on one string)" unit="semitones" max={12} bars={rows.map(([label, value, series]) => ({ label, value, series }))} legend={[{ series: 3, label: "Perfect" }, { series: 1, label: "Major" }, { series: 2, label: "Minor" }, { series: 5, label: "Tritone" }]} />;
  },
  "chart-key-signatures": () => {
    const keys: [string, number][] = [["C♭", -7], ["G♭", -6], ["D♭", -5], ["A♭", -4], ["E♭", -3], ["B♭", -2], ["F", -1], ["C", 0], ["G", 1], ["D", 2], ["A", 3], ["E", 4], ["B", 5], ["F♯", 6], ["C♯", 7]];
    return <DivergingChart title="Accidentals in each major key signature, round the circle of fifths" negative="Flats" positive="Sharps" limit={7} bars={keys.map(([k, n]) => ({ label: `${k} major`, value: n, display: n === 0 ? "none" : `${Math.abs(n)}${n > 0 ? "♯" : "♭"}` }))} />;
  },
  "chart-mode-brightness": () => {
    const modes: [string, number, string][] = [["Lydian", 1, "raised 4"], ["Ionian", 0, "major"], ["Mixolydian", -1, "♭7"], ["Dorian", -2, "♭3 ♭7"], ["Aeolian", -3, "♭3 ♭6 ♭7"], ["Phrygian", -4, "♭2 ♭3 ♭6 ♭7"], ["Locrian", -5, "♭2 ♭3 ♭5 ♭6 ♭7"]];
    return <DivergingChart title="Mode brightness: degrees raised or lowered against the major scale" negative="Lowered degrees (darker)" positive="Raised degrees (brighter)" limit={5} bars={modes.map(([label, value, detail]) => ({ label, value, detail, display: value === 0 ? "0" : `${value > 0 ? "+" : ""}${value}` }))} />;
  },
  "chart-scale-sizes": () => <BarChart title="Notes per octave in each scale" unit="notes" max={12} labelWidth="10rem" bars={[...SCALES].sort((a, b) => b.formula.length - a.formula.length).map((s) => ({ label: s.short, value: s.formula.length, series: (s.formula.length === 5 ? 2 : s.formula.length === 7 ? 1 : s.formula.length > 7 ? 5 : 3) as Series }))} legend={[{ series: 2, label: "Pentatonic (5)" }, { series: 3, label: "Hexatonic (6)" }, { series: 1, label: "Heptatonic (7)" }, { series: 5, label: "8 or more" }]} />,
  "chart-et-frequencies": () => {
    const names = ["A4", "A♯4", "B4", "C5", "C♯5", "D5", "D♯5", "E5", "F5", "F♯5", "G5", "G♯5", "A5"];
    return <BarChart title="Equal-tempered frequencies from A4 = 440 Hz: each semitone multiplies by 2^(1/12)" unit="Hz" bars={names.map((label, i) => { const hz = 440 * 2 ** (i / 12); return { label, value: hz, display: hz.toFixed(1), detail: i ? `+${(hz - 440 * 2 ** ((i - 1) / 12)).toFixed(1)} Hz from the previous note` : "reference" }; })} />;
  },
  "chart-just-vs-et": () => <DivergingChart title="Equal temperament minus just intonation, in cents" negative="Equal temperament narrower" positive="Equal temperament wider" unit="cents" bars={JUST.map(([label, ratio, text], i) => { const just = 1200 * Math.log2(ratio); const diff = (i + 1) * 100 - just; return { label, value: diff, display: `${diff > 0 ? "+" : ""}${diff.toFixed(1)}¢`, detail: `just ${text} = ${just.toFixed(1)}¢` }; })} />,
  "chart-durations": () => <ProportionStrip title="How each note value divides one 4/4 bar" rows={[{ label: "Whole", parts: 1, each: "4 beats" }, { label: "Half", parts: 2, each: "2 beats" }, { label: "Quarter", parts: 4, each: "1 beat" }, { label: "Eighth", parts: 8, each: "½" }, { label: "Sixteenth", parts: 16, each: "¼" }, { label: "Thirty-second", parts: 32, each: "⅛" }]} />,
  "chart-chord-categories": () => <BarChart title="Chord formulas in the library by family" unit="formulas" labelWidth="11rem" bars={CHORD_CATEGORIES.map((c) => ({ label: c, value: CHORDS.filter((x) => x.category === c).length })).sort((a, b) => b.value - a.value)} />,
  "chart-fc-diagrams": () => {
    const chapters = [...new Set(BOOK_DIAGRAMS.map((d) => d.chapter))];
    const notes = (page: number) => { const s = FRET_SHEETS.find((x) => x.page === page)!; return [s.neck, ...s.groups.flatMap((g) => g.diagrams)].reduce((n, d) => n + (d ? d.marks.split(" ").length : 0), 0); };
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <BarChart title="Diagram sheets per chapter" unit="sheets" bars={chapters.map((c) => ({ label: c, value: BOOK_DIAGRAMS.filter((d) => d.chapter === c).length }))} />
        <BarChart title="Transcribed notes per chapter" unit="notes" bars={chapters.map((c) => ({ label: c, value: BOOK_DIAGRAMS.filter((d) => d.chapter === c).reduce((n, d) => n + notes(d.page), 0), series: 3 as Series }))} />
      </div>
    );
  },
  "chart-fc-assignments": () => {
    const pages = [...new Set(BOOK_ASSIGNMENTS.map((a) => a.page))];
    return <BarChart title="Numbered practical assignments by source page" unit="assignments" labelWidth="10rem" bars={pages.map((p) => { const a = BOOK_ASSIGNMENTS.find((x) => x.page === p)!; return { label: `p. ${p} · ${a.chapter}`, value: BOOK_ASSIGNMENTS.filter((x) => x.page === p).length, series: 4 as Series }; })} />;
  },
  "chart-carter-parts": () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <BarChart title="PDF pages per part" unit="pages" labelWidth="11rem" bars={THEORY_CHAPTERS.map((c) => ({ label: c.title.replace(/^\d · /, ""), value: span(c.pages) }))} />
      <BarChart title="Figures redrawn per part" unit="figures" labelWidth="11rem" bars={THEORY_CHAPTERS.map((c) => { const [a, b] = c.pages.split("–").map(Number); return { label: c.title.replace(/^\d · /, ""), value: THEORY_FIGURES.filter((f) => f.page >= a && f.page <= b).length, series: 3 as Series }; })} />
    </div>
  ),
};
