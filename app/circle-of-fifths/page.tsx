import type { Metadata } from "next";
import { Blocks } from "@/components/content/blocks";
import { PageHeader } from "@/components/app/page-header";
import { Panel } from "@/components/app/panel";
import { StatusBadge } from "@/components/app/status-badge";
import { CircleOfFifths } from "@/components/music/circle-of-fifths";
import { SimpleTable } from "@/components/ui/table";
import { CIRCLE_TEXT } from "@/lib/content/topics";
import { FLAT_ORDER, SHARP_ORDER } from "@/lib/music/keys";
import { TheoryVisual } from "@/components/visuals/theory-figures";

export const metadata: Metadata = { title: "Circle of Fifths" };

const FLAT_KEYS = ["C", "F", "B♭", "E♭", "A♭", "D♭", "G♭", "C♭"];
const SHARP_KEYS = ["C", "G", "D", "A", "E", "B", "F♯", "C♯"];
const accidental = (letters: string[], sign: string) => ["—", ...letters.map((l, i) => letters.slice(0, i + 1).map((x) => x + sign).join(" "))];

export default function CircleOfFifthsPage() {
  const flats = accidental(FLAT_ORDER, "♭");
  const sharps = accidental(SHARP_ORDER, "♯");
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title="Circle of Fifths"
        description="A way of arranging the keys in perfect fifths. Select a key to read its signature, chords and character."
        studyHref="/circle-of-fifths"
        meta={
          <>
            <StatusBadge tone="brand">12 major keys</StatusBadge>
            <StatusBadge tone="neutral">12 relative minors</StatusBadge>
          </>
        }
      />
      <CircleOfFifths />
      <Panel title="How It Works">
        <Blocks
          blocks={[
            { type: "p", text: CIRCLE_TEXT.intro },
            { type: "p", text: CIRCLE_TEXT.descending },
            { type: "p", text: CIRCLE_TEXT.fourths },
          ]}
        />
      </Panel>
      <Panel title="Signatures at a glance" description="Each step clockwise adds a sharp; each step anticlockwise adds a flat. The three overlapping pairs (B/C♭, F♯/G♭, C♯/D♭) are the same keys spelled two ways.">
        <TheoryVisual id="chart-key-signatures" />
      </Panel>
      <div className="grid gap-4 md:gap-6 xl:grid-cols-2">
        <Panel title="Order of Sharps" description="Clockwise. Each new key adds the next sharp: F C G D A E B.">
          <SimpleTable columns={["Sharps", "Major key", "Sharps in the signature"]} rows={SHARP_KEYS.map((k, i) => [String(i), k, sharps[i]])} />
        </Panel>
        <Panel title="Order of Flats" description="Counter-clockwise. Each new key adds the next flat: B E A D G C F.">
          <SimpleTable columns={["Flats", "Major key", "Flats in the signature"]} rows={FLAT_KEYS.map((k, i) => [String(i), k, flats[i]])} />
        </Panel>
      </div>
    </div>
  );
}
