"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment } from "react";
import FlagIcon from "components/icons/flag";
import { MOBILE_SERVICES_MENU } from "@/lib/config/navigation";
import { useMobileMenu } from "./MobileMenuContext";
import { Sparkles, RefreshCw, Settings, Wrench } from "lucide-react";

const iconMap = {
  sparkles: Sparkles,
  refresh: RefreshCw,
  settings: Settings,
  wrench: Wrench,
};

/**
 * Mobile services submenu panel
 * Slides in from the right on top of the main menu
 */
export function MobileServicesPanel() {
  const { isOpen, servicesPanelOpen, closeServicesPanel, closeMenu } =
    useMobileMenu();

  const handleLinkClick = () => {
    closeServicesPanel();
    closeMenu();
  };

  return (
    <Transition show={isOpen && servicesPanelOpen}>
      <Dialog onClose={closeServicesPanel} className="relative z-[60]">
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
          <Dialog.Panel className="fixed inset-y-0 left-0 flex w-full max-w-sm flex-col bg-[#0a0a0a]">
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
                onClick={closeServicesPanel}
                className="flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Back to main menu</span>
              </button>
            </div>

            {/* Services Content */}
            <nav className="flex-1 overflow-y-auto px-6 py-6">
              {/* Quick Links */}
              <ul className="space-y-1">
                {MOBILE_SERVICES_MENU.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className="block py-2 text-base font-medium text-white transition-colors hover:text-blue-400"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="my-4 h-px bg-white/10" />

              {/* Service Items */}
              <ul className="space-y-2">
                {MOBILE_SERVICES_MENU.services.map((service) => {
                  const Icon = iconMap[service.icon];
                  return (
                    <li key={service.href}>
                      <Link
                        href={service.href}
                        onClick={handleLinkClick}
                        className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-white/5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="block text-base font-medium text-white">
                            {service.title}
                          </span>
                          <span className="mt-0.5 block text-sm text-white/60">
                            {service.description}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

