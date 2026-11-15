"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, Layers, Route, Sparkles } from "lucide-react";
import { Segmented } from "@/components/ui/segmented";
import { CARNATIC_SVARAS, HINDUSTANI_POSITIONS, THAATS } from "@/lib/music/raga";
import { distinctDegrees, KAFI_STUDIES, svaraPitch } from "@/lib/music/raga-studies";
import styles from "./raga-study.module.css";

export function StudyIntro({ title, text, badge }: { title: string; text: string; badge?: string }) {
  return <div className={styles.intro}><div><h3>{title}</h3><p>{text}</p></div>{badge && <span className={styles.badge}>{badge}</span>}</div>;
}

export function NoteChips({ notes, western }: { notes: readonly string[]; western?: readonly string[] }) {
  return <div className={styles.chips}>{notes.map((note, index) => <span className={`${styles.chip} ${note === "Sa" || note === "S" || note === "Sa′" ? styles.tonic : ""}`} key={`${index}-${note}`}>{note}{western && <small>{western[index]}</small>}</span>)}</div>;
}

export function SvaraComparison() {
  const [selected, setSelected] = useState(0);
  const hindustani = HINDUSTANI_POSITIONS[selected];
  const carnatic = CARNATIC_SVARAS.filter((note) => note.semitones === selected);
  return <div className={styles.study}>
    <StudyIntro title="One position, three ways to name it" text="Select a semitone position. Read each tradition’s names and preserve the spellings that show note roles." badge="Sa = C · 12-TET" />
    <div className={styles.scroll} tabIndex={0} role="region" aria-label="Pitch naming comparison, scroll horizontally">
      <table className={styles.matrix}><caption className="sr-only">Carnatic, Hindustani and Western pitch names aligned by semitones above Sa.</caption>
        <thead><tr><th scope="col">Semitones</th>{HINDUSTANI_POSITIONS.map((note, i) => <th scope="col" key={i} data-selected={selected === i}><button type="button" aria-label={`${i} semitones, ${note.symbol}`} aria-pressed={selected === i} onClick={() => setSelected(i)} className="text-center!">{i}</button></th>)}</tr></thead>
        <tbody>
          <tr><th scope="row">Hindustani</th>{HINDUSTANI_POSITIONS.map((note, i) => <td key={i} data-selected={selected === i}><span className={styles.filled}>{note.symbol}</span></td>)}</tr>
          <tr><th scope="row">Carnatic</th>{HINDUSTANI_POSITIONS.map((_, i) => <td key={i} data-selected={selected === i}>{CARNATIC_SVARAS.filter((s) => s.semitones === i).map((s) => <span className="block leading-6" key={s.symbol}>{s.symbol}</span>)}</td>)}</tr>
          <tr><th scope="row">Western</th>{HINDUSTANI_POSITIONS.map((_, i) => <td key={i} data-selected={selected === i}>{[...new Set(CARNATIC_SVARAS.filter((s) => s.semitones === i).map((s) => s.western))].join(" / ")}</td>)}</tr>
        </tbody>
      </table>
    </div>
    <div aria-live="polite" aria-atomic="true" className={`${styles.surface} ${styles.detail}`}>
      <span className={styles.eyebrow}>Position {selected} · semitones above Sa</span>
      <div className={styles.grid3}>
        <div className={styles.card}><span className={styles.eyebrow}>Hindustani</span><strong className={styles.metric}>{hindustani.symbol}</strong><p>{hindustani.name}</p></div>
        <div className={styles.card}><span className={styles.eyebrow}>Carnatic</span><strong className={styles.metric}>{carnatic.map((s) => s.symbol).join(" / ")}</strong><p>{carnatic.map((s) => s.name).join(" / ")}</p></div>
        <div className={styles.card}><span className={styles.eyebrow}>Western spellings · Sa = C</span><strong className={styles.metric}>{[...new Set(carnatic.map((s) => s.western))].join(" / ")}</strong><p>{carnatic.length > 1 ? "Shared pitch position; distinct note roles." : "One named Carnatic degree at this position."}</p></div>
      </div>
    </div>
    <p className={styles.muted}>This compares nominal equal-tempered locations. Shared positions do not imply identical intonation, melodic function or gamaka.</p>
  </div>;
}

