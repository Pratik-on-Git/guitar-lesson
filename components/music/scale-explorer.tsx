"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { getScale } from "@/lib/music/scales";
import { doubleNotePosition } from "@/lib/music/performance";
import { BookSource } from "@/components/content/book-source";
import { scaleBookPage } from "@/lib/content/book";
import { SCALE_REFERENCES } from "@/lib/content/references";
import { References } from "@/components/content/references";
import {
  ROOTS,
  buildScale,
  harmonize,
  neckNotes,
  noteName,
  parseDegree,
  pc,
  scalePosition,
  spellRoot,
  stepLabel,
  stepSizes,
  type ScaleNote,
} from "@/lib/music/theory";
import { useFretLabel } from "@/lib/store";
import { Fact, FactGrid } from "@/components/app/facts";
import { Panel } from "@/components/app/panel";
import { buttonVariants } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { SimpleTable } from "@/components/ui/table";
import { FretLabelToggle, RootPicker, useRootParam } from "./controls";
import { Fretboard } from "./fretboard";
import { Keyboard, type KeyMark } from "./keyboard";
import { NoteCircle } from "./note-circle";
import { StepPattern } from "./step-pattern";

export function ScaleExplorer({ scaleId, notes }: { scaleId: string; notes: React.ReactNode }) {
  const def = getScale(scaleId)!;
  const [rootPc, setRootPc] = useRootParam(def.exampleRoot);
  const degrees = def.formula.map(parseDegree);
  const root = spellRoot(rootPc, degrees);
  const scale = buildScale(root, degrees);
  const title = `${noteName(root)} ${def.short.toLowerCase()}`;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Panel
        title={title}
        description={def.mood ?? def.family}
        action={
          def.modesHref ? (
            <Link href={def.modesHref} className={buttonVariants({ variant: "outline", size: "sm" })}>
              See Its Modes
              <ArrowRight aria-hidden />
            </Link>
          ) : undefined
        }
      >
        <RootPicker value={rootPc} onChange={setRootPc} className="mb-6" />
        <StepPattern scale={scale} />
        <ScaleFacts scale={scale} />
      </Panel>

      <Panel title="Study notes">{notes}</Panel>
      {scaleBookPage(scaleId) && <BookSource pages={String(scaleBookPage(scaleId))} diagramPage={scaleBookPage(scaleId)} />}

      {def.descendingFormula && (
        <Panel title="Classical descending melodic minor" description="The conventional classical exercise descends as natural minor; jazz minor keeps the ascending collection in both directions.">
          <FactGrid>
            <Fact label="Descending formula" value="8 ♭7 ♭6 5 4 ♭3 2 1" />
            <Fact label={`Descending notes from ${noteName(root)}`} value={buildScale(root, def.descendingFormula.map(parseDegree)).map((n) => n.name).join(" → ")} />
          </FactGrid>
        </Panel>
      )}

      <NeckPanel
        rootPc={rootPc}
        scale={scale}
        title={title}
        positions={def.positions}
      />

      <div className="grid gap-4 md:gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Panel title="On the keyboard" description="One octave from the root, with the degree on each key.">
          <Keyboard
            length={24}
            marks={keyboardMarks(scale, rootPc)}
            title={`${title} on a piano keyboard`}
          />
        </Panel>
        <Panel title="On the note circle">
          <NoteCircle pcs={scale.map((s) => pc(s.note))} rootPc={rootPc} title={`${title} on the 12-note circle`} size={260} />
        </Panel>
      </div>

      {scale.length === 7 && <HarmonyPanel scale={scale} title={title} />}
      {def.harmonyNotes && (
        <Panel title="Harmony and application" description="Distinguish chords contained in the collection from contextual uses over other harmony.">
          <p className="max-w-[72ch] text-sm leading-6">{def.harmonyNotes}</p>
        </Panel>
      )}

      <AllKeysPanel formula={def.formula} name={def.short} />
      <References entries={SCALE_REFERENCES} />
    </div>
  );
}

export function keyboardMarks(scale: ScaleNote[], rootPc: number): Record<number, KeyMark> {
  const marks: Record<number, KeyMark> = {};
  for (const note of scale) {
    marks[rootPc + note.semis] = { label: note.label, caption: note.name, root: note.semis === 0 };
  }
  marks[rootPc + 12] = { label: "R", caption: scale[0].name, root: true };
  return marks;
}

export function ScaleFacts({ scale }: { scale: ScaleNote[] }) {
  const steps = stepSizes(scale.map((s) => s.semis));
  const items = [
    { label: "Formula", value: scale.map((s, i) => (i === 0 ? "1" : s.label)).join(" ") },
    { label: "Intervals", value: scale.map((s) => s.interval).join(" ") },
    { label: "Steps", value: steps.map(stepLabel).join(" ") },
    { label: "Notes", value: scale.map((s) => s.name).join(" ") },
  ];
  return (
    <FactGrid className="mt-6">
      {items.map((item) => (
        <Fact key={item.label} label={item.label} value={item.value} />
      ))}
    </FactGrid>
  );
}

