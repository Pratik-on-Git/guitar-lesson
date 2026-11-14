import { degreeSemitones, mod, parseDegree, TUNING } from "./theory.ts";

/*
 * Playable chord grips for any formula and root, found by search rather than
 * stored: every 4-fret window (with open strings near the nut) is tried, each
 * string either muted or a chord tone, and the result scored like a guitarist
 * would: all essential tones, the chosen bass lowest, few fingers, compact.
 */

export type ChordGrip = {
  /** Fret per string, low E first; null = muted, 0 = open. */
  frets: (number | null)[];
  /** Formula degree sounding on each string. */
  degrees: (string | null)[];
  /** First fret drawn in a five-fret box. */
  baseFret: number;
  /** Lowest fretted fret held by one finger across several strings. */
  barre?: { fret: number; from: number; to: number };
};

function essential(formula: string[]): Set<string> {
  const n = formula.length;
  const keep = new Set(formula);
  if (n >= 4 && keep.has("5")) keep.delete("5");
  if (keep.has("13")) { keep.delete("11"); keep.delete("9"); }
  else if (keep.has("11") && n >= 6) keep.delete("9");
  return keep;
}

function fingers(frets: (number | null)[]) {
  const fretted = frets.map((f, s) => ({ f, s })).filter((x): x is { f: number; s: number } => x.f !== null && x.f > 0);
  if (!fretted.length) return { count: 0 };
  const low = Math.min(...fretted.map((x) => x.f));
  const atLow = fretted.filter((x) => x.f === low);
  if (atLow.length >= 2) {
    const from = Math.min(...atLow.map((x) => x.s));
    const to = Math.max(...atLow.map((x) => x.s));
    // A barre can only lie flat if nothing between its ends is open or lower.
    const flat = frets.slice(from, to + 1).every((f) => f !== null && f >= low);
    if (flat) return { count: 1 + fretted.filter((x) => x.f !== low).length, barre: { fret: low, from, to } };
  }
  return { count: fretted.length };
}

const cache = new Map<string, ChordGrip[]>();

export function findGrips(rootPc: number, formula: string[], { bass = formula[0], limit = 4 }: { bass?: string; limit?: number } = {}): ChordGrip[] {
  const key = `${rootPc}|${formula.join(",")}|${bass}|${limit}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const bySemi = new Map(formula.map((d) => [mod(rootPc + degreeSemitones(parseDegree(d)), 12), d]));
  const need = essential(formula);
  const minStrings = 4;
  const found: { grip: ChordGrip; score: number }[] = [];
  for (let start = 1; start <= 12; start++) {
    const options = TUNING.map((open) => {
      const list: (number | null)[] = [null];
      if (start <= 4 && bySemi.has(mod(open, 12))) list.push(0);
      for (let f = start; f < start + 4; f++) if (bySemi.has(mod(open + f, 12))) list.push(f);
      return list;
    });
    const frets: (number | null)[] = Array(6).fill(null);
    const walk = (s: number) => {
      if (s < 6) { for (const f of options[s]) { frets[s] = f; walk(s + 1); } return; }
      const sounding = frets.map((f, i) => (f === null ? -1 : i)).filter((i) => i >= 0);
      if (sounding.length < minStrings) return;
      const degrees = frets.map((f, i) => (f === null ? null : bySemi.get(mod(TUNING[i] + f, 12))!));
      if (degrees[sounding[0]] !== bass) return;
      const present = new Set(degrees.filter(Boolean));
      for (const d of need) if (!present.has(d)) return;
      const interior = frets.slice(sounding[0], sounding.at(-1)! + 1).filter((f) => f === null).length;
      if (interior > 1) return;
      const { count, barre } = fingers(frets);
      if (count > 4) return;
      const held = frets.filter((f): f is number => f !== null && f > 0);
      const span = held.length ? Math.max(...held) - Math.min(...held) : 0;
      if (span > 3) return;
      const doubledThird = degrees.filter((d) => d && /^[b#]?3$/.test(d)).length > 1;
      const score = sounding.length * 2 - interior * 4 - span * 1.5 - count * 0.6 - (held.length ? Math.min(...held) : 0) * 0.25
        + frets.filter((f) => f === 0).length * 0.8 - (doubledThird ? 0.5 : 0) - sounding[0] * 0.5 + (barre ? 0.5 : 0);
      const lowFret = held.length ? Math.min(...held) : 1;
      found.push({ grip: { frets: [...frets], degrees, baseFret: lowFret <= 2 && Math.max(0, ...held) <= 5 ? 1 : lowFret, barre }, score });
    };
    walk(0);
  }
  found.sort((a, b) => b.score - a.score);
  const picked: ChordGrip[] = [];
  const seen = new Set<string>();
  for (const { grip } of found) {
    const id = grip.frets.join(",");
    if (seen.has(id)) continue;
    seen.add(id);
    // Prefer grips in different neck regions.
    if (picked.some((p) => Math.abs(p.baseFret - grip.baseFret) < 3)) continue;
    picked.push(grip);
    if (picked.length === limit) break;
  }
  picked.sort((a, b) => a.baseFret - b.baseFret);
  cache.set(key, picked);
  return picked;
}

/** A grip from explicit string/fret pairs (drop voicings, book shapes). */
export function gripFrom(notes: { string: number; fret: number; degree: string }[]): ChordGrip {
  const frets: (number | null)[] = Array(6).fill(null);
  const degrees: (string | null)[] = Array(6).fill(null);
  for (const n of notes) { frets[n.string] = n.fret; degrees[n.string] = n.degree; }
  const held = notes.map((n) => n.fret).filter((f) => f > 0);
  const low = held.length ? Math.min(...held) : 1;
  const high = held.length ? Math.max(...held) : 1;
  return { frets, degrees, baseFret: high <= 5 ? 1 : low, barre: fingers(frets).barre };
}

/** MIDI pitches of a grip, low to high, for playback. */
export function gripMidis(grip: ChordGrip) {
  return grip.frets.map((f, s) => (f === null ? null : TUNING[s] + f)).filter((m): m is number => m !== null);
}
