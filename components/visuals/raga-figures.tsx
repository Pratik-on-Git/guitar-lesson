"use client";

import { useState } from "react";
import { CARNATIC_SVARAS, HINDUSTANI_POSITIONS } from "@/lib/music/raga";
import { BarChart } from "./charts";

const RAGAS = [
  { name: "Yaman", pitches: [0, 2, 4, 6, 7, 9, 11] },
  { name: "Durga", pitches: [0, 2, 5, 7, 9] },
  { name: "Malkauns", pitches: [0, 3, 5, 8, 10] },
];
const TALAS: [string, string[]][] = [["Dhruva", ["L", "D", "L", "L"]], ["Matya", ["L", "D", "L"]], ["Rupaka", ["D", "L"]], ["Jhampa", ["L", "A", "D"]], ["Triputa", ["L", "D", "D"]], ["Ata", ["L", "L", "D", "D"]], ["Eka", ["L"]]];

function PitchMap() {
  const [selected, setSelected] = useState(0);
  return <div className="space-y-4">
    <h3 className="text-sm font-semibold">One octave, two naming systems</h3>
    <p className="text-muted-foreground text-xs">Choose a pitch position to compare its names. Numbers count semitones above Sa, not shrutis.</p>
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">{HINDUSTANI_POSITIONS.map((note, i) => <button key={i} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)} className={`rounded-lg border p-3 text-left focus-visible:outline-2 focus-visible:outline-ring ${selected === i ? "border-primary bg-primary/10" : "bg-muted/40"}`}><span className="text-muted-foreground block text-xs">{i} semitones</span><strong className="mt-1 block text-sm">{note.symbol}</strong><span className="text-xs">{note.western}</span></button>)}</div>
    <p aria-live="polite" className="rounded-lg bg-muted p-3 text-sm"><strong>{HINDUSTANI_POSITIONS[selected].name}</strong> · Carnatic: {CARNATIC_SVARAS.filter((note) => note.semitones === selected).map((note) => `${note.symbol} (${note.name})`).join(" / ")}</p>
    <p className="text-muted-foreground text-xs">Equal-tempered location map, Sa = C. Performance intonation and gamaka are not represented by these fixed positions.</p>
  </div>;
}

function RagaComparison() {
  return <div className="space-y-5">
    <h3 className="text-sm font-semibold">Which pitch positions does each raga use?</h3>
    <div className="overflow-x-auto rounded-lg border" tabIndex={0} role="region" aria-label="Raga pitch comparison, scroll horizontally"><table className="w-full min-w-[620px] text-center text-xs"><caption className="sr-only">Filled cells name included degrees; a dash marks an omitted pitch position.</caption><thead><tr><th scope="col" className="p-3 text-left">Raga</th>{HINDUSTANI_POSITIONS.map((note, i) => <th key={i} scope="col" className="p-2">{i}<span className="text-muted-foreground block font-normal">{note.western}</span></th>)}</tr></thead><tbody>{RAGAS.map((raga) => <tr key={raga.name}><th scope="row" className="p-3 text-left">{raga.name}</th>{HINDUSTANI_POSITIONS.map((note, i) => <td key={i} className="p-1">{raga.pitches.includes(i) ? <span className="block rounded bg-primary/15 p-2 font-semibold text-primary">{note.symbol}</span> : <span className="text-muted-foreground">—</span>}</td>)}</tr>)}</tbody></table></div>
    <BarChart title="Distinct pitch degrees per octave" unit="degrees" max={7} labelWidth="5rem" bars={RAGAS.map((raga) => ({ label: raga.name, value: raga.pitches.length }))} />
    <p className="text-muted-foreground text-xs">Sa = C for comparison. This shows note membership only, not characteristic phrases, resting points or ornaments. Upper Sa repeats the tonic and is not an extra degree.</p>
  </div>;
}

function TalaChart() {
  const [jati, setJati] = useState(4);
  return <div className="space-y-4">
    <label className="flex flex-wrap items-center gap-3 text-sm font-medium">Laghu jati<select aria-label="Laghu jati" value={jati} onChange={(event) => setJati(Number(event.target.value))} className="rounded-md border bg-card p-2">{[[3, "Tisra"], [4, "Chaturasra"], [5, "Khanda"], [7, "Misra"], [9, "Sankirna"]].map(([value, name]) => <option value={value} key={value}>{name} · {value} counts</option>)}</select></label>
    <BarChart title="Cycle length by tala" unit="counts" max={29} labelWidth="5rem" bars={TALAS.map(([label, angas]) => ({ label, value: angas.reduce((sum, anga) => sum + (anga === "L" ? jati : anga === "D" ? 2 : 1), 0), detail: angas.map((anga) => `${anga}=${anga === "L" ? jati : anga === "D" ? 2 : 1}`).join(" + ") }))} />
    <p aria-live="polite" className="text-xs text-muted-foreground">L = laghu ({jati}); D = drutam (2); A = anudrutam (1). The chart keeps a fixed 0–29 scale so changing jati remains comparable.</p>
    <div className="flex gap-1" aria-label={`Triputa grouping: ${jati} plus 2 plus 2 counts`}>{[jati, 2, 2].map((count, i) => <div key={i} style={{ flex: count }} className={`rounded-lg border p-3 text-center ${i === 0 ? "border-primary bg-primary/10" : "bg-muted"}`}><strong className="block text-sm">{i === 0 ? "L" : "D"} · {count}</strong></div>)}</div>
    <p className="text-xs text-muted-foreground">Triputa above: segment widths represent counts. Chaturasra jati gives Adi tala’s 4 + 2 + 2 structure.</p>
  </div>;
}

function TeentalCycle() {
  const [beat, setBeat] = useState(0);
  const gesture = beat === 0 ? "Clap · sam" : beat === 4 || beat === 12 ? "Clap" : beat === 8 ? "Wave · khali" : "Continue counting";
  return <div className="space-y-4">
    <h3 className="text-sm font-semibold">Teental: feel the four divisions</h3>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{["Clap · sam", "Clap", "Wave · khali", "Clap"].map((label, group) => <div key={group} className="rounded-lg border p-2"><p className="mb-2 text-xs font-medium">{label}</p><div className="grid grid-cols-4 gap-1">{Array.from({ length: 4 }, (_, offset) => { const index = group * 4 + offset; return <button type="button" key={index} aria-label={`Beat ${index + 1}`} aria-pressed={beat === index} onClick={() => setBeat(index)} className={`rounded py-2 text-xs focus-visible:outline-2 focus-visible:outline-ring ${beat === index ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{index + 1}</button>; })}</div></div>)}</div>
    <div className="flex flex-wrap items-center gap-3"><button type="button" className="rounded-md border px-3 py-2 text-sm hover:bg-muted" onClick={() => setBeat((beat + 1) % 16)}>Next beat →</button><p aria-live="polite" className="text-sm">Beat {beat + 1} of 16 · {gesture}</p></div>
    <p className="text-muted-foreground text-xs">4 + 4 + 4 + 4, then back to sam. Khali marks a division with a wave; it does not mean four beats of silence. Advance manually while keeping a steady pulse.</p>
  </div>;
}

export const RAGA_VISUALS: Record<string, () => React.ReactNode> = {
  "raga-pitch-map": PitchMap,
  "raga-comparison": RagaComparison,
  "raga-tala-chart": TalaChart,
  "raga-teental": TeentalCycle,
};
