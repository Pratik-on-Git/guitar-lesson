"use client";

import { getScale } from "@/lib/music/scales";
import { buildScale, harmonize, neckNotes, parseDegree, spellRoot } from "@/lib/music/theory";
import { useQueryState } from "@/lib/use-query-state";
import { Panel } from "@/components/app/panel";
import { SimpleTable } from "@/components/ui/table";
import { BookSource } from "@/components/content/book-source";
import { References } from "@/components/content/references";
import { SCALE_REFERENCES } from "@/lib/content/references";
import { Fretboard } from "./fretboard";
import { RootPicker, useRootParam } from "./controls";
import { StudySelect, PlayNotes } from "./study-controls";

export function HarmonizationExplorer() {
  const [rootPc, setRootPc] = useRootParam(7); const [familyId, setFamily] = useQueryState("family", "major");
  const family = ["major", "harmonic-minor", "melodic-minor"].includes(familyId) ? familyId : "major";
  const def = getScale(family)!; const scale = buildScale(spellRoot(rootPc, def.formula.map(parseDegree)), def.formula.map(parseDegree)); const chords = harmonize(scale);
  const [degreeValue, setDegree] = useQueryState("degree", "0"); const degree = /^[0-6]$/.test(degreeValue) ? Number(degreeValue) : 0;
  const [mode, setMode] = useQueryState("approach", "vertical"); const horizontal = mode === "horizontal";
  const [fretValue, setFret] = useQueryState("fret", "3"); const fret = /^(0|3|5|7|9|12|15|19)$/.test(fretValue) ? Number(fretValue) : 3;
  const [size, setSize] = useQueryState("size", "seventh"); const triads = size === "triad";
  const indices = [0, 2, 4, ...(triads ? [] : [6])].map((n) => (degree + n) % 7);
  const notes = neckNotes(rootPc, scale.map((n) => n.semis), 24);
  const highlight = notes.filter((n) => indices.includes(n.index) && (horizontal || n.fret >= fret && n.fret <= fret + 4));
  const selectedChord = chords[degree];
  const midis = indices.map((index, i) => { const offset = scale[index].semis + (degree + i * 2 >= 7 ? 12 : 0); return 48 + rootPc + offset; });
  return <div className="flex flex-col gap-5">
    <Panel title="Harmonize a parent scale"><RootPicker value={rootPc} onChange={setRootPc} className="mb-5" /><div className="grid gap-4 sm:grid-cols-2">
      <StudySelect label="Parent scale" value={family} onChange={setFamily} options={["major", "harmonic-minor", "melodic-minor"].map((value) => ({ value, label: getScale(value)!.short }))} />
      <StudySelect label="Chord size" value={triads ? "triad" : "seventh"} onChange={setSize} options={[{ value: "triad", label: "Triads" }, { value: "seventh", label: "Seventh chords" }]} />
      <StudySelect label="Practice approach" value={horizontal ? "horizontal" : "vertical"} onChange={setMode} options={[{ value: "horizontal", label: "Horizontal · move roots across the neck" }, { value: "vertical", label: "Vertical · stay in one fret region" }]} />
      {!horizontal && <StudySelect label="Fret region" value={String(fret)} onChange={setFret} options={[0, 3, 5, 7, 9, 12, 15, 19].map((n) => ({ value: String(n), label: `Frets ${n}–${n + 4}` }))} />}
    </div></Panel>
    <Panel title="Diatonic chords" description={`${scale.map((n) => n.name).join(" ")} · select a degree to isolate its tones.`}>
      <SimpleTable columns={["Degree", "Chord", "Quality", "Notes"]} rows={chords.map((c, i) => [<button key="select" aria-pressed={degree === i} className="text-primary rounded border px-3 py-1 font-medium hover:bg-primary/10 aria-pressed:bg-primary/15" onClick={() => setDegree(String(i))}>{c.roman}</button>, triads ? c.triad : c.seventh, triads ? c.triadQuality : c.seventhQuality, c.notes.slice(0, triads ? 3 : 4).join(" ")])} />
    </Panel>
    <Panel title={`${triads ? selectedChord.triad : selectedChord.seventh} · ${horizontal ? "horizontal" : "vertical"} practice`} description={horizontal ? "Find each highlighted chord tone along its string, then move to the next degree. Use the atlas's reference root strings when practicing a particular source shape." : "Only chord tones in the selected five-fret region are emphasized. Keep your hand here as you change scale degrees; the region is not a numbered source box."}>
      <Fretboard notes={notes} highlight={highlight} rootIndex={degree} frets={24} label={(i) => scale[i].name} title={`${selectedChord.seventh} tones within ${horizontal ? "the whole neck" : `frets ${fret} to ${fret + 4}`}`} />
      <p className="my-4 text-sm leading-6">Square: the selected chord&apos;s root. Faint dots: other scale tones. Play the highlighted notes as an arpeggio, then add one neighbouring scale tone to make a phrase.</p>
      <PlayNotes key={`${family}-${rootPc}-${degree}-${size}`} midis={midis} label="Hear selected arpeggio" />
    </Panel>
    <BookSource pages="58, 66, 74, 94–95" /><References entries={SCALE_REFERENCES} />
  </div>;
}
