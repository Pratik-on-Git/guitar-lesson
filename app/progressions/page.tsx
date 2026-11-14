import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { ProgressionExplorer } from "@/components/music/progression-explorer";
export const metadata: Metadata = { title: "Progression Workbench" };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Progression Workbench" description="Transpose fifteen progression studies, compare eight transformations, and hear how individual voices move." studyHref="/progressions" /><Suspense fallback={<ExplorerSkeleton />}><ProgressionExplorer /></Suspense></div>; }
