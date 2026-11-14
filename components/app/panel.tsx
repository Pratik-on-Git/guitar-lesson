import { cn } from "@/lib/utils";

/** White card shell for one block of study material. */
export function Panel({
  id,
  title,
  description,
  action,
  className,
  bodyClassName,
  children,
}: {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? titleId : undefined}
      className={cn("min-w-0 scroll-mt-24 rounded-card bg-card p-5 text-card-foreground shadow-soft sm:p-7", className)}
    >
      {(title || action) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h2 id={titleId} className="text-heading-sm text-foreground">
                {title}
              </h2>
            )}
            {description && <p className="mt-1 text-caption leading-[1.45] text-muted-foreground">{description}</p>}
          </div>
          {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
        </header>
      )}
      <div className={cn("min-w-0", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Small uppercase-free label used above controls and sub-blocks. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mb-2 text-caption font-medium text-muted-foreground", className)}>{children}</p>;
}

export function EmberDot({ className }: { className?: string }) {
  return <span aria-hidden className={cn("inline-block size-2 shrink-0 rounded-full bg-ember", className)} />;
}
