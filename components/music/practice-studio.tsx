"use client";

import Link from "next/link";
import { useState } from "react";
import { checkExerciseAnswer, exerciseQuestion, EXERCISE_TYPES } from "@/lib/music/exercises";
import { ROOT_SLUGS, ROOTS } from "@/lib/music/theory";
import { useQueryState } from "@/lib/use-query-state";
import { usePracticeSessions, usePracticeTasks } from "@/lib/store";
import { BookSource } from "@/components/content/book-source";
import { TheoryBookSource } from "@/components/content/theory-book-source";
import { References } from "@/components/content/references";
import { Panel } from "@/components/app/panel";
import { SimpleTable } from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { RootPicker, useRootParam } from "./controls";
import { StudySelect } from "./study-controls";
import { Metronome } from "./metronome";
import { AssignmentBank } from "./assignment-bank";

const FOCUSES = [
  { id: "listening", name: "Carter · listening & tuning", pages: "Carter 18–27, 39–44, 69–71", href: "/listening", task: "Sing an interval before playback; compare two parallel modes over the same tonic and reproduce the colour by ear." },
  { id: "rhythm", name: "Carter · rhythm & meter", pages: "Carter 149–168, 219–220", href: "/rhythm-lab", task: "Count, clap and play the 17 units. Reconstruct one source sequence; compare 3/4 and 6/8 accents." },
  { id: "progressions", name: "Carter · progressions & reharmonization", pages: "Carter 131–148, 183–194", href: "/progressions", task: "Transpose a progression, compare one substitute, and sing a voice through every chord change." },
  { id: "composition", name: "Carter · composition & expression", pages: "Carter 169–180", href: "/composition", task: "Create a four-bar motif, add space, change one detail and listen again against the harmony. Export the draft." },
  { id: "pentatonics", name: "Pentatonic & blues scales", pages: "18–26", href: "/scales/minor-pentatonic", task: "Play the five source boxes; compare major/minor pentatonic, blues, Kumoi, Pelog and Hirajoshi." },
  { id: "major", name: "Major modes", pages: "27–34", href: "/modes/major", task: "Play seven source boxes. Sing each mode's characteristic note over the root." },
  { id: "harmonic-minor", name: "Harmonic-minor modes", pages: "35–42", href: "/modes/harmonic-minor", task: "Play seven source boxes. Compare each mode with its major-family neighbour and identify the alteration." },
  { id: "melodic-minor", name: "Melodic-minor modes", pages: "43–50", href: "/modes/melodic-minor", task: "Play seven source boxes. Compare Dorian/ascending melodic minor and dominant/altered spellings." },
  { id: "symmetric", name: "Symmetric scales", pages: "51–57", href: "/scales/augmented", task: "Play the source positions; move a motif by the symmetry period and check that every pitch stays in the collection." },
  { id: "root-chords", name: "Root-position chord shapes", pages: "58–64", href: "/voicings", task: "Play the five source shapes for a triad and a seventh chord. Name omissions and mute unused strings." },
  { id: "drop-2", name: "Drop 2 voicings", pages: "65–73", href: "/voicings?voicing=drop-2", task: "Play four resulting inversions on each of the three adjacent-string sets. Name bass and top voice." },
  { id: "drop-3", name: "Drop 3 voicings", pages: "74–81", href: "/voicings?voicing=drop-3", task: "Play four resulting inversions on both skipped-string sets. Derive the spacing from a close voicing." },
  { id: "arpeggios", name: "Triad & seventh arpeggios", pages: "82–93", href: "/arpeggios", task: "Play seven source shapes for one triad and one seventh quality. Begin on each different chord tone." },
  { id: "harmonization", name: "Horizontal & vertical harmonization", pages: "94–95", href: "/harmonization", task: "Outline all seven diatonic arpeggios horizontally, then stay inside one fret region and repeat vertically." },
  { id: "improvisation", name: "Improvisation & substitutions", pages: "96–103", href: "/improvisation", task: "Choose one chord/scale or pentatonic substitution, target its colour and resolve a short phrase." },
];

