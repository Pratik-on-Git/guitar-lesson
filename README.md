# Guitar Notes

A personal guitar study companion with 17 lesson topics (82 sections), 18 scales, 26 modes, 72 chord formulas, and an interactive circle of fifths. The supplied *Fretboard Concepts* (2019) is mapped into a chapter guide, all 63 original diagram sheets and 214 numbered practical assignments. Notes and fretboards are generated from spelled degrees in 12-tone equal temperament.

Start at `/book` for the learning path and source atlas. Use `/voicings`, `/arpeggios`, `/harmonization` and `/improvisation` to apply the lessons in any key. `/practice` includes spelling-aware theory questions, fretboard training, metronome, searchable chapter assignments and a browser-local practice log. Generated fingerings are distinguished from the book's numbered source boxes.

## Run

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Before changing framework behavior, read the bundled Next.js documentation indicated in [AGENTS.md](AGENTS.md).

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
- [Current data inventory](docs/data-inventory.md)
- [Generated notes for all selectable roots](docs/data-audit-results.json)
- [Original internet comparison, before corrections](docs/data-audit.md)

Lessons and explorers link their teaching references in the app. Definitions live under `lib/content` and `lib/music`. The original comparison is retained as a dated snapshot; the generated inventory reflects the current corrected definitions. Existing chord bookmarks continue to resolve after entries are renamed or consolidated.

The credited diagram sheets come from the user-supplied PDF for this personal study app. To regenerate diagrams and the original assignment bank, keep the PDF in the repository root and run the following optional extraction tools (Python with `pymupdf` installed):

```powershell
python scripts/extract-book-diagrams.py
python scripts/extract-book-assignments.py
```

The app does not need Python or the PDF at runtime. Raw extracted prose and QA screenshots remain in ignored `.local/` files. Synthesized audio is generated in the browser after a play action; no recordings or external audio service are required. Historical key-character descriptions retain their separate sources and exact key spellings.
