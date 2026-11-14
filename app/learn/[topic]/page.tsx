import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Blocks } from "@/components/content/blocks";
import { PageHeader } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { PageSkeleton } from "@/components/app/skeleton";
import { StatusBadge } from "@/components/app/status-badge";
import { TOPICS, getTopic } from "@/lib/content/topics";
import { NAV } from "@/lib/nav";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[topic]">): Promise<Metadata> {
  const topic = getTopic((await params).topic);
  return { title: topic?.title, description: topic?.description };
}

// Params are awaited inside Suspense so navigation never blocks on URL data.
export default function TopicPage({ params }: PageProps<"/learn/[topic]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TopicPageBody params={params} />
    </Suspense>
  );
}

async function TopicPageBody({ params }: { params: PageProps<"/learn/[topic]">["params"] }) {
  const topic = getTopic((await params).topic);
  if (!topic) notFound();
  const href = `/learn/${topic.slug}`;
  const part = NAV.find((g) => g.items.some((i) => i.href === href))?.title;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title={topic.title}
        description={topic.description}
        studyHref={href}
        meta={
          <>
            {part ? <StatusBadge tone="brand">{part}</StatusBadge> : null}
            <StatusBadge tone="neutral">
              {topic.sections.length} {topic.sections.length === 1 ? "section" : "sections"}
            </StatusBadge>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="flex min-w-0 flex-col gap-4 md:gap-6">
          {topic.sections.map((section) => (
            <Panel key={section.id} id={section.id} title={section.title}>
              <Blocks blocks={section.blocks} />
            </Panel>
          ))}
        </div>
        {topic.sections.length > 2 && (
          <nav aria-label="On this page" className="hidden xl:block">
            <div className="sticky top-24">
              <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">On This Page</p>
              <ol className="border-border flex flex-col gap-0.5 border-l">
                {topic.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-muted-foreground hover:border-primary hover:text-primary -ml-px block border-l-2 border-transparent py-1.5 pl-3.5 text-sm transition-colors"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
