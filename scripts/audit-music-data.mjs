// Run with Node 22.18+ (native TypeScript support): node scripts/audit-music-data.mjs
// Reference expectations below are independent of the application's calculations.
// This checks arithmetic and coverage; prose and naming findings are reviewed in docs/data-audit.md.
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { SCALES } from "../lib/music/scales.ts";
import { MODE_FAMILIES } from "../lib/music/modes.ts";
import { CHORDS, getChord, LEGACY_CHORD_IDS } from "../lib/music/chords.ts";
import { CIRCLE, KEY_CHARACTERS, keyCharacter, keyNeighbours, keySignature, relativeMinor } from "../lib/music/keys.ts";
import { TOPICS } from "../lib/content/topics.ts";
import * as theory from "../lib/music/theory.ts";

const wrap = (n) => ((n % 12) + 12) % 12;
const naturals = [0, 2, 4, 5, 7, 9, 11];
const semitones = (token) => {
  const [, accidental, number] = /^([b#]*)([1-9][0-9]*)$/.exec(token);
  const degree = Number(number) - 1;
  return naturals[degree % 7] + 12 * Math.floor(degree / 7)
    + [...accidental].reduce((n, ch) => n + (ch === "#" ? 1 : -1), 0);
};
const scaleReferences = {
  major: [0, 2, 4, 5, 7, 9, 11],
  "natural-minor": [0, 2, 3, 5, 7, 8, 10],
  "major-pentatonic": [0, 2, 4, 7, 9],
  "minor-pentatonic": [0, 3, 5, 7, 10],
  "major-blues": [0, 2, 3, 4, 7, 9],
  "minor-blues": [0, 3, 5, 6, 7, 10],
  "diminished-whole-half": [0, 2, 3, 5, 6, 8, 9, 11],
  "diminished-half-whole": [0, 1, 3, 4, 6, 7, 9, 10],
  "bebop-major": [0, 2, 4, 5, 7, 8, 9, 11],
  "bebop-dominant": [0, 2, 4, 5, 7, 9, 10, 11],
  "harmonic-minor": [0, 2, 3, 5, 7, 8, 11],
  "melodic-minor": [0, 2, 3, 5, 7, 9, 11],
  chromatic: Array.from({ length: 12 }, (_, i) => i),
  "whole-tone": [0, 2, 4, 6, 8, 10],
};
const modeReferences = {
  major: ["1 2 3 4 5 6 7", "1 2 b3 4 5 6 b7", "1 b2 b3 4 5 b6 b7", "1 2 3 #4 5 6 7", "1 2 3 4 5 6 b7", "1 2 b3 4 5 b6 b7", "1 b2 b3 4 b5 b6 b7"],
  "harmonic-minor": ["1 2 b3 4 5 b6 7", "1 b2 b3 4 b5 6 b7", "1 2 3 4 #5 6 7", "1 2 b3 #4 5 6 b7", "1 b2 3 4 5 b6 b7", "1 #2 3 #4 5 6 7", "1 b2 b3 b4 b5 b6 bb7"],
  "melodic-minor": ["1 2 b3 4 5 6 7", "1 b2 b3 4 5 6 b7", "1 2 3 #4 #5 6 7", "1 2 3 #4 5 6 b7", "1 2 3 4 5 b6 b7", "1 2 b3 4 b5 b6 b7", "1 b2 b3 b4 b5 b6 b7"],
  "minor-pentatonic": ["1 b3 4 5 b7", "1 2 3 5 6", "1 2 4 5 b7", "1 b3 4 b6 b7", "1 2 4 5 6"],
};
const chordReferences = {
  "": "1 3 5", m: "1 b3 5", "5": "1 5", "°": "1 b3 b5", "+": "1 3 #5",
  "6": "1 3 5 6", m6: "1 b3 5 6", "6/9": "1 3 5 6 9", "m6/9": "1 b3 5 6 9",
  "7": "1 3 5 b7", maj7: "1 3 5 7", m7: "1 b3 5 b7", "m(maj7)": "1 b3 5 7", "m7♭5": "1 b3 b5 b7", "°7": "1 b3 b5 bb7",
  "9": "1 3 5 b7 9", add9: "1 3 5 9", maj9: "1 3 5 7 9", m9: "1 b3 5 b7 9", "m(add9)": "1 b3 5 9",
  "m(maj9)": "1 b3 5 7 9", m11: "1 b3 5 b7 9 11", "m(maj11)": "1 b3 5 7 9 11",
  sus4: "1 4 5", sus2: "1 2 5", "7sus4": "1 4 5 b7", "9sus4": "1 4 5 b7 9",
  "+maj7": "1 3 #5 7", "7♯5": "1 3 #5 b7", "7♭9": "1 3 5 b7 b9", "7♯9": "1 3 5 b7 #9",
};
const keyReferences = [
  ["C", 0, 0, "A"], ["G", 1, 0, "E"], ["D", 2, 0, "B"], ["A", 3, 0, "F♯"],
  ["E", 4, 0, "C♯"], ["B", 5, 0, "G♯"], ["F#", 6, 0, "D♯"], ["C#", 7, 0, "A♯"],
  ["F", 0, 1, "D"], ["Bb", 0, 2, "G"], ["Eb", 0, 3, "C"], ["Ab", 0, 4, "F"],
  ["Db", 0, 5, "B♭"], ["Gb", 0, 6, "E♭"], ["Cb", 0, 7, "A♭"],
];
const counts = { scaleReferences: 0, modeReferences: 0, chordReferences: 0, transposedScales: 0, transposedModes: 0, transposedChords: 0, fretboardCases: 0, positionCases: 0, keySignatures: 0, harmonyCases: 0, intervalCases: 0, regressionCases: 0 };
const failures = [];
const check = (label, fn) => { try { fn(); } catch (error) { failures.push({ label, message: error.message }); } };
const serialNotes = (scale) => scale.map((n) => n.name);
const verifySpelling = (root, tokens, scale) => {
  assert.equal(scale.length, tokens.length);
  tokens.forEach((token, i) => {
    const degree = Number(token.replace(/[b#]/g, ""));
    assert.equal(scale[i].note.letter, (root.letter + degree - 1) % 7);
    assert.equal(wrap(naturals[scale[i].note.letter] + scale[i].note.acc), wrap(naturals[root.letter] + root.acc + semitones(token)));
  });
};
const verifyNeck = (rootPc, semis, perString) => {
  counts.fretboardCases++;
  const notes = theory.neckNotes(rootPc, semis, 24);
  const reference = [];
  [40, 45, 50, 55, 59, 64].forEach((open, string) => {
    for (let fret = 0; fret <= 24; fret++) {
      const index = semis.findIndex((s) => wrap(rootPc + s) === wrap(open + fret));
      if (index >= 0) reference.push({ string, fret, index });
    }
  });
  assert.deepEqual(notes, reference);
  if (!perString) return;
  for (let start = 0; start < semis.length; start++) {
    counts.positionCases++;
    const position = theory.scalePosition(rootPc, semis, start, perString);
    assert.equal(position.length, perString * 6);
    const midis = position.map((n) => [40, 45, 50, 55, 59, 64][n.string] + n.fret);
    position.forEach((n, i) => {
      assert.ok(n.fret >= 0 && Number.isInteger(n.fret));
      assert.equal(n.string, Math.floor(i / perString));
      assert.equal(n.index, (start + i) % semis.length);
      assert.equal(wrap(midis[i]), wrap(rootPc + semis[n.index]));
      if (i) assert.ok(midis[i] > midis[i - 1]);
    });
  }
};
const expectedHarmony = {
  major: ["maj,min,min,maj,maj,min,dim", "major 7th,minor 7th,minor 7th,major 7th,dominant 7th,minor 7th,half-diminished"],
  "natural-minor": ["min,dim,maj,min,min,maj,maj", "minor 7th,half-diminished,major 7th,minor 7th,minor 7th,major 7th,dominant 7th"],
  "harmonic-minor": ["min,dim,aug,min,maj,maj,dim", "minor-major 7th,half-diminished,augmented major 7th,minor 7th,dominant 7th,major 7th,diminished 7th"],
  "melodic-minor": ["min,min,aug,maj,maj,dim,dim", "minor-major 7th,minor 7th,augmented major 7th,dominant 7th,dominant 7th,half-diminished,half-diminished"],
};

const scales = SCALES.map((def) => {
  const degrees = def.formula.map(theory.parseDegree);
  const semis = def.formula.map(semitones);
  counts.scaleReferences++;
  check(`Scale formula: ${def.id}`, () => assert.deepEqual(semis, scaleReferences[def.id]));
  const roots = theory.ROOTS.map(({ pc }) => {
    counts.transposedScales++;
    const root = theory.spellRoot(pc, degrees);
    const scale = theory.buildScale(root, degrees);
    check(`Scale ${def.id}, root ${pc}`, () => {
      verifySpelling(root, def.formula, scale);
      assert.deepEqual(scale.map((n) => n.semis), scaleReferences[def.id]);
      assert.equal(theory.stepSizes(semis).reduce((a, b) => a + b, 0), 12);
      verifyNeck(pc, semis, def.positions?.perString);
      if (expectedHarmony[def.id]) {
        counts.harmonyCases++;
        const harmony = theory.harmonize(scale);
        assert.equal(harmony.map((c) => c.triadQuality).join(","), expectedHarmony[def.id][0]);
        assert.equal(harmony.map((c) => c.seventhQuality).join(","), expectedHarmony[def.id][1]);
      }
    });
    return { root: theory.noteName(root), notes: serialNotes(scale) };
  });
  return { id: def.id, name: def.name, formula: def.formula, semitones: semis, steps: theory.stepSizes(semis), descendingFormula: def.descendingFormula, roots };
});
const modes = MODE_FAMILIES.flatMap((family) => family.modes.map((mode) => {
  const degrees = theory.modeDegrees(family.parentFormula.map(theory.parseDegree), mode.start);
  const formula = degrees.map((d) => theory.degreeText(d, false));
  counts.modeReferences++;
  check(`Mode formula: ${family.id}/${mode.id}`, () => assert.equal(formula.join(" "), modeReferences[family.id][mode.start]));
  const roots = theory.ROOTS.map(({ pc }) => {
    counts.transposedModes++;
    const root = theory.spellRoot(pc, degrees);
    const scale = theory.buildScale(root, degrees);
    check(`Mode ${family.id}/${mode.id}, root ${pc}`, () => {
      verifySpelling(root, formula, scale);
      verifyNeck(pc, formula.map(semitones), formula.length === 5 ? 2 : 3);
      const parent = family.parentFormula.map(semitones);
      const parentPc = wrap(pc - parent[mode.start]);
      assert.deepEqual(scale.map((n) => theory.pc(n.note)).sort((a, b) => a - b), parent.map((s) => wrap(parentPc + s)).sort((a, b) => a - b));
      const parentRoot = theory.modeParentRoot(root, family.parentFormula.map(theory.parseDegree), mode.start);
      const parentScale = theory.buildScale(parentRoot, family.parentFormula.map(theory.parseDegree));
      const rotated = [...parentScale.slice(mode.start), ...parentScale.slice(0, mode.start)];
      assert.deepEqual(serialNotes(scale), serialNotes(rotated));
    });
    return { root: theory.noteName(root), notes: serialNotes(scale) };
  });
  return { family: family.id, id: mode.id, name: mode.name, formula, roots };
}));
const chords = CHORDS.map((def) => {
  if (Object.hasOwn(chordReferences, def.symbol)) {
    counts.chordReferences++;
    check(`Chord reference: ${def.id}`, () => assert.equal(def.formula.join(" "), chordReferences[def.symbol]));
  }
  const pitches = def.formula.map((d) => wrap(semitones(d)));
  const duplicatePitchClasses = [...new Set(pitches.filter((p, i) => pitches.indexOf(p) !== i))];
  const roots = theory.ROOTS.map(({ pc }) => {
    counts.transposedChords++;
    const root = theory.spellRoot(pc, def.formula.map(theory.parseDegree));
    const scale = theory.buildScale(root, def.formula.map(theory.parseDegree));
    check(`Chord ${def.id}, root ${pc}`, () => {
      verifySpelling(root, def.formula, scale);
      assert.deepEqual(theory.chordNotes(root, def.formula), serialNotes(scale));
    });
    return { root: theory.noteName(root), notes: serialNotes(scale) };
  });
  return { id: def.id, name: def.name, symbol: def.symbol, formula: def.formula, semitones: def.formula.map(semitones), duplicatePitchClasses, review: def.note ?? def.fix ?? "Declared formula checked in all 12 roots; see correction log for naming and voicing conventions.", roots };
});
const keys = keyReferences.map(([tonic, sharps, flats, minor]) => {
  counts.keySignatures++;
  const sig = keySignature(tonic);
  check(`Key signature ${tonic}`, () => {
    assert.equal(sig.sharps, sharps);
    assert.equal(sig.flats, flats);
    assert.equal(relativeMinor(tonic), minor);
    const expectedAccidentals = (sharps ? ["F", "C", "G", "D", "A", "E", "B"] : ["B", "E", "A", "D", "G", "C", "F"])
      .slice(0, sharps || flats).map((n) => n + (sharps ? "♯" : "♭"));
    assert.deepEqual(sig.accidentals, expectedAccidentals);
  });
  return { tonic, minor, sharps: sig.sharps, flats: sig.flats, accidentals: sig.accidentals, notes: sig.scale };
});
for (const [formula, name, inverse] of [["1", "P1", "P8"], ["b2", "m2", "M7"], ["2", "M2", "m7"], ["b3", "m3", "M6"], ["3", "M3", "m6"], ["4", "P4", "P5"], ["#4", "A4", "d5"], ["b5", "d5", "A4"], ["5", "P5", "P4"], ["b6", "m6", "M3"], ["6", "M6", "m3"], ["bb7", "d7", "A2"], ["b7", "m7", "M2"], ["7", "M7", "m2"], ["8", "P8", "P1"]]) {
  counts.intervalCases++;
  check(`Interval ${formula}`, () => {
    const degree = theory.parseDegree(formula);
    assert.equal(theory.intervalShort(degree), name);
    assert.equal(theory.intervalShort(theory.invertDegree(degree)), inverse);
  });
}
const regression = (label, fn) => { counts.regressionCases++; check(label, fn); };
const circlePresentation = CIRCLE.flatMap((slot) => [slot, ...(slot.alt ? [slot.alt] : [])].map((spelling) => {
  const root = theory.parseNote(spelling.major);
  const neighbours = keyNeighbours(spelling.major);
  const shown = [neighbours.iv, neighbours.v];
  const expected = ["4", "5"].map((d) => theory.noteName(theory.spellDegree(root, theory.parseDegree(d))));
  regression(`Circle neighbour spelling ${spelling.major}`, () => assert.deepEqual(shown, expected));
  const characters = ["major", "minor"].map((mode) => {
    const requested = mode === "major" ? spelling.major : spelling.minor;
    const resolved = keyCharacter(requested, mode)?.key ?? null;
    regression(`Historical spelling ${requested} ${mode}`, () => assert.ok(resolved === null || resolved === requested));
    return { mode, requested, resolved, usesDifferentHistoricalSpelling: resolved !== null && resolved !== requested };
  });
  return { major: spelling.major, shownNeighbours: shown, expectedNeighbours: expected, neighbourSpellingMismatch: shown.some((n, i) => n !== expected[i]), characters };
}));
for (const { pc } of theory.ROOTS) {
  const root = theory.spellRoot(pc, ["1", "2", "3", "4", "5", "6", "7"].map(theory.parseDegree));
  regression(`Dominant targets root ${pc}`, () => {
    const targets = theory.majorKeyDominants(root);
    assert.equal(targets.filter((t) => t.dominant && !t.primary).length, 5);
    assert.equal(targets.filter((t) => t.substitute).length, 6);
    assert.equal(targets[6].dominant, null);
    assert.equal(targets[6].substitute, null);
    const major = [0, 2, 4, 5, 7, 9, 11];
    for (const [i, target] of targets.slice(0, 6).entries()) {
      const dominant = theory.parseNote(target.dominant.slice(0, -1));
      const substitute = theory.parseNote(target.substitute.slice(0, -1));
      assert.equal(theory.pc(dominant), wrap(pc + major[i] + 7));
      assert.equal(theory.pc(substitute), wrap(pc + major[i] + 1));
      const guideTones = (r) => ["3", "b7"].map((d) => theory.pc(theory.spellDegree(r, theory.parseDegree(d)))).sort((a, b) => a - b);
      assert.deepEqual(guideTones(dominant), guideTones(substitute));
    }
  });
  regression(`Altered dominant interpretation root ${pc}`, () => {
    const notes = theory.buildScale(root, theory.ALTERED_DOMINANT_FORMULA.map(theory.parseDegree));
    assert.deepEqual(notes.map((n) => wrap(n.semis)), [0, 1, 3, 4, 6, 8, 10]);
    assert.equal(theory.pc(notes[3].note), wrap(pc + 4));
    const strict = theory.buildScale(root, "1 b2 b3 b4 b5 b6 b7".split(" ").map(theory.parseDegree));
    assert.deepEqual(notes.map((n) => theory.pc(n.note)), strict.map((n) => theory.pc(n.note)));
  });
  regression(`Classical descending minor root ${pc}`, () => {
    const formula = SCALES.find((s) => s.id === "melodic-minor").descendingFormula;
    assert.deepEqual(formula.map(semitones), [12, 10, 8, 7, 5, 3, 2, 0]);
    const desc = theory.buildScale(root, formula.map(theory.parseDegree));
    assert.deepEqual(desc.map((n) => theory.pc(n.note)), [12, 10, 8, 7, 5, 3, 2, 0].map((s) => wrap(pc + s)));
  });
}
regression("Chord catalogue has no duplicate pitch sets or repeated members", () => {
  const signatures = CHORDS.map((c) => {
    const pitches = c.formula.map((d) => wrap(semitones(d)));
    assert.equal(new Set(pitches).size, pitches.length, c.id);
    return pitches.sort((a, b) => a - b).join(",");
  });
  assert.equal(new Set(signatures).size, signatures.length);
  assert.equal(new Set(CHORDS.map((c) => c.id)).size, CHORDS.length);
});
for (const [legacy, canonical] of Object.entries(LEGACY_CHORD_IDS)) {
  regression(`Legacy chord URL ${legacy}`, () => assert.equal(getChord(legacy)?.id, canonical));
}
regression("Historical coverage includes both previously missing keys", () => {
  assert.ok(keyCharacter("E", "minor"));
  assert.ok(keyCharacter("C♯", "minor"));
  assert.equal(keyCharacter("G#", "minor"), undefined);
  assert.equal(keyCharacter("Gb", "major"), undefined);
});
for (const spelling of ["B𝄫", "G𝄪", "C♭", "F♯", "E♭♭", "A♯♯"]) {
  regression(`Unicode accidental round trip ${spelling}`, () => {
    const note = theory.parseNote(spelling);
    assert.deepEqual(theory.parseNote(theory.noteName(note)), note);
  });
}
const result = {
  methodology: "Offline arithmetic and correction regressions with literal references. See data-corrections.md for implemented fixes and data-audit.md for the original snapshot. Running this script does not recheck websites.",
  counts, failures,
  inventory: { topics: TOPICS.length, sections: TOPICS.reduce((n, t) => n + t.sections.length, 0), scales: scales.length, modeFamilies: MODE_FAMILIES.length, modes: modes.length, chords: chords.length, keyCharacters: KEY_CHARACTERS.length, circlePositions: CIRCLE.length },
  scales, modes, chords, keys, circlePresentation,
  historicalKeyCoverage: { entries: KEY_CHARACTERS.map((k) => `${k.key} ${k.mode}`), missingPitchClasses: ["major", "minor"].flatMap((mode) => theory.ROOTS.filter(({ pc }) => !KEY_CHARACTERS.some((k) => k.mode === mode && theory.pc(theory.parseNote(k.key)) === pc)).map(({ label }) => `${label} ${mode}`)) },
};
const docs = new URL("../docs/", import.meta.url);
mkdirSync(docs, { recursive: true });
writeFileSync(new URL("data-audit-results.json", docs), JSON.stringify(result, null, 2) + "\n");
const table = (head, rows) => ["| " + head.join(" | ") + " |", "| " + head.map(() => "---").join(" | ") + " |", ...rows.map((row) => "| " + row.map((v) => String(v).replaceAll("|", "\\|")).join(" | ") + " |")].join("\n");
const inventory = [
  "# Current data inventory", "Generated with `node scripts/audit-music-data.mjs`. See [implemented corrections](data-corrections.md), [original comparison](data-audit.md), and [all 12 roots in JSON](data-audit-results.json).",
  "These are the application's current formulas, not proposed replacements. Formula arithmetic passing does not validate prose, chord naming, historical assertions, or every alias.",
  "## Topics", table(["Topic", "Sections"], TOPICS.map((t) => [t.title, t.sections.map((s) => s.title).join("; ")])),
  "## Scales", table(["Scale", "Current formula", "Semitones", "Arithmetic"], scales.map((s) => [s.name, s.formula.join(" "), s.semitones.join(" "), failures.some((f) => f.label.includes(s.id)) ? "Review JSON failures" : "Matches reference"])),
  "## Modes", table(["Family", "Mode", "Current formula"], modes.map((m) => [m.family, m.name, m.formula.join(" ")])),
  "## All chord rows", "Notes are spelled from C. Extensions show pitch-class names without octave numbers. See the comparison for naming/voicing qualifications.",
  table(["Current name", "Current symbol", "Current formula", "Notes from C", "Review"], chords.map((c) => [c.name, "C" + c.symbol, c.formula.join(" "), c.roots[0].notes.join(" "), c.review])),
  "## Key signatures", table(["Major", "Relative minor", "Sharps", "Flats", "Accidentals"], keys.map((k) => [k.tonic, k.minor, k.sharps, k.flats, k.accidentals.join(" ") || "None"])),
  "## Historical key coverage", `${KEY_CHARACTERS.length} entries. Missing by pitch class: ${result.historicalKeyCoverage.missingPitchClasses.join(", ") || "None"}. Descriptions are only returned for their exact historical spellings; this count does not authorize transferring them to enharmonic keys.`,
  "## Circle neighbour spellings", table(["Selected major", "IV", "V", "Spelling mismatch"], circlePresentation.map((s) => [s.major, ...s.shownNeighbours, s.neighbourSpellingMismatch ? "Yes" : "None"])),
  "## Verification", "```json", JSON.stringify({ counts, failures }, null, 2), "```", "",
].join("\n\n");
writeFileSync(new URL("data-inventory.md", docs), inventory);
console.log(JSON.stringify({ counts, inventory: result.inventory, failures, outputs: [fileURLToPath(new URL("data-audit-results.json", docs)), fileURLToPath(new URL("data-inventory.md", docs))] }, null, 2));
if (failures.length) process.exitCode = 1;
