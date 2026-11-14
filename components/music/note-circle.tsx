import { ROOTS, mod } from "@/lib/music/theory";

/*
 * The 12-note circle. With `pcs`, the scale's notes are joined into a
 * polygon, which is how the doc pictures a 7-note scale.
 */
export function NoteCircle({
  pcs,
  rootPc,
  title = "The 12 notes arranged in a circle",
  size = 280,
}: {
  pcs?: number[];
  rootPc?: number;
  title?: string;
  size?: number;
}) {
  const c = 150;
  const r = 104;
  const point = (pc: number, radius = r) => {
    const angle = ((pc * 30 - 90) * Math.PI) / 180;
    return [c + radius * Math.cos(angle), c + radius * Math.sin(angle)] as const;
  };
  const inScale = new Set(pcs ?? []);
  const polygon = pcs?.map((p) => point(p).join(",")).join(" ");

  return (
    <svg role="img" aria-label={title} viewBox="0 0 300 300" width={size} height={size} className="mx-auto h-auto max-w-full">
      <title>{title}</title>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--border)" strokeWidth={1.5} />
      {polygon && <polygon points={polygon} fill="var(--muted)" stroke="var(--foreground)" strokeWidth={1.5} strokeLinejoin="round" />}
      {ROOTS.map((root) => {
        const [x, y] = point(root.pc);
        const [lx, ly] = point(root.pc, r + 30);
        const active = !pcs || inScale.has(root.pc);
        const isRoot = rootPc !== undefined && mod(root.pc - rootPc, 12) === 0;
        return (
          <g key={root.pc}>
            {isRoot ? (
              <rect x={x - 8} y={y - 8} width={16} height={16} rx={3.5} fill="var(--foreground)" stroke="var(--color-ember)" strokeWidth={2.25} />
            ) : (
              <circle cx={x} cy={y} r={active ? 6 : 3.5} fill={active ? "var(--foreground)" : "var(--border)"} />
            )}
            <text
              x={lx}
              y={ly + 4}
              textAnchor="middle"
              fontSize={root.label.includes("/") ? 11.5 : 14}
              fontWeight={500}
              fill={active ? "var(--foreground)" : "var(--muted-foreground)"}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {root.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
