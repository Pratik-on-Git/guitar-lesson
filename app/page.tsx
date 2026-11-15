import { OverviewDashboard } from "@/components/app/overview";
import { TOPICS } from "@/lib/content/topics";
import { CHORDS } from "@/lib/music/chords";
import { MODE_FAMILIES } from "@/lib/music/modes";
import { SCALES } from "@/lib/music/scales";

export default function Overview() {
  return <OverviewDashboard library={{
    topics: TOPICS.length,
    scales: SCALES.length,
    modes: MODE_FAMILIES.reduce((sum, family) => sum + family.modes.length, 0),
    families: MODE_FAMILIES.length,
    chords: CHORDS.length,
  }} />;
}
