"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NavItem } from "@/lib/config/navigation";
import { InventoryMegaMenu } from "./InventoryMegaMenu";

interface DesktopNavProps {
  items: NavItem[];
}

/**
 * Desktop navigation bar with links and mega-menu support
 */
export function DesktopNav({ items }: DesktopNavProps) {
  const pathname = usePathname();
  const [inventoryOpen, setInventoryOpen] = useState(false);

  return (
    <nav className="flex items-center">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          if (item.hasSubmenu) {
            return (
              <li key={item.title} className="relative">
                <button
                  onClick={() => setInventoryOpen(!inventoryOpen)}
                  onMouseEnter={() => setInventoryOpen(true)}
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

                {/* Mega Menu */}
                <InventoryMegaMenu
                  isOpen={inventoryOpen}
                  onClose={() => setInventoryOpen(false)}
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

