"use client";
import { useQueryState } from "@/lib/use-query-state";
import { leadVoices, PROGRESSIONS, realizeProgression, TRANSFORMATIONS, transformProgression } from "@/lib/music/progressions";
import { noteWithOctave, pc } from "@/lib/music/theory";
import type { SoundEvent } from "@/lib/music/sound";
import { Panel } from "@/components/app/panel";
import { SimpleTable } from "@/components/ui/table";
import { Segmented } from "@/components/ui/segmented";
import { Fact, FactGrid } from "@/components/app/facts";
import { TheoryBookSource } from "@/components/content/theory-book-source";
import { References } from "@/components/content/references";
import { RootPicker, useRootParam } from "./controls";
import { StudySelect } from "./study-controls";
import { ScorePlayer } from "./score-player";
import { ChordStrip } from "@/components/visuals/chord-grips";
import { PROGRESSION_QUALITIES } from "@/lib/music/progressions";

export function ProgressionExplorer() {
  const [rootPc, setRootPc] = useRootParam(0); const [id, setId] = useQueryState("progression", "common-1"); const preset = PROGRESSIONS.find((p) => p.id === id) ?? PROGRESSIONS[0];
  const [tabValue, setTab] = useQueryState("tab", "progression"); const tab = ["progression", "reharmonize", "voices"].includes(tabValue) ? tabValue : "progression";
  const [kindValue, setKind] = useQueryState("change", "tritone"); const kind = TRANSFORMATIONS.some((t) => t.id === kindValue) ? kindValue : "original";
  const [bpmValue, setBpm] = useQueryState("bpm", "72"); const bpm = Math.max(35, Math.min(180, Number(bpmValue) || 72));
  const steps = tab === "reharmonize" ? transformProgression(preset.steps, kind) : preset.steps;
  const original = realizeProgression(rootPc, preset.steps); const chords = realizeProgression(rootPc, steps); const voices = leadVoices(rootPc, steps);
  const total = steps.reduce((sum, s) => sum + s.beats, 0);
  function score(voiceSets: number[][]): SoundEvent[] { let at = 0; return chords.flatMap((chord, i) => { const start = at; at += chord.beats; return voiceSets[i].map((midi) => ({ at: start, duration: chord.beats * 0.9, midi, velocity: 0.035 })); }); }
  const noteNames = (index: number, notes: number[]) => notes.map((midi) => { const tone = chords[index].tones.find((t) => pc(t.note) === midi % 12)!; return noteWithOctave(tone.note, midi); }).join(" ");
  return <div className="flex flex-col gap-5">
    <Panel title="Choose a progression" description="Transpose the same chord relationships, then compare colour, harmonic duration and voice movement.">
      <Segmented label="Progression view" value={tab} onChange={setTab} options={[{ value: "progression", label: "Progression & transposition" }, { value: "reharmonize", label: "Reharmonize" }, { value: "voices", label: "Voice leading" }]} className="mb-5" />
      <RootPicker value={rootPc} onChange={setRootPc} className="mb-5" />
      <div className="grid gap-4 sm:grid-cols-2"><StudySelect label="Progression preset" value={preset.id} onChange={setId} options={PROGRESSIONS.map((p) => ({ value: p.id, label: p.name }))} />{tab === "reharmonize" && <StudySelect label="Reharmonization method" value={kind} onChange={setKind} options={TRANSFORMATIONS.map((t) => ({ value: t.id, label: t.name }))} />}</div>
      <label className="mt-4 block text-sm font-medium">Tempo · {bpm} BPM<input aria-label="Progression tempo" type="range" min={35} max={180} value={bpm} onChange={(e) => setBpm(e.target.value)} className="mt-2 block w-64 max-w-full accent-primary" /></label>
    </Panel>
    <Panel title={chords.map((c) => c.name).join(" – ")} description={preset.source}>
      {tab === "reharmonize" && <p className="mb-4 text-sm text-muted-foreground">Original: {original.map((c) => c.name).join(" – ")}. The original and new version both span {total} quarter-note beats. If the chosen progression has no applicable target chord, that operation leaves it unchanged.</p>}
      <ChordStrip label="Chord shapes for this progression" chords={chords.map((c) => ({ name: c.name, caption: c.roman, rootPc: pc(c.root), formula: PROGRESSION_QUALITIES[c.quality].formula }))} />
      <div className="mt-4" />
      <SimpleTable columns={["Step", "Roman", "Chord", "Beats", "Chord tones"]} rows={chords.map((c, i) => [String(i + 1), c.roman, c.name, Number(c.beats.toFixed(3)).toString(), c.tones.map((n) => n.name).join(" ")])} />
      <div className="mt-5"><ScorePlayer key={`${rootPc}-${id}-${kind}-${tab}-${bpm}`} events={score(tab === "voices" ? voices.selected : voices.baseline)} beats={total} bpm={bpm} label={tab === "voices" ? "Hear smooth voice leading" : "Hear progression"} /></div>
    </Panel>
    {tab === "voices" && <Panel title="Compare four-voice arrangements" description="The second arrangement minimizes total ordered-voice motion among a bounded set of close voicings. Triads double a chord tone. This is a keyboard-style study, not a claim of one universally best guitar fingering.">
      <FactGrid><Fact label="Root-position motion" value={`${voices.baselineMotion} total semitones`} /><Fact label="Selected voice-leading motion" value={`${voices.selectedMotion} total semitones`} /></FactGrid>
      <SimpleTable columns={["Chord", "Root-position voices", "Selected voices", "Voice changes from previous"]} rows={chords.map((c, i) => [c.name, noteNames(i, voices.baseline[i]), noteNames(i, voices.selected[i]), i ? voices.selected[i].map((midi, v) => { const delta = midi - voices.selected[i - 1][v]; return `${delta > 0 ? "+" : ""}${delta}`; }).join(" · ") : "Starting voicing"])} />
      <div className="mt-4"><ScorePlayer key={`baseline-${rootPc}-${id}-${bpm}`} events={score(voices.baseline)} beats={total} bpm={bpm} label="Hear root-position comparison" /></div>
    </Panel>}
    <Panel title="What to listen for"><p className="text-sm leading-6">Hear the tonic and each chord&apos;s third and seventh. Compare common tones, bass direction and the melody you might place above the changes. Major-key function families are useful guides; a borrowed chord, blues tonic or applied dominant needs its local context. A closer voicing or two shared notes alone does not guarantee a suitable substitution.</p><p className="mt-3 text-sm text-muted-foreground">The book&apos;s minor ii–v–i shorthand is expanded here as a clearly labeled minor iiø–V–i study. Twelve-bar blues durations and the major-third cycle are explicitly timed.</p></Panel>
    <TheoryBookSource pages="131–148, 176–178, 183–194" /><References entries={[{ title: "University of Puget Sound · Harmonic function", href: "https://musictheory.pugetsound.edu/mt21c/HarmonicFunction.html" }]} />
  </div>;
}
