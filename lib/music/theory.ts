/*
 * Music theory engine. Every note name, interval, step pattern, chord and
 * fretboard position in the app is computed here from formulas, so a
 * scale or chord can be shown correctly spelled in any of the 12 keys.
 *
 * Notes are spelled by letter + accidental (not just pitch class), which is
 * what makes C to E♭ a minor 3rd while C to D♯ is an augmented 2nd.
 */

export type Note = { letter: number; acc: number };
export type Degree = { num: number; acc: number };

export const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const LETTER_PC = [0, 2, 4, 5, 7, 9, 11];
/** Semitones of each degree of the major scale: the reference for every formula. */
const MAJOR_SEMIS = [0, 2, 4, 5, 7, 9, 11];

export const mod = (n: number, m: number) => ((n % m) + m) % m;

export function pc(note: Note): number {
  return mod(LETTER_PC[note.letter] + note.acc, 12);
}

const ACC_TEXT: Record<number, string> = {
  [-2]: "𝄫",
  [-1]: "♭",
  0: "",
  1: "♯",
  2: "𝄪",
};

/** Display name, e.g. "B♭". `ascii` gives "Bb" for search and keys. */
export function noteName(note: Note, ascii = false): string {
  const letter = LETTERS[note.letter];
  if (ascii) {
    return letter + (note.acc > 0 ? "#".repeat(note.acc) : "b".repeat(-note.acc));
  }
  return letter + (ACC_TEXT[note.acc] ?? (note.acc > 0 ? "♯".repeat(note.acc) : "♭".repeat(-note.acc)));
}

/** Scientific pitch notation preserves spelling across C boundaries (B♯3 = C4). */
export function noteWithOctave(note: Note, midi: number): string {
  const octave = Math.floor((midi - LETTER_PC[note.letter] - note.acc) / 12) - 1;
  return `${noteName(note)}${octave}`;
}

