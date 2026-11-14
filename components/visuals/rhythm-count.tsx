"use client";

import { ScorePlayer } from "@/components/music/score-player";
import type { SoundEvent } from "@/lib/music/sound";
import { cn } from "@/lib/utils";

/*
 * Counting a bar: each beat with its spoken subdivisions, grouped under a bar
 * brace, the beat numbers emphasised. Optional callouts name what the
 * highlighted syllables are. A play button clicks the same grid.
 */
export function RhythmCount({
  time,
  beats,
  syllables,
  bars = 2,
  callout,
  highlight = "beats",
  beatUnit = "quarter notes",
  bpm = 72,
}: {
  time: [number, number];
  beats: number;
  /** Spoken syllables after the beat number, e.g. ["and"] or ["e", "+", "a"]. */
  syllables: string[];
  bars?: number;
  callout: string;
  highlight?: "beats" | "offbeats";
  beatUnit?: string;
  bpm?: number;
}) {
  const per = syllables.length + 1;
  const events: SoundEvent[] = [];
  for (let b = 0; b < bars; b++) for (let beat = 0; beat < beats; beat++) for (let s = 0; s < per; s++) {
    const at = (b * beats + beat) + s / per;
    const isBeat = s === 0;
    events.push({ at, duration: 0.06, midi: isBeat ? (beat === 0 ? 96 : 89) : 84, velocity: isBeat ? 0.09 : 0.04, wave: "triangle" });
  }
  return (
    <figure className="space-y-3">
      <div className="overflow-x-auto">
        <div className="flex min-w-[560px] items-stretch gap-3">
          <div className="text-muted-foreground flex flex-col items-center justify-center pr-1 font-serif text-xl leading-5 font-bold" aria-label={`Time signature ${time[0]}/${time[1]}`}>
            <span>{time[0]}</span><span>{time[1]}</span>
          </div>
          {Array.from({ length: bars }, (_, b) => (
            <div key={b} className="flex-1">
              <ol className="flex justify-between gap-1" aria-label={`Bar ${b + 1} count`}>
                {Array.from({ length: beats }, (_, beat) => (
                  <li key={beat} className="flex flex-1 justify-around gap-0.5">
                    {[String(beat + 1), ...syllables].map((s, i) => {
                      const on = highlight === "beats" ? i === 0 : i === per / 2 || (per === 2 && i === 1);
                      return <span key={i} className={cn("rounded-md px-1 py-1 text-center text-sm", on ? "bg-primary/12 text-primary font-bold" : "text-muted-foreground", i === 0 && "text-foreground text-base font-bold")}>{s}</span>;
                    })}
                  </li>
                ))}
              </ol>
              <div className="border-muted-foreground/60 mx-1 mt-1 h-2 rounded-b-md border-x-2 border-b-2" aria-hidden />
              <p className="mt-1 text-center text-sm font-medium">{b === 0 ? "1st" : b === 1 ? "2nd" : `${b + 1}th`} bar</p>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="text-muted-foreground text-xs">{callout} · beats are {beatUnit}.</figcaption>
      <ScorePlayer events={events} beats={bars * beats} bpm={bpm} label="Hear the count" />
    </figure>
  );
}
