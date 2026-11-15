/** Original guitar tasks applying the lesson's reviewed pitch/grammar data. */
export const GUITAR_LESSON_TASKS: Record<string, string[]> = {
  "hindustani-svaras": ["On one string, compare re/Re, ga/Ga, Ma/Ḿa, dha/Dha and ni/Ni. Each adjacent pair is one fret apart in this map.", "Change Sa, sing the new tonic and find the same relative positions again. A twelve-fret move repeats a pitch class an octave higher."],
  "carnatic-svaras": ["Locate R2/G1 and D2/N1. Two names at a shared position require the same fret at the same register.", "Choose a melakarta and follow its specific degree labels. A shared fret does not make the named degree or gamaka interchangeable."],
  "svara-comparison": ["Select Western labels, find the tonic, then switch back to svaras without moving your hand.", "Compare one-string interval distances with a route across strings. Recalculate across the G–B boundary using the diagram."],
  "what-is-raga": ["Play the Bhimpalasi ascent slowly, sing it, then compare the descent. Keep Re and Dha out of the displayed ascending outline.", "Choose a phrase in the cited rendition and imitate its arrivals and pauses before adding speed."],
  "raga-versus-scale": ["Compare the three taught outlines on the same Sa. Follow the complete Bageshree descending turn rather than sorting its notes into a straight scale.", "Use one string to hear intervals, then use the across-strings route for a compact fingering of the same sounding pitches."],
  "raga-elements": ["Find Ma, then return to Sa in the Bhimpalasi example. Keep the prominent note and tonic distinct.", "Make one deliberate pause at a taught resting note, then compare it with the source phrase. Finger placement alone does not establish nyasa."],
  thaats: ["Map Bilawal and Kafi at the same Sa. Compare the Ga and Ni fret locations while leaving the tonic fixed.", "Treat these as parent-collection exercises. Study the example raga’s permitted movement separately."],
  "janaka-and-janya": ["Map melakarta 29 as a parent-collection exercise, then locate its seven degrees in one neck region.", "Identify how a hypothetical omitted degree changes the fingering. Do not label that omission as a named janya without a teaching source."],
  "melakarta-construction": ["Build a scale above, then use its Play on guitar link or leave the guitar material on the lesson’s selected melakarta.", "Compare 28 and 64 at the same Sa: the Ma fret moves one semitone while the other sounding degrees stay fixed."],
  "katapayadi-and-chakras": ["Open a chakra member in the full chart, then use Play on guitar to carry that exact melakarta into the guitar lesson.", "Compare two members of one chakra on the same Sa; notice that the Ri–Ga–Ma part stays fixed while Dha–Ni changes."],
  "melakarta-chart": ["Start with the scale selected above, then choose another guitar practice material whenever you want to compare.", "Transpose Sa, then compare the one-string and across-strings routes. Keep all seven degrees and upper Sa in the scale drill."],
  "raga-guitar": ["Sing Sa, play the route with the tonic drone, then repeat it without playback.", "Record a short phrase imitation and compare pitch arrivals, articulation and pauses with a teacher’s rendition."],
};

export const GUITAR_REFERENCES = [
  { title: "Fender · Standard tuning and the G–B interval", href: "https://www.fender.com/articles/setup/standard-tuning-how-eadgbe-came-to-be" },
  { title: "Fender · Finger numbering, positions and shifts", href: "https://www.fender.com/articles/scales/blues-guitar-scale" },
  { title: "Berklee · Hammer-ons, pull-offs and finger slides", href: "https://online.berklee.edu/takenote/guitar-techniques-hammer-ons-pull-offs-and-slides/" },
  { title: "George Howlett · Survey of movable Sa locations", href: "https://ragajunglism.org/ragas/instruments/sa-survey/" },
];
