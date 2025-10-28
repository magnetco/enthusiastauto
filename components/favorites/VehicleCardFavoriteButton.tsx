"use client";

import { useEffect, useState } from "react";
import { FavoriteButton } from "./FavoriteButton";
import { useSession } from "next-auth/react";

interface VehicleCardFavoriteButtonProps {
  itemId: string;
  itemHandle: string;
  itemType: "vehicle" | "product";
}

export function VehicleCardFavoriteButton({
  itemId,
  itemHandle,
  itemType,
}: VehicleCardFavoriteButtonProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkFavoriteStatus() {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/user/favorites");
        if (response.ok) {
          const data = await response.json();
          const favorite = data.favorites?.find(
            (f: any) => f.itemId === itemId && f.itemType === itemType
          );
          setIsSaved(!!favorite);
        }
      } catch (error) {
        console.error("Failed to check favorite status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkFavoriteStatus();
  }, [itemId, itemType, session?.user?.id]);

  if (isLoading) {
    return null; // Don't show button while loading to avoid layout shift
  }

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <FavoriteButton
        itemId={itemId}
        itemType={itemType}
        itemHandle={itemHandle}
        initialIsSaved={isSaved}
        variant="minimal"
        onToggle={(newState) => setIsSaved(newState)}
      />
    </div>
  );
}
