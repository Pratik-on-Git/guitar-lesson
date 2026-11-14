"use client";

import { useState } from "react";
import { ScorePlayer } from "@/components/music/score-player";
import { midiFrequency } from "@/lib/music/sound";
import { stepName } from "./piano-diagram";

/** A scale along the low E string: fret dots labelled by interval, step sizes underneath. */
export function OneStringNeck({ frets, labels, title }: { frets: number[]; labels: string[]; title: string }) {
  const fw = 52;
  const left = 50;
  const max = Math.max(...frets);
  const width = left + (max + 1) * fw + 10;
  const sy = 40;
  const x = (f: number) => (f === 0 ? left - 16 : left + (f - 0.5) * fw);
  return (
    <svg role="img" aria-label={title} viewBox={`0 0 ${width} 110`} className="h-auto w-full min-w-[560px]">
      <title>{title}</title>
      <rect x={left} y={sy - 16} width={max * fw} height={32} rx={4} fill="var(--muted)" />
      {Array.from({ length: max + 1 }, (_, i) => <line key={i} x1={left + i * fw} x2={left + i * fw} y1={sy - 16} y2={sy + 16} stroke="var(--muted-foreground)" strokeOpacity={i ? 0.5 : 1} strokeWidth={i ? 2 : 5} />)}
      {[3, 5, 7, 9].filter((f) => f <= max).map((f) => <circle key={f} cx={x(f)} cy={sy} r={4} fill="var(--border)" />)}
      {max >= 12 && <><circle cx={x(12)} cy={sy - 8} r={3.5} fill="var(--border)" /><circle cx={x(12)} cy={sy + 8} r={3.5} fill="var(--border)" /></>}
      <line x1={left - 14} x2={left + max * fw} y1={sy} y2={sy} stroke="var(--foreground)" strokeOpacity={0.6} strokeWidth={2.2} />
      <text x={6} y={sy + 4} fontSize={11} fill="var(--muted-foreground)">E</text>
      {frets.map((f, i) => (
        <g key={i}>
          {labels[i] === "R" ? <rect x={x(f) - 13} y={sy - 13} width={26} height={26} rx={5} fill="var(--primary)" /> : <circle cx={x(f)} cy={sy} r={13} fill="var(--foreground)" />}
          <text x={x(f)} y={sy + 4} fontSize={10} fontWeight={700} textAnchor="middle" fill={labels[i] === "R" ? "var(--primary-foreground)" : "var(--background)"}>{labels[i]}</text>
          <text x={x(f)} y={sy + 32} fontSize={10} textAnchor="middle" fill="var(--muted-foreground)">{f}</text>
        </g>
      ))}
      {frets.slice(1).map((f, i) => (
        <g key={f}>
          <path d={`M ${x(frets[i]) + 2} 84 v 5 H ${x(f) - 2} v -5`} fill="none" stroke="var(--muted-foreground)" strokeWidth={1.2} />
          <text x={(x(f) + x(frets[i])) / 2} y={104} fontSize={12} fontWeight={600} textAnchor="middle" fill={f - frets[i] === 1 ? "var(--primary)" : "var(--foreground)"}>{stepName(f - frets[i])}</text>
        </g>
      ))}
    </svg>
  );
}

