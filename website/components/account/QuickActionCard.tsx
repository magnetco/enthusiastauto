import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  stat?: string | number;
  statLabel?: string;
  variant?: "default" | "primary" | "gradient";
}

export function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  stat,
  statLabel,
  variant = "default",
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border p-5 transition-all duration-200",
        variant === "default" &&
          "bg-card hover:border-primary/50 hover:shadow-[var(--shadow-medium)]",
        variant === "primary" &&
          "border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10",
        variant === "gradient" &&
          "border-transparent bg-gradient-to-br from-primary/10 via-accent/5 to-transparent hover:from-primary/15 hover:via-accent/10"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "mb-4 flex h-11 w-11 items-center justify-center rounded-lg transition-colors",
          variant === "default" && "bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground",
          variant === "primary" && "bg-primary/10 text-primary",
          variant === "gradient" && "bg-primary/10 text-primary"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="mb-1 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Stat Badge */}
      {stat !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">{stat}</span>
          {statLabel && (
            <span className="text-sm text-muted-foreground">{statLabel}</span>
          )}
        </div>
      )}

      {/* Arrow */}
      <ChevronRight
        className={cn(
          "absolute right-4 top-5 h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5"
        )}
      />
    </Link>
  );
}

