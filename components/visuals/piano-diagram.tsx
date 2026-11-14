/*
 * Keyboard figures in the book's style: marked keys carry a note name and an
 * interval below it, and an optional bracket rail joins the marked keys with
 * their step sizes (T = tone, S = semitone, TS = tone + semitone).
 */

export type PianoMark = { name?: string; sub?: string; root?: boolean };

const WHITE = new Set([0, 2, 4, 5, 7, 9, 11]);
const W = 40;
const H = 150;
const BW = 24;
const BH = 92;

export function stepName(size: number) {
  return ({ 1: "S", 2: "T", 3: "TS" } as Record<number, string>)[size] ?? `${size}S`;
}

export function PianoDiagram({
  start = 0,
  length = 24,
  marks = {},
  steps = false,
  keyNames,
  title,
}: {
  /** First key in semitones above C; must be a white key. */
  start?: number;
  length?: number;
  marks?: Record<number, PianoMark>;
  steps?: boolean;
  /** Name every key (white at the bottom, black inside). */
  keyNames?: (semi: number) => string | undefined;
  title: string;
}) {
  const keys = Array.from({ length: length + 1 }, (_, i) => start + i);
  const whites = keys.filter((k) => WHITE.has(((k % 12) + 12) % 12));
  const index = new Map(whites.map((k, i) => [k, i]));
  const xw = (k: number) => 2 + (index.get(k) ?? 0) * W;
  const center = (k: number) => (WHITE.has(((k % 12) + 12) % 12) ? xw(k) + W / 2 : xw(k + 1));
  const marked = Object.keys(marks).map(Number).sort((a, b) => a - b);
  const width = whites.length * W + 4;
  const rail = H + 26;
  const height = steps ? rail + 30 : H + 6;
  return (
    <svg role="img" aria-label={title} viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      <title>{title}</title>
      {whites.map((k) => {
        const m = marks[k];
        return (
          <g key={k}>
            <rect x={xw(k)} y={2} width={W} height={H} rx={4} fill={m ? (m.root ? "color-mix(in oklch, var(--primary) 22%, var(--card))" : "color-mix(in oklch, var(--primary) 9%, var(--card))") : "var(--card)"} stroke="var(--border)" strokeWidth={1.5} />
            {m?.name && <text x={xw(k) + W / 2} y={H - 30} fontSize={15} fontWeight={700} textAnchor="middle" fill={m.root ? "var(--primary)" : "var(--foreground)"}>{m.name}</text>}
            {m?.sub && <text x={xw(k) + W / 2} y={H - 13} fontSize={11} textAnchor="middle" fill="var(--muted-foreground)">{m.sub}</text>}
            {!m && keyNames?.(k) && <text x={xw(k) + W / 2} y={H - 14} fontSize={13} fontWeight={600} textAnchor="middle" fill="var(--foreground)">{keyNames(k)}</text>}
          </g>
        );
      })}
      {keys.filter((k) => !WHITE.has(((k % 12) + 12) % 12) && index.has(k + 1) && index.has(k - 1)).map((k) => {
        const m = marks[k];
        const name = m?.name ?? keyNames?.(k);
        return (
          <g key={k}>
            <rect x={center(k) - BW / 2} y={2} width={BW} height={BH} rx={3} fill={m ? (m.root ? "var(--primary)" : "color-mix(in oklch, var(--primary) 55%, var(--foreground))") : "var(--foreground)"} />
            {name && name.split("/").map((part, i) => (
              <text key={part} x={center(k)} y={BH - 28 + i * 13} fontSize={10} fontWeight={700} textAnchor="middle" fill="var(--background)">{part}</text>
            ))}
            {m?.sub && <text x={center(k)} y={BH - 2 - 4} fontSize={8} textAnchor="middle" fill="var(--background)">{m.sub}</text>}
          </g>
        );
      })}
      {steps && marked.length > 1 && (
        <g>
          {marked.map((k) => (
            <g key={k}>
              <line x1={center(k)} x2={center(k)} y1={(WHITE.has(((k % 12) + 12) % 12) ? H : BH) + 6} y2={rail} stroke="var(--foreground)" strokeWidth={1.4} />
              <path d={`M ${center(k) - 4} ${(WHITE.has(((k % 12) + 12) % 12) ? H : BH) + 11} L ${center(k)} ${(WHITE.has(((k % 12) + 12) % 12) ? H : BH) + 4} L ${center(k) + 4} ${(WHITE.has(((k % 12) + 12) % 12) ? H : BH) + 11}`} fill="none" stroke="var(--foreground)" strokeWidth={1.4} />
            </g>
          ))}
          <line x1={center(marked[0])} x2={center(marked.at(-1)!)} y1={rail} y2={rail} stroke="var(--foreground)" strokeWidth={1.4} />
          {marked.slice(1).map((k, i) => {
            const size = k - marked[i];
            return <text key={k} x={(center(k) + center(marked[i])) / 2} y={rail + 19} fontSize={13} fontWeight={600} textAnchor="middle" fill={size === 1 ? "var(--primary)" : size > 2 ? "var(--warning)" : "var(--foreground)"}>{stepName(size)}</text>;
          })}
        </g>
      )}
    </svg>
  );
}

