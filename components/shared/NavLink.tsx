"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Navigation link with active state detection
 * Highlights the link when the current path matches
 */
export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();

  // Check if the current path matches this link
  // For root path, exact match. For others, check if path starts with href
  const isActive =
    href === "/"
      ? pathname === href
      : pathname.startsWith(href) && pathname !== "/";

  return (
    <Link
      href={href}
      prefetch={true}
      className={cn(
        "font-medium transition-colors duration-200 h-full flex items-center",
        isActive
          ? "text-foreground underline decoration-2 underline-offset-4"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
