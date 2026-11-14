"use client";

import Link from "next/link";
import { BOOK_DIAGRAMS } from "@/lib/content/book";
import { FRET_SHEETS } from "@/lib/content/fretboard-sheets";
import { useQueryState } from "@/lib/use-query-state";
import { Panel } from "@/components/app/panel";
import { buttonVariants } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { RootPicker, useRootParam } from "@/components/music/controls";
import { FretSheetView, type SheetLabels } from "@/components/visuals/fret-sheet";

export function BookAtlas() {
  const [chapter, setChapter] = useQueryState("chapter", "All");
  const [page, setPage] = useQueryState("page", "20");
  const [labels, setLabels] = useQueryState("labels", "degree");
  const [rootPc, setRootPc] = useRootParam(9);
  const chapters = ["All", ...new Set(BOOK_DIAGRAMS.map((s) => s.chapter))];
  const activeChapter = chapters.includes(chapter) ? chapter : "All";
  const sheets = BOOK_DIAGRAMS.filter((s) => activeChapter === "All" || s.chapter === activeChapter);
  const selected = sheets.find((s) => s.page === Number(page)) ?? sheets[0];
  const index = sheets.indexOf(selected);
  const sheet = FRET_SHEETS.find((s) => s.page === selected.page)!;
  const markers = [sheet.neck, ...sheet.groups.flatMap((g) => g.diagrams)].reduce((n, d) => n + (d ? d.marks.split(" ").length : 0), 0);
  return (
    <Panel
      id="atlas"
      title="Diagram atlas"
      description="All 63 diagram sheets redrawn from an exact transcription of the book: every position, boxed anchor root and Double Note. The book prints them from A; pick any key to move the same shapes."
    >
      <div className="space-y-5">
        <Segmented label="Diagram chapter" value={activeChapter} onChange={setChapter} options={chapters.map((value) => ({ value, label: value, count: value === "All" ? BOOK_DIAGRAMS.length : BOOK_DIAGRAMS.filter((s) => s.chapter === value).length }))} />
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Diagram sheet
            <select value={selected.page} onChange={(e) => setPage(e.target.value)} className="bg-background w-full min-w-0 rounded-lg border p-3">
              {sheets.map((s) => <option key={s.page} value={s.page}>p. {s.page} · {s.chapter} · {s.title}</option>)}
            </select>
          </label>
          <Segmented<SheetLabels> label="Label notes by" size="sm" value={labels === "note" ? "note" : "degree"} onChange={setLabels} options={[{ value: "degree", label: "Degrees" }, { value: "note", label: "Notes" }]} />
        </div>
        <RootPicker value={rootPc} onChange={setRootPc} label="Key (the book uses A)" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button type="button" disabled={index === 0} className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => setPage(String(sheets[index - 1].page))}>Previous sheet</button>
            <button type="button" disabled={index === sheets.length - 1} className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => setPage(String(sheets[index + 1].page))}>Next sheet</button>
          </div>
          <p className="text-muted-foreground text-xs">{index + 1} of {sheets.length} · {markers} notes on this sheet</p>
          <Link className={buttonVariants({ variant: "soft", size: "sm" })} href={selected.href}>Open interactive lesson →</Link>
        </div>
        <div className="rounded-xl border p-3 sm:p-5" role="group" aria-label={`${selected.chapter} · ${selected.title} diagram sheet, page ${selected.page}`}>
          <FretSheetView key={sheet.page} sheet={sheet} rootPc={rootPc} labels={labels === "note" ? "note" : "degree"} />
        </div>
        <p className="text-muted-foreground text-xs">{selected.chapter} · {selected.title} · p. {selected.page} · Shapes © 2019 Yiannis Papadopoulos, transcribed from the supplied PDF and redrawn for study.</p>
      </div>
    </Panel>
  );
}
