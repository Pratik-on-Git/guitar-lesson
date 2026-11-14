export type Reference = { title: string; href: string };
import { BOOK_TITLE, BOOK_TOPIC_PAGES } from "./book.ts";

const acoustics = { title: "UNSW · Sound, frequency and pitch", href: "https://phys.unsw.edu.au/jw/musFAQ.html" };
const major = { title: "Open Music Theory · Major scales and key signatures", href: "https://viva.pressbooks.pub/openmusictheory/chapter/major-scales/" };
const minor = { title: "University of Puget Sound · Minor scales", href: "https://musictheory.pugetsound.edu/mt21c/MinorScales.html" };
const modes = { title: "Open Music Theory · Modes and chromatic scales", href: "https://viva.pressbooks.pub/openmusictheory/chapter/intro-to-diatonic-modes-and-the-chromatic-scale/" };
const intervals = { title: "University of Puget Sound · Intervals", href: "https://musictheory.pugetsound.edu/mt21c/IntervalsIntroduction.html" };
const jazz = { title: "Berklee · Jazz scales and dominant alternatives", href: "https://online.berklee.edu/takenote/jazz-improvisation-10-scales/" };
const bebop = { title: "University of Puget Sound · Major bebop scale", href: "https://musictheory.pugetsound.edu/mt21c/harmonizing-bebop-scale.html" };
const chords = { title: "Macalester College · Extended chords and voicing", href: "https://pressbooks.macalester.digital/multimodalmusicianship/chapter/extended-tertian-chords-altered-dominants-2/" };
const tonicization = { title: "University of Puget Sound · Tonicization and applied dominants", href: "https://musictheory.pugetsound.edu/mt21c/Tonicization.html" };

export const HISTORY_REFERENCES: Reference[] = [
  { title: "Schubart / DuBois · Historical source record (1806 / 2004 translation)", href: "https://www.jstor.org/stable/40244377" },
  { title: "Historical key-character excerpt attributed to Schubart / Steblin", href: "https://biteyourownelbow.com/keychar.htm" },
  { title: "Hugo Fastl, TU Munich · Minor-key character table, page 4 (paraphrase source)", href: "https://mediatum.ub.tum.de/doc/1138386/1138386.pdf#page=4" },
];

export const TOPIC_REFERENCES: Record<string, Reference[]> = {
  ...Object.fromEntries(Object.entries(BOOK_TOPIC_PAGES).map(([slug, pages]) => [slug, [{ title: `${BOOK_TITLE} · pp. ${pages} · book guide`, href: "/book" }]])),
  "sound-and-pitch": [acoustics],
  notes: [major, intervals],
  rhythm: [
    { title: "Open Music Theory · Note values and dots", href: "https://viva.pressbooks.pub/openmusictheory/chapter/notating-rhythm/" },
    { title: "Open Music Theory · Compound meter", href: "https://viva.pressbooks.pub/openmusictheory/chapter/compound-meters-and-time-signatures/" },
  ],
  intervals: [intervals],
  scales: [major, minor, jazz],
  modes: [modes, jazz],
  chords: [chords],
  harmony: [tonicization, chords, { title: "Music Theory Online · Tritone substitution", href: "https://www.mtosmt.org/issues/mto.08.14.2/mto.08.14.2.biamonte.html" }],
  keys: [tonicization, { title: "Open Music Theory · Modal mixture / borrowing", href: "https://viva.pressbooks.pub/openmusictheory/chapter/modal-mixture/" }, { title: "University of Puget Sound · Modulation approaches", href: "https://musictheory.pugetsound.edu/mt21c/ModulationsWithoutPivotChords.html" }],
  "key-characters": HISTORY_REFERENCES,
};

export const SCALE_REFERENCES: Reference[] = [major, minor, modes, jazz, bebop];
export const MODE_REFERENCES: Reference[] = [minor, modes, jazz];
export const CHORD_REFERENCES: Reference[] = [chords, { title: "University of Puget Sound · Suspended chords", href: "https://musictheory.pugetsound.edu/mt21c/SimpleSusChords.html" }];
