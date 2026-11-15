# Guitar Notes

A personal guitar study companion built from two supplied books, *Fretboard Concepts* (Papadopoulos, 2019) and *Music Theory: From Beginner to Expert* (Carter, 2018), plus the supplied *Indian Classical Raga Theory* notes. It covers 31 lesson topics (173 sections), 18 scales, 26 modes, 76 chord formulas, an interactive circle of fifths, and labs for voicings, arpeggios, harmonization, progressions, rhythm, listening and composition. Every book illustration is drawn in code: the 63 Fretboard Concepts sheets come from an exact transcription (7,016 checked notes) and can be moved to any key, and the 61 Carter figures and the original notation examples are computed by the app's theory engine. The raga lesson includes all 72 melakartas in a corrected table. `public/` ships no images. Chords appear as playable chord boxes as well as letter names.

Start at `/book` for the learning path and source atlas. Use `/voicings`, `/arpeggios`, `/harmonization` and `/improvisation` to apply the lessons in any key. `/practice` includes spelling-aware theory questions, fretboard training, metronome, searchable chapter assignments and a browser-local practice log. Generated fingerings are distinguished from the book's numbered source boxes.

## Run

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Before changing framework behavior, read the bundled Next.js documentation indicated in [AGENTS.md](AGENTS.md).

Sign-up or sign-in is required to access the application. Individual accounts are available at `/sign-up`, `/sign-in`, and `/account`. See [authentication setup](docs/authentication.md) for MongoDB, environment variables, Google OAuth configuration, and account testing.

## Verify

```powershell
npm run test:data
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

The data audit uses Node's native TypeScript support (tested with Node 26.5.0). It checks formula references, transposition, spelling, fretboards, harmony, historical lookup, legacy chord IDs and targeted regressions. The book audit additionally checks all source assets/links, assignment destinations, drop-voicing recipes and guitar grips, Double Note constructions, symmetric-scale periods, substitutions and quiz answers. It regenerates the inventory and JSON results without fetching websites.

Browser tests use Chromium against a production server started automatically on port 3173. Build first. They cover all study routes, important interactions and mobile overflow, without requiring an existing development server. Generated Playwright reports and traces are ignored by Git.

## Content and sources

- [Implemented corrections and verification](docs/data-corrections.md)
- [Book review, chapter coverage and source corrections](docs/book-review.md)
- [Raga PDF review, page coverage, references and variant decisions](docs/raga-review.md)
- [Current data inventory](docs/data-inventory.md)
- [Generated notes for all selectable roots](docs/data-audit-results.json)
- [Original internet comparison, before corrections](docs/data-audit.md)

Lessons and explorers link their teaching references in the app. Definitions live under `lib/content` and `lib/music`. The original comparison is retained as a dated snapshot; the generated inventory reflects the current corrected definitions. Existing chord bookmarks continue to resolve after entries are renamed or consolidated.

Open `/learn/indian-classical` for the raga notes: Hindustani and Carnatic svaras, raga grammar, ten thaats, all 72 melakartas, ornamentation and tala. Pitch tables are comparisons with equal temperament, not performance tuning prescriptions. Documented teaching variants and the PDF's unattributed symbolic beliefs are labelled explicitly. `npm run test:data` also runs the raga audit; raw review PDFs and images are not required at runtime.

The diagram data comes from the user-supplied PDFs for this personal study app. To regenerate it, keep the PDFs in the repository root and run the optional extraction tools (Python with `pymupdf`, `numpy` and `pillow`):

```powershell
python scripts/extract-book-diagrams.py   # transcribes all 63 sheets into lib/content/fretboard-sheets.ts
python scripts/extract-book-assignments.py
python scripts/extract-theory-book.py      # figure list and audio-link provenance
```

`extract-book-diagrams.py` reads each embedded diagram image, finds the strings, fret wires and printed fret numbers, classifies every marker (note, boxed anchor root, Double Note triangle) and fails if any marker is outside its sheet's formula. Visual components live in `components/visuals/` (neck diagrams, chord boxes, keyboards, interval grids, VexFlow notation, rhythm counts and charts). Notation uses [VexFlow](https://www.vexflow.com/) (MIT), loaded only on pages that show it.

The app does not need Python or the PDF at runtime. Raw extracted prose and QA screenshots remain in ignored `.local/` files. Synthesized audio is generated in the browser after a play action; no recordings or external audio service are required. Historical key-character descriptions retain their separate sources and exact key spellings.
