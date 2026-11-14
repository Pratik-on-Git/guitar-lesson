import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { StatusBadge } from "@/components/app/status-badge";
import { ChordLibrary } from "@/components/music/chord-library";
import { CHORDS, CHORD_CATEGORIES } from "@/lib/music/chords";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Panel } from "@/components/app/panel";
import { TheoryVisual } from "@/components/visuals/theory-figures";

export const metadata: Metadata = { title: "Chord Library" };

export default function ChordsPage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title="Chord Library"
        description="Reference chord formulas spelled in any key, with distinct chord qualities and voicing notes. Equivalent pitch collections are grouped together."
        studyHref="/chords"
        actions={<Link href="/voicings" className={buttonVariants({ variant: "outline" })}>Explore inversions & drops →</Link>}
        meta={
          <>
            <StatusBadge tone="brand">{CHORDS.length} formulas</StatusBadge>
            <StatusBadge tone="neutral">{CHORD_CATEGORIES.length} categories</StatusBadge>
          </>
        }
      />
      <Suspense fallback={<ExplorerSkeleton />}>
        <ChordLibrary />
      </Suspense>
      <Panel title="The library by family" description="How the formulas divide across chord families.">
        <TheoryVisual id="chart-chord-categories" />
      </Panel>
    </div>
  );
}
