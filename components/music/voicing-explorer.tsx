"use client";

import Link from "next/link";
import { BOOK_CHORD_TYPES } from "@/lib/content/book";
import { BookSource } from "@/components/content/book-source";
import { useQueryState } from "@/lib/use-query-state";
import { buildScale, noteName, parseDegree, TUNING, spellRoot } from "@/lib/music/theory";
import { chordVoices, guitarVoicings, STRING_SETS, type VoicingKind } from "@/lib/music/performance";
import { Panel } from "@/components/app/panel";
import { Fact, FactGrid } from "@/components/app/facts";
import { SimpleTable } from "@/components/ui/table";
import { RootPicker, useRootParam } from "./controls";
import { Fretboard } from "./fretboard";
import { StudySelect, PlayNotes } from "./study-controls";
import { References } from "@/components/content/references";
import { CHORD_REFERENCES } from "@/lib/content/references";

export function VoicingExplorer() {
  const [id, setId] = useQueryState("chord", "major-7");
  const chord = BOOK_CHORD_TYPES.find((c) => c.id === id) ?? BOOK_CHORD_TYPES[4];
  const [rootPc, setRootPc] = useRootParam(9);
  const [kindValue, setKind] = useQueryState("voicing", "drop-2");
  const kind: VoicingKind = chord.formula.length === 3 ? "close" : ["close", "drop-2", "drop-3"].includes(kindValue) ? kindValue as VoicingKind : "drop-2";
  const [inv, setInv] = useQueryState("inversion", "0");
  const inversion = /^[0-3]$/.test(inv) && Number(inv) < chord.formula.length ? Number(inv) : 0;
  const [set, setSet] = useQueryState("strings", "0");
  const sets = chord.formula.length === 3 ? STRING_SETS.triad : STRING_SETS[kind];
  const strings = sets[Number(set)] ?? sets[0];
  const degrees = chord.formula.map(parseDegree); const root = spellRoot(rootPc, degrees); const tones = buildScale(root, degrees);
  const voices = chordVoices(rootPc, chord.formula, inversion, kind);
  const shapes = guitarVoicings(voices, strings);
  const [register, setRegister] = useQueryState("register", "0");
  const shape = shapes[Number(register)] ?? shapes[0];
  const title = `${noteName(root)}${chord.symbol}`;
  const sourcePage = kind === "close" ? chord.shapePage : (kind === "drop-2" ? 67 : 75) + Math.max(0, BOOK_CHORD_TYPES.indexOf(chord) - 4);
  return <div className="flex flex-col gap-5">
    <Panel title="Build a voicing" description="Choose the resulting bass inversion. Note order and octave spacing are computed from the close-position/drop recipe.">
      <RootPicker value={rootPc} onChange={setRootPc} className="mb-5" />
      <div className="grid gap-4 sm:grid-cols-2">
        <StudySelect label="Chord quality" value={chord.id} onChange={setId} options={BOOK_CHORD_TYPES.map((c) => ({ value: c.id, label: c.name }))} />
        <StudySelect label="Voicing type" value={kind} onChange={setKind} options={(chord.formula.length === 3 ? ["close"] : ["close", "drop-2", "drop-3"]).map((value) => ({ value, label: { close: "Close position", "drop-2": "Drop 2", "drop-3": "Drop 3" }[value]! }))} />
        <StudySelect label="Resulting bass inversion" value={String(inversion)} onChange={setInv} options={chord.formula.map((_, i) => ({ value: String(i), label: ["Root position", "First inversion", "Second inversion", "Third inversion"][i] }))} />
        <StudySelect label="String set (low to high)" value={String(sets.indexOf(strings))} onChange={setSet} options={sets.map((s, i) => ({ value: String(i), label: s.map((n) => 6 - n).join("–") }))} />
      </div>
    </Panel>
    <Panel title={title} description={`${chord.name} · ${kind.replace("-", " ")} · ${["root position", "first inversion", "second inversion", "third inversion"][inversion]}`}>
      <FactGrid><Fact label="Formula" value={tones.map((t) => t.label).join(" ")} /><Fact label="Bass note" value={tones[inversion].name} /><Fact wide label="Voices from low to high" value={voices.map((v) => `${tones[v.index].name}${Math.floor(v.midi / 12) - 1}`).join(" → ")} /><Fact wide label="Degree order" value={voices.map((v) => tones[v.index].label).join(" → ")} /></FactGrid>
      <div className="mt-4"><PlayNotes key={`${id}-${kind}-${rootPc}-${inversion}`} midis={shape ? shape.map((n) => TUNING[n.string] + n.fret) : voices.map((v) => v.midi)} label="Hear the voicing" simultaneous /></div>
    </Panel>
    <Panel title="On the guitar" description="A computed grip with the selected ordered pitches, in standard tuning. These grips are separate from the book's numbered root-position shapes.">
      {shape ? <>
        {shapes.length > 1 && <StudySelect label="Fretboard register" value={String(shapes.indexOf(shape))} onChange={setRegister} options={shapes.map((s, i) => ({ value: String(i), label: `Bass at fret ${s[0].fret}` }))} />}
        <Fretboard notes={shape} frets={Math.max(15, ...shape.map((n) => n.fret))} label={(i) => tones[i].label} title={`${title} ${kind}, string set ${strings.map((s) => 6 - s).join(" ")}`} />
        <SimpleTable columns={["String (6 → 1)", "Fret", "Tone"]} rows={Array.from({ length: 6 }, (_, string) => { const note = shape.find((n) => n.string === string); return [String(6 - string), note ? String(note.fret) : "× · mute", note ? tones[note.index].name : "—"]; })} />
      </> : <p className="text-sm leading-6">This exact spacing has no grip within frets 0–24 and a seven-fret span on the selected strings. Choose another string set or voicing type; use the source sheets to study practical alternatives and omitted-tone shapes.</p>}
    </Panel>
    <BookSource pages={kind === "close" ? "58–64" : kind === "drop-2" ? "65–73" : "74–81"} diagramPage={sourcePage} />
    <Link href="/learn/voicings" className="text-sm font-medium text-primary hover:underline">Read the inversion and drop recipes →</Link>
    <References entries={CHORD_REFERENCES} />
  </div>;
}
