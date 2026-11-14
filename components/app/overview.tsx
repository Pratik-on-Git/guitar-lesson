"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { NAV, STUDY_PAGES } from "@/lib/nav";
import { useStudied } from "@/lib/store";
import { cn } from "@/lib/utils";

/* Progress summary: overall, per group, and the next unstudied page. */
export function ProgressSummary() {
  const { studied } = useStudied();
  const done = STUDY_PAGES.filter((p) => studied.includes(p.href));
  const next = STUDY_PAGES.find((p) => !studied.includes(p.href));
  const pct = Math.round((done.length / STUDY_PAGES.length) * 100);
  const groups = NAV.slice(1).map((g) => {
    const pages = STUDY_PAGES.filter((p) => p.group === g.title);
    return { title: g.title, total: pages.length, done: pages.filter((p) => studied.includes(p.href)).length };
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,260px)_1fr]">
      <div className="flex flex-col">
        <p className="text-caption text-muted-foreground">Studied</p>
        <p className="mt-1 font-display text-[56px] leading-none font-medium tracking-[-0.02em] tabular-nums">
          {pct}
          <span className="text-heading text-muted-foreground">%</span>
        </p>
        <p className="mt-2 text-caption text-muted-foreground">
          {done.length} of {STUDY_PAGES.length} pages
        </p>
        {next ? (
          <Link
            href={next.href}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-caption font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Next: {next.title}
            <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
          </Link>
        ) : (
          <p className="mt-6 flex items-center gap-2 text-caption font-medium">
            <span aria-hidden className="size-2 rounded-full bg-ember" />
            Everything studied. Time to revise.
          </p>
        )}
      </div>
      <ul className="flex flex-col justify-center gap-4">
        {groups.map((g) => (
          <li key={g.title}>
            <div className="flex justify-between text-caption">
              <span className="font-medium">{g.title}</span>
              <span className="text-muted-foreground tabular-nums">
                {g.done}/{g.total}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${(g.done / g.total) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Every group as a card, each page with its studied state. */
export function StudyMap() {
  const { isStudied } = useStudied();
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {NAV.slice(1).map((group, gi) => (
        <section key={group.title} aria-labelledby={`group-${gi}`} className="flex flex-col rounded-card bg-card p-6 shadow-soft">
          <p className="text-[12px] font-medium text-muted-foreground">Part {gi + 1}</p>
          <h2 id={`group-${gi}`} className="mt-0.5 text-heading-sm text-foreground">
            {group.title}
          </h2>
          <ul className="mt-4 flex flex-col gap-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const pages = item.children ?? [item];
              const done = pages.filter((p) => isStudied(p.href)).length;
              const complete = done === pages.length;
              return (
                <li key={item.href}>
                  <Link href={item.href} className="group -mx-2 flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground group-hover:bg-card">
                      <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-caption font-medium text-foreground">
                        {item.title}
                        {item.children && (
                          <span className="text-[12px] font-normal text-muted-foreground tabular-nums">
                            {done}/{pages.length}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-[1.4] text-muted-foreground">{item.description}</span>
                    </span>
                    <span
                      className={cn(
                        "mt-1 grid size-5 shrink-0 place-items-center rounded-full",
                        complete ? "bg-primary text-primary-foreground" : "border border-border",
                      )}
                      aria-label={complete ? "Studied" : "Not studied yet"}
                    >
                      {complete && <Check className="size-3" strokeWidth={3} aria-hidden />}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
