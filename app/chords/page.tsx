import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { StatusBadge } from "@/components/app/status-badge";
import { ChordLibrary } from "@/components/music/chord-library";
import { CHORDS, CHORD_CATEGORIES } from "@/lib/music/chords";

export const metadata: Metadata = { title: "Chord Library" };

export default function ChordsPage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title="Chord Library"
        description="Every chord formula from your notes, spelled in any key. Rows that were the same chord under two names are merged."
        studyHref="/chords"
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
    </div>
  );
}
