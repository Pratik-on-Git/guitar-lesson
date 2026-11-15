import type { Metadata } from "next";
import { DesignSystem } from "@/components/app/design-system";

export const metadata: Metadata = { title: "Design system" };

export default function DesignSystemPage() {
  return <DesignSystem />;
}
