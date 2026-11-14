import { cn } from "@/lib/utils";

// Skeleton, copied from @subtrait/ui: a shimmering bar sized by its call site.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("animate-shimmer rounded-md", className)} {...props} />;
}

export { Skeleton };
