"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
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
        "fixed left-0 right-0 top-[var(--header-height)] z-50 transition-all duration-200",
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-2 opacity-0 pointer-events-none"
      )}
    >
      {/* Full-width background */}
      <div className="w-full border-y border-white/10 bg-[#0a0a0a] shadow-2xl">
        {/* Content container - aligned with header */}
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="flex py-6">
            {/* Left column: Quick links */}
            <div className="w-56 shrink-0 border-r border-white/10 pr-6">
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
            <div className="flex flex-1 justify-between pl-12">
              {INVENTORY_MENU.chassisCodes.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-3">
                  {column.items.map((chassis) => (
                    <Link
                      key={chassis}
                      href={`/vehicles?chassis=${chassis}`}
                      onClick={onClose}
                      className="block py-1 text-sm font-medium text-white/70 transition-colors hover:text-white"
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
    </div>
  );
}

