import { buildScale, degreeBetween, degreeText, degreeSemitones, mod, noteName, parseDegree, spellDegree, spellRoot, type Note } from "./theory.ts";

export const PROGRESSION_QUALITIES: Record<string, { symbol: string; formula: string[] }> = {
  major: { symbol: "", formula: ["1", "3", "5"] }, minor: { symbol: "m", formula: ["1", "b3", "5"] }, diminished: { symbol: "°", formula: ["1", "b3", "b5"] },
  maj7: { symbol: "maj7", formula: ["1", "3", "5", "7"] }, m7: { symbol: "m7", formula: ["1", "b3", "5", "b7"] }, "7": { symbol: "7", formula: ["1", "3", "5", "b7"] },
  half: { symbol: "m7♭5", formula: ["1", "b3", "b5", "b7"] }, dim7: { symbol: "°7", formula: ["1", "b3", "b5", "bb7"] },
};
export type ProgressionStep = { degree: string; quality: string; roman: string; beats: number };
export type Progression = { id: string; name: string; source: string; steps: ProgressionStep[] };
const romanMap: Record<string, [string, string]> = { I: ["1", "major"], ii: ["2", "minor"], iii: ["3", "minor"], IV: ["4", "major"], V: ["5", "major"], vi: ["6", "minor"] };
function common(id: string, romans: string[]): Progression {
  return { id, name: romans.join("–"), source: "PDF p. 143", steps: romans.map((roman) => ({ degree: romanMap[roman][0], quality: romanMap[roman][1], roman, beats: 4 })) };
}
export const PROGRESSIONS: Progression[] = [
  ...[["I", "vi", "IV", "V"], ["I", "V", "vi", "IV"], ["I", "V", "IV", "V"], ["I", "IV", "V"], ["iii", "vi", "ii", "V"], ["I", "IV", "I", "V"], ["I", "V", "ii", "IV"], ["I", "vi", "ii", "V"], ["I", "V", "vi", "iii"], ["I", "iii", "IV", "V"]].map((r, i) => common(`common-${i + 1}`, r)),
  { id: "ii-v-i", name: "ii7–V7–Imaj7", source: "PDF pp. 143, 184", steps: [{ degree: "2", quality: "m7", roman: "ii7", beats: 4 }, { degree: "5", quality: "7", roman: "V7", beats: 4 }, { degree: "1", quality: "maj7", roman: "Imaj7", beats: 4 }] },
  { id: "minor-cadence", name: "Minor iiø7–V7–i", source: "Minor cadence study", steps: [{ degree: "2", quality: "half", roman: "iiø7", beats: 4 }, { degree: "5", quality: "7", roman: "V7", beats: 4 }, { degree: "1", quality: "minor", roman: "i", beats: 4 }] },
  { id: "andalusian", name: "Andalusian · i–♭VII–♭VI–V7", source: "PDF p. 147", steps: [{ degree: "1", quality: "minor", roman: "i", beats: 4 }, { degree: "b7", quality: "major", roman: "♭VII", beats: 4 }, { degree: "b6", quality: "major", roman: "♭VI", beats: 4 }, { degree: "5", quality: "7", roman: "V7", beats: 4 }] },
  { id: "blues", name: "Twelve-bar dominant blues", source: "PDF pp. 139, 184 · standard twelve-bar realization", steps: [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5].map((degree) => ({ degree: String(degree), quality: "7", roman: degree === 1 ? "I7" : degree === 4 ? "IV7" : "V7", beats: 4 })) },
  { id: "source-cycle", name: "Am7–D7–Gmaj7… cycle (transposable)", source: "PDF pp. 193–194 · shown relative to G major", steps: [["2", "m7", "ii7"], ["5", "7", "V7"], ["1", "maj7", "Imaj7"], ["4", "maj7", "IVmaj7"], ["7", "half", "viiø7"], ["3", "7", "V7/vi"], ["6", "m7", "vi7"]].map(([degree, quality, roman]) => ({ degree, quality, roman, beats: 4 })) },
];
export const TRANSFORMATIONS = [
  { id: "original", name: "Original" }, { id: "sevenths", name: "Extend triads to sevenths" }, { id: "tritone", name: "Tritone-substitute dominants" }, { id: "borrow", name: "Borrow minor iv for major IV" }, { id: "applied", name: "Insert V7/V before V" }, { id: "approach", name: "Chromatic dominant approach to tonic" }, { id: "reduce", name: "Reduce to a tonic/pedal chord" }, { id: "coltrane", name: "Source major-third cycle within the same span" },
];
const MAJOR = ["1", "2", "3", "4", "5", "6", "7"].map(parseDegree);
export function realizeProgression(rootPc: number, steps: ProgressionStep[]) {
  const tonic = spellRoot(rootPc, MAJOR);
  return steps.map((step) => {
    const root = spellDegree(tonic, parseDegree(step.degree)); const quality = PROGRESSION_QUALITIES[step.quality];
    const tones = buildScale(root, quality.formula.map(parseDegree));
    return { ...step, root, name: noteName(root) + quality.symbol, tones, semis: tones.map((n) => n.semis) };
  });
}
export function transformProgression(steps: ProgressionStep[], kind: string): ProgressionStep[] {
  const copy = steps.map((s) => ({ ...s })); const total = steps.reduce((sum, s) => sum + s.beats, 0);
  const sevenths = () => copy.map((s) => s.quality === "major" ? { ...s, quality: s.degree === "5" ? "7" : "maj7", roman: s.roman + (s.degree === "5" ? "7" : "maj7") } : s.quality === "minor" ? { ...s, quality: "m7", roman: `${s.roman}7` } : s);
  if (kind === "sevenths") return sevenths();
  if (kind === "tritone") return sevenths().map((s) => {
    if (s.quality !== "7") return s;
    const tonic: Note = { letter: 0, acc: 0 }; const root = spellDegree(tonic, parseDegree(s.degree)); const sub = spellDegree(root, parseDegree("b5"));
    return { ...s, degree: degreeText(degreeBetween(tonic, sub), false), roman: `subV7 (${s.roman})` };
  });
  if (kind === "borrow") return copy.map((s) => s.degree === "4" && ["major", "maj7"].includes(s.quality) ? { ...s, quality: s.quality === "maj7" ? "m7" : "minor", roman: s.quality === "maj7" ? "iv7" : "iv" } : s);
  if (kind === "applied") {
    const index = copy.findIndex((s) => s.degree === "5");
    if (index >= 0) { const target = copy[index]; copy.splice(index, 1, { degree: "2", quality: "7", roman: "V7/V", beats: target.beats / 2 }, { ...target, beats: target.beats / 2 }); }
    return copy;
  }
  if (kind === "approach") {
    const index = copy.map((s) => s.degree).lastIndexOf("1");
    if (index >= 0) { const target = copy[index]; copy.splice(index, 1, { degree: "b2", quality: "7", roman: "subV7/I", beats: target.beats / 2 }, { ...target, beats: target.beats / 2 }); }
    return copy;
  }
  if (kind === "reduce") return [{ ...(copy.findLast((s) => s.degree === "1") ?? copy[0]), beats: total }];
  if (kind === "coltrane") return [["2", "minor", "ii", 2], ["b3", "7", "V7/♭VI", 1], ["b6", "major", "♭VI", 1], ["7", "7", "V7/III", 1], ["3", "major", "III", 1], ["5", "7", "V7", 2], ["1", "major", "I", 4]].map(([degree, quality, roman, weight]) => ({ degree: String(degree), quality: String(quality), roman: String(roman), beats: Number(weight) * total / 12 }));
  return copy;
}

