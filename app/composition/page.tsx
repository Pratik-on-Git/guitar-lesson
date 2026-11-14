import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { CompositionSketchbook } from "@/components/music/composition-sketchbook";
export const metadata: Metadata = { title: "Composition Sketchbook" };
export default function Page() { return <div className="flex flex-col gap-6"><PageHeader title="Composition Sketchbook" description="Turn a motif into a four-bar phrase, hear it against harmony, and save or export your draft." studyHref="/composition" /><CompositionSketchbook /></div>; }
