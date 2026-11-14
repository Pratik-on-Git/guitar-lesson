import Link from "next/link";
import { THEORY_BOOK } from "@/lib/content/theory-book";
export function TheoryBookSource({ pages }: { pages: string }) {
  return <aside className="rounded-xl border bg-muted/30 p-4 text-sm leading-6"><p className="font-medium">{THEORY_BOOK.author} · {THEORY_BOOK.title}</p><p className="text-muted-foreground">{THEORY_BOOK.edition} · PDF pp. {pages}. Study explanations and generated audio are paired with source references and corrected terminology.</p><Link href={THEORY_BOOK.href} className="mt-2 inline-block font-medium text-primary hover:underline">Chapter guide, source figures & corrections →</Link></aside>;
}
