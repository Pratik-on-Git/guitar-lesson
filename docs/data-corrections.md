# Guitar lesson corrections

Implemented following the [original internet comparison](data-audit.md). The [current inventory](data-inventory.md) and [machine-readable results](data-audit-results.json) are generated from the corrected definitions.

## Current coverage

- 10 theory topics and 45 sections.
- 14 scales: the original nine plus minor blues, both symmetrical diminished collections, major bebop and dominant bebop.
- All 26 modes have explanatory notes; the pentatonic TODOs are completed.
- 72 distinct chord formulas after merging three duplicate pitch sets and adding minor-major seventh. Existing URLs for renamed/merged entries still resolve.
- 24 historical key-character entries with exact-spelling lookup; missing exact enharmonic descriptions are displayed as unavailable rather than borrowed from another key.
- Sources are linked from the lessons, explorers, chord library, and circle.

## Finding-by-finding implementation

| Finding | Implemented change |
| --- | --- |
| A01 | Modal interchange has its own section. The modulation list now covers direct, pivot, common-tone, sequential and enharmonic approaches without claiming an exhaustive classification. |
| A02 | F–B-flat is presented as a possible introduction to a key, with Cm7–F7–B-flat and contextual confirmation rather than a guaranteed modulation. |
| A03 | Applied dominants are defined as major triads or dominant sevenths of temporary tonics. The five conventional secondary targets remain; vii-diminished is excluded because of tonic stability. |
| A04 | Shared `majorKeyDominants` data drives both widgets. The substitute table includes iii, even when the substitute root is diatonic, and labels the diminished target as unsuitable for ordinary tonicization. |
| A05 | Altered mode retains its theoretical derivation and now has a separate dominant-application panel. Its keyboard and fretboard show dominant spellings, including the major third. Stacked-third harmony is explicitly theoretical. |
| A06 | Altered prose describes the unchanged root and the practical dominant tensions explicitly. |
| A07 | Fixed jazz/ascending melodic minor and conventional classical descending minor are distinguished. A generated descending example follows the selected root. |
| A08 | Meter prose distinguishes written units, simple beats, and compound groups. The 4/4 duration-table assumption is explicit. |
| A09 | The interval-table membership column identifies the selected major scale. The prose explains diatonic minor intervals and letter-based spelling. |
| A10 | Note-count taxonomy is neutral; nonatonic is a count, and diminished collections are distinguished from bebop collections. The prehistoric/primitive claim is removed. |
| A11 | Dominant seventh quality is distinguished from dominant function, with harmonic-minor and Mixolydian examples. |
| A12 | Chord names are aligned with their formulas, including 6/9-sharp11, major9-sharp11, minor11-flat5, minor-major9-flat13 and augmented added-note chords. Existing IDs for renamed entries remain stable. |
| A13 | The minor9-sus4 pitch set is consolidated into m11, with a legacy URL mapping. |
| A14 | The two rows repeating sharp5/flat13 are consolidated with their corresponding augmented altered dominants. Legacy URLs still resolve. No current chord formula contains duplicate pitch classes. |
| A15 | The seventh-sharp11 formula/example difference is a voicing note, not a factual correction. The library explains reference chord membership versus a required voicing. |
| A16 | Power chords have their own category and a note explaining dyads and octave doubling. |
| A17 | Pitch is described as perceived; pitch class, equal temperament and the octave frequency ratio are explained. |
| A18 | Modal identity is tied to tonal centre, bass, harmony and melodic resolution, with a D-Dorian listening exercise. |
| A19 | Sharp-up/flat-down chromatic spelling is an exercise convention, with contextual spelling acknowledged. |
| A20 | Pentatonic application text distinguishes collection-contained chords from contextual chord-scale use. The major-blues TODO is replaced with a concrete application, rather than inventing a unique harmonization. |
| A21 | Mode-matrix headings are semitone counts. Degrees such as sharp2 and flat3 retain their own labels within the same semitone slot. |
| A22 | Historical lookup uses exact letter/accidental spelling. The circle states the historical context and explains unavailable descriptions. |
| A23 | Pentatonic notes are finished, missing common scales and minor-major seventh are added, and unverified cultural mode aliases are removed. The two missing historical entries are sourced paraphrases, not invented quotations. |
| A24 | White-key altered spellings, subtonic versus leading tone, relative minor, cadence terminology, tritone inversion and scale-spelling preferences are clarified. The natural-minor example now matches its default A root. |
| A25 | Circle neighbours derive from the selected tonic by letter and pitch, including C-flat, G-flat, F-sharp, D-flat and C-sharp. |

## Additional correctness fix

Parent-key spelling for pentatonic modes formerly subtracted the mode's list index from its tonic letter. In a five-note collection, the list index is not the diatonic degree. For example, E-centred mode 4 of A minor pentatonic should recover A as its parent. A shared `modeParentRoot` helper now reverses the actual parent degree. Every mode/root combination is checked for the exact rotated parent-note spellings, not only matching pitch classes.

`parseNote` also accepts the Unicode double accidentals produced by `noteName`, so spelled notes can round-trip through historical and mode helpers.

## New source material

E minor and C-sharp minor are short, labelled paraphrases based on the minor-key table in [Hugo Fastl's TU Munich paper, page 4](https://mediatum.ub.tum.de/doc/1138386/1138386.pdf#page=4). They are historical associations, not scientific predictions of emotion. The existing 22 excerpts are linked to the [transcribed Schubart/Steblin excerpt](https://biteyourownelbow.com/keychar.htm). No description is automatically transferred between enharmonic keys.

Major bebop's passing-note collection is supported by [University of Puget Sound's harmonization lesson](https://musictheory.pugetsound.edu/mt21c/harmonizing-bebop-scale.html). The diminished and altered dominant distinction is supported by [Gary Burton's Berklee lesson](https://online.berklee.edu/takenote/jazz-improvisation-10-scales/). The original audit's sources support the remaining corrections and remain linked in that report and in the application.

## Verification

Run from the repository root:

```powershell
npm run test:data
npm run lint
npm run build
npm run test:e2e
```

Install the browser once if needed: `npx playwright install chromium`. The Playwright suite starts a production server on `127.0.0.1:3173`; run the production build before the browser tests. It does not reuse or stop a pre-existing development server.

The data audit checks 14 literal scale formulas, 26 mode formulas, 31 common chord references, 1,344 transpositions (168 scales, 312 modes, 864 chords), 480 full fretboard maps, 2,520 positions, 15 signatures, 48 harmonizations, 15 interval inversions and 92 targeted regression cases. All 312 mode transpositions also verify exact parent-note spellings.

The production build, ESLint, data audit and all **10 Chromium browser tests passed**. The browser suite visits all 30 study routes and exercises root changes, URL reloads, applied/substitute dominants, altered dominant interpretation, classical descent, pentatonic parent spelling, historical lookup, enharmonic neighbours, legacy chord selections, search, source links and mobile width. External references are links; availability in a signed-in browser and third-party audio playback cannot be guaranteed by the local tests. The two original MuseScore links are labelled optional scores, and listening was not certified.
