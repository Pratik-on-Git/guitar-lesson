"use client";

import { useMemo, useState } from "react";
import { CHORD_REFERENCES } from "@/lib/content/references";
import { References } from "@/components/content/references";
import { PenLine, Search, SearchX, X } from "lucide-react";
import { CHORDS, CHORD_CATEGORIES, getChord, type ChordCategory } from "@/lib/music/chords";
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
import { EmptyState } from "@/components/app/empty-state";
import { Eyebrow, Panel } from "@/components/app/panel";
import { StatusBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input";
import { ScrollFade } from "@/components/ui/scroll-fade";
import { Segmented } from "@/components/ui/segmented";
import { TableWrap, tableCls, tdCls, thCls } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
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

  const selected = getChord(selectedId);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* The dashboards' toolbar card: the key, a search field, then category filters. */}
      <Panel>
        <div className="flex flex-col gap-4">
          <RootPicker value={rootPc} onChange={setRootPc} label="Root" />
          <div>
            <Eyebrow>Filter</Eyebrow>
            <InputGroup
              icon={<Search />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, symbol or formula (e.g. m7b5, #9, sus)"
              aria-label="Filter chords"
              trailing={
                query ? (
                  <Button variant="ghost" size="icon-xs" onClick={() => setQuery("")} aria-label="Clear filter">
                    <X />
                  </Button>
                ) : undefined
              }
            />
          </div>
          <ScrollFade>
            <Segmented
              label="Category"
              size="sm"
              value={category}
              onChange={setCategory}
              // Sized to its pills, not the card, so the track runs under every one of them while the strip scrolls.
              className="w-max max-w-none flex-nowrap"
              options={(["All", ...CHORD_CATEGORIES] as const).map((c) => ({
                value: c,
                label: c,
                count: c === "All" ? CHORDS.length : CHORDS.filter((x) => x.category === c).length,
              }))}
            />
          </ScrollFade>
        </div>
      </Panel>

      {selected && <ChordDetail chordId={selected.id} rootPc={rootPc} onClose={() => setSelectedId(null)} />}

      <Panel
        title={`${results.length} Chord${results.length === 1 ? "" : "s"}`}
        description="Reference formulas show chord members, not a single required voicing. Players may omit or rearrange tones; 11ths and 13ths especially depend on context. Select a chord to inspect it."
        action={category !== "All" ? <StatusBadge tone="brand">{category}</StatusBadge> : undefined}
      >
        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            variant="bare"
            size="sm"
            title="No chord matches"
            description="Try a formula like “b3 b5” or a symbol like “sus”."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Clear Filters
              </Button>
            }
          />
        ) : (
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
                  const active = c.id === selected?.id;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      aria-selected={active}
                      className={cn("cursor-pointer", active && "bg-primary/5 hover:bg-primary/10! shadow-[inset_3px_0_0_var(--primary)]")}
                    >
                      <td className={tdCls}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(c.id);
                          }}
                          className={cn(
                            "rounded-sm text-left font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                            active && "text-primary",
                          )}
                        >
                          {c.name}
                        </button>
                        {c.fix && (
                          <Tooltip content="Corrected from your notes">
                            <span className="text-primary ml-1.5 inline-flex align-[-2px]" tabIndex={0} aria-label="Corrected from your notes">
                              <PenLine className="size-3.5" />
                            </span>
                          </Tooltip>
                        )}
                        {c.aliases && <span className="text-muted-foreground block text-xs">also {c.aliases.join(", ")}</span>}
                      </td>
                      <td className={cn(tdCls, "font-semibold whitespace-nowrap")}>
                        {noteName(root)}
                        {c.symbol}
                      </td>
                      <td className={cn(tdCls, "text-muted-foreground font-mono text-xs whitespace-nowrap")}>
                        {c.formula.map(prettyDegree).join(" ")}
                      </td>
                      <td className={cn(tdCls, "whitespace-nowrap")}>{degrees.map((d) => noteName(spellDegree(root, d))).join(" ")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Panel>
      <References entries={CHORD_REFERENCES} />
    </div>
  );
}

function ChordDetail({ chordId, rootPc, onClose }: { chordId: string; rootPc: number; onClose: () => void }) {
  const chord = getChord(chordId)!;
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
      className="ring-primary/25"
      title={`${noteName(root)}${chord.symbol}`}
      description={`${chord.name} · ${chord.category}`}
      action={
        <Tooltip content="Close" side="left">
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close chord">
            <X />
          </Button>
        </Tooltip>
      }
    >
      <ol className="mb-5 flex flex-wrap gap-2" aria-label="Chord tones">
        {names.map((n, i) => (
          <li
            key={i}
            className={cn(
              "flex min-w-14 flex-col items-center rounded-lg border px-2.5 py-1.5 shadow-xs",
              i === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
            )}
          >
            <span className="text-sm font-semibold">{n}</span>
            <span className={cn("text-xs", i === 0 ? "text-primary-foreground/80" : "text-muted-foreground")}>
              {labels[i]} · {i === 0 ? "R" : intervalShort(degrees[i])}
            </span>
          </li>
        ))}
      </ol>
      {chord.fix && (
        <div role="note" className="border-primary/25 bg-primary/5 mb-5 flex max-w-[880px] gap-3 rounded-xl border px-4 py-3 text-sm">
          <PenLine className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <span className="font-medium">Corrected from your notes. </span>
            <span className="text-foreground/80">{chord.fix}</span>
          </span>
        </div>
      )}
      {chord.note && <p role="note" className="text-muted-foreground mb-5 max-w-[72ch] text-sm leading-6">{chord.note}</p>}
      <Eyebrow>On the keyboard</Eyebrow>
      <Keyboard length={length} marks={marks} title={`${noteName(root)}${chord.symbol} stacked from the root on a keyboard`} />
      <p className="text-muted-foreground mt-2 mb-6 text-xs">Stacked from the root, so 9ths, 11ths and 13ths sit in the second octave.</p>
      <Eyebrow>On the neck</Eyebrow>
      <Fretboard
        notes={neckNotes(rootPc, semis.map((s) => s % 12), 15)}
        label={(i) => labels[i]}
        title={`Every ${noteName(root)}${chord.symbol} chord tone across the neck`}
      />
      <p className="text-muted-foreground mt-2 text-xs">Every chord tone across the neck: pick shapes from these.</p>
    </Panel>
  );
}
