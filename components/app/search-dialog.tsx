"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { search, type SearchEntry } from "@/lib/search";
import { cn } from "@/lib/utils";

/* Ctrl/⌘ + K palette over every page, section, scale, mode and chord. */

const SUGGESTED = ["Major scale", "Dorian", "Intervals", "Circle of fifths", "m7♭5", "Tritone"];

export function SearchDialog() {
  const [open, setOpen] = useState(false);

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
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="flex h-10 w-full max-w-[340px] items-center gap-2.5 rounded-xl border border-border bg-card px-3 text-caption text-muted-foreground outline-none transition-colors hover:border-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 max-sm:size-10 max-sm:justify-center max-sm:px-0"
        aria-label="Search notes"
      >
        <Search className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="flex-1 text-left max-sm:hidden">Search notes, scales, chords…</span>
        <kbd className="rounded-md border border-border px-1.5 py-0.5 font-sans text-[11px] max-sm:hidden">Ctrl K</kbd>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-pressed-graphite/30 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed top-[12vh] left-1/2 z-50 flex max-h-[70vh] w-[calc(100vw-32px)] max-w-[600px] -translate-x-1/2 flex-col overflow-hidden rounded-card bg-card text-card-foreground shadow-soft ring-1 ring-foreground/5 outline-none transition-[opacity,transform] data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0">
          <Dialog.Title className="sr-only">Search notes</Dialog.Title>
          {open && <SearchBody onDone={() => setOpen(false)} />}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SearchBody({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results = useMemo(() => search(query), [query]);

  const go = (entry: SearchEntry | undefined) => {
    if (!entry) return;
    onDone();
    router.push(entry.href);
  };

  return (
    <>
      <div className="flex items-center gap-3 border-b border-border px-5">
        <Search className="size-4.5 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden />
        <input
          autoFocus
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
          className="h-14 min-w-0 flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-stone"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {!query && (
          <div className="p-3">
            <p className="mb-3 text-caption text-muted-foreground">Try</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-caption font-medium text-foreground hover:border-muted-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {query && results.length === 0 && (
          <p className="p-6 text-center text-caption text-muted-foreground">Nothing matches “{query}”.</p>
        )}
        {results.length > 0 && (
          <ul id="search-results" role="listbox" aria-label="Results">
            {results.map((entry, i) => (
              <li
                key={entry.href + entry.title}
                id={`result-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(entry)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5",
                  i === active ? "bg-muted" : "",
                )}
              >
                <span className="w-16 shrink-0 text-[12px] font-medium text-muted-foreground">{entry.kind}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-caption font-medium text-foreground">{entry.title}</span>
                  <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">{entry.context}</span>
                </span>
                {i === active && <ArrowRight className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
