"use client";
import { useQueryState } from "@/lib/use-query-state";
import { buildScale, modeDegrees, parseDegree, prettyDegree, spellRoot } from "@/lib/music/theory";
import { MODE_FAMILIES } from "@/lib/music/modes";
import { centsBetween, centsFrequency, midiFrequency, type SoundEvent } from "@/lib/music/sound";
import { Panel } from "@/components/app/panel";
import { Fact, FactGrid } from "@/components/app/facts";
import { Segmented } from "@/components/ui/segmented";
import { SimpleTable } from "@/components/ui/table";
import { TheoryBookSource } from "@/components/content/theory-book-source";
import { RootPicker, useRootParam } from "./controls";
import { StudySelect } from "./study-controls";
import { ScorePlayer } from "./score-player";

const INTERVALS = ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7", "8"];
export function ListeningLab() {
  const [tabValue, setTab] = useQueryState("tab", "intervals"); const tab = ["intervals", "modes", "tuning", "expression"].includes(tabValue) ? tabValue : "intervals";
  const [rootPc, setRoot] = useRootParam(0); const [intervalValue, setInterval] = useQueryState("interval", "3"); const interval = INTERVALS.includes(intervalValue) ? intervalValue : "3";
  const [directionValue, setDirection] = useQueryState("direction", "ascending"); const direction = ["ascending", "descending", "harmonic"].includes(directionValue) ? directionValue : "ascending";
  const root = spellRoot(rootPc, [parseDegree("1"), parseDegree(interval)]); const pair = buildScale(root, [parseDegree("1"), parseDegree(interval)]);
  const midis = pair.map((n) => 60 + rootPc + n.semis); const ordered = direction === "descending" ? [...midis].reverse() : midis;
  const intervalEvents = ordered.map((midi, i) => ({ at: direction === "harmonic" ? 0 : i, duration: direction === "harmonic" ? 2 : 0.85, midi, velocity: 0.05 }));
  const [familyId, setFamily] = useQueryState("family", "major"); const family = MODE_FAMILIES.find((f) => f.id === familyId) ?? MODE_FAMILIES[0];
  const [modeId, setMode] = useQueryState("mode", "dorian"); const mode = family.modes.find((m) => m.id === modeId) ?? family.modes[0];
  const formula = modeDegrees(family.parentFormula.map(parseDegree), mode.start); const modalRoot = spellRoot(rootPc, formula); const tones = buildScale(modalRoot, formula);
  const line = [...tones.map((n) => 60 + rootPc + n.semis), 72 + rootPc, ...tones.slice(0, -1).reverse().map((n) => 60 + rootPc + n.semis)];
  const modalBeats = line.length * 0.5 + 1; const modalEvents: SoundEvent[] = [{ at: 0, duration: modalBeats, midi: 48 + rootPc, wave: "sine", velocity: 0.045 }, ...line.map((midi, i) => ({ at: i * 0.5, duration: 0.44, midi, velocity: 0.055 }))];
  const [referenceValue, setReference] = useQueryState("reference", "440"); const reference = Math.max(400, Math.min(480, Number(referenceValue) || 440));
  const [centsValue, setCents] = useQueryState("cents", "100"); const cents = Math.max(-1200, Math.min(1200, Number(centsValue) || 0)); const comparison = centsFrequency(reference, cents);
  const [octaveValue, setOctave] = useQueryState("octave", "4"); const octave = Math.max(2, Math.min(6, Number(octaveValue) || 4)); const tunedA = midiFrequency(12 * (octave + 1) + 9, reference);
  const tuningEvents: SoundEvent[] = [{ at: 0, duration: 1.8, frequency: reference, wave: "sine" }, { at: 2, duration: 1.8, frequency: comparison, wave: "sine" }, { at: 4, duration: 2, frequency: reference, wave: "sine", velocity: 0.035 }, { at: 4, duration: 2, frequency: comparison, wave: "sine", velocity: 0.035 }];
  const [waveValue, setWave] = useQueryState("wave", "triangle"); const wave = waveValue === "sine" || waveValue === "sawtooth" ? waveValue : "triangle";
  const [articulation, setArticulation] = useQueryState("articulation", "detached"); const [contour, setContour] = useQueryState("dynamics", "crescendo");
  const motif = [0, 2, 4, 7, 9, 7, 4, 0]; const expressionEvents = motif.map((offset, i) => ({ at: i * 0.5, duration: articulation === "connected" ? 0.51 : 0.2, midi: 60 + rootPc + offset, wave, velocity: contour === "steady" ? 0.045 : 0.018 + (contour === "diminuendo" ? 7 - i : i) * 0.007 }));
  return <div className="flex flex-col gap-5">
    <Panel title="Hear relationships" description="These are synthesized study examples. Listen quietly, sing the target, and then reproduce it on your instrument.">
      <Segmented label="Listening view" value={tab} onChange={setTab} options={[{ value: "intervals", label: "Intervals" }, { value: "modes", label: "Modes & drone" }, { value: "tuning", label: "Tuning & cents" }, { value: "expression", label: "Expression" }]} />
      {tab !== "tuning" && <RootPicker className="mt-5" value={rootPc} onChange={setRoot} />}
    </Panel>
    {tab === "intervals" && <Panel title="Melodic and harmonic intervals" description="Descending playback reverses these same two pitches; their written interval relationship stays the same. The names follow letter spelling.">
      <div className="grid gap-4 sm:grid-cols-2"><StudySelect label="Interval above root" value={interval} onChange={setInterval} options={INTERVALS.map((d) => ({ value: d, label: prettyDegree(d) }))} /><StudySelect label="Interval playback" value={direction} onChange={setDirection} options={["ascending", "descending", "harmonic"].map((d) => ({ value: d, label: d }))} /></div>
      <div className="my-5"><FactGrid><Fact label="Written pair" value={pair.map((t) => t.name).join(" → ")} /><Fact label="Semitones" value={pair[1].semis} /></FactGrid></div>
      <ScorePlayer key={`${rootPc}-${interval}-${direction}`} events={intervalEvents} beats={3} label="Play interval" />
      <p className="mt-4 text-sm text-muted-foreground">Try singing the second pitch before playback. Compare a minor third, major third and perfect fifth without changing the root.</p>
    </Panel>}
    {tab === "modes" && <Panel title={`${tones[0].name} ${mode.name}`} description="The bass holds the selected tonic while the melody ascends and descends. Keep that tonic in your ear when changing modes; a scale's first note alone does not establish a modal centre.">
      <div className="grid gap-4 sm:grid-cols-2"><StudySelect label="Listening mode family" value={family.id} onChange={setFamily} options={MODE_FAMILIES.map((f) => ({ value: f.id, label: f.short }))} /><StudySelect label="Listening mode" value={mode.id} onChange={setMode} options={family.modes.map((m) => ({ value: m.id, label: m.name }))} /></div>
      <p className="my-4 text-sm">{mode.summary}</p><SimpleTable columns={["Degree", "Note", "Semitones"]} rows={tones.map((n) => [n.label, n.name, n.semis])} />
      <div className="mt-5"><ScorePlayer key={`${rootPc}-${family.id}-${mode.id}`} events={modalEvents} beats={modalBeats} label="Play mode over tonic drone" /></div>
      <p className="mt-4 text-sm text-muted-foreground">Practice: sing the tonic, then the third and seventh (when present). Compare parallel modes and resolve a short phrase to the held tonic. This supplies the app's own example rather than reproducing the book's recordings.</p>
    </Panel>}
    {tab === "tuning" && <Panel title="Frequency ratios and cents" description="A semitone is exactly 100 cents in twelve-tone equal temperament. Frequency changes exponentially: f₂ = f₁ × 2^(cents/1200).">
      <div className="grid gap-4 sm:grid-cols-3"><label className="text-sm font-medium">Reference A4 (Hz)<input aria-label="Reference A4 frequency" className="mt-2 block w-full rounded-md border p-2" type="number" min={400} max={480} value={reference} onChange={(e) => setReference(e.target.value)} /></label><label className="text-sm font-medium">Displacement (cents)<input aria-label="Tuning cents" className="mt-2 block w-full rounded-md border p-2" type="number" min={-1200} max={1200} value={cents} onChange={(e) => setCents(e.target.value)} /></label><StudySelect label="A octave" value={String(octave)} onChange={setOctave} options={[2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `A${n}` }))} /></div>
      <div className="my-5"><FactGrid><Fact label="Comparison frequency" value={`${comparison.toFixed(3)} Hz`} /><Fact label="Measured distance" value={`${centsBetween(reference, comparison).toFixed(1)} cents`} /><Fact label={`A${octave} at this reference`} value={`${tunedA.toFixed(3)} Hz`} /><Fact label="Octave ratio" value="2 : 1 · 1,200 cents" /></FactGrid></div>
      <ScorePlayer key={`${reference}-${cents}`} events={tuningEvents} beats={6} label="Compare tuning pitches" /><p className="mt-4 text-sm text-muted-foreground">You hear the reference, the shifted pitch, then both together. Small differences produce beating. The octave readout is a separate calculation; changing it does not change this comparison.</p>
    </Panel>}
    {tab === "expression" && <Panel title="One motif, different expression" description="Hold the pitches constant while changing tone, note length and loudness. Oscillators illustrate timbre differences; they do not imitate instrumental extended techniques.">
      <div className="grid gap-4 sm:grid-cols-3"><StudySelect label="Timbre" value={wave} onChange={setWave} options={[{ value: "sine", label: "Pure · sine" }, { value: "triangle", label: "Soft · triangle" }, { value: "sawtooth", label: "Bright · sawtooth" }]} /><StudySelect label="Articulation" value={articulation} onChange={setArticulation} options={[{ value: "detached", label: "Detached" }, { value: "connected", label: "Connected" }]} /><StudySelect label="Dynamic contour" value={contour} onChange={setContour} options={[{ value: "crescendo", label: "Crescendo" }, { value: "diminuendo", label: "Diminuendo" }, { value: "steady", label: "Steady" }]} /></div>
      <p className="my-5 text-sm">Motif: 1 2 3 5 6 5 3 1 · eight equal attacks.</p><ScorePlayer key={`${rootPc}-${wave}-${articulation}-${contour}`} events={expressionEvents} beats={4.5} label="Play expressive motif" />
    </Panel>}
    <TheoryBookSource pages="18–27, 39–44, 69–71, 169–171" />
  </div>;
}
