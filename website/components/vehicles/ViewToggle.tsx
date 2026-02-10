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
    { mode: "list", icon: ListBulletIcon, label: "List View" },
    { mode: "grid", icon: Squares2X2Icon, label: "Grid View" },
    { mode: "compact", icon: ViewColumnsIcon, label: "Compact View" },
  ];

  return (
    <div
      className={cn("inline-flex rounded-lg border border-gray-200 bg-white p-1", className)}
      role="group"
      aria-label="View mode selection"
    >
      {views.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onViewChange(mode)}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
            "hover:bg-gray-100",
            currentView === mode
              ? "bg-blue-50 text-blue-600 shadow-sm"
              : "text-gray-600"
          )}
          aria-label={label}
          aria-pressed={currentView === mode}
          title={label}
        >
          <Icon className="h-5 w-5" />
          <span className="hidden sm:inline">{label.replace(" View", "")}</span>
        </button>
      ))}
    </div>
  );
}
