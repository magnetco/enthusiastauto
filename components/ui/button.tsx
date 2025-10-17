import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm transition-all disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2] focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Primary variant with Linear's indigo (Add to Cart, Checkout)
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-low)] hover:bg-accent hover:shadow-[var(--shadow-medium)] transition-all duration-100 font-medium",
        // Secondary variant with muted background
        secondary:
          "bg-secondary text-secondary-foreground shadow-[var(--shadow-tiny)] hover:bg-accent hover:text-accent-foreground transition-all duration-100 font-medium",
        // Destructive for dangerous actions
        destructive:
          "bg-destructive text-white shadow-[var(--shadow-low)] hover:opacity-90 transition-all duration-100 focus-visible:ring-destructive font-medium",
        // Outline for Cancel, Clear Filters (Linear style)
        outline:
          "border border-border bg-transparent hover:bg-muted hover:border-border/80 shadow-[var(--shadow-tiny)] hover:shadow-[var(--shadow-low)] transition-all duration-100 font-medium",
        // Ghost for icon buttons, tertiary actions
        ghost:
          "hover:bg-muted hover:text-foreground transition-all duration-100 font-medium",
        // Link style with Linear's accent
        link: "text-accent underline-offset-4 hover:underline hover:text-accent/80 transition-colors duration-100 font-medium",
      },
      size: {
        default:
          "h-11 px-6 py-2.5 has-[>svg]:px-5" /* More generous Linear padding */,
        sm: "h-9 rounded-md gap-1.5 px-4 has-[>svg]:px-3 text-xs",
        lg: "h-12 rounded-lg px-8 py-3 has-[>svg]:px-6 text-base" /* Generous padding */,
        icon: "size-11" /* 44px min for touch targets */,
        "icon-sm": "size-9",
        "icon-lg": "size-12" /* 48px for mobile */,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
