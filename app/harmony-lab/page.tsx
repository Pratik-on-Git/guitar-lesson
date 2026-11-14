import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { HarmonyLab } from "@/components/music/harmony-lab";
export const metadata: Metadata = { title: "Harmony Lab" };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Harmony Lab" description="Build extensions, control omissions, distinguish slash bass from inversion, and compare quartal and layered structures." studyHref="/harmony-lab" /><Suspense fallback={<ExplorerSkeleton />}><HarmonyLab /></Suspense></div>; }
