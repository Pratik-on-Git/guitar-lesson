# Internet comparison of the guitar lesson data

Original comparison: **14 November 2026 (Asia/Kolkata)**.

**Snapshot notice:** this report preserves the findings from before implementation. The subsequent correction pass is recorded in [data-corrections.md](data-corrections.md). The generated [inventory](data-inventory.md) and [results](data-audit-results.json) now describe the corrected application, so their counts differ from the original snapshot below.

The scale and interval calculations are consistent in the cases checked. The material needs corrections and qualifications in its explanations, chord naming, and treatment of historical claims. Passing the arithmetic checks does not mean all the teaching content is accurate.

At the time of this original comparison, lesson content and application behavior had not been changed. Follow the correction log above for the implemented status of each finding.

## Scope and evidence

The audit covers the current application's 10 topics / 44 sections, 9 scale definitions, 26 modes in 4 families, all 74 chord rows, 12 circle positions / 15 standard major-key spellings, 22 historical key-character entries, the generated music diagrams, and the 5 images used by the lessons. The original `Guitar.docx` was also inspected as background; it contains 1,629 paragraphs, 30 tables, and 71 embedded media files. This is not a complete visual or note-for-note audit of all 71 original embedded files.

Web research prioritized authored teaching material from universities, Berklee, guitar manufacturers, and music-theory scholarship. Search results and accessible article text were compared with the local source files. Some Open Music Theory pages were accessible through indexed text but intermittently rejected direct requests. The old Western Michigan historical-key page was inaccessible. Those limitations are recorded below; an inaccessible page is not evidence that its claim is false.

Three kinds of evidence are kept separate:

- **Source comparison:** what teaching references say compared with the current prose.
- **Independent calculation:** literal reference patterns and interval arithmetic compared with generated data.
- **Local observation:** inconsistent labels, missing entries, or a display whose interpretation needs qualification.

See [the full inventory](data-inventory.md) for every scale, mode, chord row, and standard key spelling. [The JSON results](data-audit-results.json) include note spellings for every scale, mode, and chord across all 12 selectable roots.

## Coverage and outcome

