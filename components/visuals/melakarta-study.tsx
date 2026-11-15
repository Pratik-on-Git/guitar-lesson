"use client";

import { startTransition, useOptimistic, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowRightLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { useQueryState } from "@/lib/use-query-state";
import { CHAKRAS, DHA_NI, MELAKARTAS, RI_GA } from "@/lib/music/raga";
import { KATAPAYADI_EXAMPLES } from "@/lib/music/raga-studies";
import { NoteChips, StudyIntro } from "./raga-grammar";
import styles from "./raga-study.module.css";

type Melakarta = (typeof MELAKARTAS)[number];

function MelakartaDetail({ mela }: { mela: Melakarta }) {
  return <div className={`${styles.surface} ${styles.detail}`} aria-live="polite" aria-atomic="true">
    <div className={styles.intro}><div><span className={styles.eyebrow}>Melakarta {mela.number} · {mela.chakra} chakra</span><h4>{mela.name}</h4></div><span className={styles.badge}>{mela.number <= 36 ? "M1 · shuddha Ma" : "M2 · prati Ma"}</span></div>
    <NoteChips notes={mela.svaras} western={mela.western} />
    <p><strong>Ascent:</strong> {mela.svaras.join(" → ")} → S′<br /><strong>Descent:</strong> S′ → {[...mela.svaras].reverse().join(" → ")}</p>
    <p className={styles.muted}>Sa = C for the Western comparison. Upper S repeats the tonic; note membership does not encode gamaka or full melodic grammar.</p>
    <Link className={styles.link} href={`/learn/raga-guitar?study=melakarta-${mela.number}#guitar-application`}>Play {mela.name} on guitar <ArrowRight size={15} aria-hidden /></Link>
  </div>;
}

export function MelakartaBuilder() {
  const [melaValue, setMelaQuery] = useQueryState("mela", "1");
  const [optimisticMela, setOptimisticMela] = useOptimistic(melaValue);
  function setMela(value: string) {
    startTransition(() => {
      setOptimisticMela(value);
      setMelaQuery(value);
    });
  }
  const index = MELAKARTAS.some((item) => item.number === Number(optimisticMela)) ? Number(optimisticMela) - 1 : 0;
  const ma = Math.floor(index / 36);
  const riGa = Math.floor(index % 36 / 6);
  const dhaNi = index % 6;
  const mela = MELAKARTAS[ma * 36 + riGa * 6 + dhaNi];
  return <div className={styles.study}>
    <StudyIntro title="Build one of the 72" text="Choose Ma and two ordered pairs. Every allowed combination maps to exactly one melakarta in the modern sampurna scheme." />
    <div className={styles.flow}>{[["2", "Ma choices"], ["×", ""], ["6", "Ri–Ga pairs"], ["×", ""], ["6", "Dha–Ni pairs"], ["=", ""], ["72", "melakartas"]].map(([value, label], i) => label ? <div className={styles.factor} key={i}><strong>{value}</strong><small>{label}</small></div> : <span className={styles.arrow} key={i}>{value}</span>)}</div>
    <div className={styles.controls}>
      <label className={styles.field}>Madhyama<select value={ma} onChange={(e) => setMela(String(Number(e.target.value) * 36 + riGa * 6 + dhaNi + 1))}><option value="0">M1 · numbers 1–36</option><option value="1">M2 · numbers 37–72</option></select></label>
      <label className={styles.field}>Ri–Ga pair<select value={riGa} onChange={(e) => setMela(String(ma * 36 + Number(e.target.value) * 6 + dhaNi + 1))}>{RI_GA.map((pair, i) => <option key={i} value={i}>{pair.join(" ")}</option>)}</select></label>
      <label className={styles.field}>Dha–Ni pair<select value={dhaNi} onChange={(e) => setMela(String(ma * 36 + riGa * 6 + Number(e.target.value) + 1))}>{DHA_NI.map((pair, i) => <option key={i} value={i}>{pair.join(" ")}</option>)}</select></label>
    </div>
    <MelakartaDetail mela={mela} />
    <div className={styles.grid2}><div className={styles.card}><span className={styles.eyebrow}>Fixed anchors</span><h4>S and P stay in place</h4><p>All seven degrees appear in the same straight ascending and descending collection.</p></div><div className={styles.card}><span className={styles.eyebrow}>Matching half</span><h4>{ma === 0 ? mela.number + 36 : mela.number - 36} · {MELAKARTAS[ma === 0 ? mela.number + 35 : mela.number - 37].name}</h4><p>Change only Ma; the number moves by 36.</p></div></div>
    <p className={styles.note}>Ri must lie below Ga, and Dha below Ni. Shared-position pairs such as R2 G1 and D2 N1 cannot supply successive degrees in a straight scale.</p>
    <Link className={styles.link} href={`/learn/melakarta-chart?mela=${mela.number}#melakarta-chart`}>Find {mela.name} in the complete chart <ArrowRight size={15} aria-hidden /></Link>
  </div>;
}

export function KatapayadiChakras() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [chakraIndex, setChakraIndex] = useState(Math.floor((KATAPAYADI_EXAMPLES[0].number - 1) / 6));
  const example = KATAPAYADI_EXAMPLES[exampleIndex];
  const chakra = CHAKRAS[chakraIndex];
  const scales = MELAKARTAS.slice(chakraIndex * 6, chakraIndex * 6 + 6);
  return <div className={styles.study}>
    <StudyIntro title="Decode a name, then locate its group" text="Follow the first two encoded consonant digits in these documented examples. Reverse their order to read the melakarta number." badge="12 chakras × 6 scales" />
    <label className={styles.field}>Documented Katapayadi example<select value={exampleIndex} onChange={(e) => {
      const index = Number(e.target.value);
      setExampleIndex(index);
      setChakraIndex(Math.floor((KATAPAYADI_EXAMPLES[index].number - 1) / 6));
    }}>{KATAPAYADI_EXAMPLES.map((item, i) => <option key={item.name} value={i}>{item.name}</option>)}</select></label>
    <div className={styles.surface} aria-live="polite"><div className={styles.flow}><div className={styles.factor}><small>{example.first}</small><strong>{example.firstDigit}</strong></div><div className={styles.factor}><small>{example.second}</small><strong>{example.secondDigit}</strong></div><ArrowRightLeft aria-label="Reverse the two digits" className={styles.arrow} size={22} /><div className={styles.factor}><small>Melakarta number</small><strong>{example.number}</strong></div></div><p className={`${styles.muted} mt-3 text-center`}>{example.name} · {MELAKARTAS[example.number - 1].chakra} chakra</p></div>
    <p className={styles.note}>Vowels have no value, and the exact consonants matter. Mechakalyani uses unaspirated ca, often written “cha” in English. This is a set of documented examples, not a decoder for arbitrary Roman spelling.</p>
    <div><h4 className="mb-3 text-sm font-semibold">The twelve chakras</h4><div className={styles.chakraGrid}>{CHAKRAS.map((item, i) => <button type="button" className={styles.choice} key={item.name} aria-pressed={chakraIndex === i} onClick={() => setChakraIndex(i)}><span className={styles.eyebrow}>{String(i + 1).padStart(2, "0")} · {i < 6 ? "M1" : "M2"}</span><strong className="mt-1 block">{item.name}</strong><small>{i * 6 + 1}–{i * 6 + 6}</small></button>)}</div></div>
    <div className={`${styles.surface} ${styles.detail}`} aria-live="polite"><span className={styles.eyebrow}>Chakra {chakraIndex + 1} · {chakra.meaning}</span><h4>{chakra.name} · melakartas {chakraIndex * 6 + 1}–{chakraIndex * 6 + 6}</h4><p><strong>Constant degrees:</strong> {scales[0].svaras.slice(0, 4).join(" ")} P. Only the Dha–Ni pair changes within this group.</p><div className={styles.grid2}>{scales.map((mela) => <Link className={styles.resultButton} key={mela.number} href={`/learn/melakarta-chart?mela=${mela.number}#melakarta-chart`}><span>{mela.number}</span><strong>{mela.name}</strong><small>{mela.svaras.slice(-2).join(" ")}</small></Link>)}</div><Link className={styles.link} href={`/learn/melakarta-chart?chakra=${chakra.name}#melakarta-chart`}>Explore all six in {chakra.name} <ArrowRight size={15} aria-hidden /></Link></div>
  </div>;
}

