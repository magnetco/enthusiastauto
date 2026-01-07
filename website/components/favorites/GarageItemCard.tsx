"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Car, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GarageItem {
  id: string;
  title: string;
  price?: number | string;
  image?: string;
  specs?: string[];
  href: string;
}

interface GarageItemCardProps {
  item: GarageItem;
  itemType: "vehicle" | "product";
  onRemove: (itemId: string) => Promise<void>;
}

export function GarageItemCard({
  item,
  itemType,
  onRemove,
}: GarageItemCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    setIsHidden(true);

    try {
      await onRemove(item.id);
      toast.success("Removed from garage");
      setShowDialog(false);
    } catch (error) {
      console.error("Remove error:", error);
      setIsHidden(false);
      toast.error("Failed to remove. Try again.");
    } finally {
      setIsRemoving(false);
    }
  };

  if (isHidden) {
    return null;
  }

  const priceDisplay =
    typeof item.price === "number"
      ? `$${item.price.toLocaleString()}`
      : item.price || "Price on request";

  return (
    <>
      <Card className="group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
        <Link href={item.href} className="block">
          {/* Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                {itemType === "vehicle" ? (
                  <Car className="h-10 w-10 text-muted-foreground/40" />
                ) : (
                  <Package className="h-10 w-10 text-muted-foreground/40" />
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <span className="text-body-mini font-medium uppercase tracking-wide text-muted-foreground mb-1 block">
              {itemType}
            </span>
            <h3 className="text-body-base font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-body-large font-bold text-foreground">
              {priceDisplay}
            </p>
            {item.specs && item.specs.length > 0 && (
              <p className="text-body-small text-muted-foreground mt-2 line-clamp-1">
                {item.specs.join(" · ")}
              </p>
            )}
          </div>
        </Link>

        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDialog(true);
          }}
          className={cn(
            "absolute right-3 top-3 z-10 p-2.5 rounded-full",
            "bg-background/90 backdrop-blur-sm shadow-sm",
            "text-destructive hover:bg-background transition-colors"
          )}
          aria-label={`Remove ${item.title} from garage`}
        >
          <Heart className="h-5 w-5 fill-current" />
        </button>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from garage?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <span className="font-medium text-foreground">{item.title}</span> from
              your garage?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
