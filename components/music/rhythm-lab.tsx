"use client";

import { titleCaseLabel } from "@/lib/title-case";
import { useQueryState } from "@/lib/use-query-state";
import { compileRhythm, crossRhythm, METERS, meterPulses, RHYTHM_EXERCISES, RHYTHM_UNITS, unitCells } from "@/lib/music/rhythm";
import type { SoundEvent } from "@/lib/music/sound";
import { Panel } from "@/components/app/panel";
import { SimpleTable } from "@/components/ui/table";
import { Segmented } from "@/components/ui/segmented";
import { buttonVariants } from "@/components/ui/button";
import { TheoryBookSource } from "@/components/content/theory-book-source";
import { References } from "@/components/content/references";
import { StudySelect } from "./study-controls";
import { ScorePlayer } from "./score-player";

function UnitStrip({ id }: { id: number }) {
  const unit = RHYTHM_UNITS[id - 1];
  return <div role="img" aria-label={`${unit.name}: ${unit.count}. Parentheses hold the preceding note; brackets are silent.`} className="grid grid-cols-12 gap-0.5">{unitCells(id).map((cell, i) => <span key={i} aria-hidden className={`grid h-6 place-items-center rounded-sm text-xs ${cell === "attack" ? "bg-primary text-primary-foreground" : cell === "hold" ? "bg-primary/15 text-primary" : "border border-dashed text-muted-foreground"}`}>{cell === "attack" ? "●" : cell === "hold" ? "—" : "·"}</span>)}</div>;
}
export function RhythmLab() {
  const [tabValue, setTab] = useQueryState("tab", "builder"); const tab = ["builder", "meter", "cross-rhythms"].includes(tabValue) ? tabValue : "builder";
  const [tempo, setTempo] = useQueryState("bpm", "72"); const bpm = Math.max(30, Math.min(200, Number(tempo) || 72));
  const defaultPattern = RHYTHM_EXERCISES[0].bars.flat().join(","); const [pattern, setPattern] = useQueryState("pattern", defaultPattern);
  const candidate = pattern.split(",").map(Number); const cells = candidate.length === 16 && candidate.every((n) => Number.isInteger(n) && n >= 1 && n <= 17) ? candidate : RHYTHM_EXERCISES[0].bars.flat();
  const bars = Array.from({ length: 4 }, (_, i) => cells.slice(i * 4, i * 4 + 4));
  const events: SoundEvent[] = compileRhythm(bars).filter((e) => !e.rest).map((e) => ({ at: e.tick / 12, duration: e.ticks / 12 * 0.93, midi: 60, velocity: 0.065 }));
  for (let i = 0; i < 16; i++) events.push({ at: i, duration: 0.055, frequency: i % 4 === 0 ? 1100 : 850, velocity: i % 4 === 0 ? 0.045 : 0.025, wave: "sine" });
  const [meterId, setMeter] = useQueryState("meter", "6-8"); const meter = meterPulses(meterId);
  const meterEvents: SoundEvent[] = [0, 1].flatMap((bar) => meter.pulses.map((pulse) => ({ at: bar * meter.beats + pulse.at, duration: 0.1, frequency: pulse.first ? 1150 : pulse.strong ? 850 : 550, velocity: pulse.strong ? 0.08 : 0.035, wave: "sine" as const })));
  const [ratioValue, setRatio] = useQueryState("ratio", "3:2"); const ratio = ["3:2", "4:3", "5:4", "7:3"].includes(ratioValue) ? ratioValue : "3:2"; const [a, b] = ratio.split(":").map(Number);
  const [crossKindValue, setCrossKind] = useQueryState("cross", "polyrhythm"); const crossKind = crossKindValue === "polymeter" ? "polymeter" : "polyrhythm";
  const cross = crossRhythm(a, b, crossKind);
  const crossEvents: SoundEvent[] = [0, 1].flatMap((cycle) => cross.tracks.flatMap((track, layer) => track.map((hit) => ({ at: cycle * cross.beats + hit.at, duration: 0.13, frequency: layer ? 460 : 740, pan: layer ? 0.65 : -0.65, velocity: hit.accent ? 0.08 : 0.025, wave: "sine" as const }))));
  return <div className="flex flex-col gap-5">
    <Panel title="Keep the pulse, change the pattern" description="Tempo here is measured in quarter-note units per minute. Sound durations, attacks and rests are generated from exact subdivision values.">
      <Segmented label="Rhythm lab view" value={tab} onChange={setTab} options={[{ value: "builder", label: "17 units & four-bar builder" }, { value: "meter", label: "Meter comparison" }, { value: "cross-rhythms", label: "Cross-rhythms" }]} />
      <label className="mt-5 block text-sm font-medium">{titleCaseLabel(<>Tempo · {bpm} quarter notes/min<input aria-label="Rhythm tempo" type="range" min={30} max={200} value={bpm} onChange={(e) => setTempo(e.target.value)} className="mt-3 block w-full max-w-xs accent-primary" /></>)}</label>
    </Panel>
    {tab === "builder" ? <>
      <Panel title="Four-bar rhythm builder" description="Each cell is one quarter-note beat in 4/4. Replace units, load a source exercise, then play the complete sixteen-beat phrase. Your arrangement stays in the URL.">
        <div className="mb-5 flex flex-wrap gap-2">{RHYTHM_EXERCISES.map((e) => <button key={e.id} type="button" onClick={() => setPattern(e.bars.flat().join(","))} className={buttonVariants({ variant: "outline", size: "sm" })}>{titleCaseLabel(<>{e.name}</>)}</button>)}</div>
        <div className="space-y-5">{bars.map((bar, row) => <div key={row}><h3 className="mb-2 text-sm font-semibold">{titleCaseLabel(<>Bar {row + 1}</>)}</h3><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{bar.map((id, beat) => <div key={beat} className="min-w-0 space-y-3 rounded-xl border p-3"><StudySelect label={`Bar ${row + 1}, beat ${beat + 1}`} value={String(id)} onChange={(value) => setPattern(cells.map((n, i) => i === row * 4 + beat ? Number(value) : n).join(","))} options={RHYTHM_UNITS.map((u) => ({ value: String(u.id), label: `${u.id}. ${u.name}` }))} /><UnitStrip id={id} /><p className="text-xs text-muted-foreground">{RHYTHM_UNITS[id - 1].count.replace("1", String(beat + 1))}</p></div>)}</div></div>)}</div>
        <p className="my-4 text-sm text-muted-foreground">● Attack · — Hold · · Rest. The twelve-cell strip represents one beat; sixteenths begin at cells 1/4/7/10, triplets at 1/5/9.</p>
        <ScorePlayer key={`${pattern}-${bpm}`} events={events} beats={16} bpm={bpm} label="Play four bars" />
        <p className="mt-4 text-xs text-muted-foreground">Source sequence 2, final beat: a sixteenth rest plus dotted eighth, correcting the missing dot in PDF p. 220&apos;s summary.</p>
      </Panel>
      <Panel title="All 17 source rhythm units" description="Choose a unit to practice it on every beat of all four bars. Every unit totals one quarter-note beat; sounding time and silence remain distinct.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{RHYTHM_UNITS.map((unit) => <button type="button" key={unit.id} onClick={() => setPattern(Array(16).fill(unit.id).join(","))} className="space-y-3 rounded-xl border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5">{titleCaseLabel(<><p className="text-sm font-semibold">{unit.id}. {unit.name}</p><UnitStrip id={unit.id} /><p className="text-xs text-muted-foreground">{unit.count} · PDF p. {unit.page}</p></>)}</button>)}</div>
      </Panel>
    </> : tab === "meter" ? <Panel title="Hear the grouping" description="3/4 and 6/8 both contain six eighths. Keep their total duration fixed here and listen to three groups of two versus two groups of three.">
      <StudySelect label="Meter" value={meter.meter.id} onChange={setMeter} options={METERS.map((m) => ({ value: m.id, label: m.name }))} />
      <p className="my-4 text-sm">{meter.meter.numerator} written {meter.meter.denominator === 8 ? "eighth" : "quarter"}-note units · grouping {meter.meter.groups.join("+")} · {meter.beats} quarter-note units per bar.</p>
      <div className="mb-5 grid gap-2" style={{ gridTemplateColumns: `repeat(${meter.pulses.length}, minmax(0,1fr))` }}>{meter.pulses.map((pulse, i) => <span key={i} className={`grid h-12 place-items-center rounded-lg border text-sm ${pulse.strong ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{i + 1}</span>)}</div>
      <ScorePlayer key={`${meterId}-${bpm}`} events={meterEvents} beats={meter.beats * 2} bpm={bpm} label="Play two bars of this meter" />
    </Panel> : <Panel title="Shared span or shared pulse?" description="Polyrhythm divides one span into different equal groups. Polymeter shares a pulse while bar accents cycle at different lengths.">
      <div className="grid gap-4 sm:grid-cols-2"><StudySelect label="Layer ratio" value={ratio} onChange={setRatio} options={["3:2", "4:3", "5:4", "7:3"].map((value) => ({ value, label: value }))} /><StudySelect label="Relationship" value={crossKind} onChange={setCrossKind} options={[{ value: "polyrhythm", label: "Polyrhythm · shared four-beat cycle" }, { value: "polymeter", label: "Polymeter · shared quarter-note pulse" }]} /></div>
      <p className="my-4 text-sm">{crossKind === "polyrhythm" ? `${a} evenly spaced attacks against ${b}, both spanning four quarter-note units.` : `Bar accents every ${a} and ${b} shared pulses; starts realign after ${cross.grid} pulses.`}</p>
      <svg role="img" aria-label={`${ratio} ${crossKind}, ${cross.grid}-part alignment grid`} viewBox="0 0 840 130" className="mb-4 h-auto w-full">{cross.tracks.map((track, layer) => <g key={layer}><text x={8} y={40 + layer * 60} fill="var(--foreground)" fontSize={15}>Layer {layer + 1}</text><line x1={100} x2={825} y1={35 + layer * 60} y2={35 + layer * 60} stroke="var(--border)" />{track.map((hit, i) => <circle key={i} cx={110 + hit.slot / cross.grid * 700} cy={35 + layer * 60} r={hit.accent ? 9 : 5} fill={layer ? "var(--foreground)" : "var(--primary)"} />)}</g>)}</svg>
      <SimpleTable columns={["Layer", "Attack positions (quarter-note units)"]} rows={cross.tracks.map((track, i) => [`Layer ${i + 1}`, track.map((hit) => `${Number(hit.at.toFixed(3))}${hit.accent ? "*" : ""}`).join(" · ")])} />
      <div className="mt-4"><ScorePlayer key={`${ratio}-${crossKind}-${bpm}`} events={crossEvents} beats={cross.beats * 2} bpm={bpm} label="Play two alignment cycles" /></div>
    </Panel>}
    <TheoryBookSource pages="149–168, 219–220" /><References entries={[{ title: "University of Puget Sound · Meter", href: "https://musictheory.pugetsound.edu/mt21c/meter.html" }]} />
  </div>;
}
