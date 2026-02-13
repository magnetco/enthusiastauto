"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NavItem } from "@/lib/config/navigation";
import { AboutMegaMenu } from "./AboutMegaMenu";
import { InventoryMegaMenu } from "./InventoryMegaMenu";
import { ServicesMegaMenu } from "./ServicesMegaMenu";
import { ContactMegaMenu } from "./ContactMegaMenu";
import { useHeaderScroll } from "./StickyHeader";

interface DesktopNavProps {
  items: NavItem[];
}

/**
 * Desktop navigation bar with links and mega-menu support
 */
export function DesktopNav({ items }: DesktopNavProps) {
  const pathname = usePathname();
  const isScrolled = useHeaderScroll();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const closeAllMenus = () => {
    setAboutOpen(false);
    setInventoryOpen(false);
    setServicesOpen(false);
    setContactOpen(false);
  };

  return (
    <nav className="flex items-center">
      <ul className="flex w-full items-center justify-between">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          if (item.hasSubmenu && item.submenuType === "about") {
            return (
              <li key={item.title} className="relative">
                <button
                  onClick={() => {
                    closeAllMenus();
                    setAboutOpen(!aboutOpen);
                  }}
                  onMouseEnter={() => {
                    closeAllMenus();
                    setAboutOpen(true);
                  }}
                  className={cn(
                    "font-headline px-4 py-2 text-[11px] font-semibold transition-colors duration-200",
                    isScrolled
                      ? isActive || aboutOpen
                        ? "text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                      : isActive || aboutOpen
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "border-b-2 pb-1 transition-colors duration-200",
                      isActive || aboutOpen
                        ? "border-blue-500"
                        : "border-transparent"
                    )}
                  >
                    {item.title}
                  </span>
                </button>

                {/* About Mega Menu */}
                <AboutMegaMenu
                  isOpen={aboutOpen}
                  onClose={() => setAboutOpen(false)}
                />
              </li>
            );
          }

          if (item.hasSubmenu && item.submenuType === "inventory") {
            return (
              <li key={item.title} className="relative">
                <button
                  onClick={() => {
                    closeAllMenus();
                    setInventoryOpen(!inventoryOpen);
                  }}
                  onMouseEnter={() => {
                    closeAllMenus();
                    setInventoryOpen(true);
                  }}
                  className={cn(
                    "font-headline px-4 py-2 text-[11px] font-semibold transition-colors duration-200",
                    isScrolled
                      ? isActive || inventoryOpen
                        ? "text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                      : isActive || inventoryOpen
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "border-b-2 pb-1 transition-colors duration-200",
                      isActive || inventoryOpen
                        ? "border-blue-500"
                        : "border-transparent"
                    )}
                  >
                    {item.title}
                  </span>
                </button>

                {/* Inventory Mega Menu */}
                <InventoryMegaMenu
                  isOpen={inventoryOpen}
                  onClose={() => setInventoryOpen(false)}
                />
              </li>
            );
          }

          if (item.hasSubmenu && item.submenuType === "services") {
            return (
              <li key={item.title} className="relative">
                <button
                  onClick={() => {
                    closeAllMenus();
                    setServicesOpen(!servicesOpen);
                  }}
                  onMouseEnter={() => {
                    closeAllMenus();
                    setServicesOpen(true);
                  }}
                  className={cn(
                    "font-headline px-4 py-2 text-[11px] font-semibold transition-colors duration-200",
                    isScrolled
                      ? isActive || servicesOpen
                        ? "text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                      : isActive || servicesOpen
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "border-b-2 pb-1 transition-colors duration-200",
                      isActive || servicesOpen
                        ? "border-blue-500"
                        : "border-transparent"
                    )}
                  >
                    {item.title}
                  </span>
                </button>

                {/* Services Mega Menu */}
                <ServicesMegaMenu
                  isOpen={servicesOpen}
                  onClose={() => setServicesOpen(false)}
                />
              </li>
            );
          }

          if (item.hasSubmenu && item.submenuType === "contact") {
            return (
              <li key={item.title} className="relative">
                <button
                  onClick={() => {
                    closeAllMenus();
                    setContactOpen(!contactOpen);
                  }}
                  onMouseEnter={() => {
                    closeAllMenus();
                    setContactOpen(true);
                  }}
                  className={cn(
                    "font-headline px-4 py-2 text-[11px] font-semibold transition-colors duration-200",
                    isScrolled
                      ? isActive || contactOpen
                        ? "text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                      : isActive || contactOpen
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "border-b-2 pb-1 transition-colors duration-200",
                      isActive || contactOpen
                        ? "border-blue-500"
                        : "border-transparent"
                    )}
                  >
                    {item.title}
                  </span>
                </button>

                {/* Contact Mega Menu */}
                <ContactMegaMenu
                  isOpen={contactOpen}
                  onClose={() => setContactOpen(false)}
                />
              </li>
            );
          }

          return (
            <li key={item.title}>
              <Link
                href={item.href}
                prefetch={true}
                className={cn(
                  "font-headline px-4 py-2 text-[11px] font-semibold transition-colors duration-200",
                  isScrolled
                    ? isActive
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                    : isActive
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "border-b-2 pb-1 transition-colors duration-200",
                    isActive
                      ? "border-blue-500"
                      : "border-transparent"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
