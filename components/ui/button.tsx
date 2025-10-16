import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-[var(--duration-fast)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)] focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Primary variant with brand-red (Add to Cart, Checkout)
        default:
          "bg-[var(--color-brand-red)] text-white hover:bg-[#b91c21] hover:shadow-md dark:bg-[var(--color-brand-red)] dark:hover:bg-[#b91c21]",
        // Secondary variant with brand-blue (View Details, Compare)
        secondary:
          "bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-primary-600)] hover:shadow-md dark:bg-[var(--color-brand-blue)] dark:hover:bg-[var(--color-primary-600)]",
        // Destructive for dangerous actions
        destructive:
          "bg-[var(--color-error-500)] text-white hover:bg-[var(--color-error-700)] hover:shadow-md focus-visible:ring-[var(--color-error-500)]",
        // Outline for Cancel, Clear Filters
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        // Ghost for icon buttons, tertiary actions
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        // Link style
        link: "text-[var(--color-brand-blue)] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 px-4 py-2 has-[>svg]:px-3" /* 44px min height for WCAG AA */,
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-md px-6 has-[>svg]:px-4" /* 48px for better mobile UX */,
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
