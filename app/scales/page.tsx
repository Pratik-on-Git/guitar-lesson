import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { TableWrap, tableCls, tdCls, thCls } from "@/components/ui/table";
import { COMPARISON_GROUPS, SCALES, getScale } from "@/lib/music/scales";
import { buildScale, parseDegree, prettyDegree, spellRoot, stepLabelTS, stepSizes } from "@/lib/music/theory";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Scale explorer" };

const SEMITONE_HEADERS = ["1", "♭2", "2", "♭3", "3", "4", "♯4/♭5", "5", "♭6", "6", "♭7", "7", "8"];

export default function ScalesPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Scale explorer"
        description="Every scale in your notes. Open one to play it in any key, on the neck and the keyboard."
      />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SCALES.map((scale) => {
          const degrees = scale.formula.map(parseDegree);
          const example = buildScale(spellRoot(scale.exampleRoot, degrees), degrees);
          return (
            <li key={scale.id}>
              <Link
                href={`/scales/${scale.id}`}
                className="group flex h-full flex-col rounded-card bg-card p-6 shadow-soft outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="text-[12px] font-medium text-muted-foreground">{scale.family}</span>
                <span className="mt-1 font-display text-heading-sm font-medium text-foreground">{scale.name}</span>
                <span className="mt-3 text-caption text-foreground">{scale.formula.map(prettyDegree).join("  ")}</span>
                <span className="mt-1 text-caption text-muted-foreground">
                  {example[0].name}: {example.map((n) => n.name).join(" ")}
                </span>
                <span className="mt-auto flex items-center gap-1.5 pt-5 text-caption font-medium text-foreground">
                  Explore <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <Panel
        title="Scale comparison chart"
        description="Each degree sits in its semitone column, so the notes that differ between scales line up. T = tone, S = semitone, TS = tone + semitone."
      >
        <div className="flex flex-col gap-8">
          {COMPARISON_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-2 text-caption font-medium text-foreground">{group.title}</p>
              <TableWrap>
                <table className={cn(tableCls, "min-w-[760px] table-fixed")}>
                  <thead>
                    <tr>
                      <th className={cn(thCls, "w-[170px]")}>Scale</th>
                      {SEMITONE_HEADERS.map((h) => (
                        <th key={h} className={cn(thCls, "pr-0 text-center")}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.scales.map((id) => {
                      const scale = getScale(id)!;
                      const notes = buildScale({ letter: 0, acc: 0 }, scale.formula.map(parseDegree));
                      const bySemi = new Map(notes.map((n) => [n.semis, n]));
                      const steps = stepSizes(notes.map((n) => n.semis)).map(stepLabelTS);
                      return (
                        <tr key={id}>
                          <th scope="row" className={cn(tdCls, "font-medium")}>
                            <Link href={`/scales/${id}`} className="hover:underline">
                              {scale.short}
                            </Link>
                            <span className="mt-0.5 block text-[12px] font-normal text-muted-foreground">{steps.join(" ")}</span>
                          </th>
                          {SEMITONE_HEADERS.map((_, semi) => {
                            const n = semi === 12 ? notes[0] : bySemi.get(semi);
                            return (
                              <td key={semi} className={cn(tdCls, "pr-0 text-center align-middle")}>
                                {n ? (
                                  <span className="inline-grid size-8 place-items-center rounded-full bg-foreground text-[12px] font-semibold text-background">
                                    {semi === 0 || semi === 12 ? "1" : n.label}
                                  </span>
                                ) : (
                                  <span aria-hidden className="text-fog">
                                    ·
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableWrap>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
