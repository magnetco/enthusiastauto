import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "light" | "dark";
}

function Input({ className, type, variant = "light", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - shared across variants
        "file:text-foreground selection:bg-[var(--color-brand-blue)] selection:text-white h-11 w-full min-w-0 rounded-lg border px-3 py-2 text-base transition-all duration-[var(--duration-fast)] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Focus ring - shared across variants
        "focus-visible:border-[var(--color-brand-blue)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)] focus-visible:ring-offset-1",
        // Error states - shared across variants
        "aria-invalid:ring-[var(--color-error-500)] dark:aria-invalid:ring-[var(--color-error-500)] aria-invalid:border-[var(--color-error-500)]",
        // Light variant (default) - for light backgrounds
        variant === "light" && [
          "bg-background border-input text-foreground",
          "placeholder:text-muted-foreground",
          "hover:border-[var(--color-brand-blue)]/50",
        ],
        // Dark variant - for dark backgrounds
        variant === "dark" && [
          "border-white/10 bg-white/5 text-white/70",
          "placeholder:text-white/50",
          "hover:bg-white/10 focus:bg-white/10",
        ],
        className,
      )}
      {...props}
    />
  );
}

export { Input };