/** The 12 pitch classes clockwise from A, showing that one step clockwise is a semitone. */
export function PitchCircle() {
  const names = ["A", "A♯/B♭", "B", "C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭"];
  const c = 170;
  const r = 110;
  const at = (i: number, rr = r) => {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    return [c + rr * Math.cos(a), c + rr * Math.sin(a)] as const;
  };
  const arc = (from: number, to: number, rr: number) => {
    const [x0, y0] = at(from, rr);
    const [x1, y1] = at(to, rr);
    return `M ${x0} ${y0} A ${rr} ${rr} 0 0 1 ${x1} ${y1}`;
  };
  return (
    <svg role="img" aria-label="Twelve notes on a circle, clockwise from A: each step clockwise is one semitone higher; two steps make one tone" viewBox="0 0 340 340" className="mx-auto h-auto w-full max-w-sm">
      <defs><marker id="pc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--primary)" /></marker></defs>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--foreground)" strokeOpacity={0.5} strokeWidth={1.5} />
      {names.map((n, i) => {
        const [x0, y0] = at(i, r);
        const [x1, y1] = at(i, r + 10);
        const [tx, ty] = at(i, r + 30);
        return (
          <g key={n}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--foreground)" strokeWidth={1.5} />
            <text x={tx} y={ty + 4} fontSize={n.length > 2 ? 11 : 14} fontWeight={700} textAnchor="middle" fill={i === 0 ? "var(--primary)" : "var(--foreground)"}>{n}</text>
          </g>
        );
      })}
      <path d={arc(-2.6, -0.4, r - 30)} fill="none" stroke="var(--primary)" strokeWidth={2} markerEnd="url(#pc-arrow)" />
      <text x={c - 52} y={c - 56} fontSize={12} fontWeight={600} fill="var(--primary)">Higher</text>
      <path d={arc(2, 4, r - 14)} fill="none" stroke="var(--series-1)" strokeWidth={4} strokeLinecap="round" />
      <text {...(() => { const [x, y] = at(3, r - 34); return { x, y }; })()} fontSize={11} fontWeight={600} textAnchor="middle" fill="var(--foreground)">1 tone</text>
      <path d={arc(5, 6, r - 14)} fill="none" stroke="var(--series-2)" strokeWidth={4} strokeLinecap="round" />
      <text {...(() => { const [x, y] = at(5.5, r - 36); return { x, y }; })()} fontSize={11} fontWeight={600} textAnchor="middle" fill="var(--foreground)">1 semitone</text>
    </svg>
  );
}

/** Major keys round the circle of fifths with the number of sharps or flats in each signature. */
export function SignatureCircle() {
  const keys: [string, number][] = [["C", 0], ["G", 1], ["D", 2], ["A", 3], ["E", 4], ["B", 5], ["F♯", 6], ["D♭", -5], ["A♭", -4], ["E♭", -3], ["B♭", -2], ["F", -1]];
  const c = 170;
  const r = 105;
  return (
    <svg role="img" aria-label="Circle of fifths: C has no accidentals; clockwise G 1 sharp to F sharp 6 sharps; anticlockwise F 1 flat to D flat 5 flats" viewBox="0 0 340 340" className="mx-auto h-auto w-full max-w-sm">
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--foreground)" strokeOpacity={0.5} strokeWidth={1.5} />
      {keys.map(([k, n], i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const p = (rr: number) => [c + rr * Math.cos(a), c + rr * Math.sin(a)];
        const [ox, oy] = p(r + 28);
        const [ix, iy] = p(r - 28);
        const [l0x, l0y] = p(r);
        const [l1x, l1y] = p(r + 9);
        const sym = n > 0 ? "♯" : "♭";
        const count = Math.abs(n);
        return (
          <g key={k}>
            <line x1={l0x} y1={l0y} x2={l1x} y2={l1y} stroke="var(--foreground)" strokeWidth={1.5} />
            <text x={ox} y={oy + 5} fontSize={16} fontWeight={700} textAnchor="middle" fill="var(--foreground)">{k}</text>
            {count > 0 && <text x={ix} y={iy + 4} fontSize={count > 3 ? 10 : 12} fontWeight={700} textAnchor="middle" fill={n > 0 ? "var(--series-1)" : "var(--series-2)"}>{sym.repeat(Math.min(count, 3))}{count > 3 && <tspan x={ix} dy={11}>{sym.repeat(count - 3)}</tspan>}</text>}
          </g>
        );
      })}
      <text x={c} y={c - 4} fontSize={11} textAnchor="middle" fill="var(--muted-foreground)">clockwise: +1 ♯</text>
      <text x={c} y={c + 12} fontSize={11} textAnchor="middle" fill="var(--muted-foreground)">anticlockwise: +1 ♭</text>
    </svg>
  );
}

