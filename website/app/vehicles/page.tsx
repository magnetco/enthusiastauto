import Section from "@/components/layout/section";
import { PageHero } from "@/components/shared/PageHero";
import { EmptyState } from "@/components/vehicles/EmptyState";
import { VehicleGridSkeleton } from "@/components/vehicles/VehicleCardSkeleton";
import { VehiclesPageClient } from "@/components/vehicles/VehiclesPageClient";
import {
	getVehicles,
	getPriceRange,
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
	currentOnly?: string;
	sort?: string;
}

interface VehiclesPageProps {
	searchParams: Promise<SearchParams>;
}

// Skeleton for vehicle results area only
function VehicleResultsSkeleton() {
	return (
		<div className="min-h-[600px] animate-pulse">
			<div className="mb-8 h-32 w-full rounded bg-gray-200" />
			<div className="mb-6 h-12 w-full rounded bg-gray-200" />
			<div className="space-y-6">
				{[1, 2, 3].map((i) => (
					<div key={i} className="h-64 rounded-lg bg-gray-200" />
				))}
			</div>
		</div>
	);
}

async function VehicleResults({ searchParams }: VehiclesPageProps) {
	// Await searchParams for Next.js 15
	const params = await searchParams;

	// Parse filters from URL search params
	const filters: VehicleFiltersType = {
		chassis: params.chassis?.split(",").filter(Boolean),
		yearMin: params.yearMin ? parseInt(params.yearMin) : undefined,
		yearMax: params.yearMax ? parseInt(params.yearMax) : undefined,
		priceMin: params.priceMin ? parseInt(params.priceMin) : undefined,
		priceMax: params.priceMax ? parseInt(params.priceMax) : undefined,
		// Default to showing current inventory only (true) unless explicitly set to false
		currentOnly: params.currentOnly !== "false",
	};

	const sort = (params.sort as VehicleSort) || "recent";

	// Fetch vehicles and price range in parallel
	const [vehicles, priceRange] = await Promise.all([
		getVehicles(filters, sort),
		getPriceRange({
			chassis: filters.chassis,
			yearMin: filters.yearMin,
			yearMax: filters.yearMax,
			currentOnly: filters.currentOnly,
		}),
	]);

	// Check if any filters are active
	const hasActiveFilters: boolean =
		(filters.chassis !== undefined && filters.chassis.length > 0) ||
		filters.yearMin !== undefined ||
		filters.yearMax !== undefined ||
		filters.priceMin !== undefined ||
		filters.priceMax !== undefined;

	if (vehicles.length === 0) {
		return <EmptyState hasActiveFilters={hasActiveFilters} />;
	}

	return (
		<VehiclesPageClient
			vehicles={vehicles}
			vehicleCount={vehicles.length}
			priceRange={priceRange}
		/>
	);
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
	return (
		<>
	{/* Hero - Static content, no data dependency */}
	<PageHero
		size="compact"
		title="Vehicle Inventory"
		subtitle="Browse our curated selection of premium BMW vehicles"
		backgroundImage="/images/inventory-hero-bg.jpg"
	/>

		{/* Content */}
		<Section className="py-8 lg:py-12">
			{/* Main Content with Suspense */}
			<Suspense fallback={<VehicleResultsSkeleton />}>
				<VehicleResults searchParams={searchParams} />
			</Suspense>
		</Section>
		</>
	);
}
