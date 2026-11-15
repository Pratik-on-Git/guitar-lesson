"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StudySelect } from "@/components/music/study-controls";
import { Button } from "@/components/ui/button";
import { ScorePlayer } from "@/components/music/score-player";
import { angaCounts, JATIS, TALA_PATTERNS, talaBeats } from "@/lib/music/raga-performance";
import { StudyIntro } from "./raga-grammar";
import styles from "./raga-study.module.css";
import rhythm from "./raga-rhythm.module.css";

export function CarnaticTalaExplorer() {
  const [selection, setSelection] = useState({ pattern: 4, jati: 4 });
  const [beatChoice, setBeat] = useState(0);
  const [tempo, setTempo] = useState(60);
  const pattern = TALA_PATTERNS[selection.pattern];
  const beats = talaBeats(pattern, selection.jati);
  const beat = Math.min(beatChoice, beats.length - 1);
  function select(pattern: number, jati: number) { setSelection({ pattern, jati }); setBeat(0); }
  return <div className={styles.study}>
    <StudyIntro title="Seven patterns × five jatis" text="Choose any of the 35 combinations, then count its angas. A laghu changes with jati; drutam and anudrutam keep their lengths." badge="35 calculated cycles" />
    <div className={styles.grid3}>{[["Laghu · L", "jati counts", "Clap, followed by finger counts"], ["Drutam · D", "2 counts", "Clap, then wave"], ["Anudrutam · A", "1 count", "One clap"]].map(([name, length, gesture]) => <div className={styles.card} key={name}><span className={styles.eyebrow}>{name}</span><h4>{length}</h4><p>{gesture}</p></div>)}</div>
    <StudySelect className={styles.field} formatLabels={false} label="Laghu jati" value={String(selection.jati)} onChange={(value) => select(selection.pattern, Number(value))} options={JATIS.map((jati) => ({ value: String(jati.count), label: `${jati.name} · ${jati.count} counts` }))} />
    <div className={styles.scroll} role="region" aria-label="35-tala combinations, scroll horizontally" tabIndex={0}><table className={styles.matrix}>
      <caption className="sr-only">Seven anga patterns across five laghu jatis. Select a total to inspect its cycle.</caption>
      <thead><tr><th scope="col">Tala / angas</th>{JATIS.map((jati) => <th scope="col" key={jati.count}>{jati.name}<span className="block">L = {jati.count}</span></th>)}</tr></thead>
      <tbody>{TALA_PATTERNS.map((tala, index) => <tr key={tala.name}><th scope="row">{tala.name}<span className="block text-muted-foreground">{tala.angas.join(" ")}</span></th>{JATIS.map((jati) => { const total = talaBeats(tala, jati.count).length; return <td key={jati.count}><button type="button" aria-label={`${tala.name}: ${total} counts`} aria-pressed={selection.pattern === index && selection.jati === jati.count} className={`${rhythm.total} ${selection.pattern === index && selection.jati === jati.count ? styles.selected : ""}`} onClick={() => select(index, jati.count)}>{total}</button></td>; })}</tr>)}</tbody>
    </table></div>
    <div className={`${styles.surface} ${styles.detail}`}>
      <h4>{pattern.name} · {JATIS.find((jati) => jati.count === selection.jati)!.name} jati</h4>
      <p className={styles.muted}>{pattern.angas.map((anga) => angaCounts(anga, selection.jati)).join(" + ")} = {beats.length} counts</p>
      <div className={rhythm.durationBar} aria-label="Segment widths represent anga count totals">{pattern.angas.map((anga, group) => <div key={group} style={{ flex: angaCounts(anga, selection.jati), background: `var(--chart-${group + 1})` }}><span>{anga}</span></div>)}</div>
      <div className={rhythm.groups}>{pattern.angas.map((anga, group) => <div className={rhythm.group} key={group}><p>{anga} · {angaCounts(anga, selection.jati)} counts</p><div className={rhythm.beats}>{beats.map((item, index) => item.group !== group ? null : <button type="button" key={index} aria-label={`Carnatic count ${index + 1}: ${item.gesture}`} aria-pressed={beat === index} onClick={() => setBeat(index)}>{index + 1}</button>)}</div></div>)}</div>
      <p aria-live="polite">Count {beat + 1} of {beats.length} · {beats[beat].gesture} · {beats[beat].anga === "L" ? "Laghu" : beats[beat].anga === "D" ? "Drutam" : "Anudrutam"} · anga {beats[beat].group + 1}</p>
      <div className={styles.controls}><Button variant="outline" size="sm" aria-label="Previous Carnatic count" onClick={() => setBeat((beat + beats.length - 1) % beats.length)}><ArrowLeft aria-hidden />Previous count</Button><Button variant="outline" size="sm" aria-label="Next Carnatic count" onClick={() => setBeat((beat + 1) % beats.length)}>Next count<ArrowRight aria-hidden /></Button></div>
    </div>
    <div className={styles.controls}><StudySelect className={styles.field} formatLabels={false} label="Cycle practice tempo" value={String(tempo)} onChange={(value) => setTempo(Number(value))} options={[40, 60, 80, 100].map((value) => ({ value: String(value), label: `${value} counts/min` }))} /><ScorePlayer key={`${selection.pattern}:${selection.jati}:${tempo}`} events={beats.map((item, index) => ({ at: index, duration: .08, frequency: item.offset === 0 ? 1200 : 800, velocity: .045, wave: "sine" }))} beats={beats.length} bpm={tempo} label="Play one Carnatic cycle" /></div>
    <p className={styles.muted}>The click track marks each count and accents anga starts. It does not demonstrate every performance subdivision or instrument stroke. The selected count locator advances manually; learn detailed hand conventions with a teacher.</p>
  </div>;
}

