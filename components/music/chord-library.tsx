"use client";

import { useMemo, useState } from "react";
import { PenLine, Search, X } from "lucide-react";
import { CHORDS, CHORD_CATEGORIES, type ChordCategory } from "@/lib/music/chords";
import {
  degreeSemitones,
  intervalShort,
  neckNotes,
  noteName,
  parseDegree,
  prettyDegree,
  spellDegree,
  spellRoot,
} from "@/lib/music/theory";
import { useQueryState } from "@/lib/use-query-state";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/app/panel";
import { TableWrap, tableCls, tdCls, thCls } from "@/components/ui/table";
import { RootPicker, useRootParam } from "./controls";
import { Fretboard } from "./fretboard";
import { Keyboard, type KeyMark } from "./keyboard";

const plain = (t: string) => t.toLowerCase().replace(/♯/g, "#").replace(/♭/g, "b");

export function ChordLibrary() {
  const [rootPc, setRootPc] = useRootParam(0);
  const [selectedId, setSelectedId] = useQueryState("chord", "");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ChordCategory | "All">("All");

  const results = useMemo(() => {
    const q = plain(query.trim());
    return CHORDS.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (!q) return true;
      const hay = plain([c.name, c.symbol, c.formula.join(" "), ...(c.aliases ?? [])].join(" "));
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [query, category]);

  const selected = CHORDS.find((c) => c.id === selectedId);

  return (
    <div className="flex flex-col gap-6">
      <Panel>
        <div className="flex flex-col gap-4">
          <RootPicker value={rootPc} onChange={setRootPc} label="Root" />
          <label className="flex h-11 items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 focus-within:ring-3 focus-within:ring-ring/50">
            <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden />
            <span className="sr-only">Filter chords</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name, symbol or formula (e.g. m7b5, #9, sus)"
              className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-stone"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear filter" className="rounded-md p-1 hover:bg-muted">
                <X className="size-4" strokeWidth={1.75} />
              </button>
            )}
          </label>
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Category">
            {(["All", ...CHORD_CATEGORIES] as const).map((c) => {
              const count = c === "All" ? CHORDS.length : CHORDS.filter((x) => x.category === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={category === c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                    category === c ? "border-transparent bg-primary text-primary-foreground" : "border-border text-foreground hover:border-muted-foreground",
                  )}
                >
                  {c} <span className="opacity-60 tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Panel>

      {selected && <ChordDetail chordId={selected.id} rootPc={rootPc} onClose={() => setSelectedId(null)} />}

      <Panel title={`${results.length} chord${results.length === 1 ? "" : "s"}`} description="Select a chord to see it on the keyboard and the neck.">
        <TableWrap>
          <table className={cn(tableCls, "min-w-[680px]")}>
            <thead>
              <tr>
                <th className={thCls}>Chord</th>
                <th className={thCls}>Symbol</th>
                <th className={thCls}>Formula</th>
                <th className={thCls}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((c) => {
                const degrees = c.formula.map(parseDegree);
                const root = spellRoot(rootPc, degrees);
                const active = c.id === selectedId;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn("cursor-pointer transition-colors hover:bg-muted/60", active && "bg-muted")}
                  >
                    <td className={tdCls}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(c.id);
                        }}
                        className="text-left font-medium outline-none focus-visible:underline"
                      >
                        {c.name}
                      </button>
                      {c.fix && <PenLine className="ml-1.5 inline size-3.5 text-muted-foreground" aria-label="Corrected from your notes" />}
                      {c.aliases && <span className="block text-[12px] text-muted-foreground">also {c.aliases.join(", ")}</span>}
                    </td>
                    <td className={cn(tdCls, "font-medium whitespace-nowrap")}>
                      {noteName(root)}
                      {c.symbol}
                    </td>
                    <td className={cn(tdCls, "whitespace-nowrap text-muted-foreground")}>{c.formula.map(prettyDegree).join(" ")}</td>
                    <td className={cn(tdCls, "whitespace-nowrap")}>{degrees.map((d) => noteName(spellDegree(root, d))).join(" ")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrap>
        {results.length === 0 && (
          <p className="py-8 text-center text-caption text-muted-foreground">No chord matches. Try a formula like “b3 b5” or a symbol like “sus”.</p>
        )}
      </Panel>
    </div>
  );
}

function ChordDetail({ chordId, rootPc, onClose }: { chordId: string; rootPc: number; onClose: () => void }) {
  const chord = CHORDS.find((c) => c.id === chordId)!;
  const degrees = chord.formula.map(parseDegree);
  const root = spellRoot(rootPc, degrees);
  const semis = degrees.map(degreeSemitones);
  const names = degrees.map((d) => noteName(spellDegree(root, d)));
  const labels = chord.formula.map((t) => (t === "1" ? "R" : prettyDegree(t)));
  const marks: Record<number, KeyMark> = Object.fromEntries(
    semis.map((s, i) => [rootPc + s, { label: labels[i], caption: names[i], root: s === 0 }]),
  );
  const span = Math.max(...semis) + rootPc;
  const length = span > 24 ? 36 : 24;

  return (
    <Panel
      title={`${noteName(root)}${chord.symbol}`}
      description={`${chord.name} · ${chord.category}`}
      action={
        <button type="button" onClick={onClose} aria-label="Close chord" className="grid size-9 place-items-center rounded-lg hover:bg-muted">
          <X className="size-4.5" strokeWidth={1.75} />
        </button>
      }
    >
      <ol className="mb-5 flex flex-wrap gap-2">
        {names.map((n, i) => (
          <li key={i} className="flex min-w-14 flex-col items-center rounded-xl border border-border bg-card px-2.5 py-1.5">
            <span className="text-body font-medium">{n}</span>
            <span className="text-[12px] text-muted-foreground">
              {labels[i]} · {i === 0 ? "R" : intervalShort(degrees[i])}
            </span>
          </li>
        ))}
      </ol>
      {chord.fix && (
        <p className="mb-5 flex max-w-[880px] gap-2 rounded-2xl border border-dashed border-muted-foreground/50 px-4 py-3 text-caption">
          <PenLine className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          <span>
            <span className="font-medium">Corrected from your notes. </span>
            {chord.fix}
          </span>
        </p>
      )}
      <Keyboard length={length} marks={marks} title={`${noteName(root)}${chord.symbol} stacked from the root on a keyboard`} />
      <p className="mt-2 mb-5 text-caption text-muted-foreground">Stacked from the root, so 9ths, 11ths and 13ths sit in the second octave.</p>
      <Fretboard
        notes={neckNotes(rootPc, semis.map((s) => s % 12), 15)}
        label={(i) => labels[i]}
        title={`Every ${noteName(root)}${chord.symbol} chord tone across the neck`}
      />
      <p className="mt-2 text-caption text-muted-foreground">Every chord tone across the neck: pick shapes from these.</p>
    </Panel>
  );
}
