"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/segmented";
import { SOURCE_ASSOCIATIONS } from "@/lib/music/raga-performance";
import { StudyIntro } from "./raga-grammar";
import styles from "./raga-study.module.css";

export function SourceSymbolism() {
  const [selected, setSelected] = useState(0);
  const item = SOURCE_ASSOCIATIONS[selected];
  return <div className={styles.study}>
    <StudyIntro title="A source-specific cultural reading" text="Inspect the associations reported on pp. 8–9 of the supplied notes. Their underlying texts, author and date are not identified." badge="Reported beliefs · not acoustic facts" />
    <Segmented label="Symbolic svara" value={selected} onChange={setSelected} options={SOURCE_ASSOCIATIONS.map((note, index) => ({ value: index, label: note.svara }))} />
    <div className={`${styles.surface} ${styles.detail}`} aria-live="polite" aria-atomic="true">
      <span className={styles.eyebrow}>The supplied notes associate</span><h4>{item.svara}</h4>
      <dl className={styles.grid2}>{[["Animal / bird", item.animal], ["Planet", item.planet], ["Colour", item.colour], ["Body chakra · source’s scheme", item.chakra]].map(([label, value]) => <div className={styles.card} key={label}><dt className={styles.eyebrow}>{label}</dt><dd className="mt-2 text-sm font-semibold">{label === "Colour" && <span className="mr-2 inline-block size-4 rounded-full border align-middle" style={{ background: item.swatch }} aria-hidden />}{value}</dd></div>)}</dl>
    </div>
    <p className={styles.note}>These associations are preserved as the source’s beliefs. They do not establish universal correspondences, tuning rules, anatomy or therapeutic effects.</p>
    <div className={styles.grid2}><div className={styles.card}><span className={styles.eyebrow}>This source’s body-chakra scheme</span><strong className={styles.metric}>7 associations</strong><p>A cultural and devotional mapping reported by the supplied PDF.</p></div><div className={styles.card}><span className={styles.eyebrow}>Melakarta classification chakras</span><strong className={styles.metric}>12 groups</strong><p>Groups of six parent scales. This is a different use of the word chakra.</p></div></div>
  </div>;
}
