import { TOPICS } from "./content/topics.ts";
import { CHORDS } from "./music/chords.ts";
import { MODE_FAMILIES } from "./music/modes.ts";
import { SCALES } from "./music/scales.ts";
import { NAV } from "./nav.ts";
import { BOOK_DIAGRAMS } from "./content/book.ts";
import { BOOK_ASSIGNMENTS } from "./content/book-assignments.ts";
import { THEORY_CHAPTERS, THEORY_CORRECTIONS } from "./content/theory-book.ts";
import { THEORY_FIGURES } from "./content/theory-book-assets.ts";

/* Flat index for the Ctrl+K search: pages, sections, scales, modes and chords. */

export type SearchEntry = {
  title: string;
  /** Where it lives, shown under the title. */
  context: string;
  href: string;
  kind: "Page" | "Section" | "Scale" | "Mode" | "Chord";
  /** Extra words to match on. */
  keywords: string;
};

const plain = (text: string) =>
  text.replace(/♯/g, "#").replace(/♭/g, "b").replace(/𝄫/g, "bb").replace(/𝄪/g, "x").replace(/ø/g, "half diminished");

function build(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const figure of THEORY_FIGURES) entries.push({ title: `${figure.title} · PDF p. ${figure.page}`, context: "Carter · source atlas", href: `/books/music-theory?figure=${figure.id}#source-figures`, kind: "Section", keywords: "Nicolas Carter Music Theory From Beginner to Expert original figure comparison table" });
  for (const chapter of THEORY_CHAPTERS) entries.push({ title: chapter.title, context: "Music Theory book guide", href: `/books/music-theory#${chapter.id}`, kind: "Section", keywords: `${chapter.summary} ${chapter.lessons.map((l) => l.title).join(" ")}` });
  for (const entry of THEORY_CORRECTIONS) entries.push({ title: entry.title, context: "Carter · source corrections", href: "/books/music-theory#corrections", kind: "Section", keywords: entry.text });
  for (const sheet of BOOK_DIAGRAMS) entries.push({ title: `${sheet.title} · source p. ${sheet.page}`, context: `Book atlas · ${sheet.chapter}`, href: `/book?page=${sheet.page}`, kind: "Section", keywords: `Yiannis Papadopoulos Fretboard Concepts source diagram boxes positions ${sheet.chapter}` });
  for (const chapter of new Set(BOOK_ASSIGNMENTS.map((a) => a.chapter))) entries.push({ title: `${chapter} assignments`, context: "Practice studio · source exercise bank", href: "/practice#source-assignments", kind: "Section", keywords: BOOK_ASSIGNMENTS.filter((a) => a.chapter === chapter).map((a) => a.prompt).join(" ") });

  for (const group of NAV) {
    for (const item of group.items) {
      entries.push({ title: item.title, context: group.title, href: item.href, kind: "Page", keywords: item.description });
    }
  }

  for (const topic of TOPICS) {
    for (const section of topic.sections) {
      const words = section.blocks
        .map((b) => ("term" in b ? b.term : "") + " " + ("text" in b ? b.text : "") + " " + (b.type === "table" ? b.rows.flat().join(" ") : b.type === "list" ? b.items.join(" ") : ""))
        .join(" ")
        .slice(0, 400);
      entries.push({
        title: section.title,
        context: topic.title,
        href: `/learn/${topic.slug}#${section.id}`,
        kind: "Section",
        keywords: words,
      });
    }
  }

  for (const scale of SCALES) {
    entries.push({
      title: scale.name,
      context: `Scale explorer · ${scale.family}`,
      href: `/scales/${scale.id}`,
      kind: "Scale",
      keywords: [scale.formula.join(" "), ...(scale.aka ?? [])].join(" "),
    });
  }

  for (const family of MODE_FAMILIES) {
    for (const mode of family.modes) {
      entries.push({
        title: mode.name,
        context: family.name,
        href: `/modes/${family.id}?mode=${mode.id}`,
        kind: "Mode",
        keywords: [mode.summary, ...(mode.aka ?? [])].join(" "),
      });
    }
  }

  for (const chord of CHORDS) {
    entries.push({
      title: `${chord.name} (C${chord.symbol})`,
      context: `Chord library · ${chord.category}`,
      href: `/chords?chord=${chord.id}`,
      kind: "Chord",
      keywords: [chord.formula.join(" "), ...(chord.aliases ?? [])].join(" "),
    });
  }

  return entries;
}

export const SEARCH_INDEX = build();

/** Rank by where the words match: title first, then context, then keywords. */
export function search(query: string, limit = 30): SearchEntry[] {
  const words = plain(query).toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of SEARCH_INDEX) {
    const title = plain(entry.title).toLowerCase();
    const context = plain(entry.context).toLowerCase();
    const keywords = plain(entry.keywords).toLowerCase();
    let score = 0;
    let all = true;
    for (const word of words) {
      if (title.startsWith(word)) score += 6;
      else if (title.includes(word)) score += 4;
      else if (context.includes(word)) score += 2;
      else if (keywords.includes(word)) score += 1;
      else all = false;
    }
    if (all) scored.push({ entry, score: score + (entry.kind === "Page" ? 1 : 0) });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entry);
}
