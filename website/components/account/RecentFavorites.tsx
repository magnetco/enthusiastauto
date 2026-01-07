"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Heart, Car, Package } from "lucide-react";

interface FavoriteItem {
  id: string;
  type: "vehicle" | "product";
  title: string;
  price?: number | string;
  image?: string;
  href: string;
}

interface RecentFavoritesProps {
  items: FavoriteItem[];
  maxItems?: number;
  showHeader?: boolean;
}

export function RecentFavorites({ items, maxItems = 4, showHeader = false }: RecentFavoritesProps) {
  const displayItems = items.slice(0, maxItems);

  // Empty State
  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Heart className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-body-large font-semibold text-foreground mb-2">
            No favorites yet
          </h3>
          <p className="text-body-base text-muted-foreground mb-6 max-w-sm">
            Save vehicles and parts to quickly access them later.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 text-body-base font-medium text-primary hover:underline"
            >
              Browse Vehicles
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/parts"
              className="inline-flex items-center gap-2 text-body-base font-medium text-primary hover:underline"
            >
              Shop Parts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Optional Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-brand-red font-semibold">///</span>
            <h2 className="text-title-3 font-semibold text-foreground">
              Recent Favorites
            </h2>
          </div>
          <Link
            href="/account/garage"
            className="inline-flex items-center gap-1 text-body-small font-medium text-primary hover:underline"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Favorites Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {displayItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
          >
            <div className="flex gap-4 p-4">
              {/* Thumbnail */}
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    {item.type === "vehicle" ? (
                      <Car className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <span className="text-body-mini font-medium uppercase tracking-wide text-muted-foreground mb-1">
                  {item.type}
                </span>
                <p className="text-body-base font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                {item.price && (
                  <p className="text-body-base font-semibold text-foreground mt-1">
                    {typeof item.price === "number"
                      ? `$${item.price.toLocaleString()}`
                      : item.price}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      {items.length > maxItems && (
        <div className="text-center pt-2">
          <Link
            href="/account/garage"
            className="inline-flex items-center gap-1 text-body-base font-medium text-primary hover:underline"
          >
            View all {items.length} items
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
