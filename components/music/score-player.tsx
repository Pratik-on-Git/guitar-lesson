"use client";
import { useEffect, useRef, useState } from "react";
import { midiFrequency, type SoundEvent } from "@/lib/music/sound";
import { buttonVariants } from "@/components/ui/button";

/** Finite, gesture-started playback shared by the new labs; timing uses the audio clock. */
export function ScorePlayer({ events, beats, bpm = 72, label = "Play example" }: { events: SoundEvent[]; beats: number; bpm?: number; label?: string }) {
  const audio = useRef<AudioContext | null>(null); const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false); const [progress, setProgress] = useState(0); const [error, setError] = useState("");
  function stop() { if (timer.current) clearInterval(timer.current); timer.current = null; const context = audio.current; audio.current = null; if (context) void context.close().catch(() => {}); setPlaying(false); setProgress(0); }
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); const context = audio.current; audio.current = null; if (context) void context.close().catch(() => {}); }, []);
  async function play() {
    stop();
    try {
      const context = new AudioContext(); audio.current = context; await context.resume(); if (audio.current !== context) return;
      const secondPerBeat = 60 / bpm; const start = context.currentTime + 0.08; const length = beats * secondPerBeat;
      for (const event of events) {
        const osc = context.createOscillator(); const gain = context.createGain(); const pan = context.createStereoPanner();
        const at = start + event.at * secondPerBeat; const duration = Math.max(0.025, event.duration * secondPerBeat);
        osc.type = event.wave ?? "triangle"; osc.frequency.value = event.frequency ?? midiFrequency(event.midi ?? 60);
        const volume = Math.max(0.001, Math.min(0.12, event.velocity ?? 0.055)); const attack = Math.min(0.015, duration / 4);
        gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(volume, at + attack); gain.gain.setValueAtTime(volume, at + Math.max(attack, duration - 0.025)); gain.gain.linearRampToValueAtTime(0, at + duration);
        pan.pan.value = event.pan ?? 0; osc.connect(gain); gain.connect(pan); pan.connect(context.destination); osc.start(at); osc.stop(at + duration + 0.01);
      }
      setError(""); setPlaying(true);
      timer.current = setInterval(() => { const elapsed = context.currentTime - start; setProgress(Math.max(0, Math.min(1, elapsed / length))); if (elapsed > length + 0.12) stop(); }, 80);
    } catch { setError("Audio is unavailable in this browser. Use the visible timing and note tables to study the example."); stop(); }
  }
  return <div className="flex flex-wrap items-center gap-3"><button type="button" className={buttonVariants({ variant: playing ? "secondary" : "outline" })} disabled={!events.length} onClick={playing ? stop : play}>{playing ? "Stop example" : label}</button>{playing && <progress aria-label="Playback progress" max={1} value={progress} className="h-2 w-32 accent-primary" />}{error && <p role="status" className="w-full text-sm text-muted-foreground">{error}</p>}</div>;
}
