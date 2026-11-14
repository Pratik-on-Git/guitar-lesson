import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { VoicingExplorer } from "@/components/music/voicing-explorer";
export const metadata: Metadata = { title: "Voicing Workbench" };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Voicing Workbench" description="Build inversions and drop 2/drop 3 voicings in any key, hear their spacing and find guitar grips." studyHref="/voicings" /><Suspense fallback={<ExplorerSkeleton />}><VoicingExplorer /></Suspense></div>; }
