import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { PageSkeleton } from "@/components/app/skeleton";
import { BookAtlas } from "@/components/content/book-atlas";
import { BOOK_CHAPTERS, BOOK_TITLE } from "@/lib/content/book";
import { SimpleTable } from "@/components/ui/table";
import { References } from "@/components/content/references";

export const metadata: Metadata = { title: "Fretboard Concepts · Book Guide" };
export default function BookPage() {
  return <div className="flex flex-col gap-6 md:gap-8">
    <PageHeader title="Fretboard Concepts" description="A complete study companion to the supplied 2019 book: follow the learning path, explore its original diagrams and put each idea into practice." studyHref="/book" />
    <Panel title="A path through the book" description="Begin with the appendix's foundations, then move from theory into shapes, harmony and improvisation.">
      <div className="grid gap-3 sm:grid-cols-2">{BOOK_CHAPTERS.map((c, i) => <Link href={c.href} key={c.title} className="rounded-xl border p-4 transition-colors hover:border-primary hover:bg-primary/5">
        <p className="text-xs font-medium text-primary">{String(i + 1).padStart(2, "0")} · pp. {c.pages}</p><h2 className="mt-1 font-semibold">{c.title}</h2><p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
      </Link>)}</div>
    </Panel>
    <Panel title="How to use this companion">
      <p className="max-w-[75ch] text-sm leading-6">Lessons explain the concepts in new wording, while explorers compute correctly spelled notes in all 12 roots. The atlas preserves the exact A-root diagrams, including all five- and seven-position systems. Generated positions use their own starting-degree or fret-window controls; consult the atlas for the book&apos;s numbered boxes. Your study and practice progress stay in this browser.</p>
    </Panel>
    <Suspense fallback={<PageSkeleton />}><BookAtlas /></Suspense>
    <Panel title="Source corrections to keep in mind">
      <SimpleTable columns={["Page", "Source issue", "Use this instead"]} rows={[
        ["13", "Last-sharp shortcut", "Go one semitone above the actual final sharp: G♯ → A."],
        ["16–17", "Dominant definition depends on root membership", "Use harmonic function; a diatonic-root tritone substitute can still be valid."],
        ["52", "A augmented contains E♭maj7", "Contained major-seventh roots are A, C♯ and F."],
        ["80", "All melodic-minor notes always work over all its chords", "Check the melody, voicing, register and resolution."],
        ["99", "Scale choices treated as guaranteed containment", "Distinguish chord-tone containment from intentional tension."],
        ["102", "Altered-pentatonic seventh and fifth labels", "B♭ minor pentatonic/G7 includes ♭7; F minor pentatonic/G7 includes 11, not 5."],
        ["Contents", "Hirajoshi p. 25; Ionian ♯5 p. 37", "The actual pages are 26 and 38."],
      ]} />
    </Panel>
    <References entries={[{ title: `${BOOK_TITLE} · digital ISBN 978-618-00-0513-4 · source diagram atlas`, href: "/book#atlas" }]} />
  </div>;
}
