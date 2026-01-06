"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  itemId: string;
  itemType: "vehicle" | "product";
  itemHandle?: string;
  initialIsSaved: boolean;
  onToggle?: (isSaved: boolean) => void;
  variant?: "default" | "minimal";
  className?: string;
}

export function FavoriteButton({
  itemId,
  itemType,
  itemHandle,
  initialIsSaved,
  onToggle,
  variant = "default",
  className,
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading" || isPending;

  const itemLabel = itemType === "vehicle" ? "vehicle" : "item";

  const handleClick = async () => {
    // Redirect to signin if not authenticated
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Optimistic update
    const previousState = isSaved;
    setIsSaved(!isSaved);

    startTransition(async () => {
      try {
        const endpoint = "/api/user/favorites";
        const method = previousState ? "DELETE" : "POST";

        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId, itemType, itemHandle }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Revert optimistic update
          setIsSaved(previousState);

          // Show error message
          if (response.status === 400 && data.limit) {
            toast.error(
              `Garage is full (${data.limit} items max). Remove items to add more.`
            );
          } else if (response.status === 409) {
            toast.error("Item already in garage");
          } else {
            toast.error(data.error || "Failed to update garage");
          }
          return;
        }

        // Success feedback
        const newState = !previousState;
        if (newState) {
          toast.success(`Added to My Garage`);
        } else {
          toast.success(`Removed from My Garage`);
        }

        // Call onToggle callback if provided
        onToggle?.(newState);
      } catch (error) {
        console.error("Favorite toggle error:", error);
        // Revert optimistic update
        setIsSaved(previousState);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const tooltipContent = !isAuthenticated
    ? `Sign in to save ${itemLabel}s`
    : isSaved
      ? `Remove from My Garage`
      : `Add to My Garage`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant === "minimal" ? "ghost" : "outline"}
            size="icon"
            onClick={handleClick}
            disabled={isLoading}
            className={cn(
              "relative transition-all",
              isSaved && "text-red-500 hover:text-red-600",
              className
            )}
            aria-label={tooltipContent}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <Heart
                className={cn(
                  "h-5 w-5 transition-all",
                  isSaved && "fill-current"
                )}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
