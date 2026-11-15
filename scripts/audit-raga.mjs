// Numeric/integration regressions; historical and performance claims still need
// human review. Evidence and source differences: docs/raga-review.md.
import assert from "node:assert/strict";
import { CARNATIC_SVARAS, HINDUSTANI_POSITIONS, THAATS, CHAKRAS, MELAKARTAS } from "../lib/music/raga.ts";
import { TOPICS, getTopic } from "../lib/content/topics.ts";
import { TOPIC_REFERENCES } from "../lib/content/references.ts";
import { NAV, STUDY_PAGES } from "../lib/nav.ts";
import { search } from "../lib/search.ts";
import { pc, parseNote } from "../lib/music/theory.ts";
import { RAGA_LESSONS, RAGA_PARTS } from "../lib/content/raga-curriculum.ts";
import { distinctDegrees, KAFI_STUDIES, KATAPAYADI_EXAMPLES, svaraPitch } from "../lib/music/raga-studies.ts";
import { GUITAR_MAX_FRET, GUITAR_STUDIES, guitarLessonDefault, guitarRoute, guitarTab, playableRegions, playableStrings, practiceTones } from "../lib/music/raga-guitar.ts";
import { TUNING } from "../lib/music/theory.ts";

assert.equal(CARNATIC_SVARAS.length, 16);
assert.equal(new Set(CARNATIC_SVARAS.map((s) => s.symbol)).size, 16);
assert.deepEqual([...new Set(CARNATIC_SVARAS.map((s) => s.semitones))].sort((a, b) => a - b), Array.from({ length: 12 }, (_, i) => i));
for (const svara of CARNATIC_SVARAS) {
  assert.equal(pc(parseNote(svara.western)), svara.semitones, svara.symbol);
}
for (const [low, high] of [["R2", "G1"], ["R3", "G2"], ["D2", "N1"], ["D3", "N2"]]) {
  assert.equal(CARNATIC_SVARAS.find((s) => s.symbol === low).semitones, CARNATIC_SVARAS.find((s) => s.symbol === high).semitones);
}
assert.equal(HINDUSTANI_POSITIONS.length, 12);
HINDUSTANI_POSITIONS.forEach((s, i) => assert.equal(pc(parseNote(s.western)), i));

assert.equal(THAATS.length, 10);
assert.equal(new Set(THAATS.map((t) => t.name)).size, 10);
for (const thaat of THAATS) {
  const pitches = thaat.notes.split(" ").map((note) => HINDUSTANI_POSITIONS.findIndex((s) => s.symbol === note));
  assert.deepEqual(pitches, thaat.semitones, thaat.name);
  assert.equal(new Set(pitches).size, 7);
  assert.ok(pitches.every((pitch, i) => pitch >= 0 && (!i || pitch > pitches[i - 1])));
}

assert.equal(CHAKRAS.length, 12);
assert.equal(MELAKARTAS.length, 72);
assert.equal(new Set(MELAKARTAS.map((m) => m.name)).size, 72);
assert.equal(new Set(MELAKARTAS.map((m) => m.semitones.join(","))).size, 72);
for (const [index, mela] of MELAKARTAS.entries()) {
  assert.equal(mela.number, index + 1);
  assert.equal(mela.semitones.length, 7);
  assert.equal(mela.svaras.length, 7);
  assert.equal(mela.semitones[0], 0);
  assert.equal(mela.semitones[4], 7);
  assert.equal(mela.semitones[3], index < 36 ? 5 : 6);
  assert.ok(mela.semitones.every((pitch, i) => !i || pitch > mela.semitones[i - 1]), mela.name);
  assert.deepEqual(mela.western.map((name) => pc(parseNote(name))), mela.semitones);
  if (index < 36) {
    assert.deepEqual(MELAKARTAS[index + 36].semitones, mela.semitones.map((pitch, i) => i === 3 ? pitch + 1 : pitch));
  }
  assert.ok(search(mela.name).some((entry) => entry.href === `/learn/melakarta-chart?mela=${mela.number}#melakarta-chart` && entry.title.startsWith(mela.name)), `Search missing ${mela.name}`);
}
for (const chakra of CHAKRAS) assert.equal(MELAKARTAS.filter((m) => m.chakra === chakra.name).length, 6);

