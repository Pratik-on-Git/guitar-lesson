export const THEORY_BOOK = {
  title: "Music Theory: From Beginner to Expert", author: "Nicolas Carter", edition: "Third edition · 2018", pages: 220,
  href: "/books/music-theory",
};
export type TheoryChapter = { id: string; title: string; pages: string; summary: string; lessons: { title: string; href: string; pages: string }[] };
export const THEORY_CHAPTERS: TheoryChapter[] = [
  { id: "fundamentals", title: "1 · Music theory fundamentals", pages: "13–29", summary: "Pitch, tuning, notes, intervals and the roles of harmony, melody and rhythm.", lessons: [
    { title: "Sound & pitch", href: "/learn/sound-and-pitch", pages: "13–16" }, { title: "Notes & octaves", href: "/learn/notes", pages: "15–19" }, { title: "Tuning & cents", href: "/learn/tuning", pages: "18–21" }, { title: "Steps & intervals", href: "/learn/intervals", pages: "21–27" }, { title: "Melody & musical ideas", href: "/learn/melody", pages: "27–29" },
  ] },
  { id: "scales", title: "2 · Scales, modes & keys", pages: "30–93", summary: "Pentatonic and seven-note families, parallel/relative modes, parent scales and listening practice.", lessons: [
    { title: "Scale explorer", href: "/scales", pages: "30–57, 88–90" }, { title: "Pentatonic modes", href: "/modes/minor-pentatonic", pages: "36–45" }, { title: "Major modes", href: "/modes/major", pages: "57–71" }, { title: "Harmonic-minor modes", href: "/modes/harmonic-minor", pages: "71–80" }, { title: "Melodic-minor modes", href: "/modes/melodic-minor", pages: "80–88" }, { title: "Listening & ear training", href: "/learn/listening", pages: "39–44, 69–71" }, { title: "Circle of fifths", href: "/circle-of-fifths", pages: "90–93" },
  ] },
  { id: "chords", title: "3 · Chords & progressions", pages: "94–148", summary: "Triads to altered extensions, chord construction, inversions, voice leading and chord progressions.", lessons: [
    { title: "Chord library", href: "/chords", pages: "94–124" }, { title: "Extended & altered chords", href: "/learn/extended-chords", pages: "107–124" }, { title: "Slash, quartal & polychords", href: "/learn/chord-structures", pages: "125, 132–142" }, { title: "Harmonization", href: "/harmonization", pages: "125–131" }, { title: "Inversions & drops", href: "/voicings", pages: "132–140" }, { title: "Progressions & cadences", href: "/learn/progressions", pages: "131–132, 142–148" }, { title: "Arpeggios", href: "/arpeggios", pages: "146–148" },
  ] },
  { id: "rhythm", title: "4 · Rhythm & meter", pages: "149–168", summary: "Pulse, subdivisions, meter, tuplets, cross-rhythms and all 17 beat-building units.", lessons: [
    { title: "Rhythm foundations", href: "/learn/rhythm", pages: "149–157" }, { title: "Meter, tuplets & cross-rhythms", href: "/learn/rhythm-and-meter", pages: "156–168" }, { title: "Rhythm lab", href: "/rhythm-lab", pages: "162–168, 219–220" },
  ] },
  { id: "expression", title: "5 · Expression & movement", pages: "169–171", summary: "Shape a phrase with timbre, dynamics, articulation, density and tension.", lessons: [
    { title: "Expression & extended techniques", href: "/learn/expression", pages: "169–171" }, { title: "Listening lab", href: "/listening", pages: "169–171" },
  ] },
  { id: "composition", title: "6 · Putting structures together", pages: "172–180", summary: "Compose and improvise with a sense of note function, chord function and harmonic organization.", lessons: [
    { title: "Harmonic function", href: "/learn/harmonic-function", pages: "175–178" }, { title: "Composition & improvisation", href: "/learn/composition", pages: "172–175" }, { title: "Harmony systems", href: "/learn/harmony-systems", pages: "178–180" }, { title: "Composition sketchbook", href: "/composition", pages: "172–180" },
  ] },
  { id: "advanced", title: "7 · Beyond the foundations", pages: "181–210", summary: "Reharmonization, chord-scales, chromaticism, layered centers, modal playing and free approaches.", lessons: [
    { title: "Reharmonization", href: "/learn/reharmonization", pages: "183–194" }, { title: "Progression workbench", href: "/progressions", pages: "183–194" }, { title: "Chord-scale choices", href: "/improvisation", pages: "195–200" }, { title: "Outside playing & free approaches", href: "/learn/outside-playing", pages: "201–210" }, { title: "Harmony lab", href: "/harmony-lab", pages: "188–194, 202–207" },
  ] },
];

