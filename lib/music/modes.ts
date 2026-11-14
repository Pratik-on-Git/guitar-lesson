import type { Block } from "../content/types.ts";

/*
 * Mode families from Guitar.docx. Each mode's notes, intervals and chords are
 * computed by rotating its parent scale; the prose is the doc's own.
 */

export type ModeDef = {
  id: string;
  name: string;
  aka?: string[];
  /** Position in the parent scale, 0-based. */
  start: number;
  /** One-line identity: what sets this mode apart. */
  summary: string;
  notes: Block[];
  /** True when the mode is computed here but not yet written in the notes. */
  computedOnly?: boolean;
};

export type ModeFamily = {
  id: "major" | "harmonic-minor" | "melodic-minor" | "minor-pentatonic";
  name: string;
  short: string;
  parentName: string;
  parentScaleId: string;
  parentFormula: string[];
  /** Pitch class the doc spells this family's examples from. */
  exampleRoot: number;
  intro: Block[];
  modes: ModeDef[];
};

export const MODE_FAMILIES: ModeFamily[] = [
  {
    id: "major",
    name: "Major modes",
    short: "Major",
    parentName: "Major scale (Ionian)",
    parentScaleId: "major",
    parentFormula: ["1", "2", "3", "4", "5", "6", "7"],
    exampleRoot: 0,
    intro: [
      {
        type: "p",
        text: "The parent scale is the major scale, also called the Ionian mode. All the other major modes are permutations of it: keep the same set of pitches and start from a different note. C major started from D (D – E – F – G – A – B – C – D) is the second mode; started from E, the third.",
      },
      {
        type: "p",
        text: "Only three kinds of triad appear: I, IV and V are major; II, III and VI are minor; VII is diminished. There is no augmented triad. Every chord has a minor 7th except I and IV, so the only major chord with a minor 7th is on V, the dominant chord.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Parent major scale",
        text: "Think of modes in parallel (as separate scales), but always know each mode's parent. Count back from the mode's root: Dorian is 2 half steps above its parent's root, Phrygian 4, Lydian 5, Mixolydian 7, Aeolian 9 and Locrian 11. D♯ Dorian's parent is C♯ major.",
      },
    ],
    modes: [
      {
        id: "ionian",
        name: "Ionian",
        aka: ["Major scale"],
        start: 0,
        summary: "The modern major scale.",
        notes: [
          { type: "p", text: "The Ionian mode is the modern major scale. The example made of natural notes begins on C and is the C major scale." },
          {
            type: "p",
            text: "In modern tonal thinking the dominant (5th) degree, G here, is the next most important chord root after the tonic. G7 is a dominant seventh chord, so called because of its position in this mode, and only this mode.",
          },
        ],
      },
      {
        id: "dorian",
        name: "Dorian",
        start: 1,
        summary: "Natural minor with a major 6th.",
        notes: [
          { type: "p", text: "The second mode. The example made of natural notes begins on D." },
          {
            type: "p",
            text: "Very similar to the natural minor scale (Aeolian). The only difference is the sixth degree, a major 6th (M6) above the tonic rather than a minor 6th (m6).",
          },
        ],
      },
      {
        id: "phrygian",
        name: "Phrygian",
        start: 2,
        summary: "Natural minor with a minor 2nd.",
        notes: [
          { type: "p", text: "The third mode. The example made of natural notes starts on E." },
          {
            type: "p",
            text: "Very similar to the natural minor scale. The only difference is the second degree, a minor 2nd (m2) above the tonic rather than a major 2nd (M2).",
          },
        ],
      },
      {
        id: "lydian",
        name: "Lydian",
        start: 3,
        summary: "Major with an augmented 4th.",
        notes: [
          { type: "p", text: "The fourth mode. The example made of natural notes starts on F." },
          {
            type: "p",
            text: "The single tone that sets it apart from the major scale is the fourth degree: an augmented 4th (A4) above the tonic rather than a perfect 4th (P4).",
          },
        ],
      },
      {
        id: "mixolydian",
        name: "Mixolydian",
        start: 4,
        summary: "Major with a minor 7th.",
        notes: [
          { type: "p", text: "The fifth mode. The example made of natural notes begins on G." },
          {
            type: "p",
            text: "The single tone that sets it apart from the major scale is the seventh degree: a minor 7th (m7) above the tonic rather than a major 7th. The 7th becomes a subtonic, a whole tone below the tonic, instead of a leading tone a semitone below. The tonic seventh chord is the dominant seventh.",
          },
        ],
      },
      {
        id: "aeolian",
        name: "Aeolian",
        aka: ["Natural minor scale"],
        start: 5,
        summary: "The natural minor scale.",
        notes: [
          { type: "p", text: "The sixth mode, also called the natural minor scale. The example made of natural notes begins on A: the A natural minor scale." },
        ],
      },
      {
        id: "locrian",
        name: "Locrian",
        start: 6,
        summary: "The only mode with a diminished 5th.",
        notes: [
          { type: "p", text: "The seventh mode. The example made of natural notes begins on B." },
          {
            type: "p",
            text: "The distinctive degree is the diminished 5th (d5). It makes the tonic triad diminished, so this is the only mode whose tonic and dominant chord roots are a diminished, not perfect, fifth apart. The tonic seventh chord is half-diminished.",
          },
        ],
      },
    ],
  },
  {
    id: "harmonic-minor",
    name: "Harmonic minor modes",
    short: "Harmonic minor",
    parentName: "Harmonic minor (Aeolian ♯7)",
    parentScaleId: "harmonic-minor",
    parentFormula: ["1", "2", "b3", "4", "5", "b6", "7"],
    exampleRoot: 9,
    intro: [
      {
        type: "p",
        text: "The harmonic minor modes' names look confusing, but each is just a diatonic mode's name plus the one note that differs. They describe how each mode relates to the natural minor and the other diatonic modes it comes from.",
      },
    ],
    modes: [
      {
        id: "aeolian-sharp-7",
        name: "Aeolian ♯7",
        aka: ["Harmonic minor scale"],
        start: 0,
        summary: "Aeolian with a raised 7th.",
        notes: [
          {
            type: "p",
            text: "The first mode is just the harmonic minor scale. Compare it with the diatonic Aeolian mode and the structure is identical except for one note: the 7th, raised a half step. Hence Aeolian ♯7.",
          },
        ],
      },
      {
        id: "locrian-sharp-6",
        name: "Locrian ♯6",
        start: 1,
        summary: "Locrian with a major 6th.",
        notes: [
          {
            type: "p",
            text: "Identical to the diatonic Locrian mode with one crucial difference: Locrian has a minor 6th and this mode a major 6th, which is why it is simply called Locrian ♯6.",
          },
        ],
      },
      {
        id: "ionian-sharp-5",
        name: "Ionian ♯5",
        start: 2,
        summary: "Major with an augmented 5th.",
        notes: [{ type: "p", text: "Compare it with the usual Ionian structure and the difference is obvious: the 5th is raised." }],
      },
      {
        id: "dorian-sharp-4",
        name: "Dorian ♯4",
        start: 3,
        summary: "Dorian with an augmented 4th.",
        notes: [
          {
            type: "callout",
            tone: "fix",
            title: "Corrected: interval row",
            text: "Your notes copied Ionian ♯5's interval row here (R M2 M3 P4 Aug5 M6 M7). Dorian ♯4 from D is R M2 m3 A4 P5 M6 m7, matching its own formula 1 2 ♭3 ♯4 5 6 ♭7.",
          },
        ],
      },
      {
        id: "phrygian-dominant",
        name: "Phrygian ♯3",
        aka: ["Phrygian dominant"],
        start: 4,
        summary: "Phrygian with a major 3rd.",
        notes: [{ type: "p", text: "Phrygian with its minor 3rd raised to a major 3rd, giving a dominant 7th chord on the tonic." }],
      },
      {
        id: "lydian-sharp-2",
        name: "Lydian ♯2",
        start: 5,
        summary: "Lydian with an augmented 2nd.",
        notes: [{ type: "p", text: "Lydian with its 2nd raised to an augmented 2nd." }],
      },
      {
        id: "super-locrian-bb7",
        name: "Super Locrian 𝄫7",
        aka: ["Mixolydian ♯1", "Altered 𝄫7"],
        start: 6,
        summary: "Altered scale with a diminished 7th.",
        notes: [{ type: "p", text: "Every degree is flattened from the major scale, with the 7th lowered twice to a diminished 7th." }],
      },
    ],
  },
  {
    id: "melodic-minor",
    name: "Melodic minor modes",
    short: "Melodic minor",
    parentName: "Melodic minor (Jazz minor)",
    parentScaleId: "melodic-minor",
    parentFormula: ["1", "2", "b3", "4", "5", "6", "7"],
    exampleRoot: 9,
    intro: [
      {
        type: "p",
        text: "The melodic minor scale has seven modes, named after the diatonic modes they are formed from. Because the harmonic and melodic minor scales both come from the natural minor, every example here is in A.",
      },
    ],
    modes: [
      {
        id: "dorian-sharp-7",
        name: "Dorian ♯7",
        aka: ["Jazz minor", "Melodic minor scale"],
        start: 0,
        summary: "Dorian with a major 7th.",
        notes: [
          {
            type: "p",
            text: "Apart from the major 7th here and the minor 7th in diatonic Dorian, every note is the same, with the same interval function. It is used so often in jazz that it is also called the jazz minor scale, or simply the melodic minor scale.",
          },
          {
            type: "callout",
            tone: "fix",
            title: "Corrected: table label",
            text: "The interval row in your notes was labelled \"Interval from D\"; the notes start on A, so it is the interval from A.",
          },
        ],
      },
      {
        id: "dorian-b2",
        name: "Dorian ♭2",
        aka: ["Phrygian ♯6", "Javanese"],
        start: 1,
        summary: "Phrygian with a major 6th.",
        notes: [
          {
            type: "p",
            text: "Similar to diatonic Phrygian, except that it has a major 6th rather than a minor 6th. That is why it is also known as Phrygian ♯6.",
          },
        ],
      },
      {
        id: "lydian-augmented",
        name: "Lydian ♯5",
        aka: ["Lydian augmented"],
        start: 2,
        summary: "Lydian with an augmented 5th.",
        notes: [{ type: "p", text: "Diatonic Lydian has the most similar structure, but here the 5th is sharpened, hence Lydian ♯5." }],
      },
      {
        id: "lydian-dominant",
        name: "Lydian ♭7",
        aka: ["Lydian dominant", "Mixolydian ♯4"],
        start: 3,
        summary: "Mixolydian with an augmented 4th.",
        notes: [{ type: "p", text: "Lydian with a minor 7th, or Mixolydian with a raised 4th: a dominant 7th chord with a ♯11 colour." }],
      },
      {
        id: "mixolydian-b6",
        name: "Mixolydian ♭6",
        aka: ["Aeolian ♯3", "Hindu"],
        start: 4,
        summary: "Mixolydian with a minor 6th.",
        notes: [{ type: "p", text: "Mixolydian with a lowered 6th, or Aeolian with a raised 3rd." }],
      },
      {
        id: "locrian-natural-2",
        name: "Locrian ♮2",
        aka: ["Aeolian ♭5", "Half-diminished scale"],
        start: 5,
        summary: "Locrian with a major 2nd.",
        notes: [{ type: "p", text: "Locrian with its 2nd restored to a major 2nd, or Aeolian with a lowered 5th." }],
      },
      {
        id: "altered",
        name: "Altered",
        aka: ["Super Locrian", "Ionian ♯1"],
        start: 6,
        summary: "Every degree of the major scale altered.",
        notes: [
          {
            type: "p",
            text: "As the name suggests, the altered scale has every note of the major scale altered by a semitone. It is the scale of altered dominant chords (♭9, ♯9, ♭5, ♯5).",
          },
        ],
      },
    ],
  },
  {
    id: "minor-pentatonic",
    name: "Pentatonic modes",
    short: "Pentatonic",
    parentName: "Minor pentatonic",
    parentScaleId: "minor-pentatonic",
    parentFormula: ["1", "b3", "4", "5", "b7"],
    exampleRoot: 9,
    intro: [
      {
        type: "p",
        text: "The minor pentatonic is a good way to see what a mode is. Its five notes, oriented around A, form a set of intervals that define the scale. Re-orient the same five notes around C and they get new names: C is no longer the minor 3rd of A but the root; D is the major 2nd, E the major 3rd, G the perfect 5th and A the major 6th.",
      },
      {
        type: "p",
        text: "Same five tones, but a different set of intervals, so a completely different collection of sounds. The minor pentatonic has five notes, so it has five modes.",
      },
    ],
    modes: [
      {
        id: "minor-pentatonic",
        name: "Mode 1 · Minor pentatonic",
        start: 0,
        summary: "Root, minor 3rd, perfect 4th, perfect 5th, minor 7th.",
        notes: [{ type: "p", text: "The first mode is just the minor pentatonic scale. In A: A, C, D, E and G." }],
      },
      {
        id: "major-pentatonic",
        name: "Mode 2 · Major pentatonic",
        start: 1,
        summary: "Root, major 2nd, major 3rd, perfect 5th, major 6th.",
        notes: [
          {
            type: "p",
            text: "The second mode has its own name: the major pentatonic scale. In C: C, D, E, G, A. C is the relative major of A minor pentatonic, which is regarded as its parent scale.",
          },
        ],
      },
      {
        id: "mode-3",
        name: "Mode 3",
        aka: ["Suspended pentatonic", "Egyptian"],
        start: 2,
        summary: "Root, major 2nd, perfect 4th, perfect 5th, minor 7th.",
        notes: [
          {
            type: "p",
            text: "Starts on the third note of A minor pentatonic, D: D, E, G, A, C. D is no longer the perfect 4th of A but the root. E becomes the major 2nd of D, G the perfect 4th, A the perfect 5th and C the minor 7th.",
          },
        ],
      },
      {
        id: "mode-4",
        name: "Mode 4",
        aka: ["Blues minor", "Man Gong"],
        start: 3,
        summary: "Root, minor 3rd, perfect 4th, minor 6th, minor 7th.",
        computedOnly: true,
        notes: [
          {
            type: "callout",
            tone: "todo",
            title: "Not in your notes yet",
            text: "Your notes stop after mode 3 (marked DUE). Mode 4 starts on the fourth note, E: E, G, A, C, D.",
          },
        ],
      },
      {
        id: "mode-5",
        name: "Mode 5",
        aka: ["Blues major", "Ritsusen"],
        start: 4,
        summary: "Root, major 2nd, perfect 4th, perfect 5th, major 6th.",
        computedOnly: true,
        notes: [
          {
            type: "callout",
            tone: "todo",
            title: "Not in your notes yet",
            text: "Mode 5 starts on the fifth note, G: G, A, C, D, E.",
          },
        ],
      },
    ],
  },
];

export function getFamily(id: string): ModeFamily | undefined {
  return MODE_FAMILIES.find((f) => f.id === id);
}

/* The doc's major-modes summary table. */
export const MAJOR_MODE_TABLE = {
  columns: ["Mode", "Tonic relative to major scale", "Interval sequence", "Example"],
  rows: [
    ["Ionian", "I", "W–W–H–W–W–W–H", "C–D–E–F–G–A–B–C"],
    ["Dorian", "ii", "W–H–W–W–W–H–W", "D–E–F–G–A–B–C–D"],
    ["Phrygian", "iii", "H–W–W–W–H–W–W", "E–F–G–A–B–C–D–E"],
    ["Lydian", "IV", "W–W–W–H–W–W–H", "F–G–A–B–C–D–E–F"],
    ["Mixolydian", "V", "W–W–H–W–W–H–W", "G–A–B–C–D–E–F–G"],
    ["Aeolian", "vi", "W–H–W–W–H–W–W", "A–B–C–D–E–F–G–A"],
    ["Locrian", "viiø", "H–W–W–H–W–W–W", "B–C–D–E–F–G–A–B"],
  ],
};
