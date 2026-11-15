/** Page numbers are both PDF and printed pages in the supplied 2019 edition. */
export const BOOK_TITLE = "Fretboard guide";
export type DiagramSheet = { page: number; title: string; chapter: "Scales & modes" | "Root-position chords" | "Drop 2" | "Drop 3" | "Arpeggios"; href: string };

const majors = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];
const harmonic = ["Harmonic minor", "Locrian ♮6", "Ionian ♯5", "Dorian ♯4", "Phrygian dominant", "Lydian ♯2", "Ultra Locrian"];
const melodic = ["Melodic minor", "Dorian ♭2", "Lydian augmented", "Lydian dominant", "Mixolydian ♭6", "Locrian ♮2", "Altered"];
export const BOOK_CHORD_TYPES = [
  { id: "major", name: "Major triad", symbol: "", formula: ["1", "3", "5"], shapePage: 59, arpeggioPage: 83 },
  { id: "minor", name: "Minor triad", symbol: "m", formula: ["1", "b3", "5"], shapePage: 59, arpeggioPage: 84 },
  { id: "augmented", name: "Augmented triad", symbol: "+", formula: ["1", "3", "#5"], shapePage: 60, arpeggioPage: 85 },
  { id: "diminished", name: "Diminished triad", symbol: "°", formula: ["1", "b3", "b5"], shapePage: 60, arpeggioPage: 86 },
  { id: "major-7", name: "Major 7th", symbol: "maj7", formula: ["1", "3", "5", "7"], shapePage: 61, arpeggioPage: 87 },
  { id: "dominant-7", name: "Dominant 7th", symbol: "7", formula: ["1", "3", "5", "b7"], shapePage: 61, arpeggioPage: 88 },
  { id: "minor-major-7", name: "Minor-major 7th", symbol: "m(maj7)", formula: ["1", "b3", "5", "7"], shapePage: 62, arpeggioPage: 89 },
  { id: "minor-7", name: "Minor 7th", symbol: "m7", formula: ["1", "b3", "5", "b7"], shapePage: 62, arpeggioPage: 90 },
  { id: "augmented-major-7", name: "Augmented major 7th", symbol: "+maj7", formula: ["1", "3", "#5", "7"], shapePage: 63, arpeggioPage: 91 },
  { id: "half-diminished", name: "Half-diminished 7th", symbol: "m7♭5", formula: ["1", "b3", "b5", "b7"], shapePage: 63, arpeggioPage: 92 },
  { id: "diminished-7", name: "Diminished 7th", symbol: "°7", formula: ["1", "b3", "b5", "bb7"], shapePage: 64, arpeggioPage: 93 },
];
const modeIds = [
  ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"],
  ["aeolian-sharp-7", "locrian-sharp-6", "ionian-sharp-5", "dorian-sharp-4", "phrygian-dominant", "lydian-sharp-2", "super-locrian-bb7"],
  ["dorian-sharp-7", "dorian-b2", "lydian-augmented", "lydian-dominant", "mixolydian-b6", "locrian-natural-2", "altered"],
];

export const BOOK_DIAGRAMS: DiagramSheet[] = [
  ...["major-pentatonic", "minor-pentatonic", "major-blues", "minor-blues", "kumoi", "pelog", "hirajoshi"].map((id, i) => ({ page: 20 + i, title: ["Major pentatonic", "Minor pentatonic", "Major blues", "Minor blues", "Kumoi", "Pelog", "Hirajoshi"][i], chapter: "Scales & modes" as const, href: `/scales/${id}` })),
  ...[majors, harmonic, melodic].flatMap((names, f) => names.map((title, i) => ({ page: [28, 36, 44][f] + i, title, chapter: "Scales & modes" as const, href: `/modes/${["major", "harmonic-minor", "melodic-minor"][f]}?mode=${modeIds[f][i]}` }))),
  ...["whole-tone", "augmented", "diminished-half-whole", "diminished-whole-half"].map((id, i) => ({ page: 54 + i, title: ["Whole tone", "Augmented", "Half-whole diminished", "Whole-half diminished"][i], chapter: "Scales & modes" as const, href: `/scales/${id}` })),
  ...["Major & minor triads", "Augmented & diminished triads", "Major & dominant sevenths", "Minor-major & minor sevenths", "Augmented major & half-diminished sevenths", "Diminished seventh"].map((title, i) => ({ page: 59 + i, title, chapter: "Root-position chords" as const, href: "/voicings" })),
  ...["Drop 2", "Drop 3"].flatMap((chapter, j) => BOOK_CHORD_TYPES.slice(4).map((c, i) => ({ page: [67, 75][j] + i, title: c.name, chapter: chapter as "Drop 2" | "Drop 3", href: `/voicings?chord=${c.id}&voicing=drop-${j + 2}` }))),
  ...BOOK_CHORD_TYPES.map((c) => ({ page: c.arpeggioPage, title: c.name, chapter: "Arpeggios" as const, href: `/arpeggios?chord=${c.id}` })),
];

export const BOOK_CHAPTERS = [
  { title: "Start here", pages: "5–8, 104–107", description: "Tuning, fretboard notes, rhythm and the Double Note system.", href: "/learn/fretboard-system" },
  { title: "Theory", pages: "9–17", description: "Intervals, chords, inversions, modes, signatures and dominants.", href: "/learn/intervals" },
  { title: "Scales & modes", pages: "18–57", description: "Five pentatonic boxes, three mode families and symmetric scales.", href: "/scales" },
  { title: "Chords & voicings", pages: "58–81", description: "Root-position shapes, inversions, drop 2 and drop 3.", href: "/voicings" },
  { title: "Arpeggios", pages: "82–93", description: "Four triad types and seven seventh-chord types across the neck.", href: "/arpeggios" },
  { title: "Putting it together", pages: "94–103", description: "Harmonization, modal colour, pentatonic substitutions and improvisation.", href: "/learn/harmonization" },
  { title: "Exercises", pages: "108–111", description: "Identify intervals and chords, spell their notes and check your answers.", href: "/practice" },
];

export const BOOK_TOPIC_PAGES: Record<string, string> = {
  "sound-and-pitch": "5–6, 104", notes: "104–106", rhythm: "106–107", intervals: "9–10, 108, 110", scales: "11, 18–19", modes: "11–12, 15–16", chords: "10–11, 15", harmony: "15–17", keys: "12–14", "fretboard-system": "6–8, 104–105", voicings: "11, 58–81", arpeggios: "82–93", "symmetric-scales": "51–57", harmonization: "27, 58, 66, 74, 94–95", improvisation: "75–81, 96–103", "pentatonic-substitutions": "100–103",
};

export function scaleBookPage(id: string) { return BOOK_DIAGRAMS.find((s) => s.href === `/scales/${id}`)?.page ?? ({ major: 28, "natural-minor": 33, "harmonic-minor": 36, "melodic-minor": 44 } as Record<string, number>)[id]; }
export function modeBookPage(family: string, start: number) { const base = ({ major: 28, "harmonic-minor": 36, "melodic-minor": 44 } as Record<string, number>)[family]; return base ? base + start : undefined; }
