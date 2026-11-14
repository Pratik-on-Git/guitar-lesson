import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Blocks } from "@/components/content/blocks";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { ScaleExplorer } from "@/components/music/scale-explorer";
import { ExplorerSkeleton, PageSkeleton } from "@/components/app/skeleton";
import { SCALES, getScale } from "@/lib/music/scales";
import { prettyDegree } from "@/lib/music/theory";

export function generateStaticParams() {
  return SCALES.map((s) => ({ scale: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/scales/[scale]">): Promise<Metadata> {
  const scale = getScale((await params).scale);
  return { title: scale?.name };
}

// Params are awaited inside Suspense so navigation never blocks on URL data.
export default function ScalePage({ params }: PageProps<"/scales/[scale]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ScalePageBody params={params} />
    </Suspense>
  );
}

async function ScalePageBody({ params }: { params: PageProps<"/scales/[scale]">["params"] }) {
  const scale = getScale((await params).scale);
  if (!scale) notFound();

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title={scale.name}
        description={`Formula ${scale.formula.map(prettyDegree).join(" ")}`}
        studyHref={`/scales/${scale.id}`}
        meta={
          <>
            <StatusBadge tone="brand">{scale.family}</StatusBadge>
            <StatusBadge tone="neutral">{scale.formula.length} notes</StatusBadge>
            {scale.aka?.map((a) => (
              <StatusBadge key={a} tone="neutral">
                {a}
              </StatusBadge>
            ))}
          </>
        }
      />
      <Suspense fallback={<ExplorerSkeleton />}>
        <ScaleExplorer scaleId={scale.id} notes={<Blocks blocks={scale.notes} />} />
      </Suspense>
    </div>
  );
}
