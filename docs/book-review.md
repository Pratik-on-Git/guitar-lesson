# Fretboard Concepts (2019): source review and implementation map

Source: the user-supplied 112-page PDF, Yiannis Papadopoulos, *Fretboard Concepts*, digital ISBN 978-618-00-0513-4. PDF page numbers match printed page numbers. The contents incorrectly put Hirajoshi on 25 (actually 26) and Ionian ♯5 on 37 (actually 38).

The entire PDF was extracted locally for review. Formula tables, diagram conventions, practice assignments and the appendix were compared with the existing application. Original prose is taught in newly written explanations; the diagram atlas preserves the supplied book's exact fingerings. Generated fingerings are explicitly distinguished from the source's numbered boxes. Acknowledgements and the author's biography are contextual matter, not new theory lessons.

## Coverage and learning order

| Source | Material reviewed | Existing state | Destination |
| --- | --- | --- | --- |
| 1–4 | Contents and organization | No book map | `/book`: chapter guide and source diagram index |
| 5–8 | Musical expression; Double Note system; five/seven-box root anchors; parent-box offsets; H marker; transposition | Brief Double Note explanation only | `/learn/fretboard-system`, corrected scale/mode neck controls, `/book` |
| 9–11 | Intervals, triads, seven seventh-chord types, inversion and voicing, three scale formulas | Theory and formulas present; inversions absent | Existing intervals/chords/scales lessons, `/learn/voicings`, `/voicings` |
| 11–17 | Modes, modulation, parallel modes, signatures, fifths, scale degrees, parent roots, applied/substitute/altered dominants | Mostly present | Existing modes/keys/harmony, signature-reading and contextual corrections |
| 18–26 | Major/minor pentatonic and blues, Kumoi, Pelog, Hirajoshi, five positions; parent-harmony interpretation | Three pentatonics absent; no original boxes | Four existing explorers plus three added scales; source sheets 20–26; parent-derived harmony lesson |
| 27–34 | Seven major modes: step/degree/harmonic formulas, extensions and seven positions | Formula rotation present; no source boxes | Existing mode explorer, characteristic-note panel, original sheets 28–34 |
| 35–42 | Seven harmonic-minor modes; altered parent degree and seven positions | Formulas present | Existing explorer, characteristic notes, sheets 36–42 |
| 43–50 | Seven melodic-minor modes; jazz minor; altered spelling/application | Formulas and dominant respelling present | Existing explorer, characteristic notes, sheets 44–50 |
| 51–57 | Whole tone, augmented, H/W and W/H diminished; symmetry periods; contained chords | Augmented absent; symmetry undeveloped | Added augmented explorer, `/learn/symmetric-scales`, sheets 54–57 |
| 58–64 | Five root-position shapes for four triads and seven seventh types; optional omitted fifths; horizontal harmonization | Formula library only | `/learn/voicings`, `/voicings`, sheets 59–64 |
| 65–73 | Drop 2 recipe; four resulting inversions on 4321, 5432, 6543 | Absent | Voicing lesson/tool and sheets 67–73 |
| 74–81 | Drop 3 recipe; four resulting inversions on 5321, 6432; phrasing tips and avoid-note discussion | Absent | Voicing lesson/tool, improvisation lesson and sheets 75–81 |
| 82–93 | Seven shapes for four triad and seven seventh arpeggio types | Absent | `/learn/arpeggios`, `/arpeggios`, sheets 83–93 |
| 94–95 | Horizontal and vertical harmonization with triads/sevenths in every scale box | Absent | `/learn/harmonization`, `/harmonization`, practice assignments |
| 96–97 | Characteristic notes for 21 modes; minor-pentatonic phrasing over dominant chords | Scattered summaries only | Mode-specific panel and `/learn/improvisation` |
| 98–99 | Horizontal/vertical/hybrid improvisation; scale choices for seven chord qualities | Absent | `/learn/improvisation`, `/improvisation` |
| 100–101 | Parent-major ii/iii/vi pentatonics; modal pentatonic substitutions | Absent | `/learn/pentatonic-substitutions`, transposable application tool |
| 102–103 | Chord extensions, dominant resolution, altered pentatonics, chromatic approach patterns, progressive practice | Absent | Improvisation lesson/tool, practice workflow |
| 104–107 | Standard tuning, fretboard notes, accidental orders, rhythm, dotted rests, triplets, ties | Tuning/fretboard training, signature rules, triplets/ties missing | `/learn/fretboard-system`, existing notes/keys/rhythm lessons, `/practice` |
| 108–111 | Interval identification/completion; triad/seventh spelling/identification; answers | Absent | `/practice`: all 80 original appendix questions, followed by generated chord transpositions, with spelling-aware answer checking |
| 112 | Epilogue and author context | Absent | Source credit in `/book`; musical practice guidance in lessons |

## Formula findings

