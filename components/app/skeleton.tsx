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
