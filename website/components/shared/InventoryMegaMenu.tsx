"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { INVENTORY_MENU } from "@/lib/config/navigation";

interface InventoryMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Desktop mega-menu for Inventory navigation
 * Full-width dropdown with quick links and chassis code columns
 */
export function InventoryMegaMenu({ isOpen, onClose }: InventoryMegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <div
      ref={menuRef}
      onMouseLeave={onClose}
      className={cn(
        "absolute left-0 top-full z-50 mt-2 origin-top-left transition-all duration-200",
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-2 opacity-0"
      )}
    >
      {/* Arrow pointer */}
      <div className="absolute -top-1 left-8 h-3 w-3 rotate-45 border-l border-t border-white/20 bg-[#0f0f0f]" />

      {/* Menu panel */}
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0f0f0f] shadow-2xl">
        <div className="flex min-w-[700px]">
          {/* Left column: Quick links */}
          <div className="w-56 border-r border-white/10 p-6">
            <button
              onClick={onClose}
              className="mb-6 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Close
            </button>

            <div className="h-px bg-white/10 mb-4" />

            <nav className="space-y-1">
              {INVENTORY_MENU.quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="block py-2 text-sm text-white/70 transition-colors hover:text-white"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right section: Chassis codes in columns */}
          <div className="flex flex-1 gap-8 p-6">
            {INVENTORY_MENU.chassisCodes.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-2">
                {column.items.map((chassis) => (
                  <Link
                    key={chassis}
                    href={`/vehicles?chassis=${chassis}`}
                    onClick={onClose}
                    className="block py-1 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {chassis}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

