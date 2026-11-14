"use client";

import { BOOK_CHORD_TYPES } from "@/lib/content/book";
import { BookSource } from "@/components/content/book-source";
import { useQueryState } from "@/lib/use-query-state";
import { buildScale, neckNotes, noteName, noteWithOctave, parseDegree, spellRoot } from "@/lib/music/theory";
import { Panel } from "@/components/app/panel";
import { Fact, FactGrid } from "@/components/app/facts";
import { SimpleTable } from "@/components/ui/table";
import { RootPicker, useRootParam, FretLabelToggle } from "./controls";
import { useFretLabel } from "@/lib/store";
import { Fretboard } from "./fretboard";
import { StudySelect, PlayNotes } from "./study-controls";
import { References } from "@/components/content/references";
import { CHORD_REFERENCES } from "@/lib/content/references";

export function ArpeggioExplorer() {
  const [id, setId] = useQueryState("chord", "major");
  const chord = BOOK_CHORD_TYPES.find((c) => c.id === id) ?? BOOK_CHORD_TYPES[0];
  const [rootPc, setRootPc] = useRootParam(9); const [windowValue, setWindow] = useQueryState("fret", "all");
  const fret = ["0", "3", "5", "7", "9", "12", "15", "19"].includes(windowValue) ? Number(windowValue) : null;
  const [inv, setInv] = useQueryState("start", "0");
  const start = /^[0-3]$/.test(inv) && Number(inv) < chord.formula.length ? Number(inv) : 0;
  const [labelMode] = useFretLabel(); const degrees = chord.formula.map(parseDegree); const root = spellRoot(rootPc, degrees); const tones = buildScale(root, degrees);
  const notes = neckNotes(rootPc, tones.map((t) => t.semis), 24);
  const selected = fret === null ? undefined : notes.filter((n) => n.fret >= fret && n.fret <= fret + 4);
  const line = Array.from({ length: tones.length * 2 + 1 }, (_, i) => { const total = start + i; const index = total % tones.length; const midi = 48 + rootPc + tones[index].semis + 12 * Math.floor(total / tones.length); return { index, midi }; });
  const title = `${noteName(root)}${chord.symbol}`;
  return <div className="flex flex-col gap-5">
    <Panel title="Choose an arpeggio" description="All four triad and seven seventh-chord qualities from the book.">
      <RootPicker value={rootPc} onChange={setRootPc} className="mb-5" />
      <div className="grid gap-4 sm:grid-cols-2"><StudySelect label="Arpeggio quality" value={chord.id} onChange={setId} options={BOOK_CHORD_TYPES.map((c) => ({ value: c.id, label: c.name }))} /><StudySelect label="Start the line on" value={String(start)} onChange={setInv} options={tones.map((n, i) => ({ value: String(i), label: `${n.label} · ${n.name}` }))} /></div>
    </Panel>
    <Panel title={`${title} arpeggio`}><FactGrid><Fact label="Formula" value={tones.map((n) => n.label).join(" ")} /><Fact label="Chord tones" value={tones.map((n) => n.name).join(" ")} /><Fact wide label="Two-octave ascending line" value={line.map((n) => noteWithOctave(tones[n.index].note, n.midi)).join(" → ")} /></FactGrid><div className="mt-4"><PlayNotes key={`${id}-${rootPc}-${start}`} midis={[...line, ...line.slice(0, -1).reverse()].map((n) => n.midi)} label="Hear ascending & descending" /></div></Panel>
    <Panel title="Chord tones across the neck" description="Isolate a five-fret practice region. This is a position window, not one of the source's seven numbered arpeggio shapes." action={<FretLabelToggle />}>
      <StudySelect label="Practice region" value={fret === null ? "all" : String(fret)} onChange={setWindow} options={[{ value: "all", label: "Whole neck" }, ...[0, 3, 5, 7, 9, 12, 15, 19].map((n) => ({ value: String(n), label: `Frets ${n}–${n + 4}` }))]} />
      <Fretboard notes={notes} highlight={selected} startFret={fret ?? 0} frets={fret === null ? 24 : fret + 4} label={(i) => labelMode === "note" ? tones[i].name : labelMode === "interval" ? tones[i].interval : tones[i].label} title={`${title} arpeggio${fret === null ? ", whole neck" : `, frets ${fret} to ${fret + 4}`}`} />
      <SimpleTable columns={["Degree", "Note", "Interval"]} rows={tones.map((n) => [n.label, n.name, n.interval])} />
      <p className="mt-4 text-sm text-muted-foreground">Play one tone per attack. Begin slowly, name each chord tone and make a short phrase inside the region before connecting adjacent regions.</p>
    </Panel>
    <BookSource pages={String(chord.arpeggioPage)} diagramPage={chord.arpeggioPage} />
    <References entries={CHORD_REFERENCES} />
  </div>;
}
