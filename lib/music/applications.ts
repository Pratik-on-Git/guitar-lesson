import { SCALES } from "./scales.ts";
import { MODE_FAMILIES } from "./modes.ts";
import { degreeText, modeDegrees, parseDegree } from "./theory.ts";

export const COLLECTIONS = [
  ...SCALES.map((s) => ({ id: s.id, name: s.short, formula: s.formula, href: `/scales/${s.id}` })),
  ...MODE_FAMILIES.filter((f) => f.id !== "minor-pentatonic").flatMap((f) => f.modes.map((m) => ({ id: `${f.id}:${m.id}`, name: m.name, formula: modeDegrees(f.parentFormula.map(parseDegree), m.start).map((d) => degreeText(d, false)), href: `/modes/${f.id}?mode=${m.id}` }))),
];

/** The book's table (p. 99), interpreted as contextual applications. */
export const SCALE_CHOICES: Record<string, string[]> = {
  "major-7": ["major-pentatonic", "major-blues", "major:ionian", "major:lydian", "harmonic-minor:lydian-sharp-2", "augmented"],
  "dominant-7": ["major-pentatonic", "major-blues", "minor-pentatonic", "minor-blues", "major:mixolydian", "harmonic-minor:phrygian-dominant", "melodic-minor:lydian-dominant", "melodic-minor:mixolydian-b6", "diminished-half-whole", "whole-tone", "melodic-minor:altered"],
  "minor-major-7": ["kumoi", "pelog", "hirajoshi", "harmonic-minor", "melodic-minor", "augmented"],
  "minor-7": ["minor-pentatonic", "minor-blues", "kumoi", "pelog", "hirajoshi", "major:dorian", "major:phrygian", "major:aeolian", "harmonic-minor:dorian-sharp-4", "melodic-minor:dorian-b2", "diminished-half-whole"],
  "augmented-major-7": ["harmonic-minor:ionian-sharp-5", "melodic-minor:lydian-augmented"],
  "half-diminished": ["major:locrian", "harmonic-minor:locrian-sharp-6", "melodic-minor:locrian-natural-2", "melodic-minor:altered", "diminished-half-whole"],
  "diminished-7": ["harmonic-minor:super-locrian-bb7", "diminished-whole-half"],
};

export const PENTATONIC_RECIPES = [
  { id: "dorian", name: "Dorian", degree: "2", chord: "m7", target: "6", explanation: "A whole step above the chord root; brings out the natural sixth." },
  { id: "phrygian", name: "Phrygian", degree: "b7", chord: "m7", target: "b2", explanation: "A whole step below; brings out the minor second." },
  { id: "lydian", name: "Lydian", degree: "7", chord: "maj7", target: "#4", explanation: "A semitone below; brings out the augmented fourth." },
  { id: "mixolydian", name: "Mixolydian", degree: "5", chord: "7", target: "b7", explanation: "A perfect fifth above; brings out the minor seventh." },
  { id: "locrian", name: "Locrian", degree: "b3", chord: "m7♭5", target: "b5", explanation: "A minor third above; brings out the diminished fifth." },
  { id: "altered-third", name: "Altered dominant · minor third above", degree: "b3", chord: "7alt", target: "#9", explanation: "Supplies ♯9, ♯11, ♭13, ♭7 and ♭9. The chord supplies the root and third." },
  { id: "altered-below", name: "Dominant tension · whole step below", degree: "b7", chord: "7alt", target: "11", explanation: "Supplies ♭7, ♭9, ♯9, 11 and ♭13. The natural 11 makes this different from the altered scale." },
];
