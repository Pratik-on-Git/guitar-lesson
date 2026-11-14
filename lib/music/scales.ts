import type { Block } from "../content/types.ts";

/*
 * Every scale from Guitar.docx. Notes, intervals, step patterns, chords and
 * fretboard maps are computed from `formula`; the prose is the doc's own.
 */

export type ScaleId =
  | "major"
  | "natural-minor"
  | "major-pentatonic"
  | "minor-pentatonic"
  | "major-blues"
  | "harmonic-minor"
  | "melodic-minor"
  | "chromatic"
  | "whole-tone";

export type ScaleDef = {
  id: ScaleId;
  name: string;
  short: string;
  aka?: string[];
  /** Notes per octave and the doc's family name for that count. */
  family: string;
  formula: string[];
  /** Root pitch class the doc's own example uses. */
  exampleRoot: number;
  mood?: string;
  /** Doc's harmonic formula where chords aren't built by stacking thirds. */
  harmonicFormula?: string;
  /** Pentatonic boxes (2 per string) or 3-notes-per-string patterns. */
  positions?: { perString: number; label: string };
  /** Related mode family page, if the scale has one. */
  modesHref?: string;
  /** Doc's notes for this scale, in order. */
  notes: Block[];
};

export const SCALES: ScaleDef[] = [
  {
    id: "major",
    name: "Major scale",
    short: "Major",
    aka: ["Ionian mode", "do-re-mi"],
    family: "Heptatonic · diatonic",
    formula: ["1", "2", "3", "4", "5", "6", "7"],
    exampleRoot: 0,
    mood: "Joyous, bright and energetic.",
    positions: { perString: 3, label: "3 notes per string" },
    modesHref: "/modes/major",
    notes: [
      { type: "p", text: "The most common scale in Western music is the major scale. It is a 7-note diatonic scale, and the parent of the seven major modes." },
      {
        type: "facts",
        items: [
          { label: "Pattern", value: "2 whole tones + 1 semitone + 3 whole tones + 1 semitone" },
          { label: "Example", value: "C – D – E – F – G – A – B – C" },
          { label: "Major chord theory", value: "Root + 3rd + 5th" },
        ],
      },
      {
        type: "callout",
        tone: "fix",
        title: "Corrected: chord progression",
        text: "Your notes listed the progression as \"mi + mi + Maj + Maj + mi + min7b5 + Maj\", which is the chord on degrees 2 to 8 (it skips the I chord). Degrees 1 to 7 are Maj · min · min · Maj · Maj · min · dim, shown in the harmony table below.",
      },
      {
        type: "p",
        text: "Intervals measured from the root are the pattern to learn: C → D is a major 2nd (2 frets), C → E a major 3rd (4 frets), C → F a perfect 4th (5 frets), C → G a perfect 5th (7 frets), C → A a major 6th (9 frets) and C → B a major 7th (11 frets).",
      },
      {
        type: "figure",
        src: "/notes/c-major-scale-tab.jpeg",
        alt: "C major scale in standard notation and tab: C D E F G A B C, starting on the A string, 3rd fret",
        caption: "C major scale, one octave, notation and tab.",
        width: 1043,
        height: 147,
      },
      {
        type: "figure",
        src: "/notes/c-major-intervals-tab.png",
        alt: "C major scale in notation and tab with each note labelled Root, maj 2nd, maj 3rd, 4th, 5th, maj 6th, maj 7th, octave",
        caption: "The same pattern, labelled by interval from the root.",
        width: 1043,
        height: 147,
      },
    ],
  },
  {
    id: "natural-minor",
    name: "Natural minor scale",
    short: "Natural minor",
    aka: ["Aeolian mode", "relative minor"],
    family: "Heptatonic · diatonic",
    formula: ["1", "2", "b3", "4", "5", "b6", "b7"],
    exampleRoot: 9,
    mood: "Melancholy, gloomy and introspective.",
    positions: { perString: 3, label: "3 notes per string" },
    modesHref: "/modes/major?mode=aeolian",
    notes: [
      { type: "p", text: "In the natural minor scale, scale degrees 3, 6 and 7 are a half step lower than the same degrees in the major scale." },
      {
        type: "facts",
        items: [
          { label: "Pattern", value: "1 whole tone + 1 half tone + 2 whole tones + 1 half tone + 2 whole tones" },
          { label: "Example", value: "C – D – E♭ – F – G – A♭ – B♭ – C" },
          { label: "Minor chord theory", value: "Root + ♭3rd + 5th" },
          { label: "Progression", value: "min · dim · Maj · min · min · Maj · Maj" },
        ],
      },
      {
        type: "p",
        text: "The natural minor scale uses the same notes as a major scale but begins and ends on La, scale degree 6. Built on degree 6 of a major scale, it is called that major scale's relative minor: C major and A minor share every note.",
      },
      { type: "p", text: "A major scale is a diatonic scale, and so is the natural minor: it is the major scale's sixth mode." },
      {
        type: "callout",
        tone: "fix",
        title: "Corrected: chord table headers",
        text: "The column headers in your minor-key chord table were shifted by one column (\"WT (dim)\" sat over the ii° column and so on). The table below is rebuilt from the formula, with each key spelled in its usual key signature.",
      },
    ],
  },
  {
    id: "major-pentatonic",
    name: "Major pentatonic scale",
    short: "Major pentatonic",
    family: "Pentatonic",
    formula: ["1", "2", "3", "5", "6"],
    exampleRoot: 0,
    harmonicFormula: "Imaj7 or I7 · II7 or IIm7 · IIIm7 or IIIø · Vmaj7 or V7 or Vm(maj7) or Vm7 · VIm7",
    positions: { perString: 2, label: "5 pentatonic positions" },
    modesHref: "/modes/minor-pentatonic?mode=major-pentatonic",
    notes: [
      { type: "p", text: "Unlike the major scale, which has seven notes, the major pentatonic scale has five. It contains no semitones (half steps)." },
      {
        type: "facts",
        items: [
          { label: "Example", value: "C – D – E – G – A – C" },
          { label: "Melodic formula", value: "W W 3H W 3H" },
          { label: "Notes", value: "Root + 2 + 3 + 5 + 6" },
          { label: "Chords on each note", value: "Maj · min · min · Maj · min (I ii iii V vi of the parent major key)" },
        ],
      },
      {
        type: "p",
        text: "It is the second mode of the minor pentatonic scale: C major pentatonic has the same five notes as A minor pentatonic, starting from C.",
      },
    ],
  },
  {
    id: "minor-pentatonic",
    name: "Minor pentatonic scale",
    short: "Minor pentatonic",
    family: "Pentatonic",
    formula: ["1", "b3", "4", "5", "b7"],
    exampleRoot: 9,
    harmonicFormula: "Im7 · IIImaj7 or III7 · IV7 or IVm7 · Vm7 or Vø · VIImaj7 or VII7 or VIIm(maj7) or VIIm7",
    positions: { perString: 2, label: "5 pentatonic positions" },
    modesHref: "/modes/minor-pentatonic",
    notes: [
      {
        type: "p",
        text: "The minor pentatonic comes directly from the minor scale: remove the 2nd and 6th degrees. That leaves the root, ♭3, 4, 5 and ♭7. For A minor pentatonic that gives A, C, D, E and G.",
      },
      {
        type: "facts",
        items: [
          { label: "Example", value: "A – C – D – E – G – A" },
          { label: "Melodic formula", value: "3H W W 3H W" },
          { label: "Notes", value: "Root + ♭3 + 4 + 5 + ♭7" },
          { label: "Chords on each note", value: "min · Maj · min · min · Maj (i III iv v VII of the natural minor)" },
        ],
      },
      {
        type: "callout",
        tone: "fix",
        title: "Corrected: example and progression",
        text: "Your notes repeated the major pentatonic's example (C – D – E – G – A) and progression here. A minor pentatonic is A – C – D – E – G; in C it would be C – E♭ – F – G – B♭.",
      },
    ],
  },
  {
    id: "major-blues",
    name: "Major blues scale",
    short: "Major blues",
    family: "Hexatonic",
    formula: ["1", "2", "b3", "3", "5", "6"],
    exampleRoot: 9,
    notes: [
      { type: "p", text: "The major pentatonic with one added chromatic passing note, the ♭3 (the \"blue\" note), between the 2nd and the 3rd." },
      {
        type: "facts",
        items: [
          { label: "Example", value: "A – B – C – C♯ – E – F♯" },
          { label: "Melodic formula", value: "W H H 3H W 3H" },
          { label: "Notes", value: "1 2 ♭3 3 5 6" },
        ],
      },
      { type: "callout", tone: "todo", title: "Still to write", text: "The harmonic formula for the major blues scale is blank in your notes." },
    ],
  },
  {
    id: "harmonic-minor",
    name: "Harmonic minor scale",
    short: "Harmonic minor",
    aka: ["Aeolian ♯7"],
    family: "Heptatonic",
    formula: ["1", "2", "b3", "4", "5", "b6", "7"],
    exampleRoot: 9,
    positions: { perString: 3, label: "3 notes per string" },
    modesHref: "/modes/harmonic-minor",
    notes: [
      {
        type: "p",
        text: "The harmonic minor takes its structure from the natural minor scale and raises the 7th by a half step. The raised 7th leaves a step and a half (W + H) between the ♭6 and the 7.",
      },
      {
        type: "facts",
        items: [
          { label: "Pattern", value: "W + H + W + W + H + (W + H) + H" },
          { label: "Example", value: "A, B, C, D, E, F, G♯" },
          { label: "Intervallic formula", value: "1 2 ♭3 4 5 ♭6 7" },
        ],
      },
      {
        type: "p",
        text: "Used in classical, neoclassical, advanced rock and jazz. Its V chord is a dominant 7th, exactly like its parallel major, which is where secondary dominants come from.",
      },
    ],
  },
  {
    id: "melodic-minor",
    name: "Melodic minor scale",
    short: "Melodic minor",
    aka: ["Jazz minor"],
    family: "Heptatonic",
    formula: ["1", "2", "b3", "4", "5", "6", "7"],
    exampleRoot: 9,
    positions: { perString: 3, label: "3 notes per string" },
    modesHref: "/modes/melodic-minor",
    notes: [
      {
        type: "p",
        text: "Take the harmonic minor and raise its minor 6th by a half step, so there is no longer a step-and-a-half gap between the 6th and the major 7th. The result is a new scale: the melodic minor.",
      },
      {
        type: "facts",
        items: [
          { label: "Pattern", value: "W + H + W + W + W + W + H" },
          { label: "Example", value: "A, B, C, D, E, F♯, G♯" },
          { label: "Intervallic formula", value: "1 2 ♭3 4 5 6 7" },
        ],
      },
    ],
  },
  {
    id: "chromatic",
    name: "Chromatic scale",
    short: "Chromatic",
    aka: ["Dodecatonic"],
    family: "Dodecatonic",
    formula: ["1", "#1", "2", "#2", "3", "4", "#4", "5", "#5", "6", "#6", "7"],
    exampleRoot: 0,
    notes: [
      {
        type: "p",
        text: "The chromatic scale moves by half steps up or down and can begin on any note. It contains all twelve tones in order, so it is the collection every other scale is drawn from: 12 half steps, or 6 whole steps, per octave.",
      },
      {
        type: "p",
        text: "Ascending, it is written with sharps to point upward; descending, with flats to point downward.",
      },
      {
        type: "figure",
        src: "/notes/chromatic-ascending.png",
        alt: "Ascending chromatic scale from C in treble and bass clef, written with sharps",
        caption: "Ascending: sharps.",
        width: 701,
        height: 172,
      },
      {
        type: "figure",
        src: "/notes/chromatic-descending.png",
        alt: "Descending chromatic scale from C in treble and bass clef, written with flats",
        caption: "Descending: flats.",
        width: 688,
        height: 161,
      },
    ],
  },
  {
    id: "whole-tone",
    name: "Whole-tone scale",
    short: "Whole tone",
    family: "Hexatonic",
    formula: ["1", "2", "3", "#4", "#5", "b7"],
    exampleRoot: 0,
    notes: [
      {
        type: "p",
        text: "The whole-tone scale moves by whole steps up or down and can begin on any note. There are only six different notes, so one letter name does not appear in the scale.",
      },
    ],
  },
];

