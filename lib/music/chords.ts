/*
 * The chord formula table from Guitar.docx. Rows that were the same chord
 * under two names are merged (the other name is kept in `aliases`), and the
 * notes are computed from the formula for whichever root is chosen.
 */

export type ChordCategory =
  | "Triads"
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
};

type Row = [name: string, symbol: string, formula: string, category: ChordCategory, extra?: { aliases?: string[]; fix?: string }];

const ROWS: Row[] = [
  ["Major", "", "1 3 5", "Triads"],
  ["Minor", "m", "1 b3 5", "Triads"],
  ["Power chord (no 3rd)", "5", "1 5", "Triads", { aliases: ["5th (power chord)"] }],
  ["Flat 5", "(♭5)", "1 3 b5", "Triads"],
  ["Diminished", "°", "1 b3 b5", "Diminished & half-diminished"],
  ["Augmented", "+", "1 3 #5", "Augmented"],

  ["Added 6th", "6", "1 3 5 6", "Sixths"],
  ["6 (no 5th)", "6(no5)", "1 3 6", "Sixths"],
  ["Minor 6th", "m6", "1 b3 5 6", "Sixths"],
  ["6/9", "6/9", "1 3 5 6 9", "Sixths", { aliases: ["Add 6/9"] }],
  ["Minor 6/9", "m6/9", "1 b3 5 6 9", "Sixths", { aliases: ["Minor 6 add 9"] }],
  ["7/6", "7/6", "1 3 5 6 b7", "Sixths"],
  ["6♯11", "6/9♯11", "1 3 5 6 9 #11", "Sixths"],

  ["7th (dominant)", "7", "1 3 5 b7", "Sevenths"],
  ["Major 7th", "maj7", "1 3 5 7", "Sevenths"],
  ["Minor 7th", "m7", "1 b3 5 b7", "Sevenths"],
  ["Major 7/6", "maj7/6", "1 3 5 6 7", "Sevenths"],
  ["7th ♭5", "7♭5", "1 3 b5 b7", "Sevenths"],

  ["Minor 7♭5", "m7♭5", "1 b3 b5 b7", "Diminished & half-diminished", { aliases: ["Half-diminished 7th", "ø7"] }],
  ["Diminished 7th", "°7", "1 b3 b5 bb7", "Diminished & half-diminished"],
  ["Minor 9♭5", "m9♭5", "1 b3 b5 b7 9", "Diminished & half-diminished"],
  ["Minor 7♭5/11", "m11♭5", "1 b3 b5 b7 9 11", "Diminished & half-diminished"],

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
    { fix: "Your notes' example (C E G B♭ D F♯) included a 9th (D) that the formula 1 3 5 ♭7 ♯11 leaves out. Spelled from the formula here; add the 9 for a 9♯11." },
  ],
  ["Major 7th ♯11", "maj9♯11", "1 3 5 7 9 #11", "Elevenths"],

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
  ["Minor major 7♭13", "m(maj9)♭13", "1 b3 5 7 9 b13", "Thirteenths"],

  ["Suspended 4th", "sus4", "1 4 5", "Suspended", { aliases: ["Sus", "Sus4"] }],
  ["Suspended 2nd", "sus2", "1 2 5", "Suspended"],
  ["Suspended 6th", "6sus4(no5)", "1 4 6", "Suspended"],
  ["7 suspended", "7sus4", "1 4 5 b7", "Suspended"],
  ["9 suspended", "9sus4", "1 4 5 b7 9", "Suspended"],
  ["Minor 9 suspended", "m9sus4", "1 b3 4 5 b7 9", "Suspended"],

  ["Augmented major 7th", "+maj7", "1 3 #5 7", "Augmented"],
  ["7th ♯5", "7♯5", "1 3 #5 b7", "Augmented"],
  ["Minor +", "m7♯5", "1 b3 #5 b7", "Augmented"],
  ["Minor 9+", "m9♯5", "1 b3 #5 b7 9", "Augmented"],
  ["Augmented nine", "+9", "1 3 #5 b7 9", "Augmented"],
  ["Augmented eleven", "+11", "1 3 #5 b7 9 11", "Augmented", { aliases: ["Augmented nine eleven (+9/11)"] }],
  ["Augmented 11/13", "+13", "1 3 #5 b7 9 11 13", "Augmented"],
  ["Augmented 6/11/13", "+6/9/11", "1 3 #5 6 9 11", "Augmented"],

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
  ["Augmented raised nine flat thirteen", "+7♯9♭13", "1 3 #5 b7 #9 b13", "Altered dominants"],
  ["Augmented flat nine flat thirteen", "+7♭9♭13", "1 3 #5 b7 b9 b13", "Altered dominants"],
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
