import assert from "node:assert/strict";
import { BOOK_DIAGRAMS, BOOK_CHORD_TYPES } from "../lib/content/book.ts";
import { FRET_SHEETS } from "../lib/content/fretboard-sheets.ts";
import { parseMarks } from "../lib/content/fretboard-sheet-types.ts";
import { BOOK_ASSIGNMENTS } from "../lib/content/book-assignments.ts";
import { assignmentMaterial } from "../lib/content/assignment-links.ts";
import { TOPICS } from "../lib/content/topics.ts";
import { NAV, STUDY_PAGES } from "../lib/nav.ts";
import { SCALES, getScale } from "../lib/music/scales.ts";
import { MODE_FAMILIES } from "../lib/music/modes.ts";
import { COLLECTIONS, SCALE_CHOICES, PENTATONIC_RECIPES } from "../lib/music/applications.ts";
import { chordVoices, doubleNotePosition, guitarVoicings, STRING_SETS, modeColour } from "../lib/music/performance.ts";
import { checkExerciseAnswer, exerciseQuestion, EXERCISE_TYPES } from "../lib/music/exercises.ts";
import { buildScale, degreeSemitones, mod, parseDegree, pc, TUNING, parseNote, noteWithOctave } from "../lib/music/theory.ts";

let checks = 0;
function verify(fn) { fn(); checks++; }
verify(() => assert.equal(noteWithOctave(parseNote("B#"), 60), "B♯3"));
verify(() => assert.equal(noteWithOctave(parseNote("Cb"), 59), "C♭4"));
assert.equal(BOOK_DIAGRAMS.length, 63);
assert.equal(new Set(BOOK_DIAGRAMS.map((s) => s.page)).size, 63);
assert.equal(BOOK_ASSIGNMENTS.length, 214);
assert.equal(new Set(BOOK_ASSIGNMENTS.map((a) => a.id)).size, 214);
const navHrefs = new Set(NAV.flatMap((g) => g.items.flatMap((i) => [i.href, ...(i.children ?? []).map((c) => c.href)])));
for (const assignment of BOOK_ASSIGNMENTS) {
  const url = new URL(assignmentMaterial(assignment), "https://local.invalid");
  verify(() => { assert.ok(navHrefs.has(url.pathname)); assert.ok(assignment.prompt.endsWith(".")); assert.ok(!assignment.prompt.includes("SUGGESTED")); });
  if (url.pathname.startsWith("/modes/")) verify(() => assert.ok(MODE_FAMILIES.find((f) => url.pathname === `/modes/${f.id}`)?.modes.some((m) => m.id === url.searchParams.get("mode"))));
}
verify(() => assert.equal(assignmentMaterial(BOOK_ASSIGNMENTS.find((a) => a.id === "p19-part1-13")), "/scales/hirajoshi?key=a-sharp"));
verify(() => assert.ok(assignmentMaterial(BOOK_ASSIGNMENTS.find((a) => a.id === "p43-part1-10")).includes("mode=lydian-dominant")));
for (const topic of TOPICS) {
  verify(() => assert.ok(navHrefs.has(`/learn/${topic.slug}`), `Lesson must be discoverable: ${topic.slug}`));
  verify(() => assert.equal(new Set(topic.sections.map((s) => s.id)).size, topic.sections.length));
}
verify(() => assert.equal(new Set(STUDY_PAGES.map((p) => p.href)).size, STUDY_PAGES.length));
for (const sheet of BOOK_DIAGRAMS) {
  const data = FRET_SHEETS.find((s) => s.page === sheet.page);
  verify(() => assert.ok(data, `Missing transcribed sheet ${sheet.page}`));
  for (const group of data?.groups ?? []) {
    const allowed = new Set(group.formula.map((d) => mod(degreeSemitones(parseDegree(d)), 12)));
    for (const diagram of [data.neck, ...group.diagrams].filter(Boolean)) {
      const marks = parseMarks(diagram.marks);
      verify(() => assert.ok(marks.every((m) => allowed.has(mod(TUNING[m.string] + m.fret - 9, 12))), `p. ${sheet.page} ${diagram.label}: note outside ${group.formula.join(" ")}`));
      verify(() => assert.ok(marks.filter((m) => m.kind === "root").every((m) => mod(TUNING[m.string] + m.fret - 9, 12) === 0), `p. ${sheet.page} ${diagram.label}: boxed marker is not A`));
      verify(() => assert.ok(marks.every((m) => m.fret >= diagram.from && m.fret <= diagram.to), `p. ${sheet.page} ${diagram.label}: marker outside window`));
      if (diagram !== data.neck) verify(() => assert.equal(marks.filter((m) => m.kind === "root").length, 1, `p. ${sheet.page} ${diagram.label}: one anchor root`));
      if (diagram !== data.neck && group.formula.length === 7 && data.kind === "scale") verify(() => assert.equal(marks.filter((m) => m.kind === "double").length, 1, `p. ${sheet.page} ${diagram.label}: one Double Note`));
    }
  }
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
verify(() => assert.equal(exerciseQuestion("chord-notes", 8).answer, "D♭ F A♭ C"));
verify(() => assert.equal(exerciseQuestion("chord-notes", 20).answer, "A C E♭ G♭"));
verify(() => assert.equal(exerciseQuestion("chord-name", 9).answer, "C♭maj7"));
verify(() => assert.equal(exerciseQuestion("chord-name", 21).answer, "G°7"));
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
