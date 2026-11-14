"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

/*
 * Tooltip with @subtrait/ui's look: a primary-filled bubble with a small
 * rotated-square arrow. `children` is the trigger element; it is rendered
 * through Base UI's `render` prop, so it keeps its own tag (a <Link>, a
 * <Button>) and gains the tooltip wiring.
 */

function TooltipProvider({ delay = 120, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider delay={delay} {...props} />;
}

function Tooltip({
  content,
  children,
  side = "top",
  sideOffset = 8,
  disabled = false,
  className,
}: {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  /** Renders the trigger alone, e.g. when the label is already visible. */
  disabled?: boolean;
  className?: string;
}) {
  if (disabled) return children;
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset} className="z-[70]" data-slot="tooltip-positioner">
          <TooltipPrimitive.Popup
            data-slot="tooltip-content"
            className={cn(
              "bg-primary text-primary-foreground w-fit origin-(--transform-origin) rounded-md px-3 py-1.5 text-xs text-balance shadow-md transition-[opacity,scale] duration-150",
              "data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[instant]:duration-0",
              className,
            )}
          >
            {content}
            <TooltipPrimitive.Arrow
              className={cn(
                "bg-primary size-2.5 rotate-45 rounded-[2px]",
                "data-[side=top]:-bottom-1 data-[side=bottom]:-top-1 data-[side=left]:-right-1 data-[side=right]:-left-1",
              )}
            />
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export { Tooltip, TooltipProvider };
