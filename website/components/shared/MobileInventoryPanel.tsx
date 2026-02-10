"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment } from "react";
import FlagIcon from "components/icons/flag";
import { MOBILE_INVENTORY_MENU } from "@/lib/config/navigation";
import { useMobileMenu } from "./MobileMenuContext";

/**
 * Mobile inventory submenu panel
 * Slides in from the right on top of the main menu
 */
export function MobileInventoryPanel() {
  const { isOpen, inventoryPanelOpen, closeInventoryPanel, closeMenu } =
    useMobileMenu();

  const handleLinkClick = () => {
    closeInventoryPanel();
    closeMenu();
  };

  return (
    <Transition show={isOpen && inventoryPanelOpen}>
      <Dialog onClose={closeInventoryPanel} className="relative z-[60]">
        {/* No backdrop - main menu backdrop is still visible */}
        <Transition.Child
          as={Fragment}
          enter="transition-transform ease-out duration-250"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition-transform ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel className="fixed inset-y-0 left-0 flex w-full max-w-sm flex-col bg-[#0a0c10]">
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
              <Link
                href="/"
                onClick={handleLinkClick}
                className="flex items-center gap-2"
              >
                <FlagIcon className="h-8 w-auto" />
                <span className="text-base font-semibold tracking-wide text-white">
                  ENTHUSIAST AUTO
                </span>
              </Link>
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Back button */}
            <div className="border-b border-white/10 px-6 py-4">
              <button
                onClick={closeInventoryPanel}
                className="flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Back to main menu</span>
              </button>
            </div>

            {/* Inventory Content */}
            <nav className="flex-1 overflow-y-auto px-6 py-6">
              {/* Quick Links */}
              <ul className="space-y-1">
                {MOBILE_INVENTORY_MENU.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className="block py-2 text-base text-white/70 transition-colors hover:text-white"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Model Categories */}
              {MOBILE_INVENTORY_MENU.modelCategories.map((category) => (
                <div key={category.name} className="mt-6">
                  {/* Category Header */}
                  <h3 className="text-base font-semibold text-white">
                    {category.name}
                  </h3>

                  {/* Chassis Links */}
                  {category.chassis.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {category.chassis.map((chassis) => (
                        <li key={chassis}>
                          <Link
                            href={`/vehicles?chassis=${encodeURIComponent(chassis)}`}
                            onClick={handleLinkClick}
                            className="block py-2 text-base text-white/60 transition-colors hover:text-white"
                          >
                            {chassis}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

