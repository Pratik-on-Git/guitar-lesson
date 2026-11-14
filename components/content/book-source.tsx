import Link from "next/link";
import { BOOK_TITLE, diagramSrc } from "@/lib/content/book";

export function BookSource({ pages, diagramPage }: { pages: string; diagramPage?: number }) {
  return <aside className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6">
    <p className="font-medium">{BOOK_TITLE} · pp. {pages}</p>
    <p className="text-muted-foreground">Study explanations and computed tools are paired with the supplied book&apos;s original A-root diagrams.</p>
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
      <Link className="text-primary hover:underline" href={diagramPage ? `/book?page=${diagramPage}` : "/book"}>{diagramPage ? "View original positions" : "Book guide & diagram atlas"} →</Link>
      {diagramPage && <a className="text-primary hover:underline" href={diagramSrc(diagramPage)} target="_blank" rel="noreferrer">Open full-size sheet<span className="sr-only"> (opens in a new tab)</span> →</a>}
    </div>
  </aside>;
}
