import { buildScale, noteName, parseDegree, parseNote, spellDegree, type Note } from "./theory.ts";

/*
 * Circle of fifths, key signatures and the key characters table from
 * Guitar.docx. Signatures are computed from the major scale on each key.
 */

const MAJOR = ["1", "2", "3", "4", "5", "6", "7"].map(parseDegree);

/** Clockwise from C at 12 o'clock. Positions 5-7 have enharmonic twins. */
export const CIRCLE: { major: string; minor: string; alt?: { major: string; minor: string } }[] = [
  { major: "C", minor: "A" },
  { major: "G", minor: "E" },
  { major: "D", minor: "B" },
  { major: "A", minor: "F#" },
  { major: "E", minor: "C#" },
  { major: "B", minor: "G#", alt: { major: "Cb", minor: "Ab" } },
  { major: "F#", minor: "D#", alt: { major: "Gb", minor: "Eb" } },
  { major: "Db", minor: "Bb", alt: { major: "C#", minor: "A#" } },
  { major: "Ab", minor: "F" },
  { major: "Eb", minor: "C" },
  { major: "Bb", minor: "G" },
  { major: "F", minor: "D" },
];

export const SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"];
export const FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"];

export type KeySignature = {
  tonic: Note;
  sharps: number;
  flats: number;
  accidentals: string[];
  scale: string[];
};

export function keySignature(majorTonic: string): KeySignature {
  const tonic = parseNote(majorTonic);
  const scale = buildScale(tonic, MAJOR);
  const altered = scale.filter((s) => s.note.acc !== 0);
  const sharps = altered.filter((s) => s.note.acc > 0).length;
  const flats = altered.filter((s) => s.note.acc < 0).length;
  const order = sharps ? SHARP_ORDER : FLAT_ORDER;
  const accidentals = order
    .map((letter) => altered.find((s) => noteName(s.note, true)[0] === letter))
    .filter((s) => s !== undefined)
    .map((s) => s.name);
  return { tonic, sharps, flats, accidentals, scale: scale.map((s) => s.name) };
}

export function relativeMinor(majorTonic: string): string {
  const scale = buildScale(parseNote(majorTonic), MAJOR);
  return scale[5].name;
}

/** Spell IV and V from the selected tonic, including its enharmonic spelling. */
export function keyNeighbours(majorTonic: string): { iv: string; v: string } {
  const tonic = parseNote(majorTonic);
  return {
    iv: noteName(spellDegree(tonic, parseDegree("4"))),
    v: noteName(spellDegree(tonic, parseDegree("5"))),
  };
}

export const KEY_CHARACTER_SOURCE = "https://biteyourownelbow.com/keychar.htm";
const MINOR_CHARACTER_SOURCE = "https://mediatum.ub.tum.de/doc/1138386/1138386.pdf#page=4";

/** Historical excerpts retained from the notes; new entries are labelled paraphrases. */
export const KEY_CHARACTERS: { key: string; mode: "major" | "minor"; text: string; source?: string }[] = [
  { key: "C", mode: "major", text: "Completely pure. Its character is innocence, simplicity, naivety, children's talk." },
  { key: "C", mode: "minor", text: "Declaration of love and at the same time the lament of unhappy love. All languishing, longing, sighing of the love-sick soul lies in this key." },
  { key: "C#", mode: "minor", text: "Historical paraphrase: remorseful grief and longing after disappointed affection or friendship.", source: MINOR_CHARACTER_SOURCE },
  { key: "Db", mode: "major", text: "A leering key, degenerating into grief and rapture. It cannot laugh, but it can smile; it cannot howl, but it can at least grimace its crying. Only unusual characters and feelings can be brought out in this key." },
  { key: "D", mode: "major", text: "The key of triumph, of Hallelujahs, of war-cries, of victory-rejoicing. The inviting symphonies, the marches, holiday songs and heaven-rejoicing choruses are set in this key." },
  { key: "D", mode: "minor", text: "Melancholy womanliness, the spleen and humours brood." },
  { key: "D#", mode: "minor", text: "Feelings of the anxiety of the soul's deepest distress, of brooding despair, of blackest depression, of the gloomiest condition of the soul. Every fear, every hesitation of the shuddering heart breathes out of horrible D♯ minor. If ghosts could speak, their speech would approximate this key." },
  { key: "Eb", mode: "major", text: "The key of love, of devotion, of intimate conversation with God." },
  { key: "E", mode: "major", text: "Noisy shouts of joy, laughing pleasure and not yet complete, full delight lies in E major." },
  { key: "E", mode: "minor", text: "Historical paraphrase: youthful innocence and a gentle expression of love.", source: MINOR_CHARACTER_SOURCE },
  { key: "F", mode: "major", text: "Complaisance and calm." },
  { key: "F", mode: "minor", text: "Deep depression, funereal lament, groans of misery and longing for the grave." },
  { key: "F#", mode: "major", text: "Triumph over difficulty, the free sigh of relief uttered when hurdles are surmounted; the echo of a soul which has fiercely struggled and finally conquered lies in all uses of this key." },
  { key: "F#", mode: "minor", text: "A gloomy key: it tugs at passion as a dog biting a dress. Resentment and discontent are its language." },
  { key: "G", mode: "major", text: "Everything rustic, idyllic and lyrical, every calm and satisfied passion, every tender gratitude for true friendship and faithful love; in a word, every gentle and peaceful emotion of the heart is correctly expressed by this key." },
  { key: "G", mode: "minor", text: "Discontent, uneasiness, worry about a failed scheme; bad-tempered gnashing of teeth; in a word, resentment and dislike." },
  { key: "Ab", mode: "major", text: "Key of the grave. Death, grave, putrefaction, judgment, eternity lie in its radius." },
  { key: "Ab", mode: "minor", text: "Grumbler, heart squeezed until it suffocates; wailing lament, difficult struggle; in a word, the colour of this key is everything struggling with difficulty." },
  { key: "A", mode: "major", text: "Declarations of innocent love, satisfaction with one's state of affairs; hope of seeing one's beloved again when parting; youthful cheerfulness and trust in God." },
  { key: "A", mode: "minor", text: "Pious womanliness and tenderness of character." },
  { key: "Bb", mode: "major", text: "Cheerful love, clear conscience, hope, aspiration for a better world." },
  { key: "Bb", mode: "minor", text: "A quaint creature, often dressed in the garment of night. It is somewhat surly and very seldom takes on a pleasant countenance. Mocking God and the world; discontented with itself and with everything; preparation for suicide sounds in this key." },
  { key: "B", mode: "major", text: "Strongly coloured, announcing wild passions, composed from the most glaring colours. Anger, rage, jealousy, fury, despair and every burden of the heart lies in its sphere." },
  { key: "B", mode: "minor", text: "The key of patience, of calm awaiting one's fate and of submission to divine dispensation." },
];

/** Historical spellings remain distinct, even when modern pitch classes coincide. */
export function keyCharacter(key: string, mode: "major" | "minor") {
  const target = noteName(parseNote(key), true);
  return KEY_CHARACTERS.find((k) => k.mode === mode && k.key === target);
}
