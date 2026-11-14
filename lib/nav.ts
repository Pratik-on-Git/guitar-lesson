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
      { title: "Harmony", href: "/learn/harmony", icon: Waypoints, description: "Secondary, substitute and tritone dominants." },
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

/** Breadcrumb trail for a pathname: group › item › child. */
export function trailFor(pathname: string): string[] {
  for (const group of NAV) {
    for (const item of group.items) {
      const child = item.children?.find((c) => c.href === pathname);
      if (child) return [group.title, item.title, child.title];
      if (item.href === pathname) return group.title === "Study" ? [item.title] : [group.title, item.title];
    }
  }
  return [];
}

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
