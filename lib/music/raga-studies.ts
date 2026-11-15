import { HINDUSTANI_POSITIONS } from "./raga.ts";

/** Teaching outlines already documented in the lesson's Tanarang references. */
export const KAFI_STUDIES = [
  { name: "Bhimpalasi", ascent: [",ni", "Sa", "ga", "Ma", "Pa", "ni", "Sa′"], descent: ["Sa′", "ni", "Dha", "Pa", "Ma", "ga", "Re", "Sa"], vadi: "Ma", samvadi: "Sa", treatment: "Re and Dha are omitted in ascent and included in descent. Sa, Ma and Pa are principal resting places in the cited teaching description." },
  { name: "Bageshree", ascent: ["Sa", "Re", "ga", "Ma", "Dha", "ni", "Sa′"], descent: ["Sa′", "ni", "Dha", "Ma", "Pa", "Dha", "Ma", "ga", "Re", "Sa"], vadi: "Ma", samvadi: "Sa", treatment: "This taught form includes Re in ascent; other versions omit it. Pa is absent in ascent and restrained or used in characteristic descending turns." },
  { name: "Dhani", ascent: ["Sa", "ga", "Ma", "Pa", "ni", "Sa′"], descent: ["Sa′", "ni", "Pa", "Ma", "ga", "Sa"], vadi: "ga", samvadi: "ni", treatment: "This pentatonic form omits Re and Dha in both directions. The cited source also documents an older descent and occasional Re; those are variants." },
] as const;

export function svaraPitch(symbol: string): number {
  let name = symbol;
  let register = 0;
  while (name.startsWith(",")) { register -= 12; name = name.slice(1); }
  while (name.endsWith("′")) { register += 12; name = name.slice(0, -1); }
  const pitch = HINDUSTANI_POSITIONS.findIndex((note) => note.symbol === name);
  if (pitch < 0) throw new Error(`Unknown teaching-outline svara: ${symbol}`);
  return pitch + register;
}

export function distinctDegrees(symbols: readonly string[]) {
  return new Set(symbols.map((symbol) => (svaraPitch(symbol) + 12) % 12)).size;
}

// Only documented examples: simplified Roman spelling is not a general decoder.
export const KATAPAYADI_EXAMPLES = [
  { name: "Harikambhoji", first: "ha", firstDigit: 8, second: "ri", secondDigit: 2, number: 28 },
  { name: "Dhirashankarabharanam", first: "dhi", firstDigit: 9, second: "ra", secondDigit: 2, number: 29 },
  { name: "Mechakalyani", first: "ma", firstDigit: 5, second: "ca", secondDigit: 6, number: 65 },
] as const;
