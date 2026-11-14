import { CHORDS } from "../music/chords.ts";
import { MODE_FAMILIES } from "../music/modes.ts";
import { SCALES } from "../music/scales.ts";
import { TOPICS } from "./topics.ts";
import type { Block } from "./types.ts";

/*
 * Every correction and every gap flagged while organising Guitar.docx,
 * gathered for the overview so nothing changed silently.
 */

export type AuditItem = { tone: "fix" | "todo"; title: string; where: string; href: string };

function fromBlocks(blocks: Block[], where: string, href: string): AuditItem[] {
  return blocks.flatMap((b) =>
    b.type === "callout" && b.tone !== "tip" ? [{ tone: b.tone, title: b.title ?? b.text, where, href }] : [],
  );
}

export const AUDIT: AuditItem[] = [
  ...TOPICS.flatMap((t) => t.sections.flatMap((s) => fromBlocks(s.blocks, t.title, `/learn/${t.slug}#${s.id}`))),
  ...SCALES.flatMap((s) => fromBlocks(s.notes, s.name, `/scales/${s.id}`)),
  ...MODE_FAMILIES.flatMap((f) =>
    f.modes.flatMap((m) => fromBlocks(m.notes, `${f.name} · ${m.name}`, `/modes/${f.id}?mode=${m.id}`)),
  ),
  ...CHORDS.filter((c) => c.fix).map((c) => ({
    tone: "fix" as const,
    title: `Corrected: ${c.name} example notes`,
    where: "Chord library",
    href: `/chords?chord=${c.id}`,
  })),
];
