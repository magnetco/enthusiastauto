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
 * Styled for dark header with white text
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
        "px-3 lg:px-4 font-medium transition-colors duration-200 h-full flex items-center",
        isActive
          ? "text-white"
          : "text-white/70 hover:text-white",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
