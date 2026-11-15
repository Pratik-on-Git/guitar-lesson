"use client";

import { titleCaseLabel } from "@/lib/title-case";

import { useState, type CSSProperties } from "react";
import { ArrowRight, AudioWaveform, Check, Plus } from "lucide-react";
import { PageHeader, Section } from "./page-header";
import { Panel } from "./panel";
import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleTable } from "@/components/ui/table";
import styles from "./design-system.module.css";

const palette = [
  ["Canvas", "background", "#F3F4F7", "#09090C"],
  ["Surface", "card", "#FFFFFF", "#191A1F"],
  ["Raised", "popover", "#FFFFFF", "#222329"],
  ["Inset", "muted", "#ECEEF3", "#25272E"],
  ["Text", "foreground", "#202127", "#F2F3F7"],
  ["Secondary text", "muted-foreground", "#606571", "#A5A8B5"],
  ["Interactive", "primary", "#076985", "#8CDCF0"],
  ["Border", "border", "#D7DAE3", "#353740"],
] as const;

function ThemeSpecimen({ theme }: { theme: "light" | "dark" }) {
  return <div className={`${theme} ${styles.specimen}`}>
    <div className="mb-5 flex items-center justify-between"><h3 className="text-lg font-medium">{titleCaseLabel(<>{theme === "light" ? "Daylight" : "After hours"}</>)}</h3><StatusBadge tone="brand" dot>{theme === "light" ? "Light" : "Dark"} mode</StatusBadge></div>
    <div className={styles.swatches}>{palette.map(([name, token, light, dark]) => <div key={token}>
      <div className={styles.swatch} style={{ background: `var(--${token})` }} />
      <p className="mt-2 text-xs font-medium">{name}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{theme === "light" ? light : dark}</p>
    </div>)}</div>
    <Card className="mt-6"><CardHeader><CardTitle>{titleCaseLabel(<>Space to find your sound.</>)}</CardTitle><CardDescription>Clear content. Quiet surfaces. A little colour.</CardDescription></CardHeader><CardContent className="space-y-4"><StatusBadge tone="success" dot>Ready to practice</StatusBadge><Progress value={64} label={`${theme} example progress`} /><p className="text-sm text-muted-foreground">64% · example learning progress</p></CardContent></Card>
  </div>;
}

