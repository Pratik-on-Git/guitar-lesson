import { buildScale, degreeSemitones, parseDegree, spellRoot } from "./theory.ts";

export const EXTENSION_BASES = [
  { id: "major", name: "Major seventh family", third: "3", seventh: "7" },
  { id: "minor", name: "Minor seventh family", third: "b3", seventh: "b7" },
  { id: "dominant", name: "Dominant seventh family", third: "3", seventh: "b7" },
];
export const CHORD_TENSIONS = ["b9", "#9", "#11", "b13", "b5", "#5"];
export function extensionFormula(familyId: string, extension: number, alterations: string[] = []) {
  const family = EXTENSION_BASES.find((f) => f.id === familyId) ?? EXTENSION_BASES[0];
  let formula = ["1", family.third, "5", family.seventh, ...(extension >= 9 ? ["9"] : []), ...(extension >= 11 ? ["11"] : []), ...(extension >= 13 ? ["13"] : [])];
  if (alterations.some((a) => ["b9", "#9"].includes(a))) formula = formula.filter((d) => d !== "9");
  if (alterations.includes("#11")) formula = formula.filter((d) => d !== "11");
  if (alterations.includes("b13")) formula = formula.filter((d) => d !== "13");
  if (alterations.some((a) => ["b5", "#5"].includes(a))) formula = formula.filter((d) => d !== "5");
  return [...formula, ...alterations.filter((a) => CHORD_TENSIONS.includes(a))].filter((d, i, all) => all.indexOf(d) === i).sort((a, b) => degreeSemitones(parseDegree(a)) - degreeSemitones(parseDegree(b)));
}
export function quartalFormula(kind: "perfect" | "diatonic", count: number) {
  return Array.from({ length: count }, (_, i) => {
    const num = 1 + i * 3; const natural = degreeSemitones({ num, acc: 0 }); const acc = kind === "perfect" ? i * 5 - natural : 0;
    return `${acc < 0 ? "b".repeat(-acc) : "#".repeat(acc)}${num}`;
  });
}
export function spellCollection(rootPc: number, formula: string[]) {
  const degrees = formula.map(parseDegree); const root = spellRoot(rootPc, degrees); return { root, tones: buildScale(root, degrees) };
}
