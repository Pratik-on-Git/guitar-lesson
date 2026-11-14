"use client";

import { Dialog } from "@base-ui/react/dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { STUDY_PAGES, trailFor } from "@/lib/nav";
import { useSidebarCollapsed, useStudied } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./search-dialog";
import { SidebarNav } from "./sidebar-nav";
import { ThemeToggle } from "./theme-toggle";

/*
 * App frame: sidebar of topics (icon rail when collapsed, drawer on
 * mobile), a sticky top bar with breadcrumb, search and theme, then the page.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [drawer, setDrawer] = useState(false);

  return (
    <div className="flex min-h-svh">
      <a
        href="#content"
        className="sr-only z-[60] rounded-lg bg-card px-4 py-2 text-caption font-medium shadow-soft focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <aside
        className={cn(
          "sticky top-0 hidden h-svh shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-[272px]",
        )}
      >
        <div className={cn("flex h-16 shrink-0 items-center", collapsed ? "justify-center" : "px-6")}>
          <Brand compact={collapsed} />
        </div>
        <div className={cn("min-h-0 flex-1 overflow-y-auto pb-6", collapsed ? "px-3" : "px-3.5")}>
          <SidebarNav collapsed={collapsed} />
        </div>
        {!collapsed && <ProgressFooter />}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
          <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6">
            <Dialog.Root open={drawer} onOpenChange={setDrawer}>
              <Dialog.Trigger
                aria-label="Open topics"
                className="grid size-10 place-items-center rounded-lg text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
              >
                <Menu className="size-5" strokeWidth={1.75} />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop className="fixed inset-0 z-50 bg-pressed-graphite/30 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
                <Dialog.Popup className="fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col bg-sidebar shadow-soft outline-none transition-transform duration-200 data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full">
                  <div className="flex h-16 shrink-0 items-center justify-between px-5">
                    <Dialog.Title render={<div />}>
                      <Brand />
                    </Dialog.Title>
                    <Dialog.Close
                      aria-label="Close topics"
                      className="grid size-10 place-items-center rounded-lg text-foreground hover:bg-muted"
                    >
                      <X className="size-5" strokeWidth={1.75} />
                    </Dialog.Close>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-3.5 pb-6">
                    <SidebarNav onNavigate={() => setDrawer(false)} />
                  </div>
                  <ProgressFooter />
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden size-10 place-items-center rounded-lg text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 lg:grid"
            >
              {collapsed ? (
                <PanelLeftOpen className="size-[18px]" strokeWidth={1.75} />
              ) : (
                <PanelLeftClose className="size-[18px]" strokeWidth={1.75} />
              )}
            </button>
            <span aria-hidden className="hidden h-6 w-px bg-border lg:block" />

            <Suspense fallback={<div className="min-w-0 flex-1" />}>
              <Breadcrumb />
            </Suspense>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <SearchDialog />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="content" className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="font-display text-[21px] leading-none font-medium tracking-[-0.02em] text-foreground" aria-label="Guitar notes, overview">
      {compact ? (
        <span className="grid size-9 place-items-center rounded-[10px] bg-primary text-[15px] text-primary-foreground">g</span>
      ) : (
        <>
          guitar notes
          <span aria-hidden className="ml-0.5 inline-block size-[6px] rounded-full bg-ember align-baseline" />
        </>
      )}
    </Link>
  );
}

function Breadcrumb() {
  const pathname = usePathname();
  const trail = trailFor(pathname);
  if (!trail.length) return <div className="min-w-0 flex-1" />;
  return (
    <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
      <ol className="flex items-center gap-1.5 truncate text-caption">
        {trail.map((part, i) => (
          <li key={part + i} className={cn("flex items-center gap-1.5 truncate", i < trail.length - 1 && "max-sm:hidden")}>
            {i > 0 && (
              <span aria-hidden className="text-fog max-sm:hidden">
                /
              </span>
            )}
            <span
              aria-current={i === trail.length - 1 ? "page" : undefined}
              className={i === trail.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"}
            >
              {part}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ProgressFooter() {
  const { studied } = useStudied();
  const done = STUDY_PAGES.filter((p) => studied.includes(p.href)).length;
  const total = STUDY_PAGES.length;
  return (
    <div className="shrink-0 border-t border-border px-6 py-4">
      <div className="flex items-center justify-between text-[12px] text-muted-foreground">
        <span>Studied</span>
        <span className="tabular-nums">
          {done} of {total}
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-fog/60 dark:bg-iron">
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${(done / total) * 100}%` }} />
      </div>
    </div>
  );
}
