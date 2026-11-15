"use client";

import { titleCaseLabel } from "@/lib/title-case";

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
    <div className="metronome-console">
      <div className="metronome-readout"><strong>{bpm}</strong><span>beats / minute</span></div>
      <div className="space-y-6">
        <label className="block text-sm font-medium">{titleCaseLabel(<>Find your tempo<input aria-label="Metronome tempo" type="range" min={30} max={240} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="mt-4 block w-full" /></>)}</label>
        <div className="flex items-center gap-2" aria-label={`Beat ${beat + 1} of 4`}>{[0, 1, 2, 3].map((i) => <span key={i} className="metronome-beat" data-active={running && beat === i}>{i + 1}</span>)}<span className="ml-2 text-xs text-muted-foreground">4/4 time</span></div>
      </div>
      <button type="button" className={buttonVariants({ variant: running ? "secondary" : "default", size: "lg" })} onClick={toggle}>{titleCaseLabel(<>{running ? "Stop metronome" : "Start metronome"}</>)}</button>
    </div>
    {error && <p role="status" className="mt-3 text-sm">{error}</p>}
  </Panel>;
}