export const THEORY_TOPIC_PAGES: Record<string, string> = {
  "sound-and-pitch": "13–16", notes: "15–20", intervals: "21–27, 218–219", scales: "30–36, 45–57", modes: "36–45, 57–88", chords: "94–106, 125–131", harmony: "114–124, 183–194", keys: "90–93, 145–146", rhythm: "149–160", voicings: "132–142", arpeggios: "146–148, 195–198", harmonization: "125–131", improvisation: "195–206", tuning: "18–21", listening: "39–44, 69–71", melody: "27–29, 173–175", "extended-chords": "107–124", "chord-structures": "125, 132–142, 188–189", progressions: "131–132, 142–148, 183–194", "rhythm-and-meter": "149–168", expression: "169–171, 209–210", composition: "172–175, 180", "harmonic-function": "175–178", "harmony-systems": "178–180, 202–210", reharmonization: "183–194", "outside-playing": "195–210",
};

export const THEORY_CORRECTIONS = [
  { pages: "20", title: "Cents are an exact logarithmic unit", text: "A semitone is exactly 100 cents in 12-tone equal temperament; the octave is 1,200 cents. There are continuously many pitches between two notes, rather than 100 separate available pitches." },
  { pages: "23–27, 218–219", title: "Interval names depend on spelling and direction", text: "D to A♯ ascending is an augmented fifth, not a minor sixth. G♭ to A♭ ascending is a major second, not a minor seventh. Accidentals do not determine whether an interval ascends or descends." },
  { pages: "77–88", title: "Use unambiguous mode formulas", text: "The harmonic-minor seventh mode is ultra-Locrian/altered 𝄫7. The melodic-minor seventh is altered/super-Locrian. Page 80's Locrian ♮6 row has a minor seventh, despite the M7 label. The E Mixolydian ♭6 example on page 85 also needs its seventh note D." },
  { pages: "104–121", title: "Pitch equivalence does not make chord formulas identical", text: "Spell C°7 as C E♭ G♭ B𝄫. Cm7♯11 retains G and adds F♯; Cm7♭5 replaces G with G♭. Natural fifths, altered fifths and added extensions must be distinguished." },
  { pages: "125, 132–142", title: "Keep root, bass and voice order separate", text: "Inversion changes the bass, not the chord root. Cmaj7/E stays Cmaj7. Pure perfect-fourth stacks are C F B♭ E♭; diatonic fourth stacks can use a different interval mixture. Smooth voice leading has no universal two-semitone limit." },
  { pages: "142", title: "The leading tone resolves to the tonic", text: "In G7 to C, the dominant third B normally resolves to C, the tonic root, rather than the tonic fifth G. Perfect authentic cadence terminology additionally considers the soprano and root positions." },
  { pages: "156–160", title: "3/4 is simple triple; 6/8 is compound duple", text: "Simple/compound describes division of the beat, not whether the top number is divisible by two or three. 6/8 normally has two dotted-quarter beats; its three-eighth groups are ordinary subdivisions, not written triplets." },
  { pages: "167, 220", title: "The dotted eighth occupies three quarters of one beat", text: "Pattern 16 fills a quarter-note beat with a sixteenth rest and dotted eighth. In sequence 2, bar 4, beat 4, the count line implies that dotted eighth; the duration summary omits its dot." },
  { pages: "176–180, 204–210", title: "Modal and atonal music are broader than this taxonomy", text: "Modal music can establish a strong tonic. Atonal music need not use all twelve pitches equally, and serialism is one compositional method rather than a synonym for atonality. Free improvisation can include deliberate constraints and shared structure." },
  { pages: "188–203", title: "Check every proposed substitute against its actual notes", text: "Cmaj7/E contains E G B C, not Em(♭9). Cm7 is not contained in B Aeolian. Lydian ♯2 is mode 6 of harmonic minor. Am is not the diatonic vi chord of C minor. Shared notes help explain a substitute but do not guarantee its suitability." },
];
