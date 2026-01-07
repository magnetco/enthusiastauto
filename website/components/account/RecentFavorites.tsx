"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Car, Package } from "lucide-react";
import { cn } from "@/lib/utils";

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

  if (items.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-muted-foreground" />
            Recent Favorites
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-2 text-sm font-medium text-foreground">
              No favorites yet
            </p>
            <p className="mb-4 max-w-xs text-sm text-muted-foreground">
              Save vehicles and parts to your garage for quick access
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/vehicles">Browse Vehicles</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/parts">Shop Parts</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-red-500" />
          Recent Favorites
        </CardTitle>
        <CardAction>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link href="/account/garage" className="flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-3 sm:grid-cols-2">
          {displayItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex gap-3 rounded-lg border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              {/* Thumbnail */}
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="80px"
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
                <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs capitalize",
                      item.type === "vehicle" && "bg-blue-50 text-blue-700",
                      item.type === "product" && "bg-emerald-50 text-emerald-700"
                    )}
                  >
                    {item.type}
                  </Badge>
                  {item.price && (
                    <span className="text-sm font-semibold text-foreground">
                      {typeof item.price === "number"
                        ? `$${item.price.toLocaleString()}`
                        : item.price}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {items.length > maxItems && (
          <div className="mt-4 text-center">
            <Button asChild variant="outline" size="sm">
              <Link href="/account/garage">
                See {items.length - maxItems} more items
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

