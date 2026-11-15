"use client";

import { titleCaseLabel } from "@/lib/title-case";
import Link from "next/link";
import { useQueryState } from "@/lib/use-query-state";
import { THEORY_CHAPTERS, THEORY_CORRECTIONS } from "@/lib/content/theory-book";
import { THEORY_FIGURES, THEORY_ORIGINAL_AUDIO } from "@/lib/content/theory-book-assets";
import { Panel } from "@/components/app/panel";
import { StudySelect } from "./study-controls";
import { buttonVariants } from "@/components/ui/button";
import { TheoryVisual } from "@/components/visuals/theory-figures";

export function TheoryBookGuide() {
  const [figureId, setFigure] = useQueryState("figure", THEORY_FIGURES[0].id); const figure = THEORY_FIGURES.find((f) => f.id === figureId) ?? THEORY_FIGURES[0]; const index = THEORY_FIGURES.indexOf(figure);
  return <div className="flex flex-col gap-5">
    <Panel title="Seven parts, one learning path" description="All 220 PDF pages were reviewed. Page references below use PDF page numbers, including front matter. Teaching text is newly written; figures retain the supplied source's notation and occasional errors.">
      <ol className="grid gap-4 lg:grid-cols-2">{THEORY_CHAPTERS.map((chapter) => <li key={chapter.id} id={chapter.id} className="scroll-mt-24 rounded-xl border p-4"><h2 className="font-semibold">{titleCaseLabel(<>{chapter.title}</>)}</h2><p className="mt-1 text-xs text-muted-foreground">PDF pp. {chapter.pages}</p><p className="my-3 text-sm text-muted-foreground">{chapter.summary}</p><ul className="space-y-2">{chapter.lessons.map((lesson) => <li key={lesson.href} className="flex flex-wrap justify-between gap-x-3 text-sm"><Link className="text-primary hover:underline" href={lesson.href}>{titleCaseLabel(<>{lesson.title} →</>)}</Link><span className="text-xs text-muted-foreground">pp. {lesson.pages}</span></li>)}</ul></li>)}</ol>
    </Panel>
    <Panel title="The book in numbers" description="Where the pages and illustrations sit across the seven parts."><TheoryVisual id="chart-carter-parts" /></Panel>
    <Panel id="source-figures" title="Illustration atlas" description={`All ${THEORY_FIGURES.length} instructional figures, redrawn as live visuals: keyboards, interval grids, chord shapes, notation and counting diagrams. Notes and spellings are computed, so the book's labelling slips are already corrected.`}>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <StudySelect label="Figure" value={figure.id} onChange={setFigure} options={THEORY_FIGURES.map((f) => ({ value: f.id, label: `PDF p. ${f.page} · ${f.title}` }))} />
        <div className="flex gap-2">
          <button type="button" className={buttonVariants({ variant: "outline", size: "sm" })} disabled={index === 0} onClick={() => setFigure(THEORY_FIGURES[index - 1].id)}>{titleCaseLabel(<>Previous</>)}</button>
          <button type="button" className={buttonVariants({ variant: "outline", size: "sm" })} disabled={index === THEORY_FIGURES.length - 1} onClick={() => setFigure(THEORY_FIGURES[index + 1].id)}>{titleCaseLabel(<>Next</>)}</button>
        </div>
      </div>
      <figure className="mt-5">
        <div className="rounded-xl border p-3 sm:p-5"><TheoryVisual key={figure.id} id={figure.id} /></div>
        <figcaption className="text-muted-foreground mt-3 text-sm">PDF p. {figure.page} · {figure.title} · {index + 1} of {THEORY_FIGURES.length}</figcaption>
      </figure>
      <div className="mt-4"><Link href={figure.href} className={buttonVariants()}>{titleCaseLabel(<>Study this concept →</>)}</Link></div>
    </Panel>
    <Panel id="corrections" title="Corrections and qualifications" description="The app uses calculated intervals, spellings and durations. These notes explain where that differs from the supplied book; an unchanged source figure can still contain the original mistake."><div className="space-y-4">{THEORY_CORRECTIONS.map((entry) => <article key={entry.title} className="rounded-lg border-l-4 border-amber-500 bg-muted/30 p-4"><h3 className="font-semibold">{titleCaseLabel(<>{entry.title}</>)}</h3><p className="mt-1 text-xs text-muted-foreground">PDF pp. {entry.pages}</p><p className="mt-2 text-sm leading-6">{entry.text}</p></article>)}</div></Panel>
    <Panel id="exercises" title="Exercises and listening" description="Practice the book's relationships, not just its terminology. The new labs use synthesized examples and visible note/duration tables."><div className="grid gap-3 sm:grid-cols-2">{[
      ["Directional interval exercise · corrected answers", "/practice?exercise=carter-intervals"], ["Parent-major-scale exercise", "/practice?exercise=carter-parents"], ["Major scales and theoretical spellings", "/practice?exercise=carter-scales"], ["Meter, cents and bass/root review", "/practice?exercise=carter-review"], ["Both four-bar rhythm sequences", "/rhythm-lab"], ["Parallel modes and tonic drone", "/listening?tab=modes"], ["Compose and keep a four-bar sketch", "/composition"], ["Transpose and reharmonize progressions", "/progressions"],
    ].map(([title, href]) => <Link key={href} className="rounded-lg border p-3 text-sm text-primary hover:bg-muted" href={href}>{titleCaseLabel(<>{title} →</>)}</Link>)}</div>
      <details className="mt-6 rounded-lg border p-4"><summary className="cursor-pointer text-sm font-semibold">{titleCaseLabel(<>45 original audio-link references</>)}</summary><p className="my-3 text-sm text-muted-foreground">These legacy shortened links are preserved from the supplied PDF. Their current destinations and availability have not been verified. They are separate from the app&apos;s own synthesized examples. Mode labels below identify the family and position rather than perpetuating ambiguous source aliases.</p><ul className="grid gap-2 sm:grid-cols-2">{THEORY_ORIGINAL_AUDIO.map((audio) => <li key={audio.id}><a href={audio.href} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">{audio.label} · PDF p. {audio.page} ↗</a></li>)}</ul></details>
    </Panel>
    <Panel title="About this companion"><p className="text-sm leading-6">Explore seven parts of music theory through interactive figures, connected lessons and practice exercises. Use the illustration atlas to compare patterns, then test your understanding in the practice studio.</p><p className="mt-3 text-sm text-muted-foreground">The source is a study reference, not a promise that one taxonomy fits all styles. Lessons distinguish acoustic facts, notation conventions, stylistic practice and the author&apos;s personal approach.</p><Link href="/" className="mt-4 inline-block text-sm font-medium text-primary">{titleCaseLabel(<>← Overview</>)}</Link></Panel>
  </div>;
}
