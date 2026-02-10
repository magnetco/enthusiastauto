"use client";

import Link from "next/link";
import { Suspense } from "react";
import FlagIcon from "components/icons/flag";
import CartModal from "components/cart/modal";
import { NAV_ITEMS } from "@/lib/config/navigation";
import { FavoritesBadge } from "./FavoritesBadge";
import { HeaderAuthButton } from "./HeaderAuthButton";
import { DesktopNav } from "./DesktopNav";
import { MobileMenuButton } from "./MobileMenuButton";
import { cn } from "@/lib/utils";
import { useHeaderScroll } from "./SmartStickyHeader";

/**
 * Single-row header with mega-menu dropdowns
 * Layout: Logo | Nav Links with Dropdowns | Favorites, Cart, Auth (+ Hamburger on mobile)
 */
export function SingleRowHeader() {
  const { isScrolled } = useHeaderScroll();

  return (
    <div className="flex h-20 items-center justify-between px-6">
      {/* Logo */}
      <Link
        href="/"
        prefetch={true}
        className={cn(
          "flex flex-none items-center gap-3 transition-all duration-200 hover:opacity-80",
          // Hide logo text on smaller screens to save space
          "lg:gap-3"
        )}
      >
        <FlagIcon
          className={cn(
            "h-8 w-auto transition-colors duration-300 lg:h-10",
            isScrolled ? "text-white" : "text-white"
          )}
        />
        <span
          className={cn(
            "hidden font-headline text-xl font-semibold transition-colors duration-300 sm:inline",
            isScrolled ? "text-white" : "text-white"
          )}
        >
          ENTHUSIAST AUTO
        </span>
      </Link>

      {/* Center: Navigation Links with Mega Menus (Desktop only) */}
      <div className="hidden flex-1 items-center justify-center lg:flex">
        <DesktopNav items={NAV_ITEMS} />
      </div>

      {/* Right: Favorites, Cart, Auth */}
      <div className="flex flex-none items-center gap-2 lg:gap-4">
        {/* Desktop: Favorites badge */}
        <div className="hidden lg:block">
          <Suspense fallback={null}>
            <FavoritesBadge />
          </Suspense>
        </div>

        {/* Cart - visible on both */}
        <CartModal />

        {/* Desktop: Auth Button */}
        <div className="hidden lg:block">
          <Suspense fallback={<AuthButtonSkeleton />}>
            <HeaderAuthButton />
          </Suspense>
        </div>

        {/* Mobile: Hamburger menu button */}
        <div className="lg:hidden">
          <MobileMenuButton />
        </div>
      </div>
    </div>
  );
}

function AuthButtonSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
      <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
    </div>
  );
}
