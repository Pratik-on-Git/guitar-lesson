import {
  AudioWaveform,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Circle,
  Drum,
  Guitar,
  KeyRound,
  Layers,
  LayoutDashboard,
  Library,
  ListMusic,
  Music2,
  Palette,
  Ruler,
  Shapes,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { MODE_FAMILIES } from "./music/modes.ts";
import { SCALES } from "./music/scales.ts";
import { RAGA_LESSONS } from "./content/raga-curriculum.ts";

/*
 * One map of the study app: the sidebar, breadcrumbs, search and the
 * study tracker all read from here. Each page's href is its progress key.
 */

export type NavLeaf = { title: string; href: string };
export type NavItem = NavLeaf & {
  icon: LucideIcon;
  description: string;
  part?: string;
  /** Sub-pages shown nested under the item. */
  children?: NavLeaf[];
};
export type NavGroup = { title: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    title: "Study",
    items: [{ title: "Overview", href: "/", icon: LayoutDashboard, description: "Progress and every topic at a glance." }],
  },
  {
    title: "Source library",
    items: [
      { title: "Music Theory book guide", href: "/books/music-theory", icon: BookOpen, description: "Seven parts, 61 redrawn figures, exercises and corrections." },
      { title: "Book guide & atlas", href: "/book", icon: BookOpen, description: "Chapter guide, corrections and all 63 diagram sheets in any key." },
      { title: "Fretboard system", href: "/learn/fretboard-system", icon: Guitar, description: "Tuning, notes, root anchors and Double Note construction." },
    ],
  },
  {
    title: "Foundations",
    items: [
      { title: "Sound & pitch", href: "/learn/sound-and-pitch", icon: AudioWaveform, description: "Sound, frequency, pitch, notes and timbre." },
      { title: "Notes & octaves", href: "/learn/notes", icon: Music2, description: "Naturals, accidentals, enharmonics, octaves." },
      { title: "Tuning & cents", href: "/learn/tuning", icon: AudioWaveform, description: "Reference pitch, frequency ratios and fine tuning." },
      { title: "Steps & intervals", href: "/learn/intervals", icon: Ruler, description: "Half and whole steps and every interval." },
      { title: "Listening & ear training", href: "/learn/listening", icon: AudioWaveform, description: "Sing, compare and recognize pitch relationships." },
      { title: "Listening lab", href: "/listening", icon: AudioWaveform, description: "Intervals, modal drone, tuning and expression." },
    ],
  },
  {
    title: "Rhythm & meter",
    items: [
      { title: "Rhythm foundations", href: "/learn/rhythm", icon: Drum, description: "Pulse, meter, note values, rests and dots." },
      { title: "Meter & cross-rhythms", href: "/learn/rhythm-and-meter", icon: Drum, description: "Simple, compound and additive meter; tuplets and layered pulses." },
      { title: "Rhythm lab", href: "/rhythm-lab", icon: Drum, description: "17 rhythm units, source sequences and cross-rhythm playback." },
    ],
  },
  {
    title: "Keys",
    items: [
      { title: "Circle of fifths", href: "/circle-of-fifths", icon: Circle, description: "Every key, its signature and relative minor." },
      { title: "Relative keys", href: "/learn/keys", icon: KeyRound, description: "Read signatures, relate major/minor and understand modulation." },
      { title: "Key characters", href: "/learn/key-characters", icon: Palette, description: "Historical associations attributed to keys." },
    ],
  },
  {
    title: "Scales",
    items: [
      { title: "What a scale is", href: "/learn/scales", icon: BookOpen, description: "Scales, harmony, melody, root and scale types." },
      {
        title: "Scale explorer",
        href: "/scales",
        icon: ListMusic,
        description: "Every scale in any key, on the neck and keyboard.",
        children: SCALES.map((s) => ({ title: s.short, href: `/scales/${s.id}` })),
      },
      { title: "Symmetric scales", href: "/learn/symmetric-scales", icon: Shapes, description: "Whole tone, augmented and both diminished orientations." },
    ],
  },
  {
    title: "Indian Classical Music",
    items: [
      { title: "Indian classical & raga", href: "/learn/indian-classical", icon: Music2, description: "Hindustani and Carnatic svaras, raga grammar, thaats, 72 melakartas, gamakas and tala." },
      ...RAGA_LESSONS.map((lesson) => ({ title: lesson.label, href: `/learn/${lesson.slug}`, icon: lesson.partIndex === 1 ? ChartNoAxesColumnIncreasing : lesson.partIndex === 2 ? Music2 : Layers, description: lesson.description, part: lesson.part })),
    ],
  },
  {
    title: "Modes",
    items: [
      { title: "What a mode is", href: "/learn/modes", icon: Shapes, description: "Modes, diatonic, and finding any mode's notes." },
      {
        title: "Mode families",
        href: "/modes/major",
        icon: Layers,
        description: "Major, harmonic minor, melodic minor and pentatonic modes.",
        children: MODE_FAMILIES.map((f) => ({ title: f.short, href: `/modes/${f.id}` })),
      },
    ],
  },
  {
    title: "Chords & harmony",
    items: [
      { title: "Chords & degrees", href: "/learn/chords", icon: Guitar, description: "Chords, scale degrees, symbols and numbers." },
      { title: "Chord library", href: "/chords", icon: Library, description: "76 chord formulas, spelled in any key." },
      { title: "Extended & altered chords", href: "/learn/extended-chords", icon: Layers, description: "Extensions, alterations, omissions and chord identity." },
      { title: "Slash, quartal & polychords", href: "/learn/chord-structures", icon: Layers, description: "Bass notes, figured bass, fourth stacks and layered chords." },
      { title: "Harmony lab", href: "/harmony-lab", icon: Library, description: "Construct extensions, slash sonorities, fourth stacks and polychords." },
      { title: "Inversions & drops", href: "/learn/voicings", icon: Layers, description: "Bass inversions, root-position shapes, drop 2 and drop 3." },
      { title: "Voicing workbench", href: "/voicings", icon: Guitar, description: "Transpose chord grips, inversions and string sets." },
      { title: "Harmony", href: "/learn/harmony", icon: Waypoints, description: "Secondary, substitute and tritone dominants." },
      { title: "Harmonic function", href: "/learn/harmonic-function", icon: Waypoints, description: "Tonic, predominant, dominant and note roles in context." },
      { title: "Progressions & cadences", href: "/learn/progressions", icon: Waypoints, description: "Roman numerals, transposition, cadences, blues and harmonic rhythm." },
      { title: "Progression workbench", href: "/progressions", icon: ListMusic, description: "Fifteen progressions, reharmonization and measured voice leading." },
    ],
  },
  {
    title: "Arpeggios & application",
    items: [
      { title: "Arpeggio lessons", href: "/learn/arpeggios", icon: Music2, description: "Four triad and seven seventh-chord families." },
      { title: "Arpeggio explorer", href: "/arpeggios", icon: Guitar, description: "Chord tones, two-octave lines and position windows." },
      { title: "Harmonization lessons", href: "/learn/harmonization", icon: Layers, description: "Horizontal and vertical scale/arpeggio practice." },
      { title: "Harmonization workbench", href: "/harmonization", icon: Waypoints, description: "Every diatonic chord inside a scale or fret region." },
    ],
  },
  {
    title: "Composition & expression",
    items: [
      { title: "Melody & musical ideas", href: "/learn/melody", icon: Music2, description: "Motifs, contour, phrases, repetition and development." },
      { title: "Expression & movement", href: "/learn/expression", icon: Palette, description: "Timbre, dynamics, articulation, drama and extended techniques." },
      { title: "Composition & improvisation", href: "/learn/composition", icon: Music2, description: "A practical process for writing, revising and performing ideas." },
      { title: "Composition sketchbook", href: "/composition", icon: Music2, description: "Edit, hear, save and export a four-bar melodic idea." },
    ],
  },
  {
    title: "Improvisation & practice",
    items: [
      { title: "Improvisation methods", href: "/learn/improvisation", icon: Music2, description: "Modal colour, scale choices, chromatic approaches and phrasing." },
      { title: "Pentatonic substitutions", href: "/learn/pentatonic-substitutions", icon: Shapes, description: "Modal and altered colours from familiar five-note shapes." },
      { title: "Scale-choice workbench", href: "/improvisation", icon: ListMusic, description: "Chord/scale choices and transposable pentatonic substitutions." },
      { title: "Reharmonization", href: "/learn/reharmonization", icon: Waypoints, description: "Alter, add, replace or remove chords while hearing the phrase." },
      { title: "Harmony systems", href: "/learn/harmony-systems", icon: Layers, description: "Tonal, modal, polytonal, atonal, serial and free approaches." },
      { title: "Outside playing", href: "/learn/outside-playing", icon: Shapes, description: "Chromatic approaches, side-slipping, layered centres and return." },
      { title: "Practice studio", href: "/practice", icon: Drum, description: "Theory quizzes, fretboard training, metronome and saved assignments." },
    ],
  },
];

