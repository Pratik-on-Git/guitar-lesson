"use client";

import { titleCaseLabel } from "@/lib/title-case";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  FileText,
  Hash,
  Layers,
  ListMusic,
  Music,
  Search,
  type LucideIcon,
} from "lucide-react";
import { NAV } from "@/lib/nav";
import { search, type SearchEntry } from "@/lib/search";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip } from "@/components/ui/tooltip";

/*
 * Ctrl/⌘ + K palette over every page, section, scale, mode and chord, in
 * the dashboards' command-menu style: a 48px input row, results grouped
 * under muted headings, the active row in the accent tint, key hints below.
 */

const SUGGESTED = ["Major scale", "Dorian", "Intervals", "Circle of fifths", "m7♭5", "Tritone"];

const KIND_ICON: Record<SearchEntry["kind"], LucideIcon> = {
  Page: FileText,
  Section: Hash,
  Scale: ListMusic,
  Mode: Layers,
  Chord: Music,
};

const KIND_GROUP: Record<SearchEntry["kind"], string> = {
  Page: "Pages",
  Section: "Sections",
  Scale: "Scales",
  Mode: "Modes",
  Chord: "Chords",
};

// Every page in the sidebar, offered before anything is typed.
const PAGES: SearchEntry[] = NAV.flatMap((group) =>
  group.items.map((item) => ({ title: item.title, context: group.title, href: item.href, kind: "Page" as const, keywords: "" })),
);

const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const noop = () => () => {};

/** "⌘" on Apple platforms, "Ctrl" elsewhere; "Ctrl" during prerender and hydration. */
function useModKey() {
  return useSyncExternalStore(noop, () => (isApple() ? "⌘" : "Ctrl"), () => "Ctrl");
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const mod = useModKey();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* The visible way in, so the shortcut isn't the only one. Wide headers get the labelled field. */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        aria-keyshortcuts={mod === "⌘" ? "Meta+K" : "Control+K"}
        aria-label={`Search notes (${mod} K)`}
        className="text-muted-foreground border-border hover:text-foreground mr-1 hidden h-9 w-56 justify-between px-3 font-normal @3xl/header:inline-flex"
      >{titleCaseLabel(<>
        <span className="flex items-center gap-2">
          <Search aria-hidden />
          Jump to…
        </span>
        <span className="flex items-center gap-0.5" aria-hidden>
          <Kbd>{mod}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </>)}</Button>
      <Tooltip content="Jump to…" side="bottom">
        <Button variant="ghost" size="icon" aria-label="Search notes" onClick={() => setOpen(true)} className="@3xl/header:hidden">{titleCaseLabel(<>
          <Search />
        </>)}</Button>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-[12vh] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl sm:p-0"
        >
          <DialogTitle className="sr-only">{titleCaseLabel(<>Search notes</>)}</DialogTitle>
          <DialogDescription className="sr-only">Find a page, section, scale, mode or chord.</DialogDescription>
          {open ? <SearchBody onDone={() => setOpen(false)} /> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function SearchBody({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => (query.trim() ? search(query) : PAGES), [query]);

  // Grouped by kind, groups in order of their best match so ranking survives the grouping.
  const groups = useMemo(() => {
    const order: string[] = [];
    const byGroup = new Map<string, { entry: SearchEntry; index: number }[]>();
    results.forEach((entry, index) => {
      const key = query.trim() ? KIND_GROUP[entry.kind] : "Jump to";
      if (!byGroup.has(key)) {
        byGroup.set(key, []);
        order.push(key);
      }
      byGroup.get(key)!.push({ entry, index });
    });
    return order.map((heading) => ({ heading, items: byGroup.get(heading)! }));
  }, [results, query]);

  useEffect(() => {
    listRef.current?.querySelector(`#result-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (entry: SearchEntry | undefined) => {
    if (!entry) return;
    onDone();
    router.push(entry.href);
  };

  return (
    <div className="flex max-h-[min(70dvh,560px)] flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
        <Search className="text-muted-foreground size-5 shrink-0 opacity-70" aria-hidden />
        <input
          autoFocus
          role="combobox"
          aria-expanded
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              go(results[active]);
            }
          }}
          placeholder="Search notes, scales, modes, chords…"
          aria-label="Search"
          aria-controls="search-results"
          aria-activedescendant={results[active] ? `result-${active}` : undefined}
          className="placeholder:text-muted-foreground h-12 min-w-0 flex-1 bg-transparent! text-sm outline-none"
        />
        <Kbd className="max-sm:hidden">Esc</Kbd>
      </div>

      <div ref={listRef} className="minimal-scrollbar min-h-0 flex-1 overflow-y-auto">
        {!query.trim() ? (
          <div className="flex flex-wrap items-center gap-1.5 border-b px-4 py-3">
            <span className="text-muted-foreground mr-1 text-xs font-medium">Try</span>
            {SUGGESTED.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="border-border text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary rounded-md border px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >{titleCaseLabel(<>
                {s}
              </>)}</button>
            ))}
          </div>
        ) : null}

        {results.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm font-medium">No results</p>
            <p className="text-muted-foreground mt-1 text-sm">Nothing matches “{query}”. Try a scale, a mode or a chord symbol.</p>
          </div>
        ) : (
          <div id="search-results" role="listbox" aria-label="Results" className="p-2">
            {groups.map((group, gi) => (
              <div key={group.heading} role="group" aria-labelledby={`result-group-${gi}`} className="pb-1">
                <p id={`result-group-${gi}`} className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                  {group.heading}
                </p>
                {group.items.map(({ entry, index }) => {
                  const Icon = KIND_ICON[entry.kind];
                  const selected = index === active;
                  return (
                    <div
                      key={entry.href + entry.title}
                      id={`result-${index}`}
                      role="option"
                      aria-selected={selected}
                      data-selected={selected}
                      onMouseMove={() => setActive(index)}
                      onClick={() => go(entry)}
                      className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground group/option flex items-center gap-3 rounded-md px-2 py-2.5 text-sm select-none"
                    >
                      <Icon
                        className="text-muted-foreground group-data-[selected=true]/option:text-accent-foreground size-4 shrink-0"
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 truncate font-medium">{entry.title}</span>
                      <span className="text-muted-foreground group-data-[selected=true]/option:text-accent-foreground/75 max-w-[45%] truncate text-xs">
                        {entry.context}
                      </span>
                      <CornerDownLeft
                        className={cn("size-3.5 shrink-0 opacity-0", selected && "opacity-70")}
                        aria-hidden
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-muted-foreground bg-muted/40 flex shrink-0 items-center gap-4 border-t px-4 py-2 text-xs max-sm:hidden">
        <span className="flex items-center gap-1.5">
          <Kbd>
            <ArrowUp className="size-3" />
          </Kbd>
          <Kbd>
            <ArrowDown className="size-3" />
          </Kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>
            <CornerDownLeft className="size-3" />
          </Kbd>
          Open
        </span>
        <span className="ml-auto">{results.length} {results.length === 1 ? "result" : "results"}</span>
      </div>
    </div>
  );
}
