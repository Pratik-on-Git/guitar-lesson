"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/segmented";
import { StudyIntro } from "./raga-grammar";
import styles from "./raga-study.module.css";

const ORNAMENTS = [
  { name: "Meend", summary: "Glide between pitches", path: "M 20 135 C 150 135 200 125 300 85 S 450 35 580 35", listen: "Follow the whole approach and arrival, rather than only its two endpoints.", guitar: "A finger slide or bend can explore a connection. Compare its arrival pitch and timing with the taught phrase." },
  { name: "Kan", summary: "A grace-note touch", path: "M 20 125 L 75 125 Q 105 25 135 65 L 580 65", listen: "Notice the brief approach to the main note and how much weight it receives.", guitar: "Try a short picked or legato approach, then compare the relative emphasis with a rendition." },
  { name: "Andolan", summary: "Oscillatory movement", path: "M 20 90 C 65 30 110 30 155 90 S 245 150 290 90 S 380 30 425 90 S 515 150 580 90", listen: "Listen for the shape, range and pace of each movement in its particular raga.", guitar: "Listen and sing first. A bend-and-release motion needs the source phrase’s shape; generic vibrato is not sufficient." },
  { name: "Gamak", summary: "Forceful oscillatory movement", path: "M 20 95 Q 48 15 76 95 T 132 95 T 188 95 T 244 95 T 300 95 T 356 95 T 412 95 T 468 95 T 524 95 T 580 95", listen: "Compare the articulation and force of the movement with a gentler oscillation.", guitar: "Separate the target pitches from their treatment, then work on the connecting motion with a teacher’s example." },
  { name: "Murki", summary: "A quick ornamental turn", path: "M 20 100 L 180 100 Q 210 25 240 55 T 300 100 T 360 55 L 390 100 L 580 100", listen: "Hear the turn as a connected event within the phrase, including where it resolves.", guitar: "Practise the note order slowly with clear attacks, then connect it without losing the phrase’s arrival." },
];

export function OrnamentExplorer() {
  const [selected, setSelected] = useState(0);
  const [connected, setConnected] = useState("contour");
  const ornament = ORNAMENTS[selected];
  return <div className={styles.study}>
    <StudyIntro title="Listen to the journey between notes" text="Compare five practical Hindustani terms. The sketches explain types of movement; they are not measured performance prescriptions." badge="Schematic pitch contours" />
    <Segmented label="Ornament type" value={selected} onChange={setSelected} options={ORNAMENTS.map((item, index) => ({ value: index, label: item.name }))} />
    <div className={styles.controls}><Segmented label="Ornament contour view" value={connected} onChange={setConnected} options={[{ value: "contour", label: "Connected contour" }, { value: "separate", label: "Separate pitch targets" }]} /></div>
    <div className={styles.surface}>
      <p className={styles.eyebrow}>Relative pitch · phrase progress →</p>
      <svg viewBox="0 0 600 175" preserveAspectRatio="none" className={styles.contour} role="img" aria-label={`${ornament.name}: ${connected === "contour" ? ornament.summary : "isolated targets without their connecting treatment"}`}>
        {[35, 85, 135].map((height) => <line key={height} x1="15" x2="585" y1={height} y2={height} className={styles.guide} />)}
        <path d={connected === "contour" ? ornament.path : "M 20 135 H 150 M 240 85 H 360 M 450 35 H 580"} fill="none" stroke="var(--chart-2)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
      <p className={styles.muted}>Qualitative sketch: the axes do not prescribe semitones, oscillation speed or duration.</p>
    </div>
    <div className={`${styles.surface} ${styles.detail}`} aria-live="polite"><h4>{ornament.name} · {ornament.summary}</h4><p>{ornament.listen}</p></div>
    <div className={styles.grid2}><div className={styles.card}><span className={styles.eyebrow}>Guitar application</span><p>{ornament.guitar}</p></div><div className={styles.card}><span className={styles.eyebrow}>Listen → sing → play → compare</span><p>Choose a short sourced phrase. Match the pitch arrivals first, then its motion, emphasis and release.</p></div></div>
    <p className={styles.note}>The historical fifteen-gamaka list and a separately taught tenfold Carnatic classification appear in the notes. Neither is a universal checklist, and these five practical terms are not a one-to-one translation of those lists.</p>
  </div>;
}
