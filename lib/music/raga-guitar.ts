import { CARNATIC_SVARAS, HINDUSTANI_POSITIONS, MELAKARTAS, THAATS } from "./raga.ts";
import { KAFI_STUDIES, svaraPitch } from "./raga-studies.ts";
import { mod, TUNING } from "./theory.ts";

export type GuitarTone = { symbol: string; offset: number };
export type GuitarStudy = { id: string; title: string; kind: "Pitch maps" | "Raga outlines" | "Ten thaats" | "Melakartas"; ascent: GuitarTone[]; descent: GuitarTone[]; description: string };
export type GuitarStep = GuitarTone & { midi: number; string: number; fret: number; finger: number; position: number; shift: boolean };
export type GuitarRoute = { mode: "single"; string: number } | { mode: "region"; start: number };
/** Keep generated routes within a conservative, widely available fret range. */
export const GUITAR_MAX_FRET = 19;

const chromatic = (carnatic: boolean): GuitarTone[] => [
  ...HINDUSTANI_POSITIONS.map((note, offset) => ({ offset, symbol: carnatic ? CARNATIC_SVARAS.filter((s) => s.semitones === offset).map((s) => s.symbol).join("/") : note.symbol })),
  { symbol: carnatic ? "S′" : "Sa′", offset: 12 },
];
const study = (id: string, title: string, kind: GuitarStudy["kind"], ascent: GuitarTone[], description: string, descent = [...ascent].reverse()): GuitarStudy => ({ id, title, kind, ascent, descent, description });

export const GUITAR_STUDIES: GuitarStudy[] = [
  study("hindustani", "Hindustani · 12 positions", "Pitch maps", chromatic(false), "A chromatic naming exercise, not the scale of a particular raga."),
  study("carnatic", "Carnatic · 16 names", "Pitch maps", chromatic(true), "Shared names occupy the same fret. This is a naming map, not a raga."),
  ...KAFI_STUDIES.map((raga, index) => study(`raga-${index}`, `${raga.name} · taught outline`, "Raga outlines", raga.ascent.map((symbol) => ({ symbol, offset: svaraPitch(symbol) })), raga.treatment, raga.descent.map((symbol) => ({ symbol, offset: svaraPitch(symbol) })))),
  ...THAATS.map((thaat, index) => study(`thaat-${index}`, `${thaat.name} · thaat`, "Ten thaats", [...thaat.semitones.map((offset, i) => ({ offset, symbol: thaat.notes.split(" ")[i] })), { offset: 12, symbol: "Sa′" }], "A parent-collection fingering exercise. The example raga’s movement and ornaments require separate study.")),
  ...MELAKARTAS.map((mela) => study(`melakarta-${mela.number}`, `${mela.number}. ${mela.name}`, "Melakartas", [...mela.semitones.map((offset, i) => ({ offset, symbol: mela.svaras[i] })), { offset: 12, symbol: "S′" }], "An equal-tempered pitch route for the modern sampurna collection. Learn raga-specific gamakas from a taught rendition.")),
];

export function guitarStudy(id: string): GuitarStudy {
  return GUITAR_STUDIES.find((item) => item.id === id) ?? GUITAR_STUDIES[0];
}

export function guitarLessonDefault(lesson: string, mela?: string | null) {
  if (mela && MELAKARTAS.some((item) => String(item.number) === mela)) return `melakarta-${mela}`;
  if (lesson === "carnatic-svaras") return "carnatic";
  if (["what-is-raga", "raga-versus-scale", "raga-elements", "raga-guitar"].includes(lesson)) return "raga-0";
  if (lesson === "thaats") return "thaat-0";
  if (lesson === "janaka-and-janya") return "melakarta-29";
  if (["melakarta-construction", "melakarta-chart"].includes(lesson)) return "melakarta-1";
  if (lesson === "katapayadi-and-chakras") return "melakarta-28";
  return "hindustani";
}

export function practiceTones(material: GuitarStudy, direction: string): GuitarTone[] {
  if (direction === "descent") return material.descent;
  if (direction === "both") return [...material.ascent, ...material.descent.slice(1)];
  return material.ascent;
}

export function soundingPitch(midi: number): string {
  return `${HINDUSTANI_POSITIONS[mod(midi, 12)].western}${Math.floor(midi / 12) - 1}`;
}

function candidates(midi: number, route: GuitarRoute) {
  return TUNING.flatMap((open, string) => {
    const fret = midi - open;
    if (fret < 0 || fret > GUITAR_MAX_FRET) return [];
    if (route.mode === "single" && route.string !== string) return [];
    if (route.mode === "region" && (fret < route.start || fret > route.start + 4)) return [];
    return [{ string, fret }];
  });
}

/** Regions are five-fret windows; the fifth fret may require an explicit hand shift. */
export function playableRegions(tones: readonly GuitarTone[], saMidi: number): number[] {
  return Array.from({ length: 13 }, (_, start) => start).filter((start) => tones.every((tone) => candidates(saMidi + tone.offset, { mode: "region", start }).length > 0));
}

export function playableStrings(tones: readonly GuitarTone[], saMidi: number): number[] {
  return TUNING.flatMap((_, string) => tones.every((tone) => candidates(saMidi + tone.offset, { mode: "single", string }).length > 0) ? [string] : []);
}

/** Match exact sounding pitches, preserving lower ni, upper Sa and descending turns. */
export function guitarRoute(tones: readonly GuitarTone[], saMidi: number, route: GuitarRoute): GuitarStep[] {
  if (!tones.length) return [];
  const options = tones.map((tone) => candidates(saMidi + tone.offset, route));
  if (options.some((positions) => !positions.length)) return [];
  // Keep notes in the requested region and favour short fret/string movements.
  const costs: number[][] = [options[0].map((point) => point.fret * .01)];
  const previous: number[][] = [options[0].map(() => -1)];
  for (let step = 1; step < options.length; step++) {
    costs[step] = [];
    previous[step] = [];
    for (const [index, point] of options[step].entries()) {
      let best = Infinity;
      let parent = 0;
      for (const [priorIndex, prior] of options[step - 1].entries()) {
        const cost = costs[step - 1][priorIndex] + Math.abs(point.fret - prior.fret) + 1.5 * Math.abs(point.string - prior.string);
        if (cost < best) { best = cost; parent = priorIndex; }
      }
      costs[step][index] = best;
      previous[step][index] = parent;
    }
  }
  const chosen = options.map(() => 0);
  chosen[chosen.length - 1] = costs.at(-1)!.indexOf(Math.min(...costs.at(-1)!));
  for (let step = chosen.length - 1; step > 0; step--) chosen[step - 1] = previous[step][chosen[step]];
  let position = route.mode === "region" ? Math.max(1, route.start) : Math.max(1, options[0][chosen[0]].fret);
  return tones.map((tone, step) => {
    const point = options[step][chosen[step]];
    const before = position;
    if (point.fret > 0 && point.fret < position) position = point.fret;
    if (point.fret > position + 3) position = point.fret - 3;
    return { ...tone, ...point, midi: saMidi + tone.offset, finger: point.fret === 0 ? 0 : point.fret - position + 1, position, shift: step > 0 && before !== position };
  });
}

export function guitarTab(route: readonly GuitarStep[]): string {
  return [...TUNING].reverse().map((_, row) => {
    const string = 5 - row;
    const label = ["E", "A", "D", "G", "B", "e"][string];
    return `${label}|${route.map((step) => step.string === string ? String(step.fret).padStart(2, "-") + "-" : "---").join("")}|`;
  }).join("\n");
}
