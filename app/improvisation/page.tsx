import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { ApplicationExplorer } from "@/components/music/application-explorer";
export const metadata: Metadata = { title: "Scale-choice Workbench" };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Scale-choice Workbench" description="Explore chord-scale relationships and use minor pentatonic shapes to create modal and altered colours." studyHref="/improvisation" /><Suspense fallback={<ExplorerSkeleton />}><ApplicationExplorer /></Suspense></div>; }
