"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
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
      toast.success("Removed from My Garage");
      setShowDialog(false);
    } catch (error) {
      console.error("Remove error:", error);
      setIsHidden(false);
      toast.error("Failed to remove item. Please try again.");
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
      <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
        <Link href={item.href} className="block">
          <CardHeader className="p-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <CardTitle className="mb-2 line-clamp-2 text-lg">
              {item.title}
            </CardTitle>
            <CardDescription className="mb-3 text-base font-semibold text-foreground">
              {priceDisplay}
            </CardDescription>

            {item.specs && item.specs.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {item.specs.map((spec, index) => (
                  <span key={index}>{spec}</span>
                ))}
              </div>
            )}
          </CardContent>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-2 top-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90",
            "text-red-500 hover:text-red-600"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDialog(true);
          }}
          aria-label={`Remove ${item.title} from garage`}
        >
          <Heart className="h-5 w-5 fill-current" />
        </Button>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from My Garage?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">{item.title}</span> from your
              garage?
            </AlertDialogDescription>
          </AlertDialogHeader>
          {item.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          )}
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
