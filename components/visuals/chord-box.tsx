import type { ChordGrip } from "@/lib/music/chord-shapes";
import { prettyDegree } from "@/lib/music/theory";
import { cn } from "@/lib/utils";

/*
 * A standard chord box: strings vertical (low E on the left), five frets,
 * open/muted marks above the nut and the starting fret beside the box. Dots
 * are labelled by degree (root in brand) or note name; a barre is a bar.
 */
const SW = 18;
const FH = 22;
const LEFT = 24;
const TOP = 30;

export function ChordBox({
  grip,
  name,
  labels,
  className,
  size = "md",
}: {
  grip: ChordGrip;
  name?: string;
  /** Text per string (note names); defaults to the degree. */
  labels?: (string | null)[];
  className?: string;
  size?: "sm" | "md";
}) {
  const frets = 5;
  const width = LEFT + SW * 5 + 18;
  const height = TOP + FH * frets + 22;
  const x = (s: number) => LEFT + s * SW;
  const y = (f: number) => TOP + (f - grip.baseFret + 0.5) * FH;
  const text = (s: number) => labels?.[s] ?? (grip.degrees[s] === "1" ? "R" : prettyDegree(grip.degrees[s] ?? ""));
  const shape = grip.frets.map((f) => (f === null ? "x" : f)).join(" ");
  const title = `${name ? `${name} ` : ""}chord diagram, low to high strings: ${shape}${grip.baseFret > 1 ? `, from fret ${grip.baseFret}` : ""}`;
  return (
    <figure className={cn("flex flex-col items-center", className)}>
      {name && <figcaption className="mb-1 text-sm font-semibold">{name}</figcaption>}
      <svg role="img" aria-label={title} viewBox={`0 0 ${width} ${height}`} className={size === "sm" ? "w-24" : "w-32"}>
        <title>{title}</title>
        {Array.from({ length: frets + 1 }, (_, i) => (
          <line key={i} x1={x(0)} x2={x(5)} y1={TOP + i * FH} y2={TOP + i * FH} stroke="var(--muted-foreground)" strokeOpacity={0.55} strokeWidth={i === 0 && grip.baseFret === 1 ? 4 : 1.2} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <line key={s} x1={x(s)} x2={x(s)} y1={TOP} y2={TOP + FH * frets} stroke="var(--foreground)" strokeOpacity={0.55} strokeWidth={1.6 - s * 0.12} />
        ))}
        {grip.baseFret > 1 && <text x={LEFT - 8} y={TOP + FH * 0.5 + 4} fontSize={11} fontWeight={600} textAnchor="end" fill="var(--muted-foreground)">{grip.baseFret}</text>}
        {grip.frets.map((f, s) =>
          f === null ? (
            <text key={s} x={x(s)} y={TOP - 9} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted-foreground)">×</text>
          ) : f === 0 ? (
            <circle key={s} cx={x(s)} cy={TOP - 13} r={5} fill="none" stroke={grip.degrees[s] === "1" ? "var(--primary)" : "var(--foreground)"} strokeWidth={1.6} />
          ) : null,
        )}
        {grip.barre && (
          <rect x={x(grip.barre.from) - 8} y={y(grip.barre.fret) - 8} width={x(grip.barre.to) - x(grip.barre.from) + 16} height={16} rx={8} fill="var(--foreground)" opacity={0.18} />
        )}
        {grip.frets.map((f, s) => {
          if (f === null || f === 0) return null;
          const root = grip.degrees[s] === "1";
          const label = text(s);
          return (
            <g key={s}>
              {root ? <rect x={x(s) - 8} y={y(f) - 8} width={16} height={16} rx={3.5} fill="var(--primary)" /> : <circle cx={x(s)} cy={y(f)} r={8} fill="var(--foreground)" />}
              <text x={x(s)} y={y(f) + 3.4} fontSize={label.length > 2 ? 6.5 : 8.5} fontWeight={700} textAnchor="middle" fill={root ? "var(--primary-foreground)" : "var(--background)"}>{label}</text>
            </g>
          );
        })}
        {grip.frets.map((f, s) => f === 0 && (
          <text key={`o${s}`} x={x(s)} y={TOP + FH * frets + 15} fontSize={8} textAnchor="middle" fill="var(--muted-foreground)">{text(s)}</text>
        ))}
      </svg>
    </figure>
  );
}
