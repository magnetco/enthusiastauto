"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { useMobileMenu } from "./MobileMenuContext";

/**
 * Hamburger button to open the mobile menu
 */
export function MobileMenuButton() {
  const { openMenu } = useMobileMenu();

  return (
    <button
      onClick={openMenu}
      aria-label="Open menu"
      className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
    >
      <Bars3Icon className="h-6 w-6" />
    </button>
  );
}

