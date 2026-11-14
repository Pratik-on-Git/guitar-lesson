import Link from "next/link";
import { BookOpen, CircleAlert, KeyRound, Layers, Library, ListMusic, PenLine } from "lucide-react";
import { PageHeader, Section } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { ContinueButton, PartProgress, ProgressHero, StudyMap } from "@/components/app/overview";
import { StatCard, StatGrid } from "@/components/app/stat-card";
import { StatusBadge } from "@/components/app/status-badge";
import { IconTile } from "@/components/app/icon-tile";
import { SimpleTable } from "@/components/ui/table";
import { AUDIT } from "@/lib/content/audit";
import { TOPICS } from "@/lib/content/topics";
import { CHORDS } from "@/lib/music/chords";
import { MODE_FAMILIES } from "@/lib/music/modes";
import { SCALES, getScale } from "@/lib/music/scales";
import { parseDegree, stepLabel, stepSizes, degreeSemitones, prettyDegree } from "@/lib/music/theory";

const MODE_COUNT = MODE_FAMILIES.reduce((n, f) => n + f.modes.length, 0);

const STATS = [
  { label: "Topics", value: TOPICS.length, detail: "Written study pages", icon: BookOpen, href: "/learn/sound-and-pitch" },
  { label: "Scales", value: SCALES.length, detail: "Playable in any key", icon: ListMusic, href: "/scales" },
  { label: "Modes", value: MODE_COUNT, detail: `In ${MODE_FAMILIES.length} families`, icon: Layers, href: "/modes/major" },
  { label: "Chords", value: CHORDS.length, detail: "In the library", icon: Library, href: "/chords" },
  { label: "Keys", value: 12, detail: "On the circle of fifths", icon: KeyRound, href: "/circle-of-fifths" },
];

const sentence = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const QUICK_SCALES = ["major", "natural-minor", "major-pentatonic", "minor-pentatonic", "harmonic-minor", "melodic-minor"];

export default function Overview() {
  const fixes = AUDIT.filter((a) => a.tone === "fix");
  const todos = AUDIT.filter((a) => a.tone === "todo");

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title="Guitar Theory Notes"
        description="Everything from Guitar.docx, organised for study: foundations, scales, modes, chords and keys."
        actions={<ContinueButton />}
      />

      <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <ProgressHero />
        <PartProgress />
      </div>

      <StatGrid columns={5}>
        {STATS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} detail={s.detail} icon={s.icon} href={s.href} />
        ))}
      </StatGrid>

      <Section title="Study Map" description="Every topic, in the order the notes build on each other.">
        <StudyMap />
      </Section>

      <div className="grid items-start gap-4 md:gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Panel title="Quick Reference" description="Formulas and step patterns of the main scales.">
          <SimpleTable
            columns={["Scale", "Formula", "Steps"]}
            rows={QUICK_SCALES.map((id) => {
              const s = getScale(id)!;
              const semis = s.formula.map((t) => degreeSemitones(parseDegree(t)));
              return [
                <Link key="l" href={`/scales/${id}`} className="text-primary hover:underline">
                  {s.short}
                </Link>,
                <span key="f" className="font-mono text-xs">
                  {s.formula.map(prettyDegree).join(" ")}
                </span>,
                <span key="s" className="text-muted-foreground font-mono text-xs">
                  {stepSizes(semis).map(stepLabel).join(" ")}
                </span>,
              ];
            })}
          />
        </Panel>

        <Panel
          title="Changes to Your Notes"
          description={`${fixes.length} corrections and ${todos.length} gaps found while organising the doc. Each is marked where it appears.`}
          action={
            <div className="flex gap-1.5">
              <StatusBadge tone="info">{fixes.length} fixed</StatusBadge>
              <StatusBadge tone="warning">{todos.length} to do</StatusBadge>
            </div>
          }
        >
          <ul className="-mx-2 flex flex-col">
            {[...todos, ...fixes].map((item, i) => {
              const fix = item.tone === "fix";
              const Icon = fix ? PenLine : CircleAlert;
              return (
                <li key={i} className="border-border/70 border-b last:border-0">
                  <Link
                    href={item.href}
                    className="flex items-start gap-3 rounded-lg px-2 py-2.5 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <IconTile icon={<Icon />} size="sm" tone={fix ? "primary" : "warning"} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{sentence(item.title.replace(/^Corrected: /, ""))}</span>
                      <span className="text-muted-foreground block text-xs">{item.where}</span>
                    </span>
                    <StatusBadge tone={fix ? "info" : "warning"} size="xs" className="mt-0.5">
                      {fix ? "Fixed" : "Gap"}
                    </StatusBadge>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
