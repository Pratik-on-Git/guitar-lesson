import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Blocks } from "@/components/content/blocks";
import { PageHeader } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { StatusBadge } from "@/components/app/status-badge";
import { ExplorerSkeleton, PageSkeleton } from "@/components/app/skeleton";
import { ModeExplorer } from "@/components/music/mode-explorer";
import { SimpleTable } from "@/components/ui/table";
import { MAJOR_MODE_TABLE, MODE_FAMILIES, getFamily } from "@/lib/music/modes";

export function generateStaticParams() {
  return MODE_FAMILIES.map((f) => ({ family: f.id }));
}

export async function generateMetadata({ params }: PageProps<"/modes/[family]">): Promise<Metadata> {
  return { title: getFamily((await params).family)?.name };
}

// Params are awaited inside Suspense so navigation never blocks on URL data.
export default function ModeFamilyPage({ params }: PageProps<"/modes/[family]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ModeFamilyPageBody params={params} />
    </Suspense>
  );
}

async function ModeFamilyPageBody({ params }: { params: PageProps<"/modes/[family]">["params"] }) {
  const family = getFamily((await params).family);
  if (!family) notFound();

  const modeNotes = Object.fromEntries(family.modes.map((m) => [m.id, <Blocks key={m.id} blocks={m.notes} />]));

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title={family.name}
        description={`The ${family.modes.length} modes formed by centring the ${family.short.toLowerCase()} collection on each of its notes.`}
        studyHref={`/modes/${family.id}`}
        meta={
          <>
            <StatusBadge tone="brand">Parent: {family.parentName}</StatusBadge>
            <StatusBadge tone="neutral">{family.modes.length} modes</StatusBadge>
          </>
        }
      />
      <Panel title="How This Family Works">
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
