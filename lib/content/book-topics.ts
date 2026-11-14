import type { Block, Topic } from "./types.ts";
const p = (text: string): Block => ({ type: "p", text });
const list = (...items: string[]): Block => ({ type: "list", ordered: true, items });
const table = (columns: string[], rows: string[][]): Block => ({ type: "table", columns, rows });
const tip = (title: string, text: string): Block => ({ type: "callout", tone: "tip", title, text });
const links = (...items: [string, string][]): Block => ({ type: "links", items: items.map(([label, href]) => ({ label, href })) });

/** Newly written study explanations, organized from the supplied book. */
export const BOOK_TOPICS: Topic[] = [
  {
    slug: "fretboard-system", title: "Fretboard & Double Note system",
    description: "Learn the neck, read the book's boxes and connect vertical positions with horizontal movement.",
    sections: [
      { id: "tuning", title: "Standard tuning and fretboard notes", blocks: [
        p("Read string numbers from the thinnest string: 1 = high E, 2 = B, 3 = G, 4 = D, 5 = A, 6 = low E. From lowest to highest pitch, standard tuning is E2 A2 D3 G3 B3 E4. Each fret raises a string by one semitone; fret 12 repeats its open pitch class an octave higher."),
        p("Most adjacent strings are a perfect fourth apart. G to B is a major third, so a shape crossing that pair needs a one-fret adjustment. Drop D lowers only the low E string to D; this app's diagrams use standard tuning throughout."),
        list("Name the natural notes on one string through fret 12. E–F and B–C are adjacent frets; other natural-note pairs have a fret between them.", "Locate one pitch class on every string, then repeat an octave higher.", "Find roots on strings 6, 5 and 4 before learning a shape. Say both the note name and the scale degree."),
        links(["Train fretboard notes", "/practice?exercise=fretboard"], ["Notes & octaves", "/learn/notes"]),
      ] },
      { id: "reading-diagrams", title: "Read the source diagrams", blocks: [
        p("The source sheets show high E at the top and low E at the bottom. Numbers inside dots are degrees, not fingers. A boxed R marks a root; the numbers under the neck are frets. The book's illustrated examples use A as root. Move every fretted note by the same semitone distance to transpose; when the result falls below fret zero, use the octave above."),
        tip("Source sheets and generated fingerings", "The atlas preserves the original numbered boxes. The interactive explorer also generates fingerings by their starting degree on low E; those numbers do not reproduce the book's box numbering. Use the source sheet when an assignment calls for a specific book box."),
      ] },
      { id: "double-note", title: "The Double Note construction", blocks: [
        p("The book organizes seven-note scales into three notes per string, with the final note on string 3 (G) repeated at the same sounding pitch as the first note on string 2 (B). This repeated pitch is marked with a triangle. It compensates for the G–B tuning interval and helps you see related patterns across string pairs 6–5, 4–3 and 2–1."),
        p("The repeat adds no new scale degree or pitch. Practise both locations to learn the geography; omit one when you want an uninterrupted melodic ascent. This construction is intended for seven-note scales and selected other shapes, not every possible note collection."),
        links(["Try the Double Note fingering", "/scales/major?key=a"]),
      ] },
      { id: "root-anchors", title: "Five-box and seven-box root anchors", blocks: [
        table(["Book system", "Boxes", "Reference root string"], [
          ["Pentatonic, blues and root-position chords", "1–2", "6 (low E)"],
          ["Pentatonic, blues and root-position chords", "3", "4 (D)"],
          ["Pentatonic, blues and root-position chords", "4–5", "5 (A)"],
          ["Major/harmonic/melodic modes, symmetric scales, arpeggios", "1–2", "6 (low E)"],
          ["Major/harmonic/melodic modes, symmetric scales, arpeggios", "3–4", "4 (D)"],
          ["Major/harmonic/melodic modes, symmetric scales, arpeggios", "5–7", "5 (A)"],
        ]),
        p("These strings identify the reference root used to organize each box. They do not imply that the root appears on only that string or that an arpeggio must begin at that root."),
      ] },
      { id: "parent-boxes", title: "Parent-box offsets and the H marker", blocks: [
        p("A bracket such as [+3] relates a mode's box order to its parent: the first Dorian ♯4 box corresponds to the fourth harmonic-minor box, then continue cyclically. For seven boxes, wrap after box 7; negative offsets wrap the same way. An H flags a semitone at the start, so check which finger takes the root instead of treating all shapes as whole-step starts."),
        p("Parent scales are also a note-finding tool: A Dorian is the second mode of G major; A Dorian ♯4 is the fourth mode of E harmonic minor. Find the parent by the actual parent-degree interval, not by subtracting the same number of frets for every family."),
        links(["Original diagram atlas", "/book"], ["Mode families", "/modes/major"]),
      ] },
      { id: "practice-method", title: "Connect one position at a time", blocks: [
        list("Choose a root and one box. Play slowly with even time and a clear sound, naming the roots.", "Create a short phrase using only that box, then repeat it in the adjacent box.", "Join boxes 1–2, then 2–3, then groups of three. Finally move across the whole neck.", "Transpose to another root and repeat. Study the same shapes as scales, chords and arpeggios so the relationships become visible."),
      ] },
    ],
  },
  {
    slug: "voicings", title: "Inversions & drop voicings",
    description: "Turn chord formulas into actual bass notes, ordered pitches and guitar shapes.",
    sections: [
      { id: "inversions", title: "Inversion is determined by the bass", blocks: [
        p("A chord's inversion depends on its lowest sounding chord tone. For Cmaj7: C in the bass is root position, E is first inversion, G second inversion and B third inversion. The other voices can have different spacing or doublings. A triad has only root position and two inversions."),
        table(["Inversion", "Cmaj7 close-position example", "Bass"], [["Root", "C E G B", "C"], ["First", "E G B C", "E"], ["Second", "G B C E", "G"], ["Third", "B C E G", "B"]]),
        p("Close position packs the chord tones into their nearest ascending arrangement. A voicing specifies the complete register and order, including omissions and doubling; inversion alone does not."),
      ] },
      { id: "root-shapes", title: "Five root-position shapes", blocks: [
        p("Pages 59–64 give five shapes for each of four triads and seven seventh-chord qualities. Start with major, minor, augmented and diminished triads. Add major 7, dominant 7, minor-major 7, minor 7, augmented major 7, half-diminished and diminished 7."),
        p("Some dominant-7 and minor-7 source shapes omit the fifth. Keep the defining third and seventh clear, and mute unused strings. A chord formula describes its identity; a practical guitar grip need not double or include every formula tone."),
        links(["Root-position source sheets", "/book?chapter=Root-position+chords"], ["Voicing workbench", "/voicings"]),
      ] },
      { id: "drop-2", title: "Drop 2: lower the second-highest voice", blocks: [
        p("Begin with a four-voice close-position seventh chord. Count from its highest voice and lower voice 2 by one octave, leaving the others at their original pitches. For C4 E4 G4 B4, lower G4 to G3: G3 C4 E4 B4. The result is second inversion, even though the source close voicing was root position."),
        table(["Starting close order", "Resulting low-to-high order", "Resulting bass"], [["1 3 5 7", "5 1 3 7", "5"], ["3 5 7 1", "7 3 5 1", "7"], ["5 7 1 3", "1 5 7 3", "1"], ["7 1 3 5", "3 7 1 5", "3"]]),
        p("On guitar, use four adjacent strings: 4–3–2–1, 5–4–3–2 or 6–5–4–3. The recipe works for every seventh quality; use that chord's actual altered third, fifth and seventh. Select the resulting inversion in the workbench, then compare all four."),
      ] },
      { id: "drop-3", title: "Drop 3: lower the third-highest voice", blocks: [
        p("From C4 E4 G4 B4, the third-highest voice is E4. Lower it to E3, giving E3 C4 G4 B4: first inversion. Typical guitar string sets are 5–3–2–1 and 6–4–3–2, with a muted string above the bass."),
        table(["Starting close order", "Resulting low-to-high order", "Resulting bass"], [["1 3 5 7", "3 1 5 7", "3"], ["3 5 7 1", "5 3 7 1", "5"], ["5 7 1 3", "7 5 1 3", "7"], ["7 1 3 5", "1 7 3 5", "1"]]),
        tip("Count voices from the top", "Drop 2 does not mean lower scale degree 2. Drop 3 does not mean lower scale degree 3. The number identifies a voice in the starting close voicing; its chord degree changes with the starting inversion."),
      ] },
      { id: "voice-leading", title: "Practise voice leading", blocks: [
        list("Play all inversions of one chord on a fixed string set. Listen to the top voice and name the bass.", "Harmonize a major, harmonic-minor or melodic-minor scale using the same voicing type and root-string constraint.", "Connect Dm7–G7–Cmaj7 with the smallest useful voice movements. Preserve common tones and resolve the dominant's third and seventh.", "Change one chord tone to discover another quality: Cmaj7 to C7 lowers B to B♭; C7 to Cm7 also lowers E to E♭."),
        links(["Practise drop 2 and drop 3", "/voicings"], ["Harmonize a scale", "/harmonization"]),
      ] },
    ],
  },
  {
    slug: "arpeggios", title: "Arpeggios & chord-tone phrasing",
    description: "Play chords melodically, connect their inversions and target the changes.",
    sections: [
      { id: "chords-as-lines", title: "A chord played one note at a time", blocks: [
        p("An arpeggio presents a chord's tones successively. C major is C E G; Cmaj7 adds B. The identity is the same as the chord, but the notes form a melody instead of a simultaneous grip. Octave displacement, repetition and rhythm turn a formula into a phrase."),
        p("The book gives seven positions for each of four triad types and seven seventh types. The atlas preserves all 77 source shapes across pages 83–93. The explorer maps every chord tone on the neck and offers a generated position window and an ordered two-octave line."),
        links(["Arpeggio explorer", "/arpeggios"], ["Seven-position source sheets", "/book?chapter=Arpeggios"]),
      ] },
      { id: "triads", title: "Four triad families", blocks: [
        table(["Quality", "Formula", "From A"], [["Major", "1 3 5", "A C♯ E"], ["Minor", "1 ♭3 5", "A C E"], ["Augmented", "1 3 ♯5", "A C♯ E♯"], ["Diminished", "1 ♭3 ♭5", "A C E♭"]]),
        p("Practise starting on the third and fifth as well as the root. The source shapes can contain several octaves of the same chord; identify each new root rather than memorizing only a picking direction."),
      ] },
      { id: "sevenths", title: "Seven seventh-chord families", blocks: [
        table(["Quality", "Formula", "From A"], [["Major 7", "1 3 5 7", "A C♯ E G♯"], ["Dominant 7", "1 3 5 ♭7", "A C♯ E G"], ["Minor-major 7", "1 ♭3 5 7", "A C E G♯"], ["Minor 7", "1 ♭3 5 ♭7", "A C E G"], ["Augmented major 7", "1 3 ♯5 7", "A C♯ E♯ G♯"], ["Half-diminished", "1 ♭3 ♭5 ♭7", "A C E♭ G"], ["Diminished 7", "1 ♭3 ♭5 𝄫7", "A C E♭ G♭"]]),
        p("A diminished seventh is spelled 𝄫7, even though it sounds like a major sixth in equal temperament. Preserve the seventh's letter so the stacked thirds and chord identity remain clear."),
      ] },
      { id: "connect-arpeggios", title: "Connect scale and arpeggio shapes", blocks: [
        list("Choose one scale position and play the tonic arpeggio using only notes within it.", "Add the arpeggio from each scale degree. Keep the same neck region and listen to each third and seventh.", "Alternate four scalar notes with four arpeggio notes. Change the rhythm, then reverse direction before reaching the top.", "Over changing chords, finish a line near a tone of the next chord. Practise guide-tone movements before increasing speed."),
        links(["Horizontal and vertical harmonization", "/learn/harmonization"]),
      ] },
      { id: "arpeggio-pairs", title: "Two arpeggios can outline a scale", blocks: [
        p("Amaj7 (A C♯ E G♯) plus Bm7 (B D F♯ A) gives every note of A major. The first supplies tonic chord tones; the second supplies 9, 11 and 13 plus a shared root. Try alternating them over an A pedal and resolve the fourth D deliberately against C♯."),
        p("Do not assume every arpeggio pair fits every chord. First compare the union of its pitches with the desired collection, then consider the sounding voicing and your landing notes."),
      ] },
    ],
  },
  {
    slug: "symmetric-scales", title: "Symmetric scales & contained harmony",
    description: "Understand repeated interval cycles, shared collections and their musical applications.",
    sections: [
      { id: "symmetry", title: "A repeating interval cycle", blocks: [
        p("A symmetric collection returns to the same pitch-class set after a transposition smaller than an octave. This creates repeating shapes and several possible roots. The accompaniment and melodic emphasis can still establish a tonal centre; symmetry does not make a tonic impossible."),
        table(["Collection", "Cyclic steps", "Repeat after", "Distinct transpositions"], [["Whole tone", "W W W W W W", "2 frets", "2"], ["Augmented", "3H H 3H H 3H H", "4 frets", "4"], ["Half-whole diminished", "H W H W H W H W", "3 frets", "3"], ["Whole-half diminished", "W H W H W H W H", "3 frets", "3"]]),
      ] },
      { id: "whole-tone", title: "Whole tone: two augmented triads", blocks: [
        p("A whole tone contains A B C♯ D♯ E♯ G. A+ and B+ together supply that collection. Root, third, raised fifth and minor seventh support an augmented dominant sound, with 9 and ♯11 available. A natural fifth is outside the collection."),
        p("An outside exercise is to play a whole-tone collection over a minor chord briefly, then resolve to that chord's tones. This is intentional tension rather than a claim that the scale contains the minor chord."),
        links(["Whole-tone explorer", "/scales/whole-tone"]),
      ] },
      { id: "augmented", title: "Augmented: two interlocking augmented triads", blocks: [
        p("A augmented combines A+ and G♯+. Its pitch classes can be written A C C♯ E F G♯. Major and minor thirds coexist over A, C♯ and F. Moving a phrase four frets preserves the collection, though it changes the phrase's relationship to the bass."),
        { type: "callout", tone: "fix", title: "Corrected from page 52", text: "Amaj7 and E♭maj7 do not both belong to A augmented. The contained major-seventh chords have roots A, C♯ and F. Nor does every scale degree support both a major and a minor triad." },
        links(["Augmented explorer", "/scales/augmented"]),
      ] },
      { id: "diminished", title: "The two diminished orientations", blocks: [
        p("Half-whole diminished is useful over dominant harmony: from A it contains A B♭ C C♯ D♯ E F♯ G, supplying 1 ♭9 ♯9 3 ♯11 5 13 ♭7. Whole-half diminished from A contains A B C D E♭ F F♯ G♯ and includes A°7 with G♭ respelled as F♯ in the scalar listing."),
        p("Both collections combine two diminished-seventh pitch sets. In half-whole they begin a semitone apart; in whole-half, a whole tone apart. Starting A half-whole on B♭ gives B♭ whole-half. Each collection repeats every three frets."),
        links(["Half-whole diminished", "/scales/diminished-half-whole"], ["Whole-half diminished", "/scales/diminished-whole-half"]),
      ] },
      { id: "contained-chords", title: "Containment and application are different questions", blocks: [
        p("A contained chord uses only pitches in the collection. An application may use deliberate tensions or omit defining chord tones. For a five-, six- or eight-note scale, check candidate chord formulas against its pitch-class set instead of assuming that every other scale note produces conventional tertian harmony."),
        p("The same distinction explains the book's pentatonic harmonic tables. Kumoi inherits possible harmony from Dorian, Pelog from Phrygian and Hirajoshi from Aeolian; a missing seventh in the pentatonic does not establish the quality of an accompanying seventh chord."),
      ] },
    ],
  },
  {
    slug: "harmonization", title: "Horizontal & vertical harmonization",
    description: "Unite scale degrees, chord shapes and arpeggios across the whole neck.",
    sections: [
      { id: "harmonic-formula", title: "Build the harmonic formula", blocks: [
        p("For a seven-note scale, take degrees 1–3–5 for each triad and 1–3–5–7 for each seventh, cycling through the scale's actual notes. A major gives Amaj7 Bm7 C♯m7 Dmaj7 E7 F♯m7 G♯m7♭5. Harmonic minor changes the third-degree chord to augmented major 7 and gives a dominant on V and a diminished seventh on VII."),
        p("In melodic minor the seventh-chord sequence is minor-major 7, minor 7, augmented major 7, dominant 7, dominant 7, half-diminished, half-diminished. The interactive workbench computes the spelled notes and isolates any selected degree."),
        links(["Harmonization workbench", "/harmonization"]),
      ] },
      { id: "horizontal", title: "Horizontal: keep a shape, move its root", blocks: [
        p("Choose a scale and one book arpeggio position. Move that position along its reference root string to outline every diatonic chord. For G major, move through Gmaj7 Am7 Bm7 Cmaj7 D7 Em7 F♯m7♭5. The chord quality changes with each degree even when the position family stays fixed."),
        list("Use book arpeggio boxes 1 and 2 with reference roots on string 6.", "Repeat with boxes 3 and 4, using roots on string 4.", "Repeat with boxes 5, 6 and 7, using roots on string 5.", "Do the same with triads, root-position grips, drop 2 and drop 3; keep the required string set fixed."),
      ] },
      { id: "vertical", title: "Vertical: keep a neck region, change shapes", blocks: [
        p("Choose a single scale box, then find every diatonic arpeggio within that region. Your hand stays near the same frets while the chord root and arpeggio shape change. The workbench's position window demonstrates this constraint; the atlas gives the book's exact box geometry."),
        p("The page 94 G-Ionian box-1 example pairs scale degrees with arpeggio boxes 2, 1, 7, 6, 5, 4, 3. This is a particular shape relationship, not a universal formula for every family. The A-harmonic-minor example on the same page uses a different mapping, especially for G♯ diminished."),
        tip("Name the chord before playing", "Say the root, quality and formula, then locate its third and seventh. Visualization should let you hear and understand the chord, not only run an exercise by finger memory."),
      ] },
      { id: "routine", title: "A complete harmonization routine", blocks: [
        list("Pick one major, harmonic-minor or melodic-minor root each day.", "Write its notes and diatonic triads/sevenths before checking the computed table.", "Play the chords and arpeggios horizontally, then vertically in every source box.", "Improvise a phrase with one arpeggio, then add its neighbouring scale tones.", "Use quarter notes and eighth notes at first; vary the landing tone and connect the nearest tone of the following chord."),
        links(["Practice session", "/practice"], ["Arpeggios", "/arpeggios"]),
      ] },
    ],
  },
  {
    slug: "improvisation", title: "Improvisation & scale choices",
    description: "Choose notes from the harmony, highlight modal colour and turn exercises into phrases.",
    sections: [
      { id: "approaches", title: "Horizontal, vertical and hybrid approaches", blocks: [
        p("A horizontal approach uses a shared parent collection across a progression. Over Bm–D–E–A, A major supplies chord tones for all four triads; emphasize each chord's tones as it arrives. A vertical approach chooses a collection for each chord, possibly introducing a different parent key. A hybrid keeps the shared scale for some chords and uses a local change for others."),
        p("Choose according to harmonic rhythm, tempo, melody and style. Fast changes often benefit from a compact shared collection and clear targets. Longer chords give more room to introduce a new colour and resolve it. A mode is heard through its centre and emphasized intervals, not just the first note of a fingering."),
      ] },
      { id: "characteristic-notes", title: "Target the characteristic notes", blocks: [
        table(["Mode", "Characteristic colour", "Example on A"], [["Dorian", "6", "F♯"], ["Phrygian", "♭2", "B♭"], ["Lydian", "♯4", "D♯"], ["Mixolydian", "♭7", "G"], ["Locrian", "♭5 (also ♭2)", "E♭ and B♭"]]),
        p("The book uses Ionian and Aeolian as comparison baselines. For the other two families, preserve the related mode's colour and bring out the changed degree: Dorian ♯4 has 6 and ♯4; Lydian ♯2 has ♯4 and ♯2; Dorian ♭2 has 6 and ♭2. The mode explorer lists these relationships for every heptatonic mode."),
        tip("Colour still needs context", "A characteristic tone may be a tension against the current chord. Balance duration, register and resolution. A fourth over a major third is an expressive dissonance, not a forbidden note; melodic minor also has context-dependent tensions."),
      ] },
      { id: "scale-choices", title: "Choose scales by chord quality and extensions", blocks: [
        p("The book's seven-row scale-choice table covers major 7, dominant 7, minor-major 7, minor 7, augmented major 7, half-diminished and diminished 7. The application tool includes those choices, their notes and their relationship to the chord, with a distinction between contained chord tones and deliberate tension."),
        p("A chord symbol is a starting point. Listen for extensions played by the band: a Bm chord with G in the accompaniment supports a different sixth colour from B Dorian's G♯. A dominant's destination matters too: Mixolydian is a starting point for V–I in major; Phrygian dominant fits V–i with ♭9/♭13; Lydian dominant is common on a tritone substitute."),
        p("A ♭9/♭13 dominant does not uniquely specify one scale. Both Phrygian dominant and altered contain those tensions; their natural fifth/fourth versus ♯11/♯9 distinguish the sounds. Select the collection that fits the melody and voicing."),
        links(["Scale-choice workbench", "/improvisation"]),
      ] },
      { id: "pentatonic-phrasing", title: "Minor pentatonic over dominant harmony", blocks: [
        p("G7 contains G B D F; G minor pentatonic contains G B♭ C D F. The B♭–B clash is the familiar minor-to-major-third blues tension. Approach or bend the minor third toward the chord's major third and listen to how the style handles that inflection."),
        p("Learn a short phrase, change its rhythm and make an answer phrase. Blend minor pentatonic with Dorian or Aeolian by introducing one added note at a time, rather than running every available scale consecutively."),
      ] },
      { id: "chromatic-approaches", title: "Chromatic approaches and enclosures", blocks: [
        p("Choose a chord-tone target and approach from a semitone below, a semitone above, or an enclosure. On string 2, fret 5 is E. Try frets 4–5, 6–5, 7–6–5, 3–4–5, 7–6–4–5 or 3–4–6–5. Place E on a chosen strong beat and keep the lead-in rhythm even."),
        p("Chromatic notes work through voice leading and timing; they need not all belong to one parent scale. Practise a single target first, then lead into the third or seventh of the next chord."),
      ] },
      { id: "musical-practice", title: "Make the material musical", blocks: [
        list("Start inside one box with one scale, then one arpeggio, then both.", "Add another arpeggio while keeping rhythm simple. Listen to each chord change.", "Use rests, dynamics, articulation and a repeated motif. Increase tension and then resolve it deliberately.", "Join neighbouring boxes before improvising across the entire neck.", "Record a short take. Judge timing, tone, direction and phrasing as well as note choices. Borrow phrasing ideas from singers and other instruments."),
        links(["Pentatonic substitutions", "/learn/pentatonic-substitutions"], ["Practice session", "/practice"]),
      ] },
    ],
  },
  {
    slug: "pentatonic-substitutions", title: "Modal sounds with pentatonics",
    description: "Use familiar five-note shapes to emphasize new modal and altered-dominant colours.",
    sections: [
      { id: "parent-pentatonics", title: "Three minor pentatonics inside major", blocks: [
        p("A major contains B minor pentatonic (B D E F♯ A), C♯ minor pentatonic (C♯ E F♯ G♯ B) and F♯ minor pentatonic (F♯ A B C♯ E). Their roots are degrees ii, iii and vi of the parent major scale. Each pentatonic is a subset; none alone necessarily defines the full parent mode."),
        p("Transpose the same idea to any parent major scale, then select the subset containing the characteristic tone of the intended mode. The application workbench computes the notes relative to your selected chord root."),
      ] },
      { id: "modal-recipes", title: "Five modal recipes", blocks: [
        table(["Desired sound", "Minor pentatonic root relative to chord", "A-root example", "Characteristic tone"], [["Dorian", "Whole step above", "B minor pentatonic over Am7", "F♯ = 6"], ["Phrygian", "Whole step below", "G minor pentatonic over Am7", "B♭ = ♭2"], ["Lydian", "Half step below", "G♯ minor pentatonic over Amaj7", "D♯ = ♯4"], ["Mixolydian", "Perfect fifth above", "E minor pentatonic over A7", "G = ♭7"], ["Locrian", "Minor third above", "C minor pentatonic over Am7♭5", "E♭ = ♭5"]]),
        p("Keep the chord root audible in a drone or accompaniment. For example, B minor pentatonic over Am7 supplies 9, 11, 5, 13 and root, without the chord's minor third. The accompaniment establishes A minor while F♯ adds Dorian colour."),
        links(["Transpose these recipes", "/improvisation?tab=pentatonics"]),
      ] },
      { id: "altered-pentatonics", title: "Pentatonics over an altered dominant", blocks: [
        p("Over G7, B♭ minor pentatonic gives B♭ D♭ E♭ F A♭: ♯9 ♯11 ♭13 ♭7 ♭9 after dominant respelling. It contains neither root nor major third, so the accompaniment and resolution establish the dominant."),
        { type: "callout", tone: "fix", title: "Corrected interval labels from page 102", text: "These substitutions contain a minor seventh, not a major seventh. F minor pentatonic over G7 gives F A♭ B♭ C E♭: ♭7 ♭9 ♯9 11 ♭13. C is the fourth/eleventh above G, not the fifth." },
        p("F Aeolian over G adds G and D♭, giving ♭7, root, ♭9, ♯9, 11, ♯11 and ♭13. This collection includes a natural fourth and differs from G altered. Resolve it deliberately rather than treating all three choices as equivalent names for one scale."),
      ] },
      { id: "pentatonic-routine", title: "Practise one substitution at a time", blocks: [
        list("Loop one chord and state its chord tones before playing the substituted pentatonic.", "Locate the characteristic note relative to the chord root and sustain it briefly.", "Make a two-bar phrase that lands on a chord tone. Compare it with the ordinary root pentatonic.", "Transpose by the circle of fifths. Keep the relationship to the chord constant as the absolute notes change."),
      ] },
    ],
  },
];
