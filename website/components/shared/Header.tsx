import Link from "next/link";
import { Suspense } from "react";
import Logo from "components/logo";
import FlagIcon from "components/icons/flag";
import CartModal from "components/cart/modal";
import { NAV_ITEMS } from "@/lib/config/navigation";
import { DesktopNav } from "./DesktopNav";
import { MobileMenuButton } from "./MobileMenuButton";
import { FavoritesBadge } from "./FavoritesBadge";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderAuthButton } from "./HeaderAuthButton";

/**
 * Main Header component with two-row layout on desktop
 * and simplified single row with hamburger menu on mobile
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]">
      {/* Top Row: Logo, Search, Favorites, Cart (+ Hamburger on mobile) */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between px-4 lg:h-20 lg:px-6">
          {/* Logo */}
          <Link
            href="/"
            prefetch={true}
            className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80"
          >
            <FlagIcon className="h-8 w-auto lg:h-10" />
            <span className="text-lg font-semibold tracking-wide text-white lg:text-xl">
              ENTHUSIAST AUTO
            </span>
          </Link>

          {/* Right side: Search + Favorites + Cart (desktop) / Hamburger (mobile) */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Desktop: Search bar */}
            <div className="hidden lg:block">
              <Suspense fallback={<HeaderSearchSkeleton />}>
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
      <div className="hidden border-b border-white/10 lg:block">
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Navigation Links */}
            <DesktopNav items={NAV_ITEMS} />

            {/* Auth Button */}
            <Suspense fallback={null}>
              <HeaderAuthButton />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeaderSearchSkeleton() {
  return (
    <div className="flex h-10 w-64 items-center rounded-full border border-white/20 bg-white/5 px-4">
      <span className="text-sm text-white/40">Search cars or parts</span>
    </div>
  );
}

