"use client";

import Link from "next/link";
import { useState } from "react";
import { BOOK_ASSIGNMENTS, type BookAssignment } from "@/lib/content/book-assignments";
import { BOOK_CHORD_TYPES } from "@/lib/content/book";
import { MODE_FAMILIES } from "@/lib/music/modes";
import { pc, parseNote, ROOT_SLUGS } from "@/lib/music/theory";
import { usePracticeTasks } from "@/lib/store";
import { Panel } from "@/components/app/panel";
import { buttonVariants } from "@/components/ui/button";
import { StudySelect } from "./study-controls";

function materialFor(assignment: BookAssignment) {
  const text = assignment.prompt;
  const root = /\b([A-G](?:#|b)?)(?=\s|m|\+|7|dim)/.exec(text)?.[1] ?? "A";
  const query = new URLSearchParams({ key: ROOT_SLUGS[pc(parseNote(root))] });
  if (text.startsWith("Harmonize")) {
    query.set("family", /Harmonic Minor/i.test(text) ? "harmonic-minor" : /Melodic Minor/i.test(text) ? "melodic-minor" : "major");
    query.set("approach", /vertically/i.test(text) ? "vertical" : "horizontal");
    return `/harmonization?${query}`;
  }
  if (assignment.page === 19 || assignment.page === 53) {
    const scales: [RegExp, string][] = [[/Major Pentatonic/, "major-pentatonic"], [/Minor Pentatonic/, "minor-pentatonic"], [/Major Blues/, "major-blues"], [/Minor Blues/, "minor-blues"], [/Kumoi/, "kumoi"], [/Pelog/, "pelog"], [/Hirajoshi/, "hirajoshi"], [/Whole Tone/, "whole-tone"], [/Augmented/, "augmented"], [/H\/W/, "diminished-half-whole"], [/W\/H/, "diminished-whole-half"]];
    return `/scales/${scales.find(([test]) => test.test(text))?.[1] ?? "major"}?${query}`;
  }
  if ([27, 35, 43].includes(assignment.page)) {
    const family = MODE_FAMILIES[[27, 35, 43].indexOf(assignment.page)];
    const names = assignment.page === 27 ? ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"] : assignment.page === 35 ? ["Harmonic Minor", "Locrian", "Ionian", "Dorian", "Phrygian", "Lydian", "Altered"] : ["Melodic Minor", "Dorian", "Lydian #5", "Lydian b7", "Mixolydian", "Locrian", "Altered"];
    const index = Math.max(0, names.findIndex((name) => text.includes(name)));
    query.set("mode", family.modes[index].id);
    return `/modes/${family.id}?${query}`;
  }
  const token = /Play the (\S+)/.exec(text)?.[1] ?? "A";
  const suffix = token.replace(/^[A-G](?:#|b)?/, "");
  const type = ({ "": "major", m: "minor", "+": "augmented", mb5: "diminished", maj7: "major-7", "7": "dominant-7", "m(maj7)": "minor-major-7", m7: "minor-7", "+maj7": "augmented-major-7", m7b5: "half-diminished", dim7: "diminished-7" } as Record<string, string>)[suffix];
  query.set("chord", BOOK_CHORD_TYPES.find((c) => c.id === type)?.id ?? "major-7");
  if (assignment.page === 66) query.set("voicing", "drop-2");
  if (assignment.page === 74) query.set("voicing", "drop-3");
  if (assignment.page === 58) query.set("voicing", "close");
  return `/${assignment.page === 82 ? "arpeggios" : "voicings"}?${query}`;
}

export function AssignmentBank() {
  const [chapter, setChapter] = useState("All chapters"); const [filter, setFilter] = useState(""); const [page, setPage] = useState(0); const [tasks, setTasks] = usePracticeTasks();
  const chapters = ["All chapters", ...new Set(BOOK_ASSIGNMENTS.map((a) => a.chapter))];
  const filtered = BOOK_ASSIGNMENTS.filter((a) => (chapter === "All chapters" || a.chapter === chapter) && `${a.prompt} ${a.chapter}`.toLowerCase().includes(filter.toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12)); const current = Math.min(page, pageCount - 1);
  const complete = BOOK_ASSIGNMENTS.filter((a) => tasks.includes(`assignment:${a.id}`)).length;
  return <Panel id="source-assignments" title="Book assignment bank" description={`All ${BOOK_ASSIGNMENTS.length} numbered practical assignments from the chapter exercise lists. ${complete} checked as practised; saved in this browser.`}>
    <div className="grid gap-4 sm:grid-cols-2"><StudySelect label="Assignment chapter" value={chapter} onChange={(value) => { setChapter(value); setPage(0); }} options={chapters.map((value) => ({ value, label: value }))} /><label className="text-sm font-medium">Find an assignment<input aria-label="Find an assignment" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(0); }} className="mt-2 w-full rounded-lg border bg-background p-3" placeholder="e.g. Hirajoshi, F#, harmonize" /></label></div>
    <p className="my-4 text-sm text-muted-foreground">{filtered.length} matching assignments · page {current + 1}/{pageCount}. Source numbering is retained: page 74, part 2 skips exercises 5 and 6.</p>
    <ol className="space-y-3">{filtered.slice(current * 12, (current + 1) * 12).map((a) => <li key={a.id} className="rounded-xl border p-4"><p className="mb-2 text-xs text-muted-foreground">{a.chapter} · p. {a.page} · part {a.part} · exercise {a.number}</p><label className="flex items-start gap-3 text-sm leading-6"><input aria-label={`Practised page ${a.page} part ${a.part} exercise ${a.number}`} type="checkbox" className="mt-1 size-4 shrink-0 accent-primary" checked={tasks.includes(`assignment:${a.id}`)} onChange={() => { const id = `assignment:${a.id}`; setTasks(tasks.includes(id) ? tasks.filter((t) => t !== id) : [...tasks, id]); }} /><span>{a.prompt}</span></label><Link href={materialFor(a)} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">Open matching material →</Link></li>)}</ol>
    {!filtered.length && <p role="status" className="rounded-lg border p-4 text-sm">No matching assignments. Clear the search or choose another chapter.</p>}
    <div className="mt-4 flex gap-3"><button type="button" disabled={current === 0} onClick={() => setPage(current - 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>Previous assignments</button><button type="button" disabled={current === pageCount - 1} onClick={() => setPage(current + 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>Next assignments</button></div>
  </Panel>;
}
