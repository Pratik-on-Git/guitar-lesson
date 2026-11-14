import {
  AudioWaveform,
  BookOpen,
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

/*
 * One map of the study app: the sidebar, breadcrumbs, search and the
 * study tracker all read from here. Each page's href is its progress key.
 */

export type NavLeaf = { title: string; href: string };
export type NavItem = NavLeaf & {
  icon: LucideIcon;
  description: string;
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
    title: "Fretboard Concepts",
    items: [
      { title: "Book guide & atlas", href: "/book", icon: BookOpen, description: "Chapter guide, source corrections and all 63 diagram sheets." },
      { title: "Fretboard system", href: "/learn/fretboard-system", icon: Guitar, description: "Tuning, notes, root anchors and Double Note construction." },
    ],
  },
  {
    title: "Foundations",
    items: [
      { title: "Sound & pitch", href: "/learn/sound-and-pitch", icon: AudioWaveform, description: "Sound, frequency, pitch, notes and timbre." },
      { title: "Notes & octaves", href: "/learn/notes", icon: Music2, description: "Naturals, accidentals, enharmonics, octaves." },
      { title: "Rhythm", href: "/learn/rhythm", icon: Drum, description: "Pulse, meter, note values, rests, dots." },
      { title: "Steps & intervals", href: "/learn/intervals", icon: Ruler, description: "Half and whole steps and every interval." },
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
      { title: "Chord library", href: "/chords", icon: Library, description: "74 chord formulas, spelled in any key." },
      { title: "Inversions & drops", href: "/learn/voicings", icon: Layers, description: "Bass inversions, root-position shapes, drop 2 and drop 3." },
      { title: "Voicing workbench", href: "/voicings", icon: Guitar, description: "Transpose chord grips, inversions and string sets." },
      { title: "Harmony", href: "/learn/harmony", icon: Waypoints, description: "Secondary, substitute and tritone dominants." },
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
    title: "Improvisation & practice",
    items: [
      { title: "Improvisation methods", href: "/learn/improvisation", icon: Music2, description: "Modal colour, scale choices, chromatic approaches and phrasing." },
      { title: "Pentatonic substitutions", href: "/learn/pentatonic-substitutions", icon: Shapes, description: "Modal and altered colours from familiar five-note shapes." },
      { title: "Scale-choice workbench", href: "/improvisation", icon: ListMusic, description: "Chord/scale choices and transposable pentatonic substitutions." },
      { title: "Practice studio", href: "/practice", icon: Drum, description: "Theory quizzes, fretboard training, metronome and saved assignments." },
    ],
  },
  {
    title: "Keys",
    items: [
      { title: "Circle of fifths", href: "/circle-of-fifths", icon: Circle, description: "Every key, its signature and relative minor." },
      { title: "Relative keys", href: "/learn/keys", icon: KeyRound, description: "Relative major/minor and modulation." },
      { title: "Key characters", href: "/learn/key-characters", icon: Palette, description: "The mood of each key." },
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
