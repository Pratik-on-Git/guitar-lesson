"use client";

import { useEffect, useRef, useState } from "react";
import { Panel } from "@/components/app/panel";
import { buttonVariants } from "@/components/ui/button";

export function Metronome() {
  const [bpm, setBpm] = useState(72); const [running, setRunning] = useState(false); const [beat, setBeat] = useState(0); const [error, setError] = useState("");
  const context = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (!running || !context.current) return;
    const audio = context.current; let next = audio.currentTime + 0.04; let count = 0;
    const uiTimers = new Set<ReturnType<typeof setTimeout>>();
    const scheduler = setInterval(() => {
      while (next < audio.currentTime + 0.1) {
        const osc = audio.createOscillator(); const gain = audio.createGain(); const current = count % 4;
        osc.frequency.value = current === 0 ? 1200 : 800; gain.gain.setValueAtTime(0.12, next); gain.gain.exponentialRampToValueAtTime(0.001, next + 0.045);
        osc.connect(gain); gain.connect(audio.destination); osc.start(next); osc.stop(next + 0.05);
        const timer = setTimeout(() => { setBeat(current); uiTimers.delete(timer); }, Math.max(0, (next - audio.currentTime) * 1000)); uiTimers.add(timer);
        next += 60 / bpm; count++;
      }
    }, 25);
    return () => { clearInterval(scheduler); uiTimers.forEach(clearTimeout); };
  }, [running, bpm]);
  useEffect(() => () => { void context.current?.close().catch(() => {}); }, []);
  async function toggle() {
    if (running) { setRunning(false); void context.current?.close().catch(() => {}); context.current = null; return; }
    try { context.current = new AudioContext(); await context.current.resume(); setError(""); setRunning(true); }
    catch { setError("Metronome audio is unavailable in this browser."); }
  }
  return <Panel title="Practice metronome" description="Four quarter-note beats per bar, with an accent on beat 1. Count straight eighths or three equal triplet notes within each click.">
    <div className="flex flex-wrap items-center gap-5"><label className="text-sm font-medium">Tempo · {bpm} BPM<input aria-label="Metronome tempo" type="range" min={30} max={240} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="mt-3 block w-52 max-w-full accent-primary" /></label><button type="button" className={buttonVariants({ variant: running ? "secondary" : "default" })} onClick={toggle}>{running ? "Stop metronome" : "Start metronome"}</button><div className="flex gap-2" aria-label={`Beat ${beat + 1} of 4`}>{[0, 1, 2, 3].map((i) => <span key={i} className={`grid size-8 place-items-center rounded-full border text-xs ${running && beat === i ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{i + 1}</span>)}</div></div>
    {error && <p role="status" className="mt-3 text-sm">{error}</p>}
  </Panel>;
}
