"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Segmented } from "@/components/ui/segmented";
import { ScorePlayer } from "@/components/music/score-player";
import { HINDUSTANI_POSITIONS } from "@/lib/music/raga";
import { LISTENING_STUDIES, listeningSemitones } from "@/lib/music/raga-performance";
import { svaraPitch } from "@/lib/music/raga-studies";
import type { SoundEvent } from "@/lib/music/sound";
import { NoteChips, PhraseContour, StudyIntro } from "./raga-grammar";
import styles from "./raga-study.module.css";

export function ListeningStudy({ id }: { id: string }) {
  const study = LISTENING_STUDIES.find((item) => item.id === id)!;
  const [mode, setMode] = useState<"phrase" | "ascent" | "descent">("phrase");
  const [ma, setMa] = useState(6);
  const notes = study[mode];
  const semitones = listeningSemitones(study);
  const events: SoundEvent[] = notes.map((symbol, index) => ({ at: index, duration: .85, midi: 48 + svaraPitch(symbol), velocity: .05 }));
  events.push({ at: 0, duration: notes.length, midi: 48, velocity: .02, wave: "sine" });
  return <div className={styles.study}>
    <StudyIntro title={`${study.name}: listen for a specific feature`} text={study.focus} badge="Tanarang teaching description · Sa = C" />
    <div className={styles.grid3}>{[["Pitch collection", `${study.notes.length} degrees`], ["Omitted degrees", study.omitted.length ? study.omitted.join(" · ") : "None in the collection"], ["Vadi / samvadi", `${study.vadi} / ${study.samvadi}`]].map(([label, value]) => <div className={styles.card} key={label}><span className={styles.eyebrow}>{label}</span><h4>{value}</h4></div>)}</div>
    <NoteChips notes={study.notes} western={semitones.map((pitch) => HINDUSTANI_POSITIONS[pitch].western)} />
    <div className={styles.scroll} tabIndex={0} role="region" aria-label={`${study.name} included and omitted pitches, scroll horizontally`}><table className={styles.matrix}><caption className="sr-only">Filled cells name the pitch forms used by the collection; dashes mark absent nominal positions.</caption><thead><tr>{HINDUSTANI_POSITIONS.map((note, i) => <th scope="col" key={i}>{note.symbol}<span className="block">{i}</span></th>)}</tr></thead><tbody><tr>{HINDUSTANI_POSITIONS.map((note, i) => <td key={i}>{semitones.includes(i) ? <span className={styles.filled}>{note.symbol}</span> : <span className={styles.empty}>—</span>}</td>)}</tr></tbody></table></div>
    {id === "yaman" && <div className={`${styles.surface} ${styles.detail}`}><h4>Compare the two Ma positions</h4><Segmented label="Yaman Ma comparison" value={ma} onChange={setMa} options={[{ value: 5, label: "Shuddha Ma · 5" }, { value: 6, label: "Tivra Ma · 6" }]} /><p aria-live="polite">{ma === 6 ? "Ḿa · F♯ · Yaman’s raised fourth in this comparison" : "Ma · F · natural fourth, outside this Yaman pitch collection"}</p><ScorePlayer key={ma} events={[{ at: 0, duration: 3, midi: 48, velocity: .025, wave: "sine" }, { at: 1, duration: 1.5, midi: 48 + ma, velocity: .055 }]} beats={3} bpm={60} label="Hear Sa and selected Ma" /></div>}
    <Segmented label={`${study.name} listening view`} value={mode} onChange={setMode} options={[{ value: "phrase", label: "Phrase excerpt" }, { value: "ascent", label: id === "yaman" ? "Pitch drill" : "Ascent outline" }, { value: "descent", label: "Descent outline" }]} />
    <PhraseContour label={`${study.name} · ${mode === "phrase" ? "phrase excerpt" : mode === "ascent" && id === "yaman" ? "pitch drill" : mode}`} notes={notes} />
    <div className={styles.controls}><ScorePlayer key={`${id}:${mode}`} events={events} beats={notes.length} bpm={60} label={`Hear ${study.name} pitch reference`} /><span className={styles.badge}>Finite example · Sa-only drone</span></div>
    <p className={styles.muted}>Synthesized, evenly spaced pitches clarify note order and register. The excerpt is shortened from the teaching description; hear its real timing and ornament in a rendition. {study.routeNote}</p>
    <div className={`${styles.surface} ${styles.detail}`}><span className={styles.eyebrow}>Focused listening task</span><p>{study.task}</p></div>
    <div className={styles.grid2}><div className={styles.card}><span className={styles.eyebrow}>Listen with a source</span><p>Choose a rendition and note its performer and a short timestamp. Sing the contour, compare the arrival, then try it on the instrument.</p><a className={`${styles.link} mt-3`} href={study.source} target="_blank" rel="noreferrer">Teaching description & renditions <ExternalLink size={14} aria-label="Opens in a new tab" /></a></div><div className={styles.card}><span className={styles.eyebrow}>Take it to the guitar</span><p>Carry this exact phrase excerpt or the full pitch drill into the fretboard and TAB workbench.</p><Link className={`${styles.link} mt-3`} href={`/learn/raga-guitar?study=${mode === "phrase" ? "phrase" : "listening"}-${id}#guitar-application`}>Play {study.name} on guitar <ArrowRight size={14} aria-hidden /></Link></div></div>
  </div>;
}
