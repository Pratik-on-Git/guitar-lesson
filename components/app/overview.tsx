"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, AudioWaveform, BookOpen, CalendarDays, Check, ChevronDown, ChevronRight, CircleCheck, Clock3, Drum, Guitar, Info, Layers, Library, ListMusic, Music2, Sparkles, Target, type LucideIcon } from "lucide-react";
import { STUDY_PAGES } from "@/lib/nav";
import { calendarLabel, practiceSummary, studySummary } from "@/lib/overview";
import { usePracticeSessions, useStudied } from "@/lib/store";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Segmented } from "@/components/ui/segmented";
import { Tooltip } from "@/components/ui/tooltip";
import { PageHeader, Section } from "./page-header";
import { IconTile } from "./icon-tile";
import { StatusBadge } from "./status-badge";
import "./overview.css";

type Study = ReturnType<typeof studySummary>;
type Practice = ReturnType<typeof practiceSummary>;
type LibraryCounts = { topics: number; scales: number; modes: number; families: number; chords: number };

// Stable snapshots prevent timezone-dependent hydration; refresh at midnight or on return.
function subscribeClock(listener: () => void) {
  const timer = window.setInterval(listener, 60_000);
  window.addEventListener("focus", listener);
  return () => { window.clearInterval(timer); window.removeEventListener("focus", listener); };
}
const minuteSnapshot = () => Math.floor(Date.now() / 60_000);
const serverMinute = () => 0;

function CardHeading({ eyebrow, title, href, label, children }: { eyebrow: string; title: string; href?: string; label?: string; children?: ReactNode }) {
  return <div className="flex items-start justify-between gap-3">
    <div className="min-w-0"><p className="text-muted-foreground text-xs leading-5">{eyebrow}</p><h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2></div>
    {href && <Link href={href} aria-label={label ?? `Open ${title.toLowerCase()}`} className="overview-arrowLink"><ArrowUpRight className="size-4" aria-hidden /></Link>}
    {children}
  </div>;
}

function Metric({ label, value, detail, icon: Icon, href, suffix }: { label: string; value: number; detail: string; icon: LucideIcon; href: string; suffix?: string }) {
  return <Link href={href} className="overview-metric">
    <div className="flex items-start justify-between gap-2"><span className="text-muted-foreground text-xs font-medium">{label}</span><IconTile icon={<Icon />} tone="brand" /></div>
    <p className="-mt-1 text-[1.875rem] leading-tight font-semibold tracking-tight tabular-nums">{value.toLocaleString("en-GB")}<span className="text-muted-foreground ml-1 text-sm font-normal">{suffix}</span></p>
    <p className="text-muted-foreground mt-1 text-xs">{detail}</p>
  </Link>;
}

// Annular sectors preserve the reference's tapered, separated gauge segments.
function arcPath(start: number, end: number, outer = 142, inner = 88) {
  const point = (radius: number, angle: number) => {
    const radians = (180 - angle) * Math.PI / 180;
    return `${(160 + radius * Math.cos(radians)).toFixed(3)} ${(154 - radius * Math.sin(radians)).toFixed(3)}`;
  };
  return `M ${point(outer, start)} A ${outer} ${outer} 0 0 1 ${point(outer, end)} L ${point(inner, end)} A ${inner} ${inner} 0 0 0 ${point(inner, start)} Z`;
}

