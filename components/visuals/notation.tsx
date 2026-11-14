"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Staff and tablature drawn with VexFlow (MIT), loaded only when a page shows
 * notation. Glyphs are SVG paths, recoloured to the theme's ink so notation
 * reads in light and dark mode. Keys are written "c#/4"; the accidental is
 * shown exactly as spelled.
 */

export type StaffNote = { keys: string[]; duration?: string; label?: string; tab?: { str: number; fret: number }[] };
export type NotationProps = {
  title: string;
  clef?: "treble" | "bass";
  time?: string;
  measures: StaffNote[][];
  /** Second staff in bass clef, same rhythm (grand staff). */
  bass?: StaffNote[][];
  withTab?: boolean;
  /** Beam consecutive eighths in each measure. */
  beam?: boolean;
  labelsBelow?: boolean;
  noteWidth?: number;
};

const ACC = /^([a-g])(bbs|bb|##|b|#|n)?\/(\d)$/;

export function Notation(props: NotationProps) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const { title } = props;
  useEffect(() => {
    let cancelled = false;
    const el = host.current;
    if (!el) return;
    import("vexflow/bravura")
      .then((VF) => {
        if (cancelled) return;
        el.innerHTML = "";
        draw(VF, el, props);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props)]);
  return (
    <div className="text-foreground overflow-x-auto">
      <div ref={host} role="img" aria-label={title} className="min-h-24 min-w-[520px] [&_svg]:h-auto [&_svg]:w-full" />
      {failed && <p className="text-muted-foreground text-sm">Notation could not be drawn in this browser. {title}.</p>}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function draw(VF: any, el: HTMLDivElement, { clef = "treble", time, measures, bass, withTab, beam, labelsBelow = true, noteWidth = 46 }: NotationProps) {
  const { Renderer, Stave, StaveNote, Accidental, Voice, Formatter, Beam, TabStave, TabNote, Annotation, StaveConnector } = VF;
  const lead = 70 + (time ? 24 : 0);
  const widths = measures.map((m) => Math.max(120, m.length * noteWidth + 24));
  const total = lead + widths.reduce((a, b) => a + b, 0) + 10;
  const staffGap = labelsBelow ? 115 : 95;
  const rows = 1 + (bass ? 1 : 0) + (withTab ? 1 : 0);
  const height = 30 + rows * staffGap + (withTab ? 10 : 0);
  const renderer = new Renderer(el, Renderer.Backends.SVG);
  renderer.resize(total, height);
  const ctx = renderer.getContext();
  ctx.setFillStyle("currentColor");
  ctx.setStrokeStyle("currentColor");

  const makeNotes = (measure: StaffNote[], staffClef: string, labels: boolean) =>
    measure.map((n) => {
      const note = new StaveNote({ clef: staffClef, keys: n.keys.map((k) => k.replace(ACC, "$1/$3").replace(/^([a-g])\//, "$1/")), duration: n.duration ?? "q", auto_stem: true });
      n.keys.forEach((k, i) => {
        const m = ACC.exec(k);
        if (m?.[2]) note.addModifier(new Accidental(m[2]), i);
      });
      if (labels && n.label) {
        const a = new Annotation(n.label).setFont("Inter, sans-serif", 11, "600");
        a.setVerticalJustification(Annotation.VerticalJustify.BOTTOM);
        note.addModifier(a, 0);
      }
      return note;
    });

  let x = 0;
  measures.forEach((measure, i) => {
    const first = i === 0;
    const w = widths[i] + (first ? lead : 0);
    const top = new Stave(x || 0, 10, w);
    if (first) { top.addClef(clef); if (time) top.addTimeSignature(time); }
    if (i === measures.length - 1) top.setEndBarType(VF.Barline.type.END);
    top.setContext(ctx).draw();
    const notes = makeNotes(measure, clef, labelsBelow && !withTab);
    const voices = [new Voice({ num_beats: 4, beat_value: 4 }).setMode(Voice.Mode.SOFT).addTickables(notes)];
    let low: unknown = null;
    let lowNotes: unknown[] = [];
    if (bass) {
      low = new Stave(x, 10 + staffGap, w);
      if (first) (low as { addClef: (c: string) => void }).addClef("bass");
      if (i === measures.length - 1) (low as { setEndBarType: (t: number) => void }).setEndBarType(VF.Barline.type.END);
      (low as { setContext: (c: unknown) => { draw: () => void } }).setContext(ctx).draw();
      lowNotes = makeNotes(bass[i], "bass", false);
      voices.push(new Voice({ num_beats: 4, beat_value: 4 }).setMode(Voice.Mode.SOFT).addTickables(lowNotes));
      if (first) new StaveConnector(top, low).setType(StaveConnector.type.BRACE).setContext(ctx).draw();
      new StaveConnector(top, low).setType(first ? StaveConnector.type.SINGLE_LEFT : StaveConnector.type.SINGLE_LEFT).setContext(ctx).draw();
    }
    let tab: unknown = null;
    let tabNotes: unknown[] = [];
    if (withTab) {
      tab = new TabStave(x, 10 + staffGap, w);
      if (first) (tab as { addClef: (c: string) => void }).addClef("tab");
      (tab as { setContext: (c: unknown) => { draw: () => void } }).setContext(ctx).draw();
      tabNotes = measure.map((n) => {
        const t = new TabNote({ positions: n.tab ?? [], duration: n.duration ?? "q" });
        if (n.label) {
          const a = new Annotation(n.label).setFont("Inter, sans-serif", 10.5, "600");
          a.setVerticalJustification(Annotation.VerticalJustify.BOTTOM);
          t.addModifier(a, 0);
        }
        return t;
      });
      voices.push(new Voice({ num_beats: 4, beat_value: 4 }).setMode(Voice.Mode.SOFT).addTickables(tabNotes));
      if (first) new StaveConnector(top, tab).setType(StaveConnector.type.SINGLE_LEFT).setContext(ctx).draw();
    }
    const formatter = new Formatter();
    formatter.joinVoices([voices[0]]);
    if (voices[1]) formatter.joinVoices([voices[1]]);
    if (voices[2]) formatter.joinVoices([voices[2]]);
    formatter.format(voices, w - (first ? lead : 0) - 24);
    const beams = beam ? Beam.generateBeams(notes) : [];
    voices[0].draw(ctx, top);
    if (bass && low) voices[1].draw(ctx, low);
    if (withTab && tab) voices[voices.length - 1].draw(ctx, tab);
    beams.forEach((b: { setContext: (c: unknown) => { draw: () => void } }) => b.setContext(ctx).draw());
    x += w;
  });
  const svg = el.querySelector("svg");
  if (svg) {
    svg.setAttribute("viewBox", `0 0 ${total} ${height}`);
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("aria-hidden", "true");
    svg.querySelectorAll("[fill='black'],[fill='#000'],[fill='#000000']").forEach((n) => n.setAttribute("fill", "currentColor"));
    svg.querySelectorAll("[stroke='black'],[stroke='#000'],[stroke='#000000']").forEach((n) => n.setAttribute("stroke", "currentColor"));
    svg.querySelectorAll("rect[fill='white'],rect[fill='#fff'],rect[fill='#FFF']").forEach((n) => n.setAttribute("fill", "var(--card)"));
  }
}
