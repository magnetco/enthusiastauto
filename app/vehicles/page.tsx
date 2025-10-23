import { Suspense } from "react";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { VehicleGrid } from "@/components/vehicles/VehicleGrid";
import { VehicleGridSkeleton } from "@/components/vehicles/VehicleCardSkeleton";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { SortDropdown } from "@/components/vehicles/SortDropdown";
import { EmptyState } from "@/components/vehicles/EmptyState";
import {
  getVehicles,
  type VehicleFilters as VehicleFiltersType,
  type VehicleSort,
} from "@/lib/sanity/queries/vehicles";

// Enable ISR with 60-second revalidation
export const revalidate = 60;

// Metadata for SEO
export const metadata: Metadata = {
  title: "Vehicle Inventory | Enthusiast Auto",
  description:
    "Browse our curated selection of premium BMW vehicles. Find your next enthusiast car with detailed specifications and high-quality photos.",
  openGraph: {
    title: "Vehicle Inventory | Enthusiast Auto",
    description:
      "Browse our curated selection of premium BMW vehicles. Find your next enthusiast car with detailed specifications and high-quality photos.",
    type: "website",
  },
};

interface SearchParams {
  chassis?: string;
  yearMin?: string;
  yearMax?: string;
  priceMin?: string;
  priceMax?: string;
  status?: string;
  sort?: string;
}

interface VehiclesPageProps {
  searchParams: Promise<SearchParams>;
}

async function VehiclesContent({ searchParams }: VehiclesPageProps) {
  // Await searchParams for Next.js 15
  const params = await searchParams;

  // Parse filters from URL search params
  const filters: VehicleFiltersType = {
    chassis: params.chassis?.split(",").filter(Boolean),
    yearMin: params.yearMin ? parseInt(params.yearMin) : undefined,
    yearMax: params.yearMax ? parseInt(params.yearMax) : undefined,
    priceMin: params.priceMin ? parseInt(params.priceMin) : undefined,
    priceMax: params.priceMax ? parseInt(params.priceMax) : undefined,
    status: (params.status as "current" | "sold" | "all") || "all",
  };

  const sort = (params.sort as VehicleSort) || "recent";

  // Fetch vehicles with filters and sorting
  const vehicles = await getVehicles(filters, sort);

  // Check if any filters are active
  const hasActiveFilters: boolean =
    (filters.chassis !== undefined && filters.chassis.length > 0) ||
    filters.yearMin !== undefined ||
    filters.yearMax !== undefined ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    (filters.status !== undefined && filters.status !== "all");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Vehicle Inventory
        </h1>
        <p className="mt-2 text-gray-600">
          Browse our curated selection of premium BMW vehicles
        </p>
      </div>

      {/* Mobile Filters Button and Desktop Sort */}
      <div className="mb-6 flex items-center justify-between">
        {/* Only show mobile filter button - desktop filters in sidebar */}
        <div className="md:hidden">
          <VehicleFilters />
        </div>
        <div className="ml-auto">
          <SortDropdown />
        </div>
      </div>

      {/* Desktop Filters Sidebar + Vehicle Grid */}
      <div className="gap-8 md:grid md:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block">
          <div className="sticky top-4">
            <VehicleFilters />
          </div>
        </aside>

        {/* Main Content */}
        <main>
          {vehicles.length === 0 ? (
            <EmptyState hasActiveFilters={hasActiveFilters} />
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-400">
                {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"} found
              </div>
              <VehicleGrid vehicles={vehicles} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default async function VehiclesPage({
  searchParams,
}: VehiclesPageProps) {
  return (
    <Suspense fallback={<VehicleGridSkeleton count={9} />}>
      <VehiclesContent searchParams={searchParams} />
    </Suspense>
  );
}
