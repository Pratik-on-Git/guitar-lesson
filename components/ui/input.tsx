import { cn } from "@/lib/utils";

// Input, copied from @subtrait/ui.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input bg-input-background flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

/*
 * An input with a leading icon and an optional trailing slot (a clear button,
 * a count). The icon sits inside the field's padding, not beside it.
 */
function InputGroup({
  icon,
  trailing,
  className,
  inputClassName,
  ...props
}: React.ComponentProps<"input"> & { icon?: React.ReactNode; trailing?: React.ReactNode; inputClassName?: string }) {
  return (
    <div className={cn("relative flex w-full items-center", className)}>
      {icon ? (
        <span className="text-muted-foreground pointer-events-none absolute left-3 flex [&_svg]:size-4" aria-hidden>
          {icon}
        </span>
      ) : null}
      <Input className={cn(icon && "pl-9", trailing ? "pr-10" : undefined, inputClassName)} {...props} />
      {trailing ? <span className="absolute right-1.5 flex items-center">{trailing}</span> : null}
    </div>
  );
}

export { Input, InputGroup };
