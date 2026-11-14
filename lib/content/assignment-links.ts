import type { BookAssignment } from "./book-assignments.ts";
import { BOOK_CHORD_TYPES } from "./book.ts";
import { MODE_FAMILIES } from "../music/modes.ts";
import { pc, parseNote, ROOT_SLUGS } from "../music/theory.ts";

export function assignmentMaterial(assignment: BookAssignment) {
  const text = assignment.prompt;
  const root = /\b([A-G](?:#|b)?)(?=\s|m|\+|7|dim)/.exec(text)?.[1] ?? "A";
  const query = new URLSearchParams({ key: ROOT_SLUGS[pc(parseNote(root))] });
  if (text.startsWith("Harmonize")) {
    query.set("family", /Harmonic Minor/i.test(text) ? "harmonic-minor" : /Melodic Minor/i.test(text) ? "melodic-minor" : "major");
    query.set("approach", /vertically/i.test(text) ? "vertical" : "horizontal");
    return `/harmonization?${query}`;
  }
  if (assignment.page === 19 || assignment.page === 53) {
    const scales: [RegExp, string][] = [[/Major Pentatonic/, "major-pentatonic"], [/Minor Pentatonic/, "minor-pentatonic"], [/Major Blues/, "major-blues"], [/Minor Blues/, "minor-blues"], [/Kumoi/, "kumoi"], [/Pelog/, "pelog"], [/Hirajoshi/, "hirajoshi"], [/Whole Tone/, "whole-tone"], [/Augmented/, "augmented"], [/H\/W/, "diminished-half-whole"], [/W\/H/, "diminished-whole-half"]];
    return `/scales/${scales.find(([test]) => test.test(text))?.[1] ?? "major"}?${query}`;
  }
  if ([27, 35, 43].includes(assignment.page)) {
    const family = MODE_FAMILIES[[27, 35, 43].indexOf(assignment.page)];
    const names = assignment.page === 27 ? ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"] : assignment.page === 35 ? ["Harmonic Minor", "Locrian", "Ionian", "Dorian", "Phrygian", "Lydian", "Altered"] : ["Melodic Minor", "Dorian", "Lydian #5", "Lydian b7", "Mixolydian", "Locrian", "Altered"];
    const index = Math.max(0, names.findIndex((name) => text.includes(name)));
    query.set("mode", family.modes[index].id);
    return `/modes/${family.id}?${query}`;
  }
  const token = /Play the (\S+)/.exec(text)?.[1] ?? "A";
  const suffix = token.replace(/^[A-G](?:#|b)?/, "");
  const type = ({ "": "major", m: "minor", "+": "augmented", mb5: "diminished", maj7: "major-7", "7": "dominant-7", "m(maj7)": "minor-major-7", m7: "minor-7", "+maj7": "augmented-major-7", m7b5: "half-diminished", dim7: "diminished-7" } as Record<string, string>)[suffix];
  query.set("chord", BOOK_CHORD_TYPES.find((c) => c.id === type)?.id ?? "major-7");
  if (assignment.page === 66) query.set("voicing", "drop-2");
  if (assignment.page === 74) query.set("voicing", "drop-3");
  if (assignment.page === 58) query.set("voicing", "close");
  return `/${assignment.page === 82 ? "arpeggios" : "voicings"}?${query}`;
}
