/*
 * The chord formula table from Guitar.docx. Rows that were the same chord
 * under two names are merged (the other name is kept in `aliases`), and the
 * notes are computed from the formula for whichever root is chosen.
 */

export type ChordCategory =
  | "Triads"
  | "Power chords"
  | "Sixths"
  | "Sevenths"
  | "Ninths"
  | "Elevenths"
  | "Thirteenths"
  | "Suspended"
  | "Diminished & half-diminished"
  | "Augmented"
  | "Altered dominants";

export const CHORD_CATEGORIES: ChordCategory[] = [
  "Triads",
  "Power chords",
  "Sixths",
  "Sevenths",
  "Ninths",
  "Elevenths",
  "Thirteenths",
  "Suspended",
  "Diminished & half-diminished",
  "Augmented",
  "Altered dominants",
];

export type ChordDef = {
  id: string;
  name: string;
  /** Symbol suffix after the root: "m7", "7♯9". */
  symbol: string;
  formula: string[];
  category: ChordCategory;
  aliases?: string[];
  /** What was wrong in the notes' row, if anything. */
  fix?: string;
  /** Voicing convention, distinct from a factual correction. */
  note?: string;
};

type Row = [name: string, symbol: string, formula: string, category: ChordCategory, extra?: { id?: string; aliases?: string[]; fix?: string; note?: string }];

