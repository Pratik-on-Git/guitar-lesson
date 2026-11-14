import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { TheoryBookGuide } from "@/components/music/theory-book-guide";
export const metadata: Metadata = { title: "Music Theory Book Guide", description: "Nicolas Carter's seven-part theory course: redrawn illustrations, chapter links, exercises and corrections." };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Music Theory Book Guide" description="Nicolas Carter · Music Theory: From Beginner to Expert · third edition · 220 PDF pages." studyHref="/books/music-theory" /><Suspense fallback={<ExplorerSkeleton />}><TheoryBookGuide /></Suspense></div>; }