function ProgressGauge({ study }: { study: Study }) {
  const percent = study.total ? study.done / study.total * 100 : 0;
  const next = study.remaining[0];
  return <Card as="section" aria-label="Study progress" className="overview-card">
    <CardHeading eyebrow="One page at a time" title="Your learning journey" href="#study-map" label="Explore your study map" />
    <div className="overview-callout"><Sparkles className="text-primary size-4 shrink-0" aria-hidden /><p>{study.done === 0 ? "Your next chapter starts here." : next ? <><strong>{study.done} pages</strong> studied. Keep building.</> : "Every page studied. Make it music."}</p></div>
    <div className="overview-gauge" role="img" aria-label={`${percent.toFixed(1)}% studied: ${study.done} of ${study.total} pages`}>
      <svg viewBox="0 0 320 166" aria-hidden>
        <defs><clipPath id="overview-progress-fill"><path d={arcPath(0, Math.max(0.001, percent * 1.8), 150, 80)} /></clipPath></defs>
        {Array.from({ length: 15 }, (_, index) => <path key={index} d={arcPath(index * 12 + 1.8, (index + 1) * 12 - 1.8)} className="overview-gaugeTrack" strokeWidth="5" strokeLinejoin="round" />)}
        <g clipPath="url(#overview-progress-fill)" className="text-primary" style={{ opacity: percent === 0 ? 0 : 1 }}>{Array.from({ length: 15 }, (_, index) => <path key={index} d={arcPath(index * 12 + 1.8, (index + 1) * 12 - 1.8)} fill="currentColor" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />)}</g>
      </svg>
      <div className="overview-gaugeValue"><span>{Number(percent.toFixed(1))}<span className="text-2xl">%</span></span><p>of your study map</p></div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="overview-insetMetric"><span><CircleCheck className="text-primary size-3.5" aria-hidden />Studied</span><p>{study.done}<small> pages</small></p></div>
      <div className="overview-insetMetric"><span><BookOpen className="size-3.5" aria-hidden />To explore</span><p>{study.total - study.done}<small> pages</small></p></div>
    </div>
    <Link href={next?.href ?? "/practice"} className={cn(buttonVariants(), "w-full justify-between")}><span>{next ? study.done ? "Continue learning" : "Start learning" : "Put it into practice"}</span><ArrowRight aria-hidden /></Link>
    <p className="text-muted-foreground text-center text-[11px] leading-relaxed">Marked as studied, at your own pace.</p>
  </Card>;
}

function PartChart({ study }: { study: Study }) {
  const [selected, setSelected] = useState(0);
  const group = study.groups[selected];
  return <Card as="section" aria-label="Progress by part" className="overview-card">
    <CardHeading eyebrow="The bigger picture" title="Progress by part" href="#study-map" label="View all parts in the study map" />
    <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-primary" /><span>Pages studied</span><span className="ml-auto">0–100%</span></div>
    <div className="overview-barChart">
      {study.groups.map((part, index) => <Tooltip key={part.title} content={`${part.title}: ${part.done} of ${part.total} pages studied`}>
        <button type="button" aria-label={`${part.title}: ${part.done} of ${part.total} pages studied`} aria-pressed={selected === index} onClick={() => setSelected(index)} className={cn("overview-barButton", selected === index && "overview-barSelected")}>
          <span className="overview-barTrack"><span className="overview-barFill" style={{ height: `${part.done / part.total * 100}%` }} /></span>
          <span className="text-[10px] font-medium tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        </button>
      </Tooltip>)}
    </div>
    <div className="overview-partDetail" aria-live="polite"><div><p className="text-muted-foreground text-[11px]">Part {String(selected + 1).padStart(2, "0")}</p><h3 className="mt-1 text-sm font-semibold">{group.title}</h3><p className="text-muted-foreground mt-1 text-xs">{group.done} of {group.total} pages studied</p></div><Link href={group.next?.href ?? group.pages[0].href} className="overview-arrowLink" aria-label={`Study ${group.title}`}><ArrowRight className="size-4" aria-hidden /></Link></div>
  </Card>;
}

function StudyStatus({ study }: { study: Study }) {
  const segments = [
    { label: "Complete", count: study.complete, color: "var(--primary)" },
    { label: "In progress", count: study.started, color: "var(--success)" },
    { label: "Not started", count: study.untouched, color: "var(--muted-foreground)" },
  ];
  const total = study.groups.length;
  let offset = 0;
  return <Card as="section" aria-label="Learning status" className="overview-card">
    <CardHeading eyebrow="Your course at a glance" title="Learning status" />
    <div className={cn("overview-gauge", "overview-statusGauge")} role="img" aria-label={`${study.complete} complete, ${study.started} in progress, ${study.untouched} not started out of ${total} parts`}>
      <svg viewBox="0 0 320 166" aria-hidden>{segments.filter((segment) => segment.count > 0).map((segment) => {
        const start = offset;
        offset += segment.count / total * 180;
        return <path key={segment.label} d={arcPath(start + 1.5, offset - 1.5, 142, 104)} fill={segment.color} stroke={segment.color} strokeWidth="5" strokeLinejoin="round" opacity={segment.label === "Not started" ? 0.22 : 1} />;
      })}</svg><div className="overview-gaugeValue"><span>{total}</span><p>learning parts</p></div>
    </div>
    <ul className="space-y-3">{segments.map((segment) => <li key={segment.label} className="flex items-center gap-2 text-xs"><span className="size-2 shrink-0 rounded-full" style={{ background: segment.color, opacity: segment.label === "Not started" ? 0.5 : 1 }} /><span className="text-muted-foreground">{segment.label}</span><strong className="ml-auto font-semibold tabular-nums">{segment.count}</strong></li>)}</ul>
    <p className="text-muted-foreground mt-auto border-t pt-3 text-[11px] leading-relaxed">A part is complete when every page in it is marked as studied.</p>
  </Card>;
}