- Kumoi: `1 2 b3 5 6`, semitones `0 2 3 7 9`; Dorian with degrees 4 and 7 omitted.
- Pelog (the book's equal-tempered guitar collection): `1 b2 b3 5 b6`, semitones `0 1 3 7 8`; Phrygian with 4 and 7 omitted. The name here does not describe the full Javanese tuning system.
- Hirajoshi (the book's variant): `1 2 b3 5 b6`, semitones `0 2 3 7 8`; Aeolian with 4 and 7 omitted. Names vary between guitar sources; preserve the explicit formula.
- Augmented: `1 #2 3 5 b6 7`, semitones `0 3 4 7 8 11`; cyclic steps `3 1 3 1 3 1`. Harmonic respelling `1 b3 3 5 #5 7` has the same pitch classes.
- All 21 heptatonic mode formulas agree with rotation of their stated parents. Strict altered spelling and dominant application must remain separate.
- The pentatonic harmonic tables describe chords from a larger parent collection. They are not chords obtainable using only the five pentatonic notes. Do not apply seven-note tertian harmonization directly to a pentatonic or symmetric collection.

## Corrections and qualifications retained in the app

1. **Page 13, sharp signatures:** ascend a semitone from the final actual sharp, e.g. G♯ → A. The text's whole-step rule applies to the unaltered letter G and is misleading as a general shortcut. No accidentals means C major/A minor; one flat is F major/D minor.
2. **Pages 12, 16–17:** modal borrowing need not establish a new key; applied dominants are defined by function, not diatonic-root membership. A tritone substitute of V/iii remains valid when its root is diatonic. Existing corrections are preserved.
3. **Page 52, augmented harmony:** A augmented is A C C♯ E F G♯. E♭maj7 contains E♭ and B♭, which are outside it; the assertion that both Amaj7 and E♭maj7 belong is false. Amaj7, C♯maj7 and Fmaj7 are the contained major-seventh chords (with harmonic respelling). The scale does not contain major and minor triads on *every* degree: those occur on A, C♯ and F in this example.
4. **Page 80, avoid notes:** melodic minor is not a guarantee that every lick fits every chord/voicing. Harmony, melody, register, duration and resolution remain relevant. A fourth over a major third can create tension; it is not a banned note.
5. **Page 99:** the scale-choice table is a set of musical suggestions, not strict containment. Kumoi/Pelog/Hirajoshi omit a seventh and do not themselves imply a major-seventh minor chord; pentatonic/blues choices may intentionally conflict with a chord's third.
6. **Page 102, altered pentatonics:** B♭ minor pentatonic over G7 yields ♯9, ♯11, ♭13, ♭7, ♭9 (not a major 7th). F minor pentatonic yields ♭7, ♭9, ♯9, 11, ♭13 (not a natural fifth). F Aeolian yields ♭7, 1, ♭9, ♯9, 11, ♯11, ♭13. Applications show these computed relationships.
7. **Page 102, extension restrictions:** a ♭9/♭13 dominant does not uniquely force Phrygian dominant. The altered collection also contains both; distinguish the retained natural fifth/fourth of Phrygian dominant from altered's ♯11/♯9.
8. **Page 110, diminished-seventh spelling:** D♯ + 𝄫7 = C♮ (correct); comparisons and answer checking retain letter spelling rather than accepting any enharmonic note. G♯–F is a diminished seventh, E–A♭ a diminished fourth, and A♭–F♯ an augmented sixth.

## Asset provenance

`public/book/*.webp` contains 63 cropped diagram sheets from the supplied PDF (32 scale/mode sheets, 6 root-position chord sheets, 14 drop-voicing sheets, 11 arpeggio sheets). They retain the book's scale-degree labels and A-root fingerings. These are source illustrations for this personal study app, credited to Yiannis Papadopoulos (2019); they are not generated transpositions. `scripts/extract-book-diagrams.py` reproduces the sheets from the local PDF using PyMuPDF. Raw extracted prose stays in ignored local review files.

`lib/content/book-assignments.ts` preserves all 214 numbered practical assignments on pages 19, 27, 35, 43, 53, 58, 66, 74, 82 and 95. The exercise bank separates columns and assignment parts, supports search and saved completion, and links to the corresponding scale, mode, voicing, arpeggio or harmonization tool. The source's page 74 part 2 skips numbers 5 and 6; these have not been invented or renumbered. Regenerate with `scripts/extract-book-assignments.py`.

## Resulting application

- 17 topics and 82 lesson sections, retaining the earlier study material and historical sources.
- 18 scale formulas, including all four missing book scales, and all 21 book modes within the existing 26-mode library.
- Six added destinations: book guide, voicing workbench, arpeggio explorer, harmonization workbench, scale-choice workbench and practice studio.
- Source references, chapter navigation, search entries and study progress integrated with the original app shell.
- Exact source boxes remain in the atlas. Transposable computed tools use clearly labeled generated fingerings or fret windows. Narrow displays frame the selected grip/region, rather than opening on empty frets.
- Browser-synthesized audio, a four-beat metronome, all 80 original appendix questions, 214 practical assignments and a local practice log.

## Verification commands

`npm run test:data` runs the original arithmetic audit and the additional book audit. The latter checks 8,940 cases spanning source/assignment links, all-root drop recipes and guitar grips, Double Note repeats, symmetry, corrected substitutions, spelling-sensitive exercises and scientific octave boundaries (B♯3/C4 and C♭4/B3).

`npm run build`, `npm run lint` and `npm run test:e2e` verify production rendering, source quality and browser behavior. The browser suite covers every study route, original diagrams, control changes/reloads, practice persistence, assignment search, mobile width and audio controls.
