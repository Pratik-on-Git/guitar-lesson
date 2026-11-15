/**
 * Pitch-class comparisons for the raga lesson, not performance tunings.
 * Sa = C here; enharmonic names describe the same position in 12-TET.
 * Sources and the supplied PDF's page map: docs/raga-review.md.
 */
export const CARNATIC_SVARAS = [
  { name: "Shadjam", symbol: "S", semitones: 0, western: "C" },
  { name: "Shuddha Rishabham", symbol: "R1", semitones: 1, western: "D♭" },
  { name: "Chatushruti Rishabham", symbol: "R2", semitones: 2, western: "D" },
  { name: "Shatshruti Rishabham", symbol: "R3", semitones: 3, western: "D♯" },
  { name: "Shuddha Gandharam", symbol: "G1", semitones: 2, western: "E𝄫" },
  { name: "Sadharana Gandharam", symbol: "G2", semitones: 3, western: "E♭" },
  { name: "Antara Gandharam", symbol: "G3", semitones: 4, western: "E" },
  { name: "Shuddha Madhyamam", symbol: "M1", semitones: 5, western: "F" },
  { name: "Prati Madhyamam", symbol: "M2", semitones: 6, western: "F♯" },
  { name: "Panchamam", symbol: "P", semitones: 7, western: "G" },
  { name: "Shuddha Dhaivatam", symbol: "D1", semitones: 8, western: "A♭" },
  { name: "Chatushruti Dhaivatam", symbol: "D2", semitones: 9, western: "A" },
  { name: "Shatshruti Dhaivatam", symbol: "D3", semitones: 10, western: "A♯" },
  { name: "Shuddha Nishadam", symbol: "N1", semitones: 9, western: "B𝄫" },
  { name: "Kaishiki Nishadam", symbol: "N2", semitones: 10, western: "B♭" },
  { name: "Kakali Nishadam", symbol: "N3", semitones: 11, western: "B" },
] as const;

export const HINDUSTANI_POSITIONS = [
  { name: "Shadja", symbol: "Sa", western: "C" },
  { name: "Komal Rishabh", symbol: "re", western: "D♭" },
  { name: "Shuddha Rishabh", symbol: "Re", western: "D" },
  { name: "Komal Gandhar", symbol: "ga", western: "E♭" },
  { name: "Shuddha Gandhar", symbol: "Ga", western: "E" },
  { name: "Shuddha Madhyam", symbol: "Ma", western: "F" },
  { name: "Tivra Madhyam", symbol: "Ḿa", western: "F♯" },
  { name: "Pancham", symbol: "Pa", western: "G" },
  { name: "Komal Dhaivat", symbol: "dha", western: "A♭" },
  { name: "Shuddha Dhaivat", symbol: "Dha", western: "A" },
  { name: "Komal Nishad", symbol: "ni", western: "B♭" },
  { name: "Shuddha Nishad", symbol: "Ni", western: "B" },
] as const;

export const THAATS = [
  { name: "Bilawal", notes: "Sa Re Ga Ma Pa Dha Ni", semitones: [0, 2, 4, 5, 7, 9, 11], comparison: "Major (Ionian)", example: "Alhaiya Bilawal" },
  { name: "Kalyan", notes: "Sa Re Ga Ḿa Pa Dha Ni", semitones: [0, 2, 4, 6, 7, 9, 11], comparison: "Lydian", example: "Yaman" },
  { name: "Khamaj", notes: "Sa Re Ga Ma Pa Dha ni", semitones: [0, 2, 4, 5, 7, 9, 10], comparison: "Mixolydian", example: "Khamaj" },
  { name: "Kafi", notes: "Sa Re ga Ma Pa Dha ni", semitones: [0, 2, 3, 5, 7, 9, 10], comparison: "Dorian", example: "Bhimpalasi" },
  { name: "Asavari", notes: "Sa Re ga Ma Pa dha ni", semitones: [0, 2, 3, 5, 7, 8, 10], comparison: "Natural minor (Aeolian)", example: "Jaunpuri" },
  { name: "Bhairavi", notes: "Sa re ga Ma Pa dha ni", semitones: [0, 1, 3, 5, 7, 8, 10], comparison: "Phrygian", example: "Bhairavi" },
  { name: "Bhairav", notes: "Sa re Ga Ma Pa dha Ni", semitones: [0, 1, 4, 5, 7, 8, 11], comparison: "Double harmonic major", example: "Bhairav" },
  { name: "Poorvi", notes: "Sa re Ga Ḿa Pa dha Ni", semitones: [0, 1, 4, 6, 7, 8, 11], comparison: "—", example: "Puriya Dhanashree" },
  { name: "Marwa", notes: "Sa re Ga Ḿa Pa Dha Ni", semitones: [0, 1, 4, 6, 7, 9, 11], comparison: "—", example: "Marwa" },
  { name: "Todi", notes: "Sa re ga Ḿa Pa dha Ni", semitones: [0, 1, 3, 6, 7, 8, 11], comparison: "—", example: "Miyan ki Todi" },
] as const;

