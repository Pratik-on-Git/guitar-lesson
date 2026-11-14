import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { ArpeggioExplorer } from "@/components/music/arpeggio-explorer";
export const metadata: Metadata = { title: "Arpeggio Explorer" };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Arpeggio Explorer" description="Four triad and seven seventh-chord qualities, with spelled tones, audio, position windows and every source shape." studyHref="/arpeggios" /><Suspense fallback={<ExplorerSkeleton />}><ArpeggioExplorer /></Suspense></div>; }
