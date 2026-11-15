import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { TheoryBookGuide } from "@/components/music/theory-book-guide";
export const metadata: Metadata = { title: "Music Theory Book Guide", description: "A seven-part theory course with interactive illustrations, lessons, exercises and corrections." };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Music Theory Book Guide" description="Connect pitch, scales, chords and rhythm through seven parts, interactive illustrations and practical exercises." studyHref="/books/music-theory" /><Suspense fallback={<ExplorerSkeleton />}><TheoryBookGuide /></Suspense></div>; }
