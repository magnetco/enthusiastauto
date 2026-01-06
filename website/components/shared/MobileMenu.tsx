"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import FlagIcon from "components/icons/flag";
import { NAV_ITEMS } from "@/lib/config/navigation";
import { useMobileMenu } from "./MobileMenuContext";
import { MobileInventoryPanel } from "./MobileInventoryPanel";

/**
 * Mobile menu slide-over panel with nested inventory submenu
 */
export function MobileMenu() {
  const pathname = usePathname();
  const {
    isOpen,
    closeMenu,
    inventoryPanelOpen,
    openInventoryPanel,
  } = useMobileMenu();

  return (
    <>
      <Transition show={isOpen}>
        <Dialog onClose={closeMenu} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
          </Transition.Child>

          {/* Panel */}
          <Transition.Child
            as={Fragment}
            enter="transition-transform ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 left-0 flex w-full max-w-sm flex-col bg-[#0a0a0a]">
              {/* Header */}
              <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
                <Link href="/" onClick={closeMenu} className="flex items-center">
                  <FlagIcon className="h-8 w-auto" />
                </Link>
                <button
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-6 py-6">
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    if (item.hasSubmenu) {
                      return (
                        <li key={item.title}>
                          <button
                            onClick={openInventoryPanel}
                            className="flex w-full items-center justify-between py-3 text-base font-medium text-white/90 transition-colors hover:text-white"
                          >
                            <span>{item.title}</span>
                            <ChevronRightIcon className="h-5 w-5 text-white/50" />
                          </button>
                        </li>
                      );
                    }

                    const isActive =
                      item.href === "/"
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                      <li key={item.title}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={`block py-3 text-base font-medium transition-colors ${
                            isActive
                              ? "text-white"
                              : "text-white/70 hover:text-white"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Separator */}
                <div className="my-6 h-px bg-white/10" />

                {/* Account Links */}
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/account"
                      onClick={closeMenu}
                      className="block py-3 text-base font-medium text-white/70 transition-colors hover:text-white"
                    >
                      Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/garage"
                      onClick={closeMenu}
                      className="block py-3 text-base font-medium text-white/70 transition-colors hover:text-white"
                    >
                      Favorites
                    </Link>
                  </li>
                </ul>
              </nav>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Inventory Sub-panel */}
      <MobileInventoryPanel />
    </>
  );
}
