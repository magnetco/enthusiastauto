"use client";

import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useHeaderScroll } from "./StickyHeader";
import { cn } from "@/lib/utils";

/**
 * Favorites badge component with count
 * Shows a star icon with the number of saved favorites in a bordered container
 */
export function FavoritesBadge() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);
  const isScrolled = useHeaderScroll();

  // Fetch favorites count when logged in
  useEffect(() => {
    async function fetchCount() {
      if (!session?.user) {
        setCount(0);
        return;
      }

      try {
        const response = await fetch("/api/user/favorites");
        if (response.ok) {
          const data = await response.json();
          setCount(data.favorites?.length || 0);
        }
      } catch (error) {
        console.error("Failed to fetch favorites count:", error);
      }
    }

    fetchCount();
  }, [session]);

  return (
    <Link
      href="/account/garage"
      className={cn(
        "flex h-10 items-center gap-2 rounded-md px-4 transition-colors duration-300",
        isScrolled
          ? "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
      )}
      aria-label={`Favorites (${count} items)`}
    >
      <StarIcon className="h-5 w-5" />
      <span className="text-sm font-medium">{count}</span>
    </Link>
  );
}

