"use client";

import { titleCaseLabel } from "@/lib/title-case";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useId, useState } from "react";
import { AudioWaveform, BookOpen, ChevronRight, CircleCheck, Drum, Guitar, KeyRound, Layers, ListMusic, Music2, Palette, Shapes } from "lucide-react";
import { NAV, isActive, type NavGroup, type NavItem } from "@/lib/nav";
import { useSidebarCollapsed, useStudied } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

/*
 * Grouped navigation for the desktop sidebar and the phone sheet, styled
 * after emp-dashboard's `Sidebar.tsx`. Hover is neutral and selection is
 * tinted, so "where I am" never looks like "where my mouse is"; the selected
 * page also gets a bar, so it is marked by shape and not by colour alone.
 *
 * `collapsed` is the icon rail: labels fade out (they stay in the DOM so the
 * width animation never shows them clipped), titles move into tooltips, and
 * group labels give way to a short divider.
 */

/*
 * Everything that changes with the rail reads the sidebar's `data-collapsed`
 * through `group-data-[collapsed=true]/sidebar:`. Those classes are written
 * out in full on purpose: Tailwind only generates classes it can find
 * literally in the source, so a variant assembled from a template string
 * silently produces no CSS at all.
 */

const LABEL_FADE =
  "overflow-hidden whitespace-nowrap transition-opacity duration-200 delay-75 group-data-[collapsed=true]/sidebar:opacity-0 group-data-[collapsed=true]/sidebar:duration-100 group-data-[collapsed=true]/sidebar:delay-0";

const ITEM = cn(
  "relative flex h-9 w-full items-center gap-3 overflow-hidden rounded-lg px-2.5 text-sm font-medium text-foreground outline-none",
  "transition-[color,background-color,width,padding] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
  "hover:bg-sidebar-foreground/5 active:bg-sidebar-foreground/10 focus-visible:ring-2 focus-visible:ring-sidebar-ring",
  "[&>svg]:size-4 [&>svg]:shrink-0",
  "data-[active=true]:bg-sidebar-primary/10 data-[active=true]:text-sidebar-primary data-[active=true]:hover:bg-sidebar-primary/15",
  // The rail: a 36px square, icon centred by the 10px padding.
  "group-data-[collapsed=true]/sidebar:w-9 group-data-[collapsed=true]/sidebar:gap-0",
);

// The rail marks the page by its fill alone; the bar would sit against the square's edge.
const ACTIVE_BAR = cn(
  "before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-r-full before:bg-sidebar-primary",
  "before:opacity-0 before:transition-opacity data-[active=true]:before:opacity-100",
  "group-data-[collapsed=true]/sidebar:before:opacity-0!",
);

const SUB_ITEM = cn(
  "flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-sm text-foreground outline-none transition-colors",
  "hover:bg-sidebar-foreground/5 active:bg-sidebar-foreground/10 focus-visible:ring-2 focus-visible:ring-sidebar-ring",
  "data-[active=true]:bg-sidebar-primary/10 data-[active=true]:font-medium data-[active=true]:text-sidebar-primary",
);

// Lights the guide line beside the selected child.
const SUB_ROW =
  "relative before:absolute before:inset-y-1.5 before:-left-2.5 before:w-0.5 before:rounded-full before:bg-sidebar-primary before:opacity-0 has-data-[active=true]:before:opacity-100";

export function SidebarNav({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  return (
    <Suspense fallback={<NavList pathname="" collapsed={collapsed} onNavigate={onNavigate} />}>
      <NavWithPath collapsed={collapsed} onNavigate={onNavigate} />
    </Suspense>
  );
}

function NavWithPath(props: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return <NavList pathname={pathname} {...props} />;
}

const SECTION_ICONS = [BookOpen, AudioWaveform, Drum, KeyRound, ListMusic, Layers, Guitar, Shapes, Palette, Music2];

function NavList({ pathname, collapsed, onNavigate }: { pathname: string; collapsed: boolean; onNavigate?: () => void }) {
  const { isStudied } = useStudied();
  return (
    <nav aria-label="Study topics" className="flex flex-col gap-1 p-2.5">
      {NAV.map((group, index) => group.title === "Study" ? (
        <ul key={group.title} className="mb-2 flex flex-col gap-1">
          {group.items.map(item => <NavEntry key={item.href} item={item} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} isStudied={isStudied} />)}
        </ul>
      ) : <NavSection key={group.title} group={group} index={index - 1} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} isStudied={isStudied} />)}
    </nav>
  );
}

