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
  | "minor-blues"
  | "diminished-whole-half"
  | "diminished-half-whole"
  | "bebop-major"
  | "bebop-dominant"
  | "harmonic-minor"
  | "melodic-minor"
  | "chromatic"
  | "whole-tone"
  | "kumoi"
  | "pelog"
  | "hirajoshi"
  | "augmented";

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
  /** Contextual applications, distinct from chords contained in the collection. */
  harmonyNotes?: string;
  /** Classical descending form, ordered from the octave down to the root. */
  descendingFormula?: string[];
  /** Pentatonic boxes (2 per string) or 3-notes-per-string patterns. */
  positions?: { perString: number; label: string };
  /** Related mode family page, if the scale has one. */
  modesHref?: string;
  /** Doc's notes for this scale, in order. */
  notes: Block[];
};

const SCALE_DEFINITIONS: ScaleDef[] = [
  {
    id: "kumoi", name: "Kumoi scale", short: "Kumoi", family: "Pentatonic · book variant",
    formula: ["1", "2", "b3", "5", "6"], exampleRoot: 9,
    positions: { perString: 2, label: "Generated 2-note-per-string fingering" },
    notes: [
      { type: "p", text: "The collection used on page 24 is Dorian with the fourth and seventh removed. From A: A B C E F♯. The natural sixth gives a brighter minor colour than Hirajoshi. Its steps are W H 4H W 3H." },
      { type: "p", text: "Try it over Am6 or an Am7 vamp that supports F♯. The five notes contain the minor triad and sixth but no seventh. The book's harmonic table comes from the larger Dorian parent, rather than from stacking thirds within these five notes." },
    ],
  },
  {
    id: "pelog", name: "Pelog scale", short: "Pelog", family: "Pentatonic · book variant",
    formula: ["1", "b2", "b3", "5", "b6"], exampleRoot: 9,
    positions: { perString: 2, label: "Generated 2-note-per-string fingering" },
    notes: [
      { type: "p", text: "Page 25 uses the five-note guitar collection 1 ♭2 ♭3 5 ♭6: Phrygian with fourth and seventh omitted. From A: A B♭ C E F. Its semitone pairs and wide gaps create a strongly contrasted minor sound. Steps: H W 4H H 4H." },
      { type: "p", text: "Here Pelog names the book's equal-tempered guitar adaptation. The traditional Javanese pelog tuning system is broader and is not defined by this single five-note Western formula. Over A minor, treat B♭ and F as deliberate colours and resolve them with care." },
    ],
  },
  {
    id: "hirajoshi", name: "Hirajoshi scale", short: "Hirajoshi", family: "Pentatonic · book variant",
    formula: ["1", "2", "b3", "5", "b6"], exampleRoot: 9,
    positions: { perString: 2, label: "Generated 2-note-per-string fingering" },
    notes: [
      { type: "p", text: "Page 26 uses Aeolian with the fourth and seventh omitted: 1 2 ♭3 5 ♭6. From A: A B C E F. Steps: W H 4H H 4H. Compare with Kumoi by lowering only the sixth, then compare with Pelog by lowering only the second." },
      { type: "p", text: "Hirajoshi spellings and rotations vary between guitar references. This explorer follows the supplied book's explicit formula. Sustain the root in accompaniment, explore the B–C and E–F semitone pairs, and connect two-note motifs across adjacent positions." },
    ],
  },
  {
    id: "augmented", name: "Augmented scale", short: "Augmented", family: "Hexatonic · symmetrical",
    formula: ["1", "#2", "3", "5", "b6", "7"], exampleRoot: 9,
    notes: [
      { type: "p", text: "Alternate three semitones and one semitone: 3H H 3H H 3H H. From A: A B♯ C♯ E F G♯. The harmonic respelling A C C♯ E E♯ G♯ describes the same pitches. The collection repeats after four frets and has four distinct transpositions." },
      { type: "p", text: "It combines two augmented triads a semitone apart: A+ and G♯+. With suitable respelling it contains major, minor and augmented triads on A, C♯ and F, plus Amaj7, C♯maj7 and Fmaj7. It can colour major, augmented-major and minor-major harmony, depending on phrasing." },
      { type: "callout", tone: "fix", title: "Corrected from page 52: contained chords", text: "E♭maj7 is not contained in A augmented: E♭ and B♭ lie outside the scale. The major-seventh chords related by this scale's symmetry are Amaj7, C♯maj7 and Fmaj7, four semitones apart." },
    ],
  },
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
            type: "visual",
            id: "c-major-scale-tab",
            caption: "C major scale, one octave, notation and tab.",
          },
      {
            type: "visual",
            id: "c-major-intervals-tab",
            caption: "The same pattern, labelled by interval from the root.",
          },
    ],
  },
  {
    id: "natural-minor",
    name: "Natural minor scale",
    short: "Natural minor",
    aka: ["Aeolian mode"],
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
          { label: "Example in A", value: "A – B – C – D – E – F – G – A" },
          { label: "Minor chord theory", value: "Root + ♭3rd + 5th" },
          { label: "Progression", value: "min · dim · Maj · min · min · Maj · Maj" },
        ],
      },
      {
        type: "p",
        text: "A major scale and its relative natural minor share a pitch collection but have different tonal centres. A is degree 6 of C major, so A minor is its relative minor. Emphasizing A as home through the bass, harmony and melodic resolutions distinguishes A minor from C major; changing the starting note alone need not do so.",
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
    harmonyNotes: "C major pentatonic contains C, D, E, G and A. Its C–E–G triad and C–E–G–A sixth chord use only those pitches. Over Cmaj7, the backing chord adds B, while D and A can act as 9 and 13. That is a contextual chord-scale application, not a seventh-chord harmonization contained entirely in the pentatonic collection.",
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
          { label: "Chords in the parent major key", value: "I · ii · iii · V · vi have roots in the pentatonic; their full chords may add pitches outside it" },
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
    harmonyNotes: "A minor pentatonic contains A, C, D, E and G, including the full Am7 chord A–C–E–G; D can act as its 11. Over a blues A7 backing, the chord's C♯ is outside the scale and contrasts with the scale's C. Choose that blues colour intentionally rather than assuming every pentatonic note belongs to every backing chord.",
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
          { label: "Chords in the parent natural minor", value: "i · III · iv · v · VII have roots in the pentatonic; their full chords may add pitches outside it" },
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
      { type: "p", text: "Use this collection as a melodic blues vocabulary rather than assigning one mandatory chord to each note. In A, C can move chromatically to C♯ over A or A7, while A, C♯ and E are the tonic major triad's chord tones. Listen to the backing harmony and resolve passing notes intentionally." },
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
        text: "Used in classical, neoclassical, rock and jazz. Raising the seventh provides a leading tone and makes V major or dominant seventh: E or E7 in A minor. An applied dominant uses the same dominant-to-tonic relationship with a temporary tonic; it is not exclusive to harmonic minor.",
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
    descendingFormula: ["8", "b7", "b6", "5", "4", "b3", "2", "1"],
    exampleRoot: 9,
    positions: { perString: 3, label: "3 notes per string" },
    modesHref: "/modes/melodic-minor",
    notes: [
      {
        type: "p",
        text: "The fixed ascending melodic-minor collection raises natural minor's sixth and seventh: 1 2 ♭3 4 5 6 7. Jazz minor uses this same collection in either direction; its seven modes are derived from this fixed form. In the conventional classical exercise, melodic minor descends as natural minor. Real minor-key melodies use these forms according to musical context.",
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
        text: "Standalone chromatic exercises are often written with sharps ascending and flats descending. In actual music, the key, harmony and voice leading can require different spellings, so this is a useful convention rather than an absolute rule.",
      },
      {
            type: "visual",
            id: "chromatic-ascending",
            caption: "Ascending: sharps.",
          },
      {
            type: "visual",
            id: "chromatic-descending",
            caption: "Descending: flats.",
          },
    ],
  },
  {
    id: "minor-blues",
    name: "Minor blues scale",
    short: "Minor blues",
    family: "Hexatonic",
    formula: ["1", "b3", "4", "b5", "5", "b7"],
    exampleRoot: 9,
    notes: [
      { type: "p", text: "Add a chromatic passing ♭5 between the fourth and fifth of minor pentatonic. A minor blues is A C D E♭ E G. Treat the blue note as an expressive colour, often moving through it toward a chord tone." },
      { type: "p", text: "This scale appears over minor blues and, with intentional major/minor-third tension, dominant blues harmony. A scale name alone does not guarantee every note will suit every chord; follow the melody and chord changes." },
    ],
  },
  {
    id: "diminished-whole-half",
    name: "Whole-half diminished scale",
    short: "Whole-half diminished",
    family: "Octatonic · symmetrical",
    formula: ["1", "2", "b3", "4", "b5", "b6", "6", "7"],
    exampleRoot: 0,
    notes: [
      { type: "p", text: "Alternate whole steps and half steps, beginning with a whole step. From C: C D E♭ F G♭ A♭ A B. The C diminished seventh chord C E♭ G♭ B𝄫 is contained in the collection; A and B𝄫 are enharmonic here. This is a common scale choice for diminished-seventh harmony." },
      { type: "p", text: "Eight-note scales cannot assign one unique letter to every note within an octave. Spellings here identify the chosen degrees; harmonic context may call for an enharmonic alternative." },
    ],
  },
  {
    id: "diminished-half-whole",
    name: "Half-whole diminished scale",
    short: "Half-whole diminished",
    family: "Octatonic · symmetrical",
    formula: ["1", "b2", "b3", "3", "#4", "5", "6", "b7"],
    exampleRoot: 0,
    notes: [
      { type: "p", text: "Alternate half steps and whole steps, beginning with a half step. From C: C D♭ E♭ E F♯ G A B♭. Over C7 these supply the root, major third, fifth, minor seventh, ♭9, ♯9 (E♭ respelled D♯), ♯11 and 13." },
      { type: "p", text: "Unlike the altered scale, this collection includes a natural fifth and natural thirteenth. Select it when those colours fit the dominant chord and melody." },
    ],
  },
  {
    id: "bebop-major",
    name: "Major bebop scale",
    short: "Major bebop",
    family: "Octatonic · passing-note scale",
    formula: ["1", "2", "3", "4", "5", "#5", "6", "7"],
    exampleRoot: 0,
    notes: [
      { type: "p", text: "Add a chromatic passing note between the fifth and sixth of major: C D E F G G♯ A B. With suitable eighth-note phrasing, the added note helps major-sixth chord tones C E G A fall on the beats. Starting point, direction and rhythm determine the alignment." },
    ],
  },
  {
    id: "bebop-dominant",
    name: "Dominant bebop scale",
    short: "Dominant bebop",
    family: "Octatonic · passing-note scale",
    formula: ["1", "2", "3", "4", "5", "6", "b7", "7"],
    exampleRoot: 7,
    notes: [
      { type: "p", text: "Add the major seventh as a chromatic passing note between the minor seventh and tonic of Mixolydian. From G: G A B C D E F F♯. G7's chord tones are G B D F; F♯ normally functions as a passing note rather than a stable added major seventh over that chord." },
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

const SCALE_ORDER: ScaleId[] = ["major", "natural-minor", "major-pentatonic", "minor-pentatonic", "major-blues", "minor-blues", "kumoi", "pelog", "hirajoshi", "harmonic-minor", "melodic-minor", "whole-tone", "augmented", "diminished-half-whole", "diminished-whole-half", "chromatic", "bebop-major", "bebop-dominant"];
export const SCALES: ScaleDef[] = SCALE_ORDER.map((id) => SCALE_DEFINITIONS.find((scale) => scale.id === id)!);

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
  { name: "Chromatic / dodecatonic", notes: "12", text: "All 12 pitch classes in this app's equal-tempered octave." },
  { name: "Nonatonic", notes: "9", text: "Any nine-pitch-class scale; the count does not specify one formula or style." },
  { name: "Octatonic", notes: "8", text: "Eight pitch classes, including symmetrical diminished collections and distinct bebop passing-note scales." },
  { name: "Heptatonic", notes: "7", text: "The most common modern Western scale: major, minor and their modes." },
  { name: "Hexatonic", notes: "6", text: "Common in Western folk music; also the blues and whole-tone scales." },
  { name: "Pentatonic", notes: "5", text: "Any five-pitch-class scale. Major and minor pentatonic have no semitone steps; F♯ major pentatonic is one example playable using only black piano keys." },
  { name: "Tetratonic, tritonic, ditonic", notes: "4 · 3 · 2", text: "Collections of four, three or two pitch classes. Small collections can occur across historical and contemporary styles; the count implies no cultural or historical ranking." },
];
