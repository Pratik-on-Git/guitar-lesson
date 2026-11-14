import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { HarmonizationExplorer } from "@/components/music/harmonization-explorer";
export const metadata: Metadata = { title: "Harmonization Workbench" };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Harmonization Workbench" description="Follow every degree of major, harmonic minor and melodic minor through chords, arpeggios and the guitar neck." studyHref="/harmonization" /><Suspense fallback={<ExplorerSkeleton />}><HarmonizationExplorer /></Suspense></div>; }
