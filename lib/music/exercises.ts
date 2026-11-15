import { BOOK_CHORD_TYPES } from "../content/book.ts";
import { carterQuestion } from "./carter-exercises.ts";
import { keySignature } from "./keys.ts";
import { buildScale, degreeBetween, intervalLong, intervalShort, mod, noteName, parseDegree, parseNote, prettyDegree, ROOTS, spellDegree, TUNING } from "./theory.ts";

export const EXERCISE_TYPES = [
  { value: "intervals", label: "Identify an interval" }, { value: "missing-note", label: "Spell an interval's top note" },
  { value: "chord-notes", label: "Spell a chord" }, { value: "chord-name", label: "Identify a chord" },
  { value: "fretboard", label: "Name a fretboard note" }, { value: "signatures", label: "Read a key signature" },
  { value: "carter-intervals", label: "Directional intervals" },
  { value: "carter-parents", label: "Parent-major exercise" },
  { value: "carter-scales", label: "Spell major scales" },
  { value: "carter-review", label: "Tuning, rhythm & chord review" },
];
export type ExerciseKind = (typeof EXERCISE_TYPES)[number]["value"];
export type Question = { prompt: string; answer: string; accepted: string[]; explanation: string; caseSensitive?: boolean; hint: string };
const INTERVAL_PAIRS = [["A", "Bb"], ["G#", "D"], ["F", "Ab"], ["F#", "D"], ["C#", "F#"], ["G#", "F"], ["E", "F#"], ["C", "G"], ["Eb", "G"], ["B", "G#"], ["Bb", "E"], ["A", "G"], ["Ab", "F#"], ["G", "A#"], ["Db", "C"], ["Db", "A"], ["Bb", "D#"], ["E", "Ab"]];
const MISSING = [["A", "3"], ["C#", "6"], ["F", "b6"], ["B", "2"], ["Eb", "7"], ["G", "#2"], ["D", "b5"], ["Ab", "#4"], ["C", "4"], ["E", "b2"], ["F", "#3"], ["F#", "b7"], ["B", "b4"], ["D#", "bb7"], ["A#", "5"], ["C", "#6"], ["Gb", "#5"], ["Db", "b3"]];
const QUIZ_ROOTS = ["D", "G", "C", "E", "Ab", "B", "F", "Db", "F#", "Eb", "Bb", "A"];
/** The two spelling and two identification tables on pp. 109/111. */
const BOOK_CHORD_SPELLING = [
  ["D", "major"], ["G", "minor"], ["C", "augmented"], ["E", "diminished"],
  ["Ab", "major"], ["C", "minor"], ["F", "augmented"], ["B", "diminished"],
  ["Db", "major-7"], ["B", "major-7"], ["E", "dominant-7"], ["C", "dominant-7"],
  ["G", "minor-major-7"], ["D", "minor-major-7"], ["Eb", "minor-7"], ["B", "minor-7"],
  ["C", "augmented-major-7"], ["G", "augmented-major-7"], ["F", "half-diminished"],
  ["C", "half-diminished"], ["A", "diminished-7"], ["F#", "diminished-7"],
];
const BOOK_CHORD_IDENTIFICATION = [
  ["B", "major"], ["Eb", "minor"], ["F", "minor"], ["Db", "minor"],
  ["C", "augmented"], ["Ab", "major"], ["G", "diminished"], ["D", "diminished"],
  ["F", "major-7"], ["Cb", "major-7"], ["G", "dominant-7"], ["D", "dominant-7"],
  ["Ab", "minor-major-7"], ["F#", "minor-major-7"], ["E", "minor-7"], ["Bb", "minor-7"],
  ["D", "augmented-major-7"], ["Gb", "augmented-major-7"], ["C", "half-diminished"],
  ["E", "half-diminished"], ["B", "diminished-7"], ["G", "diminished-7"],
];
const SIGNATURE_KEYS = ["C", "G", "D", "A", "E", "B", "F#", "C#", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];

