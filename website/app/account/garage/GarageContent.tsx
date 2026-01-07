"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GarageItemCard } from "@/components/favorites/GarageItemCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car, Package, ShoppingBag, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [sortOpen, setSortOpen] = useState(false);

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

  const sortOptions = [
    { value: "date-desc" as const, label: "Recently Added" },
    { value: "price-asc" as const, label: "Price: Low to High" },
    { value: "price-desc" as const, label: "Price: High to Low" },
  ];

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {showWarning && (
        <div className="border-l-2 border-amber-500 bg-amber-50/50 py-3 pl-4 pr-4">
          <p className="text-sm text-amber-900">
            Your garage is {usagePercentage >= 100 ? "full" : "almost full"} (
            {totalCount}/{garageLimit}). Remove items to add more.
          </p>
        </div>
      )}

      {/* Tabs and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-border sm:border-0">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-b-2 -mb-px sm:mb-0 sm:border-0 sm:rounded-full",
                activeTab === tab.value
                  ? "border-foreground text-foreground sm:bg-foreground sm:text-background font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground sm:hover:bg-muted"
              )}
            >
              {tab.icon && <tab.icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={cn(
                  "text-xs",
                  activeTab === tab.value ? "opacity-70" : "opacity-50"
                )}>
                  ({tab.count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        {items.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>
                {sortOptions.find((o) => o.value === sortBy)?.label || "Sort by"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {sortOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSortOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 z-20 min-w-[180px] rounded-lg border border-border bg-background py-1 shadow-lg">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "block w-full px-4 py-2 text-left text-sm transition-colors",
                        sortBy === option.value
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Items Grid */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        { label: "Browse Vehicles", href: "/vehicles" },
        { label: "Shop Parts", href: "/parts" },
      ],
    },
    vehicles: {
      icon: Car,
      title: "No saved vehicles",
      description: "Explore our inventory and save vehicles you're interested in.",
      buttons: [{ label: "Browse Vehicles", href: "/vehicles" }],
    },
    products: {
      icon: Package,
      title: "No saved parts",
      description: "Shop for parts and save your favorites.",
      buttons: [{ label: "Shop Parts", href: "/parts" }],
    },
  };

  const { icon: Icon, title, description, buttons } = config[type];

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      <div className="flex items-center gap-3">
        {buttons.map((button, index) => (
          <Link
            key={button.href}
            href={button.href}
            className={cn(
              "text-sm font-medium transition-colors",
              index === 0
                ? "text-foreground hover:text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {button.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
