import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Blocks } from "@/components/content/blocks";
import { PageHeader, Tag } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { ExplorerSkeleton } from "@/components/app/skeleton";
import { ModeExplorer } from "@/components/music/mode-explorer";
import { SimpleTable } from "@/components/ui/table";
import { MAJOR_MODE_TABLE, MODE_FAMILIES, getFamily } from "@/lib/music/modes";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODE_FAMILIES.map((f) => ({ family: f.id }));
}

export async function generateMetadata({ params }: PageProps<"/modes/[family]">): Promise<Metadata> {
  return { title: getFamily((await params).family)?.name };
}

export default async function ModeFamilyPage({ params }: PageProps<"/modes/[family]">) {
  const family = getFamily((await params).family);
  if (!family) notFound();

  const modeNotes = Object.fromEntries(family.modes.map((m) => [m.id, <Blocks key={m.id} blocks={m.notes} />]));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={family.name}
        description={`The ${family.modes.length} modes of the ${family.parentName.toLowerCase()}.`}
        studyHref={`/modes/${family.id}`}
        meta={<Tag>Parent: {family.parentName}</Tag>}
      />
      <Panel title="How this family works">
        <Blocks blocks={family.intro} />
        {family.id === "major" && (
          <div className="mt-6">
            <SimpleTable columns={MAJOR_MODE_TABLE.columns} rows={MAJOR_MODE_TABLE.rows} />
          </div>
        )}
      </Panel>
      <Suspense fallback={<ExplorerSkeleton />}>
        <ModeExplorer familyId={family.id} modeNotes={modeNotes} />
      </Suspense>
    </div>
  );
}
