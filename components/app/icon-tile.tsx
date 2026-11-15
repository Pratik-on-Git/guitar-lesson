import { cn } from "@/lib/utils";

// Icon-in-a-square leading mark (emp-dashboard `icon-tile.tsx`), one size and tone scale for every list.
export type IconTileSize = "sm" | "default" | "lg";
export type IconTileTone = "muted" | "primary" | "success" | "warning" | "brand";

const SIZE_CLASS: Record<IconTileSize, string> = {
  sm: "size-7 [&_svg]:size-3.5",
  default: "size-8 [&_svg]:size-4",
  lg: "size-10 [&_svg]:size-5",
};

const TONE_CLASS: Record<IconTileTone, string> = {
  muted: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  brand: "brand-tile-soft",
};

export function IconTile({
  icon,
  size = "default",
  tone = "muted",
  className,
}: {
  icon: React.ReactNode;
  size?: IconTileSize;
  tone?: IconTileTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "icon-tile flex shrink-0 items-center justify-center rounded-xl",
        SIZE_CLASS[size],
        TONE_CLASS[tone],
        className,
      )}
      aria-hidden
    >
      {icon}
    </span>
  );
}
