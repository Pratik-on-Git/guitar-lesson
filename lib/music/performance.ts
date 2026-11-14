import { degreeSemitones, mod, parseDegree, TUNING, type FretNote } from "./theory.ts";

/** Seven-note 3NPS fingering with the same sounding pitch on G's last/B's first note. */
export function doubleNotePosition(rootPc: number, semis: number[], startIndex: number): FretNote[] {
  if (semis.length !== 7) throw new Error("Double Note construction requires seven notes.");
  const initial = TUNING[0] + mod(rootPc - TUNING[0] + semis[startIndex], 12);
  const midiOf = (step: number) => initial - semis[startIndex] + semis[(startIndex + step) % 7] + 12 * Math.floor((startIndex + step) / 7);
  let step = 0;
  const result: FretNote[] = [];
  for (let string = 0; string < 6; string++) {
    if (string === 4) step--;
    for (let n = 0; n < 3; n++, step++) result.push({ string, fret: midiOf(step) - TUNING[string], index: (startIndex + step) % 7 });
  }
  const shift = Math.min(...result.map((n) => n.fret)) < 0 ? 12 : 0;
  return result.map((n) => ({ ...n, fret: n.fret + shift }));
}

export type VoicingKind = "close" | "drop-2" | "drop-3";
export type Voice = { midi: number; index: number };
/** Select the resulting bass inversion, rather than the starting close inversion. */
export function chordVoices(rootPc: number, formula: string[], inversion: number, kind: VoicingKind): Voice[] {
  const semis = formula.map((f) => degreeSemitones(parseDegree(f)));
  const n = semis.length;
  const bass = mod(inversion, n);
  if (kind !== "close" && n !== 4) throw new Error("Drop recipes require four chord tones.");
  for (let start = 0; start < n; start++) {
    let voices = Array.from({ length: n }, (_, k) => {
      const i = (start + k) % n;
      return { index: i, midi: 60 + rootPc + semis[i] + (start + k >= n ? 12 : 0) };
    });
    if (kind !== "close") {
      const drop = n - (kind === "drop-2" ? 2 : 3);
      voices = voices.map((v, i) => ({ ...v, midi: v.midi - (i === drop ? 12 : 0) }));
    }
    voices.sort((a, b) => a.midi - b.midi);
    if (voices[0].index === bass) return voices;
  }
  return [];
}

export const STRING_SETS = {
  triad: [[3, 4, 5], [2, 3, 4], [1, 2, 3], [0, 1, 2]],
  "drop-2": [[2, 3, 4, 5], [1, 2, 3, 4], [0, 1, 2, 3]],
  "drop-3": [[1, 3, 4, 5], [0, 2, 3, 4]],
  close: [[2, 3, 4, 5], [1, 2, 3, 4], [0, 1, 2, 3]],
};

/** Exact pitch spacing from the drop recipe, one voice per selected string. */
export function guitarVoicings(voices: Voice[], strings: number[]): FretNote[][] {
  if (voices.length !== strings.length) return [];
  const result: FretNote[][] = [];
  for (let bassFret = 0; bassFret <= 24; bassFret++) {
    const bassMidi = TUNING[strings[0]] + bassFret;
    if (mod(bassMidi, 12) !== mod(voices[0].midi, 12)) continue;
    const shape = voices.map((voice, i) => ({ string: strings[i], fret: bassMidi + voice.midi - voices[0].midi - TUNING[strings[i]], index: voice.index }));
    const frets = shape.map((n) => n.fret);
    if (frets.every((f) => f >= 0 && f <= 24) && Math.max(...frets) - Math.min(...frets) <= 7) result.push(shape);
  }
  return result;
}

export const MODE_COLOURS: Record<string, { characteristic: string[]; altered: string[]; comparison: string }> = {
  major: { characteristic: [], altered: [], comparison: "Ionian is the major comparison baseline." },
};
export function modeColour(family: string, start: number) {
  const colour = [[], ["6"], ["b2"], ["#4"], ["b7"], [], ["b2", "b5"]][start];
  if (family === "major") return { characteristic: colour, altered: [], comparison: start === 0 ? "Ionian: major baseline" : start === 5 ? "Aeolian: natural-minor baseline" : "Compared with Ionian or Aeolian" };
  if (family === "harmonic-minor") return [
    { characteristic: ["b6"], altered: ["7"], comparison: "Aeolian with a raised seventh" },
    { characteristic: ["b2", "b5"], altered: ["6"], comparison: "Locrian with a natural sixth" },
    { characteristic: [], altered: ["#5"], comparison: "Ionian with a raised fifth" },
    { characteristic: ["6"], altered: ["#4"], comparison: "Dorian with a raised fourth" },
    { characteristic: ["b2"], altered: ["3"], comparison: "Phrygian with a natural third" },
    { characteristic: ["#4"], altered: ["#2"], comparison: "Lydian with a raised second" },
    { characteristic: ["b5"], altered: ["b4", "bb7"], comparison: "Locrian with lowered fourth and seventh" },
  ][start];
  if (family === "melodic-minor") return [
    { characteristic: ["6"], altered: ["7"], comparison: "Dorian with a raised seventh" },
    { characteristic: ["6"], altered: ["b2"], comparison: "Dorian with a lowered second" },
    { characteristic: ["#4"], altered: ["#5"], comparison: "Lydian with a raised fifth" },
    { characteristic: ["#4"], altered: ["b7"], comparison: "Lydian with a lowered seventh" },
    { characteristic: ["b7"], altered: ["b6"], comparison: "Mixolydian with a lowered sixth" },
    { characteristic: ["b5"], altered: ["2"], comparison: "Locrian with a natural second" },
    { characteristic: ["b5"], altered: ["b4"], comparison: "Locrian with a lowered fourth; respell as a major third for dominant application" },
  ][start];
  return undefined;
}
