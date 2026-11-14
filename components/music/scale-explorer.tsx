"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { getScale } from "@/lib/music/scales";
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
import { Panel } from "@/components/app/panel";
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
    <div className="flex flex-col gap-6">
      <Panel
        title={title}
        description={def.mood ?? def.family}
        action={
          def.modesHref ? (
            <Link
              href={def.modesHref}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-caption font-medium text-foreground hover:bg-muted"
            >
              See its modes <ArrowRight className="size-3.5" strokeWidth={1.75} aria-hidden />
            </Link>
          ) : undefined
        }
      >
        <RootPicker value={rootPc} onChange={setRootPc} className="mb-6" />
        <StepPattern scale={scale} />
        <ScaleFacts scale={scale} />
      </Panel>

      <Panel title="From your notes">{notes}</Panel>

      <NeckPanel
        rootPc={rootPc}
        scale={scale}
        title={title}
        positions={def.positions}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
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
      {def.harmonicFormula && (
        <Panel title="Harmonic formula" description="Chords that fit over each note of the scale, from your notes.">
          <p className="text-body font-medium">{def.harmonicFormula}</p>
        </Panel>
      )}

      <AllKeysPanel formula={def.formula} name={def.short} />
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
    <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="bg-card px-4 py-3">
          <dt className="text-[13px] text-muted-foreground">{item.label}</dt>
          <dd className="mt-0.5 text-body font-medium tracking-[0.01em]">{item.value}</dd>
        </div>
      ))}
    </dl>
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
  const semis = scale.map((s) => s.semis);
  const notes = neckNotes(rootPc, semis, 15);
  const canPosition = positions && (scale.length === 5 || scale.length === 7);
  const count = canPosition ? scale.length : 0;
  const active = position > 0 && position <= count ? position : 0;
  const highlight = active ? scalePosition(rootPc, semis, active - 1, positions!.perString) : undefined;
  const label = (i: number) =>
    labelMode === "note" ? scale[i].name : labelMode === "interval" ? scale[i].interval : scale[i].label;

  // Positions can climb past fret 15; show the neck long enough to hold them.
  const maxFret = Math.max(15, ...(highlight ?? []).map((n) => n.fret));
  const shown = maxFret > 15 ? neckNotes(rootPc, semis, maxFret) : notes;

  return (
    <Panel
      title="On the neck"
      description={canPosition ? `Whole neck, or one of the ${count} positions (${positions!.label}).` : "Every place the scale falls, frets 0–15."}
      action={<FretLabelToggle />}
    >
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
              label: `P${i + 1}`,
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
        title={`${title} across the guitar neck${active ? `, position ${active}` : ""}`}
      />
      {active > 0 && (
        <p className="mt-3 text-caption text-muted-foreground">
          Position {active} starts on {scale[active - 1].name} ({scale[active - 1].label === "R" ? "the root" : scale[active - 1].label}) on the low E string, {positions!.perString} notes per string.
        </p>
      )}
    </Panel>
  );
}

export function HarmonyPanel({ scale, title }: { scale: ScaleNote[]; title: string }) {
  const chords = harmonize(scale);
  return (
    <Panel title="Harmony" description={`Triads and seventh chords built on each degree of ${title}, by stacking 3rds.`}>
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
      description="Each key spelled with its usual key signature (fewest sharps or flats)."
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