export function DesignSystem() {
  const [mode, setMode] = useState("Explore");
  const [volume, setVolume] = useState(64);
  const [dialog, setDialog] = useState(false);
  const [saved, setSaved] = useState(false);
  return <div className="space-y-10">
    <PageHeader title="Resonance" description="The Guitar Notes design system. Soft light, tactile surfaces, and room for the music." meta={<StatusBadge tone="brand">Design system · 01</StatusBadge>} />
    <section className="resonance-feature flex items-center justify-between gap-8" aria-label="Design direction"><div className="space-y-5"><p className="feature-eyebrow">Inspired by light. Built for focus.</p><h2>{titleCaseLabel(<>A little colour.<br />A lot of clarity.</>)}</h2><p className="max-w-lg text-sm leading-relaxed">A family of rounded instruments on a quiet canvas. Light lives at the edges; colour gives each action a purpose.</p></div><div className="feature-orb mr-4 hidden shrink-0 sm:grid" aria-hidden><AudioWaveform size={56} strokeWidth={1.5} /></div></section>
    <Section title="01 / Two themes, one language" description="Every surface, text colour, border, and state has a deliberate light and dark counterpart.">
      <div className="grid gap-4 xl:grid-cols-2"><ThemeSpecimen theme="light" /><ThemeSpecimen theme="dark" /></div>
    </Section>
    <Section title="02 / Light with a purpose" description="Use vivid surfaces for a small number of moments. Keep long-form content on neutral cards.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{[
        ["cyan", "Explore", "Interaction & discovery"], ["lime", "Grow", "Progress & completion"], ["orange", "Play", "Practice & energy"], ["violet", "Imagine", "Harmony & ideas"], ["pink", "Connect", "Highlights & expression"],
      ].map(([tone, label, detail]) => <div key={tone} className={styles.gradient} style={{ background: `var(--gradient-${tone})` }}><span className="text-xs tracking-widest">{tone}</span><p className="my-7 text-3xl font-light tracking-tight">{label}</p><p className="text-xs">{detail}</p></div>)}</div>
    </Section>
    <Section title="03 / Typography" description="Inter for interface and reading. JetBrains Mono for formulas and precise values. Both are self-hosted through next/font.">
      <Panel><div className="space-y-7"><div><p className="mb-2 text-xs text-muted-foreground">Display · 32–44px / 1.12 · 500 · −0.055em</p><p className="text-display font-medium tracking-tight">Find your next note.</p></div><div className="grid gap-8 sm:grid-cols-2"><div><p className="mb-2 text-xs text-muted-foreground">Metric · 40–64px / 1.1 · 300</p><p className="text-6xl font-light tracking-tighter tabular-nums">072<span className="ml-3 text-sm tracking-normal">BPM</span></p></div><div><p className="mb-2 text-xs text-muted-foreground">Body · 14–16px / 1.5–1.7 · 400</p><p className="text-body leading-relaxed">A little theory. A little practice. A more musical you. Give each idea enough space to be understood.</p><p className="mt-4 font-mono text-sm text-primary">1 · 2 · 3 · 4 · 5 · 6 · 7</p></div></div></div></Panel>
    </Section>
    <Section title="04 / Controls that feel connected" description="The same geometry, states, and keyboard focus throughout the application. Try the examples below.">
      <div className="grid items-start gap-4 xl:grid-cols-2">
        <Panel title="Actions & feedback" description="One primary action per group, with quiet secondary actions."><div className="space-y-6"><div className="flex flex-wrap gap-3"><Button onClick={() => setSaved(!saved)}>{titleCaseLabel(<>{saved ? <Check aria-hidden /> : <Plus aria-hidden />}{saved ? "Added to practice" : "Add to practice"}</>)}</Button><Button variant="outline" onClick={() => setDialog(true)}>{titleCaseLabel(<>Open dialog<ArrowRight aria-hidden /></>)}</Button><Button disabled>{titleCaseLabel(<>Unavailable</>)}</Button></div><p role="status" className="text-sm text-muted-foreground">{saved ? "Example added. Select again to reset." : "Interactive examples; no practice data is changed."}</p><div className="flex flex-wrap gap-2"><StatusBadge tone="neutral" dot>Not started</StatusBadge><StatusBadge tone="info" dot>In progress</StatusBadge><StatusBadge tone="success" dot>Studied</StatusBadge><StatusBadge tone="warning" dot>Review</StatusBadge><StatusBadge tone="danger" dot>Unavailable</StatusBadge></div><div className="flex flex-wrap gap-2"><Button variant="secondary">{titleCaseLabel(<>Secondary</>)}</Button><Button variant="tertiary" onClick={() => setDialog(true)}>Learn More<ArrowRight aria-hidden /></Button><Button variant="soft">{titleCaseLabel(<>Soft</>)}</Button><Button variant="ghost">{titleCaseLabel(<>Ghost</>)}</Button><Button variant="destructive">{titleCaseLabel(<>Destructive</>)}</Button></div></div></Panel>
        <Panel title="Inputs & selection" description="Inset fields and raised selections make state visible."><div className="space-y-5"><label className="block space-y-2 text-sm">{titleCaseLabel(<><span>Practice note</span><Input placeholder="What would you like to work on?" /></>)}</label><label className="block space-y-2 text-sm">{titleCaseLabel(<><span>Invalid input example</span><Input aria-invalid="true" aria-describedby="example-error" defaultValue="Try a different value" /><span id="example-error" className="text-xs text-destructive">A helpful error explains how to continue.</span></>)}</label><Segmented label="Example activity" value={mode} onChange={setMode} options={["Explore", "Listen", "Practice"].map(value => ({ value, label: value }))} /><label className="block space-y-4 text-sm">{titleCaseLabel(<><span>Example level · {volume}%</span><input aria-label="Example level" type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))} className="block w-full" /></>)}</label><Progress value={volume} label="Example level progress" /></div></Panel>
      </div>
    </Section>
    <Section title="05 / Space, shape & elevation" description="A 4px base unit keeps every layout related. Larger containers create room; nested elements use smaller radii.">
      <Panel><div className="flex flex-wrap items-end gap-6">{[4, 8, 12, 16, 24, 32, 48, 64].map(size => <div key={size} className="space-y-3 text-center"><div style={{ width: size, height: size, background: "var(--primary)", borderRadius: 4 } as CSSProperties} /><p className="font-mono text-xs text-muted-foreground">{size}</p></div>)}</div><SimpleTable className="mt-8" columns={["Element", "Radius", "Spacing"]} rows={[["Compact controls", "4–5px", "8–12px inside"], ["Fields & segments", "5–8px", "12–16px inside"], ["Cards & panels", "8px", "24px desktop / 16px mobile"], ["Feature surfaces", "10px", "24–40px inside"], ["Primary actions", "5px", "16–20px horizontal"], ["Sections", "—", "32–40px between groups"]]} /></Panel>
    </Section>
    <Section title="06 / Loading, focus & motion" description="Useful feedback without unnecessary movement. Reduced-motion preferences apply throughout."><div className="grid gap-4 sm:grid-cols-2"><Panel title="Loading"><div className="space-y-3" aria-label="Example loading state"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-20 w-full" /></div></Panel><Panel title="Interaction rules"><ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground"><li>160ms for hover; 240ms for larger transitions.</li><li>Visible focus rings for keyboard navigation.</li><li>44px touch targets on coarse pointers.</li><li>Labels and shapes accompany status colours.</li><li>Charts and notation preserve their semantic colours.</li></ul></Panel></div></Section>
    <Dialog open={dialog} onOpenChange={setDialog}><DialogContent><DialogTitle>{titleCaseLabel(<>A moment of focus.</>)}</DialogTitle><DialogDescription>Dialogs use a raised neutral surface, soft backdrop blur, and a visible close control. Press Escape to return.</DialogDescription><Button className="mt-3" onClick={() => setDialog(false)}>{titleCaseLabel(<>Back to the system<ArrowRight aria-hidden /></>)}</Button></DialogContent></Dialog>
  </div>;
}
