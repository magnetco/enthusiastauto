"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NavItem } from "@/lib/config/navigation";
import { InventoryMegaMenu } from "./InventoryMegaMenu";
import { ServicesMegaMenu } from "./ServicesMegaMenu";

interface DesktopNavProps {
  items: NavItem[];
}

/**
 * Desktop navigation bar with links and mega-menu support
 */
export function DesktopNav({ items }: DesktopNavProps) {
  const pathname = usePathname();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const closeAllMenus = () => {
    setInventoryOpen(false);
    setServicesOpen(false);
  };

  return (
    <nav className="flex items-center">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname.startsWith(item.href);

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
                    "px-4 py-2 text-sm font-medium transition-colors duration-200",
                    isActive || inventoryOpen
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "border-b-2 pb-1",
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
                    "px-4 py-2 text-sm font-medium transition-colors duration-200",
                    isActive || servicesOpen
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "border-b-2 pb-1",
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

          return (
            <li key={item.title}>
              <Link
                href={item.href}
                prefetch={true}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-white/70 hover:text-white"
                )}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
