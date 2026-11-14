"use client";

import { useState } from "react";
import { getFamily } from "@/lib/music/modes";
import { getScale } from "@/lib/music/scales";
import {
  buildScale,
  degreeSemitones,
  harmonize,
  modeDegrees,
  noteFromLetter,
  noteName,
  parseDegree,
  spellRoot,
  stepLabel,
  stepSizes,
  type Note,
} from "@/lib/music/theory";
import { useQueryState } from "@/lib/use-query-state";
import { cn } from "@/lib/utils";
import { Fact, FactGrid } from "@/components/app/facts";
import { Panel } from "@/components/app/panel";
import { StatusBadge } from "@/components/app/status-badge";
import { ScrollFade } from "@/components/ui/scroll-fade";
import { SEGMENTED_ITEM, SEGMENTED_ITEM_ACTIVE, SEGMENTED_TRACK, Segmented } from "@/components/ui/segmented";
import { TableWrap, tableCls, tdCls, thCls } from "@/components/ui/table";
import { RootPicker, useRootParam } from "./controls";
import { Keyboard } from "./keyboard";
import { HarmonyPanel, NeckPanel, keyboardMarks } from "./scale-explorer";
import { StepPattern } from "./step-pattern";

export function ModeExplorer({ familyId, modeNotes }: { familyId: string; modeNotes: Record<string, React.ReactNode> }) {
  const family = getFamily(familyId)!;
  const [modeId, setModeId] = useQueryState("mode", family.modes[0].id);
  const mode = family.modes.find((m) => m.id === modeId) ?? family.modes[0];
  const parent = family.parentFormula.map(parseDegree);
  const degrees = modeDegrees(parent, mode.start);

  // Default key: the doc's own example (C Ionian, D Dorian, … or A-based minors).
  const defaultPc = (family.exampleRoot + degreeSemitones(parent[mode.start])) % 12;
  const [rootPc, setRootPc] = useRootParam(defaultPc);
  const root = spellRoot(rootPc, degrees);
  const scale = buildScale(root, degrees);
  const parentRoot = noteFromLetter(root.letter - mode.start, rootPc - degreeSemitones(parent[mode.start]));
  const title = `${noteName(root)} ${mode.name.replace(/^Mode \d · /, "")}`;
  const chords = harmonize(scale);

  const facts: { label: string; value: string; wide?: boolean }[] = [
    { label: "Melodic formula", value: stepSizes(scale.map((s) => s.semis)).map(stepLabel).join(" ") },
    { label: "Intervallic formula", value: scale.map((s, i) => (i === 0 ? "1" : s.label)).join(" ") },
    { label: "Intervals", value: scale.map((s) => s.interval).join(" ") },
    {
      label: "Parent scale",
      value: `${noteName(parentRoot)} ${getScale(family.parentScaleId)?.short.toLowerCase() ?? ""} · mode ${mode.start + 1}`,
    },
  ];
  if (chords.length) {
    facts.push(
      { label: "Tonic triad · seventh", value: `${chords[0].triad} · ${chords[0].seventh}` },
      { label: "Dominant triad · seventh", value: `${chords[4].triad} · ${chords[4].seventh}` },
      { label: "Harmonic formula", value: chords.map((c) => c.seventhNumeral).join(" "), wide: true },
      { label: "Triads", value: chords.map((c) => c.triad).join(" · "), wide: true },
      { label: "Quadriads", value: chords.map((c) => c.seventh).join(" · "), wide: true },
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* The dashboards' segmented tab track; on phones it scrolls rather than wrapping into a wall. */}
      <ScrollFade>
        <div role="tablist" aria-label="Modes" className={cn("flex w-max min-w-full gap-1", SEGMENTED_TRACK)}>
          {family.modes.map((m) => {
            const selected = m.id === mode.id;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setModeId(m.id)}
                className={cn(
                  SEGMENTED_ITEM,
                  "min-w-32 flex-1 flex-col items-start gap-0 px-3 py-2 text-left",
                  selected && SEGMENTED_ITEM_ACTIVE,
                )}
              >
                <span className={cn("text-xs font-normal", selected ? "text-primary/80" : "text-muted-foreground")}>Mode {m.start + 1}</span>
                <span className="text-sm">{m.name.replace(/^Mode \d · /, "")}</span>
              </button>
            );
          })}
        </div>
      </ScrollFade>

      <Panel
        title={title}
        description={mode.summary}
        action={
          mode.aka?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {mode.aka.map((a) => (
                <StatusBadge key={a} tone="brand">
                  {a}
                </StatusBadge>
              ))}
            </div>
          ) : undefined
        }
      >
        <RootPicker value={rootPc} onChange={setRootPc} className="mb-6" />
        <StepPattern scale={scale} />
        <FactGrid className="mt-6">
          {facts.map((f) => (
            <Fact key={f.label} label={f.label} value={f.value} wide={f.wide} />
          ))}
        </FactGrid>
      </Panel>

      <Panel title="From your notes">{modeNotes[mode.id]}</Panel>

      <NeckPanel
        key={mode.id}
        rootPc={rootPc}
        scale={scale}
        title={title}
        positions={scale.length === 5 ? { perString: 2, label: "2 notes per string" } : { perString: 3, label: "3 notes per string" }}
      />

      <Panel title="On the keyboard" description="One octave from the root, with the degree on each key.">
        <Keyboard length={24} marks={keyboardMarks(scale, rootPc)} title={`${title} on a piano keyboard`} />
      </Panel>

      {scale.length === 7 && <HarmonyPanel scale={scale} title={title} />}

      <FamilyMatrix familyId={family.id} parentRoot={parentRoot} activeStart={mode.start} />
    </div>
  );
}

