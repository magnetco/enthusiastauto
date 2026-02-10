"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { useMobileMenu } from "./MobileMenuContext";
import { useHeaderScroll } from "./StickyHeader";
import { cn } from "@/lib/utils";

/**
 * Hamburger button to open the mobile menu
 */
export function MobileMenuButton() {
  const { openMenu } = useMobileMenu();
  const isScrolled = useHeaderScroll();

  return (
    <button
      onClick={openMenu}
      aria-label="Open menu"
      className={cn(
        "flex h-10 w-10 items-center justify-center transition-colors duration-300",
        isScrolled
          ? "text-gray-600 hover:text-gray-900"
          : "text-white/70 hover:text-white"
      )}
    >
      <Bars3Icon className="h-6 w-6" />
    </button>
  );
}

