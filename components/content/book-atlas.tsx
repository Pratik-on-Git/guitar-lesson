"use client";

import Image from "next/image";
import Link from "next/link";
import { BOOK_DIAGRAMS, diagramSrc } from "@/lib/content/book";
import { DIAGRAM_SIZES } from "@/lib/content/book-diagram-sizes";
import { useQueryState } from "@/lib/use-query-state";
import { Panel } from "@/components/app/panel";
import { buttonVariants } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";

export function BookAtlas() {
  const [chapter, setChapter] = useQueryState("chapter", "All");
  const [page, setPage] = useQueryState("page", "20");
  const chapters = ["All", ...new Set(BOOK_DIAGRAMS.map((s) => s.chapter))];
  const activeChapter = chapters.includes(chapter) ? chapter : "All";
  const sheets = BOOK_DIAGRAMS.filter((s) => activeChapter === "All" || s.chapter === activeChapter);
  const selected = sheets.find((s) => s.page === Number(page)) ?? sheets[0];
  const index = sheets.indexOf(selected);
  return <Panel id="atlas" title="Original diagram atlas" description="63 source sheets: every scale/mode, root-position chord, drop voicing and arpeggio diagram. The page selector follows printed page numbers.">
    <div className="space-y-5">
      <Segmented label="Diagram chapter" value={activeChapter} onChange={setChapter} options={chapters.map((value) => ({ value, label: value }))} />
      <label className="flex flex-col gap-2 text-sm font-medium">Diagram sheet
        <select value={selected.page} onChange={(e) => setPage(e.target.value)} className="w-full min-w-0 rounded-lg border bg-background p-3">
          {sheets.map((s) => <option key={s.page} value={s.page}>p. {s.page} · {s.chapter} · {s.title}</option>)}
        </select>
      </label>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button type="button" disabled={index === 0} className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => setPage(String(sheets[index - 1].page))}>Previous sheet</button>
          <button type="button" disabled={index === sheets.length - 1} className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => setPage(String(sheets[index + 1].page))}>Next sheet</button>
        </div>
        <Link className={buttonVariants({ variant: "soft", size: "sm" })} href={selected.href}>Open interactive lesson →</Link>
      </div>
      <figure>
        <a href={diagramSrc(selected.page)} target="_blank" rel="noreferrer" className="block rounded-xl border bg-white p-2 sm:p-5" aria-label={`Open page ${selected.page} full size`}>
          <Image key={selected.page} unoptimized src={diagramSrc(selected.page)} alt={`Original ${selected.title} ${selected.chapter.toLowerCase()} diagram sheet, page ${selected.page}; A-root shapes labeled by scale degree. Open full size to inspect every fingering.`} {...DIAGRAM_SIZES[selected.page]} className="mx-auto h-auto w-full max-w-4xl" />
        </a>
        <figcaption className="mt-3 text-sm text-muted-foreground">{selected.chapter} · {selected.title} · p. {selected.page} · © 2019 Yiannis Papadopoulos. Source illustration from the supplied PDF. Open the sheet to zoom; use the linked tool for transposed notes and accessible degree tables.</figcaption>
      </figure>
    </div>
  </Panel>;
}
