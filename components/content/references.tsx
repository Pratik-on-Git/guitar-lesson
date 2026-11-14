import type { Reference } from "@/lib/content/references";
import { Panel } from "@/components/app/panel";
import Link from "next/link";

export function References({ entries }: { entries: Reference[] }) {
  return (
    <Panel title="Sources & further reading">
      <ul className="flex flex-col gap-2 text-sm">
        {entries.map((entry) => (
          <li key={entry.href}>
            {entry.href.startsWith("/") ? <Link href={entry.href} className="text-primary hover:underline focus-visible:underline">{entry.title}</Link> : <a href={entry.href} target="_blank" rel="noreferrer" className="text-primary hover:underline focus-visible:underline">{entry.title}<span className="sr-only"> (opens in a new tab)</span></a>}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
