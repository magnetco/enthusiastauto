import { NextRequest, NextResponse } from "next/server";
import {
  getYearDistribution,
  type VehicleFilters,
} from "@/lib/sanity/queries/vehicles";

/**
 * GET /api/vehicles/year-distribution
 * Returns year distribution data for heatmap visualization
 * Accepts optional filter params (chassis, price, status) but excludes year filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse filters from query params (excluding year filters)
    const filters: Omit<VehicleFilters, "yearMin" | "yearMax"> = {
      chassis: searchParams.get("chassis")?.split(",").filter(Boolean),
      priceMin: searchParams.get("priceMin")
        ? parseInt(searchParams.get("priceMin")!)
        : undefined,
      priceMax: searchParams.get("priceMax")
        ? parseInt(searchParams.get("priceMax")!)
        : undefined,
      currentOnly: searchParams.get("currentOnly") !== "false",
    };

    const distribution = await getYearDistribution(filters);

    return NextResponse.json(distribution, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching year distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch year distribution" },
      { status: 500 },
    );
  }
}
