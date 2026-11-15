import { cn } from "@/lib/utils";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

/* A titled learning or tool surface, composed from the shared Card primitives. */
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
  const hasHeader = Boolean(title || action);
  return (
    <Card as="section" id={id} aria-labelledby={title ? titleId : undefined} className={cn("min-w-0 scroll-mt-24", className)}>
      {hasHeader ? (
        <CardHeader className="border-b">
          {title ? (
            <h2 id={titleId} data-slot="card-title" className="text-title text-foreground leading-normal font-semibold">
              {title}
            </h2>
          ) : null}
          {description ? <CardDescription className="text-body">{description}</CardDescription> : null}
          {action ? <CardAction className="flex flex-wrap items-center gap-2 max-sm:col-span-2 max-sm:col-start-1 max-sm:row-span-1 max-sm:row-start-3 max-sm:justify-self-start max-sm:pt-2">{action}</CardAction> : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn("min-w-0", bodyClassName)}>{children}</CardContent>
    </Card>
  );
}

/** A small muted label above a control or a sub-block. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase", className)}>{children}</p>;
}
