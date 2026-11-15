
import { titleCaseLabel } from "@/lib/title-case";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Blocks } from "@/components/content/blocks";
import { References } from "@/components/content/references";
import { TOPIC_REFERENCES } from "@/lib/content/references";
import { PageHeader } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { PageSkeleton } from "@/components/app/skeleton";
import { StatusBadge } from "@/components/app/status-badge";
import { TOPICS, getTopic } from "@/lib/content/topics";
import { NAV } from "@/lib/nav";
import { BookSource } from "@/components/content/book-source";
import { BOOK_TOPIC_PAGES } from "@/lib/content/book";
import { THEORY_TOPIC_PAGES } from "@/lib/content/theory-book";
import { TheoryBookSource } from "@/components/content/theory-book-source";
import Link from "next/link";
import { LESSON_VISUALS, CHART_TITLES } from "@/lib/content/lesson-visuals";
import { THEORY_FIGURES } from "@/lib/content/theory-book-assets";
import { BOOK_DIAGRAMS } from "@/lib/content/book";
import type { Block } from "@/lib/content/types";
import { RAGA_LESSONS } from "@/lib/content/raga-curriculum";

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
  const lesson = RAGA_LESSONS.find((entry) => entry.slug === topic.slug);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title={topic.title}
        description={topic.description}
        studyHref={href}
        meta={
          <>
            {part ? <StatusBadge tone="brand">{part}</StatusBadge> : null}
            {lesson ? <StatusBadge tone="neutral">{lesson.part}</StatusBadge> : null}
            <StatusBadge tone="neutral">
              {topic.sections.length} {topic.sections.length === 1 ? "section" : "sections"}
            </StatusBadge>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="flex min-w-0 flex-col gap-4 md:gap-6">
          {topic.sections.map((section) => (
            <div key={section.id} className="min-w-0 space-y-3">
              {section.part && <p className="pt-3 text-xs font-semibold tracking-wide text-primary">{titleCaseLabel(section.part)}</p>}
              <Panel id={section.id} title={section.title}>
                <Blocks blocks={[...section.blocks, ...visualBlocks(topic.slug, section.id)]} />
              </Panel>
            </div>
          ))}
          <References entries={TOPIC_REFERENCES[topic.slug] ?? []} />
          {BOOK_TOPIC_PAGES[topic.slug] && <BookSource pages={BOOK_TOPIC_PAGES[topic.slug]} />}
          {THEORY_TOPIC_PAGES[topic.slug] && <TheoryBookSource pages={THEORY_TOPIC_PAGES[topic.slug]} />}
          <nav aria-label="Continue studying" className="flex flex-wrap justify-between gap-4 text-sm font-medium text-primary">
            <Link href="/">{titleCaseLabel(<>← Study map</>)}</Link>
            <Link href="/practice">{titleCaseLabel(<>Put this into practice →</>)}</Link>
          </nav>
        </div>
        {topic.sections.length > 2 && (
          <nav aria-label="On this page" className="hidden xl:block">
            <div className="sticky top-24">
              <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide">On This Page</p>
              <ol className="border-border flex flex-col gap-0.5 border-l">
                {topic.sections.map((s) => (
                  <li key={s.id}>
                    {s.part && <p className="pt-4 pb-1 pl-3.5 text-xs font-semibold text-foreground">{titleCaseLabel(s.part)}</p>}
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

function visualBlocks(slug: string, section: string): Block[] {
  return (LESSON_VISUALS[slug]?.[section] ?? []).map((id) => {
    const figure = THEORY_FIGURES.find((f) => f.id === id);
    const sheet = id.startsWith("sheet-") ? BOOK_DIAGRAMS.find((d) => d.page === Number(id.slice(6))) : undefined;
    const caption = figure
      ? `${figure.title} · Theory illustration ${figure.page}`
      : sheet
        ? `${sheet.chapter} · ${sheet.title} · Diagram ${sheet.page}. Move it to any key in the atlas.`
        : id.startsWith("harmony-")
          ? `Harmony of the scale in diagram ${id.slice(8)}, in A`
          : CHART_TITLES[id];
    return { type: "visual", id, caption };
  });
}