export function parseNote(text: string): Note {
  const normalized = text.trim().replaceAll("𝄪", "##").replaceAll("𝄫", "bb").replaceAll("♯", "#").replaceAll("♭", "b");
  const match = /^([A-Ga-g])(#{1,2}|b{1,2})?$/.exec(normalized);
  if (!match) throw new Error(`Not a note: ${text}`);
  const letter = LETTERS.indexOf(match[1].toUpperCase() as (typeof LETTERS)[number]);
  const accText = match[2] ?? "";
  const sharp = accText.startsWith("#") || accText === "♯";
  return { letter, acc: sharp ? accText.length : -accText.length };
}

/** "b3" → { num: 3, acc: -1 }, "#11" → { num: 11, acc: 1 }, "bb7" → { num: 7, acc: -2 }. */
export function parseDegree(text: string): Degree {
  const match = /^(bb|b|##|#)?(\d+)$/.exec(text.trim());
  if (!match) throw new Error(`Not a degree: ${text}`);
  const prefix = match[1] ?? "";
  return { num: Number(match[2]), acc: prefix.startsWith("#") ? prefix.length : -prefix.length };
}

export function degreeText(degree: Degree, pretty = true): string {
  const sharp = pretty ? "♯" : "#";
  const flat = pretty ? "♭" : "b";
  const prefix = degree.acc > 0 ? sharp.repeat(degree.acc) : flat.repeat(-degree.acc);
  return prefix + degree.num;
}

/** Pretty-print a formula token in place: "b3" → "♭3", "#11" → "♯11". */
export function prettyDegree(text: string): string {
  return degreeText(parseDegree(text));
}

export function degreeSemitones(degree: Degree): number {
  const index = degree.num - 1;
  return MAJOR_SEMIS[index % 7] + 12 * Math.floor(index / 7) + degree.acc;
}

/** Spell the note a degree above a root, keeping the letter sequence intact. */
export function spellDegree(root: Note, degree: Degree): Note {
  const letter = mod(root.letter + degree.num - 1, 7);
  const target = pc(root) + degreeSemitones(degree);
  const acc = mod(target - LETTER_PC[letter] + 6, 12) - 6;
  return { letter, acc };
}

/** The note with this letter that sounds as pitch class `target`. */
export function noteFromLetter(letter: number, target: number): Note {
  return { letter: mod(letter, 7), acc: mod(target - LETTER_PC[mod(letter, 7)] + 6, 12) - 6 };
}

/** Interval inversion: m2 ↔ M7, P4 ↔ P5, A4 ↔ d5. */
export function invertDegree(degree: Degree): Degree {
  const num = 9 - degree.num;
  const semis = 12 - degreeSemitones(degree);
  return { num, acc: semis - degreeSemitones({ num, acc: 0 }) };
}

/** The degree of `to` measured up from `from`, by letter distance and semitones. */
export function degreeBetween(from: Note, to: Note): Degree {
  const num = mod(to.letter - from.letter, 7) + 1;
  const semis = mod(pc(to) - pc(from), 12);
  const acc = mod(semis - MAJOR_SEMIS[num - 1] + 6, 12) - 6;
  return { num, acc };
}

const PERFECT = new Set([1, 4, 5]);

/** Short interval name: "P5", "m3", "A4", "d5", "M7". Compound degrees fold to simple. */
export function intervalShort(degree: Degree): string {
  const simple = ((degree.num - 1) % 7) + 1;
  let quality: string;
  if (PERFECT.has(simple)) {
    quality = degree.acc === 0 ? "P" : degree.acc > 0 ? "A".repeat(degree.acc) : "d".repeat(-degree.acc);
  } else {
    quality =
      degree.acc === 0
        ? "M"
        : degree.acc === -1
          ? "m"
          : degree.acc > 0
            ? "A".repeat(degree.acc)
            : "d".repeat(-degree.acc - 1);
  }
  return quality + degree.num;
}

const QUALITY_NAMES: Record<string, string> = {
  P: "Perfect",
  M: "Major",
  m: "minor",
  A: "Augmented",
  d: "Diminished",
  AA: "Doubly augmented",
  dd: "Doubly diminished",
};

const ORDINAL = ["", "unison", "2nd", "3rd", "4th", "5th", "6th", "7th", "octave", "9th", "10th", "11th", "12th", "13th"];

export function intervalLong(degree: Degree): string {
  const short = intervalShort(degree);
  const quality = short.replace(/\d+$/, "");
  return `${QUALITY_NAMES[quality] ?? quality} ${ORDINAL[degree.num] ?? `${degree.num}th`}`;
}

/* ------------------------------------------------------------------ roots */

export type RootOption = { pc: number; label: string; spellings: Note[] };

/** The 12 roots offered in pickers. Black keys carry both spellings. */
export const ROOTS: RootOption[] = [
  ["C"],
  ["C#", "Db"],
  ["D"],
  ["D#", "Eb"],
  ["E"],
  ["F"],
  ["F#", "Gb"],
  ["G"],
  ["G#", "Ab"],
  ["A"],
  ["A#", "Bb"],
  ["B"],
].map((names, index) => {
  const spellings = names.map(parseNote);
  return { pc: index, label: spellings.map((n) => noteName(n)).join("/"), spellings };
});

/** Root-picker value for a pitch class, as used in URLs: "c", "c-sharp", … */
export const ROOT_SLUGS = ["c", "c-sharp", "d", "d-sharp", "e", "f", "f-sharp", "g", "g-sharp", "a", "a-sharp", "b"];

export function rootFromSlug(slug: string | null | undefined, fallback = 0): number {
  if (!slug) return fallback;
  const lower = slug.toLowerCase();
  const direct = ROOT_SLUGS.indexOf(lower);
  if (direct >= 0) return direct;
  try {
    return pc(parseNote(slug.replace("-sharp", "#").replace("-flat", "b")));
  } catch {
    return fallback;
  }
}

/**
 * Choose how to spell a root on a black key: whichever spelling gives the
 * scale fewer accidentals (D♭ major, not C♯ major), double accidentals
 * counting heavily. Ties go to the sharp spelling (F♯ major, D♯ minor).
 */
export function spellRoot(rootPc: number, degrees: Degree[]): Note {
  const options = ROOTS[mod(rootPc, 12)].spellings;
  let best = options[0];
  let bestScore = Infinity;
  for (const option of options) {
    const score = degrees
      .map((d) => spellDegree(option, d))
      .reduce((sum, n) => sum + Math.abs(n.acc) + (Math.abs(n.acc) > 1 ? 10 : 0), 0);
    if (score < bestScore) {
      best = option;
      bestScore = score;
    }
  }
  return best;
}

/* ------------------------------------------------------------------ scales */

export type ScaleNote = {
  note: Note;
  name: string;
  degree: Degree;
  /** "♭3" */
  label: string;
  /** "m3" */
  interval: string;
  semis: number;
};

export function buildScale(root: Note, degrees: Degree[]): ScaleNote[] {
  return degrees.map((degree) => {
    const note = spellDegree(root, degree);
    return {
      note,
      name: noteName(note),
      degree,
      label: degree.num === 1 && degree.acc === 0 ? "R" : degreeText(degree),
      interval: degree.num === 1 && degree.acc === 0 ? "R" : intervalShort(degree),
      semis: degreeSemitones(degree),
    };
  });
}

/** Semitone gaps between consecutive scale notes, closing back to the octave. */
export function stepSizes(semis: number[]): number[] {
  return semis.map((value, i) => (i === semis.length - 1 ? 12 : semis[i + 1]) - value);
}

export function stepLabel(size: number): string {
  if (size === 1) return "H";
  if (size === 2) return "W";
  if (size === 3) return "3H";
  return `${size}H`;
}

/** The doc's T / S / TS notation (tone, semitone, tone + semitone). */
export function stepLabelTS(size: number): string {
  if (size === 1) return "S";
  if (size === 2) return "T";
  if (size === 3) return "TS";
  return `${size}S`;
}

/** Rotate a parent scale to start on its nth note (a mode), renaming degrees. */
export function modeDegrees(parent: Degree[], start: number): Degree[] {
  // Spell in C so letters (and so degree numbers) survive the rotation.
  const reference = { letter: 0, acc: 0 };
  const notes = parent.map((d) => spellDegree(reference, d));
  const rotated = [...notes.slice(start), ...notes.slice(0, start)];
  return rotated.map((note) => degreeBetween(rotated[0], note));
}

/** Reverse the parent degree by letter distance as well as pitch class. */
export function modeParentRoot(root: Note, parent: Degree[], start: number): Note {
  const degree = parent[start];
  return noteFromLetter(root.letter - degree.num + 1, pc(root) - degreeSemitones(degree));
}

/* ------------------------------------------------------------------ chords */

const TRIADS: Record<string, { suffix: string; name: string }> = {
  "4,7": { suffix: "", name: "maj" },
  "3,7": { suffix: "m", name: "min" },
  "3,6": { suffix: "°", name: "dim" },
  "4,8": { suffix: "+", name: "aug" },
  "2,7": { suffix: "sus2", name: "sus2" },
  "5,7": { suffix: "sus4", name: "sus4" },
};

const SEVENTHS: Record<string, { suffix: string; numeral: string; name: string }> = {
  "4,7,11": { suffix: "maj7", numeral: "maj7", name: "major 7th" },
  "4,7,10": { suffix: "7", numeral: "7", name: "dominant 7th" },
  "3,7,10": { suffix: "m7", numeral: "m7", name: "minor 7th" },
  "3,7,11": { suffix: "m(maj7)", numeral: "m(maj7)", name: "minor-major 7th" },
  "3,6,10": { suffix: "m7♭5", numeral: "ø", name: "half-diminished" },
  "3,6,9": { suffix: "°7", numeral: "°7", name: "diminished 7th" },
  "4,8,11": { suffix: "+maj7", numeral: "+maj7", name: "augmented major 7th" },
  "4,8,10": { suffix: "7♯5", numeral: "+7", name: "augmented 7th" },
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

export type DiatonicChord = {
  degree: number;
  roman: string;
  root: string;
  triad: string;
  triadQuality: string;
  /** Doc-style numeral with quality: "IIm", "VII°". */
  triadNumeral: string;
  seventh: string;
  seventhQuality: string;
  /** Doc-style harmonic-formula numeral: "IIm7", "VIIø", "Imaj7". */
  seventhNumeral: string;
  notes: string[];
};

/** Stack thirds on every degree of a 7-note scale: the scale's harmony. */
export function harmonize(scale: ScaleNote[]): DiatonicChord[] {
  if (scale.length !== 7) return [];
  return scale.map((base, i) => {
    const tones = [0, 2, 4, 6].map((step) => scale[(i + step) % 7]);
    const intervals = tones.slice(1).map((t) => mod(pc(t.note) - pc(base.note), 12));
    const triad = TRIADS[intervals.slice(0, 2).join(",")];
    const seventh = SEVENTHS[intervals.join(",")];
    const roman = ROMAN[i];
    return {
      degree: i + 1,
      roman,
      root: base.name,
      triad: base.name + (triad?.suffix ?? "?"),
      triadQuality: triad?.name ?? "other",
      triadNumeral: roman + (triad?.suffix ?? "?"),
      seventh: base.name + (seventh?.suffix ?? "?"),
      seventhQuality: seventh?.name ?? "other",
      seventhNumeral: roman + (seventh?.numeral ?? "?"),
      notes: tones.map((t) => t.name),
    };
  });
}

/** Spell a chord from a formula like ["1", "b3", "5", "b7"]. */
export function chordNotes(root: Note, formula: string[]): string[] {
  return formula.map((token) => noteName(spellDegree(root, parseDegree(token))));
}

export const ALTERED_DOMINANT_FORMULA = ["1", "b9", "#9", "3", "#11", "b13", "b7"];

export type DominantTarget = {
  target: string;
  numeral: string;
  dominant: string | null;
  substitute: string | null;
  primary: boolean;
};

/** Conventional major-key tonicization targets: tonic plus ii, iii, IV, V and vi. */
export function majorKeyDominants(root: Note): DominantTarget[] {
  const scale = buildScale(root, ["1", "2", "3", "4", "5", "6", "7"].map(parseDegree));
  const chords = harmonize(scale);
  const numerals = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
  return scale.map((tone, i) => ({
    target: chords[i].triad,
    numeral: numerals[i],
    dominant: i === 6 ? null : `${noteName(spellDegree(tone.note, parseDegree("5")))}7`,
    substitute: i === 6 ? null : `${noteName(spellDegree(tone.note, parseDegree("b2")))}7`,
    primary: i === 0,
  }));
}

/* ------------------------------------------------------------------ guitar */

/** Standard tuning, string 6 (low E) to string 1 (high E), as MIDI numbers. */
export const TUNING = [40, 45, 50, 55, 59, 64];
export const STRING_NAMES = ["E", "A", "D", "G", "B", "e"];

export type FretNote = { string: number; fret: number; index: number };

/** Every fret where a scale note falls, from fret 0 to `frets`. `string` 0 = low E. */
export function neckNotes(rootPc: number, semis: number[], frets: number): FretNote[] {
  const lookup = new Map(semis.map((s, index) => [mod(rootPc + s, 12), index]));
  const out: FretNote[] = [];
  TUNING.forEach((open, string) => {
    for (let fret = 0; fret <= frets; fret++) {
      const index = lookup.get(mod(open + fret, 12));
      if (index !== undefined) out.push({ string, fret, index });
    }
  });
  return out;
}

/**
 * A playable position: start on scale note `startIndex` on the low E string
 * and climb the scale, `perString` notes on each string (2 for pentatonic
 * boxes, 3 for three-notes-per-string patterns).
 */
export function scalePosition(
  rootPc: number,
  semis: number[],
  startIndex: number,
  perString: number,
): FretNote[] {
  const n = semis.length;
  const rootFret = mod(rootPc - TUNING[0], 12);
  let startMidi = TUNING[0] + rootFret + semis[startIndex];
  // Keep the shape on the neck: wrap the start into frets 0-11.
  while (startMidi - TUNING[0] >= 12) startMidi -= 12;
  while (startMidi < TUNING[0]) startMidi += 12;

  const midiOf = (step: number) => {
    const total = startIndex + step;
    return startMidi - semis[startIndex] + semis[total % n] + 12 * Math.floor(total / n);
  };

  const out: FretNote[] = [];
  let step = 0;
  for (let string = 0; string < 6; string++) {
    for (let k = 0; k < perString; k++, step++) {
      out.push({ string, fret: midiOf(step) - TUNING[string], index: (startIndex + step) % n });
    }
  }
  const lowest = Math.min(...out.map((p) => p.fret));
  if (lowest < 0) return out.map((p) => ({ ...p, fret: p.fret + 12 }));
  return out;
}
