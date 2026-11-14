"use client";

import { STRING_NAMES, type FretNote } from "@/lib/music/theory";

/*
 * Guitar neck diagram in the doc's style: high e on top, low E at the
 * bottom, frets numbered underneath. Scale notes are ink dots; the root is a
 * brand-filled square, so it reads by shape as well as colour. Notes outside
 * the selected position stay visible but faint so the shape reads in context.
 */

export type FretLabelFn = (index: number) => string;

const FRET_W = 54;
const OPEN_W = 40;
const STRING_GAP = 27;
const PAD_X = 14;
const PAD_TOP = 18;
const PAD_BOTTOM = 34;
const DOT = 11.5;
const INLAYS = [3, 5, 7, 9, 15, 17, 19, 21];

export function Fretboard({
  notes,
  frets = 15,
  label,
  rootIndex = 0,
  highlight,
  duplicates = [],
  title,
}: {
  notes: FretNote[];
  frets?: number;
  /** Text inside each dot, from the note's scale index. */
  label: FretLabelFn;
  /** Which scale index is the root (boxed). */
  rootIndex?: number;
  /** When set, notes not in this list are drawn faint. */
  highlight?: FretNote[];
  /** Repeated sounding pitch locations in a Double Note shape. */
  duplicates?: FretNote[];
  title: string;
}) {
  const nutX = PAD_X + OPEN_W;
  const width = nutX + frets * FRET_W + PAD_X;
  const neckH = STRING_GAP * 5;
  const height = PAD_TOP + neckH + PAD_BOTTOM;
  // SVG y for string index (0 = low E) - drawn bottom-up.
  const yOf = (string: number) => PAD_TOP + (5 - string) * STRING_GAP;
  const xOf = (fret: number) => (fret === 0 ? PAD_X + OPEN_W / 2 - 4 : nutX + (fret - 0.5) * FRET_W);
  const inPosition = highlight ? new Set(highlight.map((n) => `${n.string}:${n.fret}`)) : null;

  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <svg
        role="img"
        aria-label={title}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[720px] select-none"
      >
        <title>{title}</title>
        {/* the neck itself, a muted well behind the frets */}
        <rect x={nutX} y={PAD_TOP - 4} width={frets * FRET_W} height={neckH + 8} rx={6} fill="var(--muted)" />
        {/* inlays */}
        {INLAYS.filter((f) => f <= frets).map((f) => (
          <circle key={f} cx={nutX + (f - 0.5) * FRET_W} cy={PAD_TOP + neckH / 2} r={5} fill="var(--border)" />
        ))}
        {frets >= 12 && (
          <>
            <circle cx={nutX + 11.5 * FRET_W} cy={PAD_TOP + STRING_GAP * 1.5} r={5} fill="var(--border)" />
            <circle cx={nutX + 11.5 * FRET_W} cy={PAD_TOP + STRING_GAP * 3.5} r={5} fill="var(--border)" />
          </>
        )}
        {/* frets */}
        {Array.from({ length: frets }, (_, i) => i + 1).map((f) => (
          <line
            key={f}
            x1={nutX + f * FRET_W}
            x2={nutX + f * FRET_W}
            y1={PAD_TOP}
            y2={PAD_TOP + neckH}
            stroke="var(--muted-foreground)"
            strokeOpacity={0.45}
            strokeWidth={1.5}
          />
        ))}
        {/* nut */}
        <rect x={nutX - 3} y={PAD_TOP - 1} width={5} height={neckH + 2} rx={1.5} fill="var(--foreground)" />
        {/* strings: thicker toward low E */}
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <g key={s}>
            <line
              x1={PAD_X + 8}
              x2={width - PAD_X}
              y1={yOf(s)}
              y2={yOf(s)}
              stroke="var(--foreground)"
              strokeOpacity={0.55}
              strokeWidth={0.8 + (5 - s) * 0.28}
            />
            <text x={PAD_X - 6} y={yOf(s) + 4} fontSize={11} textAnchor="middle" fill="var(--muted-foreground)">
              {STRING_NAMES[s]}
            </text>
          </g>
        ))}
        {/* fret numbers */}
        {[0, 3, 5, 7, 9, 12, 15, 17, 19, 21].filter((f) => f <= frets).map((f) => (
          <text
            key={f}
            x={f === 0 ? xOf(0) : nutX + (f - 0.5) * FRET_W}
            y={height - 10}
            fontSize={13}
            fontWeight={500}
            textAnchor="middle"
            fill="var(--muted-foreground)"
          >
            {f}
          </text>
        ))}
        {/* notes */}
        {notes.map((n) => {
          const x = xOf(n.fret);
          const y = yOf(n.string);
          const isRoot = n.index === rootIndex;
          const faint = inPosition && !inPosition.has(`${n.string}:${n.fret}`);
          const text = label(n.index);
          const repeated = duplicates.some((d) => d.string === n.string && d.fret === n.fret);
          return (
            <g key={`${n.string}:${n.fret}`} opacity={faint ? 0.16 : 1}>
              {repeated ? <path d={`M ${x} ${y - DOT - 2} L ${x + DOT + 3} ${y + DOT} L ${x - DOT - 3} ${y + DOT} Z`} fill="var(--primary)" /> : isRoot ? (
                <rect
                  x={x - DOT}
                  y={y - DOT}
                  width={DOT * 2}
                  height={DOT * 2}
                  rx={5}
                  fill="var(--primary)"
                  stroke="var(--card)"
                  strokeWidth={faint ? 0 : 2}
                />
              ) : (
                <circle cx={x} cy={y} r={DOT} fill="var(--foreground)" />
              )}
              <text
                x={x}
                y={y + 4}
                fontSize={text.length > 2 ? 9.5 : 11.5}
                fontWeight={600}
                textAnchor="middle"
                fill={isRoot || repeated ? "var(--primary-foreground)" : "var(--background)"}
              >
                {text}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
