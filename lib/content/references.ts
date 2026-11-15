export type Reference = { title: string; href: string };
import { BOOK_TITLE, BOOK_TOPIC_PAGES } from "./book.ts";
import { THEORY_BOOK, THEORY_TOPIC_PAGES } from "./theory-book.ts";

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
  ...Object.fromEntries(Object.entries(THEORY_TOPIC_PAGES).map(([slug, pages]) => [slug, [{ title: `${THEORY_BOOK.title} · PDF pp. ${pages} · chapter guide & corrections`, href: THEORY_BOOK.href }]])),
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
  "indian-classical": [
    { title: "Kerala SCERT · Music Class XI: tala structure", href: "https://samagra.kite.kerala.gov.in/files/samagra-resource/uploads/tbookscmq/Class_XI/Music/Music.pdf" },
    { title: "Tanarang · Yaman", href: "https://tanarang.com/raag-yaman/" },
    { title: "Tanarang · Durga", href: "https://tanarang.com/raag-durga/" },
    { title: "Tanarang · Malkauns", href: "https://tanarang.com/raag-malkauns/" },
    { title: "NIOS · Carnatic music history (chapter 1)", href: "https://nios.ac.in/media/documents/Carnatic_Music_243/carnaticmusicbook1/ch1.pdf" },
    { title: "NIOS · Carnatic concepts: svara, shruti, gamaka, mela and raga (chapter 2)", href: "https://nios.ac.in/media/documents/Carnatic_Music_243/carnaticmusicbook1/ch2.pdf" },
    { title: "NIOS · Carnatic composer biographies (chapter 3)", href: "https://nios.ac.in/media/documents/Carnatic_Music_243/carnaticmusicbook1/ch3.pdf" },
    { title: "NIOS · Hindustani elements of raga (chapter 2)", href: "https://nios.ac.in/media/documents/Hindustani_Music_242/hindustanimusictheorybook1/HMB1Ch2.pdf" },
    { title: "NIOS · Hindustani elements of tala (chapter 3)", href: "https://nios.ac.in/media/documents/Hindustani_Music_242/hindustanimusictheorybook1/HMB1Ch3.pdf" },
    { title: "SPMVV · Musical Concepts I: melas, numbering and janya classification", href: "https://spmvv.ac.in/ddefiles/ugcproposals/2025/05/MAMUD1_2_Musical_Concepts_I.pdf" },
    { title: "SPMVV · Origin and Evolution of Music I: historical tonal systems", href: "https://spmvv.ac.in/ddefiles/ugcproposals/2025/05/MAMUD1_1_Origin_and_Evolution_of_Music_I.pdf" },
    { title: "Nathaniel School of Music · Complete numbered melakarta list", href: "https://melakarta.nathanielschool.com/learn" },
    { title: "Rao & Rao · An Overview of Hindustani Music in the Context of Computational Musicology", href: "https://dspace.library.iitb.ac.in/jspui/handle/100/16817?mode=simple" },
    { title: "Tanarang · Bhimpalasi teaching description and renditions", href: "https://tanarang.com/raag-bheempalasi/" },
    { title: "Tanarang · Bageshree and alternative ascending forms", href: "https://tanarang.com/raag-bageshree/" },
    { title: "Tanarang · Dhani and its occasional Re variant", href: "https://tanarang.com/raag-dhani/" },
    { title: "Tanarang · Hindustani terms and notation", href: "https://tanarang.com/glossary-of-terms-in-hindustani-classical-music/" },
    { title: "Metropolitan Museum of Art · Ragamala families (educator resource)", href: "https://resources.metmuseum.org/resources/metpublications/pdf/The_Art_of_South_and_Southeast_Asia_A_Resource_for_Educators.pdf" },
  ],
};

export const SCALE_REFERENCES: Reference[] = [major, minor, modes, jazz, bebop];
export const MODE_REFERENCES: Reference[] = [minor, modes, jazz];
export const CHORD_REFERENCES: Reference[] = [chords, { title: "University of Puget Sound · Suspended chords", href: "https://musictheory.pugetsound.edu/mt21c/SimpleSusChords.html" }];
