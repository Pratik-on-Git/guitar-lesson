
import { titleCaseLabel } from "@/lib/title-case";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Summary tile (emp-dashboard `stat-card.tsx`): an uppercase label, the
 * figure one step below the page title, an optional detail line and a tinted
 * icon square. `href` turns the whole tile into a link.
 */
export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  href,
  className,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  icon?: LucideIcon;
  href?: string;
  className?: string;
}) {
  const body = (
    <div className="flex items-stretch gap-3">
      <div className="min-w-0 flex-1">
        <span className="text-muted-foreground block text-xs font-medium tracking-wide">{titleCaseLabel(label)}</span>
        <div className="text-foreground mt-1 text-xl leading-tight font-semibold tabular-nums">{value}</div>
        {detail ? <div className="text-muted-foreground mt-0.5 truncate text-xs">{detail}</div> : null}
      </div>
      {Icon ? (
        <span
          className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center self-center rounded-lg transition-[scale] duration-300 group-hover/stat:scale-105 motion-reduce:transition-none max-sm:size-10"
          aria-hidden
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
      ) : null}
    </div>
  );

  const shell = "group/stat bg-card text-card-foreground ring-foreground/10 rounded-xl p-4 shadow-xs ring-1 transition-[box-shadow,background-color]";

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          shell,
          "hover:ring-primary/30 block outline-none hover:shadow-sm focus-visible:ring-2 focus-visible:ring-primary",
          className,
        )}
      >{titleCaseLabel(<>
        {body}
      </>)}</Link>
    );
  }
  return <div className={cn(shell, className)}>{body}</div>;
}

// Responsive tile row: pages pass a count instead of inventing their own grid.
export function StatGrid({
  columns = 4,
  children,
  className,
}: {
  columns?: 2 | 3 | 4 | 5;
  children: React.ReactNode;
  className?: string;
}) {
  const COLUMN_CLASS: Record<number, string> = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-3 lg:grid-cols-5",
  };
  return <div className={cn("grid grid-cols-2 gap-3 md:gap-4", COLUMN_CLASS[columns], className)}>{children}</div>;
}