/*
 * Every mode of the family from the same parent key, laid on a 12-semitone
 * grid (the doc's "modes with their intervals and notes" tables).
 */
function FamilyMatrix({ familyId, parentRoot, activeStart }: { familyId: string; parentRoot: Note; activeStart: number }) {
  const family = getFamily(familyId)!;
  const [view, setView] = useState<"notes" | "degrees">("notes");
  const parent = family.parentFormula.map(parseDegree);
  const parentScale = buildScale(parentRoot, parent);
  const columns = ["R", "m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7", "8"];

  return (
    <Panel
      title={`All ${family.short.toLowerCase()} modes from ${noteName(parentRoot)}`}
      description="Same notes, different starting point. Each row is laid out by semitones above its own root."
      action={
        <Segmented
          label="Show"
          size="sm"
          value={view}
          onChange={setView}
          options={[
            { value: "notes", label: "Notes" },
            { value: "degrees", label: "Degrees" },
          ]}
        />
      }
    >
      <TableWrap>
        <table className={cn(tableCls, "min-w-[760px]")}>
          <thead>
            <tr>
              <th className={thCls}>Mode</th>
              {columns.map((c) => (
                <th key={c} className={cn(thCls, "px-0! text-center!")}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {family.modes.map((m) => {
              const degrees = modeDegrees(parent, m.start);
              const scale = buildScale(parentScale[m.start].note, degrees);
              const bySemi = new Map(scale.map((s) => [s.semis, s]));
              const active = m.start === activeStart;
              return (
                <tr key={m.id} aria-current={active || undefined} className={cn(active && "bg-primary/5 hover:bg-primary/10!")}>
                  <th scope="row" className={cn(tdCls, "font-medium whitespace-nowrap!", active && "text-primary!")}>
                    <span className="text-muted-foreground tabular-nums">{m.start + 1}.</span> {m.name.replace(/^Mode \d · /, "")}
                  </th>
                  {columns.map((_, semi) => {
                    const s = semi === 12 ? scale[0] : bySemi.get(semi);
                    return (
                      <td key={semi} className={cn(tdCls, "px-0! text-center")}>
                        {s ? (
                          <span
                            className={cn(
                              "font-medium",
                              semi === 0 && "bg-primary text-primary-foreground inline-grid min-w-7 place-items-center rounded-md px-1 py-0.5",
                            )}
                          >
                            {view === "notes" ? s.name : semi === 0 || semi === 12 ? "1" : s.label}
                          </span>
                        ) : (
                          <span aria-hidden className="text-muted-foreground/40">
                            ·
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>
    </Panel>
  );
}
