"use client";

import { Suspense } from "react";
import { HINDUSTANI_POSITIONS } from "@/lib/music/raga";
import { BarChart } from "./charts";
import { HindustaniSvaraExplorer } from "./hindustani-svara-explorer";
import { CarnaticSvaraExplorer } from "./carnatic-svara-explorer";
import { JanakaJanya, KafiComparison, RagaElements, RagaIdentity, SvaraComparison, ThaatExplorer } from "./raga-grammar";
import { KatapayadiChakras, MelakartaBuilder, MelakartaExplorer } from "./melakarta-study";
import { RagaCurriculum } from "./raga-curriculum";
import { RagaGuitar } from "@/components/music/raga-guitar";
import { RAGA_LESSONS } from "@/lib/content/raga-curriculum";
import { OrnamentExplorer } from "./raga-ornaments";
import { SourceSymbolism } from "./raga-symbolism";
import { CarnaticTalaExplorer, TeentalPractice } from "./raga-rhythm";
import { ListeningStudy } from "./raga-listening";
import { LISTENING_STUDIES, listeningSemitones } from "@/lib/music/raga-performance";

const RAGAS = LISTENING_STUDIES.map((study) => ({ name: study.name, pitches: listeningSemitones(study) }));

function RagaComparison() {
  return <div className="space-y-5">
    <h3 className="text-sm font-semibold">Which pitch positions does each raga use?</h3>
    <div className="overflow-x-auto rounded-lg border" tabIndex={0} role="region" aria-label="Raga pitch comparison, scroll horizontally"><table className="w-full min-w-[620px] text-center text-xs"><caption className="sr-only">Filled cells name included degrees; a dash marks an omitted pitch position.</caption><thead><tr><th scope="col" className="p-3 text-left">Raga</th>{HINDUSTANI_POSITIONS.map((note, i) => <th key={i} scope="col" className="p-2">{i}<span className="text-muted-foreground block font-normal">{note.western}</span></th>)}</tr></thead><tbody>{RAGAS.map((raga) => <tr key={raga.name}><th scope="row" className="p-3 text-left">{raga.name}</th>{HINDUSTANI_POSITIONS.map((note, i) => <td key={i} className="p-1">{raga.pitches.includes(i) ? <span className="block rounded bg-primary/15 p-2 font-semibold text-primary">{note.symbol}</span> : <span className="text-muted-foreground">—</span>}</td>)}</tr>)}</tbody></table></div>
    <BarChart title="Distinct pitch degrees per octave" unit="degrees" max={7} labelWidth="5rem" bars={RAGAS.map((raga) => ({ label: raga.name, value: raga.pitches.length }))} />
    <p className="text-muted-foreground text-xs">Sa = C for comparison. This shows note membership only, not characteristic phrases, resting points or ornaments. Upper Sa repeats the tonic and is not an extra degree.</p>
  </div>;
}

export const RAGA_VISUALS: Record<string, () => React.ReactNode> = {
  "raga-guitar": () => <Suspense fallback={<p className="text-sm text-muted-foreground">Loading guitar practice…</p>}><RagaGuitar /></Suspense>,
  ...Object.fromEntries(RAGA_LESSONS.filter((lesson) => lesson.guitar === "melody").map((lesson) => [`raga-guitar-${lesson.slug}`, () => <Suspense fallback={<p className="text-sm text-muted-foreground">Loading guitar practice…</p>}><RagaGuitar lesson={lesson.slug} /></Suspense>])),
  "raga-ornaments": () => <OrnamentExplorer />,
  "raga-source-symbolism": () => <SourceSymbolism />,
  "raga-listening-yaman": () => <ListeningStudy id="yaman" />,
  "raga-listening-durga": () => <ListeningStudy id="durga" />,
  "raga-listening-malkauns": () => <ListeningStudy id="malkauns" />,
  "hindustani-svara-explorer": () => <HindustaniSvaraExplorer />,
  "carnatic-svara-explorer": () => <CarnaticSvaraExplorer />,
  "raga-curriculum": () => <RagaCurriculum />,
  "raga-pitch-map": () => <SvaraComparison />,
  "raga-identity": () => <RagaIdentity />,
  "raga-kafi-comparison": () => <KafiComparison />,
  "raga-elements": () => <RagaElements />,
  "raga-thaats": () => <ThaatExplorer />,
  "raga-janaka-janya": () => <JanakaJanya />,
  "raga-melakarta-builder": () => <Suspense fallback={<p className="text-sm text-muted-foreground">Loading melakarta builder…</p>}><MelakartaBuilder /></Suspense>,
  "raga-katapayadi": () => <KatapayadiChakras />,
  "raga-melakarta-explorer": () => <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Loading the 72-melakarta explorer…</p>}><MelakartaExplorer /></Suspense>,
  "raga-comparison": () => <RagaComparison />,
  "raga-tala-chart": () => <CarnaticTalaExplorer />,
  "raga-teental": () => <TeentalPractice />,
};
