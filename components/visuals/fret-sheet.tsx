"use client";

import { degreeSemitones, mod, noteName, parseDegree, prettyDegree, spellDegree, spellRoot, TUNING } from "@/lib/music/theory";
import { parseMarks, type FretSheet, type SheetDiagram } from "@/lib/content/fretboard-sheet-types";
import { cn } from "@/lib/utils";
import { NeckDiagram, type NeckMark } from "./neck-diagram";
import { IntervalRuler } from "./interval-ruler";
import { ContainedChords, ParentHarmony } from "./scale-harmony";

export type SheetLabels = "degree" | "note";

/** Semitones to move the book's A-root shapes to `rootPc`, kept within -5…+6 frets. */
export function shiftFor(rootPc: number) {
  const s = mod(rootPc - 9, 12);
  return s > 6 ? s - 12 : s;
}

function place(diagram: SheetDiagram, shift: number, full: boolean) {
  const marks = parseMarks(diagram.marks);
  if (full) {
    // The full neck is periodic over 12 frets: refill the same 1–16 window.
    const seen = new Map<string, (typeof marks)[number]>();
    for (const m of marks) for (const k of [-12, 0, 12]) {
      const fret = m.fret + shift + k;
      if (fret >= diagram.from && fret <= diagram.to && !seen.has(`${m.string}:${fret}`)) seen.set(`${m.string}:${fret}`, { ...m, fret });
    }
    return { from: diagram.from, to: diagram.to, marks: [...seen.values()] };
  }
  let s = shift;
  if (diagram.from + s < 1) s += 12;
  if (diagram.to + s > 22) s -= 12;
  return { from: diagram.from + s, to: diagram.to + s, marks: marks.map((m) => ({ ...m, fret: m.fret + s })) };
}

export function useSheetLabeler(formula: string[], rootPc: number, labels: SheetLabels) {
  const degrees = formula.map(parseDegree);
  const root = spellRoot(rootPc, degrees);
  const bySemi = new Map(formula.map((d, i) => [degreeSemitones(degrees[i]), d]));
  return (string: number, fret: number) => {
    const degree = bySemi.get(mod(TUNING[string] + fret - rootPc, 12)) ?? "?";
    if (labels === "note") return noteName(spellDegree(root, parseDegree(degree)));
    return degree === "1" ? "R" : prettyDegree(degree);
  };
}

function Diagram({ diagram, formula, rootPc, labels, full, caption, rootName }: { diagram: SheetDiagram; formula: string[]; rootPc: number; labels: SheetLabels; full?: boolean; caption: string; rootName: string }) {
  const label = useSheetLabeler(formula, rootPc, labels);
  const placed = place(diagram, shiftFor(rootPc), Boolean(full));
  const marks: NeckMark[] = placed.marks.map((m) => ({ string: m.string, fret: m.fret, kind: m.kind, label: label(m.string, m.fret) }));
  return (
    <figure className="min-w-0">
      <figcaption className="text-muted-foreground mb-1 text-center text-xs font-medium">{caption}</figcaption>
      <NeckDiagram from={placed.from} to={placed.to} marks={marks} title={`${caption}: ${rootName}-root shape, frets ${placed.from}–${placed.to}, ${marks.length} notes`} />
    </figure>
  );
}

export function SheetLegend({ doubles }: { doubles: boolean }) {
  return (
    <ul className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-2 text-xs">
      <li className="flex items-center gap-2"><span className="bg-foreground inline-block size-3.5 rounded-full" aria-hidden /> Note, labelled by degree</li>
      <li className="flex items-center gap-2"><span className="bg-primary inline-block size-3.5 rounded-sm" aria-hidden /> Anchor root (the boxed R)</li>
      {doubles && <li className="flex items-center gap-2"><svg viewBox="0 0 14 14" className="size-3.5" aria-hidden><path d="M7 1 L13 13 L1 13 Z" fill="var(--card)" stroke="var(--primary)" strokeWidth={2} /></svg> Double Note: same pitch as the G-string note before it</li>}
    </ul>
  );
}

