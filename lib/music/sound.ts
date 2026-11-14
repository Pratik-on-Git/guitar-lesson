export type SoundEvent = { at: number; duration: number; midi?: number; frequency?: number; velocity?: number; wave?: "sine" | "triangle" | "sawtooth"; pan?: number };
export const midiFrequency = (midi: number, reference = 440) => reference * 2 ** ((midi - 69) / 12);
export const centsFrequency = (frequency: number, cents: number) => frequency * 2 ** (cents / 1200);
export const centsBetween = (reference: number, frequency: number) => 1200 * Math.log2(frequency / reference);
