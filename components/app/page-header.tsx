import { StudyToggle } from "./study-toggle";

/** Title block at the top of every page, with the studied toggle. */
export function PageHeader({
  title,
  description,
  studyHref,
  meta,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  /** Progress key; omit on pages that aren't study material. */
  studyHref?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0 max-w-[720px]">
        {meta && <div className="mb-3 flex flex-wrap items-center gap-2">{meta}</div>}
        <h1 className="text-[32px] leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[40px]">{title}</h1>
        {description && <p className="mt-3 text-subheading text-muted-foreground">{description}</p>}
      </div>
      {(studyHref || actions) && (
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {studyHref && <StudyToggle href={studyHref} />}
        </div>
      )}
    </header>
  );
}

/** Pill tag for meta info under a title (family, note count…). */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[13px] font-medium text-foreground">
      {children}
    </span>
  );
}
