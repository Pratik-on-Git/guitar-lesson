import { degreeSemitones, parseDegree, prettyDegree } from "@/lib/music/theory";

const STEP_NAMES: Record<number, string> = { 1: "H", 2: "W", 3: "3H", 4: "2W", 5: "5H", 6: "6H" };

/*
 * A one-octave semitone ruler: 13 slots from the root to the octave, the
 * formula's members filled (root in brand), with each gap bracketed and named
 * underneath. Reads as both the intervallic and the melodic formula at once.
 */
export function IntervalRuler({ formula, notes, steps = "WH", title }: { formula: string[]; notes?: string[]; steps?: "WH" | "TS"; title?: string }) {
  const semis = formula.map((d) => degreeSemitones(parseDegree(d)));
  const members = [...semis, 12];
  const W = 30;
  const width = 13 * W;
  const top = notes ? 16 : 4;
  const height = top + 30 + 30;
  const cx = (s: number) => s * W + W / 2;
  const name = (n: number) => (steps === "TS" ? ({ 1: "S", 2: "T", 3: "TS" } as Record<number, string>)[n] ?? `${n}S` : STEP_NAMES[n] ?? `${n}H`);
  const label = title ?? `Formula ${formula.join(" ")}: steps ${members.slice(1).map((s, i) => name(s - members[i])).join(" ")}`;
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${width} ${height}`} className="h-auto w-full max-w-xl">
      <title>{label}</title>
      {Array.from({ length: 13 }, (_, s) => {
        const index = members.indexOf(s);
        const on = index >= 0;
        const root = s === 0 || s === 12;
        return (
          <g key={s}>
            {notes && on && <text x={cx(s)} y={11} fontSize={10} fontWeight={600} textAnchor="middle" fill="var(--foreground)">{notes[index % notes.length]}</text>}
            <rect x={s * W + 2} y={top} width={W - 4} height={24} rx={5} fill={root ? "var(--primary)" : on ? "var(--foreground)" : "var(--muted)"} />
            <text x={cx(s)} y={top + 16} fontSize={10.5} fontWeight={700} textAnchor="middle" fill={root ? "var(--primary-foreground)" : on ? "var(--background)" : "var(--muted-foreground)"} opacity={on ? 1 : 0.6}>
              {s === 12 ? "8" : on ? (formula[index] === "1" ? "R" : prettyDegree(formula[index])) : s}
            </text>
          </g>
        );
      })}
      {members.slice(1).map((s, i) => {
        const a = members[i];
        const size = s - a;
        const y = top + 32;
        return (
          <g key={s}>
            <path d={`M ${cx(a) + 3} ${y} v 5 H ${cx(s) - 3} v -5`} fill="none" stroke={size === 1 ? "var(--primary)" : size > 2 ? "var(--warning)" : "var(--muted-foreground)"} strokeWidth={1.5} />
            <text x={(cx(a) + cx(s)) / 2} y={y + 18} fontSize={10.5} fontWeight={600} textAnchor="middle" fill={size > 2 ? "var(--warning)" : "var(--foreground)"}>{name(size)}</text>
          </g>
        );
      })}
    </svg>
  );
}
