import { buttonVariants } from "@/components/ui/button";

import { titleCaseLabel } from "@/lib/title-case";
import Link from "next/link";
import { THEORY_BOOK } from "@/lib/content/theory-book";
export function TheoryBookSource({ pages }: { pages: string }) {
  return <aside className="rounded-xl border bg-muted/30 p-4 text-sm leading-6"><p className="font-medium">{THEORY_BOOK.title} · pp. {pages}</p><p className="text-muted-foreground">Connect these concepts with interactive illustrations, generated audio and related lessons.</p><Link href={THEORY_BOOK.href} className={buttonVariants({ variant: "tertiary", className: "mt-2" })}>{titleCaseLabel(<>Theory guide, illustrations & corrections →</>)}</Link></aside>;
}
