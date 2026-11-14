/*
 * Where each redrawn book figure, chart and Fretboard Concepts sheet appears
 * inside the lessons: topic → section → visual ids (see TheoryVisual).
 * Ids p…-… are Carter figures, sheet-… are Fretboard Concepts pages.
 */
export const LESSON_VISUALS: Record<string, Record<string, string[]>> = {
  "sound-and-pitch": { note: ["p16-1"] },
  notes: { "natural-notes": ["p15-1"], octave: ["p18-1"] },
  tuning: { ratios: ["chart-et-frequencies"], calculation: ["p20-1"], temperament: ["chart-just-vs-et"] },
  intervals: { "intervals-from-root": ["chart-interval-sizes"], qualities: ["p26-1"] },
  rhythm: { pulse: ["p153-1"], meter: ["p153-2", "p154-1"], "note-values": ["chart-durations"] },
  "rhythm-and-meter": { "simple-compound": ["p156-1"] },
  scales: { definition: ["p49-1", "p50-1", "p49-2"], sizes: ["chart-scale-sizes"], families: ["p89-1", "p89-2", "p53-1", "p52-1"], "double-note": ["sheet-28"] },
  modes: { "what-is-a-mode": ["p44-1", "p45-1"], diatonic: ["p66-1", "p67-1", "chart-mode-brightness"], "parent-scale": ["p73-1", "p79-1", "p80-1", "p82-1", "p87-1", "p88-1"], "find-notes": ["p51-1"] },
  chords: { "what-is-a-chord": ["p101-1", "p102-1"], "scale-degrees": ["p95-1", "p126-1"], extensions: ["p107-1", "p108-1"], symbols: ["p105-1", "p105-2"], numbers: ["p129-1", "p130-1", "p131-1", "p131-2"] },
  keys: { "reading-signatures": ["p93-1", "chart-key-signatures", "p218-1"], relative: ["p56-1"] },
  "extended-chords": { "stacking-thirds": ["p111-1"], alterations: ["p117-1", "p118-1", "p120-1"], "borrowed-altered": ["p123-1", "p123-2", "p123-3", "p124-1"] },
  "chord-structures": { slash: ["p137-1"], quartal: ["p125-1"], polychords: ["p140-1", "p141-1", "p141-2"] },
  harmonization: { "harmonic-formula": ["p126-2", "p128-2", "p127-1", "p128-1"] },
  "pentatonic-substitutions": { "parent-pentatonics": ["p36-1", "p38-1", "harmony-20", "harmony-21"] },
  "fretboard-system": { "double-note": ["sheet-28"] },
  voicings: { "root-shapes": ["sheet-59"], "drop-2": ["sheet-67"], "drop-3": ["sheet-75"] },
  arpeggios: { triads: ["sheet-83"], sevenths: ["sheet-87"] },
  "symmetric-scales": { "whole-tone": ["sheet-54"], augmented: ["sheet-55"], diminished: ["sheet-56"], "contained-chords": ["harmony-54", "harmony-55", "harmony-56", "harmony-57"] },
  improvisation: { "pentatonic-phrasing": ["sheet-21"] },
};

export const CHART_TITLES: Record<string, string> = {
  "chart-interval-sizes": "Chart · interval sizes",
  "chart-key-signatures": "Chart · key signatures round the circle",
  "chart-mode-brightness": "Chart · mode brightness",
  "chart-scale-sizes": "Chart · notes per scale",
  "chart-et-frequencies": "Chart · equal-tempered frequencies",
  "chart-just-vs-et": "Chart · equal versus just intervals",
  "chart-durations": "Chart · note values in one bar",
};
