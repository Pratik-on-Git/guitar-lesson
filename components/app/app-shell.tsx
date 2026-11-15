"use client";

import { titleCaseLabel } from "@/lib/title-case";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { ArrowRight, ChevronRight, GraduationCap, Menu, PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
import { STUDY_PAGES, crumbsFor, nextUnstudied } from "@/lib/nav";
import { useSidebarCollapsed, useStudied } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogTitle, SheetContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { BrandMark } from "./brand";
import { SearchDialog } from "./search-dialog";
import { SidebarNav } from "./sidebar-nav";
import { ThemeToggle } from "./theme-toggle";
import { AccountMenu } from "@/components/auth/account-menu";
import { SessionGuard } from "@/components/auth/session-guard";

/* Responsive frame: floating neutral navigation, toolbar, content, and footer. */

// One timing for the collapse, shared by the rail width and the labels inside it.
const MORPH = "duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:duration-0";

const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const noop = () => () => {};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [sheet, setSheet] = useState(false);
  const apple = useSyncExternalStore(noop, isApple, () => false);

  // Ctrl/⌘ + B folds the sidebar to its rail, as in the dashboards.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b" && !event.repeat) {
        event.preventDefault();
        setCollapsed(!collapsed);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [collapsed, setCollapsed]);

  const sidebarAction = collapsed ? "Expand Sidebar" : "Collapse Sidebar";

  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return <main id="content">{children}</main>;
  }

  return (
    <SessionGuard><TooltipProvider>
      <div className="flex min-h-svh">
        <a
          href="#content"
          className="bg-primary text-primary-foreground sr-only z-[60] rounded-md px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to Content
        </a>

        {/* `p-3 pr-0` lines the card up with the header's `mt-3`; the rail keeps exactly icon width inside it. */}
        <aside
          data-collapsed={collapsed}
          className={cn(
            "group/sidebar sticky top-0 hidden h-svh shrink-0 p-3 pr-0 transition-[width] lg:block",
            MORPH,
            collapsed ? "w-[calc(3.5rem+0.75rem+2px)]" : "w-64",
          )}
        >
          <div className="app-sidebar bg-sidebar text-sidebar-foreground flex h-full flex-col overflow-hidden rounded-xl border">
            <SidebarBrand collapsed={collapsed} />
            {/* The rail still scrolls on short screens, but without a bar: one would eat the icons' width. */}
            <div
              className={cn(
                "minimal-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto border-t pt-1",
                collapsed && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              )}
            >
              <SidebarNav collapsed={collapsed} />
            </div>
            <div className="border-t py-2.5">
              <SidebarProgress collapsed={collapsed} />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Sized by container, not viewport, so the header adapts to the sidebar's width too. */}
          <header className="@container/header sticky top-0 z-40 px-4 before:absolute before:inset-0 before:mask-[linear-gradient(var(--card),var(--card)_18%,transparent_100%)] before:backdrop-blur-md sm:px-6">
            <div className="app-toolbar bg-card relative mt-3 flex w-full items-center justify-between gap-2 rounded-xl border px-2 py-2 shadow-xs sm:gap-4 sm:px-4">
              <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
                <Dialog open={sheet} onOpenChange={setSheet}>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open Menu"
                    onClick={() => setSheet(true)}
                    className="size-8 lg:hidden [&_svg]:size-5!"
                  >{titleCaseLabel(<>
                    <Menu />
                  </>)}</Button>
                  <SheetContent>
                    <DialogTitle className="sr-only">{titleCaseLabel(<>Study topics</>)}</DialogTitle>
                    <SidebarBrand collapsed={false} onNavigate={() => setSheet(false)} />
                    <div className="minimal-scrollbar min-h-0 flex-1 overflow-y-auto border-t pt-1">
                      <SidebarNav onNavigate={() => setSheet(false)} />
                    </div>
                    <div className="border-t py-2.5">
                      <SidebarProgress collapsed={false} onNavigate={() => setSheet(false)} />
                    </div>
                  </SheetContent>
                </Dialog>

                <Tooltip
                  side="bottom"
                  content={
                    <>
                      {sidebarAction}
                      <span className="ml-1.5 font-mono opacity-80">{apple ? "⌘B" : "Ctrl+B"}</span>
                    </>
                  }
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={sidebarAction}
                    aria-keyshortcuts={apple ? "Meta+B" : "Control+B"}
                    className="hidden size-8 lg:inline-flex [&_svg]:size-5!"
                  >{titleCaseLabel(<>
                    {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                  </>)}</Button>
                </Tooltip>
                {/* Phones have no room for the trail; the mark says where you are instead. */}
                <Link href="/" className="flex min-w-0 items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50 @xl/header:hidden">{titleCaseLabel(<>
                  <BrandMark className="size-7 rounded-md" />
                  <span className="truncate text-sm font-semibold">Guitar Notes</span>
                </>)}</Link>
                <Separator orientation="vertical" className="hidden h-4! self-center @xl/header:block" />
                <Suspense fallback={<div className="min-w-0 flex-1" />}>
                  <Breadcrumbs />
                </Suspense>
              </div>

              <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
                <SearchDialog />
                <ThemeToggle />
                <AccountMenu />
              </div>
            </div>
          </header>

          <main id="content" className="app-content w-full min-w-0 flex-1 px-4 py-8 sm:px-6">
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </TooltipProvider></SessionGuard>
  );
}

