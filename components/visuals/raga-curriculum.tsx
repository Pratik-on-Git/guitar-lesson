import Link from "next/link";
import { RAGA_PARTS } from "@/lib/content/raga-curriculum";
import { StudyIntro } from "./raga-grammar";
import styles from "./raga-study.module.css";

export function RagaCurriculum() {
  return <div className={styles.study}>
    <StudyIntro title="Your path through Indian classical music" text="Follow the three parts in order, or open a dedicated lesson. Each page has its own visual exploration, reference notes and practice prompts." badge="3 parts · 11 lessons" />
    <div className={styles.grid3}>{RAGA_PARTS.map((part, i) => <div key={part.title} className={`${styles.card} ${styles.part}`}>
      <div><span className={styles.eyebrow}>Part {String(i + 1).padStart(2, "0")} · {part.lessons.length} lessons</span><h4>{part.title}</h4><p>{part.description}</p></div>
      <ol>{part.lessons.map((lesson, index) => <li key={lesson.slug}><Link href={`/learn/${lesson.slug}`}><span>{String(index + 1).padStart(2, "0")}</span><span>{lesson.label}</span></Link></li>)}</ol>
    </div>)}</div>
  </div>;
}
