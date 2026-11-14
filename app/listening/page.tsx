import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { ListeningLab } from "@/components/music/listening-lab";
export const metadata: Metadata = { title: "Listening Lab" };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Listening Lab" description="Sing intervals, compare parallel modes over a drone, measure tuning and shape expressive phrases." studyHref="/listening" /><Suspense fallback={<ExplorerSkeleton />}><ListeningLab /></Suspense></div>; }
