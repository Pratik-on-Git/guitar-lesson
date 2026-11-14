import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { PracticeStudio } from "@/components/music/practice-studio";
export const metadata: Metadata = { title: "Practice Studio" };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Practice Studio" description="Test your theory, learn fretboard notes and turn each chapter into a focused, recorded practice session." studyHref="/practice" /><Suspense fallback={<ExplorerSkeleton />}><PracticeStudio /></Suspense></div>; }
