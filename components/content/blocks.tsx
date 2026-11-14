import Image from "next/image";
import { CircleAlert, ExternalLink, Lightbulb, PenLine } from "lucide-react";
import type { Block } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { SimpleTable } from "@/components/ui/table";
import { Widget } from "./widgets";

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
    case "p":
      return <p className="max-w-[72ch] text-body text-foreground/90">{block.text}</p>;

    case "term":
      return (
        <div className="max-w-[72ch] border-l-2 border-foreground pl-4">
          <p className="font-display text-subheading font-medium text-foreground">{block.term}</p>
          <p className="mt-1 text-body text-foreground/85">{block.text}</p>
        </div>
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={cn(
            "flex max-w-[72ch] flex-col gap-2 pl-5 text-body text-foreground/90",
            block.ordered ? "list-decimal marker:text-muted-foreground" : "list-disc marker:text-fog",
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
        <dl className="grid max-w-[880px] gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {block.items.map((item) => (
            <div key={item.label} className="bg-card px-4 py-3">
              <dt className="text-[13px] text-muted-foreground">{item.label}</dt>
              <dd className="mt-0.5 text-body font-medium text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      );

    case "table":
      return <SimpleTable columns={block.columns} rows={block.rows} caption={block.caption} firstColumnHeader={block.firstColumnHeader} />;

    case "callout":
      return <Callout tone={block.tone} title={block.title} text={block.text} />;

    case "figure":
      return (
        <figure className="max-w-[880px]">
          <div className="overflow-hidden rounded-2xl border border-border bg-white p-3">
            <Image src={block.src} alt={block.alt} width={block.width} height={block.height} className="h-auto w-full" />
          </div>
          {block.caption && <figcaption className="mt-2 text-caption text-muted-foreground">{block.caption}</figcaption>}
        </figure>
      );

    case "audio":
      return (
        <a
          href={block.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-caption font-medium text-foreground transition-colors hover:border-muted-foreground"
        >
          <span aria-hidden className="size-2 rounded-full bg-ember" />
          {block.label}
          <ExternalLink className="size-3.5 text-muted-foreground" strokeWidth={1.75} aria-hidden />
        </a>
      );

    case "widget":
      return <Widget name={block.name} />;
  }
}

const CALLOUT = {
  tip: { icon: Lightbulb, label: "Tip" },
  fix: { icon: PenLine, label: "Corrected from your notes" },
  todo: { icon: CircleAlert, label: "To do" },
};

export function Callout({ tone, title, text }: { tone: keyof typeof CALLOUT; title?: string; text: string }) {
  const { icon: Icon, label } = CALLOUT[tone];
  return (
    <aside
      className={cn(
        "flex max-w-[880px] gap-3 rounded-2xl px-4 py-3.5",
        tone === "tip" ? "bg-muted" : "border border-dashed border-muted-foreground/50",
      )}
    >
      <Icon className="mt-0.5 size-4.5 shrink-0 text-foreground" strokeWidth={1.75} aria-hidden />
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-caption font-medium text-foreground">
          {tone !== "tip" && <span aria-hidden className="size-1.5 rounded-full bg-ember" />}
          {title ?? label}
        </p>
        <p className="mt-1 text-caption leading-[1.5] text-foreground/80">{text}</p>
      </div>
    </aside>
  );
}
