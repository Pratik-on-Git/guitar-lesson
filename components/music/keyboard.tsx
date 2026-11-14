"use client";

/*
 * Piano keyboard diagram. Keys are addressed in semitones from the first C
 * drawn. Marked keys get a dot (root boxed, like the fretboard) and an
 * optional caption under the keyboard.
 */

export type KeyMark = { label: string; caption?: string; root?: boolean };

const WHITE_PCS = new Set([0, 2, 4, 5, 7, 9, 11]);
const SIZES = {
  md: { w: 32, h: 128, bw: 19, bh: 80, dot: 10.5, font: 10.5 },
  sm: { w: 12, h: 58, bw: 8, bh: 36, dot: 0, font: 9 },
};

export function Keyboard({
  start = 0,
  length = 24,
  marks = {},
  keyNames,
  size = "md",
  title,
  minWidth,
}: {
  /** First key, in semitones above C (must be a white key). */
  start?: number;
  /** Semitones to draw after the first key (24 = two octaves). */
  length?: number;
  marks?: Record<number, KeyMark>;
  /** Name printed on a key (white: bottom, black: inside). */
  keyNames?: (semi: number) => string | undefined;
  size?: keyof typeof SIZES;
  title: string;
  minWidth?: number;
}) {
  const s = SIZES[size];
  const keys = Array.from({ length: length + 1 }, (_, i) => start + i);
  const whites = keys.filter((k) => WHITE_PCS.has(k % 12));
  const whiteIndex = new Map(whites.map((k, i) => [k, i]));
  const hasCaptions = Object.values(marks).some((m) => m.caption);
  const width = whites.length * s.w + 2;
  // Black-key captions sit on a second row so neighbours never collide.
  const height = s.h + (hasCaptions ? 44 : 0) + 2;

  const xWhite = (k: number) => 1 + (whiteIndex.get(k) ?? 0) * s.w;
  const xBlackCenter = (k: number) => 1 + (whiteIndex.get(k + 1) ?? 0) * s.w;
  const centerOf = (k: number) => (WHITE_PCS.has(k % 12) ? xWhite(k) + s.w / 2 : xBlackCenter(k));

  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <svg
        role="img"
        aria-label={title}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full select-none"
        style={{ fontFamily: "var(--font-sans)", minWidth: minWidth ?? Math.min(width, 520) }}
      >
        <title>{title}</title>
        {whites.map((k) => (
          <g key={k}>
            <rect
              x={xWhite(k)}
              y={1}
              width={s.w}
              height={s.h}
              rx={size === "md" ? 4 : 1.5}
              fill={marks[k] ? "var(--muted)" : "var(--card)"}
              stroke="var(--muted-foreground)"
              strokeOpacity={0.6}
              strokeWidth={1}
            />
            {keyNames?.(k) && (
              <text
                x={xWhite(k) + s.w / 2}
                y={s.h - (marks[k] && s.dot ? 2 * s.dot + 14 : 9)}
                fontSize={s.font}
                fontWeight={500}
                textAnchor="middle"
                fill="var(--foreground)"
              >
                {keyNames(k)}
              </text>
            )}
          </g>
        ))}
        {keys
          .filter((k) => !WHITE_PCS.has(k % 12) && whiteIndex.has(k + 1))
          .map((k) => (
            <g key={k}>
              <rect
                x={xBlackCenter(k) - s.bw / 2}
                y={1}
                width={s.bw}
                height={s.bh}
                rx={size === "md" ? 3 : 1}
                fill="var(--foreground)"
                fillOpacity={marks[k] ? 0.72 : 1}
              />
              {keyNames?.(k) && size === "md" && (
                <text
                  x={xBlackCenter(k)}
                  y={s.bh - (marks[k] ? 2 * s.dot + 12 : 22)}
                  fontSize={8.5}
                  fontWeight={600}
                  textAnchor="middle"
                  fill="var(--background)"
                >
                  {keyNames(k)
                    ?.split("/")
                    .map((part, i) => (
                      <tspan key={part} x={xBlackCenter(k)} dy={i === 0 ? 0 : 10}>
                        {part}
                      </tspan>
                    ))}
                </text>
              )}
            </g>
          ))}
        {s.dot > 0 &&
          Object.entries(marks).map(([key, mark]) => {
            const k = Number(key);
            const white = WHITE_PCS.has(k % 12);
            const cx = centerOf(k);
            const cy = white ? s.h - s.dot - 6 : s.bh - s.dot - 5;
            return (
              <g key={k}>
                {mark.root ? (
                  <rect
                    x={cx - s.dot}
                    y={cy - s.dot}
                    width={s.dot * 2}
                    height={s.dot * 2}
                    rx={3.5}
                    fill={white ? "var(--foreground)" : "var(--background)"}
                    stroke="var(--color-ember)"
                    strokeWidth={2.25}
                  />
                ) : (
                  <circle cx={cx} cy={cy} r={s.dot} fill={white ? "var(--foreground)" : "var(--background)"} />
                )}
                <text
                  x={cx}
                  y={cy + 3.6}
                  fontSize={mark.label.length > 2 ? 8.5 : s.font}
                  fontWeight={600}
                  textAnchor="middle"
                  fill={white ? "var(--background)" : "var(--foreground)"}
                >
                  {mark.label}
                </text>
                {mark.caption && (
                  <text x={cx} y={s.h + (white ? 18 : 36)} fontSize={12} fontWeight={500} textAnchor="middle" fill="var(--foreground)">
                    {mark.caption}
                  </text>
                )}
              </g>
            );
          })}
      </svg>
    </div>
  );
}
