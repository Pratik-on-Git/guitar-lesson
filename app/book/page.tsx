import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { PageSkeleton } from "@/components/app/skeleton";
import { BookAtlas } from "@/components/content/book-atlas";
import { BOOK_TITLE } from "@/lib/content/book";
import { SimpleTable } from "@/components/ui/table";
import { References } from "@/components/content/references";
import { TheoryVisual } from "@/components/visuals/theory-figures";

export const metadata: Metadata = { title: "Fretboard Guide" };
export default function BookPage() {
  return <div className="flex flex-col gap-6 md:gap-8">
    <PageHeader title="Fretboard Guide" description="Explore scales, chord shapes and arpeggios in any key, and put each idea into practice." studyHref="/book" />
    <Panel title="The book in numbers" description="Every diagram sheet and assignment is mapped into the app.">
      <div className="space-y-8"><TheoryVisual id="chart-fc-diagrams" /><TheoryVisual id="chart-fc-assignments" /></div>
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
    <References entries={[{ title: `${BOOK_TITLE} · interactive diagram atlas`, href: "/book#atlas" }]} />
  </div>;
}
