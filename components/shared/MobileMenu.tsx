"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Menu } from "lib/shopify/types";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";
import { NavLink } from "./NavLink";
import SearchBar, { SearchBarSkeleton } from "./SearchBar";

interface MobileMenuProps {
  menu: Menu[];
}

/**
 * Mobile hamburger menu with drawer navigation
 * Visible only on mobile viewports (<md breakpoint)
 */
export default function MobileMenu({ menu }: MobileMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  // Close menu on window resize above md breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors md:hidden dark:border-neutral-700 dark:text-white"
      >
        <Bars3Icon className="h-4" />
      </button>

      {/* Mobile Drawer */}
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          {/* Drawer Panel */}
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black">
              <div className="p-4">
                {/* Close Button */}
                <button
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6" />
                </button>

                {/* Search Bar */}
                <div className="mb-4 w-full">
                  <Suspense fallback={<SearchBarSkeleton />}>
                    <SearchBar />
                  </Suspense>
                </div>

                {/* Navigation Links */}
                <nav role="navigation" aria-label="Mobile navigation">
                  <ul className="flex w-full flex-col gap-2">
                    {/* Primary Links */}
                    <li>
                      <NavLink
                        href="/vehicles"
                        className="block py-3 text-xl min-h-[44px] flex items-center"
                      >
                        Vehicles
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        href="/products"
                        className="block py-3 text-xl min-h-[44px] flex items-center"
                      >
                        Parts
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        href="/services"
                        className="block py-3 text-xl min-h-[44px] flex items-center"
                      >
                        Services
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        href="/about"
                        className="block py-3 text-xl min-h-[44px] flex items-center"
                      >
                        About
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        href="/contact"
                        className="block py-3 text-xl min-h-[44px] flex items-center"
                      >
                        Contact
                      </NavLink>
                    </li>

                    {/* Additional Menu Items */}
                    {menu.length
                      ? menu
                          .filter(
                            (item) =>
                              ![
                                "Vehicles",
                                "Parts",
                                "Services",
                                "About",
                                "Contact",
                              ].includes(item.title),
                          )
                          .map((item: Menu) => (
                            <li key={item.title}>
                              <NavLink
                                href={item.path}
                                className="block py-3 text-xl min-h-[44px] flex items-center"
                              >
                                {item.title}
                              </NavLink>
                            </li>
                          ))
                      : null}
                  </ul>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
