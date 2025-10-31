"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GarageItemCard } from "@/components/favorites/GarageItemCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, Car, Package, ShoppingBag } from "lucide-react";

interface GarageItem {
  id: string;
  type: "vehicle" | "product";
  title: string;
  price?: number | string;
  image?: string;
  specs?: string[];
  href: string;
  createdAt: Date;
}

interface GarageContentProps {
  items: GarageItem[];
  totalCount: number;
  garageLimit: number;
}

type SortOption = "date-desc" | "price-asc" | "price-desc";
type TabOption = "all" | "vehicles" | "products";

export function GarageContent({
  items: initialItems,
  totalCount,
  garageLimit,
}: GarageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState(initialItems);

  const defaultTab = (searchParams.get("tab") || "all") as TabOption;
  const [activeTab, setActiveTab] = useState<TabOption>(defaultTab);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  // Filter items by tab
  const filteredItems = useMemo(() => {
    if (activeTab === "vehicles") {
      return items.filter((item) => item.type === "vehicle");
    } else if (activeTab === "products") {
      return items.filter((item) => item.type === "product");
    }
    return items;
  }, [items, activeTab]);

  // Sort items
  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];

    if (sortBy === "date-desc") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "price-asc" || sortBy === "price-desc") {
      sorted.sort((a, b) => {
        const priceA =
          typeof a.price === "number" ? a.price : parseFloat(String(a.price)) || 0;
        const priceB =
          typeof b.price === "number" ? b.price : parseFloat(String(b.price)) || 0;

        return sortBy === "price-asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return sorted;
  }, [filteredItems, sortBy]);

  const vehicleCount = items.filter((item) => item.type === "vehicle").length;
  const productCount = items.filter((item) => item.type === "product").length;

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabOption);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleRemove = async (itemId: string) => {
    const itemToRemove = items.find((item) => item.id === itemId);
    if (!itemToRemove) return;

    const response = await fetch("/api/user/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        itemType: itemToRemove.type,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove item");
    }

    // Remove item from local state
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const usagePercentage = (totalCount / garageLimit) * 100;
  const showWarning = usagePercentage >= 80;

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {showWarning && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-yellow-500">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            Your garage is {usagePercentage >= 100 ? "full" : "almost full"} (
            {totalCount}/{garageLimit}). Remove items to add more.
          </p>
        </div>
      )}

      {/* Tabs and Controls */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">
              All {totalCount > 0 && `(${totalCount})`}
            </TabsTrigger>
            <TabsTrigger value="vehicles">
              <Car className="mr-2 h-4 w-4" />
              Vehicles {vehicleCount > 0 && `(${vehicleCount})`}
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="mr-2 h-4 w-4" />
              Parts {productCount > 0 && `(${productCount})`}
            </TabsTrigger>
          </TabsList>

          {items.length > 0 && (
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date Added</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <TabsContent value="all" className="mt-6">
          {sortedItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
              {sortedItems.map((item) => (
                <GarageItemCard
                  key={item.id}
                  item={item}
                  itemType={item.type}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="all" />
          )}
        </TabsContent>

        <TabsContent value="vehicles" className="mt-6">
          {sortedItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
              {sortedItems.map((item) => (
                <GarageItemCard
                  key={item.id}
                  item={item}
                  itemType={item.type}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="vehicles" />
          )}
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          {sortedItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
              {sortedItems.map((item) => (
                <GarageItemCard
                  key={item.id}
                  item={item}
                  itemType={item.type}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="products" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ type }: { type: "all" | "vehicles" | "products" }) {
  const config = {
    all: {
      icon: ShoppingBag,
      title: "Your garage is empty",
      description:
        "Start saving your favorite vehicles and parts to easily find them later.",
      buttons: [
        { label: "Browse Vehicles", href: "/vehicles" },
        { label: "Shop Parts", href: "/search" },
      ],
    },
    vehicles: {
      icon: Car,
      title: "No saved vehicles yet",
      description:
        "Explore our inventory and save vehicles you're interested in.",
      buttons: [{ label: "Browse Vehicles", href: "/vehicles" }],
    },
    products: {
      icon: Package,
      title: "No saved parts yet",
      description: "Shop for parts and save your favorites to access them quickly.",
      buttons: [{ label: "Shop Parts", href: "/search" }],
    },
  };

  const { icon: Icon, title, description, buttons } = config[type];

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
      <Icon className="mb-4 h-16 w-16 text-muted-foreground" />
      <h3 className="mb-2 text-title-3 font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      <div className="flex gap-3">
        {buttons.map((button) => (
          <Button key={button.href} asChild>
            <Link href={button.href}>{button.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
