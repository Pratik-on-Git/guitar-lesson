import { cn } from "@/lib/utils";

/*
 * One badge for every status (emp-dashboard `status-badge.tsx`). A tone
 * resolves to a semantic token, so "studied" is the same green everywhere and
 * a page never invents its own palette.
 */
export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger" | "brand";

const TONE_SOFT: Record<StatusTone, string> = {
  neutral: "bg-neutral/10 text-neutral border-neutral/20",
  info: "bg-info/10 text-info border-info/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  brand: "bg-primary/10 text-primary border-primary/20",
};

const TONE_SOLID: Record<StatusTone, string> = {
  neutral: "bg-neutral text-neutral-foreground border-transparent",
  info: "bg-info text-info-foreground border-transparent",
  success: "bg-success text-success-foreground border-transparent",
  warning: "bg-warning text-warning-foreground border-transparent",
  danger: "bg-destructive text-destructive-foreground border-transparent",
  brand: "bg-primary text-primary-foreground border-transparent",
};

export const STATUS_TONE_DOT: Record<StatusTone, string> = {
  neutral: "bg-neutral",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  brand: "bg-primary",
};

export function StatusBadge({
  tone = "neutral",
  variant = "soft",
  dot = false,
  size = "sm",
  className,
  children,
}: {
  tone?: StatusTone;
  /** `soft` is the default list treatment; `solid` is for emphasis. */
  variant?: "soft" | "solid";
  /** A leading state dot, for when the label alone is ambiguous. */
  dot?: boolean;
  /** `xs` is the compact uppercase micro-label. */
  size?: "xs" | "sm" | "md";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border whitespace-nowrap [&_svg]:size-3",
        size === "xs"
          ? "text-overline px-2 py-0.5 font-semibold"
          : size === "sm"
            ? "text-caption px-2 py-0.5 font-medium"
            : "text-body px-2.5 py-1 font-medium",
        variant === "solid" ? TONE_SOLID[tone] : TONE_SOFT[tone],
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden
          className={cn("size-1.5 shrink-0 rounded-full", variant === "solid" ? "bg-current" : STATUS_TONE_DOT[tone])}
        />
      ) : null}
      {children}
    </span>
  );
}
