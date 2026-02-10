import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-headline text-[11px] transition-all disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2] focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Primary variant - fully rounded (90s BMW style)
        default:
          "rounded-full bg-primary text-primary-foreground hover:bg-accent transition-all duration-100",
        // Secondary variant - 2px border, fully rounded
        secondary:
          "rounded-full border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-100 px-6",
        // Shimmer variant - animated gradient border with mouse proximity effect (handled by ShimmerButton component)
        shimmer:
          "rounded-full bg-transparent text-white transition-all duration-100",
        // Destructive for dangerous actions - fully rounded
        destructive:
          "rounded-full bg-destructive text-white hover:opacity-90 transition-all duration-100 focus-visible:ring-destructive",
        // Outline for Cancel, Clear Filters - softer 12px corners
        outline:
          "rounded-xl border border-border bg-transparent hover:bg-muted hover:border-border/80 transition-all duration-100",
        // Ghost for icon buttons, tertiary actions - 8px corners
        ghost:
          "rounded-lg hover:bg-muted hover:text-foreground transition-all duration-100",
        // Link style with Linear's accent - no rounding needed
        link: "text-accent underline-offset-4 hover:underline hover:text-accent/80 transition-colors duration-100",
      },
      size: {
        default:
          "h-11 px-6 py-2.5 has-[>svg]:px-5" /* More generous Linear padding */,
        sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 px-8 py-3 has-[>svg]:px-6" /* Generous padding */,
        icon: "size-11 rounded-full" /* 44px min for touch targets */,
        "icon-sm": "size-9 rounded-full",
        "icon-lg": "size-12 rounded-full" /* 48px for mobile */,
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

  // When using asChild, Slot expects exactly one child
  // Wrap content in a fragment for regular buttons with loading state
  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </Comp>
    );
  }

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