export function getScale(id: string): ScaleDef | undefined {
  return SCALES.find((s) => s.id === id);
}

/*
 * The doc's scale comparison chart: each scale's degrees with the step
 * between them (T tone, S semitone, TS tone + semitone).
 */
export const COMPARISON_GROUPS: { title: string; scales: ScaleId[] }[] = [
  { title: "Major vs the three minors", scales: ["major", "natural-minor", "harmonic-minor", "melodic-minor"] },
  { title: "Minor pentatonic inside the natural minor", scales: ["minor-pentatonic", "natural-minor"] },
  { title: "Major pentatonic inside the major", scales: ["major-pentatonic", "major"] },
];

/* Scales described by how many notes they hold per octave. */
export const SCALE_SIZES: { name: string; notes: string; text: string }[] = [
  { name: "Chromatic / dodecatonic", notes: "12", text: "Every note." },
  { name: "Nonatonic", notes: "9", text: "A chromatic variation of the heptatonic blues scale." },
  { name: "Octatonic", notes: "8", text: "Used in jazz and modern classical music (bebop scales)." },
  { name: "Heptatonic", notes: "7", text: "The most common modern Western scale: major, minor and their modes." },
  { name: "Hexatonic", notes: "6", text: "Common in Western folk music; also the blues and whole-tone scales." },
  { name: "Pentatonic", notes: "5", text: "The anhemitonic form (no semitones) is common in folk music, especially Asian music; also called the \"black note\" scale." },
  { name: "Tetratonic, tritonic, ditonic", notes: "4 · 3 · 2", text: "Generally limited to prehistoric (\"primitive\") music." },
];
