"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SERVICES_MENU, type ServiceMenuItem } from "@/lib/config/navigation";
import { Sparkles, RefreshCw, Settings, Wrench } from "lucide-react";

interface ServicesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap = {
  sparkles: Sparkles,
  refresh: RefreshCw,
  settings: Settings,
  wrench: Wrench,
};

function ServiceCard({
  service,
  onClose,
}: {
  service: ServiceMenuItem;
  onClose: () => void;
}) {
  const Icon = iconMap[service.icon];

  return (
    <Link
      href={service.href}
      onClick={onClose}
      className="group flex flex-col rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-white group-hover:text-blue-400">
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed text-white/60">
        {service.description}
      </p>
    </Link>
  );
}

/**
 * Desktop mega-menu for Services navigation
 * Full-width dropdown with quick links and service cards
 */
export function ServicesMegaMenu({ isOpen, onClose }: ServicesMegaMenuProps) {
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
          <div className="flex py-6">
            {/* Left column: Quick links */}
            <div className="w-40 shrink-0 border-r border-white/10 pr-6">
              <button
                onClick={onClose}
                className="mb-6 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Close
              </button>

              <div className="h-px bg-white/10 mb-4" />

              <nav className="space-y-1">
                {SERVICES_MENU.quickLinks.map((link) => (
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

            {/* Right section: Service cards in a grid */}
            <div className="flex-1 pl-8">
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {SERVICES_MENU.services.map((service) => (
                  <ServiceCard
                    key={service.href}
                    service={service}
                    onClose={onClose}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