| Current area | Result | Relevant evidence |
| --- | --- | --- |
| Sound and pitch | Basic sound/frequency/timbre explanation is usable; pitch and pitch-class terminology need scope | A17; [UNSW acoustics](https://phys.unsw.edu.au/jw/musFAQ.html) |
| Notes, accidentals, octaves | Basic examples and 88-key range are consistent; equal-temperament and spelling qualifications help | A17, A24 |
| Rhythm | 4/4 duration values and the single-dot calculation are correct; meter explanation is too general | A08; [Notating Rhythm](https://viva.pressbooks.pub/openmusictheory/chapter/notating-rhythm/) |
| Intervals | Checked sizes, qualities, and inversions pass; the meaning of “diatonic” is misstated | A09, A21 |
| Scales and modes concepts | Main formulas pass; explanations of modal identity and scale taxonomy need work | A10, A18–A20 |
| All 9 named scales | All pitch-offset formulas match the reference patterns checked | A07, A19, A20 qualify the teaching |
| All 26 modes | All computed degree formulas match independent expected formulas | A05, A06, A11, A18, A21 qualify the interpretation |
| Chords and scale degrees | 30 common chord formulas checked against explicit reference formulas; all 74 rows checked for transposition consistency | A12–A16, A23 |
| Harmony and substitutions | Main major/minor harmonizations and the basic tritone example work; definitions need qualification | A03–A06, A11 |
| Relative keys and circle | Standard signatures, accidental order, and relative minors pass for all 15 standard spellings; neighbour labels need enharmonic spelling fixes | A25; [Major scales and key signatures](https://viva.pressbooks.pub/openmusictheory/chapter/major-scales/) |
| Modulation | Borrowing and modulation are conflated, and a two-chord example overstates what it establishes | A01, A02 |
| Historical key characters | Historical framing is helpful; table is incomplete and enharmonic lookup is unsuitable as historical evidence | A22, A23 |
| Existing images | No incorrect pitch/interval notation identified in the 5 current images during visual inspection | Image review below |

## Findings and recommended changes

Priority indicates the likely effect on learning, not a software security severity. “Clarify” identifies a convention or incomplete explanation rather than a universally wrong formula.

### A01 — High: modal interchange is presented as a type of modulation

**Current:** `lib/content/topics.ts:572–579` says there are three types of modulation and includes modal interchange.

**Comparison:** borrowing chords from a parallel mode can preserve the tonic. It does not necessarily establish another key. Open Music Theory distinguishes borrowing from modulation. [Modal Mixture](https://viva.pressbooks.pub/openmusictheory/chapter/modal-mixture/)

**Change:** explain borrowing separately. Example: C–Fm–C borrows iv from C minor while retaining C as tonic. Describe direct, pivot-chord, common-tone, sequential, and enharmonic approaches as examples rather than an exhaustive three-item classification. The additional approaches appear in the University of Puget Sound curriculum. [Modulations Without Pivot Chords](https://musictheory.pugetsound.edu/mt21c/ModulationsWithoutPivotChords.html)

### A02 — Medium: F–B-flat does not prove a lasting modulation

**Current:** `lib/content/topics.ts:588–589` concludes that reaching B-flat from F means the music is now in B-flat.

**Comparison:** F can act as IV in C and V in B-flat, so the example is a valid possible pivot. Whether B-flat becomes the established tonic depends on continuation and musical context. A temporary emphasis can be tonicization. [Tonicization](https://musictheory.pugetsound.edu/mt21c/Tonicization.html)

**Change:** say the progression *can introduce* B-flat major and show a continuation that confirms the new key. This is a qualification of the inference, not a wrong chord calculation.

### A03 — Medium: secondary-dominant explanation overstates its origin and scope

**Current:** `lib/content/topics.ts:512–515` traces secondary dominants to harmonic minor, requires a dominant seventh with a diatonic root, and explains the missing vii target only through its would-be dominant root.

**Comparison:** an applied dominant may be a major triad or a dominant seventh. Its defining relationship is to the temporary tonic. The five conventional non-tonic major/minor targets in a major key are a useful restricted teaching set. Diminished vii is ordinarily excluded because it is not a stable tonic target. [Tonicization](https://musictheory.pugetsound.edu/mt21c/Tonicization.html)

**Change:** retain the conventional five-target major-key table, state its scope, and explain applied dominants using the destination's major/minor harmony. Remove the unsupported universal origin claim. Dominants occur in major, harmonic minor, and melodic minor. [Berklee: Voice Leading for Guitar](https://online.berklee.edu/takenote/voice-leading-for-guitar/)

### A04 — Medium: the substitute-dominant table treats a restricted convention as exhaustive

**Current:** `lib/content/topics.ts:522–524` and `components/content/widgets.tsx:482–483` require a non-diatonic root and exclude iii and vii.

**Comparison:** tritone substitution is established by the relationship between two dominant chords and their guide tones, not by whether the substitute root belongs to the home scale. [Biamonte: Augmented-Sixth Chords vs. Tritone Substitutes](https://www.mtosmt.org/issues/mto.08.14.2/mto.08.14.2.biamonte.html)

**Independent example:** in C major, B7 is V7/iii. Its tritone substitute is F7: B7 contains D-sharp and A; F7 contains A and E-flat. Those guide tones are enharmonically the same, and F7 can approach Em by a half step. The current filter suppresses F7 because F is diatonic.

**Change:** either label the table as the restricted set of substitutes with non-diatonic roots, or include the iii example with its context. Do not infer an ordinary vii-diminished tonicization just because a candidate chord can be calculated.

### A05 — High: altered-mode arithmetic is correct but its displayed harmony obscures its jazz use

**Current:** `components/music/mode-explorer.tsx:59` uses generic third stacking for the altered scale. With root C it reports C-diminished / Cm7-flat5 as the tonic triad/seventh.

**Comparison:** the strict seventh mode of D-flat melodic minor is C, D-flat, E-flat, F-flat, G-flat, A-flat, B-flat. Generic third stacking explains the displayed result. In jazz the same pitch collection is interpreted over C7alt, retaining C, E, and B-flat and supplying altered tensions. [Berklee: Jazz Scales](https://online.berklee.edu/takenote/jazz-improvisation-10-scales/)

**Change:** show both the theoretical mode spelling and a separate dominant interpretation: `1 b9 #9 3 b5/#11 #5/b13 b7`. Explain F-flat → E in that interpretation. Preserve the correct derivation; add the practical chord-scale relationship.

### A06 — Low: “every note of the major scale altered” includes the unchanged root

**Current:** the altered summary/prose in `lib/music/modes.ts:318–325` says every note is altered.

**Comparison:** its generated super-Locrian formula is `1 b2 b3 b4 b5 b6 b7`. The root stays fixed. The practical dominant spelling also retains the major third and minor seventh as structural tones. [Berklee: Jazz Scales](https://online.berklee.edu/takenote/jazz-improvisation-10-scales/)

**Change:** describe the formula explicitly and explain “altered” through the dominant's tensions. Avoid a literal claim that the root changes.

### A07 — Medium: melodic minor needs its classical/jazz distinction

**Current:** `lib/music/scales.ts:234–257` gives `1 2 b3 4 5 6 7` and aliases it to jazz minor without explaining descent.

**Comparison:** that formula is appropriate for ascending classical melodic minor and the fixed jazz-minor collection. The conventional classical descending exercise uses natural minor. [Puget Sound: Minor Scales](https://musictheory.pugetsound.edu/mt21c/MinorScales.html)

**Change:** identify the explorer and its modes as the fixed ascending/jazz collection. Add a separate classical descending example. Do not change the existing ascending formula.

### A08 — High: the time-signature rule only works directly for simple meter

**Current:** `lib/content/topics.ts:115–116` describes the numerator as beats per measure and denominator as the duration of each beat.

**Comparison:** in compound meter the written units are grouped in threes. For example, 6/8 commonly has two dotted-quarter beats, each divided into three eighths. [Compound Meter and Time Signatures](https://viva.pressbooks.pub/openmusictheory/chapter/compound-meters-and-time-signatures/)

**Change:** teach the current rule under simple meter, then distinguish counted units from main beats using 6/8. Keep the duration widget's explicit “Beats in 4/4” label; its values are correct for that assumption.

### A09 — High: “diatonic intervals” is confused with intervals above a major tonic

**Current:** `lib/content/topics.ts:229` and `components/content/widgets.tsx:233–280` treat the major/perfect intervals from the selected root as the diatonic intervals.

**Comparison:** E–F is a minor second and E–G is a minor third, yet both occur entirely within C major. A major scale's tonic-to-degree intervals are a narrower list. The major-scale method identifies interval quality; it does not exclude minor intervals from diatonic music. [Puget Sound: Identifying Intervals](https://musictheory.pugetsound.edu/mt21c/HowToIdentifyIntervals.html)

**Change:** rename the column “In this root's major scale” and rewrite the prose to distinguish those two meanings.

### A10 — Medium: scale-size descriptions contain unsupported generalizations

**Current:** `lib/music/scales.ts:325–331` defines nonatonic through one blues variant, associates octatonic with bebop only in its example text, and calls 2–4-note scales generally prehistoric/“primitive.”

**Comparison:** note-count labels specify cardinality. They do not determine one formula, cultural origin, or historical stage. Scholarly discussion of the natural horn's tetratonic collection supplies a counterexample to a prehistoric-only framing. [McFarland in Music Theory Online](https://www.mtosmt.org/classic/mto.09.15.2/mto.09.15.2.mcfarland.html)

**Change:** define the counts neutrally. Include diminished whole-half/half-whole alongside bebop as distinct eight-note examples; Berklee explicitly teaches the symmetrical diminished collection. [Berklee: Jazz Scales](https://online.berklee.edu/takenote/jazz-improvisation-10-scales/)

### A11 — High: dominant-seventh terminology is incorrectly exclusive to Ionian

**Current:** `lib/music/modes.ts:70` says G7 is named for its position in this mode “and only this mode.”

**Comparison:** the dominant-seventh chord quality can occur in other modes and keys. The app's own A-harmonic-minor harmony includes E7 on V; C Mixolydian has C7 on its tonic. A chord's quality and its function in a key must be distinguished. Berklee also teaches dominant alternatives outside Ionian. [Berklee: Jazz Scales](https://online.berklee.edu/takenote/jazz-improvisation-10-scales/)

**Change:** explain that “dominant” names degree V in tonal harmony, while “dominant seventh” also names the major-triad/minor-seventh chord quality.

### A12 — Medium: six chord names do not clearly match their symbols/formulas

The following are local label discrepancies in `lib/music/chords.ts`. The suggested labels follow the *existing* symbol/formula; they do not imply those formulas must be replaced.

| Current name | Current symbol/formula observation | Suggested clearer name |
| --- | --- | --- |
| 6-sharp11 | Symbol is `6/9#11`; formula includes 9 | 6/9-sharp11 |
| Major 7th sharp11 | Symbol is `maj9#11`; formula includes 9 | Major 9th sharp11 |
| Minor 7-flat5/11 | Symbol is `m11b5`; formula includes 9 and 11 | Minor 11-flat5 |
| Minor major 7-flat13 | Symbol is `m(maj9)b13`; formula includes 9 | Minor-major 9-flat13 |
| Augmented 6/11/13 | Symbol is `+6/9/11`; formula includes 6, 9, 11 and no separate 13 | Augmented add6/add9/add11 |
| Minor 9 suspended | Formula includes both minor third and fourth | See A13 |

These are naming-consistency recommendations based on the displayed intervals. Extended-chord symbols and actual voicings admit omissions. [Macalester: Extended Tertian Chords](https://pressbooks.macalester.digital/multimodalmusicianship/chapter/extended-tertian-chords-altered-dominants-2/)

### A13 — Medium: “minor 9 suspended” is an unclear label for an ordinary m11 collection

**Current:** `lib/music/chords.ts:113` gives `m9sus4` the formula `1 b3 4 5 b7 9`.

**Comparison:** in basic sus-chord naming the second or fourth replaces the third. This row retains the minor third and contains the same pitch classes as the existing m11 row. [Puget Sound: Simple Sus Chords](https://musictheory.pugetsound.edu/mt21c/SimpleSusChords.html)

**Change:** merge it as an m11 alias, or document a specific intended voicing/convention. Do not suggest that retaining a minor third makes a sonority physically impossible; the problem is the teaching label.

### A14 — Medium: two altered-chord rows count an enharmonic pitch twice

**Current:** `lib/music/chords.ts:135–136` includes both `#5` and `b13` in each formula.

**Independent calculation:** from C, G-sharp and A-flat have the same pitch class in 12-tone equal temperament. The two rows therefore add spelling/register information, not another distinct pitch class.

**Change:** consolidate with the corresponding `7#5#9` / `7#5b9` row, or explicitly explain register and spelling. The current fretboard lookup maps a pitch class to one index, so it cannot simultaneously label the same position as both degrees. This is a display limitation, not an out-of-tune note.

### A15 — Medium: the existing 7-sharp11 correction is overly rigid

**Current:** `lib/music/chords.ts:91` calls the original example's extra ninth a correction, because the selected formula omits it.

**Comparison:** the selected five-note formula is valid. A performed extended chord can include or omit additional members depending on notation and context. Treating a symbol as exactly one mandatory voicing overstates the issue. [Macalester: Extended Tertian Chords](https://pressbooks.macalester.digital/multimodalmusicianship/chapter/extended-tertian-chords-altered-dominants-2/)

**Change:** call it a formula/example alignment choice. Use `9#11` when teaching the explicitly enumerated six-note version, without claiming the former example is universally invalid.

### A16 — Low: power chord appears under “Triads”

**Current:** `lib/music/chords.ts:49` places `1 5` in Triads.

**Comparison:** it contains two pitch classes. Octave doubling does not supply a third chord member. It is normally described as a power-chord dyad rather than a tertian triad.

**Change:** use “Basic chords,” a separate power-chord category, or an explanatory note. Preserve the correct `1 5` formula.

### A17 — Medium: pitch and the “12 notes” statement need a defined scope

**Current:** `lib/content/topics.ts:22–30` equates pitch with a precise frequency and says there are 12 notes without qualification.

**Comparison:** pitch is perceived, and is primarily related to frequency. Complex sounds complicate a one-frequency definition. [UNSW: Acoustics FAQ](https://phys.unsw.edu.au/jw/musFAQ.html)

**Change:** say the app uses 12 pitch classes per octave in 12-tone equal temperament. Distinguish a pitch class such as C from particular pitches such as C3/C4. Add the octave frequency ratio 2:1. The present model is appropriate for the app, but does not describe all tuning systems.

### A18 — Medium: changing the first note alone does not establish a modal tonic

**Current:** the major-mode introduction in `lib/music/modes.ts` and the mode lesson describe a different start as the defining operation.

**Comparison:** rotation correctly calculates a collection. A musical mode also requires the intended note to be heard as the centre. The app's pentatonic explanation already gestures toward reorientation; extend that explanation consistently.

**Change:** demonstrate D Dorian over a D-centred accompaniment and compare it with C major. Explain that merely beginning a C-major melody on D need not change its mode. This is a pedagogical inference about tonal context, not a failure in `modeDegrees`.

### A19 — Medium: chromatic spelling is presented as an absolute rule

**Current:** `lib/music/scales.ts:273` states ascending chromatic scales use sharps and descending use flats.

**Comparison:** that is a common exercise convention, not an unconditional spelling rule. Harmony and key context can dictate other spellings. Open Music Theory explicitly qualifies the convention. [Diatonic Modes and the Chromatic Scale](https://viva.pressbooks.pub/openmusictheory/chapter/intro-to-diatonic-modes-and-the-chromatic-scale/)

**Change:** add “often in a standalone exercise.” Keep the two current illustrations; their pitches are correct for the convention shown.

### A20 — Medium: pentatonic “harmonic formulas” are not harmonizations contained in the scale

**Current:** `lib/music/scales.ts:132,159` gives multiple seventh chords as chords over individual pentatonic notes; the explorer calls them a harmonic formula.

**Independent example:** C major pentatonic is C D E G A. Cmaj7 adds B; C7 adds B-flat. Neither complete seventh chord lies entirely inside that five-note collection.

**Change:** distinguish chords derived entirely from the collection from contextual chord-scale applications. State the harmonic context for each proposed use. Do the same for the major-blues “harmonic formula” TODO: there is no single mandatory seventh-chord harmonization to fill in automatically.

### A21 — Medium: matrix headings use interval names where they mean semitone slots

**Current:** `components/music/mode-explorer.tsx:149` fixes headings such as `m3` and `M3` for semitone positions.

**Independent example:** in C Lydian-sharp2, D-sharp is an augmented second, but the grid places it under `m3`. In C altered, F-flat is a diminished fourth, but appears under `M3`.

**Change:** use semitone counts in the common grid, or show enharmonic alternatives / each note's actual interval. The note positions are correct; the headings should not override letter-based interval spelling. [Puget Sound: Introduction to Intervals](https://musictheory.pugetsound.edu/mt21c/IntervalsIntroduction.html)

### A22 — Medium: historical key characters must not be transferred by pitch class

**Current:** `lib/music/keys.ts:83–85` makes `keyCharacter` match enharmonic keys by pitch class; its comment gives G-sharp minor → A-flat minor as an example.

**Comparison:** that equality is appropriate for this app's equal-tempered note engine. It is not evidence that differently spelled keys were interchangeable in the historical tuning and expressive framework being described. Schubart's text is a historical aesthetic account. [Schubart / DuBois translation record](https://www.jstor.org/stable/40244377)

**Change:** use exact historical spellings, show explicit historical enharmonic caveats, and retain the existing “historical colour rather than rules” introduction. Add that historical context to the circle's character panel too. The circle component calls this helper in `components/music/circle-of-fifths.tsx:48–49`; the calculation confirms that selecting B major's relative G-sharp minor retrieves the entry for A-flat minor. Rendering was not exercised in this audit.

### A23 — Medium: distinguish incomplete content from wrong content

**Current gaps, established from the local inventory:**

- The key-character table has 22 entries. E minor and C-sharp minor are absent even after allowing pitch-class equivalence. Do not invent descriptions to reach 24; recover them from a cited historical edition or mark them unavailable.
- Pentatonic modes 4 and 5 are computed but their explanatory blocks remain TODOs. Their formulas pass: `1 b3 4 b6 b7` and `1 2 4 5 6`.
- Minor blues (`1 b3 4 b5 5 b7`) is missing as a named scale while major blues is present. Symmetrical diminished and bebop collections are also not selectable. These are useful expansion candidates, not mistakes in the current nine-scale list. Berklee includes the symmetrical diminished scale in its jazz curriculum. [Berklee: Jazz Scales](https://online.berklee.edu/takenote/jazz-improvisation-10-scales/)
- A plain minor-major seventh (`1 b3 5 7`) is used in generated harmony but lacks its own chord-library row; minor-major ninth and eleventh rows are present.
- Cultural or alternative mode aliases such as “Javanese,” “Hindu,” “Man Gong,” and “Ritsusen” are not individually established by the sources reviewed. Keep their formula identity separate from any claim about the associated musical tradition.

### A24 — Low: several introductory statements need tighter wording

These are clarity improvements, not reasons to replace the working note engine:

- White keys have natural-note names but can also be spelled E-sharp, B-sharp, F-flat, or C-flat in context. The enharmonic examples are useful; connect that qualification to the white/black-key introduction.
- The generic seventh-degree table says “leading tone”; specify the major/raised-seventh context. A seventh a whole step below the tonic is a subtonic, as the Mixolydian explanation already states.
- “Relative minor” describes a relationship to another key; it is not a context-free synonym for every natural-minor scale.
- “Perfect cadence” for V–I is valid in common British terminology. If using the US term “perfect authentic cadence,” add root position and a tonic in the upper voice. Do not mark the existing regional terminology wrong. [Puget Sound: Perfect Authentic Cadence](https://musictheory.pugetsound.edu/mt21c/PerfectAuthenticCadence.html)
- A tritone's inversion has the same six-semitone size, but its spelled quality changes: A4 ↔ d5. “Its own inversion” should be qualified by pitch class / size.
- The natural-minor explorer defaults to A while its static example fact uses C. Both examples are valid; label the static example clearly so it is not mistaken for the current selection.
- `AllKeysPanel` promises a “usual key signature” even for collections without one unique conventional signature. Describe its actual spelling heuristic as a preference for fewer / simpler accidentals.

### A25 — Medium: circle neighbour labels do not follow the selected key's spelling

**Current:** `components/music/circle-of-fifths.tsx` derives the “Neighbours” IV/V labels from adjacent circle slots' default major names, even when the selected key uses another spelling.

**Independent calculation:** F-sharp major displays IV B and V D-flat; its correctly spelled V is C-sharp. Selecting G-flat displays IV B rather than C-flat. Selecting C-flat displays IV E and V F-sharp rather than F-flat and G-flat. D-flat and C-sharp selections each have a similar neighbour mismatch. Five of the 15 available key spellings have at least one such discrepancy.

**Change:** derive IV and V from the selected major scale, as the cadence/chord table already does. The current labels have the right equal-tempered pitch classes but the wrong diatonic letters for the selected key. The JSON's `circlePresentation` records every case. Letter-based degree identity is the relevant distinction. [Puget Sound: Introduction to Intervals](https://musictheory.pugetsound.edu/mt21c/IntervalsIntroduction.html)

## What already agrees with the references

The following should be preserved:

- Major: `0 2 4 5 7 9 11`; natural minor: `0 2 3 5 7 8 10`; harmonic minor: `0 2 3 5 7 8 11`; fixed ascending/jazz melodic minor: `0 2 3 5 7 9 11`. The minor-scale relationships agree with the university teaching examples. [Puget Sound: Minor Scales](https://musictheory.pugetsound.edu/mt21c/MinorScales.html)
- The five-note major/minor pentatonic, major-blues, chromatic, and whole-tone pitch sets are internally consistent. Their formulas and all root spellings are listed in the inventory.
- All seven major modes, seven harmonic-minor modes, seven melodic-minor modes, and five pentatonic modes match the independent degree patterns used in the checks. This confirms formula derivation; unusual aliases still require separate sourcing.
- Major, natural-minor, harmonic-minor, and melodic-minor triad/seventh quality sequences pass in all 12 roots. In particular, fully diminished seventh uses `bb7`; half-diminished uses `b7`.
- The circle's 15 standard major spellings have the expected accidental counts/orders and relative minors, including C-flat/B, G-flat/F-sharp, and D-flat/C-sharp enharmonic choices. [Major Scales and Key Signatures](https://viva.pressbooks.pub/openmusictheory/chapter/major-scales/)
- Standard tuning is low to high E A D G B E, with a major third between G and B and fourths elsewhere. This agrees with the MIDI tuning data and the double-note explanation. [Fender: Standard Tuning](https://www.fender.com/articles/setup/standard-tuning-how-eadgbe-came-to-be)
- The explicit 4/4 duration values, dotted-note arithmetic, and basic G7 ↔ D-flat7 shared-guide-tone example are sound under the stated equal-temperament assumptions.

## Existing image and link review

| Asset | Observation |
| --- | --- |
| `public/notes/c-major-scale-tab.jpeg` | C D E F G A B C; tab corresponds to A-string fret 3 through B-string fret 1. No discrepancy identified. |
| `public/notes/c-major-intervals-tab.png` | Returns to the C root between the ascending interval examples. The labels match the illustrated intervals; this is an interval exercise rather than just a consecutive scale run. |
| `public/notes/augmented-diminished.png` | F–C-sharp/C/C-flat and G–E-sharp/E/E-flat/E-double-flat demonstrate the stated size changes. No discrepancy identified. |
| `public/notes/chromatic-ascending.png` | Consecutive ascending semitones with sharps; valid example subject to A19. |
| `public/notes/chromatic-descending.png` | Consecutive descending semitones with flats; valid example subject to A19. |

Both MuseScore references in the intervals lesson were attempted through the web tool. The augmented-interval score returned HTTP 403; the diminished-interval score could not be fetched. Listening, playback in an ordinary signed-in browser, and exact score content remain unverified. Those fetch failures do not establish that the links are broken for a user.

## Reproduce the calculations

From the repository root, using Node 22.18+ with native TypeScript support:

```powershell
node scripts/audit-music-data.mjs
```

The script regenerates `docs/data-inventory.md` and `docs/data-audit-results.json`; it does not edit this report or the application. On the reviewed revision it exits successfully with no failed checks:

| Check group | Cases |
| --- | --- |
| Literal scale references | 9 |
| Literal mode references | 26 |
| Literal common chord references | 30 |
| Scale transpositions | 108 |
| Mode transpositions | 312 |
| Chord transpositions | 888 |
| Complete fretboard maps, frets 0–24 | 420 |
| Generated positions, all supported starts/roots | 2,520 |
| Standard key spellings / signatures / relative minors | 15 |
| Parent-scale triad/seventh quality sequences | 48 |
| Simple interval names and inversions | 15 |

Transposition checks compare letter choice and pitch class with separate arithmetic. Fingering checks establish pitch membership, string counts, fret non-negativity, and ascending note order. They do not establish ergonomic suitability for every player. The chord checks do not constitute 74 independent external endorsements of every symbol/alias. They verify 30 literal common formulas and the calculation of every row's declared formula in every root.

Browser rendering and audio playback were not exercised. No application build was needed for the content-only comparison. This report can therefore identify source-level presentation issues but does not certify every rendered interaction.

## Suggested correction order

1. Correct A01, A05, A08, A09, and A11: these most directly teach the wrong conceptual relationship or interpretation.
2. Qualify A02–A04, A07, A10, and A17–A21; preserve working formulas and clearly state conventions.
3. Align chord labels and duplicates (A12–A16), fix the circle's neighbour spellings (A25), then handle historical sourcing and incomplete content (A22–A23).
4. Apply A24's terminology improvements and verify rendered lessons and external audio when implementing the changes.

## Source register and access limits

All sources below were searched or opened during this review. Full text was available for several sources; some Open Music Theory details were available through indexed excerpts while direct access intermittently returned 403. Links support the specific adjacent claims above, rather than every claim in this report.

| Source | Use / limit |
| --- | --- |
| [UNSW Acoustics FAQ](https://phys.unsw.edu.au/jw/musFAQ.html) | Relationship of perceived pitch and frequency |
| [Fender Standard Tuning](https://www.fender.com/articles/setup/standard-tuning-how-eadgbe-came-to-be) | Manufacturer's tuning explanation |
| [Puget Sound Minor Scales](https://musictheory.pugetsound.edu/mt21c/MinorScales.html) | Minor forms and classical descent; article text inspected |
| [Open Music Theory: Major Scales](https://viva.pressbooks.pub/openmusictheory/chapter/major-scales/) | Circle and signatures; indexed text |
| [Open Music Theory: Notating Rhythm](https://viva.pressbooks.pub/openmusictheory/chapter/notating-rhythm/) | Durations and dots; indexed text |
| [Open Music Theory: Compound Meter](https://viva.pressbooks.pub/openmusictheory/chapter/compound-meters-and-time-signatures/) | Grouping units into compound beats; indexed text |
| [Puget Sound Identifying Intervals](https://musictheory.pugetsound.edu/mt21c/HowToIdentifyIntervals.html) | Interval quality / major-scale method |
| [Puget Sound Introduction to Intervals](https://musictheory.pugetsound.edu/mt21c/IntervalsIntroduction.html) | Letter-based interval identity |
| [Open Music Theory: Modes and Chromatic Scale](https://viva.pressbooks.pub/openmusictheory/chapter/intro-to-diatonic-modes-and-the-chromatic-scale/) | Chromatic spelling qualification; indexed text |
| [Open Music Theory: Modal Mixture](https://viva.pressbooks.pub/openmusictheory/chapter/modal-mixture/) | Borrowing versus modulation; indexed article text |
| [Puget Sound Tonicization](https://musictheory.pugetsound.edu/mt21c/Tonicization.html) | Applied-dominant definition and diminished-target exclusion; article text inspected |
| [Puget Sound Modulations Without Pivot Chords](https://musictheory.pugetsound.edu/mt21c/ModulationsWithoutPivotChords.html) | Additional modulation approaches |
| [Puget Sound Perfect Authentic Cadence](https://musictheory.pugetsound.edu/mt21c/PerfectAuthenticCadence.html) | US PAC requirements; article text inspected |
| [Berklee Jazz Scales](https://online.berklee.edu/takenote/jazz-improvisation-10-scales/) | Modes, dominant alternatives, altered and diminished collections; article text inspected |
| [Berklee Voice Leading for Guitar](https://online.berklee.edu/takenote/voice-leading-for-guitar/) | Dominants beyond harmonic minor |
| [Macalester Extended Tertian Chords](https://pressbooks.macalester.digital/multimodalmusicianship/chapter/extended-tertian-chords-altered-dominants-2/) | Distinguishing chord membership from chosen voicings; article text inspected |
| [Puget Sound Simple Sus Chords](https://musictheory.pugetsound.edu/mt21c/SimpleSusChords.html) | Introductory suspended-chord terminology |
| [Biamonte, Music Theory Online](https://www.mtosmt.org/issues/mto.08.14.2/mto.08.14.2.biamonte.html) | Scholarly tritone-substitution analysis; article text inspected |
| [Schubart / DuBois, New England Review](https://www.jstor.org/stable/40244377) | Original translated historical source identified through its [translation record](https://graphs.unequaltemperament.com/schubart_voice_index.php); full historical table was not collated against a verified edition |
| [McFarland, Music Theory Online](https://www.mtosmt.org/classic/mto.09.15.2/mto.09.15.2.mcfarland.html) | Scholarly discussion supplying a tetratonic counterexample |

No wholesale copy of external lessons is included. All generated inventories come from the existing local definitions. Claims that require further archival sourcing, listening, or live rendering remain explicitly unverified.