function rootPcOf(note: Note) { return mod([0, 2, 4, 5, 7, 9, 11][note.letter] + note.acc, 12); }
export function rootVoicing(root: Note, formula: string[]) {
  const semis = formula.map((d) => degreeSemitones(parseDegree(d)));
  return Array.from({ length: 4 }, (_, i) => 48 + rootPcOf(root) + semis[i % semis.length] + 12 * Math.floor(i / semis.length));
}
function candidates(root: Note, formula: string[]) {
  const semis = formula.map((d) => degreeSemitones(parseDegree(d))); const n = semis.length; const result: number[][] = [];
  for (const shift of [-12, 0, 12]) for (let start = 0; start < n; start++) {
    const voices = Array.from({ length: 4 }, (_, i) => 48 + rootPcOf(root) + shift + semis[(start + i) % n] + 12 * Math.floor((start + i) / n));
    if (voices[0] >= 36 && voices[3] <= 84) result.push(voices);
  }
  return result;
}
export const voiceMotion = (a: number[], b: number[]) => a.reduce((sum, value, i) => sum + Math.abs(value - b[i]), 0);
/** Minimum total ordered-voice motion among a bounded set of close voicings. */
export function leadVoices(rootPc: number, steps: ProgressionStep[]) {
  const chords = realizeProgression(rootPc, steps); const baseline = chords.map((c) => rootVoicing(c.root, PROGRESSION_QUALITIES[c.quality].formula));
  const choices = chords.map((c) => candidates(c.root, PROGRESSION_QUALITIES[c.quality].formula));
  const costs: number[][] = []; const parents: number[][] = [];
  choices.forEach((row, i) => {
    costs[i] = []; parents[i] = [];
    row.forEach((voice, j) => {
      if (!i) { costs[i][j] = voiceMotion(baseline[0], voice); parents[i][j] = -1; return; }
      const previous = choices[i - 1].map((p, k) => costs[i - 1][k] + voiceMotion(p, voice)); const best = Math.min(...previous);
      costs[i][j] = best; parents[i][j] = previous.indexOf(best);
    });
  });
  const selected: number[][] = []; let index = costs.at(-1)!.indexOf(Math.min(...costs.at(-1)!));
  for (let i = choices.length - 1; i >= 0; i--) { selected.unshift(choices[i][index]); index = parents[i][index]; }
  return { baseline, selected, baselineMotion: baseline.slice(1).reduce((sum, v, i) => sum + voiceMotion(baseline[i], v), 0), selectedMotion: selected.slice(1).reduce((sum, v, i) => sum + voiceMotion(selected[i], v), 0) };
}