export function FretSheetView({ sheet, rootPc = 9, labels = "degree" }: { sheet: FretSheet; rootPc?: number; labels?: SheetLabels }) {
  const firstFormula = sheet.groups[0].formula;
  const rootName = noteName(spellRoot(rootPc, firstFormula.map(parseDegree)));
  const doubles = [sheet.neck, ...sheet.groups.flatMap((g) => g.diagrams)].some((d) => d?.marks.includes("d"));
  const twoColumns = sheet.kind === "shapes" && sheet.groups.length === 2;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-primary text-xs font-semibold tracking-wide uppercase">{sheet.section} · p. {sheet.page}</p>
          <h3 className="text-heading font-semibold">{rootName} {sheet.title.replace(/ shapes$/, "")}{sheet.kind === "shapes" ? " shapes" : ""}</h3>
        </div>
        <SheetLegend doubles={doubles} />
      </div>

      {sheet.table && <SheetTable sheet={sheet} />}
      <SheetHarmony page={sheet.page} formula={firstFormula} rootPc={rootPc} />

      {sheet.neck && (
        <div className="bg-muted/30 rounded-xl border p-3 sm:p-4">
          <Diagram diagram={sheet.neck} formula={firstFormula} rootPc={rootPc} labels={labels} full caption="Whole neck · frets 1–16" rootName={rootName} />
        </div>
      )}

      <div className={cn("grid gap-6", twoColumns ? "md:grid-cols-2" : "")}>
        {sheet.groups.map((group) => (
          <section key={group.title || "positions"} className="min-w-0">
            {group.title && (
              <h4 className="mb-3 flex flex-wrap items-baseline gap-x-3 font-semibold">
                {group.title}
                <span className="text-muted-foreground text-xs font-normal">{group.formula.map((d) => (d === "1" ? "R" : prettyDegree(d))).join(" · ")}</span>
              </h4>
            )}
            <div className={cn("grid gap-x-6 gap-y-5", twoColumns ? "" : "sm:grid-cols-2", sheet.kind.startsWith("drop") && "lg:grid-cols-4 sm:grid-cols-2")}>
              {group.diagrams.map((d) => (
                <Diagram key={d.label} diagram={d} formula={group.formula} rootPc={rootPc} labels={labels} caption={d.label} rootName={rootName} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function SheetTable({ sheet }: { sheet: FretSheet }) {
  const t = sheet.table!;
  const formula = t.intervallic.split(" ");
  return (
    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-xl border p-4">
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">Intervallic & melodic formula</p>
        <IntervalRuler formula={formula} />
        <p className="mt-3 font-mono text-sm">{t.melodic.split(" ").join(" · ")}</p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-xl border p-4">
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Harmonic formula</dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">{t.harmonic.startsWith("See") ? <span className="text-sm">Shown below ({t.harmonic.replace("See ", "book ")})</span> : t.harmonic.split(" ").map((c) => <span key={c} className="bg-muted rounded-md px-2 py-0.5 font-mono text-xs">{c}</span>)}</dd>
        </div>
        <div className="rounded-xl border p-4">
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Root-chord extensions</dt>
          <dd className="mt-2 text-sm font-semibold">{t.extensions}</dd>
        </div>
      </dl>
    </div>
  );
}

/** The harmony the book refers to elsewhere ("check pages 18–19 / 51–53"), shown in place. */
export function SheetHarmony({ page, formula, rootPc }: { page: number; formula: string[]; rootPc: number }) {
  if (page === 20 || page === 22) return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Harmony from the parent modes (pp. 18–19)</p>
      <ParentHarmony scale="major-pentatonic" rootPc={rootPc} />
      {page === 22 && <p className="text-muted-foreground text-xs">The blue note ♭3 adds ♭IIImaj7 or ♭III+maj7 (book, p. 19).</p>}
    </div>
  );
  if (page === 21 || page === 23) return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Harmony from the parent modes (p. 19)</p>
      <ParentHarmony scale="minor-pentatonic" rootPc={rootPc} />
      {page === 23 && <p className="text-muted-foreground text-xs">The blue note ♭5 adds ♭Vmaj7 or ♭V+maj7 (book, p. 19).</p>}
    </div>
  );
  if (page >= 54 && page <= 57) return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Chord types contained in the scale (pp. 51–53)</p>
      <ContainedChords formula={formula} rootPc={rootPc} />
    </div>
  );
  return null;
}