// Independent landmarks, including both corrections in the supplied wheel.
const expected = [
  [1, "Kanakangi", "S R1 G1 M1 P D1 N1", [0, 1, 2, 5, 7, 8, 9]],
  [8, "Hanumatodi", "S R1 G2 M1 P D1 N2", [0, 1, 3, 5, 7, 8, 10]],
  [15, "Mayamalavagowla", "S R1 G3 M1 P D1 N3", [0, 1, 4, 5, 7, 8, 11]],
  [27, "Sarasangi", "S R2 G3 M1 P D1 N3", [0, 2, 4, 5, 7, 8, 11]],
  [28, "Harikambhoji", "S R2 G3 M1 P D2 N2", [0, 2, 4, 5, 7, 9, 10]],
  [29, "Dhirashankarabharanam", "S R2 G3 M1 P D2 N3", [0, 2, 4, 5, 7, 9, 11]],
  [37, "Salagam", "S R1 G1 M2 P D1 N1", [0, 1, 2, 6, 7, 8, 9]],
  [64, "Vachaspati", "S R2 G3 M2 P D2 N2", [0, 2, 4, 6, 7, 9, 10]],
  [65, "Mechakalyani", "S R2 G3 M2 P D2 N3", [0, 2, 4, 6, 7, 9, 11]],
  [72, "Rasikapriya", "S R3 G3 M2 P D3 N3", [0, 3, 4, 6, 7, 10, 11]],
];
for (const [number, name, svaras, pitches] of expected) {
  const mela = MELAKARTAS[number - 1];
  assert.equal(mela.name, name);
  assert.equal(mela.svaras.join(" "), svaras);
  assert.deepEqual(mela.semitones, pitches);
}
for (const number of [41, 47, 53, 59, 65, 71]) {
  assert.deepEqual(MELAKARTAS[number - 1].svaras.slice(-2), ["D2", "N3"]);
}

// The seven pitch-collection correspondences taught in the lesson.
for (const [number, thaat] of [[8, "Bhairavi"], [15, "Bhairav"], [20, "Asavari"], [22, "Kafi"], [28, "Khamaj"], [29, "Bilawal"], [65, "Kalyan"]]) {
  assert.deepEqual(MELAKARTAS[number - 1].semitones, THAATS.find((t) => t.name === thaat).semitones);
}

const topic = getTopic("indian-classical");
assert.ok(topic && TOPICS.filter((t) => t.slug === topic.slug).length === 1);
const href = "/learn/indian-classical";
assert.ok(NAV.some((group) => group.items.some((item) => item.href === href)));
assert.equal(STUDY_PAGES.filter((page) => page.href === href).length, 1);
assert.ok(TOPIC_REFERENCES[topic.slug].length > 0);
assert.equal(new Set(topic.sections.map((s) => s.id)).size, topic.sections.length);
assert.deepEqual(RAGA_PARTS.map((part) => part.lessons.length), [3, 4, 4, 1]);
assert.equal(new Set(RAGA_LESSONS.map((lesson) => lesson.slug)).size, 12);
for (const definition of RAGA_LESSONS) {
  const { slug } = definition;
  const lesson = getTopic(slug);
  assert.ok(lesson, `Missing dedicated lesson: ${slug}`);
  assert.equal(lesson.sections.length, slug === "raga-guitar" ? 3 : 4);
  assert.ok(lesson.sections.some((section) => section.id === "guitar-application"));
  assert.equal(lesson.sections[0].id, definition.section);
  assert.ok(lesson.sections[0].blocks.some((block) => block.type === "visual"));
  const source = topic.sections.find((section) => section.id === definition.section);
  const preserved = lesson.sections.flatMap((section) => section.blocks);
  for (const block of source.blocks) assert.ok(preserved.includes(block), `Source block lost in ${slug}`);
  assert.equal(STUDY_PAGES.filter((page) => page.href === `/learn/${slug}`).length, 1);
  assert.ok(NAV.find((group) => group.title === "Indian Classical Music").items.some((item) => item.href === `/learn/${slug}` && item.part === definition.part));
  assert.ok(TOPIC_REFERENCES[slug].length > 0);
  assert.ok(search(definition.label).some((entry) => entry.kind === "Page" && entry.href === `/learn/${slug}`));
  for (const block of lesson.sections.find((section) => section.id === "apply-and-continue").blocks.filter((block) => block.type === "links")) {
    for (const link of block.items) assert.ok(getTopic(link.href.slice(7)), `Broken course link in ${slug}`);
  }
}
assert.deepEqual(KAFI_STUDIES.map((raga) => [distinctDegrees(raga.ascent), distinctDegrees(raga.descent)]), [[5, 7], [6, 7], [5, 5]]);
assert.equal(svaraPitch(",ni"), -2);
assert.equal(svaraPitch("Sa′"), 12);
for (const example of KATAPAYADI_EXAMPLES) {
  assert.equal(example.secondDigit * 10 + example.firstDigit, example.number);
  assert.equal(MELAKARTAS[example.number - 1].name, example.name);
}
const chart = topic.sections.find((s) => s.id === "melakarta-chart").blocks.find((b) => b.type === "table");
assert.equal(chart.rows.length, 72);
assert.equal(chart.rows[26][1], "Sarasangi");
assert.equal(chart.rows[27][1], "Harikambhoji");
for (const section of topic.sections) {
  for (const block of section.blocks) {
    if (block.type === "table") assert.ok(block.rows.every((row) => row.length === block.columns.length), section.id);
    if (block.type === "links") {
      for (const link of block.items.filter((l) => l.href.startsWith("/learn/"))) assert.ok(getTopic(link.href.slice(7)));
    }
  }
}
console.log("Raga audit passed: 16 svara names, 12 positions, 10 thaats, 12 chakras, 72 unique melakarta scales, source-wheel regressions, note spelling, search and lesson integration.");