const LENSES = [
  { label: "Movement", text: "Ascent and descent can use different notes and characteristic turns. An ordered collection alone does not describe that movement." },
  { label: "Emphasis", text: "Some notes carry particular importance. In Hindustani descriptions, vadi and samvadi identify prominent notes; Sa remains the tonic." },
  { label: "Repose", text: "Nyasa describes places where a phrase rests or ends. A suitable ending depends on the raga and the phrase." },
  { label: "Ornament", text: "Approach, duration and movement on and between notes help establish identity. Learn these treatments through phrases and renditions." },
];
const JATI: Record<number, string> = { 5: "Audav", 6: "Shadav", 7: "Sampurna" };

export function RagaIdentity() {
  const [lens, setLens] = useState(0);
  const [ascent, setAscent] = useState(5);
  const [descent, setDescent] = useState(7);
  return <div className={styles.study}>
    <StudyIntro title="A collection becomes a melodic identity" text="Explore the behaviour a scale list leaves out, then classify ascent and descent separately." badge="Collection + grammar" />
    <div className={styles.flow}><span className={styles.badge}><Layers size={14} aria-hidden />Pitch collection</span><ArrowRight size={16} aria-hidden className={styles.arrow} /><span className={styles.badge}><Route size={14} aria-hidden />Phrase grammar</span><ArrowRight size={16} aria-hidden className={styles.arrow} /><span className={styles.badge}><Sparkles size={14} aria-hidden />Raga identity</span></div>
    <Segmented label="Raga identity lens" value={lens} onChange={setLens} options={LENSES.map((item, i) => ({ value: i, label: item.label }))} />
    <div className={`${styles.surface} ${styles.detail}`} aria-live="polite"><h4>{LENSES[lens].label}</h4><p>{LENSES[lens].text}</p></div>
    <div className={styles.grid2}>{[{ label: "Ascent", value: ascent, set: setAscent }, { label: "Descent", value: descent, set: setDescent }].map((direction) => <div className={styles.card} key={direction.label}>
      <p className={styles.eyebrow}>{direction.label} · number of distinct degrees</p>
      <div className="mt-3"><Segmented label={`${direction.label} degree count`} value={direction.value} onChange={direction.set} options={[5, 6, 7].map((n) => ({ value: n, label: `${n} · ${JATI[n]}` }))} size="sm" /></div>
      <div className={styles.steps} aria-label={`${direction.value} of seven degrees`} >{Array.from({ length: 7 }, (_, i) => <span className={i < direction.value ? styles.included : undefined} key={i}>{i + 1}</span>)}</div>
    </div>)}</div>
    <div className={styles.note} aria-live="polite"><strong>{JATI[ascent]}–{JATI[descent]}</strong> · {ascent} ascending and {descent} descending degrees. Upper Sa repeats the tonic and adds no new degree.</div>
    <p className={styles.muted}>The numbered slots illustrate counts, not a particular raga or pitch set. These are common Hindustani jati labels; a five-note minimum is not universal across traditions.</p>
  </div>;
}

function PhraseContour({ notes, label }: { notes: readonly string[]; label: string }) {
  const width = 600;
  const points = notes.map((symbol, index) => ({ symbol, x: 28 + index * ((width - 56) / (notes.length - 1)), y: 30 + (12 - svaraPitch(symbol)) * 7 }));
  return <div className={styles.surface}><p className={styles.eyebrow}>{label}</p><div className="overflow-x-auto" tabIndex={0} role="region" aria-label={`${label} contour, scroll horizontally`}>
    <svg viewBox={`0 0 ${width} 174`} role="img" aria-label={`${label}: ${notes.join(" ")}`} className={styles.contour}>
      {[0, 5, 12].map((pitch) => <line className={styles.guide} key={pitch} x1="15" x2="585" y1={30 + (12 - pitch) * 7} y2={30 + (12 - pitch) * 7} />)}
      <polyline points={points.map(({ x, y }) => `${x},${y}`).join(" ")} />
      {points.map(({ symbol, x, y }, i) => <g key={i}><circle cx={x} cy={y} r="4" /><text x={x} y={y + 22} textAnchor="middle">{symbol}</text></g>)}
    </svg>
  </div><p className={styles.muted}>{notes.join(" → ")}</p></div>;
}

