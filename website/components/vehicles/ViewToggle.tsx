"use client";

import { cn } from "@/lib/utils";
import { Squares2X2Icon, ListBulletIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";
import type { ViewMode } from "@/lib/hooks/useViewPreference";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}

/**
 * View Toggle Component
 * Allows switching between list, grid, and compact view modes
 */
export function ViewToggle({ currentView, onViewChange, className }: ViewToggleProps) {
  const views: Array<{ mode: ViewMode; icon: typeof ListBulletIcon; label: string }> = [
    { mode: "list", icon: ListBulletIcon, label: "List" },
    { mode: "grid", icon: Squares2X2Icon, label: "Grid" },
    { mode: "compact", icon: ViewColumnsIcon, label: "Compact" },
  ];

  return (
    <div
      className={cn("inline-flex items-center gap-1 rounded-full bg-gray-100 p-1", className)}
      role="group"
      aria-label="View mode selection"
    >
      {views.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onViewChange(mode)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
            currentView === mode
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
          aria-label={`${label} View`}
          aria-pressed={currentView === mode}
          title={`${label} View`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
