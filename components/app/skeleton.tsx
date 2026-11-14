import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/*
 * Placeholders while URL-driven explorers hydrate. Shaped like the panels
 * they stand in for, and held back a beat (`animate-fallback-in`) so a fast
 * load never flashes them.
 */

function PanelSkeleton({ rows = 3, tall = false }: { rows?: number; tall?: boolean }) {
  return (
    <Card aria-hidden>
      <CardHeader className="border-b">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </CardHeader>
      <CardContent className="space-y-3">
        {tall ? <Skeleton className="h-40 w-full" /> : null}
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-4" style={{ width: `${92 - i * 14}%` }} />
        ))}
      </CardContent>
    </Card>
  );
}

export function ExplorerSkeleton() {
  return (
    <div role="status" aria-busy="true" className="animate-fallback-in flex flex-col gap-6 motion-reduce:animate-none">
      <span className="sr-only">Loading</span>
      <PanelSkeleton rows={2} tall />
      <PanelSkeleton rows={4} />
      <PanelSkeleton rows={1} tall />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div role="status" aria-busy="true" className="animate-fallback-in flex flex-col gap-6 motion-reduce:animate-none">
      <span className="sr-only">Loading</span>
      {/* Matches PageHeader: a display-size title over one line of description. */}
      <div className="space-y-2" aria-hidden>
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <PanelSkeleton rows={2} tall />
      <PanelSkeleton rows={4} />
    </div>
  );
}
