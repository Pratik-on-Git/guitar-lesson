# Guitar Notes

A personal guitar-theory study app with lessons, 14 scales, 26 modes, 72 chord formulas, and an interactive circle of fifths. Notes and fretboards are generated from spelled degrees in 12-tone equal temperament. Historical key-character descriptions are matched by exact key spelling.

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

The data audit uses Node's native TypeScript support (tested with Node 26.5.0). It checks formula references, transposition, spelling, fretboards, harmony, historical lookup, legacy chord IDs and targeted regressions. It regenerates the inventory and JSON results without fetching websites.

Browser tests use Chromium against a production server started automatically on port 3173. Build first. They cover all study routes, important interactions and mobile overflow, without requiring an existing development server. Generated Playwright reports and traces are ignored by Git.

## Content and sources

- [Implemented corrections and verification](docs/data-corrections.md)
- [Current data inventory](docs/data-inventory.md)
- [Generated notes for all selectable roots](docs/data-audit-results.json)
- [Original internet comparison, before corrections](docs/data-audit.md)

Lessons and explorers link their teaching references in the app. Definitions live under `lib/content` and `lib/music`. The original comparison is retained as a dated snapshot; the generated inventory reflects the current corrected definitions. Existing chord bookmarks continue to resolve after entries are renamed or consolidated.
