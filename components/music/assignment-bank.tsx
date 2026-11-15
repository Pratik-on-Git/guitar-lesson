"use client";

import { titleCaseLabel } from "@/lib/title-case";

import Link from "next/link";
import { useState } from "react";
import { BOOK_ASSIGNMENTS } from "@/lib/content/book-assignments";
import { assignmentMaterial } from "@/lib/content/assignment-links";
import { usePracticeTasks } from "@/lib/store";
import { Panel } from "@/components/app/panel";
import { buttonVariants } from "@/components/ui/button";
import { StudySelect } from "./study-controls";

export function AssignmentBank() {
  const [chapter, setChapter] = useState("All chapters"); const [filter, setFilter] = useState(""); const [page, setPage] = useState(0); const [tasks, setTasks] = usePracticeTasks();
  const chapters = ["All chapters", ...new Set(BOOK_ASSIGNMENTS.map((a) => a.chapter))];
  const filtered = BOOK_ASSIGNMENTS.filter((a) => (chapter === "All chapters" || a.chapter === chapter) && `${a.prompt} ${a.chapter}`.toLowerCase().includes(filter.toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12)); const current = Math.min(page, pageCount - 1);
  const complete = BOOK_ASSIGNMENTS.filter((a) => tasks.includes(`assignment:${a.id}`)).length;
  return <Panel id="source-assignments" title="Book assignment bank" description={`All ${BOOK_ASSIGNMENTS.length} numbered practical assignments from the chapter exercise lists. ${complete} checked as practised; saved in this browser.`}>
    <div className="grid gap-4 sm:grid-cols-2"><StudySelect label="Assignment chapter" value={chapter} onChange={(value) => { setChapter(value); setPage(0); }} options={chapters.map((value) => ({ value, label: value }))} /><label className="text-sm font-medium">{titleCaseLabel(<>Find an assignment<input aria-label="Find an assignment" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(0); }} className="mt-2 w-full rounded-lg border bg-background p-3" placeholder="e.g. Hirajoshi, F#, harmonize" /></>)}</label></div>
    <p className="my-4 text-sm text-muted-foreground">{filtered.length} matching assignments · page {current + 1}/{pageCount}. Source numbering is retained: page 74, part 2 skips exercises 5 and 6.</p>
    <ol className="space-y-3">{filtered.slice(current * 12, (current + 1) * 12).map((a) => <li key={a.id} className="rounded-xl border p-4"><p className="mb-2 text-xs text-muted-foreground">{a.chapter} · p. {a.page} · part {a.part} · exercise {a.number}</p><label className="flex items-start gap-3 text-sm leading-6">{titleCaseLabel(<><input aria-label={`Practised page ${a.page} part ${a.part} exercise ${a.number}`} type="checkbox" className="mt-1 size-4 shrink-0 accent-primary" checked={tasks.includes(`assignment:${a.id}`)} onChange={() => { const id = `assignment:${a.id}`; setTasks(tasks.includes(id) ? tasks.filter((t) => t !== id) : [...tasks, id]); }} /><span>{a.prompt}</span></>)}</label><Link href={assignmentMaterial(a)} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">{titleCaseLabel(<>Open matching material →</>)}</Link></li>)}</ol>
    {!filtered.length && <p role="status" className="rounded-lg border p-4 text-sm">No matching assignments. Clear the search or choose another chapter.</p>}
    <div className="mt-4 flex gap-3"><button type="button" disabled={current === 0} onClick={() => setPage(current - 1)} className={buttonVariants({ variant: "secondary", size: "sm" })}>{titleCaseLabel(<>Previous assignments</>)}</button><button type="button" disabled={current === pageCount - 1} onClick={() => setPage(current + 1)} className={buttonVariants({ variant: "secondary", size: "sm" })}>{titleCaseLabel(<>Next assignments</>)}</button></div>
  </Panel>;
}
