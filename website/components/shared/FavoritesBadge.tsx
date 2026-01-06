"use client";

import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Favorites badge component with count
 * Shows a star icon with the number of saved favorites in a bordered container
 */
export function FavoritesBadge() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);

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
      className="flex h-10 items-center gap-2 rounded-md border border-white/20 bg-transparent px-4 text-white/70 transition-colors hover:border-white/40 hover:text-white"
      aria-label={`Favorites (${count} items)`}
    >
      <StarIcon className="h-5 w-5" />
      <span className="text-sm font-medium">{count}</span>
    </Link>
  );
}