export const CHAKRAS = [
  { name: "Indu", meaning: "One moon" },
  { name: "Netra", meaning: "Two eyes" },
  { name: "Agni", meaning: "Three sacred fires" },
  { name: "Veda", meaning: "Four Vedas" },
  { name: "Bana", meaning: "Five arrows of Manmatha (Kama)" },
  { name: "Ritu", meaning: "Six seasons" },
  { name: "Rishi", meaning: "Seven sages" },
  { name: "Vasu", meaning: "Eight Vasus" },
  { name: "Brahma", meaning: "Nine Brahmas" },
  { name: "Disi", meaning: "Ten directions" },
  { name: "Rudra", meaning: "Eleven Rudras" },
  { name: "Aditya", meaning: "Twelve Adityas" },
] as const;

// Conventional Roman spellings of the modern sampurna scheme, in number order.
const MELAKARTA_NAMES = [
  "Kanakangi", "Ratnangi", "Ganamurti", "Vanaspati", "Manavati", "Tanarupi",
  "Senavati", "Hanumatodi", "Dhenuka", "Natakapriya", "Kokilapriya", "Rupavati",
  "Gayakapriya", "Vakulabharanam", "Mayamalavagowla", "Chakravakam", "Suryakantam", "Hatakambari",
  "Jhankaradhvani", "Natabhairavi", "Kiravani", "Kharaharapriya", "Gaurimanohari", "Varunapriya",
  "Mararanjani", "Charukesi", "Sarasangi", "Harikambhoji", "Dhirashankarabharanam", "Naganandini",
  "Yagapriya", "Ragavardhini", "Gangeyabhushani", "Vagadheeswari", "Shulini", "Chalanata",
  "Salagam", "Jalarnavam", "Jhalavarali", "Navaneetam", "Pavani", "Raghupriya",
  "Gavambodhi", "Bhavapriya", "Shubhapantuvarali", "Shadvidhamargini", "Suvarnangi", "Divyamani",
  "Dhavalambari", "Namanarayani", "Kamavardhini", "Ramapriya", "Gamanashrama", "Vishwambhari",
  "Shamalangi", "Shanmukhapriya", "Simhendramadhyamam", "Hemavati", "Dharmavati", "Neetimati",
  "Kantamani", "Rishabhapriya", "Latangi", "Vachaspati", "Mechakalyani", "Chitrambari",
  "Sucharitra", "Jyotisvarupini", "Dhatuvardhini", "Nasikabhushani", "Kosalam", "Rasikapriya",
] as const;

export type CarnaticSvara = (typeof CARNATIC_SVARAS)[number]["symbol"];

export const RI_GA: readonly (readonly [CarnaticSvara, CarnaticSvara])[] = [
  ["R1", "G1"], ["R1", "G2"], ["R1", "G3"], ["R2", "G2"], ["R2", "G3"], ["R3", "G3"],
];
export const DHA_NI: readonly (readonly [CarnaticSvara, CarnaticSvara])[] = [
  ["D1", "N1"], ["D1", "N2"], ["D1", "N3"], ["D2", "N2"], ["D2", "N3"], ["D3", "N3"],
];

export const MELAKARTAS = MELAKARTA_NAMES.map((name, index) => {
  const chakraIndex = Math.floor(index / 6);
  const [ri, ga] = RI_GA[chakraIndex % 6];
  const [dha, ni] = DHA_NI[index % 6];
  const svaras: CarnaticSvara[] = ["S", ri, ga, index < 36 ? "M1" : "M2", "P", dha, ni];
  const positions = svaras.map((symbol) => CARNATIC_SVARAS.find((s) => s.symbol === symbol)!);
  return {
    number: index + 1,
    name,
    chakra: CHAKRAS[chakraIndex].name,
    svaras,
    semitones: positions.map((s) => s.semitones),
    western: positions.map((s) => s.western),
  };
});
