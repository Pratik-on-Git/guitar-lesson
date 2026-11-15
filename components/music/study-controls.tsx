"use client";

import { titleCase, titleCaseLabel } from "@/lib/title-case";

import { useEffect, useId, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StudySelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  const id = useId();
  const items = options.map(option => ({ ...option, label: titleCase(option.label) }));
  return <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm font-medium">
    <label htmlFor={id}>{titleCaseLabel(<>{label}</>)}</label>
    <Select items={items} value={value} onValueChange={(next) => { if (next !== null) onChange(next); }}>
      <SelectTrigger id={id} className="w-full min-w-0"><SelectValue /></SelectTrigger>
      <SelectContent alignItemWithTrigger={false}><SelectGroup>{items.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent>
    </Select>
  </div>;
}

/** User-triggered, finite Web Audio playback. Oscillators and contexts are cleaned up. */
export function PlayNotes({ midis, label = "Play notes", simultaneous = false }: { midis: number[]; label?: string; simultaneous?: boolean }) {
  const active = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const stop = () => { clearTimeout(timer.current); void active.current?.close().catch(() => {}); active.current = null; setPlaying(false); };
  useEffect(() => () => { clearTimeout(timer.current); void active.current?.close().catch(() => {}); }, []);
  async function play() {
    stop();
    try {
      const context = new AudioContext(); active.current = context;
      await context.resume();
      if (active.current !== context) return;
      setError(""); setPlaying(true);
      midis.forEach((midi, i) => {
        const start = context.currentTime + 0.04 + (simultaneous ? 0 : i * 0.32);
        const length = simultaneous ? 1.6 : 0.28;
        const osc = context.createOscillator(); const gain = context.createGain();
        osc.type = "triangle"; osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);
        gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(simultaneous ? 0.12 / Math.sqrt(midis.length) : 0.12, start + 0.015); gain.gain.exponentialRampToValueAtTime(0.001, start + length);
        osc.connect(gain); gain.connect(context.destination); osc.start(start); osc.stop(start + length + 0.02);
      });
      timer.current = setTimeout(stop, (simultaneous ? 1.8 : midis.length * 0.32 + 0.2) * 1000);
    } catch { setError("Audio is unavailable in this browser. The note sequence is shown below."); stop(); }
  }
  return <div className="space-y-2"><button type="button" onClick={playing ? stop : play} className={buttonVariants({ variant: "outline", size: "sm" })}>{titleCaseLabel(<>{playing ? "Stop playback" : label}</>)}</button>{error && <p role="status" className="text-sm text-muted-foreground">{error}</p>}</div>;
}
