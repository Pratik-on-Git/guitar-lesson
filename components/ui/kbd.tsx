import { cn } from "@/lib/utils";

// Keyboard key chip, as in the dashboards' header "Jump to…" button.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded border border-border px-1.5 font-mono text-[11px] leading-5",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
