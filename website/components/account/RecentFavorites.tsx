"use client";

import Image from "next/image";
import Link from "next/link";
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
}

export function RecentFavorites({ items, maxItems = 4 }: RecentFavoritesProps) {
  const displayItems = items.slice(0, maxItems);

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-brand-red font-medium">///</span>
          <h2 className="text-lg font-semibold text-foreground">
            Recent Favorites
          </h2>
        </div>
        {items.length > 0 && (
          <Link
            href="/account/garage"
            className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg py-16 px-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Heart className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            No favorites yet
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Save vehicles and parts to quickly access them later.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/vehicles"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Browse Vehicles
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href="/parts"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Shop Parts
            </Link>
          </div>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid gap-4 sm:grid-cols-2">
          {displayItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex gap-4 p-4 rounded-lg border border-border transition-colors hover:border-foreground/20 hover:bg-muted/30"
            >
              {/* Thumbnail */}
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded bg-muted">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    {item.type === "vehicle" ? (
                      <Car className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground capitalize">
                    {item.type}
                  </span>
                  {item.price && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-sm font-medium text-foreground">
                        {typeof item.price === "number"
                          ? `$${item.price.toLocaleString()}`
                          : item.price}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
