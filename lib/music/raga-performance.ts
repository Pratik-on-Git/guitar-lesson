import { svaraPitch } from "./raga-studies.ts";

export const JATIS = [{ name: "Tisra", count: 3 }, { name: "Chaturasra", count: 4 }, { name: "Khanda", count: 5 }, { name: "Misra", count: 7 }, { name: "Sankirna", count: 9 }] as const;
export type Anga = "L" | "D" | "A";
export const TALA_PATTERNS: { name: string; angas: Anga[] }[] = [
  { name: "Dhruva", angas: ["L", "D", "L", "L"] }, { name: "Matya", angas: ["L", "D", "L"] }, { name: "Rupaka", angas: ["D", "L"] },
  { name: "Jhampa", angas: ["L", "A", "D"] }, { name: "Triputa", angas: ["L", "D", "D"] }, { name: "Ata", angas: ["L", "L", "D", "D"] }, { name: "Eka", angas: ["L"] },
];
export function angaCounts(anga: Anga, jati: number) { return anga === "L" ? jati : anga === "D" ? 2 : 1; }
export function talaBeats(pattern: (typeof TALA_PATTERNS)[number], jati: number) {
  return pattern.angas.flatMap((anga, group) => Array.from({ length: angaCounts(anga, jati) }, (_, offset) => ({ anga, group, offset, gesture: offset === 0 ? "Clap" : anga === "D" ? "Wave" : "Finger count" })));
}

export const SOURCE_ASSOCIATIONS = [
  { svara: "Sa", animal: "Peacock", planet: "Mercury", colour: "Green", chakra: "Muladhara", swatch: "#287646" },
  { svara: "Re", animal: "Bull", planet: "Mars", colour: "Red", chakra: "Svadhisthana", swatch: "#c33d46" },
  { svara: "Ga", animal: "Goat", planet: "Sun", colour: "Golden", chakra: "Manipura", swatch: "#a87615" },
  { svara: "Ma", animal: "Heron", planet: "Moon", colour: "White", chakra: "Anahata", swatch: "#ffffff" },
  { svara: "Pa", animal: "Cuckoo", planet: "Saturn", colour: "Blue or black", chakra: "Vishuddha", swatch: "linear-gradient(90deg, #3158a0 50%, #202127 50%)" },
  { svara: "Dha", animal: "Horse", planet: "Jupiter", colour: "Yellow", chakra: "Ajna", swatch: "#e8cf38" },
  { svara: "Ni", animal: "Elephant", planet: "Venus", colour: "Multicoloured", chakra: "Sahasrara", swatch: "linear-gradient(90deg, #ca527c, #d0aa29, #4a9b75, #7760be)" },
] as const;

export const LISTENING_STUDIES = [
  {
    id: "yaman", name: "Yaman", notes: ["Sa", "Re", "Ga", "Ḿa", "Pa", "Dha", "Ni"], omitted: [], vadi: "Ga", samvadi: "Ni", source: "https://tanarang.com/raag-yaman/",
    ascent: ["Sa", "Re", "Ga", "Ḿa", "Pa", "Dha", "Ni", "Sa′"], descent: ["Sa′", "Ni", "Dha", "Pa", "Ḿa", "Ga", "Re", "Sa"], phrase: [",Ni", "Re", "Ga"],
    focus: "Hear the raised fourth, then listen for lower Ni approaching Re and Ga.", task: "Find a lower-Ni approach in a rendition. Compare its arrival with the isolated Ḿa reference; a straight pitch drill does not supply the full grammar.",
    routeNote: "The ascending route is a pitch-collection drill, not a complete Yaman aroha. Study the lower-Ni approaches and phrase treatment in the linked source.",
  },
  {
    id: "durga", name: "Durga", notes: ["Sa", "Re", "Ma", "Pa", "Dha"], omitted: ["Ga", "Ni"], vadi: "Ma", samvadi: "Sa", source: "https://tanarang.com/raag-durga/",
    ascent: ["Sa", "Re", "Ma", "Pa", "Dha", "Sa′"], descent: ["Sa′", "Dha", "Pa", "Dha", "Ma", "Re", "Sa"], phrase: ["Pa", "Dha", "Ma"],
    focus: "Leave space for the absent Ga and Ni, and retain the descending turn through Pa and Dha.", task: "Trace Sa′ Dha Pa Dha Ma Re Sa. The outline descends overall while Pa → Dha rises locally. In the cited teaching description, Pa is not a descending resting note.",
    routeNote: "A shortened Tanarang teaching outline: the descent preserves the Pa–Dha turn and omits the source’s lower-register extension.",
  },
  {
    id: "malkauns", name: "Malkauns", notes: ["Sa", "ga", "Ma", "dha", "ni"], omitted: ["Re", "Pa"], vadi: "Ma", samvadi: "Sa", source: "https://tanarang.com/raag-malkauns/",
    ascent: ["Sa", "ga", "Ma", "dha", "ni", "Sa′"], descent: ["Sa′", "ni", "dha", "Ma", "ga", "Sa"], phrase: [",dha", ",ni", "Sa", "ga", "Ma"],
    focus: "Hear komal ga, dha and ni over a Sa-only drone; the pitch collection has no Re or Pa.", task: "Locate the low dha–ni approach and compare its arrival on Sa. Do not replace dha with Pa from a familiar minor-pentatonic shape.",
    routeNote: "A five-degree teaching outline. Use a Sa-only drone and learn the note treatment from a rendition rather than treating the scale drill as a performance.",
  },
] as const;

export function listeningSemitones(study: (typeof LISTENING_STUDIES)[number]) { return study.notes.map(svaraPitch); }