assert.equal(GUITAR_STUDIES.length, 87);
assert.equal(new Set(GUITAR_STUDIES.map((study) => study.id)).size, 87);
assert.equal(guitarLessonDefault("melakarta-chart"), "melakarta-1");
assert.equal(guitarLessonDefault("melakarta-construction", "65"), "melakarta-65");
assert.equal(guitarLessonDefault("janaka-and-janya"), "melakarta-29");
let guitarRoutes = 0;
for (const material of GUITAR_STUDIES) {
  for (let saMidi = 48; saMidi < 60; saMidi++) {
    for (const direction of ["ascent", "descent", "both"]) {
      const tones = practiceTones(material, direction);
      const regions = playableRegions(tones, saMidi);
      const strings = playableStrings(tones, saMidi);
      assert.ok(regions.length && strings.length, `${material.id}: missing playable route at ${saMidi}`);
      for (const option of [...regions.map((start) => ({ mode: "region", start })), ...strings.map((string) => ({ mode: "single", string }))]) {
        const route = guitarRoute(tones, saMidi, option);
        assert.equal(route.length, tones.length);
        assert.equal(guitarTab(route).split("\n").length, 6);
        route.forEach((step, index) => {
          assert.equal(TUNING[step.string] + step.fret, saMidi + tones[index].offset);
          assert.equal(step.symbol, tones[index].symbol);
          assert.ok(step.fret >= 0 && step.fret <= GUITAR_MAX_FRET);
          assert.ok(step.finger >= 0 && step.finger <= 4);
          if (step.fret) assert.equal(step.position + step.finger - 1, step.fret);
          else assert.equal(step.finger, 0);
          if (index) assert.equal(step.shift, step.position !== route[index - 1].position);
          if (option.mode === "single") assert.equal(step.string, option.string);
          else assert.ok(step.fret >= option.start && step.fret <= option.start + 4);
        });
        guitarRoutes++;
      }
    }
  }
}
const cMajor = guitarRoute(GUITAR_STUDIES.find((study) => study.id === "thaat-0").ascent, 48, { mode: "single", string: 1 });
assert.deepEqual(cMajor.map((step) => step.fret), [3, 5, 7, 8, 10, 12, 14, 15]);
assert.equal(guitarRoute(GUITAR_STUDIES[0].ascent, 48, { mode: "single", string: 5 }).length, 0);
console.log(`Guitar audit passed: ${guitarRoutes} complete routes, all 87 materials in 12 tonic pitch classes, exact registers, bounded frets, TAB, finger numbering and explicit hand shifts.`);
