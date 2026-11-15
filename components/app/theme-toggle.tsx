"use client";

import { titleCaseLabel } from "@/lib/title-case";

import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

// The dashboards' mode toggle: the two icons swap by scale, driven by the `.dark` class itself.
export function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Switch to Dark Theme" : "Switch to Light Theme";
  return (
    <Tooltip content={label} side="bottom">
      <Button variant="ghost" size="icon" className="relative" onClick={() => setTheme(next)} aria-label={label}>{titleCaseLabel(<>
        <MoonStar className="scale-100 transition-transform dark:scale-0" />
        <Sun className="absolute scale-0 transition-transform dark:scale-100" />
      </>)}</Button>
    </Tooltip>
  );
}
