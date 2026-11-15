
import { titleCaseLabel } from "@/lib/title-case";
import Link from "next/link";
import { BOOK_TITLE } from "@/lib/content/book";

export function BookSource({ pages, diagramPage }: { pages: string; diagramPage?: number }) {
  return <aside className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6">
    <p className="font-medium">{BOOK_TITLE} · pp. {pages}</p>
    <p className="text-muted-foreground">Study explanations and computed tools are paired with the book&apos;s own positions, redrawn as diagrams you can move to any key.</p>
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
      <Link className="text-primary hover:underline" href={diagramPage ? `/book?page=${diagramPage}#atlas` : "/book"}>{titleCaseLabel(<>{diagramPage ? "View the book's positions" : "Book guide & diagram atlas"} →</>)}</Link>
    </div>
  </aside>;
}