export function TeentalPractice() {
  const [beat, setBeat] = useState(0);
  const [tempo, setTempo] = useState(60);
  const gesture = beat === 0 ? "Clap · sam" : beat === 4 || beat === 12 ? "Clap" : beat === 8 ? "Wave · khali" : "Continue counting";
  return <div className={styles.study}>
    <StudyIntro title="Teental: hear the return to sam" text="Four divisions of four counts. Locate the claps, the wave and the point where the cycle begins again." badge="16 matras · 4 + 4 + 4 + 4" />
    <div className={styles.grid2}>{["Clap · sam", "Clap", "Wave · khali", "Clap"].map((label, group) => <div key={group} className={styles.card}><p className={styles.eyebrow}>Division {group + 1} · {label}</p><div className={`${rhythm.beats} mt-3`}>{Array.from({ length: 4 }, (_, offset) => { const index = group * 4 + offset; return <button type="button" key={index} aria-label={`Beat ${index + 1}`} aria-pressed={beat === index} onClick={() => setBeat(index)}>{index + 1}</button>; })}</div></div>)}</div>
    <div className={`${styles.surface} ${styles.detail}`}><p aria-live="polite">Beat {beat + 1} of 16 · {gesture}</p><div className={styles.controls}><Button variant="outline" size="sm" onClick={() => setBeat((beat + 15) % 16)}>Previous beat</Button><Button variant="outline" size="sm" onClick={() => setBeat((beat + 1) % 16)}>Next beat →</Button></div></div>
    <div className={styles.controls}><StudySelect className={styles.field} formatLabels={false} label="Teental practice tempo" value={String(tempo)} onChange={(value) => setTempo(Number(value))} options={[40, 60, 80, 100].map((value) => ({ value: String(value), label: `${value} counts/min` }))} /><ScorePlayer key={tempo} events={Array.from({ length: 16 }, (_, index) => ({ at: index, duration: .08, frequency: index === 0 ? 1400 : index % 4 === 0 ? 1100 : 750, velocity: .045, wave: "sine" }))} beats={16} bpm={tempo} label="Play one teental cycle" /></div>
    <p className={styles.note}>Khali is a waved division, not four silent counts. These practice clicks sound through all sixteen counts. They mark the cycle, not a tabla theka.</p>
    <ol className={rhythm.list}>{["Choose one metered rendition and establish Sa by listening.", "Keep the sixteen-count cycle independently of the melody.", "Mark the phrase’s starting count and its next arrival at sam.", "Sing the phrase, then play it on one guitar string and record your comparison."].map((text) => <li key={text}>{text}</li>)}</ol>
  </div>;
}