export function exerciseQuestion(kind: string, index: number): Question {
  if (kind.startsWith("carter-")) return carterQuestion(kind, index);
  if (kind === "intervals") {
    const [a, b] = INTERVAL_PAIRS[mod(index, INTERVAL_PAIRS.length)]; const degree = degreeBetween(parseNote(a), parseNote(b)); const short = intervalShort(degree);
    return { prompt: `Name the ascending interval ${noteName(parseNote(a))} → ${noteName(parseNote(b))}.`, answer: `${short} · ${prettyDegree(degree.acc === 0 ? String(degree.num) : `${degree.acc > 0 ? "#".repeat(degree.acc) : "b".repeat(-degree.acc)}${degree.num}`)}`, accepted: [short, intervalLong(degree), prettyDegree(`${degree.acc > 0 ? "#".repeat(degree.acc) : "b".repeat(-degree.acc)}${degree.num}`)], caseSensitive: true, explanation: `Count the letters for the interval number, then the semitones for quality. ${noteName(parseNote(a))} to ${noteName(parseNote(b))} is ${intervalLong(degree)} (${short}). M means major; m means minor.`, hint: "Use M2, m3, P4, A4, d5, etc., or a degree such as ♭3. M/m are case-sensitive." };
  }
  if (kind === "missing-note") {
    const [r, d] = MISSING[mod(index, MISSING.length)]; const root = parseNote(r); const answer = noteName(spellDegree(root, parseDegree(d)));
    return { prompt: `Spell the note ${prettyDegree(d)} above ${noteName(root)}.`, answer, accepted: [answer], explanation: `${prettyDegree(d)} above ${noteName(root)} is ${answer}. Keep the letter required by the interval; an enharmonic pitch is not always the correct spelling.`, hint: "Use #, b, ## or bb for accidentals, or the musical symbols." };
  }
  if (kind === "chord-notes" || kind === "chord-name") {
    const source = (kind === "chord-notes" ? BOOK_CHORD_SPELLING : BOOK_CHORD_IDENTIFICATION)[index];
    const chord = source ? BOOK_CHORD_TYPES.find((c) => c.id === source[1])! : BOOK_CHORD_TYPES[mod(index - 22, BOOK_CHORD_TYPES.length)];
    const root = parseNote(source ? source[0] : QUIZ_ROOTS[mod(Math.floor(index / BOOK_CHORD_TYPES.length) + index, QUIZ_ROOTS.length)]);
    const notes = buildScale(root, chord.formula.map(parseDegree)).map((n) => n.name); const symbol = `${noteName(root)}${chord.symbol}`;
    return kind === "chord-notes" ? { prompt: `Spell ${symbol} (${chord.name.toLowerCase()}) from the root upward.`, answer: notes.join(" "), accepted: [notes.join(" ")], explanation: `${symbol} uses ${chord.formula.map(prettyDegree).join(" ")}: ${notes.join(" ")}. Spell by chord degree rather than replacing notes with enharmonic equivalents.`, hint: "Enter notes in formula order, separated by spaces. Example: C E G B." } : { prompt: `Name the root-position chord: ${notes.join(" ")}.`, answer: symbol, accepted: [symbol, `${noteName(root)} ${chord.name}`, ...(chord.id === "diminished" ? [`${noteName(root)}dim`, `${noteName(root)}mb5`] : []), ...(chord.id === "diminished-7" ? [`${noteName(root)}dim7`] : []), ...(chord.id === "half-diminished" ? [`${noteName(root)}ø7`, `${noteName(root)}ø`] : [])], explanation: `From ${noteName(root)}, the formula ${chord.formula.map(prettyDegree).join(" ")} identifies ${chord.name.toLowerCase()}: ${symbol}.`, hint: "Use a chord symbol, e.g. Cmaj7, Cm7, C+, Cm(maj7), Cm7b5 or Cdim7." };
  }
  if (kind === "signatures") {
    const key = SIGNATURE_KEYS[mod(index, SIGNATURE_KEYS.length)]; const sig = keySignature(key); const answer = `${noteName(parseNote(key))} major`;
    return { prompt: `Which major key has ${sig.accidentals.length ? sig.accidentals.join(" ") : "no sharps or flats"}?`, answer, accepted: [answer, noteName(parseNote(key))], explanation: `${answer}: ${sig.scale.join(" ")}. Last sharp → one semitone up; for flats use the penultimate flat. Remember C (none) and F (one flat).`, hint: "Give the major tonic, e.g. Eb or E♭ major. The relative minor shares the signature." };
  }
  const string = mod(index * 5, 6); const fret = mod(index * 7 + 3, 13); const pitch = mod(TUNING[string] + fret, 12); const names = ROOTS[pitch].spellings.map((n) => noteName(n));
  return { prompt: `Standard tuning: name string ${6 - string} at fret ${fret}.`, answer: names.join(" / "), accepted: names, explanation: `String ${6 - string} is open ${["E", "A", "D", "G", "B", "E"][string]}; move up ${fret} semitones to ${names.join(" / ")}. Fret 12 repeats the open pitch class.`, hint: "Either common enharmonic spelling is accepted for this fretboard question." };
}

export function checkExerciseAnswer(question: Question, input: string) {
  const normalize = (value: string) => {
    const text = value.trim().replaceAll("𝄪", "##").replaceAll("𝄫", "bb").replaceAll("♯", "#").replaceAll("♭", "b").replace(/[\s,–→]+/g, "");
    return question.caseSensitive ? text : text.toLowerCase();
  };
  return question.accepted.some((answer) => normalize(answer) === normalize(input));
}
