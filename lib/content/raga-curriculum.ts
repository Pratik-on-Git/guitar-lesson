/** Reading order shared by the sidebar, lesson links and course overview. */
export const RAGA_PARTS = [
  {
    title: "Pitch & svaras",
    description: "Start with the tonic and connect three naming systems.",
    lessons: [
      { slug: "hindustani-svaras", section: "hindustani-svaras", label: "Hindustani svaras", description: "Twelve positions and their fixed, shuddha, komal and tivra forms.", reading: "Forms, notation and the movable tonic", practice: ["Choose Sa, then locate Pa seven semitones above it.", "Compare shuddha Ma and tivra Ma, one semitone apart."] },
      { slug: "carnatic-svaras", section: "carnatic-svaras", label: "Carnatic svaras", description: "Sixteen names, twelve positions and four shared pairs.", reading: "Names, shared positions and spellings", practice: ["Select R2 / G1 and explain why D and E𝄫 occupy the same nominal position.", "Find D2 / N1 and compare A with B𝄫."] },
      { slug: "svara-comparison", section: "comparison", label: "Compare svara names", description: "Compare Carnatic, Hindustani and Western names at every pitch.", reading: "Reading across the naming systems", practice: ["Compare position 2: Hindustani Re, Carnatic R2 / G1, and Western D / E𝄫.", "Find both forms of Ma and explain why shuddha means different things in the two traditions."] },
    ],
  },
  {
    title: "Raga grammar & classification",
    description: "Move from a pitch collection to melodic behaviour and identity.",
    lessons: [
      { slug: "what-is-raga", section: "what-is-raga", label: "What a raga is", description: "Melodic identity, phrase grammar and ascending and descending jati.", reading: "Melodic identity and jati", practice: ["Set ascent to five degrees and descent to seven. Read the two jati names separately.", "Name two features a pitch list cannot show, such as phrase endings and ornamentation."] },
      { slug: "raga-versus-scale", section: "raga-vs-scale", label: "Raga versus scale", description: "Compare the movement of Bhimpalasi, Bageshree and Dhani.", reading: "Three Kafi-family teaching outlines", practice: ["Compare Re and Dha in Bhimpalasi’s ascent and descent.", "Select Bageshree and trace its descending turn through Pa. Compare it with Dhani’s pentatonic form."] },
      { slug: "raga-elements", section: "raga-elements", label: "Defining elements", description: "Movement, important notes, resting points and note treatment.", reading: "Terms that describe a raga", practice: ["Explain why Bhimpalasi’s vadi Ma does not replace Sa as the tonic.", "Distinguish a note that is omitted from one that is used sparingly or prolonged."] },
      { slug: "thaats", section: "classification", label: "History & ten thaats", description: "Historical classification lenses and the ten parent pitch collections.", reading: "Classification in its historical context", practice: ["Compare Bilawal with Kafi and identify the changed Ga and Ni forms.", "Choose a thaat and explain why its example raga needs more than a scale to describe it."] },
    ],
  },
  {
    title: "Carnatic ragas & melakarta",
    description: "Understand parent relationships, build the system, then explore all 72.",
    lessons: [
      { slug: "janaka-and-janya", section: "carnatic-raga", label: "Janaka & janya", description: "Parent and associated ragas, upanga and bhashanga.", reading: "Parent relationships and historical context", practice: ["Compare upanga and bhashanga: which may admit anya svaras?", "Explain why an omitted degree can leave more than one possible parent assignment."] },
      { slug: "melakarta-construction", section: "melakarta", label: "Build a melakarta", description: "Combine two Ma choices, six Ri–Ga pairs and six Dha–Ni pairs.", reading: "Rules of the modern sampurna scheme", practice: ["Build Harikambhoji with M1, R2 G3 and D2 N2.", "Keep both pairs fixed and change only Ma. Compare numbers 28 and 64."] },
      { slug: "katapayadi-and-chakras", section: "katapayadi", label: "Katapayadi & chakras", description: "Decode three documented names and explore the twelve groups of six.", reading: "Numbering, mnemonics and source corrections", practice: ["Follow ha = 8 and ri = 2, then reverse the digits to obtain 28.", "Select Vasu and locate the corrected D2 N3 combination in its sixth scale."] },
      { slug: "melakarta-chart", section: "melakarta-chart", label: "All 72 melakartas", description: "Search the corrected list and filter by chakra or madhyama.", reading: "Using the corrected reference chart", practice: ["Find Sarasangi 27 and Harikambhoji 28 in the corrected order.", "Compare Mechakalyani 65 with Dhirashankarabharanam 29. Only Ma changes."] },
    ],
  },
] as const;

export const RAGA_LESSONS = RAGA_PARTS.flatMap((part, index) =>
  part.lessons.map((lesson) => ({ ...lesson, part: `Part ${index + 1} · ${part.title}`, partIndex: index + 1 })),
);
