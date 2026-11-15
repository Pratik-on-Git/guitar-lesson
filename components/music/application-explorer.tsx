"use client";

import { titleCaseLabel } from "@/lib/title-case";

import Link from "next/link";
import { BOOK_CHORD_TYPES } from "@/lib/content/book";
import { COLLECTIONS, PENTATONIC_RECIPES, SCALE_CHOICES } from "@/lib/music/applications";
import { buildScale, chordNotes, degreeBetween, degreeText, mod, neckNotes, noteName, parseDegree, pc, prettyDegree, spellDegree, spellRoot } from "@/lib/music/theory";
import { useQueryState } from "@/lib/use-query-state";
import { Panel } from "@/components/app/panel";
import { BookSource } from "@/components/content/book-source";
import { Fact, FactGrid } from "@/components/app/facts";
import { SimpleTable } from "@/components/ui/table";
import { Segmented } from "@/components/ui/segmented";
import { References } from "@/components/content/references";
import { MODE_REFERENCES } from "@/lib/content/references";
import { Fretboard } from "./fretboard";
import { RootPicker, useRootParam } from "./controls";
import { StudySelect, PlayNotes } from "./study-controls";

export function ApplicationExplorer() {
  const [rootPc, setRootPc] = useRootParam(9);
  const [tabValue, setTab] = useQueryState("tab", "scales");
  const tab = tabValue === "pentatonics" ? "pentatonics" : "scales";
  const [chordId, setChord] = useQueryState("chord", "dominant-7");
  const chord = BOOK_CHORD_TYPES.find((c) => c.id === chordId && SCALE_CHOICES[c.id]) ?? BOOK_CHORD_TYPES[5];
  const choices = SCALE_CHOICES[chord.id].map((id) => COLLECTIONS.find((c) => c.id === id)!);
  const [collectionId, setCollection] = useQueryState("collection", "major:mixolydian");
  const collection = choices.find((c) => c.id === collectionId) ?? choices[0];
  const [recipeId, setRecipe] = useQueryState("recipe", "dorian");
  const recipe = PENTATONIC_RECIPES.find((r) => r.id === recipeId) ?? PENTATONIC_RECIPES[0];
  const root = spellRoot(rootPc, chord.formula.map(parseDegree));
  const chordTones = buildScale(root, chord.formula.map(parseDegree));
  const scale = buildScale(root, collection.formula.map(parseDegree));
  const contained = chordTones.filter((tone) => scale.some((n) => pc(n.note) === pc(tone.note)));
  const missing = chordTones.filter((tone) => !contained.includes(tone));
  const pentRoot = spellDegree(root, parseDegree(recipe.degree));
  const pent = buildScale(pentRoot, ["1", "b3", "4", "5", "b7"].map(parseDegree));
  const dominantLabels = ["1", "b9", "9", "#9", "3", "11", "#11", "5", "b13", "13", "b7", "7"];
  const relativeLabels = pent.map((n) => recipe.id.startsWith("altered") ? prettyDegree(dominantLabels[mod(pc(n.note) - rootPc, 12)]) : degreeText(degreeBetween(root, n.note)));
  const name = `${noteName(root)}${chord.symbol}`;
  return <div className="flex flex-col gap-5">
    <Panel title="Listen to the harmony first" description="Scale suggestions are starting points. Check the melody, extensions and destination chord, then shape the tension and resolution.">
      <Segmented label="Application" value={tab} onChange={setTab} options={[{ value: "scales", label: "Scale choices per chord" }, { value: "pentatonics", label: "Pentatonic substitutions" }]} className="mb-5" />
      <RootPicker value={rootPc} onChange={setRootPc} label="Chord root" />
    </Panel>
    {tab === "scales" ? <>
      <Panel title="Choose a chord and scale"><div className="grid gap-4 sm:grid-cols-2">
        <StudySelect label="Chord quality" value={chord.id} onChange={setChord} options={BOOK_CHORD_TYPES.filter((c) => SCALE_CHOICES[c.id]).map((c) => ({ value: c.id, label: c.name }))} />
        <StudySelect label="Suggested scale" value={collection.id} onChange={setCollection} options={choices.map((c) => ({ value: c.id, label: c.name }))} />
      </div></Panel>
      <Panel title={`${collection.name} over ${name}`}>
        <FactGrid><Fact label="Chord tones" value={chordNotes(root, chord.formula).join(" ")} /><Fact label="Scale notes" value={scale.map((n) => n.name).join(" ")} /><Fact label="Chord tones contained" value={contained.map((n) => n.name).join(" ") || "None"} /><Fact label="Chord tones outside this collection" value={missing.map((n) => n.name).join(" ") || "None; all defining chord tones are present."} /></FactGrid>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{missing.length ? "This is a contextual colour or tension choice. The accompaniment can supply missing tones; compare any conflicting thirds, fifths or sevenths and resolve intentionally." : "Chord-tone containment is a useful first check. It does not guarantee that every tension suits the melody or voicing."}</p>
        <div className="mt-4 flex flex-wrap gap-3"><PlayNotes key={`${chord.id}-${rootPc}`} midis={chordTones.map((n) => 48 + rootPc + n.semis)} label="Hear chord" simultaneous /><PlayNotes key={`${collection.id}-${rootPc}`} midis={[...scale.map((n) => 60 + rootPc + n.semis), 72 + rootPc]} label="Hear scale" /></div>
      </Panel>
      <Panel title="All choices for this chord" description="The source's page-99 table, with computed chord-tone containment; use the selected scale for a detailed view.">
        <SimpleTable columns={["Scale", "Chord tones outside collection", "Explore"]} rows={choices.map((c) => { const tones = buildScale(root, c.formula.map(parseDegree)); const absent = chordTones.filter((t) => !tones.some((n) => pc(n.note) === pc(t.note))); return [<button key="choice" className="text-primary text-left hover:underline" onClick={() => setCollection(c.id)}>{titleCaseLabel(<>{c.name}</>)}</button>, absent.map((n) => n.name).join(" ") || "All chord tones present", <Link key="link" className="text-primary hover:underline" href={`${c.href}${c.href.includes("?") ? "&" : "?"}key=${["c", "c-sharp", "d", "d-sharp", "e", "f", "f-sharp", "g", "g-sharp", "a", "a-sharp", "b"][rootPc]}`}>{titleCaseLabel(<>Notes & positions →</>)}</Link>]; })} />
      </Panel>
    </> : <>
      <Panel title="Create a modal colour with minor pentatonic"><StudySelect label="Desired sound" value={recipe.id} onChange={setRecipe} options={PENTATONIC_RECIPES.map((r) => ({ value: r.id, label: r.name }))} /><p className="mt-4 text-sm leading-6">{recipe.explanation}</p></Panel>
      <Panel title={`${noteName(pentRoot)} minor pentatonic over ${noteName(root)}${recipe.chord}`}>
        <FactGrid><Fact label="Pentatonic notes" value={pent.map((n) => n.name).join(" ")} /><Fact label="Degrees relative to the chord root" value={relativeLabels.join(" ")} /><Fact label="Target colour" value={`${prettyDegree(recipe.target)} = ${noteName(spellDegree(root, parseDegree(recipe.target)))}`} /><Fact label="Root relationship" value={`${prettyDegree(recipe.degree)} above the chord root (within an octave)`} /></FactGrid>
        <Fretboard notes={neckNotes(pc(pentRoot), pent.map((n) => n.semis), 15)} label={(i) => relativeLabels[i]} title={`${noteName(pentRoot)} minor pentatonic, labeled relative to ${noteName(root)} chord`} />
        <p className="text-sm text-muted-foreground">The square marks the pentatonic&apos;s root. Every dot label measures from the accompaniment&apos;s {noteName(root)} root. Keep that bass audible to hear the intended colour.</p>
        <SimpleTable columns={["Pentatonic note", "Chord-relative degree"]} rows={pent.map((n, i) => [n.name, relativeLabels[i]])} />
      </Panel>
    </>}
    <BookSource pages={tab === "scales" ? "98–99, 102–103" : "100–103"} />
    <References entries={MODE_REFERENCES} />
  </div>;
}