function SidebarBrand({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <div className="p-2.5">
      <Link
        href="/"
        onClick={onNavigate}
        aria-label="Guitar Notes, overview"
        className={cn(
          "hover:bg-sidebar-foreground/5 active:bg-sidebar-foreground/10 focus-visible:ring-sidebar-ring flex h-12 items-center gap-3 rounded-lg px-1.5 outline-none focus-visible:ring-2",
          "transition-[padding,width]",
          MORPH,
          collapsed && "w-9 px-0",
        )}
      >{titleCaseLabel(<>
        <BrandMark />
        <span
          className={cn(
            "grid min-w-0 flex-1 leading-tight transition-opacity duration-200 delay-75",
            collapsed && "opacity-0 delay-0 duration-100",
          )}
        >
          <span className="text-foreground truncate text-base font-semibold">Guitar Notes</span>
          <span className="text-sidebar-foreground/60 truncate text-xs">A little more musical.</span>
        </span>
      </>)}</Link>
    </div>
  );
}

/*
 * Study progress on the dashboards' hero surface (the sidebar plan card): the
 * share studied as a dotted meter and the way on to the next page. The rail
 * has no room for the card, so it becomes one primary button there.
 */
function SidebarProgress({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const { studied } = useStudied();
  const done = STUDY_PAGES.filter((p) => studied.includes(p.href)).length;
  const total = STUDY_PAGES.length;
  const share = total ? done / total : 0;
  const next = nextUnstudied(studied);

  if (collapsed) {
    return (
      <div className="flex justify-center">
        <Tooltip side="right" sideOffset={14} content={next ? `Continue: ${next.title}` : "Everything studied"}>
          <Link
            href={next?.href ?? "/"}
            aria-label={next ? `Continue with ${next.title}` : "Overview"}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 grid size-9 place-items-center rounded-lg outline-none focus-visible:ring-3"
          >{titleCaseLabel(<>
            <GraduationCap className="size-4" aria-hidden />
          </>)}</Link>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="hero-surface mx-2.5 rounded-xl p-3">
      <span className="hero-surface__orb" aria-hidden />
      <span className="hero-surface__dots" aria-hidden />
      <span className="hero-surface__glow" aria-hidden />
      <div className="space-y-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="bg-primary-foreground/15 ring-primary-foreground/20 grid size-6 shrink-0 place-items-center rounded-md ring-1">
            <GraduationCap className="size-3.5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">Study Progress</span>
          <span className="text-primary-foreground/85 text-xs font-medium tabular-nums">{Math.round(share * 100)}%</span>
        </div>
        <div
          role="meter"
          aria-label="Pages studied"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          aria-valuetext={`${done} of ${total} pages studied`}
          className="space-y-1.5"
        >
          <p className="text-primary-foreground/80 text-xs">
            <span className="text-primary-foreground text-sm font-semibold tabular-nums">{done}</span> of {total} pages
          </p>
          <div className="hero-meter-track relative h-2 rounded-full">
            <div
              className="hero-meter-fill animate-meter-grow absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 motion-reduce:animate-none"
              style={{ width: `${share * 100}%` }}
            />
          </div>
        </div>
        {next ? (
          <Link
            href={next.href}
            onClick={onNavigate}
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-primary-foreground text-primary hover:bg-primary-foreground/90 dark:bg-primary-foreground dark:hover:bg-primary-foreground/90 h-8 w-full justify-between",
            )}
          >{titleCaseLabel(<>
            <span className="min-w-0 truncate">Next: {next.title}</span>
            <ArrowRight aria-hidden />
          </>)}</Link>
        ) : (
          <p className="flex items-center gap-1.5 text-xs font-medium">
            <Sparkles className="size-3.5" aria-hidden />
            Everything studied. Time to revise.
          </p>
        )}
      </div>
    </div>
  );
}

function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = crumbsFor(pathname);
  if (!crumbs.length) return <div className="min-w-0 flex-1" />;
  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 flex-1 overflow-hidden @xl/header:block">
      {/* One line, always. Too narrow for the trail, only the current page shows. */}
      <ol className="text-muted-foreground flex min-w-0 flex-nowrap items-center gap-1.5 text-sm sm:gap-2">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <Fragment key={crumb.label + i}>
              {i > 0 ? (
                <li aria-hidden className="hidden @3xl/header:flex">
                  <ChevronRight className="size-3.5 opacity-60" />
                </li>
              ) : null}
              <li className={cn("min-w-0", !last && "hidden @3xl/header:block")}>
                {last ? (
                  <span aria-current="page" className="text-primary block max-w-[16rem] truncate font-medium">
                    {titleCaseLabel(crumb.label)}
                  </span>
                ) : crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground block max-w-[16rem] truncate transition-colors">{titleCaseLabel(<>
                    {titleCaseLabel(crumb.label)}
                  </>)}</Link>
                ) : (
                  <span className="block max-w-[16rem] truncate">{titleCaseLabel(crumb.label)}</span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground flex w-full min-w-0 items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6">
        <p className="text-sm text-balance max-sm:text-center">Guitar Notes · Theory & practice</p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link href="/design-system" className="hover:text-foreground text-sm transition duration-300">{titleCaseLabel(<>Design system</>)}</Link>
          <Link href="/scales" className="hover:text-foreground text-sm transition duration-300">{titleCaseLabel(<>
            Scales
          </>)}</Link>
          <Link href="/chords" className="hover:text-foreground text-sm transition duration-300">{titleCaseLabel(<>
            Chords
          </>)}</Link>
          <Link href="/circle-of-fifths" className="hover:text-foreground text-sm transition duration-300">{titleCaseLabel(<>
            Circle of Fifths
          </>)}</Link>
        </div>
      </div>
    </footer>
  );
}
