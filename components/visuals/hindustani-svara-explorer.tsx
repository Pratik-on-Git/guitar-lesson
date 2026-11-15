"use client";

import { useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ChartNoAxesColumnIncreasing, MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onRadioGroupKeyDown } from "@/components/ui/segmented";
import { HINDUSTANI_POSITIONS } from "@/lib/music/raga";
import styles from "./hindustani-svara-explorer.module.css";

const FORMS = {
  fixed: { label: "Fixed", count: 2 },
  shuddha: { label: "Shuddha", count: 5 },
  komal: { label: "Komal", count: 4 },
  tivra: { label: "Tivra", count: 1 },
} as const;

function formAt(position: number): keyof typeof FORMS {
  if (position === 0 || position === 7) return "fixed";
  if (position === 6) return "tivra";
  if ([1, 3, 8, 10].includes(position)) return "komal";
  return "shuddha";
}

function descriptionAt(position: number) {
  const note = HINDUSTANI_POSITIONS[position];
  switch (formAt(position)) {
    case "fixed": return position === 0
      ? "The tonic: every other position is measured from Sa. Choose a different tonic and the whole map moves with it."
      : "The fifth above Sa. Like Sa, Pa has no komal or tivra form; its relationship to the tonic stays fixed.";
    case "komal": return `One semitone below ${HINDUSTANI_POSITIONS[position + 1].symbol}, its shuddha form. Lowercase ${note.symbol} marks this lower form in this lesson.`;
    case "tivra": return "One semitone above shuddha Ma. Ma is the only svara with a tivra (raised) form in this naming system.";
    case "shuddha": return position === 5
      ? "The natural fourth above Sa. Its raised form is tivra Ma (Ḿa), one semitone higher; Ma has no komal form."
      : `The natural form of ${note.symbol}. Its komal form, ${HINDUSTANI_POSITIONS[position - 1].symbol}, sits one semitone lower.`;
  }
}

export function HindustaniSvaraExplorer() {
  const [selected, setSelected] = useState(0);
  const note = HINDUSTANI_POSITIONS[selected];
  const form = formAt(selected);

  function step(direction: number) {
    const next = (selected + direction + HINDUSTANI_POSITIONS.length) % HINDUSTANI_POSITIONS.length;
    setSelected(next);
    document.getElementById(`hindustani-pitch-${next}`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  return (
    <div className={styles.explorer}>
      <div className={styles.header}>
        <div className={styles.intro}>
          <span className={styles.icon}><ChartNoAxesColumnIncreasing aria-hidden size={21} /></span>
          <div>
            <h3>Explore one octave</h3>
            <p>Seven note families. Twelve pitch positions.</p>
          </div>
        </div>
        <span className={styles.tonic}>Sa = C</span>
      </div>

      <ul className={styles.legend} aria-label="Svara forms">
        {Object.entries(FORMS).map(([key, value]) => (
          <li key={key} className={styles.form} data-form={key}>
            <span className={styles.dot} aria-hidden />
            {value.label}<span className={styles.count}>{value.count}</span>
          </li>
        ))}
      </ul>

      <div className={styles.chartSurface}>
        <div className={styles.chartHeading}>
          <span>Pitch rises with each step</span>
          <span>1 step = 1 semitone</span>
        </div>
        <div className={styles.scroll}>
          <div role="radiogroup" aria-label="Hindustani pitch positions" onKeyDown={onRadioGroupKeyDown} className={styles.chart}>
            {HINDUSTANI_POSITIONS.map((svara, position) => (
              <button
                key={svara.symbol}
                id={`hindustani-pitch-${position}`}
                type="button"
                role="radio"
                aria-label={`${svara.symbol}, ${svara.name}, ${position} semitones from Sa, ${svara.western}`}
                aria-checked={selected === position}
                tabIndex={selected === position ? 0 : -1}
                data-form={formAt(position)}
                className={`${styles.pitch} ${styles.form}`}
                onClick={() => setSelected(position)}
                style={{ "--pitch-height": `${position * 11}px` } as CSSProperties}
              >
                <span className={styles.plot} aria-hidden>
                  <span className={styles.stem} />
                  <span className={styles.marker} />
                </span>
                <strong className={styles.symbol}>{svara.symbol}</strong>
                <span className={styles.western}>{svara.western}</span>
                <span className={styles.position}>{position}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.axis}>
          <span>Semitones from Sa <ArrowRight size={13} aria-hidden /></span>
          <span><MoveHorizontal size={13} aria-hidden /> Select a note · scroll to explore</span>
        </div>
      </div>

      <div className={`${styles.detail} ${styles.form}`} data-form={form}>
        <div className={styles.noteDetail} aria-live="polite" aria-atomic="true">
          <div className={styles.noteIdentity}>
            <span className={styles.selectedSymbol}>{note.symbol}</span>
            <div>
              <span className={styles.eyebrow}>Selected svara</span>
              <h4>{note.name}</h4>
              <span className={styles.formLabel}>{FORMS[form].label} form</span>
            </div>
          </div>
          <dl className={styles.facts}>
            <div><dt>Semitones from Sa</dt><dd>{selected}</dd></div>
            <div><dt>Western · Sa = C</dt><dd>{note.western}</dd></div>
          </dl>
          <p className={styles.description}>{descriptionAt(selected)}</p>
        </div>
        <div className={styles.navigation}>
          <Button variant="outline" size="icon-sm" aria-label="Previous svara" onClick={() => step(-1)}><ArrowLeft aria-hidden /></Button>
          <Button variant="outline" size="icon-sm" aria-label="Next svara" onClick={() => step(1)}><ArrowRight aria-hidden /></Button>
        </div>
      </div>

      <p className={styles.footnote}>A 12-tone equal-tempered map for guitar and keyboard. Sa is movable; performance intonation and ornamentation vary with context.</p>
    </div>
  );
}