function NextLessons({ study }: { study: Study }) {
  const complete = !study.remaining.length;
  const pages = (complete ? STUDY_PAGES : study.remaining).slice(0, 5);
  return <Card as="section" aria-label={complete ? "Revisit your foundations" : "Up next"} className="overview-card">
    <CardHeading eyebrow={complete ? "Keep it fresh" : "A little direction"} title={complete ? "Revisit your foundations" : "Up next for you"} href="#study-map" label="Browse the full study map" />
    <ol className="-mx-2">{pages.map((page, index) => <li key={page.href}><Link href={page.href} className="overview-lessonLink"><span className={cn("overview-lessonNumber", index === 0 && "overview-lessonNumberActive")}>{complete ? <Check className="size-4" aria-hidden /> : String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium leading-snug">{page.title}</span><span className="text-muted-foreground mt-1 block text-[11px]">{page.group}</span></span><ChevronRight className="text-muted-foreground size-3.5 shrink-0" aria-hidden /></Link></li>)}</ol>
    <p className="text-muted-foreground border-t pt-3 text-[11px] leading-relaxed">{complete ? "You’ve covered the map. Revisit a lesson or try a new practice focus." : "The next unstudied pages, in your course’s reading order."}</p>
  </Card>;
}

const focusColors = ["var(--primary)", "var(--success)", "var(--foreground)", "var(--muted-foreground)"];
function PracticeActivity({ practice, days, ready }: { practice: Practice; days: number; ready: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedDay = practice.activity.find((day) => day.date === selected);
  return <Card as="section" aria-label="Practice activity" className="overview-card">
    <CardHeading eyebrow="Small sessions. Lasting progress." title="Your practice rhythm" href="/practice" label="Open the practice studio" />
    <div className="overview-activityBody">
      <div className="flex min-w-0 flex-col">
        <p className="text-3xl font-semibold tracking-tight tabular-nums">{practice.activeDays}<span className="text-muted-foreground ml-2 text-xs font-normal tracking-normal">active {practice.activeDays === 1 ? "day" : "days"} / {days}</span></p>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{practice.count ? `${practice.minutes} minutes across ${practice.count} saved ${practice.count === 1 ? "session" : "sessions"}. Here’s where your time went.` : "Save a session in the practice studio to start building your rhythm."}</p>
        <div className="overview-focusMeter" role="img" aria-label={practice.count ? practice.focus.map((focus) => `${focus.name}: ${focus.minutes} minutes`).join(", ") : "No saved practice in this period"}>
          {practice.focus.map((focus, index) => <span key={focus.name} style={{ flex: focus.minutes, background: focusColors[index] }} />)}
        </div>
        {practice.focus.length ? <ul className="space-y-2">{practice.focus.map((focus, index) => <li key={focus.name} className="flex items-start gap-2 text-[11px]"><span className="mt-1 size-2 shrink-0 rounded-full" style={{ background: focusColors[index] }} /><span className="text-muted-foreground flex-1">{focus.name}</span><span className="shrink-0 font-medium tabular-nums">{focus.minutes} min</span></li>)}</ul> : <Link href="/practice" className="text-primary mt-1 inline-flex items-center gap-1 text-xs font-medium underline-offset-4 hover:underline">Plan your first session <ArrowRight className="size-3" aria-hidden /></Link>}
      </div>
      <div className="min-w-0">
        <div className="text-muted-foreground mb-3 flex items-center justify-between gap-2 text-[11px]"><span>{ready && practice.activity.length ? `${calendarLabel(practice.activity[0].date, { day: "numeric", month: "short" })} – ${calendarLabel(practice.activity[practice.activity.length - 1].date, { day: "numeric", month: "short" })}` : "Loading your calendar…"}</span><span>IST</span></div>
        <div className="overview-heatmap">
          {practice.activity.slice(0, 7).map((day) => <span key={`label-${day.date}`} className="text-muted-foreground text-center text-[10px]">{calendarLabel(day.date, { weekday: "short" }).slice(0, 1)}</span>)}
          {practice.activity.map((day) => <Tooltip key={day.date} content={`${calendarLabel(day.date, { day: "numeric", month: "short" })}: ${day.minutes} min · ${day.sessions} ${day.sessions === 1 ? "session" : "sessions"}`}><button type="button" className="overview-heatCell" data-level={day.minutes === 0 ? 0 : day.minutes < 15 ? 1 : day.minutes < 30 ? 2 : day.minutes < 60 ? 3 : 4} aria-label={`${calendarLabel(day.date, { day: "numeric", month: "long" })}: ${day.minutes} minutes, ${day.sessions} ${day.sessions === 1 ? "session" : "sessions"}`} aria-pressed={selected === day.date} onClick={() => setSelected(day.date)} /></Tooltip>)}
        </div>
        <div className="text-muted-foreground mt-3 flex items-center justify-end gap-1 text-[10px]"><span className="mr-1">0 min</span>{[0, 1, 2, 3, 4].map((level) => <span key={level} className="overview-heatLegend" data-level={level} />)}<span className="ml-1">60+ min</span></div>
        <p className="text-muted-foreground mt-3 min-h-8 text-[11px] leading-relaxed" aria-live="polite">{selectedDay ? `${calendarLabel(selectedDay.date, { day: "numeric", month: "short" })} · ${selectedDay.minutes} min · ${selectedDay.sessions} saved ${selectedDay.sessions === 1 ? "session" : "sessions"}` : "Select a day to see your saved practice."}</p>
      </div>
    </div>
    <p className="text-muted-foreground flex items-start gap-2 border-t pt-3 text-[11px] leading-relaxed"><Info className="mt-0.5 size-3 shrink-0" aria-hidden />Based on your latest 30 saved sessions. Minutes are self-reported; dates use India Standard Time.</p>
  </Card>;
}

function StudyMap({ study }: { study: Study }) {
  return <Section id="study-map" title="Your study map" description="The whole course, with a clear place to pick up." action={<StatusBadge tone="brand">{study.done} / {study.total} pages studied</StatusBadge>}>
    <div className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3">{study.groups.map((group, index) => {
      const Icon = group.items[0].icon;
      return <details key={group.title} className="overview-mapPart">
        <summary className="overview-mapSummary"><IconTile icon={<Icon />} tone={group.done === group.total ? "success" : "primary"} /><span className="min-w-0 flex-1"><span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Part {String(index + 1).padStart(2, "0")}</span><span className="mt-0.5 block text-sm font-medium">{group.title}</span></span><span className="text-muted-foreground text-[11px] tabular-nums">{group.done}/{group.total}</span><ChevronDown className={cn("overview-mapChevron", "size-3.5 shrink-0 text-muted-foreground")} aria-hidden /></summary>
        <ul className="mx-4 mb-3 border-t pt-2">{group.pages.map((page) => <li key={page.href}><Link href={page.href} className="overview-mapLink"><span>{page.title}</span>{study.remaining.some((remaining) => remaining.href === page.href) ? <ChevronRight className="size-3 shrink-0 text-muted-foreground" aria-hidden /> : <CircleCheck className="size-3.5 shrink-0 text-success" aria-label="Studied" />}</Link></li>)}</ul>
      </details>;
    })}</div>
  </Section>;
}

export function OverviewDashboard({ library }: { library: LibraryCounts }) {
  const { studied } = useStudied();
  const [sessions] = usePracticeSessions();
  const [days, setDays] = useState(28);
  const minute = useSyncExternalStore(subscribeClock, minuteSnapshot, serverMinute);
  const study = studySummary(studied);
  const practice = practiceSummary(sessions, days, new Date(minute * 60_000 + 59_999));
  const next = study.remaining[0];
  return <div className="flex flex-col gap-7">
    <PageHeader title="Overview" description="A little theory. A little practice. A more musical you." actions={<><Link href="/practice" className={buttonVariants({ variant: "outline" })}><Guitar aria-hidden />Practice studio</Link><Link href={next?.href ?? "/books/music-theory"} className={buttonVariants()}>{next ? study.done ? "Continue learning" : "Start learning" : "Revisit the course"}<ArrowRight aria-hidden /></Link></>} />
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="bg-primary size-1.5 rounded-full" aria-hidden /><p className="text-muted-foreground text-xs">Your personal learning dashboard</p></div><div className="flex items-center gap-2"><span className="text-muted-foreground text-xs">Practice window</span><Segmented label="Practice period" size="sm" value={days} onChange={setDays} options={[{ value: 7, label: "7 days" }, { value: 28, label: "28 days" }]} /></div></div>
    <div className="overview-dashboard">
      <div className="overview-mainColumn">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Study library" value={library.topics} detail="Written lessons to explore" icon={BookOpen} href="#study-map" />
          <Metric label="Practice logged" value={practice.minutes} suffix="min" detail={`Saved in the last ${days} days`} icon={Clock3} href="/practice" />
          <Metric label="Saved sessions" value={practice.count} detail={`Across ${practice.activeDays} active ${practice.activeDays === 1 ? "day" : "days"}`} icon={CalendarDays} href="/practice" />
        </div>
        <div className="overview-chartsRow"><PartChart study={study} /><StudyStatus study={study} /></div>
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-semibold">Time with your instrument</h2><span className="text-muted-foreground text-xs">Last {days} days</span></div>
        <PracticeActivity practice={practice} days={days} ready={minute !== 0} />
      </div>
      <div className="overview-sideColumn"><ProgressGauge study={study} /><NextLessons study={study} /></div>
    </div>
    <Section title="Turn understanding into sound" description="Your workbench, one click away.">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[
        { title: "Explore scales", detail: `${library.scales} scales · every key`, icon: ListMusic, href: "/scales" },
        { title: "Find a new colour", detail: `${library.modes} modes · ${library.families} families`, icon: Layers, href: "/modes/major" },
        { title: "Build your harmony", detail: `${library.chords} chord formulas`, icon: Library, href: "/chords" },
        { title: "Train your ears", detail: "Intervals, drones & fine tuning", icon: AudioWaveform, href: "/listening" },
      ].map((item) => <Link key={item.href} href={item.href} className="overview-toolLink"><IconTile icon={<item.icon />} tone="brand" size="lg" /><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{item.title}</span><span className="text-muted-foreground mt-1 block text-xs">{item.detail}</span></span><ArrowUpRight className="text-muted-foreground size-4 shrink-0" aria-hidden /></Link>)}</div>
    </Section>
    <StudyMap study={study} />
    <div className="overview-footerStrip"><div className="flex items-center gap-3"><IconTile icon={<Music2 />} tone="primary" /><div><p className="text-sm font-medium">Make something of what you know.</p><p className="text-muted-foreground mt-0.5 text-xs">Find your pulse, write a phrase, or return to the source.</p></div></div><div className="flex flex-wrap gap-2"><Link href="/rhythm-lab" className={buttonVariants({ variant: "outline", size: "sm" })}><Drum aria-hidden />Rhythm lab</Link><Link href="/composition" className={buttonVariants({ variant: "outline", size: "sm" })}><Music2 aria-hidden />Compose</Link><Link href="/books/music-theory" className={buttonVariants({ variant: "outline", size: "sm" })}><BookOpen aria-hidden />Theory book</Link><Link href="/book" className={buttonVariants({ variant: "outline", size: "sm" })}><Guitar aria-hidden />Fretboard book</Link></div></div>
    <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-center text-[11px]"><Target className="size-3 shrink-0" aria-hidden />Progress and practice are saved in this browser.</p>
  </div>;
}
