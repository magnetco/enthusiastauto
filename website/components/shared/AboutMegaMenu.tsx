"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ABOUT_MENU, type AboutMenuItem } from "@/lib/config/navigation";

interface AboutMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function AboutCard({
  item,
  onClose,
}: {
  item: AboutMenuItem;
  onClose: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className="group flex flex-col rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10"
    >
      <h3 className="mb-2 text-base font-semibold text-white group-hover:text-blue-400">
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed text-white/60">
        {item.description}
      </p>
    </Link>
  );
}

/**
 * Desktop mega-menu for About navigation
 * Full-width dropdown with about items
 */
export function AboutMegaMenu({ isOpen, onClose }: AboutMegaMenuProps) {
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
      <div className="w-full border-y border-white/10 bg-[#0a0c10] shadow-2xl">
        {/* Content container - aligned with header */}
        <div className="mx-auto max-w-[var(--container-max)] px-6">
          <div className="py-6">
            <button
              onClick={onClose}
              className="mb-6 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Close
            </button>

            <div className="h-px bg-white/10 mb-6" />

            {/* About items in a grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:max-w-2xl">
              {ABOUT_MENU.items.map((item) => (
                <AboutCard key={item.href} item={item} onClose={onClose} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
