"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { GarageItemCard } from "@/components/favorites/GarageItemCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car, Package, ShoppingBag, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleTabChange = (value: TabOption) => {
    setActiveTab(value);
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

    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const usagePercentage = (totalCount / garageLimit) * 100;
  const showWarning = usagePercentage >= 80;

  const tabs = [
    { value: "all" as const, label: "All", count: totalCount },
    { value: "vehicles" as const, label: "Vehicles", count: vehicleCount, icon: Car },
    { value: "products" as const, label: "Parts", count: productCount, icon: Package },
  ];

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {showWarning && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="flex items-start gap-4 py-4">
            <div className="rounded-lg bg-amber-100 p-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-body-base text-amber-900">
              Your garage is {usagePercentage >= 100 ? "full" : "almost full"} (
              {totalCount}/{garageLimit}). Remove items to add more.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tabs and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-body-base font-medium transition-colors",
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab.icon && <tab.icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={cn(
                    "text-body-small",
                    activeTab === tab.value ? "opacity-80" : "opacity-60"
                  )}
                >
                  ({tab.count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        {items.length > 0 && (
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Recently Added</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Items Grid */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        <EmptyState type={activeTab} />
      )}
    </div>
  );
}

function EmptyState({ type }: { type: "all" | "vehicles" | "products" }) {
  const config = {
    all: {
      icon: ShoppingBag,
      title: "Your garage is empty",
      description: "Save vehicles and parts to find them quickly later.",
      buttons: [
        { label: "Browse Vehicles", href: "/vehicles", primary: true },
        { label: "Shop Parts", href: "/parts", primary: false },
      ],
    },
    vehicles: {
      icon: Car,
      title: "No saved vehicles",
      description: "Explore our inventory and save vehicles you're interested in.",
      buttons: [{ label: "Browse Vehicles", href: "/vehicles", primary: true }],
    },
    products: {
      icon: Package,
      title: "No saved parts",
      description: "Shop for parts and save your favorites.",
      buttons: [{ label: "Shop Parts", href: "/parts", primary: true }],
    },
  };

  const { icon: Icon, title, description, buttons } = config[type];

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Icon className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-body-large font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-body-base text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
        <div className="flex items-center gap-4">
          {buttons.map((button) => (
            <Link
              key={button.href}
              href={button.href}
              className={cn(
                "inline-flex items-center gap-2 text-body-base font-medium transition-colors",
                button.primary
                  ? "text-primary hover:underline"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {button.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