export function KafiComparison() {
  const [selected, setSelected] = useState(0);
  const raga = KAFI_STUDIES[selected];
  return <div className={styles.study}>
    <StudyIntro title="Related pitch material, different movement" text="Choose a taught outline and follow its ascent and descent. Notice omitted notes, turns and points of emphasis." badge="Kafi-family examples" />
    <Segmented label="Kafi-family raga" value={selected} onChange={setSelected} options={KAFI_STUDIES.map((s, i) => ({ value: i, label: s.name }))} />
    <div className={styles.grid3} aria-live="polite">{[["Ascent", `${distinctDegrees(raga.ascent)} degrees`], ["Descent", `${distinctDegrees(raga.descent)} degrees`], ["Vadi / samvadi", `${raga.vadi} / ${raga.samvadi}`]].map(([label, value]) => <div className={styles.card} key={label}><span className={styles.eyebrow}>{label}</span><strong className={styles.metric}>{value}</strong></div>)}</div>
    <PhraseContour label={`${raga.name} · ascent`} notes={raga.ascent} />
    <PhraseContour label={`${raga.name} · descent`} notes={raga.descent} />
    <div className={`${styles.surface} ${styles.detail}`} aria-live="polite"><h4>{raga.name}: what to notice</h4><p>{raga.treatment}</p></div>
    <p className={styles.muted}>Contours connect nominal pitch positions in note order. Spacing does not encode rhythm, duration or performance ornament. These are teaching outlines, with documented variants in the notes below.</p>
  </div>;
}

const ELEMENTS = [
  { label: "Movement", terms: "Aroha · avaroha · pakad · chalan", text: "Ascent, descent, characteristic phrases and broader melodic movement describe how notes connect. Movement may turn back rather than follow a straight scale." },
  { label: "Note roles", terms: "Vadi · samvadi · jiva · nyasa", text: "Identify important notes and places of repose within the appropriate tradition. Hindustani and Carnatic descriptions do not use identical hierarchies." },
  { label: "Note treatment", terms: "Anuvadi · vivadi · varjya · dirgha · alpa", text: "Distinguish regular, restricted and omitted notes from duration and frequency of use. Omission from ascent alone does not establish how long a descending note should last." },
];

export function RagaElements() {
  const [selected, setSelected] = useState(0);
  return <div className={styles.study}>
    <StudyIntro title="Read a raga through three lenses" text="Separate how notes move, the roles they carry and the way they are treated." />
    <Segmented label="Raga element category" value={selected} onChange={setSelected} options={ELEMENTS.map((item, i) => ({ value: i, label: item.label }))} />
    <div className={`${styles.surface} ${styles.detail}`} aria-live="polite"><span className={styles.eyebrow}>{ELEMENTS[selected].label}</span><h4>{ELEMENTS[selected].terms}</h4><p>{ELEMENTS[selected].text}</p></div>
    <div className={styles.card}><h4>Bhimpalasi: tonic, prominence and repose</h4><p>These labels can overlap. Sa is both the tonic and the usual samvadi in this teaching description.</p><div className={`${styles.roles} mt-4`}>
      <span className={`${styles.chip} ${styles.tonic}`}><strong>Sa</strong><small>Tonic · samvadi</small><small>Nyasa</small></span>
      <span className={`${styles.chip} ${styles.tonic}`}><strong>Ma</strong><small>Vadi · nyasa</small></span>
      <span className={styles.chip}><strong>Pa</strong><small>Nyasa</small></span>
      <span className={styles.chip}><strong>Re · Dha</strong><small>Included in descent</small></span>
    </div></div>
    <p className={styles.note}>Vadi does not mean tonic. Bhimpalasi’s prominent Ma does not replace Sa as the reference pitch. Read the full terms and correction notes below.</p>
  </div>;
}