/** Slash chord (upper chord over a bass note) or polychord (chord over chord), as notation. */
export function ChordStack({ upper, lower, kind }: { upper: string; lower: string; kind: "slash" | "poly" }) {
  return kind === "slash" ? (
    <p className="font-serif text-5xl font-bold" aria-label={`${upper} over bass note ${lower}`}>
      {upper}<span className="text-muted-foreground mx-1 inline-block translate-y-3 text-4xl">/</span><span className="inline-block translate-y-6 text-4xl">{lower}</span>
    </p>
  ) : (
    <p className="inline-flex flex-col items-center font-serif text-4xl font-bold" aria-label={`Polychord: ${upper} above ${lower}`}>
      <span>{upper}</span><span className="bg-foreground my-1 h-1 w-full min-w-28 rounded-full" aria-hidden /><span>{lower}</span>
    </p>
  );
}

/** A note list grouped under braces, e.g. the two chords inside one stacked sonority. */
export function BraceGroups({ groups }: { groups: { label: string; notes: string[] }[] }) {
  return (
    <div className="flex flex-wrap gap-4" role="list">
      {groups.map((g) => (
        <div key={g.label} role="listitem" className="flex flex-col items-center">
          <div className="flex gap-1.5">{g.notes.map((n) => <span key={n} className="bg-card rounded-md border px-2 py-1 font-serif text-sm font-semibold">{n}</span>)}</div>
          <div className="border-muted-foreground/60 mt-1 h-2.5 w-full rounded-b-lg border-x-2 border-b-2" aria-hidden />
          <span className="mt-1 font-serif font-bold">{g.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Coarse and fine pitch adjustment: octaves, semitones and cents applied to a reference note. */
export function TuningPanel() {
  const [oct, setOct] = useState(0);
  const [semi, setSemi] = useState(0);
  const [cents, setCents] = useState(-2);
  const base = 60;
  const reference = midiFrequency(base);
  const shifted = reference * 2 ** (oct + semi / 12 + cents / 1200);
  const total = oct * 1200 + semi * 100 + cents;
  const slider = (label: string, value: number, set: (n: number) => void, min: number, max: number, unit: string) => (
    <label className="flex flex-col gap-2 rounded-xl border p-3 text-sm font-medium">
      <span className="flex justify-between">{label}<span className="font-mono">{value > 0 ? "+" : ""}{value} {unit}</span></span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => set(Number(e.target.value))} className="accent-primary" aria-label={`${label} (${unit})`} />
    </label>
  );
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {slider("Octaves", oct, setOct, -2, 2, "oct")}
        {slider("Semitones", semi, setSemi, -11, 11, "st")}
        {slider("Cents", cents, setCents, -50, 50, "¢")}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border p-3"><p className="text-muted-foreground text-xs">Reference · C4</p><p className="text-metric-sm font-semibold">{reference.toFixed(2)} Hz</p></div>
        <div className="rounded-xl border p-3"><p className="text-muted-foreground text-xs">Total shift</p><p className="text-metric-sm font-semibold">{total > 0 ? "+" : ""}{total} ¢</p></div>
        <div className="rounded-xl border p-3"><p className="text-muted-foreground text-xs">Result</p><p className="text-metric-sm font-semibold">{shifted.toFixed(2)} Hz</p></div>
      </div>
      <div aria-hidden className="bg-muted relative h-3 rounded-full">
        <span className="bg-border absolute top-0 left-1/2 h-3 w-0.5" />
        <span className="bg-primary absolute top-0 h-3 rounded-full" style={{ left: `${50 + Math.min(0, cents)}%`, width: `${Math.abs(cents)}%` }} />
      </div>
      <p className="text-muted-foreground text-xs">Bar: the cents offset within ±50 ¢ (half a semitone). One octave = 1,200 ¢; one equal-tempered semitone = 100 ¢.</p>
      <ScorePlayer key={`${oct}${semi}${cents}`} events={[{ at: 0, duration: 1.2, frequency: reference }, { at: 1.5, duration: 1.2, frequency: shifted }, { at: 3, duration: 2, frequency: reference, velocity: 0.04 }, { at: 3, duration: 2, frequency: shifted, velocity: 0.04 }]} beats={5.2} bpm={60} label="Hear reference, then shifted" />
    </div>
  );
}
