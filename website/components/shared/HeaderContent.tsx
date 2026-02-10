"use client";

import Link from "next/link";
import { Suspense } from "react";
import FlagIcon from "components/icons/flag";
import CartModal from "components/cart/modal";
import { NAV_ITEMS } from "@/lib/config/navigation";
import { DesktopNav } from "./DesktopNav";
import { MobileMenuButton } from "./MobileMenuButton";
import { FavoritesBadge } from "./FavoritesBadge";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderAuthButton } from "./HeaderAuthButton";
import { useHeaderScroll } from "./StickyHeader";
import { cn } from "@/lib/utils";

/**
 * Header content that adapts colors based on scroll state
 */
export function HeaderContent() {
  const isScrolled = useHeaderScroll();

  return (
    <>
      {/* Top Row: Logo, Search, Favorites, Cart (+ Hamburger on mobile) */}
      <div>
        <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between px-4 lg:h-20 lg:px-6">
          {/* Logo */}
          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80"
          >
            <FlagIcon
              className={cn(
                "h-8 w-auto transition-colors duration-300 lg:h-10",
                isScrolled ? "text-gray-900" : "text-white"
              )}
            />
            <span
              className={cn(
                "font-headline text-lg font-semibold transition-colors duration-300 lg:text-xl",
                isScrolled ? "text-gray-900" : "text-white"
              )}
            >
              ENTHUSIAST AUTO
            </span>
          </Link>

          {/* Right side: Search + Favorites + Cart (desktop) / Hamburger (mobile) */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Desktop: Search bar */}
            <div className="hidden lg:block">
              <Suspense fallback={<HeaderSearchSkeleton isScrolled={isScrolled} />}>
                <HeaderSearch />
              </Suspense>
            </div>

            {/* Desktop: Favorites badge */}
            <div className="hidden lg:block">
              <Suspense fallback={null}>
                <FavoritesBadge />
              </Suspense>
            </div>

            {/* Cart - visible on both */}
            <CartModal />

            {/* Mobile: Hamburger menu button */}
            <div className="lg:hidden">
              <MobileMenuButton />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Navigation links (desktop only) */}
      <div
        className={cn(
          "hidden border-y transition-colors duration-300 lg:block",
          isScrolled ? "border-gray-200/50" : "border-white/10"
        )}
      >
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="flex h-14 items-center">
            {/* Navigation Links - flex-1 to fill space */}
            <div className="flex-1">
              <DesktopNav items={NAV_ITEMS} />
            </div>

            {/* Vertical divider */}
            <div
              className={cn(
                "mx-6 h-8 w-px transition-colors duration-300",
                isScrolled ? "bg-gray-200" : "bg-white/10"
              )}
            />

            {/* Auth Button - flex-0 to stay compact */}
            <div className="flex-none">
              <Suspense fallback={null}>
                <HeaderAuthButton />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function HeaderSearchSkeleton({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div
      className={cn(
        "flex h-10 w-64 items-center rounded-md px-4 transition-colors duration-300",
        isScrolled ? "bg-gray-100" : "bg-white/5"
      )}
    >
      <span
        className={cn(
          "text-sm transition-colors duration-300",
          isScrolled ? "text-gray-400" : "text-white/40"
        )}
      >
        Search cars or parts
      </span>
    </div>
  );
}
