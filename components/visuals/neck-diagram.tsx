import { STRING_NAMES } from "@/lib/music/theory";

/*
 * A neck window drawn the way Fretboard Concepts prints it: high e on top,
 * fret numbers only under the marked frets, black degree dots, the anchor
 * root as a boxed square and a repeated Double Note as an outlined triangle.
 * Pure SVG on theme tokens, so it reads in light and dark mode.
 */

export type NeckMark = { string: number; fret: number; label: string; kind?: "dot" | "root" | "double" | "plain-root" | "ghost" };

const CELL = 46;
const GAP = 25;
const PAD_L = 24;
const PAD_T = 15;
const INLAYS = new Set([3, 5, 7, 9, 15, 17, 19, 21]);
const R = 10.5;

export function NeckDiagram({
  from,
  to,
  marks,
  title,
  showStrings = true,
  className,
}: {
  from: number;
  to: number;
  marks: NeckMark[];
  title: string;
  showStrings?: boolean;
  className?: string;
}) {
  const open = from === 0;
  const first = Math.max(1, from);
  const cells = to - first + 1;
  const nutX = PAD_L + (open ? CELL * 0.7 : 0);
  const width = nutX + cells * CELL + 6;
  const neckH = GAP * 5;
  const height = PAD_T + neckH + 32;
  const y = (string: number) => PAD_T + (5 - string) * GAP;
  const x = (fret: number) => (fret === 0 ? nutX - CELL * 0.35 : nutX + (fret - first + 0.5) * CELL);
  const numbered = Array.from({ length: cells }, (_, i) => first + i).filter((f) => INLAYS.has(f) || f === 12 || f === first && first === 1);

  return (
    <svg role="img" aria-label={title} viewBox={`0 0 ${width} ${height}`} className={className ?? "h-auto w-full"}>
      <title>{title}</title>
      <rect x={nutX} y={PAD_T - 3} width={cells * CELL} height={neckH + 6} rx={4} fill="var(--muted)" />
      {Array.from({ length: cells }, (_, i) => first + i).map((f) =>
        f === 12 || f === 24 ? (
          <g key={f} fill="var(--border)">
            <circle cx={x(f)} cy={PAD_T + GAP * 1.5} r={4} />
            <circle cx={x(f)} cy={PAD_T + GAP * 3.5} r={4} />
          </g>
        ) : INLAYS.has(f) ? <circle key={f} cx={x(f)} cy={PAD_T + neckH / 2} r={4} fill="var(--border)" /> : null,
      )}
      {Array.from({ length: cells + 1 }, (_, i) => (
        <line key={i} x1={nutX + i * CELL} x2={nutX + i * CELL} y1={PAD_T} y2={PAD_T + neckH} stroke="var(--muted-foreground)" strokeOpacity={0.5} strokeWidth={i === 0 && first === 1 ? 0 : 2} />
      ))}
      {first === 1 && <rect x={nutX - 3} y={PAD_T - 1} width={5} height={neckH + 2} rx={1.5} fill="var(--foreground)" />}
      {[0, 1, 2, 3, 4, 5].map((s) => (
        <g key={s}>
          <line x1={open ? PAD_L - 2 : nutX} x2={nutX + cells * CELL} y1={y(s)} y2={y(s)} stroke="var(--foreground)" strokeOpacity={0.45} strokeWidth={0.7 + (5 - s) * 0.22} />
          {showStrings && <text x={PAD_L - 13} y={y(s) + 3.5} fontSize={10} textAnchor="middle" fill="var(--muted-foreground)">{STRING_NAMES[s]}</text>}
        </g>
      ))}
      {numbered.map((f) => (
        <text key={f} x={x(f)} y={PAD_T + neckH + 27} fontSize={11.5} fontWeight={600} textAnchor="middle" fill="var(--muted-foreground)">{f}</text>
      ))}
      {marks.map((m) => {
        const cx = x(m.fret);
        const cy = y(m.string);
        const kind = m.kind ?? "dot";
        const small = m.label.length > 2;
        return (
          <g key={`${m.string}:${m.fret}`} opacity={kind === "ghost" ? 0.25 : 1}>
            {kind === "root" ? (
              <>
                <rect x={cx - R - 1} y={cy - R - 1} width={2 * R + 2} height={2 * R + 2} rx={3} fill="var(--primary)" />
                <rect x={cx - R + 2} y={cy - R + 2} width={2 * R - 4} height={2 * R - 4} rx={2} fill="none" stroke="var(--primary-foreground)" strokeWidth={1.2} />
              </>
            ) : kind === "double" ? (
              <path d={`M ${cx} ${cy - R - 2} L ${cx + R + 1} ${cy + R - 1} L ${cx - R - 1} ${cy + R - 1} Z`} fill="var(--card)" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" />
            ) : (
              <circle cx={cx} cy={cy} r={R} fill={kind === "plain-root" ? "var(--primary)" : "var(--foreground)"} />
            )}
            <text
              x={cx}
              y={cy + (kind === "double" ? 5.5 : 3.8)}
              fontSize={kind === "double" ? 8.5 : small ? 8.5 : 10.5}
              fontWeight={700}
              textAnchor="middle"
              fill={kind === "root" || kind === "plain-root" ? "var(--primary-foreground)" : kind === "double" ? "var(--foreground)" : "var(--background)"}
            >
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
