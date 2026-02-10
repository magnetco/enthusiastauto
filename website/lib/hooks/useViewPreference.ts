"use client";

import { useState, useEffect } from "react";

export type ViewMode = "list" | "grid" | "compact";

const STORAGE_KEY = "eag-inventory-view-preference";
const DEFAULT_VIEW: ViewMode = "list";

/**
 * Hook to manage inventory view preference with localStorage persistence
 * Defaults to 'list' view as specified in Figma design
 */
export function useViewPreference() {
  const [view, setView] = useState<ViewMode>(DEFAULT_VIEW);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === "list" || stored === "grid" || stored === "compact")) {
        setView(stored as ViewMode);
      }
    } catch (error) {
      console.error("Failed to load view preference:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when view changes
  const updateView = (newView: ViewMode) => {
    setView(newView);
    try {
      localStorage.setItem(STORAGE_KEY, newView);
    } catch (error) {
      console.error("Failed to save view preference:", error);
    }
  };

  return {
    view,
    setView: updateView,
    isHydrated, // Use this to prevent flash of wrong view
  };
}
