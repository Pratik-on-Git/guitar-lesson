import type { Question } from "./exercises.ts";
import { buildScale, degreeBetween, intervalLong, intervalShort, modeParentRoot, noteName, parseDegree, parseNote } from "./theory.ts";

export const CARTER_INTERVALS = [
  { from: "E", to: "C", direction: "ascending", corrected: false },
  { from: "E", to: "C", direction: "descending", corrected: false },
  { from: "D", to: "A#", direction: "ascending", corrected: true },
  { from: "D", to: "Bb", direction: "descending", corrected: false },
  { from: "Gb", to: "Ab", direction: "ascending", corrected: true },
];
export const CARTER_PARENTS = [
  { root: "G", name: "Dorian", start: 1, answer: "F" }, { root: "F#", name: "Mixolydian", start: 4, answer: "B" },
  { root: "E", name: "Phrygian", start: 2, answer: "C" }, { root: "A#", name: "Aeolian", start: 5, answer: "C#" },
  { root: "G", name: "Lydian", start: 3, answer: "D" }, { root: "D", name: "Locrian", start: 6, answer: "Eb" },
  { root: "B", name: "Ionian", start: 0, answer: "B" }, { root: "Db", name: "Mixolydian", start: 4, answer: "Gb" },
];
const MAJOR = ["1", "2", "3", "4", "5", "6", "7"].map(parseDegree);
export function carterQuestion(kind: string, index: number): Question {
  if (kind === "carter-intervals") {
    const item = CARTER_INTERVALS[index % CARTER_INTERVALS.length]; const a = parseNote(item.from); const b = parseNote(item.to);
    const degree = item.direction === "ascending" ? degreeBetween(a, b) : degreeBetween(b, a); const answer = intervalShort(degree);
    return { prompt: `${noteName(a)} → ${noteName(b)} (${item.direction}). Name the interval.`, answer, accepted: [answer, intervalLong(degree)], caseSensitive: true, explanation: `${intervalLong(degree)}. ${item.corrected ? "This corrects the answer printed on PDF page 219. " : ""}Count the written letters and semitones in the specified direction; a sharp or flat does not determine direction.`, hint: "Source exercise, PDF pp. 24–25; corrected answers pp. 218–219. Use M3, m6, A5, etc. M/m are case-sensitive." };
  }
  if (kind === "carter-parents") {
    const item = CARTER_PARENTS[index % CARTER_PARENTS.length]; const root = parseNote(item.root); const parent = modeParentRoot(root, MAJOR, item.start); const answer = noteName(parent);
    return { prompt: `Find the parent major scale of ${noteName(root)} ${item.name}.`, answer: `${answer} major`, accepted: [answer, `${answer} major`], explanation: `${item.name} is mode ${item.start + 1}. Reversing that parent degree gives ${answer} major. The spelling follows the actual parent interval.`, hint: "Source parent-major exercise, PDF pp. 67–69, answers p. 219. Enter the parent tonic, e.g. Eb major." };
  }
  if (kind === "carter-scales") {
    const roots = ["C", "G", "D", "A", "E", "B", "F#", "F", "Bb", "Eb", "Ab", "Db", "C#", "Cb", "A#"];
    const root = parseNote(roots[index % roots.length]); const answer = buildScale(root, MAJOR).map((n) => n.name).join(" ");
    return { prompt: `Spell ${noteName(root)} major in ascending order, without the closing octave.`, answer, accepted: [answer], explanation: `Use each letter once and apply W W H W W W H. ${answer}. Theoretical spellings can require double accidentals; a convenient enharmonic key is a different written answer.`, hint: "Major-scale exercise, PDF pp. 55–57, cheat sheet p. 218. Enter seven space-separated notes; #/b/##/bb are accepted." };
  }
  const questions = [
    { prompt: "Classify 3/4: simple triple or compound triple?", answer: "simple triple", explanation: "Three quarter-note main beats, each normally dividing into two eighths. The source misclassifies it on PDF page 158." },
    { prompt: "How many main dotted-quarter beats normally fill one 6/8 bar?", answer: "2", explanation: "Six eighth-note units form two groups of three: compound duple meter." },
    { prompt: "In quarter-note beats, how long is one dotted eighth?", answer: "0.75", explanation: "An eighth is 0.5 quarter-note beats; its dot adds 0.25, giving 0.75." },
    { prompt: "How many cents are in one equal-tempered semitone?", answer: "100", explanation: "Exactly 100 cents. Twelve semitones form 1,200 cents per octave." },
    { prompt: "Three thirty-second-note triplets together occupy how many quarter-note beats?", answer: "0.25", explanation: "They fit the duration of two ordinary thirty-seconds: one sixteenth, or one quarter of a quarter-note beat." },
    { prompt: "Cmaj7/E: name the chord root (one note).", answer: "C", explanation: "The root is C; E is the bass. Inversion changes the bass, not the root." },
  ];
  const q = questions[index % questions.length];
  return { ...q, accepted: [q.answer, ...(q.answer === "0.75" ? ["3/4"] : q.answer === "0.25" ? ["1/4"] : [])], hint: "Review question based on the book's tuning, rhythm and chord-structure chapters. Use decimals or simple fractions for durations." };
}
