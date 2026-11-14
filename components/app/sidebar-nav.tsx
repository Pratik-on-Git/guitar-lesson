"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { NAV, isActive, type NavItem } from "@/lib/nav";
import { useStudied } from "@/lib/store";
import { cn } from "@/lib/utils";

/*
 * Grouped navigation, shared by the desktop sidebar and the mobile drawer.
 * `collapsed` shows an icon rail; titles move into tooltips.
 */
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

function NavList({ pathname, collapsed, onNavigate }: { pathname: string; collapsed: boolean; onNavigate?: () => void }) {
  const { isStudied } = useStudied();
  return (
    <nav aria-label="Study topics" className="flex flex-col gap-5">
      {NAV.map((group) => (
        <div key={group.title}>
          {collapsed ? (
            <div aria-hidden className="mx-auto mb-2 h-px w-6 bg-border" />
          ) : (
            <p className="mb-1.5 px-3 text-[12px] font-medium text-muted-foreground">{group.title}</p>
          )}
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <NavEntry
                key={item.href + item.title}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
                onNavigate={onNavigate}
                isStudied={isStudied}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

const itemClass = (active: boolean) =>
  cn(
    "group/item flex min-h-9 w-full items-center gap-2.5 rounded-[10px] px-3 py-1.5 text-caption font-medium outline-none transition-[background-color,box-shadow,color] focus-visible:ring-3 focus-visible:ring-ring/50",
    active ? "bg-card text-foreground shadow-soft" : "text-iron hover:bg-card/60 hover:text-foreground dark:text-fog",
  );

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
  const expanded = open ?? childActive;
  const Icon = item.icon;

  if (collapsed) {
    return (
      <li>
        <Link
          href={item.href}
          title={item.title}
          aria-label={item.title}
          aria-current={selfActive || childActive ? "page" : undefined}
          className={cn(itemClass(selfActive || childActive), "justify-center px-0")}
        >
          <Icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
        </Link>
      </li>
    );
  }

  if (!item.children) {
    return (
      <li>
        <Link href={item.href} onClick={onNavigate} aria-current={selfActive ? "page" : undefined} className={itemClass(selfActive)}>
          <Icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
          <span className="min-w-0 flex-1 truncate">{item.title}</span>
          {item.href !== "/" && isStudied(item.href) && <StudiedMark />}
        </Link>
      </li>
    );
  }

  const done = item.children.filter((c) => isStudied(c.href)).length;
  return (
    <li>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setOpen(!expanded)}
        className={itemClass(false)}
      >
        <Icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
        <span className={cn("min-w-0 flex-1 truncate text-left", childActive && "text-foreground")}>{item.title}</span>
        <span className="text-[12px] tabular-nums text-muted-foreground">
          {done}/{item.children.length}
        </span>
        <ChevronRight
          className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-90")}
          strokeWidth={2}
          aria-hidden
        />
      </button>
      {expanded && (
        <ul className="mt-0.5 ml-[21px] flex flex-col gap-0.5 border-l border-border pl-2.5">
          {item.children.map((child) => {
            const active = isActive(pathname, child.href);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(itemClass(active), "min-h-8 py-1")}
                >
                  <span className="min-w-0 flex-1 truncate">{child.title}</span>
                  {isStudied(child.href) && <StudiedMark />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

function StudiedMark() {
  return (
    <span className="grid size-4 shrink-0 place-items-center rounded-full bg-foreground/10" title="Studied">
      <Check className="size-2.5 text-foreground" strokeWidth={3} aria-label="Studied" />
    </span>
  );
}
