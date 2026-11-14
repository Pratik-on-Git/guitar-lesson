"use client";

import Link from "next/link";
import { ArrowRight, CircleCheck, Sparkles } from "lucide-react";
import { NAV, STUDY_PAGES, nextUnstudied } from "@/lib/nav";
import { useStudied } from "@/lib/store";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IconTile } from "./icon-tile";
import { StatusBadge, type StatusTone } from "./status-badge";

/* The overview's progress widgets. Client-side: progress lives in localStorage. */

function useProgress() {
  const { studied, isStudied } = useStudied();
  const done = STUDY_PAGES.filter((p) => studied.includes(p.href)).length;
  const total = STUDY_PAGES.length;
  return { studied, isStudied, done, total, share: total ? done / total : 0, next: nextUnstudied(studied) };
}

function groupStatus(done: number, total: number): { tone: StatusTone; label: string } {
  if (done === total) return { tone: "success", label: "Complete" };
  if (done > 0) return { tone: "brand", label: "In Progress" };
  return { tone: "neutral", label: "Not Started" };
}

/** The header's primary action: straight to the next unstudied page. */
export function ContinueButton() {
  const { next } = useProgress();
  if (!next) return null;
  return (
    <Link href={next.href} className={buttonVariants()}>
      Continue
      <ArrowRight aria-hidden />
    </Link>
  );
}

/*
 * The hero tile (the dashboards' reports KPI hero): the share studied as the
 * page's one big number, on the primary gradient surface.
 */
export function ProgressHero() {
  const { done, total, share, next } = useProgress();
  const pct = Math.round(share * 100);
  return (
    <section aria-labelledby="progress-title" className="hero-surface flex min-h-56 flex-col justify-between gap-6 rounded-xl p-5 sm:p-6">
      <span className="hero-surface__orb" aria-hidden />
      <span className="hero-surface__dots" aria-hidden />
      <span className="hero-surface__glow" aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="progress-title" className="text-primary-foreground/85 text-sm font-medium">
            Study Progress
          </h2>
          <p className="text-metric-lg mt-1 font-semibold tabular-nums">
            {pct}
            <span className="text-primary-foreground/70 text-xl">%</span>
          </p>
          <p className="text-primary-foreground/75 mt-2 max-w-xs text-sm">
            {done === 0
              ? "Mark each page as studied when you finish it. Progress is kept in this browser."
              : done === total
                ? "Every page is marked as studied."
                : `${total - done} ${total - done === 1 ? "page" : "pages"} to go. Pick up where you left off.`}
          </p>
        </div>
        <span className="bg-primary-foreground/15 ring-primary-foreground/25 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap tabular-nums ring-1">
          {done} / {total} pages
        </span>
      </div>

      <div className="space-y-4">
        <div className="hero-meter-track relative h-2.5 rounded-full" aria-hidden>
          <div
            className="hero-meter-fill animate-meter-grow absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 motion-reduce:animate-none"
            style={{ width: `${share * 100}%` }}
          />
        </div>
        {next ? (
          <Link
            href={next.href}
            className={cn(
              buttonVariants(),
              "bg-primary-foreground text-primary hover:bg-primary-foreground/90 dark:bg-primary-foreground dark:hover:bg-primary-foreground/90 w-full justify-between sm:w-auto",
            )}
          >
            <span className="min-w-0 truncate">Next: {next.title}</span>
            <ArrowRight aria-hidden />
          </Link>
        ) : (
          <p className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4" aria-hidden />
            Everything studied. Time to revise.
          </p>
        )}
      </div>
    </section>
  );
}

/** Progress for each part of the notes, as labelled bars. */
export function PartProgress() {
  const { studied } = useProgress();
  const groups = NAV.slice(1).map((g) => {
    const pages = STUDY_PAGES.filter((p) => p.group === g.title);
    return {
      title: g.title,
      icon: g.items[0].icon,
      href: g.items[0].href,
      total: pages.length,
      done: pages.filter((p) => studied.includes(p.href)).length,
    };
  });

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-title font-semibold">By Part</CardTitle>
        <CardDescription>Pages studied in each part of the notes.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {groups.map((g) => {
            const status = groupStatus(g.done, g.total);
            const Icon = g.icon;
            return (
              <li key={g.title}>
                <Link href={g.href} className="group/part -m-2 flex items-center gap-3 rounded-lg p-2 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50">
                  <IconTile icon={<Icon />} tone={g.done === g.total ? "success" : "primary"} />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{g.title}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs tabular-nums">
                          {g.done}/{g.total}
                        </span>
                        <StatusBadge tone={status.tone} className="max-sm:hidden">
                          {status.label}
                        </StatusBadge>
                      </span>
                    </div>
                    <Progress
                      value={(g.done / g.total) * 100}
                      label={`${g.title}: ${g.done} of ${g.total} studied`}
                      className={cn("h-1.5", g.done === g.total && "bg-success/15")}
                      indicatorClassName={g.done === g.total ? "bg-success" : undefined}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

/* Every part as a card, each page with its studied state. */
export function StudyMap() {
  const { isStudied } = useStudied();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {NAV.slice(1).map((group, gi) => {
        const pages = group.items.flatMap((item) => item.children ?? [item]);
        const done = pages.filter((p) => isStudied(p.href)).length;
        const status = groupStatus(done, pages.length);
        return (
          <Card as="section" key={group.title} aria-labelledby={`part-${gi}`} size="sm">
            <CardHeader className="border-b">
              <p className="text-muted-foreground text-overline font-semibold uppercase">Part {gi + 1}</p>
              <h3 id={`part-${gi}`} className="text-title font-semibold">
                {group.title}
              </h3>
              <CardAction>
                <StatusBadge tone={status.tone} dot>
                  {done}/{pages.length}
                </StatusBadge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ul className="-mx-2 flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const itemPages = item.children ?? [item];
                  const itemDone = itemPages.filter((p) => isStudied(p.href)).length;
                  const complete = itemDone === itemPages.length;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group/row flex items-start gap-3 rounded-lg px-2 py-2.5 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50"
                      >
                        <IconTile icon={<Icon />} tone={complete ? "success" : "muted"} className="group-hover/row:bg-primary/10 group-hover/row:text-primary transition-colors" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2 text-sm font-medium">
                            {item.title}
                            {item.children ? (
                              <span className="text-muted-foreground text-xs font-normal tabular-nums">
                                {itemDone}/{itemPages.length}
                              </span>
                            ) : null}
                          </span>
                          <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">{item.description}</span>
                        </span>
                        {complete ? (
                          <CircleCheck className="text-success mt-1.5 size-4 shrink-0" aria-label="Studied" />
                        ) : (
                          <span className="border-border mt-1.5 size-4 shrink-0 rounded-full border-[1.5px]" aria-label="Not studied yet" role="img" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