export function NeckPanel({
  rootPc,
  scale,
  title,
  positions,
}: {
  rootPc: number;
  scale: ScaleNote[];
  title: string;
  positions?: { perString: number; label: string };
}) {
  const [labelMode] = useFretLabel();
  const [position, setPosition] = useState(0);
  const [construction, setConstruction] = useState<"double" | "continuous">("double");
  const semis = scale.map((s) => s.semis);
  const notes = neckNotes(rootPc, semis, 15);
  const canPosition = positions && (scale.length === 5 || scale.length === 7);
  const count = canPosition ? scale.length : 0;
  const active = position > 0 && position <= count ? position : 0;
  const useDouble = scale.length === 7 && positions?.perString === 3 && construction === "double";
  const highlight = active ? useDouble ? doubleNotePosition(rootPc, semis, active - 1) : scalePosition(rootPc, semis, active - 1, positions!.perString) : undefined;
  const duplicates = useDouble && highlight ? [highlight[11], highlight[12]] : [];
  const label = (i: number) =>
    labelMode === "note" ? scale[i].name : labelMode === "interval" ? scale[i].interval : scale[i].label;

  // Positions can climb past fret 15; show the neck long enough to hold them.
  const maxFret = Math.max(15, ...(highlight ?? []).map((n) => n.fret));
  const shown = maxFret > 15 ? neckNotes(rootPc, semis, maxFret) : notes;

  return (
    <Panel
      title="On the neck"
      description={canPosition ? `Generated fingerings by starting degree on low E. Use the source atlas for the book's exact numbered boxes.` : "Every place the scale falls, frets 0–15."}
      action={<FretLabelToggle />}
    >
      {scale.length === 7 && positions?.perString === 3 && <Segmented className="mb-4" label="Fingering construction" value={construction} onChange={setConstruction} options={[{ value: "double", label: "Double Note" }, { value: "continuous", label: "Continuous 3NPS" }]} />}
      {canPosition && (
        <Segmented
          label="Position"
          size="sm"
          value={active}
          onChange={setPosition}
          className="mb-4"
          options={[
            { value: 0, label: "Whole neck" },
            ...Array.from({ length: count }, (_, i) => ({
              value: i + 1,
              label: `Start ${scale[i].label}`,
              title: `Position ${i + 1}: starts on the ${scale[i].label === "R" ? "root" : scale[i].label} on the low E string`,
            })),
          ]}
        />
      )}
      <Fretboard
        notes={shown}
        frets={maxFret}
        label={label}
        highlight={highlight}
        duplicates={duplicates}
        title={`${title} across the guitar neck${active ? `, position ${active}` : ""}`}
      />
      {active > 0 && (
        <p className="text-muted-foreground mt-3 text-xs">
          Position {active} starts on {scale[active - 1].name} ({scale[active - 1].label === "R" ? "the root" : scale[active - 1].label}) on the low E string, {positions!.perString} notes per string.
          {useDouble && " Triangles mark the same sounding pitch at the end of G and start of B. Play both for shape practice or omit one in a melodic ascent."}
        </p>
      )}
    </Panel>
  );
}

export function HarmonyPanel({ scale, title, theoretical = false }: { scale: ScaleNote[]; title: string; theoretical?: boolean }) {
  const chords = harmonize(scale);
  return (
    <Panel title={theoretical ? "Theoretical harmony from stacked thirds" : "Harmony"} description={theoretical ? "These chords follow the strict mode spelling. For the altered scale's jazz use, refer to the dominant-application panel above." : `Triads and seventh chords built on each degree of ${title}, by stacking 3rds.`}>
      <SimpleTable
        columns={["Degree", "Triad", "Quality", "Seventh", "Harmonic formula", "Chord tones"]}
        rows={chords.map((c) => [
          c.roman,
          c.triad,
          <span key="q" className="text-muted-foreground">
            {c.triadQuality}
          </span>,
          c.seventh,
          c.seventhNumeral,
          <span key="n" className="text-muted-foreground">
            {c.notes.join(" ")}
          </span>,
        ])}
      />
    </Panel>
  );
}

export function AllKeysPanel({ formula, name }: { formula: string[]; name: string }) {
  const degrees = formula.map(parseDegree);
  const sevenNotes = formula.length === 7;
  const [view, setView] = useState<"notes" | "chords">("notes");
  const rows = ROOTS.map((r) => {
    const scale = buildScale(spellRoot(r.pc, degrees), degrees);
    const cells = view === "chords" && sevenNotes ? harmonize(scale).map((c) => c.triad) : scale.map((s) => s.name);
    return { cells };
  });
  const header =
    view === "chords" && sevenNotes
      ? harmonize(buildScale(spellRoot(0, degrees), degrees)).map((c) => c.triadNumeral)
      : buildScale(spellRoot(0, degrees), degrees).map((s, i) => (i === 0 ? "R" : s.label));

  return (
    <Panel
      title={`${name} in every key`}
      description="One spelling per pitch class, chosen to favour fewer and simpler accidentals. Not every collection has one conventional key signature."
      action={
        sevenNotes ? (
          <Segmented
            label="Show"
            size="sm"
            value={view}
            onChange={setView}
            options={[
              { value: "notes", label: "Notes" },
              { value: "chords", label: "Chords" },
            ]}
          />
        ) : undefined
      }
    >
      <SimpleTable columns={header} firstColumnHeader rows={rows.map((r) => r.cells)} />
    </Panel>
  );
}