function NavSection({ group, index, pathname, collapsed, onNavigate, isStudied }: {
  group: NavGroup;
  index: number;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
  isStudied: (href: string) => boolean;
}) {
  const listId = useId();
  const [, setCollapsed] = useSidebarCollapsed();
  const [choice, setChoice] = useState<{ pathname: string; open: boolean } | null>(null);
  const active = group.items.some(item => isActive(pathname, item.href) || item.children?.some(child => isActive(pathname, child.href)));
  const expanded = !collapsed && (choice?.pathname === pathname ? choice.open : active);
  const Icon = SECTION_ICONS[index] ?? BookOpen;
  const toggle = () => {
    if (collapsed) setCollapsed(false);
    setChoice({ pathname, open: !expanded });
  };
  return <div className="min-w-0">
    <Tooltip content={titleCaseLabel(group.title)} side="right" disabled={!collapsed}>
      <button type="button" aria-label={collapsed ? String(titleCaseLabel(group.title)) : undefined} aria-expanded={expanded} aria-controls={listId} data-active={active} onClick={toggle}
        className={cn(ITEM, ACTIVE_BAR, "h-auto min-h-9 py-2 text-left")}>
        <Icon aria-hidden />
        <span className={cn("min-w-0 flex-1 whitespace-normal leading-5", LABEL_FADE)}>{titleCaseLabel(group.title)}</span>
        <ChevronRight aria-hidden className={cn("size-3.5! shrink-0 transition-transform duration-200 motion-reduce:transition-none", LABEL_FADE, expanded && "rotate-90")} />
      </button>
    </Tooltip>
    <div id={listId} hidden={!expanded}>
      <ul className="my-2 ml-4 flex min-w-0 flex-col gap-1 border-l border-sidebar-border pl-2">
        {group.items.map(item => <NavEntry key={item.href} item={item} pathname={pathname} collapsed={false} onNavigate={onNavigate} isStudied={isStudied} />)}
      </ul>
    </div>
  </div>;
}

function NavEntry({
  item,
  pathname,
  collapsed,
  onNavigate,
  isStudied,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
  isStudied: (href: string) => boolean;
}) {
  const childActive = item.children?.some((c) => isActive(pathname, c.href)) ?? false;
  const selfActive = !item.children && isActive(pathname, item.href);
  const [open, setOpen] = useState<boolean | null>(null);
  const listId = useId();
  const Icon = item.icon;

  // Leaves, and every item in the rail, are links. In the rail a branch goes to its parent page.
  if (!item.children || collapsed) {
    const active = selfActive || childActive;
    const studied = !item.children && item.href !== "/" && isStudied(item.href);
    return (
      <li>
        <Tooltip content={item.title} side="right" sideOffset={14} disabled={!collapsed}>
          <Link
            href={item.href}
            onClick={onNavigate}
            data-active={active}
            aria-current={selfActive ? "page" : undefined}
            aria-label={collapsed ? item.title : undefined}
            className={cn(ITEM, ACTIVE_BAR)}
          >{titleCaseLabel(<>
            <Icon aria-hidden />
            <span className={cn("min-w-0 flex-1 truncate", LABEL_FADE)}>{item.title}</span>
            {studied ? (
              <CircleCheck className={cn("text-success size-3.5! shrink-0", LABEL_FADE)} aria-label="Studied" />
            ) : null}
          </>)}</Link>
        </Tooltip>
      </li>
    );
  }

  // Open while one of its pages is current, until the reader folds it.
  const expanded = open ?? childActive;
  const done = item.children.filter((c) => isStudied(c.href)).length;
  const total = item.children.length;
  const complete = done === total;


  return (
    <li>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={() => setOpen(!expanded)}
        className={cn(ITEM, childActive && !expanded && "bg-sidebar-primary/10 text-sidebar-primary", childActive && "text-sidebar-primary")}
      >{titleCaseLabel(<>
        <Icon aria-hidden />
        <span className="min-w-0 flex-1 truncate text-left">{item.title}</span>
        <span
          className={cn(
            "max-w-24 shrink-0 truncate rounded-full px-1.5 text-xs tabular-nums",
            complete ? "bg-success/10 text-success" : "bg-sidebar-primary/10 text-sidebar-primary",
          )}
          aria-label={`${done} of ${total} studied`}
        >
          {done}/{total}
        </span>
        <ChevronRight
          aria-hidden
          className={cn("size-3.5! shrink-0 transition-transform duration-200 motion-reduce:transition-none", expanded && "rotate-90")}
        />
      </>)}</button>

      {/* Grid rows animate the height without measuring; `inert` keeps folded links out of the tab order. */}
      <div
        id={listId}
        inert={!expanded}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <ul className="border-sidebar-border mt-0.5 ml-[1.0625rem] flex min-h-0 flex-col gap-0.5 overflow-hidden border-l py-0.5 pl-2.5">
          {item.children.map((child) => {
            const active = isActive(pathname, child.href);
            return (
              <li key={child.href} className={SUB_ROW}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  className={SUB_ITEM}
                >{titleCaseLabel(<>
                  <span className="min-w-0 flex-1 truncate">{child.title}</span>
                  {isStudied(child.href) ? <CircleCheck className="text-success size-3.5 shrink-0" aria-label="Studied" /> : null}
                </>)}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