export function ThaatExplorer() {
  const [selected, setSelected] = useState(0);
  const thaat = THAATS[selected];
  return <div className={styles.study}>
    <StudyIntro title="Ten parent collections, one shared tonic" text="Select a row to inspect its seven notes, a pitch-collection comparison and an example raga." badge="Sa = C" />
    <div className={styles.scroll} tabIndex={0} role="region" aria-label="Ten-thaat pitch matrix, scroll horizontally"><table className={styles.matrix}>
      <caption className="sr-only">Membership in each thaat across the twelve nominal Hindustani pitch positions.</caption>
      <thead><tr><th scope="col">Thaat</th>{HINDUSTANI_POSITIONS.map((note, i) => <th scope="col" key={i}>{note.symbol}<span className="block font-normal">{i}</span></th>)}</tr></thead>
      <tbody>{THAATS.map((item, row) => <tr key={item.name} data-selected={selected === row}><th scope="row"><button type="button" aria-pressed={selected === row} onClick={() => setSelected(row)}>{item.name}</button></th>{HINDUSTANI_POSITIONS.map((note, i) => <td key={i}>{(item.semitones as readonly number[]).includes(i) ? <span className={styles.filled}>{note.symbol}</span> : <span className={styles.empty}>—</span>}</td>)}</tr>)}</tbody>
    </table></div>
    <div className={`${styles.surface} ${styles.detail}`} aria-live="polite"><h4>{thaat.name}</h4><NoteChips notes={thaat.notes.split(" ")} /><div className={styles.grid2}><div><span className={styles.eyebrow}>Western pitch collection</span><p>{thaat.comparison === "—" ? "No short comparison listed" : thaat.comparison}</p></div><div><span className={styles.eyebrow}>Example raga</span><p>{thaat.example}</p></div></div></div>
    <div className={styles.grid3}>{[
      ["Ancient theory", "Grama · murchhana · jati", "Tonal systems, successive sequences and melodic types with rules."],
      ["Historical family schemes", "Raga · ragini", "Personified families and Ragamala traditions, with varying lists."],
      ["Modern classification", "Bhatkhande’s ten thaats", "Seven-note parent collections used to classify Hindustani ragas."],
    ].map(([era, title, text]) => <div className={styles.card} key={era}><span className={styles.eyebrow}>{era}</span><h4>{title}</h4><p>{text}</p></div>)}</div>
    <p className={styles.note}>These are different classification lenses, not interchangeable systems. A thaat is not a performance raga, and ten thaats do not exhaust all possible seven-note collections.</p>
  </div>;
}

export function JanakaJanya() {
  const [category, setCategory] = useState("upanga");
  return <div className={styles.study}>
    <StudyIntro title="A parent relationship, with melodic freedom" text="A melakarta supplies a parent framework. A janya may omit notes, turn through them or use different ascending and descending movement." />
    <div className={`${styles.surface} ${styles.detail}`}><span className={styles.eyebrow}>Janaka · melakarta</span><h4>Seven degrees in a complete, straight ascent and descent</h4><NoteChips notes={["Sa", "Ri", "Ga", "Ma", "Pa", "Dha", "Ni"]} /><p>Ri, Ga, Ma, Dha and Ni take the variants specified by the parent.</p></div>
    <div className={styles.flow}><ArrowDown className={styles.arrow} size={18} aria-hidden /><span className={styles.eyebrow}>Associated janya ragas</span><ArrowDown className={styles.arrow} size={18} aria-hidden /></div>
    <Segmented label="Janya relationship" value={category} onChange={setCategory} options={[{ value: "upanga", label: "Upanga" }, { value: "bhashanga", label: "Bhashanga" }]} />
    <div className={`${styles.surface} ${styles.detail}`} aria-live="polite"><h4>{category === "upanga" ? "Upanga: uses only the parent’s notes" : "Bhashanga: also admits anya svaras"}</h4><p>{category === "upanga" ? "Note omission, vakra turns and differences between ascent and descent can still give the janya its own identity." : "Anya svaras are notes foreign to the associated parent. Their treatment belongs to the raga’s grammar; adding arbitrary notes does not define a raga."}</p></div>
    <div className={styles.grid3}>{["Omit a degree", "Use vakra movement", "Vary ascent and descent"].map((label, i) => <div className={styles.card} key={label}><span className={styles.eyebrow}>Possible janya behaviour · {i + 1}</span><h4>{label}</h4></div>)}</div>
    <p className={styles.note}>Association is not an invention date. Omissions can leave several possible parent assignments; tradition and melodic affinity also matter.</p>
  </div>;
}
