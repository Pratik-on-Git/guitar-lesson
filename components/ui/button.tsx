import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Shared action geometry and semantic variants; links use buttonVariants(). */
const buttonVariants = cva(
  "ui-button group/button focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // `button-sheen` (globals.css) is the hover sweep and glow.
        default: "button-sheen bg-primary text-primary-foreground hover:bg-[var(--button-primary-hover)]",
        outline:
          "border-border text-foreground bg-card hover:bg-accent hover:border-input aria-expanded:bg-primary/10 aria-expanded:border-primary dark:bg-background dark:hover:bg-primary/15",
        "outline-destructive":
          "border-destructive/40 text-destructive bg-background hover:bg-destructive/10 hover:border-destructive aria-expanded:bg-destructive/10 aria-expanded:border-destructive focus-visible:border-destructive/60 focus-visible:ring-destructive/20 dark:border-destructive/60 dark:bg-background dark:hover:bg-destructive/15",
        secondary:
          "bg-secondary text-secondary-foreground aria-expanded:bg-secondary aria-expanded:text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        soft: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:border-primary/30 font-semibold",
        // A finished state: the same soft treatment in the success tone.
        success:
          "bg-success/10 text-success border-success/25 hover:bg-success/15 hover:border-success/40 font-semibold",
        card: "border-border bg-card text-foreground justify-between font-normal hover:bg-accent/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-12 gap-2 px-5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        icon: "size-10",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),8px)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-[min(var(--radius-md),10px)]",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      // Read by globals.css to grow small buttons' touch area on coarse pointers.
      data-size={size ?? "default"}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
