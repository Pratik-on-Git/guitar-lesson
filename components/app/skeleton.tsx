/* Placeholder while URL-driven explorers hydrate. */
export function ExplorerSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading">
      <div className="h-72 animate-pulse rounded-card bg-card/70 shadow-soft" />
      <div className="h-56 animate-pulse rounded-card bg-card/50" />
      <div className="h-64 animate-pulse rounded-card bg-card/40" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-label="Loading">
      <div className="h-24 max-w-[560px] animate-pulse rounded-2xl bg-card/60" />
      <ExplorerSkeleton />
    </div>
  );
}
