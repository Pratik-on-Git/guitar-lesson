import Link from "next/link";
import { CircleAlert, ExternalLink, Headphones, Lightbulb, PenLine, type LucideIcon } from "lucide-react";
import type { Block } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { Fact, FactGrid } from "@/components/app/facts";
import { SimpleTable } from "@/components/ui/table";
import { Widget } from "./widgets";
import { TheoryVisual } from "@/components/visuals/theory-figures";

/* Renders the structured notes. Prose width is capped for reading. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "links":
      return <div className="flex flex-wrap gap-3">{block.items.map((item) => <Link key={item.href} href={item.href} className="text-primary rounded-lg border px-3 py-2 text-sm font-medium hover:bg-primary/5">{item.label} →</Link>)}</div>;
    case "p":
      return <p className="text-foreground/90 max-w-[72ch] text-sm leading-6">{block.text}</p>;

    case "term":
      return (
        <div className="border-primary max-w-[72ch] border-l-2 pl-4">
          <p className="text-foreground text-sm font-semibold">{block.term}</p>
          <p className="text-foreground/85 mt-1 text-sm leading-6">{block.text}</p>
        </div>
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={cn(
            "text-foreground/90 flex max-w-[72ch] flex-col gap-2 pl-5 text-sm leading-6",
            block.ordered ? "marker:text-muted-foreground list-decimal marker:font-medium" : "marker:text-primary/60 list-disc",
          )}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {item}
            </li>
          ))}
        </Tag>
      );
    }

    case "facts":
      return (
        <FactGrid className="max-w-[880px]">
          {block.items.map((item) => (
            <Fact key={item.label} label={item.label} value={item.value} />
          ))}
        </FactGrid>
      );

    case "table":
      return <SimpleTable columns={block.columns} rows={block.rows} caption={block.caption} firstColumnHeader={block.firstColumnHeader} />;

    case "callout":
      return <Callout tone={block.tone} title={block.title} text={block.text} />;

    case "visual":
      return (
        <figure className="max-w-[880px]">
          <div className="bg-card rounded-xl border p-3 sm:p-4">
            <TheoryVisual id={block.id} />
          </div>
          {block.caption && <figcaption className="text-muted-foreground mt-2 text-xs">{block.caption}</figcaption>}
        </figure>
      );

    case "audio":
      return (
        <a
          href={block.href}
          target="_blank"
          rel="noreferrer"
          className="group/audio border-primary/40 text-primary hover:border-primary hover:bg-primary/10 focus-visible:ring-ring/50 inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3"
        >
          <Headphones className="size-4" aria-hidden />
          {block.label}
          <ExternalLink className="size-3.5 opacity-60" aria-label="Opens in a new tab" />
        </a>
      );

    case "widget":
      return <Widget name={block.name} />;
  }
}

/*
 * Notes, corrections and gaps as the design system's alert: a rounded
 * bordered box with a leading icon, tinted by tone (info for a tip, brand
 * for a correction, warning for something still missing).
 */
const CALLOUT: Record<"tip" | "fix" | "todo", { icon: LucideIcon; label: string; className: string }> = {
  tip: { icon: Lightbulb, label: "Tip", className: "border-info/25 bg-info/5 [&>svg]:text-info" },
  fix: { icon: PenLine, label: "Corrected from your notes", className: "border-primary/25 bg-primary/5 [&>svg]:text-primary" },
  todo: { icon: CircleAlert, label: "To do", className: "border-warning/30 bg-warning/5 [&>svg]:text-warning" },
};

export function Callout({ tone, title, text }: { tone: keyof typeof CALLOUT; title?: string; text: string }) {
  const { icon: Icon, label, className } = CALLOUT[tone];
  return (
    <aside
      role="note"
      className={cn(
        "grid max-w-[880px] grid-cols-[calc(var(--spacing)*4)_1fr] items-start gap-x-3 gap-y-0.5 rounded-xl border px-4 py-3 text-sm [&>svg]:size-4 [&>svg]:translate-y-0.5",
        className,
      )}
    >
      <Icon aria-hidden />
      <p className="text-foreground font-medium">{title ?? label}</p>
      <p className="text-foreground/80 col-start-2 leading-6">{text}</p>
    </aside>
  );
}
