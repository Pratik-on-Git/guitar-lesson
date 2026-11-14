import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { BOOK_DIAGRAMS, BOOK_CHORD_TYPES, diagramSrc } from "../lib/content/book.ts";
import { TOPICS } from "../lib/content/topics.ts";
import { NAV, STUDY_PAGES } from "../lib/nav.ts";
import { SCALES, getScale } from "../lib/music/scales.ts";
import { MODE_FAMILIES } from "../lib/music/modes.ts";
import { COLLECTIONS, SCALE_CHOICES, PENTATONIC_RECIPES } from "../lib/music/applications.ts";
import { chordVoices, doubleNotePosition, guitarVoicings, STRING_SETS, modeColour } from "../lib/music/performance.ts";
import { checkExerciseAnswer, exerciseQuestion, EXERCISE_TYPES } from "../lib/music/exercises.ts";
import { buildScale, degreeSemitones, mod, parseDegree, pc, TUNING, parseNote } from "../lib/music/theory.ts";

let checks = 0;
function verify(fn) { fn(); checks++; }
assert.equal(BOOK_DIAGRAMS.length, 63);
assert.equal(new Set(BOOK_DIAGRAMS.map((s) => s.page)).size, 63);
const navHrefs = new Set(NAV.flatMap((g) => g.items.flatMap((i) => [i.href, ...(i.children ?? []).map((c) => c.href)])));
for (const topic of TOPICS) {
  verify(() => assert.ok(navHrefs.has(`/learn/${topic.slug}`), `Lesson must be discoverable: ${topic.slug}`));
  verify(() => assert.equal(new Set(topic.sections.map((s) => s.id)).size, topic.sections.length));
}
verify(() => assert.equal(new Set(STUDY_PAGES.map((p) => p.href)).size, STUDY_PAGES.length));
for (const sheet of BOOK_DIAGRAMS) {
  verify(() => assert.ok(existsSync(new URL(`../public${diagramSrc(sheet.page)}`, import.meta.url)), `Missing source asset ${sheet.page}`));
  const url = new URL(sheet.href, "https://local.invalid");
  verify(() => assert.ok(navHrefs.has(url.pathname), `Broken source lesson: ${sheet.href}`));
  if (url.pathname.startsWith("/modes/")) {
    const family = MODE_FAMILIES.find((f) => `/modes/${f.id}` === url.pathname);
    verify(() => assert.ok(family?.modes.some((m) => m.id === url.searchParams.get("mode")), `Invalid source mode ${sheet.href}`));
  }
}
for (let root = 0; root < 12; root++) {
  for (const family of MODE_FAMILIES.filter((f) => f.parentFormula.length === 7)) {
    const semis = family.parentFormula.map((d) => degreeSemitones(parseDegree(d)));
    for (let start = 0; start < 7; start++) {
      const shape = doubleNotePosition(root, semis, start);
      verify(() => {
        assert.equal(shape.length, 18);
        assert.equal(TUNING[shape[11].string] + shape[11].fret, TUNING[shape[12].string] + shape[12].fret);
        shape.forEach((n) => { assert.ok(n.fret >= 0); assert.equal(mod(TUNING[n.string] + n.fret, 12), mod(root + semis[n.index], 12)); });
        assert.ok(shape.every((n, i) => !i || TUNING[n.string] + n.fret >= TUNING[shape[i - 1].string] + shape[i - 1].fret));
      });
      const colour = modeColour(family.id, start);
      verify(() => assert.ok(colour && [...colour.characteristic, ...colour.altered].every((d) => degreeSemitones(parseDegree(d)) >= 0)));
    }
  }
  for (const chord of BOOK_CHORD_TYPES) {
    for (let inversion = 0; inversion < chord.formula.length; inversion++) {
      for (const kind of chord.formula.length === 3 ? ["close"] : ["close", "drop-2", "drop-3"]) {
        const voices = chordVoices(root, chord.formula, inversion, kind);
        verify(() => {
          assert.equal(voices[0].index, inversion);
          assert.equal(voices.length, chord.formula.length);
          voices.forEach((v, i) => { assert.equal(mod(v.midi, 12), mod(root + degreeSemitones(parseDegree(chord.formula[v.index])), 12)); if (i) assert.ok(v.midi > voices[i - 1].midi); });
        });
        for (const strings of chord.formula.length === 3 ? STRING_SETS.triad : STRING_SETS[kind]) {
          for (const shape of guitarVoicings(voices, strings)) verify(() => {
            shape.forEach((n, i) => { assert.equal(n.string, strings[i]); assert.ok(n.fret >= 0 && n.fret <= 24); assert.equal(n.index, voices[i].index); if (i) assert.equal(TUNING[n.string] + n.fret - TUNING[shape[0].string] - shape[0].fret, voices[i].midi - voices[0].midi); });
          });
        }
      }
    }
  }
}
// Independent textbook expectations distinguish starting and resulting inversions.
verify(() => assert.deepEqual(chordVoices(0, ["1", "3", "5", "7"], 2, "drop-2").map((n) => n.midi), [55, 60, 64, 71]));
verify(() => assert.deepEqual(chordVoices(0, ["1", "3", "5", "7"], 1, "drop-3").map((n) => n.midi), [52, 60, 67, 71]));
for (const choices of Object.values(SCALE_CHOICES)) for (const id of choices) verify(() => assert.ok(COLLECTIONS.find((c) => c.id === id), `Invalid scale-choice collection ${id}`));
for (const type of EXERCISE_TYPES) for (let i = 0; i < 132; i++) { const question = exerciseQuestion(type.value, i); verify(() => { assert.ok(question.accepted.length); assert.ok(checkExerciseAnswer(question, question.accepted[0])); assert.ok(!checkExerciseAnswer(question, "incorrect")); }); }
verify(() => assert.ok(checkExerciseAnswer(exerciseQuestion("intervals", 0), "m2")));
verify(() => assert.ok(!checkExerciseAnswer(exerciseQuestion("intervals", 0), "M2")));
verify(() => assert.ok(checkExerciseAnswer(exerciseQuestion("missing-note", 12), "Eb")));
verify(() => assert.ok(!checkExerciseAnswer(exerciseQuestion("missing-note", 12), "D#")));
// Symmetry periods and independent corrected dominant-substitution relationships.
for (const [id, period] of [["whole-tone", 2], ["augmented", 4], ["diminished-half-whole", 3], ["diminished-whole-half", 3]]) {
  const semis = getScale(id).formula.map((d) => degreeSemitones(parseDegree(d)));
  verify(() => assert.deepEqual(semis.map((n) => mod(n + period, 12)).sort((a, b) => a - b), semis));
}
const pent = buildScale(parseNote("Bb"), getScale("minor-pentatonic").formula.map(parseDegree));
verify(() => assert.deepEqual(pent.map((n) => mod(pc(n.note) - 7, 12)), [3, 6, 8, 10, 1]));
assert.equal(PENTATONIC_RECIPES.length, 7);
assert.equal(SCALES.length, 18);
console.log(`Book coverage, source links, voicings, Double Note fingerings, substitutions and exercises: ${checks} checks passed.`);
