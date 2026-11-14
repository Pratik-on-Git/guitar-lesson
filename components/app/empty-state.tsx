import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * The one empty-state shape (emp-dashboard `EmptyState.tsx`): icon in a muted
 * circle, title, description, action. `bare` skips the card shell for use
 * inside a container that already is one; `sm` is the compact treatment.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "card",
  size = "default",
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "card" | "bare";
  size?: "default" | "sm";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "sm" ? "gap-2 px-4 py-10" : "gap-3 p-12",
        variant === "card" && "bg-card text-card-foreground ring-foreground/10 rounded-xl shadow-xs ring-1",
        className,
      )}
    >
      <div className={cn("bg-muted rounded-full", size === "sm" ? "p-2.5" : "p-3")}>
        <Icon className={cn("text-muted-foreground", size === "sm" ? "size-5" : "size-6")} aria-hidden />
      </div>
      <div className={size === "sm" ? undefined : "space-y-1"}>
        <p className={cn("text-foreground font-medium", size === "sm" && "text-sm")}>{title}</p>
        {description ? (
          <p className={cn("text-muted-foreground mx-auto max-w-md", size === "sm" ? "text-xs" : "text-sm")}>{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
