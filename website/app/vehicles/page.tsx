import Section from "@/components/layout/section";
import { TextHero } from "@/components/shared/TextHero";
import { EmptyState } from "@/components/vehicles/EmptyState";
import { SortDropdown } from "@/components/vehicles/SortDropdown";
import { VehicleGridSkeleton } from "@/components/vehicles/VehicleCardSkeleton";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { VehicleGrid } from "@/components/vehicles/VehicleGrid";
import {
	getVehicles,
	type VehicleFilters as VehicleFiltersType,
	type VehicleSort,
} from "@/lib/sanity/queries/vehicles";
import { Metadata } from "next";
import { Suspense } from "react";

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
		<>
			{/* Header */}
			<Section>
				<TextHero
					title="Vehicle Inventory"
					subtitle="Browse our curated selection of premium BMW vehicles"
				/>
				{/* Mobile Filters Button and Desktop Sort */}
				<div className="-mb-2 flex items-center justify-between">
					{/* Only show mobile filter button - desktop filters in sidebar */}
					<div className="md:hidden">
						<VehicleFilters />
					</div>
					<div className="ml-auto">
						<SortDropdown />
					</div>
				</div>

				{/* Desktop Filters Sidebar + Vehicle Grid */}
				<div className="gap-6 md:grid md:grid-cols-[280px_1fr] lg:gap-8">
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
								<div className="mb-4 text-sm text-muted-foreground">
									{vehicles.length}{" "}
									{vehicles.length === 1 ? "vehicle" : "vehicles"} found
								</div>
								<VehicleGrid vehicles={vehicles} />
							</>
						)}
					</main>
				</div>
			</Section>
		</>
	);
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
	return (
		<Suspense fallback={<VehicleGridSkeleton count={9} />}>
			<VehiclesContent searchParams={searchParams} />
		</Suspense>
	);
}
