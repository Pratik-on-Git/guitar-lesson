import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { RhythmLab } from "@/components/music/rhythm-lab";
export const metadata: Metadata = { title: "Rhythm Lab" };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Rhythm Lab" description="All 17 rhythm units, both four-bar source exercises, meter comparison and cross-rhythms." studyHref="/rhythm-lab" /><Suspense fallback={<ExplorerSkeleton />}><RhythmLab /></Suspense></div>; }
