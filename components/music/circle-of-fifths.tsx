"use client";

import { useState } from "react";
import { CIRCLE, keyCharacter, keySignature, relativeMinor } from "@/lib/music/keys";
import { buildScale, harmonize, noteName, parseDegree, parseNote } from "@/lib/music/theory";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/app/panel";
import { Segmented } from "@/components/ui/segmented";

/*
 * Clickable circle: majors outside, relative minors inside, accidental
 * count on the rim. The panel beside it reads out the selected key.
 */

const MAJOR = ["1", "2", "3", "4", "5", "6", "7"].map(parseDegree);
const C = 180;

// Rounded so server and client produce identical attribute strings.
const round = (n: number) => Math.round(n * 100) / 100;

function arc(r1: number, r2: number, a0: number, a1: number) {
  const p = (r: number, a: number) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return `${round(C + r * Math.cos(rad))} ${round(C + r * Math.sin(rad))}`;
  };
  return `M ${p(r2, a0)} A ${r2} ${r2} 0 0 1 ${p(r2, a1)} L ${p(r1, a1)} A ${r1} ${r1} 0 0 0 ${p(r1, a0)} Z`;
}

function label(r: number, a: number) {
  const rad = ((a - 90) * Math.PI) / 180;
  return [round(C + r * Math.cos(rad)), round(C + r * Math.sin(rad))] as const;
}

const pretty = (name: string) => noteName(parseNote(name));

export function CircleOfFifths() {
  const [index, setIndex] = useState(0);
  const [spelling, setSpelling] = useState<"main" | "alt">("main");
  const slot = CIRCLE[index];
  const majorName = spelling === "alt" && slot.alt ? slot.alt.major : slot.major;
  const sig = keySignature(majorName);
  const minor = relativeMinor(majorName);
  const chords = harmonize(buildScale(parseNote(majorName), MAJOR));
  const left = CIRCLE[(index + 11) % 12];
  const right = CIRCLE[(index + 1) % 12];
  const majorChar = keyCharacter(majorName, "major");
  const minorChar = keyCharacter(minor.replace("♯", "#").replace("♭", "b"), "minor");

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,440px)_1fr]">
      <Panel>
        <svg viewBox="0 0 360 360" role="group" aria-label="Circle of fifths" className="mx-auto h-auto w-full max-w-[420px] select-none" style={{ fontFamily: "var(--font-sans)" }}>
          {CIRCLE.map((k, i) => {
            const a0 = i * 30 - 15;
            const a1 = i * 30 + 15;
            const selected = i === index;
            const [mx, my] = label(128, i * 30);
            const [nx, ny] = label(84, i * 30);
            const [ax, ay] = label(166, i * 30);
            const s = keySignature(k.major);
            const count = s.sharps ? `${s.sharps}♯` : s.flats ? `${s.flats}♭` : "";
            return (
              <g
                key={k.major}
                role="button"
                tabIndex={0}
                aria-label={`${pretty(k.major)} major, relative minor ${pretty(k.minor)} minor`}
                aria-pressed={selected}
                onClick={() => {
                  setIndex(i);
                  setSpelling("main");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIndex(i);
                    setSpelling("main");
                  }
                }}
                className="cursor-pointer outline-none [&:focus-visible>path:first-child]:stroke-[var(--ring)] [&:focus-visible>path:first-child]:stroke-[3]"
              >
                <path
                  d={arc(104, 152, a0, a1)}
                  fill={selected ? "var(--foreground)" : "var(--card)"}
                  stroke="var(--border)"
                  strokeWidth={1.5}
                  className={cn(!selected && "transition-[fill] hover:fill-[var(--muted)]")}
                />
                <path
                  d={arc(62, 104, a0, a1)}
                  fill={selected ? "var(--color-iron)" : "var(--muted)"}
                  stroke="var(--border)"
                  strokeWidth={1.5}
                />
                <text x={mx} y={my + 6} textAnchor="middle" fontSize={k.alt ? 15 : 18} fontWeight={500} fill={selected ? "var(--background)" : "var(--foreground)"}>
                  {pretty(k.major)}
                </text>
                <text x={nx} y={ny + 5} textAnchor="middle" fontSize={13} fontWeight={500} fill={selected ? "#ffffff" : "var(--foreground)"}>
                  {pretty(k.minor).toLowerCase()}m
                </text>
                <text x={ax} y={ay + 4} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
                  {count}
                </text>
              </g>
            );
          })}
          <circle cx={C} cy={C} r={58} fill="var(--card)" stroke="var(--border)" strokeWidth={1.5} />
          <text x={C} y={C - 4} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">
            fifths →
          </text>
          <text x={C} y={C + 14} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">
            ← fourths
          </text>
        </svg>
        <p className="mt-2 text-center text-caption text-muted-foreground">Outer ring: major keys. Inner ring: relative minors.</p>
      </Panel>

      <Panel
        title={`${pretty(majorName)} major`}
        description={`Relative minor: ${minor} minor`}
        action={
          slot.alt ? (
            <Segmented
              label="Spelling"
              size="sm"
              value={spelling}
              onChange={setSpelling}
              options={[
                { value: "main", label: pretty(slot.major) },
                { value: "alt", label: pretty(slot.alt.major) },
              ]}
            />
          ) : undefined
        }
      >
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          <Fact label="Key signature" value={sig.accidentals.length ? `${sig.accidentals.length} ${sig.sharps ? "sharp" : "flat"}${sig.accidentals.length > 1 ? "s" : ""}: ${sig.accidentals.join(" ")}` : "No sharps or flats"} />
          <Fact label="Scale" value={sig.scale.join(" ")} />
          <Fact label="Neighbours" value={`IV ${pretty(left.major)} · V ${pretty(right.major)}`} />
          <Fact label="Perfect cadence (V → I)" value={`${chords[4].triad} → ${chords[0].triad}  ·  ${chords[4].seventh} → ${chords[0].triad}`} />
          <div className="bg-card px-4 py-3 sm:col-span-2">
            <dt className="text-[13px] text-muted-foreground">Diatonic chords</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {chords.map((c) => (
                <span key={c.roman} className="flex flex-col items-center rounded-xl border border-border px-2.5 py-1">
                  <span className="text-body font-medium">{c.triad}</span>
                  <span className="text-[11px] text-muted-foreground">{c.triadNumeral}</span>
                </span>
              ))}
            </dd>
          </div>
        </dl>
        {(majorChar || minorChar) && (
          <div className="mt-5 flex flex-col gap-3">
            {majorChar && <Character title={`${pretty(majorName)} major`} text={majorChar.text} />}
            {minorChar && <Character title={`${minor} minor`} text={minorChar.text} />}
          </div>
        )}
      </Panel>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-4 py-3">
      <dt className="text-[13px] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-body font-medium">{value}</dd>
    </div>
  );
}

function Character({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-l-2 border-foreground pl-4">
      <p className="text-caption font-medium">Character of {title}</p>
      <p className="mt-0.5 text-caption leading-[1.5] text-foreground/80">{text}</p>
    </div>
  );
}
