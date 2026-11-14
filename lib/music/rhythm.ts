/** Twelve ticks per quarter: straight sixteenths and eighth triplets stay exact. */
export const TICKS_PER_QUARTER = 12;
export type RhythmUnit = { id: number; name: string; values: number[]; count: string; page: number };
/** Positive duration = sounding note, negative duration = rest. All sum to one beat. */
export const RHYTHM_UNITS: RhythmUnit[] = [
  { id: 1, name: "Quarter", values: [12], count: "1 (e) (&) (a)", page: 163 },
  { id: 2, name: "Two eighths", values: [6, 6], count: "1 (e) & (a)", page: 163 },
  { id: 3, name: "Four sixteenths", values: [3, 3, 3, 3], count: "1 e & a", page: 163 },
  { id: 4, name: "Eighth + two sixteenths", values: [6, 3, 3], count: "1 (e) & a", page: 163 },
  { id: 5, name: "Two sixteenths + eighth", values: [3, 3, 6], count: "1 e & (a)", page: 164 },
  { id: 6, name: "Sixteenth + eighth + sixteenth", values: [3, 6, 3], count: "1 e (&) a", page: 164 },
  { id: 7, name: "Dotted eighth + sixteenth", values: [9, 3], count: "1 (e) (&) a", page: 164 },
  { id: 8, name: "Sixteenth + dotted eighth", values: [3, 9], count: "1 e (&) (a)", page: 164 },
  { id: 9, name: "Eighth-note triplets", values: [4, 4, 4], count: "1 trip let", page: 164 },
  { id: 10, name: "Eighth rest + eighth", values: [-6, 6], count: "[1] [e] & (a)", page: 165 },
  { id: 11, name: "Sixteenth rest + three sixteenths", values: [-3, 3, 3, 3], count: "[1] e & a", page: 166 },
  { id: 12, name: "Eighth rest + two sixteenths", values: [-6, 3, 3], count: "[1] [e] & a", page: 166 },
  { id: 13, name: "Sixteenth rest + sixteenth + eighth", values: [-3, 3, 6], count: "[1] e & (a)", page: 166 },
  { id: 14, name: "Sixteenth rest + eighth + sixteenth", values: [-3, 6, 3], count: "[1] e (&) a", page: 166 },
  { id: 15, name: "Dotted-eighth rest + sixteenth", values: [-9, 3], count: "[1] [e] [&] a", page: 166 },
  { id: 16, name: "Sixteenth rest + dotted eighth", values: [-3, 9], count: "[1] e (&) (a)", page: 167 },
  { id: 17, name: "Triplet rest + two triplet notes", values: [-4, 4, 4], count: "[1] trip let", page: 167 },
];
export const RHYTHM_EXERCISES = [
  { id: "source-1", name: "Book sequence 1 · answer key", pages: "165, 219–220", bars: [[2, 5, 5, 6], [2, 3, 5, 4], [9, 9, 5, 4], [5, 4, 8, 8]] },
  { id: "source-2", name: "Book sequence 2 · corrected answer key", pages: "167, 220", bars: [[15, 12, 17, 12], [10, 11, 13, 12], [17, 17, 13, 12], [13, 12, 10, 16]] },
];
export type RhythmEvent = { tick: number; ticks: number; rest: boolean; bar: number; beat: number; unit: number };
export function compileRhythm(bars: number[][]): RhythmEvent[] {
  return bars.flatMap((bar, b) => bar.flatMap((id, beat) => {
    const unit = RHYTHM_UNITS.find((u) => u.id === id);
    if (!unit) throw new Error(`Unknown rhythm unit ${id}`);
    let tick = (b * 4 + beat) * TICKS_PER_QUARTER;
    return unit.values.map((value) => { const event = { tick, ticks: Math.abs(value), rest: value < 0, bar: b, beat, unit: id }; tick += Math.abs(value); return event; });
  }));
}
export function unitCells(id: number): ("attack" | "hold" | "rest")[] {
  const events = compileRhythm([[id]]); const cells: ("attack" | "hold" | "rest")[] = Array(12).fill("rest");
  for (const event of events) for (let i = event.tick; i < event.tick + event.ticks; i++) cells[i] = event.rest ? "rest" : i === event.tick ? "attack" : "hold";
  return cells;
}
export const METERS = [
  { id: "2-4", name: "2/4 · simple duple", numerator: 2, denominator: 4, groups: [1, 1] },
  { id: "3-4", name: "3/4 · simple triple", numerator: 3, denominator: 4, groups: [1, 1, 1] },
  { id: "4-4", name: "4/4 · simple quadruple", numerator: 4, denominator: 4, groups: [1, 1, 1, 1] },
  { id: "6-8", name: "6/8 · compound duple", numerator: 6, denominator: 8, groups: [3, 3] },
  { id: "9-8", name: "9/8 · compound triple", numerator: 9, denominator: 8, groups: [3, 3, 3] },
  { id: "12-8", name: "12/8 · compound quadruple", numerator: 12, denominator: 8, groups: [3, 3, 3, 3] },
  { id: "5-4", name: "5/4 · 3+2", numerator: 5, denominator: 4, groups: [3, 2] },
  { id: "7-8", name: "7/8 · 3+2+2", numerator: 7, denominator: 8, groups: [3, 2, 2] },
  { id: "7-8-alt", name: "7/8 · 2+2+3", numerator: 7, denominator: 8, groups: [2, 2, 3] },
];
export function meterPulses(id: string) {
  const meter = METERS.find((m) => m.id === id) ?? METERS[2];
  const groupStarts = meter.groups.map((_, i) => meter.groups.slice(0, i).reduce((a, b) => a + b, 0) * 8 / meter.denominator);
  const eighths = meter.numerator * 8 / meter.denominator;
  return { meter, beats: eighths / 2, pulses: Array.from({ length: eighths }, (_, i) => ({ at: i / 2, strong: groupStarts.includes(i), first: i === 0 })) };
}
export const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
export const lcm = (a: number, b: number) => a * b / gcd(a, b);
export function crossRhythm(a: number, b: number, kind: "polyrhythm" | "polymeter") {
  const grid = lcm(a, b);
  return kind === "polyrhythm"
    ? { grid, beats: 4, tracks: [a, b].map((n) => Array.from({ length: n }, (_, i) => ({ slot: i * grid / n, at: i * 4 / n, accent: i === 0 }))) }
    : { grid, beats: grid, tracks: [a, b].map((n) => Array.from({ length: grid }, (_, i) => ({ slot: i, at: i, accent: i % n === 0 }))) };
}
