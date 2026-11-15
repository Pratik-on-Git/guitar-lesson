"use client";

import { useId, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ChartNoAxesColumnIncreasing, MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onRadioGroupKeyDown } from "@/components/ui/segmented";
import { CARNATIC_SVARAS, HINDUSTANI_POSITIONS } from "@/lib/music/raga";
import styles from "./svara-explorer.module.css";

const POSITIONS = HINDUSTANI_POSITIONS.map((pitch, semitones) => ({
  semitones,
  western: pitch.western,
  names: CARNATIC_SVARAS.filter((svara) => svara.semitones === semitones),
}));

function formAt(position: number) {
  if (position === 0 || position === 7) return "fixed";
  return POSITIONS[position].names.length === 2 ? "shared" : "variant";
}

const LEGEND = [
  { form: "fixed", label: "Fixed", count: 2 },
  { form: "variant", label: "Single variant", count: 6 },
  { form: "shared", label: "Shared position", count: 4 },
];

export function CarnaticSvaraExplorer() {
  const [selected, setSelected] = useState(0);
  const chartId = useId();
  const position = POSITIONS[selected];
  const shared = position.names.length === 2;
  const form = formAt(selected);

  function step(direction: number) {
    const next = (selected + direction + POSITIONS.length) % POSITIONS.length;
    setSelected(next);
    document.getElementById(`${chartId}-${next}`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  return (
    <div className={styles.explorer}>
      <div className={styles.header}>
        <div className={styles.intro}>
          <span className={styles.icon}><ChartNoAxesColumnIncreasing aria-hidden size={21} /></span>
          <div>
            <h3>Sixteen names, one octave</h3>
            <p>Twelve pitch positions. Four pairs of shared names.</p>
          </div>
        </div>
        <span className={styles.tonic}>Sa = C</span>
      </div>

      <ul className={styles.legend} aria-label="Carnatic pitch position types">
        {LEGEND.map(({ form, label, count }) => (
          <li key={form} className={styles.form} data-form={form}>
            <span className={styles.dot} aria-hidden />
            {label}<span className={styles.count}>{count}</span>
          </li>
        ))}
      </ul>

      <div className={styles.chartSurface}>
        <div className={styles.chartHeading}>
          <span>Pitch rises with each step</span>
          <span>1 step = 1 semitone</span>
        </div>
        <div className={styles.scroll}>
          <div role="radiogroup" aria-label="Carnatic pitch positions" onKeyDown={onRadioGroupKeyDown} className={styles.chart}>
            {POSITIONS.map((pitch) => (
              <button
                key={pitch.semitones}
                id={`${chartId}-${pitch.semitones}`}
                type="button"
                role="radio"
                aria-label={`${pitch.names.map((svara) => svara.symbol).join(" / ")}, ${pitch.semitones} semitones from Sa`}
                aria-checked={selected === pitch.semitones}
                tabIndex={selected === pitch.semitones ? 0 : -1}
                data-form={formAt(pitch.semitones)}
                className={`${styles.pitch} ${styles.form}`}
                onClick={() => setSelected(pitch.semitones)}
                style={{ "--pitch-height": `${pitch.semitones * 11}px` } as CSSProperties}
              >
                <span className={styles.plot} aria-hidden>
                  <span className={styles.stem} /><span className={styles.marker} />
                </span>
                <strong className={`${styles.symbol} ${styles.pairedSymbols}`}>
                  {pitch.names.map((svara) => <span key={svara.symbol}>{svara.symbol}</span>)}
                </strong>
                <span className={styles.western}>{pitch.western}</span>
                <span className={styles.position}>{pitch.semitones}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.axis}>
          <span>Semitones from Sa <ArrowRight size={13} aria-hidden /></span>
          <span><MoveHorizontal size={13} aria-hidden /> Select a position · scroll to explore</span>
        </div>
      </div>

      <div className={`${styles.detail} ${styles.form}`} data-form={form}>
        <div className={styles.noteDetail} aria-live="polite" aria-atomic="true">
          <div className={styles.noteIdentity}>
            <span className={styles.selectedSymbol}>{selected}</span>
            <div>
              <span className={styles.eyebrow}>Selected position</span>
              <h4>{position.names.map((svara) => svara.symbol).join(" / ")}</h4>
              <span className={styles.formLabel}>{shared ? "Two names · one position" : form === "fixed" ? "Fixed relative to Sa" : "One name · one position"}</span>
            </div>
          </div>
          <dl className={styles.facts}>
            <div><dt>Semitones from Sa</dt><dd>{selected}</dd></div>
            <div><dt>Names at this position</dt><dd>{position.names.length}</dd></div>
          </dl>
          <div className={styles.description}>
            <div className={styles.nameCards}>
              {position.names.map((svara) => (
                <div key={svara.symbol} className={styles.nameCard}>
                  <strong>{svara.symbol}</strong>
                  <div><h5>{svara.name}</h5><p>Western spelling · <strong>{svara.western}</strong></p></div>
                </div>
              ))}
            </div>
          </div>
          <p className={styles.description}>
            {shared
              ? `${position.names.map((svara) => svara.symbol).join(" and ")} share a nominal pitch in this comparison. Their names and Western spellings preserve their different note roles; gamaka treatment depends on the raga.`
              : selected === 0
                ? "Shadjam is the tonic. All twelve positions are measured from this chosen Sa; changing the tonic moves the whole map."
                : selected === 7
                  ? "Panchamam is the fifth above Sa. Sa and Pa are fixed relative degrees, with one form each in this naming system."
                  : "This position has one name in the 16-name melakarta convention. Ri, Ga, Dha and Ni each have three named variants; Ma has two."}
          </p>
        </div>
        <div className={styles.navigation}>
          <Button variant="outline" size="icon-sm" aria-label="Previous Carnatic position" onClick={() => step(-1)}><ArrowLeft aria-hidden /></Button>
          <Button variant="outline" size="icon-sm" aria-label="Next Carnatic position" onClick={() => step(1)}><ArrowRight aria-hidden /></Button>
        </div>
      </div>

      <p className={styles.pairHint}><strong>Why 16 names but 12 positions?</strong> R2 / G1, R3 / G2, D2 / N1 and D3 / N2 each share a position. Select a purple pair to compare both names and spellings.</p>
      <p className={styles.footnote}>A 12-tone equal-tempered comparison with Sa = C. The chart uses one pitch label per position; the selected cards show each name’s spelling, including E𝄫 and B𝄫. Performance intonation and gamaka are not represented by fixed positions.</p>
    </div>
  );
}
