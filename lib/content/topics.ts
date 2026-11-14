import type { Topic } from "./types.ts";
import { BOOK_TOPICS } from "./book-topics.ts";

/*
 * The prose of Guitar.docx, reorganised into study topics. Order inside each
 * topic follows the doc; sections that were scattered (e.g. intervals) are
 * gathered in one place. Widgets mark where a diagram is generated.
 */

export const TOPICS: Topic[] = [
  ...BOOK_TOPICS,
  /* ---------------------------------------------------------------- 1 */
  {
    slug: "sound-and-pitch",
    title: "Sound & pitch",
    description: "What sound, frequency, pitch, notes and timbre are.",
    sections: [
      {
        id: "sound",
        title: "Sound and frequency",
        blocks: [
          { type: "term", term: "Sound", text: "Mechanical pressure waves that pass through a physical medium such as air or water. Sound has distinct features: frequency, speed, loudness, duration and so on." },
          { type: "term", term: "Frequency", text: "The number of times per second a sound pressure wave repeats itself, measured in hertz (Hz). One hertz is one pressure wave per second. More waves per second means a higher frequency, and vice versa." },
          { type: "term", term: "Pitch", text: "How high or low a sound is perceived to be. Pitch depends mainly on frequency: a guitar string vibrating faster usually produces a higher pitch. A musical sound can contain many frequencies while still having one perceived pitch." },
        ],
      },
      {
        id: "note",
        title: "Notes",
        blocks: [
          { type: "term", term: "Note", text: "A specified, precise pitch with a certain length, loudness and quality. Notes are labelled with the letters A to G." },
          { type: "p", text: "This app uses 12-tone equal temperament: 12 equally spaced pitch classes per octave. A pitch class such as C includes C3, C4 and every other C register; these are different pitches. Other tuning systems can divide the octave differently. Here is one octave from C; after B comes the next C:" },
          { type: "p", text: "C – C♯/D♭ – D – D♯/E♭ – E – F – F♯/G♭ – G – G♯/A♭ – A – A♯/B♭ – B" },
          { type: "widget", name: "note-circle" },
        ],
      },
      {
        id: "timbre",
        title: "Timbre",
        blocks: [
          { type: "term", term: "Timbre", text: "The colour or quality of a sound produced by different instruments. When two sounds of the same note sound different, they have different timbres. A C played on a piano is the same note as a C played on a violin, but we hear it differently because of timbre." },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 2 */
  {
    slug: "notes",
    title: "Notes, accidentals & octaves",
    description: "Natural notes, sharps and flats, enharmonics and octave registers.",
    sections: [
      {
        id: "natural-notes",
        title: "Natural notes",
        blocks: [
          { type: "p", text: "Natural notes use the letters A–G without accidentals and correspond to the white piano keys. Black keys have sharp and flat names, but white keys can have altered spellings too: E♯ sounds like F, B♯ like C, F♭ like E and C♭ like B in equal temperament." },
          { type: "widget", name: "keyboard-enharmonics" },
        ],
      },
      {
        id: "accidentals",
        title: "Sharps, flats and naturals",
        blocks: [
          {
            type: "list",
            items: [
              "The sharp sign ♯ raises a note's pitch by a half step.",
              "The flat sign ♭ lowers a note's pitch by a half step.",
              "The natural sign ♮ shows a note is neither sharp nor flat. On a staff it cancels a sharp or flat applied earlier to that note.",
            ],
          },
        ],
      },
      {
        id: "enharmonics",
        title: "Enharmonic equivalents",
        blocks: [
          { type: "p", text: "In 12-tone equal temperament, enharmonic equivalents are differently spelled notes at the same pitch: the same piano key. C♯ and D♭ are enharmonics; so are E and F♭, and B and C♭. Their tuning can differ in other tuning systems." },
          { type: "callout", tone: "tip", text: "Spelling matters even though the sound is the same: interval names depend on the letters. C to E♭ is a minor 3rd, but C to D♯ is an augmented 2nd." },
        ],
      },
      {
        id: "octave",
        title: "Octaves",
        blocks: [
          { type: "p", text: "An octave separates two pitches of the same pitch class in adjacent registers. Going up one octave doubles the frequency; going down halves it. C4 and C5 are an octave apart, rather than the same pitch." },
          { type: "p", text: "A full-size piano marks the C in each of eight octave registers. Middle C is C4; the A above it, A4, is the 440 Hz tuning reference." },
          { type: "widget", name: "keyboard-octaves" },
          { type: "p", text: "A single scale can be played at many pitch levels. A C major scale can start at C4 (middle C) and ascend an octave to C5, or start at C6 and ascend to C7." },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 3 */
  {
    slug: "rhythm",
    title: "Rhythm & note values",
    description: "Pulse, measures, time signatures, note lengths, rests and dots.",
    sections: [
      {
        id: "pulse",
        title: "Pulse, tempo and measures",
        blocks: [
          { type: "p", text: "A regular pulse (beat) is fundamental to music. It sets the tempo: how fast or slow the music is played. The pulse is usually divided into groups of beats, and each group is called a measure (bar)." },
        ],
      },
      {
        id: "meter",
        title: "Meter and time signatures",
        blocks: [
          { type: "p", text: "When beats are grouped into measures, the pulse is said to be in meter. Meter is shown by a time signature: two numbers, one above the other, at the start of the first line of music." },
          {
            type: "facts",
            items: [
              { label: "Top number", value: "How many written note units fill a measure" },
              { label: "Bottom number", value: "Which note value is the written unit: 4 = quarter, 8 = eighth, 2 = half" },
            ],
          },
          { type: "p", text: "In simple meter, each main beat divides into two: 4/4 normally has four quarter-note beats, and 2/2 has two half-note beats. In compound meter, each main beat divides into three. A 6/8 measure contains six eighth notes, normally grouped as two dotted-quarter beats; 9/8 has three such beats and 12/8 has four." },
          { type: "p", text: "The beat unit determines the beat count: a whole note lasts four quarter-note beats in 4/4, but two half-note beats in 2/2. The note-value table below uses quarter-note beats in 4/4 throughout." },
        ],
      },
      {
        id: "note-values",
        title: "Note values and rests",
        blocks: [
          { type: "p", text: "Notes are the building blocks of music. A note's length (duration) is measured in beats. Rests indicate silence, just as notes indicate sound, and like notes they can last any number of beats." },
          {
            type: "list",
            items: [
              "Whole notes last four beats: a whole measure in 4/4. The symbol is an open note head.",
              "Half notes last half as long: two beats in 4/4. An open note head with a vertical line called a stem.",
              "Quarter notes last a quarter of a whole note: one beat. A closed note head with a stem.",
            ],
          },
          { type: "widget", name: "note-durations" },
        ],
      },
      {
        id: "dotted-notes",
        title: "Dotted notes",
        blocks: [
          { type: "p", text: "A dot after a note changes its duration: the dot adds half of the note's value to itself. A dotted half note gets 3 beats: a half note is 2, half of 2 is 1, so 2 + 1 = 3." },
          { type: "p", text: "Dots apply to rests too: in quarter-note beats a dotted whole rest lasts 6, a dotted half rest 3, a dotted quarter rest 1½ and a dotted eighth rest ¾. A whole-measure rest can instead denote a complete bar in its meter; read the notation in context." },
        ],
      },
      {
        id: "triplets-and-ties", title: "Triplets and tied notes", blocks: [
          { type: "p", text: "A triplet fits three equal notes into the time normally occupied by two of that written value. In 4/4, three eighth-note triplets fit one quarter-note beat; three sixteenth-note triplets fit half a beat. Count evenly as 1-trip-let, 2-trip-let. Compound meter's ordinary three-part beat division is distinct from inserting a triplet into a simple beat." },
          { type: "p", text: "A tie joins notes at the same pitch. Attack only the first and sustain for their combined written duration, including across bar lines. In 4/4, a quarter tied to an eighth lasts 1½ quarter-note beats. A slur connects a phrase or articulation and can join different pitches; it is not a duration sum." },
          { type: "links", items: [{ label: "Practise rhythm with the metronome", href: "/practice" }] },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 4 */
  {
    slug: "intervals",
    title: "Steps & intervals",
    description: "Half and whole steps, every interval from the root, qualities and direction.",
    sections: [
      {
        id: "steps",
        title: "Half steps and whole steps",
        blocks: [
          { type: "term", term: "Half step (semitone)", text: "The very next note: F is a half step above E. On a keyboard, keys next to each other with no key in between, white or black, are a half step apart. On guitar, one fret." },
          { type: "term", term: "Whole step (tone)", text: "Two half steps: E – F – F♯, so F♯ is a whole step above E. On a keyboard two keys a whole step apart have one key between them. On guitar, two frets." },
          { type: "widget", name: "step-keyboards" },
        ],
      },
      {
        id: "what-is-an-interval",
        title: "What an interval is",
        blocks: [
          { type: "p", text: "An interval is the distance between two pitches. Its number follows the letter names, and its quality describes its size in semitones. Qualities include perfect, major, minor, augmented and diminished. Enharmonically equivalent intervals can sound alike in equal temperament while having different names." },
          { type: "p", text: "To list them, first choose a root: the starting note and harmonic centre of whatever chord or scale you are using. Here it is C, but you can pick any root." },
        ],
      },
      {
        id: "intervals-from-root",
        title: "Every interval from the root",
        blocks: [
          { type: "widget", name: "interval-table" },
          {
            type: "list",
            items: [
              "Perfect unison: the root to itself, the same note played twice.",
              "Unisons, fourths, fifths and octaves belong to the perfect family; seconds, thirds, sixths and sevenths belong to the major/minor family. Either family can also have augmented or diminished qualities.",
              "A tritone spans six semitones and can be spelled as an augmented fourth or diminished fifth. Inversion preserves its six-semitone size but swaps its spelled quality: A4 becomes d5 and d5 becomes A4. Its tension is widely used in tonal harmony, blues and jazz.",
              "The table gives common spellings for semitone distances from unison to octave. It is not an exhaustive list of spelled intervals: C–D♯ is A2, while C–E♭ is m3 at the same semitone distance.",
            ],
          },
          {
            type: "callout",
            tone: "fix",
            title: "Corrected: spelling",
            text: "Your list wrote minor intervals with sharps (C to C♯, D♯, G♯, A♯). Because interval names follow the letters, they are spelled D♭, E♭, A♭ and B♭ here. C to D♯ would be an augmented 2nd.",
          },
        ],
      },
      {
        id: "compound",
        title: "Intervals above the octave",
        blocks: [
          { type: "p", text: "Intervals above an octave are named by adding 7 to the name in the first octave. A major 2nd an octave higher becomes a major 9th; a minor 6th becomes a minor 13th." },
        ],
      },
      {
        id: "direction",
        title: "Direction: ascending, descending and harmonic",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Ascending: a lower note going to a higher note (C to D♯).",
              "Descending: a higher note going to a lower note (B to A♭).",
              "Harmonic: two or more notes played at the same time.",
              "Unison: the same note played twice.",
            ],
          },
          { type: "p", text: "From A to C there are two answers. If C is higher than A, the interval is ascending: C is a minor 3rd up from A. If C is lower than A, it is descending: C is a major 6th down from A." },
          {
            type: "facts",
            items: [
              { label: "A → C ascending", value: "minor 3rd" },
              { label: "A → C descending", value: "major 6th" },
            ],
          },
          { type: "p", text: "Unless told otherwise, treat the lower note as the root and count clockwise around the note circle from it." },
        ],
      },
      {
        id: "chromatic-diatonic",
        title: "Chromatic and diatonic intervals",
        blocks: [
          { type: "p", text: "All the intervals above form the group of chromatic intervals: every interval between the notes of today's 12-tone system, just as the chromatic scale is the set of all 12 notes." },
          { type: "p", text: "Intervals from a major tonic to its scale degrees are perfect or major: from C they are C–C, C–D, C–E, C–F, C–G, C–A and C–B. This does not describe every interval within a diatonic scale. E–F is a minor second, E–G a minor third, and F–B an augmented fourth, all within C major. The table's major-scale column means membership relative to the selected root." },
        ],
      },
      {
        id: "qualities",
        title: "Augmented and diminished",
        blocks: [
          {
            type: "table",
            columns: ["Quality", "Symbol", "Size"],
            rows: [
              ["Augmented", "A or +", "A half step larger than perfect or major"],
              ["Major", "M (ma)", "—"],
              ["Perfect", "P", "—"],
              ["Minor", "m (mi)", "A half step smaller than major"],
              ["Diminished", "d or °", "A half step smaller than perfect or minor"],
            ],
          },
          { type: "p", text: "Augmented: F and C form a perfect 5th (C is in the key of F major). Raise the top note a half step to C♯ and the interval grows by a half step: F to C♯ is an augmented 5th (A5 or +5). G to E is a major 6th (E is in G major); raise E to E♯ and it becomes an augmented 6th (A6 or +6)." },
          { type: "audio", href: "https://musescore.com/user/32728834/scores/8418677", label: "Optional augmented-interval score on MuseScore" },
          { type: "p", text: "Diminished: lower the top of the perfect 5th F–C to C♭ and it becomes a diminished 5th (d5 or °5, also the tritone). G–E, a major 6th, becomes a minor 6th when E drops to E♭, then a diminished 6th when it drops again to E𝄫. Shrinking by a half step turns perfect and minor intervals into diminished ones, but turns major intervals into minor ones." },
          { type: "p", text: "It is not always the top note that moves. F–C also becomes diminished when the bottom note rises to F♯. G–E becomes a minor 6th when G rises to G♯, and diminished when G♯ rises to G𝄪." },
          { type: "audio", href: "https://musescore.com/user/32728834/scores/6836745", label: "Optional diminished-interval score on MuseScore" },
          {
            type: "figure",
            src: "/notes/augmented-diminished.png",
            alt: "Staff examples: F to C sharp augmented, F to C perfect, F to C flat diminished; G to E sharp augmented, G to E major, G to E flat minor, G to E double flat diminished",
            caption: "Expanding and contracting a perfect 5th and a major 6th.",
            width: 1470,
            height: 427,
          },
        ],
      },
      {
        id: "doubly-augmented",
        title: "Doubly and triply augmented or diminished",
        blocks: [
          { type: "p", text: "Intervals can be stretched further. A half step larger than augmented is doubly augmented; a half step larger again is triply augmented. Likewise a half step smaller than diminished is doubly diminished, and smaller again triply diminished." },
        ],
      },
      {
        id: "on-guitar",
        title: "Intervals on the guitar",
        blocks: [
          { type: "p", text: "Every note in a scale has an interval to every other, but what matters most is each note's distance from the root, the \"home\" note. In C major:" },
          { type: "widget", name: "interval-on-guitar" },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 5 */
  {
    slug: "scales",
    title: "What a scale is",
    description: "Scales, harmony, melody, root notes and the families of scales.",
    sections: [
      {
        id: "definition",
        title: "Scales",
        blocks: [
          { type: "term", term: "Scale", text: "Any set of musical notes ordered by fundamental frequency or pitch. Ordered by rising pitch it is an ascending scale; by falling pitch, a descending scale." },
          { type: "p", text: "Scales are abstract: they don't depend on any particular expression. They sit in the background, at a more general level than the actual notes of a song." },
        ],
      },
      {
        id: "harmony-melody",
        title: "Harmony, melody and the root",
        blocks: [
          { type: "term", term: "Harmony", text: "The process of joining individual sounds into whole units or compositions. Often it means frequencies, pitches or chords sounding at the same time." },
          { type: "term", term: "Melody", text: "A succession of pitches and rhythms heard as a musical line. Melodies can build and release tension through contour, rhythm, repetition and their relationship to the harmony; they need not follow one emotional or compositional rule." },
          { type: "term", term: "Root note", text: "The first note in the name of a chord or scale. In D minor 6th, D is the root and the rest of the chord is defined relative to it. In G♯ major, G♯ is the root and every other scale note is defined from it." },
        ],
      },
      {
        id: "sizes",
        title: "Scales by number of notes",
        blocks: [
          { type: "p", text: "Scales can be described by how many different pitch classes they contain:" },
          { type: "widget", name: "scale-sizes" },
        ],
      },
      {
        id: "families",
        title: "Types of scale",
        blocks: [
          { type: "p", text: "Within this app's 12-tone system, the chromatic collection contains every available pitch class. Other scales select from it. This describes one tuning framework rather than all the scales used in world music." },
          {
            type: "list",
            items: [
              "5-note scales: pentatonic (\"5 per octave\"). Many note patterns can form a pentatonic scale, but one in particular, defining both the major and minor pentatonic, is by far the most used.",
              "7-note scales: the most basic are the diatonic scales. The major scale (do-re-mi) and the natural minor are both 7-note diatonic scales. Minor scales tend to sound melancholy and introspective; major scales joyous and bright.",
              "The harmonic minor and melodic minor are two further 7-note scales used in classical, neoclassical, advanced rock and jazz.",
              "A few specific 8-note jazz scales also exist: the bebop scales.",
            ],
          },
          { type: "p", text: "Scales can be constructed by adding or altering pitches. A mode is instead a reorientation of a collection around a different tonal centre; calculating its rotation does not require adding new pitches." },
        ],
      },
      {
        id: "double-note",
        title: "The double note system",
        blocks: [
          { type: "p", text: "The Double Note system uses three notes per string and repeats the same sounding pitch at the end of string 3 (G) and the start of string 2 (B). The repeat helps align patterns on string pairs 6–5, 4–3 and 2–1. It is not two different degrees that happen to share a fret." },
          { type: "widget", name: "double-note" },
          { type: "links", items: [{ label: "Learn the complete fretboard system", href: "/learn/fretboard-system" }] },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 6 */
  {
    slug: "modes",
    title: "What a mode is",
    description: "Modes as re-oriented scales, the word diatonic, and finding any mode's notes.",
    sections: [
      {
        id: "what-is-a-mode",
        title: "What is a mode?",
        blocks: [
          { type: "p", text: "Take A minor pentatonic (A, C, D, E, G). Its five notes, oriented around A, form the set of intervals that defines the scale. Now regard the same notes as a C scale, with C as the root." },
          { type: "p", text: "The notes get new names. C is no longer the minor 3rd of A but the root; D is no longer the perfect 4th of A but the major 2nd of C; E becomes the major 3rd, G the perfect 5th and A the major 6th: R, M2, M3, P5, M6." },
          { type: "p", text: "The pitch collection stays the same, but the intervals measured from the new centre change. This is a relative mode of the collection. Merely playing the first note differently does not establish a mode: melody, bass, accompaniment and points of rest help make the intended tonic sound like home." },
          { type: "p", text: "For a seven-note example, play D E F G A B C over a sustained D or Dm chord and resolve phrases to D to hear D Dorian. The same notes over C-centred harmony can still sound like C major, even if the melody begins on D." },
        ],
      },
      {
        id: "diatonic",
        title: "What \"diatonic\" means",
        blocks: [
          { type: "p", text: "A diatonic scale is a mode, or variant, of the major scale: the natural minor and all seven diatonic modes are included." },
          { type: "p", text: "The name comes from how evenly diatonic scales spread 7 notes over the 12-note octave. There is never more than a whole step between two notes, and half steps are always separated by at least two whole steps." },
        ],
      },
      {
        id: "parent-scale",
        title: "The parent major scale",
        blocks: [
          { type: "p", text: "Think of modes in parallel (as different scales), but always know their relative scale: the parent major scale (PMS) of each mode in any key. Count half steps from the parent's root:" },
          {
            type: "table",
            columns: ["Mode", "Above the parent root", "Below the octave"],
            rows: [
              ["Ionian", "0 half steps", "—"],
              ["Dorian", "2 half steps (1 whole step)", "10 half steps"],
              ["Phrygian", "4 half steps (2 whole steps)", "8 half steps"],
              ["Lydian", "5 half steps", "7 half steps"],
              ["Mixolydian", "7 half steps", "5 half steps"],
              ["Aeolian", "9 half steps", "3 half steps"],
              ["Locrian", "11 half steps", "1 half step"],
            ],
          },
          { type: "p", text: "So for any Dorian, count two half steps back: the parent of D♯ Dorian is C♯ major." },
        ],
      },
      {
        id: "find-notes",
        title: "Find the notes of any mode",
        blocks: [
          { type: "p", text: "You can use the melodic or intervallic formula, but this is faster. First, know the circle of fifths by heart: recall every major and minor key signature instantly. Then:" },
          {
            type: "list",
            ordered: true,
            items: [
              "Identify the family, and the mode's position in it.",
              "Relate the mode to its parent scale using the parent's intervallic formula.",
            ],
          },
          { type: "p", text: "A Dorian: Dorian is the 2nd mode of the major family. The parent (Ionian) formula is 1 2 3 4 5 6 7 and its 2nd is a major 2nd, so go a major 2nd back from A: G. G Ionian has one sharp, F♯, so A Dorian is A B C D E F♯ G." },
          { type: "p", text: "B♭ Mixolydian: the 5th mode of the major family. Ionian has a perfect 5th, so go a perfect 5th back from B♭: E♭. E♭ major's signature is B♭, E♭, A♭, so B♭ Mixolydian is B♭ C D E♭ F G A♭." },
          { type: "widget", name: "mode-parent-finder" },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 7 */
  {
    slug: "chords",
    title: "Chords & scale degrees",
    description: "What a chord is, the scale degrees, chord symbols and chords as numbers.",
    sections: [
      {
        id: "what-is-a-chord",
        title: "What is a chord?",
        blocks: [
          { type: "p", text: "A chord combines pitches into a harmonic unit, often three or more pitch classes. Two-note combinations are called dyads; a guitar power chord is a common two-pitch-class chord. Chords can be related to scales, but are also used chromatically or voiced as arpeggios rather than sounded simultaneously." },
          { type: "p", text: "Like scales, chords are defined by a set of intervals from the root. A chord's name tells you its root (any of the 12 notes) and which intervals it is built from." },
        ],
      },
      {
        id: "scale-degrees",
        title: "The scale degrees",
        blocks: [
          { type: "widget", name: "scale-degrees" },
          {
            type: "callout",
            tone: "fix",
            title: "Corrected: degree symbols and the VII chord",
            text: "Your notes wrote every degree with a ° (I°, II° …), but ° means diminished, so the numerals are plain here. And the chord on VII in a major key is half-diminished (m7♭5, ø), not a \"major 7th ♭5\".",
          },
        ],
      },
      {
        id: "extensions",
        title: "Degree names above the octave",
        blocks: [
          {
            type: "table",
            columns: ["Degree", "Alternative name"],
            rows: [
              ["I", "1st"],
              ["II", "9th"],
              ["III", "3rd"],
              ["IV", "11th"],
              ["V", "5th"],
              ["VI", "13th"],
              ["VII", "7th"],
              ["VIII", "Tonic (octave)"],
            ],
          },
          { type: "p", text: "There are no \"10th\" or \"12th\" chords: the 10th is the 3rd (E in C) and the 12th is the 5th (G)." },
        ],
      },
      {
        id: "symbols",
        title: "Chord symbols",
        blocks: [
          {
            type: "table",
            columns: ["Symbol", "Meaning"],
            rows: [
              ["+", "Augmented, or raised 5th"],
              ["°", "Diminished"],
              ["♯", "Sharp, or raised"],
              ["♭", "Flat, or lowered"],
              ["|", "Separates measures (bars) in a progression"],
              ["m", "Chord with a minor 3rd"],
              ["maj7", "Chord with a major 7th"],
              ["7", "Chord with a flat (minor) 7th"],
              ["m7", "Chord with a minor 3rd and a flat 7th"],
              ["mMaj7", "Chord with a minor 3rd and a major 7th"],
              ["ø", "Half-diminished: minor 3rd, flat 5th, flat 7th (m7♭5)"],
              ["IIm7", "The ii chord as a minor 7th (Dm7 in the key of C)"],
            ],
          },
        ],
      },
      {
        id: "numbers",
        title: "Music by the numbers",
        blocks: [
          { type: "p", text: "Numbers name every note relative to the key, so a chord formula like 1 ♭3 5 ♭7 works in any key. In the key of C they translate like this; pick another key to translate." },
          { type: "widget", name: "numbers-to-notes" },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 8 */
  {
    slug: "harmony",
    title: "Harmony & substitutions",
    description: "Diatonic harmony, secondary and substitute dominants, tritone subs and altered dominants.",
    sections: [
      {
        id: "harmony",
        title: "Harmony",
        blocks: [
          { type: "p", text: "Harmony is the vertical relation between sounds: notes occurring at the same time. The harmony of a scale or song means its chords. Each scale has specific notes, and from them we build the chords that belong to it." },
          { type: "p", text: "A degree is a note's position in the scale relative to the root. Each scale degree is written as a Roman numeral and has its own name." },
          {
            type: "table",
            columns: ["Degree", "I", "II", "III", "IV", "V", "VI", "VII"],
            rows: [["Name in major", "Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading tone"]],
            firstColumnHeader: true,
          },
          { type: "p", text: "A leading tone is a semitone below the tonic. When degree 7 lies a whole tone below it, as in natural minor or Mixolydian, it is called the subtonic." },
          { type: "p", text: "One way to call chords while a band is playing is by number: shout \"Four!\" or hold up 4 fingers for the IV chord, 5 for V, 1 for I. In C: I = C, II = D (Dm), III = E (Em), IV = F, V = G (G7)." },
        ],
      },
      {
        id: "secondary-dominants",
        title: "Secondary dominants",
        blocks: [
          { type: "p", text: "A secondary or applied dominant is the dominant of a temporary tonic other than the home tonic. It may be a major triad or a dominant seventh, and can introduce chromatic notes. For example, A7–Dm in C major briefly treats D minor as tonic: A7 is V7/ii." },
          { type: "p", text: "Build the dominant a perfect fifth above its intended destination, using the destination's major or minor harmony. The notation V/ii or V7/ii identifies the target and whether a seventh is included. This relationship is not exclusive to harmonic minor." },
          { type: "widget", name: "secondary-dominants" },
          { type: "p", text: "The table shows the conventional major-key targets ii, iii, IV, V and vi: five secondary dominants. V7/I is the primary dominant. The diminished vii° chord is not normally tonicized because it is not a stable major or minor tonic; the table leaves it empty for that reason." },
        ],
      },
      {
        id: "substitute-dominants",
        title: "Substitute dominants",
        blocks: [
          { type: "p", text: "A tritone substitute dominant replaces a dominant seventh with another dominant seventh a tritone away. In the usual resolution, its root lies a semitone above the destination. The substitute's root may be diatonic or chromatic to the home key." },
          { type: "widget", name: "substitute-dominants" },
          { type: "p", text: "The table includes the tonic and all five conventional secondary-dominant targets. In C major, F7 can replace B7 before Em: F7 and B7 share the guide-tone pitches A and E♭/D♯. A diatonic substitute root does not invalidate that relationship. As above, vii° is excluded as an ordinary tonic target." },
        ],
      },
      {
        id: "tritone-substitution",
        title: "Tritone substitution",
        blocks: [
          { type: "p", text: "Replace a dominant 7th chord with another whose root is three whole steps (a tritone) away. One of the most common substitutions in jazz, and a great way to add tension." },
          { type: "p", text: "It works because the two chords share their two most important notes, the 3rd and the 7th, swapped. G7's 3rd is B and 7th is F; its tritone sub D♭7 has 3rd F and 7th C♭ (= B)." },
          { type: "widget", name: "tritone-substitution" },
        ],
      },
      {
        id: "altered-dominants",
        title: "Altered dominants",
        blocks: [
          { type: "p", text: "Altered dominants are dominant chords with altered ninths and/or fifths. In equal temperament, ♭5 and ♯11 share a pitch class, as do ♯5 and ♭13, but their spellings and harmonic roles can differ. Scale choices depend on the chord, melody and resolution." },
          { type: "p", text: "Explicit symbols such as C7(♯9, ♭13) specify particular tensions. The common jazz symbol C7alt points to an altered-dominant sound with C, E and B♭ as the basic chord tones and altered tensions selected from D♭, D♯/E♭, F♯/G♭ and A♭. A standalone 7♯11 can also use a natural 9 and 13, so it need not imply the altered scale." },
        ],
      },
      {
        id: "perfect-cadence",
        title: "The perfect cadence",
        blocks: [
          { type: "p", text: "An authentic cadence ends a phrase with V (or V7) moving to I in major or i in minor: for example, G7–C in C major or E7–Am in A minor. V–I is commonly called a perfect cadence in British terminology. In US terminology, a perfect authentic cadence additionally requires both chords in root position and the tonic in the highest voice of the final chord. A V–I progression inside a phrase need not be a cadence." },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 9 */
  {
    slug: "keys",
    title: "Relative keys & modulation",
    description: "Relative major and minor, borrowing, tonicization, and ways to establish a new key.",
    sections: [
      {
        id: "relative",
        title: "Relative major and minor",
        blocks: [
          { type: "p", text: "A major scale and its relative natural minor share a key signature and pitch collection but have different tonics. The relative minor's tonic is degree 6 of the major: C major and A minor share their natural notes, but C major is centred on C and A minor on A. Relative describes this relationship, rather than a separate kind of minor scale." },
          { type: "widget", name: "relative-keys" },
        ],
      },
      {
        id: "modulation",
        title: "Modulation",
        blocks: [
          { type: "p", text: "Modulation establishes a new tonic and key. A brief emphasis on another chord is tonicization; a convincing change of key depends on the melody, harmony, duration and phrase structure. Common approaches include:" },
          {
            type: "list",
            ordered: true,
            items: [
              "Direct modulation: enter the new key without a pivot chord, often at a phrase boundary. A repeated section shifted upward is one familiar example.",
              "Pivot-chord modulation: reinterpret a chord shared by the old and new key, then confirm the new tonic.",
              "Common-tone modulation: sustain or repeat a pitch while the harmony changes around it into the new key.",
              "Sequential modulation: repeat a musical pattern at new pitch levels as a path to a new key.",
              "Enharmonic modulation: respell and reinterpret a chord, such as a diminished seventh, to connect keys.",
            ],
          },
        ],
      },
      {
        id: "modal-interchange",
        title: "Modal interchange: borrowing from a parallel mode",
        blocks: [
          { type: "p", text: "Modal interchange borrows notes or chords from a parallel mode while often keeping the tonic. In C major, C–Fm–C borrows iv from C minor and returns to C. That colour change does not by itself establish a new key. Borrowing can help prepare a modulation, but it is not automatically modulation." },
        ],
      },
      {
        id: "cadence-key-change",
        title: "Changing key with a perfect cadence",
        blocks: [
          { type: "p", text: "One of the simplest ways to change key uses the perfect cadence. In C major, to move to B♭ major, steer the progression to F major. F is chord IV in C, but it is also chord V in B♭." },
          { type: "p", text: "F–B♭ can introduce the new tonic, but those two chords alone do not prove a lasting key change. Continue, for example, with Cm7–F7–B♭ and shape the melody and phrase ending around B♭. That ii–V–I supports B♭ as the new centre; a quick return to C may instead sound like a temporary tonicization." },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 10 */
  {
    slug: "key-characters",
    title: "Key characters",
    description: "The mood traditionally attributed to each major and minor key.",
    sections: [
      {
        id: "characters",
        title: "Characteristics of keys",
        blocks: [
          { type: "p", text: "These descriptions are historical aesthetic associations attributed to C. F. D. Schubart, not universal emotional rules or scientific properties of keys. The treatise was written in the 1780s and published posthumously in 1806. Its historical tuning and spelling context matters: do not transfer a description to an enharmonic key simply because the pitches coincide in modern equal temperament." },
          { type: "widget", name: "key-characters" },
        ],
      },
    ],
  },
];

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

/* Circle of fifths prose, used on its own page. */
export const CIRCLE_TEXT = {
  intro:
    "The circle (cycle) of fifths shows the relationship between all the major keys, their key signatures and their relative minor keys. It starts at C major, which has no sharps or flats, and moves up a perfect fifth at a time through every key until it returns to C: C to G, G to D, D to A and so on.",
  descending:
    "Moving counter-clockwise descends in fifths, using flats: C – F – B♭ – E♭ – A♭ – D♭ – G♭ (= F♯) – C♭ (= B) – F♭ (= E), and so on all the way back to C.",
  fourths:
    "Counter-clockwise with the notes rising in pitch is the circle of fourths, the mirror of the circle of fifths: C – up a fourth – F – up a fourth – B♭ – E♭ – A♭… Many musicians prefer it because chord progressions tend to move this way. A descending fifth equals an ascending fourth (an octave apart): a perfect 5th is 7 semitones, a perfect 4th 5 semitones, and 7 + 5 = 12.",
};
