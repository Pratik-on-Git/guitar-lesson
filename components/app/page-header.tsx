
import { titleCaseLabel } from "@/lib/title-case";
import { cn } from "@/lib/utils";
import { StudyToggle } from "./study-toggle";

/* Shared page hierarchy: fluid title, readable description, wrapping actions. */
export function PageHeader({
  title,
  description,
  studyHref,
  meta,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Progress key; omit on pages that aren't study material. */
  studyHref?: string;
  /** Status chips under the description: family, note count, aliases. */
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  const hasActions = Boolean(studyHref || actions);
  return (
    <header className={cn("page-heading space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        {/* `min-w-48`: the title keeps real room, so a wide action cluster wraps instead of crushing it. */}
        <div className="min-w-48 flex-1 space-y-3">
          <h1 className="text-display text-foreground font-medium tracking-tight text-balance">{titleCaseLabel(<>{title}</>)}</h1>
          {description ? <p className="text-body text-muted-foreground max-w-3xl">{description}</p> : null}
        </div>
        {hasActions ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2 max-sm:w-full max-sm:*:flex-1">
            {actions}
            {studyHref ? <StudyToggle href={studyHref} /> : null}
          </div>
        ) : null}
      </div>
      {meta ? <div className="flex flex-wrap items-center gap-1.5">{meta}</div> : null}
    </header>
  );
}

// A titled block inside a page: the same heading weight and optional trailing action for every grouping.
export function Section({
  title,
  description,
  action,
  children,
  className,
  id,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("min-w-0 scroll-mt-24 space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 space-y-0.5">
          <h2 id={headingId} className="text-heading text-foreground font-semibold">{titleCaseLabel(<>
            {title}
          </>)}</h2>
          {description ? <p className="text-body text-muted-foreground">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