const ROWS: Row[] = [
  ["Major", "", "1 3 5", "Triads"],
  ["Minor", "m", "1 b3 5", "Triads"],
  ["Power chord (no 3rd)", "5", "1 5", "Power chords", { aliases: ["5th (power chord)"], note: "A two-pitch-class dyad. Doubling the root or fifth at the octave does not turn it into a triad." }],
  ["Flat 5", "(♭5)", "1 3 b5", "Triads"],
  ["Diminished", "°", "1 b3 b5", "Diminished & half-diminished"],
  ["Augmented", "+", "1 3 #5", "Augmented"],

  ["Added 6th", "6", "1 3 5 6", "Sixths"],
  ["6 (no 5th)", "6(no5)", "1 3 6", "Sixths"],
  ["Minor 6th", "m6", "1 b3 5 6", "Sixths"],
  ["6/9", "6/9", "1 3 5 6 9", "Sixths", { aliases: ["Add 6/9"] }],
  ["Minor 6/9", "m6/9", "1 b3 5 6 9", "Sixths", { aliases: ["Minor 6 add 9"] }],
  ["7/6", "7/6", "1 3 5 6 b7", "Sixths"],
  ["6/9♯11", "6/9♯11", "1 3 5 6 9 #11", "Sixths", { id: "6-sharp-11" }],

  ["7th (dominant)", "7", "1 3 5 b7", "Sevenths"],
  ["Major 7th", "maj7", "1 3 5 7", "Sevenths"],
  ["Minor 7th", "m7", "1 b3 5 b7", "Sevenths"],
  ["Minor-major 7th", "m(maj7)", "1 b3 5 7", "Sevenths", { aliases: ["Minor major seventh", "mMaj7"] }],
  ["Major 7/6", "maj7/6", "1 3 5 6 7", "Sevenths"],
  ["7th ♭5", "7♭5", "1 3 b5 b7", "Sevenths"],

  ["Minor 7♭5", "m7♭5", "1 b3 b5 b7", "Diminished & half-diminished", { aliases: ["Half-diminished 7th", "ø7"] }],
  ["Diminished 7th", "°7", "1 b3 b5 bb7", "Diminished & half-diminished"],
  ["Minor 9♭5", "m9♭5", "1 b3 b5 b7 9", "Diminished & half-diminished"],
  ["Minor 11♭5", "m11♭5", "1 b3 b5 b7 9 11", "Diminished & half-diminished", { id: "minor-7-flat-5-11" }],

  ["9th", "9", "1 3 5 b7 9", "Ninths"],
  ["Add 9th", "add9", "1 3 5 9", "Ninths", { aliases: ["Added 9th"] }],
  ["Major 9th", "maj9", "1 3 5 7 9", "Ninths"],
  ["Minor 9th", "m9", "1 b3 5 b7 9", "Ninths"],
  ["Minor add 9th", "m(add9)", "1 b3 5 9", "Ninths"],
  ["Minor major 7/9", "m(maj9)", "1 b3 5 7 9", "Ninths"],
  ["9♭5", "9♭5", "1 3 b5 b7 9", "Ninths"],

  ["11th", "11", "1 3 5 b7 9 11", "Elevenths"],
  ["Major 11th", "maj11", "1 3 5 7 9 11", "Elevenths"],
  ["Minor 11th", "m11", "1 b3 5 b7 9 11", "Elevenths"],
  ["Minor 11th (no 5th)", "m11(no5)", "1 b3 b7 9 11", "Elevenths"],
  ["Minor major 7/11", "m(maj11)", "1 b3 5 7 9 11", "Elevenths"],
  [
    "7th ♯11",
    "7♯11",
    "1 3 5 b7 #11",
    "Elevenths",
    { note: "This reference formula omits the ninth. The original example C E G B♭ D F♯ includes it and can be labelled C9♯11 explicitly. Extended-chord voicings may include or omit members according to the symbol, arrangement and melody; the original example is not inherently wrong." },
  ],
  ["Major 9th ♯11", "maj9♯11", "1 3 5 7 9 #11", "Elevenths", { id: "major-7th-sharp-11" }],

  ["13th", "13", "1 3 5 b7 9 13", "Thirteenths"],
  ["Major 13th", "maj13", "1 3 5 7 9 13", "Thirteenths"],
  [
    "Minor 13th",
    "m13",
    "1 b3 5 b7 9 11 13",
    "Thirteenths",
    { fix: "Your notes' example had B (a major 7th); the formula's ♭7 makes it B♭: C E♭ G B♭ D F A." },
  ],
  ["Major 7♯11/13", "maj13♯11", "1 3 5 7 9 #11 13", "Thirteenths"],
  ["♯11/13", "13♯11", "1 3 5 b7 9 #11 13", "Thirteenths"],
  ["Minor-major 9♭13", "m(maj9)♭13", "1 b3 5 7 9 b13", "Thirteenths", { id: "minor-major-7-flat-13" }],

  ["Suspended 4th", "sus4", "1 4 5", "Suspended", { aliases: ["Sus", "Sus4"] }],
  ["Suspended 2nd", "sus2", "1 2 5", "Suspended"],
  ["Suspended 2nd flat fifth", "sus2(♭5)", "1 2 b5", "Suspended", { aliases: ["Diminished suspended 2nd"], note: "Altered-fifth suspended triad; no third is implied." }],
  ["Suspended 4th flat fifth", "sus4(♭5)", "1 4 b5", "Suspended", { aliases: ["Diminished suspended 4th"] }],
  ["Suspended 2nd sharp fifth", "sus2(♯5)", "1 2 #5", "Suspended", { aliases: ["Augmented suspended 2nd"] }],
  ["Suspended 4th sharp fifth", "sus4(♯5)", "1 4 #5", "Suspended", { aliases: ["Augmented suspended 4th"] }],
  ["Suspended 6th", "6sus4(no5)", "1 4 6", "Suspended"],
  ["7 suspended", "7sus4", "1 4 5 b7", "Suspended"],
  ["9 suspended", "9sus4", "1 4 5 b7 9", "Suspended"],

  ["Augmented major 7th", "+maj7", "1 3 #5 7", "Augmented"],
  ["7th ♯5", "7♯5", "1 3 #5 b7", "Augmented"],
  ["Minor +", "m7♯5", "1 b3 #5 b7", "Augmented"],
  ["Minor 9+", "m9♯5", "1 b3 #5 b7 9", "Augmented"],
  ["Augmented nine", "+9", "1 3 #5 b7 9", "Augmented"],
  ["Augmented eleven", "+11", "1 3 #5 b7 9 11", "Augmented", { aliases: ["Augmented nine eleven (+9/11)"] }],
  ["Augmented 11/13", "+13", "1 3 #5 b7 9 11 13", "Augmented"],
  ["Augmented add6/add9/add11", "+add6(add9,add11)", "1 3 #5 6 9 11", "Augmented", { id: "augmented-6-11-13", note: "The sixth and thirteenth share a pitch class but describe different registers. This added-note formula includes 6, 9 and 11, with no seventh implied." }],

  ["Flat 9", "7♭9", "1 3 5 b7 b9", "Altered dominants"],
  ["Raised 9", "7♯9", "1 3 5 b7 #9", "Altered dominants", { aliases: ["7th ♯9"] }],
  ["♭9♭13", "7♭9♭13", "1 3 5 b7 b9 b13", "Altered dominants"],
  ["Raised nine flat thirteen", "7♯9♭13", "1 3 5 b7 #9 b13", "Altered dominants"],
  ["Flat five raised 9", "7♭5♯9", "1 3 b5 b7 #9", "Altered dominants", { aliases: ["7♭5♯9"] }],
  ["Flat five flat 9", "7♭5♭9", "1 3 b5 b7 b9", "Altered dominants", { aliases: ["7♭5♭9"] }],
  ["Flat five raised 9 flat 13", "7♭5♯9♭13", "1 3 b5 b7 #9 b13", "Altered dominants"],
  ["Flat five flat 9 flat 13", "7♭5♭9♭13", "1 3 b5 b7 b9 b13", "Altered dominants"],
  ["7♭5♭9♭13 (no 3rd)", "7♭5♭9♭13(no3)", "1 b5 b7 b9 b13", "Altered dominants"],
  ["Augmented flat nine", "+7♭9", "1 3 #5 b7 b9", "Altered dominants"],
  ["Augmented raised nine", "+7♯9", "1 3 #5 b7 #9", "Altered dominants"],
  ["13♯9", "13♯9", "1 3 5 b7 #9 13", "Altered dominants"],
  ["13♭9", "13♭9", "1 3 5 b7 b9 13", "Altered dominants"],
  ["13♭5", "13♭5", "1 3 b5 b7 9 13", "Altered dominants"],
  ["13♭5♯9", "13♭5♯9", "1 3 b5 b7 #9 13", "Altered dominants"],
  ["13♭5♭9", "13♭5♭9", "1 3 b5 b7 b9 13", "Altered dominants"],
];

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/♯/g, "-sharp-")
    .replace(/♭/g, "-flat-")
    .replace(/\+/g, "-aug-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const CHORDS: ChordDef[] = ROWS.map(([name, symbol, formula, category, extra]) => ({
  id: slug(name),
  name,
  symbol,
  formula: formula.split(" "),
  category,
  ...extra,
}));

/** Preserve bookmarks for entries consolidated after the data audit. */
export const LEGACY_CHORD_IDS: Record<string, string> = {
  "minor-9-suspended": "minor-11th",
  "augmented-raised-nine-flat-thirteen": "augmented-raised-nine",
  "augmented-flat-nine-flat-thirteen": "augmented-flat-nine",
};

export function getChord(id: string): ChordDef | undefined {
  return CHORDS.find((chord) => chord.id === (LEGACY_CHORD_IDS[id] ?? id));
}
