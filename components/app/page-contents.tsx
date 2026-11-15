"use client";

import { useState } from "react";
import { ListTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogTitle, DialogTrigger, SheetContent } from "@/components/ui/dialog";
import { titleCase } from "@/lib/title-case";
import type { Section } from "@/lib/content/types";

export function PageContents({ sections }: { sections: Pick<Section, "id" | "title" | "part">[] }) {
  const [open, setOpen] = useState(false);

  if (!sections.length) return null;

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger render={<Button size="lg" className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 rounded-full shadow-lg sm:right-6 sm:bottom-6" />}>
      <ListTree aria-hidden />
      On This Page
    </DialogTrigger>
    <SheetContent side="right" className="w-88 max-w-[90vw]">
      <div className="border-b px-5 pt-6 pb-5 pr-12">
        <DialogTitle>On This Page</DialogTitle>
        <DialogDescription className="mt-2">Jump to a section in this lesson.</DialogDescription>
      </div>
      <nav aria-label="On this page" className="minimal-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <ol className="space-y-1">
          {sections.map((section, index) => <li key={section.id}>
            {section.part && <p className="px-3 pt-4 pb-2 text-xs font-semibold text-primary">{titleCase(section.part)}</p>}
            <a href={`#${section.id}`} onClick={() => setOpen(false)} className="flex gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring">
              <span aria-hidden className="w-5 shrink-0 pt-0.5 font-mono text-xs opacity-70">{String(index + 1).padStart(2, "0")}</span>
              <span>{section.title}</span>
            </a>
          </li>)}
        </ol>
      </nav>
    </SheetContent>
  </Dialog>;
}