function TheoryQuiz({ kind }: { kind: string }) {
  const [index, setIndex] = useState(0); const [input, setInput] = useState(""); const [result, setResult] = useState<boolean | null>(null); const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });
  const question = exerciseQuestion(kind, index);
  function check(event: React.FormEvent) {
    event.preventDefault(); if (!input.trim() || result !== null || revealed) return;
    const correct = checkExerciseAnswer(question, input); setResult(correct); setScore((s) => ({ correct: s.correct + Number(correct), attempted: s.attempted + 1 }));
  }
  function next() { setIndex((i) => i + 1); setInput(""); setResult(null); setRevealed(false); }
  return <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Question {index + 1} · {score.correct}/{score.attempted} correct in this drill</p>
    <h3 className="text-lg font-semibold">{question.prompt}</h3>
    <p className="text-sm text-muted-foreground">{question.hint}</p>
    <form onSubmit={check} className="flex flex-col gap-3 sm:flex-row">
      <label className="min-w-0 flex-1"><span className="sr-only">Your answer</span><input aria-label="Your answer" autoComplete="off" spellCheck={false} value={input} disabled={result !== null || revealed} onChange={(e) => setInput(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm" /></label>
      <button type="submit" disabled={!input.trim() || result !== null || revealed} className={buttonVariants()}>Check answer</button>
    </form>
    {(result !== null || revealed) && <div role="status" className={`rounded-xl border p-4 text-sm leading-6 ${result === true ? "border-success/40 bg-success/5" : "border-primary/30 bg-primary/5"}`}><p className="font-semibold">{revealed ? "Answer" : result ? "Correct" : "Review the spelling"}: {question.answer}</p><p>{question.explanation}</p>{revealed && <p className="text-muted-foreground">Revealed answers do not count toward your score.</p>}</div>}
    <div className="flex flex-wrap gap-3"><button type="button" className={buttonVariants({ variant: "outline" })} disabled={result !== null || revealed} onClick={() => setRevealed(true)}>Reveal answer</button><button type="button" className={buttonVariants({ variant: "soft" })} onClick={next}>Next question →</button></div>
  </div>;
}

export function PracticeStudio() {
  const [exercise, setExercise] = useQueryState("exercise", "intervals"); const kind = EXERCISE_TYPES.some((e) => e.value === exercise) ? exercise : "intervals";
  const [rootPc, setRootPc] = useRootParam(9); const [focusId, setFocus] = useQueryState("focus", "pentatonics"); const focus = FOCUSES.find((f) => f.id === focusId) ?? FOCUSES[0];
  const [tasks, setTasks] = usePracticeTasks(); const [sessions, setSessions] = usePracticeSessions(); const [minutes, setMinutes] = useState(20); const [bpm, setBpm] = useState(72); const [saved, setSaved] = useState(false);
  const prefix = `${focus.id}:${ROOT_SLUGS[rootPc]}:`;
  const routine = ["Name the root on strings 6, 5 and 4; spell the chosen formula before checking it.", focus.task, "Play evenly at a comfortable tempo; isolate one difficult transition and repeat it slowly.", "Create and record a short musical phrase, then join two neighbouring positions.", "Transpose the same idea to the next key in the circle of fifths; note what needs another session."];
  const selected = routine.filter((_, i) => tasks.includes(`${prefix}${i}`));
  function save() {
    setSessions([{ id: crypto.randomUUID(), date: new Date().toISOString(), root: ROOTS[rootPc].label, focus: focus.name, minutes, bpm, tasks: selected }, ...sessions].slice(0, 30)); setSaved(true);
  }
  const href = `${focus.href}${focus.href.includes("?") ? "&" : "?"}key=${ROOT_SLUGS[rootPc]}`;
  return <div className="flex flex-col gap-5">
    <Panel title="Theory & fretboard exercises" description="Fretboard Concepts: all 80 appendix questions. Carter: directional intervals, parent scales, major-scale spelling and a foundations review. Source errors are corrected; chord drills continue with generated transpositions. Answers preserve letter spelling and double accidentals.">
      <div className="mb-5"><StudySelect label="Exercise type" value={kind} onChange={setExercise} options={EXERCISE_TYPES} /></div><TheoryQuiz key={kind} kind={kind} />
    </Panel>
    <Metronome />
    <AssignmentBank />
    <Panel title="Build a practice session" description="A progressive routine for every practical chapter. Checked steps are saved per root and focus in this browser.">
      <RootPicker value={rootPc} onChange={(value) => { setRootPc(value); setSaved(false); }} label="Practice root" className="mb-5" />
      <div className="grid gap-4 sm:grid-cols-3"><StudySelect label="Practice focus" value={focus.id} onChange={(value) => { setFocus(value); setSaved(false); }} options={FOCUSES.map((f) => ({ value: f.id, label: f.name }))} /><label className="text-sm font-medium">Minutes<input aria-label="Session minutes" type="number" min={1} max={240} value={minutes} onChange={(e) => { setMinutes(Math.max(1, Math.min(240, Number(e.target.value) || 1))); setSaved(false); }} className="mt-2 w-full rounded-lg border bg-background p-3" /></label><label className="text-sm font-medium">Working tempo<input aria-label="Session tempo" type="number" min={30} max={240} value={bpm} onChange={(e) => { setBpm(Math.max(30, Math.min(240, Number(e.target.value) || 30))); setSaved(false); }} className="mt-2 w-full rounded-lg border bg-background p-3" /></label></div>
      <p className="my-4 text-sm text-muted-foreground">{ROOTS[rootPc].label} · {focus.name} · source pp. {focus.pages} · {selected.length}/{routine.length} steps checked</p>
      <ol className="space-y-3">{routine.map((text, i) => <li key={i}><label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-6"><input type="checkbox" className="mt-1 size-4 shrink-0 accent-primary" checked={tasks.includes(`${prefix}${i}`)} onChange={() => { const id = `${prefix}${i}`; setTasks(tasks.includes(id) ? tasks.filter((t) => t !== id) : [...tasks, id]); setSaved(false); }} /><span>{i + 1}. {text}</span></label></li>)}</ol>
      <div className="mt-5 flex flex-wrap items-center gap-3"><Link href={href} className={buttonVariants({ variant: "outline" })}>Open practice material →</Link><button type="button" disabled={saved || !selected.length} className={buttonVariants()} onClick={save}>{saved ? "Session saved" : "Save session"}</button></div>
      {saved && <p role="status" className="mt-3 text-sm text-success">Saved locally with {selected.length} completed steps. You can review it below.</p>}
    </Panel>
    <Panel title="Recent practice" description="Your last 30 saved sessions. Minutes and tempo are your entered practice notes.">
      {sessions.length ? <SimpleTable columns={["Date", "Root", "Focus", "Minutes", "BPM", "Steps"]} rows={sessions.map((s) => [new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(s.date)), s.root, s.focus, String(s.minutes), String(s.bpm), String(s.tasks.length)])} /> : <p className="text-sm text-muted-foreground">Complete a practice step and save your first session to start your log.</p>}
    </Panel>
    <BookSource pages="19, 27, 35, 43, 53, 58, 66, 74, 82, 94–95, 108–111" />
    <TheoryBookSource pages="26–27, 50–53, 71, 162–168, 218–220" />
    <References entries={[{ title: "Fretboard Concepts · exercises and answer key, pp. 108–111; chapter practice assignments", href: "/book" }]} />
  </div>;
}