/** Every page that can be marked as studied, in reading order. */
export const STUDY_PAGES: (NavLeaf & { group: string })[] = NAV.slice(1).flatMap((group) =>
  group.items.flatMap((item) =>
    item.children
      ? item.children.map((child) => ({ ...child, title: `${child.title}`, group: group.title }))
      : [{ title: item.title, href: item.href, group: group.title }],
  ),
);

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb trail for a pathname: Overview › group › item › child. Groups
 * are labels, not pages, so they carry no href; the last crumb is the
 * current page.
 */
export function crumbsFor(pathname: string): Crumb[] {
  const home: Crumb = { label: "Overview", href: "/" };
  if (pathname === "/design-system") return [home, { label: "Design system" }];
  for (const group of NAV) {
    for (const item of group.items) {
      const child = item.children?.find((c) => c.href === pathname);
      if (child) {
        // A parent whose href is one of its own children (Mode families → Major) is not a separate page.
        const parentIsPage = !item.children?.some((c) => c.href === item.href);
        return [home, { label: group.title }, { label: item.title, href: parentIsPage ? item.href : undefined }, { label: child.title }];
      }
      if (item.href === pathname) return group.title === "Study" ? [{ label: item.title }] : [home, { label: group.title }, { label: item.title }];
    }
  }
  return [];
}

/** The same trail as plain labels. */
export function trailFor(pathname: string): string[] {
  return crumbsFor(pathname).map((c) => c.label);
}

/** The first page not yet marked studied, in reading order. */
export function nextUnstudied(studied: string[]) {
  return STUDY_PAGES.find((p) => !studied.includes(p.href));
}

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
