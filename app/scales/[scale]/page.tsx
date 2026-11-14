import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Blocks } from "@/components/content/blocks";
import { PageHeader, Tag } from "@/components/app/page-header";
import { ScaleExplorer } from "@/components/music/scale-explorer";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { SCALES, getScale } from "@/lib/music/scales";
import { prettyDegree } from "@/lib/music/theory";

export const dynamicParams = false;

export function generateStaticParams() {
  return SCALES.map((s) => ({ scale: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/scales/[scale]">): Promise<Metadata> {
  const scale = getScale((await params).scale);
  return { title: scale?.name };
}

export default async function ScalePage({ params }: PageProps<"/scales/[scale]">) {
  const scale = getScale((await params).scale);
  if (!scale) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={scale.name}
        description={`Formula ${scale.formula.map(prettyDegree).join(" ")}`}
        studyHref={`/scales/${scale.id}`}
        meta={
          <>
            <Tag>{scale.family}</Tag>
            <Tag>{scale.formula.length} notes</Tag>
            {scale.aka?.map((a) => <Tag key={a}>{a}</Tag>)}
          </>
        }
      />
      <Suspense fallback={<ExplorerSkeleton />}>
        <ScaleExplorer scaleId={scale.id} notes={<Blocks blocks={scale.notes} />} />
      </Suspense>
    </div>
  );
}