export function MelakartaExplorer() {
  const [query, setQuery] = useState("");
  const [half, setHalf] = useState("all");
  const [chakraParam, setChakra] = useQueryState("chakra", "all");
  const [melaParam, setMela] = useQueryState("mela", "1");
  const chakra = CHAKRAS.some((item) => item.name === chakraParam) ? chakraParam : "all";
  const needle = query.trim().toLowerCase();
  const filtered = MELAKARTAS.filter((mela) =>
    (chakra === "all" || mela.chakra === chakra) &&
    (half === "all" || (half === "M1" ? mela.number <= 36 : mela.number > 36)) &&
    (!needle || mela.name.toLowerCase().includes(needle) || String(mela.number) === needle || mela.svaras.join(" ").toLowerCase().includes(needle)),
  );
  const selected = filtered.find((mela) => mela.number === Number(melaParam)) ?? filtered[0];
  function reset() { setQuery(""); setHalf("all"); setChakra(null); }
  return <div className={styles.study}>
    <StudyIntro title="Explore the complete corrected collection" text="Find a name or number, choose a chakra, or compare the two madhyama halves. Select a scale to read all seven degrees." badge="72 verified combinations" />
    <div className={styles.controls}>
      <label className={styles.field}><span className="inline-flex items-center gap-1.5"><Search size={13} aria-hidden />Find a melakarta</span><input type="search" placeholder="Name, number or svaras…" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
      <label className={styles.field}>Chakra<select value={chakra} onChange={(e) => setChakra(e.target.value)}><option value="all">All twelve chakras</option>{CHAKRAS.map((item, i) => <option key={item.name} value={item.name}>{i + 1} · {item.name}</option>)}</select></label>
    </div>
    <Segmented label="Melakarta madhyama half" value={half} onChange={setHalf} options={[{ value: "all", label: "Both halves" }, { value: "M1", label: "M1 · 1–36" }, { value: "M2", label: "M2 · 37–72" }]} />
    <div className="flex flex-wrap items-center justify-between gap-2"><p role="status" className={styles.muted}>{filtered.length} of 72 melakartas{chakra !== "all" ? ` · ${chakra}` : ""}</p><Button variant="ghost" size="sm" onClick={reset}>Reset filters</Button></div>
    {selected ? <>
      <div className={`${styles.scroll} ${styles.results}`} role="region" aria-label="Melakarta results" tabIndex={0}><div className={styles.grid3}>{filtered.map((mela) => <button type="button" key={mela.number} className={styles.resultButton} aria-label={`${mela.number}. ${mela.name}`} aria-pressed={mela.number === selected.number} onClick={() => setMela(String(mela.number))}><span>{mela.number}</span><strong>{mela.name}</strong><small>{mela.chakra} · {mela.svaras.join(" ")}</small></button>)}</div></div>
      <MelakartaDetail mela={selected} />
    </> : <div className={`${styles.surface} ${styles.detail}`}><h4>No matching melakartas</h4><p>Try a different name or number, or reset the chakra and madhyama filters.</p><Button variant="outline" onClick={reset}>Show all 72</Button></div>}
    <p className={styles.note}><strong>Source-wheel corrections:</strong> Sarasangi is 27; Harikambhoji is 28. The sixth scale of each chakra uses D2 N3, including in the M2 half.</p>
  </div>;
}
