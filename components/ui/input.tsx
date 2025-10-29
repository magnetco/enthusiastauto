import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-[var(--color-brand-blue)] selection:text-white bg-background border-input h-11 w-full min-w-0 rounded-md border px-3 py-2 text-base shadow-sm transition-all duration-[var(--duration-fast)] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[var(--color-brand-blue)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)] focus-visible:ring-offset-1",
        "aria-invalid:ring-[var(--color-error-500)] dark:aria-invalid:ring-[var(--color-error-500)] aria-invalid:border-[var(--color-error-500)]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
