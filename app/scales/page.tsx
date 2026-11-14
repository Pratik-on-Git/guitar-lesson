import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ListMusic } from "lucide-react";
import { PageHeader, Section } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { IconTile } from "@/components/app/icon-tile";
import { StatusBadge } from "@/components/app/status-badge";
import { Card } from "@/components/ui/card";
import { TableWrap, tableCls, tdCls, thCls } from "@/components/ui/table";
import { COMPARISON_GROUPS, SCALES, getScale } from "@/lib/music/scales";
import { buildScale, parseDegree, prettyDegree, spellRoot, stepLabelTS, stepSizes } from "@/lib/music/theory";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Scale Explorer" };

const SEMITONE_HEADERS = ["1", "♭2", "2", "♭3", "3", "4", "♯4/♭5", "5", "♭6", "6", "♭7", "7", "8"];

export default function ScalesPage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title="Scale Explorer"
        description="Explore scales in any key, on the neck and the keyboard, with notes, intervals and practical applications."
        meta={<StatusBadge tone="brand">{SCALES.length} scales</StatusBadge>}
      />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SCALES.map((scale) => {
          const degrees = scale.formula.map(parseDegree);
          const example = buildScale(spellRoot(scale.exampleRoot, degrees), degrees);
          return (
            <li key={scale.id}>
              <Card
                size="sm"
                className="group/scale hover:ring-primary/30 has-focus-visible:ring-primary h-full transition-[box-shadow] hover:shadow-sm has-focus-visible:ring-2"
              >
                <Link href={`/scales/${scale.id}`} className="flex h-full flex-col gap-3 px-(--card-spacing) outline-none">
                  <div className="flex items-start gap-3">
                    <IconTile icon={<ListMusic />} tone="primary" className="transition-transform group-hover/scale:scale-105" />
                    <div className="min-w-0 flex-1">
                      <p className="text-title truncate font-semibold">{scale.name}</p>
                      <p className="text-muted-foreground text-xs">{scale.family}</p>
                    </div>
                    <StatusBadge tone="neutral">{scale.formula.length} notes</StatusBadge>
                  </div>
                  <div className="bg-muted/50 space-y-1 rounded-lg px-3 py-2.5">
                    <p className="font-mono text-xs font-medium tracking-wide">{scale.formula.map(prettyDegree).join("  ")}</p>
                    <p className="text-muted-foreground text-xs">
                      {example[0].name}: {example.map((n) => n.name).join(" ")}
                    </p>
                  </div>
                  <span className="text-primary mt-auto flex items-center gap-1.5 text-sm font-medium">
                    Explore
                    <ArrowRight className="size-3.5 transition-transform group-hover/scale:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </Card>
            </li>
          );
        })}
      </ul>

      <Section
        title="Scale Comparison Chart"
        description="Each degree sits in its semitone column, so the notes that differ between scales line up. T = tone, S = semitone, TS = tone + semitone."
      >
        <div className="flex flex-col gap-4 md:gap-6">
          {COMPARISON_GROUPS.map((group) => (
            <Panel key={group.title} title={group.title}>
              <TableWrap>
                <table className={cn(tableCls, "min-w-[760px] table-fixed")}>
                  <thead>
                    <tr>
                      <th className={cn(thCls, "w-[180px]")}>Scale</th>
                      {SEMITONE_HEADERS.map((h) => (
                        <th key={h} className={cn(thCls, "px-0! text-center!")}>
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
                            <Link href={`/scales/${id}`} className="text-primary hover:underline">
                              {scale.short}
                            </Link>
                            <span className="text-muted-foreground mt-0.5 block font-mono text-xs font-normal">{steps.join(" ")}</span>
                          </th>
                          {SEMITONE_HEADERS.map((_, semi) => {
                            const n = semi === 12 ? notes[0] : bySemi.get(semi);
                            const root = semi === 0 || semi === 12;
                            return (
                              <td key={semi} className={cn(tdCls, "px-0! text-center")}>
                                {n ? (
                                  <span
                                    className={cn(
                                      "inline-grid size-8 place-items-center rounded-full text-xs font-semibold",
                                      root ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                                    )}
                                  >
                                    {root ? "1" : n.label}
                                  </span>
                                ) : (
                                  <span aria-hidden className="text-muted-foreground/40">
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
            </Panel>
          ))}
        </div>
      </Section>
    </div>
  );
}
