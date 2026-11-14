import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/content/blocks";
import { PageHeader } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { TOPICS, getTopic } from "@/lib/content/topics";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[topic]">): Promise<Metadata> {
  const topic = getTopic((await params).topic);
  return { title: topic?.title, description: topic?.description };
}

export default async function TopicPage({ params }: PageProps<"/learn/[topic]">) {
  const topic = getTopic((await params).topic);
  if (!topic) notFound();
  const href = `/learn/${topic.slug}`;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={topic.title} description={topic.description} studyHref={href} />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="flex min-w-0 flex-col gap-6">
          {topic.sections.map((section) => (
            <Panel key={section.id} id={section.id} title={section.title}>
              <Blocks blocks={section.blocks} />
            </Panel>
          ))}
        </div>
        {topic.sections.length > 2 && (
          <nav aria-label="On this page" className="hidden xl:block">
            <div className="sticky top-24">
              <p className="mb-3 text-caption font-medium text-foreground">On this page</p>
              <ol className="flex flex-col gap-0.5 border-l border-border">
                {topic.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px block border-l border-transparent py-1.5 pl-3.5 text-caption text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
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
