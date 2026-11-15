"use client";

import { startTransition, useOptimistic, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Guitar, MoveHorizontal } from "lucide-react";
import { StudySelect } from "@/components/music/study-controls";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { GUITAR_STUDIES, guitarLessonDefault, guitarRoute, guitarStudy, guitarTab, playableRegions, playableStrings, practiceTones, soundingPitch } from "@/lib/music/raga-guitar";
import { mod, neckNotes, STRING_NAMES } from "@/lib/music/theory";
import type { SoundEvent } from "@/lib/music/sound";
import { RootPicker } from "./controls";
import { Fretboard } from "./fretboard";
import { ScorePlayer } from "./score-player";
import styles from "./raga-guitar.module.css";

export function RagaGuitar({ lesson = "raga-guitar" }: { lesson?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [optimisticQuery, setOptimisticQuery] = useOptimistic(params.toString());
  const query = new URLSearchParams(optimisticQuery);
  const defaultStudy = guitarLessonDefault(lesson, query.get("mela"));
  const studyId = query.get("study") ?? defaultStudy;
  const saValue = query.get("sa") ?? "0";
  // Commit the complete local selection so rapid material/Sa changes compose.
  function setParameter(name: string, value: string, fallback: string) {
    const next = new URLSearchParams(optimisticQuery);
    if (value === fallback) next.delete(name);
    else next.set(name, value);
    const search = next.toString();
    startTransition(() => {
      setOptimisticQuery(search);
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    });
  }
  const setStudy = (value: string) => setParameter("study", value, defaultStudy);
  const setSa = (value: string) => setParameter("sa", value, "0");
  const sa = Number.isInteger(Number(saValue)) && Number(saValue) >= 0 && Number(saValue) < 12 ? Number(saValue) : 0;
  const saMidi = 48 + sa;
  const material = guitarStudy(studyId);
  const [direction, setDirection] = useState("ascent");
  const [mode, setMode] = useState("region");
  const [regionChoice, setRegion] = useState(3);
  const [stringChoice, setString] = useState(1);
  const [labels, setLabels] = useState("svara");
  const [bpm, setBpm] = useState(60);
  const [drone, setDrone] = useState(true);
  const [stepChoice, setStep] = useState(0);
  const tones = practiceTones(material, direction);
  const regions = playableRegions(tones, saMidi);
  const strings = playableStrings(tones, saMidi);
  const region = regions.includes(regionChoice) ? regionChoice : regions[0];
  const string = strings.includes(stringChoice) ? stringChoice : strings[0];
  const route = guitarRoute(tones, saMidi, mode === "single" ? { mode: "single", string } : { mode: "region", start: region });
  const stepIndex = Math.min(stepChoice, Math.max(0, route.length - 1));
  const selected = route[stepIndex];
  const semitones = [...new Set(tones.map((tone) => mod(tone.offset, 12)))].sort((a, b) => a - b);
  const symbols = semitones.map((semitone) => tones.find((tone) => mod(tone.offset, 12) === semitone)!.symbol.replaceAll("′", "").replaceAll(",", ""));
  const from = mode === "single" ? Math.min(...route.map((step) => step.fret)) : region;
  const to = mode === "single" ? Math.max(...route.map((step) => step.fret)) : region + 4;
  const notes = neckNotes(sa, semitones, Number.isFinite(to) ? to : 12).filter((note) => mode !== "single" || note.string === string);
  const marks = route.map((step) => ({ string: step.string, fret: step.fret, index: semitones.indexOf(mod(step.offset, 12)) }));
  const events: SoundEvent[] = route.map((step, index) => ({ at: index, duration: .85, midi: step.midi, velocity: .05 }));
  if (drone && route.length) events.push({ at: 0, duration: route.length, midi: saMidi, velocity: .022, wave: "sine" });
  const playbackKey = `${material.id}:${sa}:${direction}:${mode}:${region}:${string}:${bpm}:${drone}`;

  return <div className={styles.workbench}>
    <div className={styles.intro}><div><h3><Guitar size={18} aria-hidden /> From svara to string & fret</h3><p>Choose a tonic and material, then follow a playable route in standard tuning.</p></div><span className={styles.badge}>6 → 1 · E A D G B e</span></div>
    <RootPicker label="Guitar Sa" value={sa} onChange={(value) => setSa(String(value))} />
    <StudySelect className={styles.field} formatLabels={false} label="Practice material" value={String(material.id)} onChange={(value) => { setStudy(value); setStep(0); }} options={GUITAR_STUDIES.map((item) => ({ value: item.id, label: item.title, group: item.kind }))} />
    <p className={styles.note}>{material.description}</p>
    <div className={styles.controls}><Segmented label="Guitar direction" value={direction} onChange={(value) => { setDirection(value); setStep(0); }} options={[{ value: "ascent", label: "Ascent" }, { value: "descent", label: "Descent" }, { value: "both", label: "Both" }]} /><Segmented label="Guitar route" value={mode} onChange={setMode} options={[{ value: "region", label: "Across strings" }, { value: "single", label: "One string" }]} /></div>
    <div className={styles.controls}>
      {mode === "region" ? <StudySelect className={styles.field} formatLabels={false} label="Neck region" value={String(region)} onChange={(value) => setRegion(Number(value))} options={regions.map((start) => ({ value: String(start), label: `Frets ${start}–${start + 4}${start === 0 ? " · includes open strings" : ""}` }))} /> : <StudySelect className={styles.field} formatLabels={false} label="Melody string" value={String(string)} onChange={(value) => setString(Number(value))} options={strings.map((s) => ({ value: String(s), label: `String ${6 - s} · ${STRING_NAMES[s]}` }))} />}
      <Segmented label="Guitar note labels" value={labels} onChange={setLabels} options={[{ value: "svara", label: "Svaras" }, { value: "pitch", label: "Western" }]} />
    </div>
    {selected ? <>
      <div className={styles.neck} tabIndex={0} role="region" aria-label="Guitar fretboard, scroll horizontally">
        <Fretboard notes={notes} frets={to} startFret={from} rootIndex={semitones.indexOf(0)} highlight={marks} selected={marks[stepIndex]} label={(index) => labels === "svara" ? symbols[index] : soundingPitch(saMidi + semitones[index]).replace(/\d+$/, "")} title={`${material.title}, Sa ${soundingPitch(saMidi)}, frets ${from}–${to}`} />
      </div>
      <p className={styles.legend}><span>■ Sa when played · ring = selected step · high e is on top</span><span><MoveHorizontal size={13} aria-hidden /> Scroll the neck when needed</span></p>
      <div className={styles.stepCard}>
        <div className={styles.stepHeading}><span className={styles.badge}>Sa = {soundingPitch(saMidi)}</span><div className={styles.controls}><Button variant="outline" size="icon-sm" aria-label="Previous guitar step" onClick={() => setStep((stepIndex + route.length - 1) % route.length)}><ArrowLeft aria-hidden /></Button><Button variant="outline" size="icon-sm" aria-label="Next guitar step" onClick={() => setStep((stepIndex + 1) % route.length)}><ArrowRight aria-hidden /></Button></div></div>
        <div aria-live="polite" aria-atomic="true"><h4>Selected step {stepIndex + 1} of {route.length} · {selected.symbol}</h4><dl className={styles.facts}>{[["Sounding pitch", soundingPitch(selected.midi)], ["String", `${6 - selected.string} · ${STRING_NAMES[selected.string]}`], ["Fret", String(selected.fret)], ["Suggested finger", selected.finger === 0 ? "0 · open" : String(selected.finger)], ["Hand position", String(selected.position)]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p>{selected.shift ? "Shift the hand here; the suggested route does not require a fixed stretch over the whole region." : "Pick this note clearly, sing its svara, then move to the next step."}</p></div>
      </div>
      <div className={styles.steps} aria-label="Select a guitar route step">{route.map((step, index) => <button type="button" key={index} aria-label={`Guitar step ${index + 1}: ${step.symbol}`} aria-pressed={stepIndex === index} onClick={() => setStep(index)}><small>{index + 1}</small><strong>{step.symbol}</strong><small>{6 - step.string}:{step.fret}</small></button>)}</div>
      <div className={styles.controls}><StudySelect className={styles.field} formatLabels={false} label="Practice tempo" value={String(bpm)} onChange={(value) => setBpm(Number(value))} options={[40, 50, 60, 72, 90].map((tempo) => ({ value: String(tempo), label: `${tempo} BPM` }))} /><label className={styles.check}><input type="checkbox" checked={drone} onChange={(event) => setDrone(event.target.checked)} />Sa drone</label><ScorePlayer key={playbackKey} events={events} beats={route.length} bpm={bpm} label="Play guitar route" /></div>
      <p className={styles.caption}>Even-beat synthesized pitches are a listening reference. The diagrams and TAB give fret locations; a rendition supplies phrase timing and ornament.</p>
      <div className={styles.tab} tabIndex={0} role="region" aria-label="Guitar tablature, scroll horizontally"><pre aria-label="Guitar tablature">{guitarTab(route)}</pre></div>
      <p className={styles.caption}>TAB reads left to right, high e on top. Numbers are frets, and 0 means an open string. Fingers: 1 index · 2 middle · 3 ring · 4 little finger.</p>
      <details className={styles.disclosure}><summary>Step-by-step fingerings & shifts</summary><div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Guitar fingering reference, scroll horizontally"><table><caption className="sr-only">Exact sounding pitches, string locations and suggested hand shifts.</caption><thead><tr>{["Step", "Svara", "Pitch", "String", "Fret", "Finger", "Position / shift"].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{route.map((step, i) => <tr key={i}><th scope="row">{i + 1}</th><td>{step.symbol}</td><td>{soundingPitch(step.midi)}</td><td>{6 - step.string}</td><td>{step.fret}</td><td>{step.finger}</td><td>{step.position}{step.shift ? " · shift" : ""}</td></tr>)}</tbody></table></div></details>
    </> : <p role="status" className={styles.note}>No complete route fits this selection. Choose another region or string.</p>}
    <p className={styles.caption}>Routes stay within frets 0–19. Regions cover five frets, not a rigid four-finger stretch. Faint dots are alternative note locations. Fingerings are practice suggestions, with shifts shown explicitly; one-string routes change hand position.</p>
    {lesson !== "raga-guitar" && <Link className={styles.link} href={`/learn/raga-guitar?study=${material.id}&sa=${sa}#guitar-application`}>Open the full guitar lesson with this material <ArrowRight size={15} aria-hidden /></Link>}
  </div>;
}
