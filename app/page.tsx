import Link from "next/link";
import { CircleAlert, PenLine } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { ProgressSummary, StudyMap } from "@/components/app/overview";
import { SimpleTable } from "@/components/ui/table";
import { AUDIT } from "@/lib/content/audit";
import { TOPICS } from "@/lib/content/topics";
import { CHORDS } from "@/lib/music/chords";
import { MODE_FAMILIES } from "@/lib/music/modes";
import { SCALES, getScale } from "@/lib/music/scales";
import { parseDegree, stepLabel, stepSizes, degreeSemitones, prettyDegree } from "@/lib/music/theory";

const STATS = [
  { label: "Topics", value: TOPICS.length },
  { label: "Scales", value: SCALES.length },
  { label: "Modes", value: MODE_FAMILIES.reduce((n, f) => n + f.modes.length, 0) },
  { label: "Chord formulas", value: CHORDS.length },
  { label: "Keys", value: 12 },
];

const sentence = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const QUICK_SCALES = ["major", "natural-minor", "major-pentatonic", "minor-pentatonic", "harmonic-minor", "melodic-minor"];

export default function Overview() {
  const fixes = AUDIT.filter((a) => a.tone === "fix");
  const todos = AUDIT.filter((a) => a.tone === "todo");

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Guitar theory notes"
        description="Everything from Guitar.docx, organised for study: foundations, scales, modes, chords and keys."
      />

      <Panel>
        <ProgressSummary />
      </Panel>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-card bg-card px-5 py-4 shadow-soft">
            <dt className="text-caption text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 font-display text-heading font-medium tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>

      <StudyMap />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Panel title="Quick reference" description="Formulas and step patterns of the main scales.">
          <SimpleTable
            columns={["Scale", "Formula", "Steps"]}
            rows={QUICK_SCALES.map((id) => {
              const s = getScale(id)!;
              const semis = s.formula.map((t) => degreeSemitones(parseDegree(t)));
              return [
                <Link key="l" href={`/scales/${id}`} className="hover:underline">
                  {s.short}
                </Link>,
                s.formula.map(prettyDegree).join(" "),
                <span key="s" className="text-muted-foreground">
                  {stepSizes(semis).map(stepLabel).join(" ")}
                </span>,
              ];
            })}
          />
        </Panel>

        <Panel
          title="Changes to your notes"
          description={`${fixes.length} corrections and ${todos.length} gaps found while organising the doc. Each is marked where it appears.`}
        >
          <ul className="flex flex-col">
            {[...todos, ...fixes].map((item, i) => {
              const Icon = item.tone === "fix" ? PenLine : CircleAlert;
              return (
                <li key={i} className="border-b border-border/70 last:border-0">
                  <Link href={item.href} className="-mx-2 flex gap-3 rounded-xl px-2 py-2.5 hover:bg-muted">
                    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-label={item.tone === "fix" ? "Correction" : "Gap"} />
                    <span className="min-w-0">
                      <span className="block text-caption font-medium text-foreground">{sentence(item.title.replace(/^Corrected: /, ""))}</span>
                      <span className="block text-[12px] text-muted-foreground">{item.where}</span>
                    </span>
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
