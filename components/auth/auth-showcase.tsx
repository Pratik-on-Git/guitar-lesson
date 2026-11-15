"use client";

import { BookOpen, Guitar, ListMusic, Music2, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/app/brand";
import type { CSSProperties, PointerEvent } from "react";

function spotlight(event: PointerEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - bounds.top}px`);
}

export function AuthShowcase() {
  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--tilt-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 2}`);
    event.currentTarget.style.setProperty("--tilt-y", `${((event.clientY - bounds.top) / bounds.height - .5) * 2}`);
  }
  return <section className="auth-story" aria-label="Welcome to Guitar Notes">
    <div className="auth-brand"><BrandMark /><span>Guitar Notes</span></div>
    <div className="auth-showcase-content">
      <div className="auth-showcase-heading"><span className="auth-eyebrow"><span />Your guitar study companion</span><h2>Find your sound.<br />Build your confidence.</h2><p>A little theory, focused practice, and a new way to hear the music. Your next chapter starts here.</p></div>
      <div className="auth-showcase-grid" onPointerMove={tilt} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--tilt-x", "0"); event.currentTarget.style.setProperty("--tilt-y", "0"); }}>
        <div className="auth-demo-card auth-demo-studio" onPointerMove={spotlight}>
          <div className="auth-demo-studio-header"><span className="auth-demo-icon"><Guitar aria-hidden /></span><div><h3>Practice studio</h3><p>Find your focus. Make it music.</p></div><span className="auth-demo-badge"><i />Preview<span>72 BPM</span></span></div>
          <div className="auth-demo-player"><div className="auth-demo-wave" aria-hidden>{Array.from({ length: 22 }, (_, i) => <span key={i} style={{ "--wave-delay": `${i * -137}ms`, "--wave-duration": `${900 + (i * 53) % 500}ms`, height: `${35 + (i * 29) % 66}%` } as CSSProperties} />)}</div><div><p className="auth-demo-caption">A little practice</p><p>One phrase. Every possibility.</p></div></div>
        </div>
        <div className="auth-demo-card" onPointerMove={spotlight}>
          <span className="auth-demo-icon"><Sparkles aria-hidden /></span><h3>Connect the notes</h3><p>See how theory, scales, and chords fit together.</p>
          <div className="auth-demo-map" aria-hidden><span className="auth-demo-source"><BookOpen /></span><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 50 C50 50 50 14 100 14 M0 50 H100 M0 50 C50 50 50 86 100 86" /><path className="auth-demo-packet" d="M0 50 C50 50 50 14 100 14 M0 50 H100 M0 50 C50 50 50 86 100 86" pathLength="1" /></svg><div>{["Theory", "Scales", "Chords"].map((label) => <span key={label}><i />{label}</span>)}</div></div>
        </div>
        <div className="auth-demo-card" onPointerMove={spotlight}>
          <span className="auth-demo-icon"><ListMusic aria-hidden /></span><h3>Build your rhythm</h3><p>Make small sessions part of your everyday.</p>
          <div className="auth-demo-chart" aria-hidden>{[62, 88, 74, 94, 70, 83].map((height, i) => <span key={i}><i style={{ height: `${height}%`, "--bar-delay": `${i * 100}ms` } as CSSProperties} /></span>)}</div>
          <div className="auth-demo-chart-caption"><Music2 aria-hidden /><span>One session at a time</span></div>
        </div>
      </div>
    </div>
    <p className="auth-story-footer">Listen. Learn. Play.</p>
  </section>;
}
