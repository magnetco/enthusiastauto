import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import { getMenu } from "lib/shopify";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./MobileMenu";
import { NavLink } from "./NavLink";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const { SITE_NAME } = process.env;

export async function Navigation() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="relative flex items-center justify-between p-4 lg:px-8 lg:py-5">
        {/* Mobile Menu Button */}
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>

        {/* Main Content Container */}
        <div className="flex w-full items-center">
          {/* Logo and Desktop Navigation Links */}
          <div className="flex w-full md:w-1/3">
            <Link
              href="/"
              prefetch={true}
              className="mr-2 flex w-full items-center justify-center transition-opacity duration-200 hover:opacity-80 md:w-auto lg:mr-8"
            >
              <LogoSquare />
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden gap-8 text-sm md:flex md:items-center">
              {/* Primary navigation links: Vehicles, Parts, About, Contact */}
              <li>
                <NavLink href="/vehicles">Vehicles</NavLink>
              </li>
              <li>
                <NavLink href="/products">Parts</NavLink>
              </li>
              <li>
                <NavLink href="/services">Services</NavLink>
              </li>
              <li>
                <NavLink href="/about">About</NavLink>
              </li>
              <li>
                <NavLink href="/contact">Contact</NavLink>
              </li>
              {/* Additional menu items from Shopify */}
              {menu.length
                ? menu
                    .filter(
                      (item) =>
                        !["Vehicles", "Parts", "Services", "About", "Contact"].includes(
                          item.title,
                        ),
                    )
                    .map((item) => (
                      <li key={item.title}>
                        <NavLink href={item.path}>{item.title}</NavLink>
                      </li>
                    ))
                : null}
            </ul>
          </div>

          {/* Search Bar (Center) */}
          <div className="hidden justify-center md:flex md:w-1/3">
            <Suspense fallback={<SearchBarSkeleton />}>
              <SearchBar />
            </Suspense>
          </div>

          {/* User Menu and Cart (Right) */}
          <div className="flex items-center justify-end gap-4 md:w-1/3">
            <UserMenu />
            <CartModal />
          </div>
        </div>
      </div>
    </nav>
  );
}

function SearchBarSkeleton() {
  return (
    <div className="w-full lg:w-80 xl:w-full">
      <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
