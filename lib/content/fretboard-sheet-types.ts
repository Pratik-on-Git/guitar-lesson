/** One printed neck window. `marks` is space-separated `string.fret` with an r (boxed anchor root) or d (Double Note) suffix. */
export type SheetDiagram = { label: string; from: number; to: number; marks: string };
export type SheetGroup = { title: string; formula: string[]; diagrams: SheetDiagram[] };
export type FretSheet = {
  page: number;
  section: string;
  title: string;
  kind: "scale" | "shapes" | "drop-2" | "drop-3" | "arpeggio";
  neck?: SheetDiagram;
  groups: SheetGroup[];
  table?: { melodic: string; intervallic: string; harmonic: string; extensions: string };
};
export type SheetMark = { string: number; fret: number; kind: "dot" | "root" | "double" };

export function parseMarks(marks: string): SheetMark[] {
  return marks.split(" ").filter(Boolean).map((token) => {
    const kind = token.endsWith("r") ? "root" : token.endsWith("d") ? "double" : "dot";
    const [string, fret] = token.replace(/[rd]$/, "").split(".").map(Number);
    return { string, fret, kind };
  });
}
