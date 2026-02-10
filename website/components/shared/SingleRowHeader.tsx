"use client";

import Link from "next/link";
import { Suspense } from "react";
import FlagIcon from "components/icons/flag";
import CartModal from "components/cart/modal";
import { NAV_ITEMS } from "@/lib/config/navigation";
import { FavoritesBadge } from "./FavoritesBadge";
import { HeaderAuthButton } from "./HeaderAuthButton";

/**
 * Single-row full-width header variant
 * Layout: Logo | Nav Links | Wishlist, Cart, Sign In
 * No search input, no container max-width
 */
export function SingleRowHeader() {
  return (
    <header className="w-full border-t border-white/10 bg-bg-dark-blue-primary">
      <div className="flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          prefetch={true}
          className="flex flex-none items-center gap-3 transition-opacity duration-200 hover:opacity-80"
        >
          <FlagIcon className="h-10 w-auto" />
          <span className="font-headline text-xl font-semibold text-white">
            ENTHUSIAST AUTO
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="flex flex-1 items-center justify-center">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.title} item={item} />
            ))}
          </ul>
        </nav>

        {/* Right: Wishlist, Cart, Auth */}
        <div className="flex flex-none items-center gap-4">
          {/* Favorites badge */}
          <Suspense fallback={null}>
            <FavoritesBadge />
          </Suspense>

          {/* Cart */}
          <CartModal />

          {/* Auth Button */}
          <Suspense fallback={<AuthButtonSkeleton />}>
            <HeaderAuthButton />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

/**
 * Individual nav link
 */
function NavLink({ item }: { item: { title: string; href: string } }) {
  return (
    <li>
      <Link
        href={item.href}
        prefetch={true}
        className="font-headline text-[11px] font-semibold text-white/70 transition-colors duration-200 hover:text-white"
      >
        {item.title}
      </Link>
    </li>
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
