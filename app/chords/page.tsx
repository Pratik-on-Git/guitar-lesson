import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { ChordLibrary } from "@/components/music/chord-library";
import { CHORDS } from "@/lib/music/chords";

export const metadata: Metadata = { title: "Chord library" };

export default function ChordsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Chord library"
        description={`${CHORDS.length} chord formulas from your notes, spelled in any key. Rows that were the same chord under two names are merged.`}
        studyHref="/chords"
      />
      <Suspense fallback={<ExplorerSkeleton />}>
        <ChordLibrary />
      </Suspense>
    </div>
  );
}