/** The full 88-key range, A0–C8, with scientific octave numbers and two landmarks. */
export function PianoRange() {
  const first = 21; // A0
  const last = 108; // C8
  const kw = 11;
  const midis = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  const whites = midis.filter((m) => WHITE.has(m % 12));
  const xi = new Map(whites.map((m, i) => [m, i * kw + 2]));
  const width = whites.length * kw + 4;
  const top = 26;
  const kh = 70;
  const highlight = new Map([[60, "middle C · C4"], [69, "A4 · 440 Hz"]]);
  const octave = (n: number) => whites.filter((m) => Math.floor(m / 12) - 1 === n);
  return (
    <svg role="img" aria-label="88-key piano from A0 to C8. Octave numbers change at each C; middle C is C4 and the tuning A above it is A4 at 440 hertz." viewBox={`0 0 ${width} ${top + kh + 46}`} className="h-auto w-full min-w-[640px]">
      {whites.map((m) => (
        <rect key={m} x={xi.get(m)} y={top} width={kw} height={kh} fill={highlight.has(m) ? "color-mix(in oklch, var(--primary) 35%, var(--card))" : "var(--card)"} stroke="var(--border)" />
      ))}
      {midis.filter((m) => !WHITE.has(m % 12)).map((m) => (
        <rect key={m} x={(xi.get(m + 1) ?? 0) - 3.5} y={top} width={7} height={kh * 0.62} rx={1} fill="var(--foreground)" />
      ))}
      {whites.filter((m) => m % 12 === 0).map((m) => (
        <text key={m} x={(xi.get(m) ?? 0) + kw / 2} y={top + kh - 6} fontSize={6.5} fontWeight={700} textAnchor="middle" fill="var(--muted-foreground)">C{m / 12 - 1}</text>
      ))}
      {Array.from({ length: 9 }, (_, n) => {
        const keys = octave(n);
        if (!keys.length) return null;
        const x0 = xi.get(keys[0])!;
        const x1 = xi.get(keys.at(-1)!)! + kw;
        const above = n % 2 === 0;
        const y = above ? top - 6 : top + kh + 8;
        return (
          <g key={n} stroke="var(--muted-foreground)" fill="none">
            <path d={above ? `M ${x0 + 1} ${y + 4} v -4 H ${x1 - 1} v 4` : `M ${x0 + 1} ${y - 4} v 4 H ${x1 - 1} v -4`} strokeWidth={1} />
            <text x={(x0 + x1) / 2} y={above ? y - 4 : y + 12} fontSize={10} fontWeight={700} textAnchor="middle" fill="var(--foreground)" stroke="none">{n}</text>
          </g>
        );
      })}
      {[...highlight].map(([m, label], i) => (
        <text key={m} x={(xi.get(m) ?? 0) + kw / 2} y={top + kh + 34} fontSize={8.5} fontWeight={700} textAnchor={i ? "start" : "end"} fill="var(--primary)">{label}</text>
      ))}
    </svg>
  );
}
