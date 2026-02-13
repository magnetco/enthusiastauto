import Section from "@/components/layout/section";
import {
  PartsEmptyState,
  PartsFilters,
  PartsPagination,
  PartsSortDropdown,
} from "@/components/parts";
import { ProductGrid, ProductGridLoading } from "@/components/product-grid";
import { PageHero } from "@/components/shared/PageHero";
import { getProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { Metadata } from "next";
import { Suspense } from "react";

// Enable ISR with 60-second revalidation
export const revalidate = 60;

// Products per page
const PRODUCTS_PER_PAGE = 24;

export const metadata: Metadata = {
  title: "Parts & Accessories | Enthusiast Auto",
  description:
    "Browse our selection of BMW parts and accessories. Quality OEM and aftermarket parts for your enthusiast vehicle.",
  openGraph: {
    title: "Parts & Accessories | Enthusiast Auto",
    description: "Browse our selection of BMW parts and accessories.",
    type: "website",
  },
};

interface SearchParams {
  sort?: string;
  q?: string;
  vendor?: string;
  category?: string;
  priceMin?: string;
  priceMax?: string;
  page?: string;
}

interface PartsPageProps {
  searchParams: Promise<SearchParams>;
}

// Map URL sort values to Shopify sort keys
function getSortConfig(sort: string | undefined) {
  const sortMap: Record<string, { sortKey: string; reverse: boolean }> = {
    "price-asc": { sortKey: "PRICE", reverse: false },
    "price-desc": { sortKey: "PRICE", reverse: true },
    latest: { sortKey: "CREATED_AT", reverse: true },
    "best-selling": { sortKey: "BEST_SELLING", reverse: false },
    relevance: { sortKey: "RELEVANCE", reverse: false },
  };

  return (
    sortMap[sort || "relevance"] || { sortKey: "RELEVANCE", reverse: false }
  );
}

// Filter products based on URL params
function filterProducts(products: Product[], params: SearchParams): Product[] {
  let filtered = [...products];

  // Filter by search query
  if (params.q && params.q.length >= 2) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.vendor?.toLowerCase().includes(query) ||
        p.productType?.toLowerCase().includes(query)
    );
  }

  // Filter by vendors
  if (params.vendor) {
    const vendors = params.vendor.split(",");
    filtered = filtered.filter((p) => vendors.includes(p.vendor));
  }

  // Filter by categories (tags)
  if (params.category) {
    const categories = params.category.split(",");
    filtered = filtered.filter((p) =>
      p.tags?.some((tag) => categories.includes(tag))
    );
  }

  // Filter by price range
  if (params.priceMin) {
    const minPrice = parseFloat(params.priceMin);
    filtered = filtered.filter(
      (p) => parseFloat(p.priceRange.minVariantPrice.amount) >= minPrice
    );
  }

  if (params.priceMax) {
    const maxPrice = parseFloat(params.priceMax);
    filtered = filtered.filter(
      (p) => parseFloat(p.priceRange.minVariantPrice.amount) <= maxPrice
    );
  }

  return filtered;
}

// Paginate products
function paginateProducts(
  products: Product[],
  page: number,
  perPage: number
): Product[] {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return products.slice(start, end);
}

// Skeleton for parts results area
function PartsResultsSkeleton() {
  return (
    <>
      <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-200" />
      <ProductGridLoading />
    </>
  );
}

async function PartsResults({ searchParams }: PartsPageProps) {
  // Await searchParams for Next.js 15
  const params = await searchParams;
  const { sortKey, reverse } = getSortConfig(params.sort);
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));

  // Fetch all products from Shopify
  const allProducts = await getProducts({
    sortKey,
    reverse,
  });

  // Apply client-side filters
  const filteredProducts = filterProducts(allProducts, params);

  // Calculate total before pagination
  const totalFiltered = filteredProducts.length;

  // Paginate the filtered products
  const paginatedProducts = paginateProducts(
    filteredProducts,
    currentPage,
    PRODUCTS_PER_PAGE
  );

  // Check if any filters are active
  const hasActiveFilters =
    (params.q && params.q.length >= 2) ||
    !!params.vendor ||
    !!params.category ||
    !!params.priceMin ||
    !!params.priceMax;

  if (filteredProducts.length === 0) {
    return <PartsEmptyState hasActiveFilters={hasActiveFilters} />;
  }

  return (
    <>
      <div className="mb-4 text-sm text-muted-foreground">
        {hasActiveFilters ? (
          <>
            {totalFiltered} of {allProducts.length}{" "}
            {allProducts.length === 1 ? "part" : "parts"}
          </>
        ) : (
          <>
            {totalFiltered} {totalFiltered === 1 ? "part" : "parts"} available
          </>
        )}
      </div>
      <ProductGrid products={paginatedProducts} />
      <PartsPagination
        currentPage={currentPage}
        totalResults={totalFiltered}
        resultsPerPage={PRODUCTS_PER_PAGE}
      />
    </>
  );
}

// Client wrapper for filters that need product data
async function PartsFiltersWrapper({ searchParams }: PartsPageProps) {
  const params = await searchParams;
  const { sortKey, reverse } = getSortConfig(params.sort);

  // Fetch all products to extract filter options
  const products = await getProducts({
    sortKey,
    reverse,
  });

  return <PartsFilters products={products} />;
}

export default async function PartsPage({ searchParams }: PartsPageProps) {
  return (
    <>
      {/* Hero - Static content, no data dependency */}
      <PageHero
        size="compact"
        eyebrow="Enthusiast Auto Group"
        title="Parts & Accessories"
        subtitle="Quality OEM and aftermarket parts for your BMW"
        backgroundImage="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Content */}
      <Section className="py-8 lg:py-12">
        {/* Mobile Filters Button and Desktop Sort */}
        <div className="mb-6 flex items-center justify-between">
          {/* Only show mobile filter button - desktop filters in sidebar */}
          <div className="md:hidden">
            <Suspense
              fallback={
                <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
              }
            >
              <PartsFiltersWrapper searchParams={searchParams} />
            </Suspense>
          </div>
          <div className="ml-auto">
            <PartsSortDropdown />
          </div>
        </div>

        {/* Desktop Filters Sidebar + Parts Grid */}
        <div className="gap-8 md:grid md:grid-cols-[280px_1fr] lg:gap-12">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block">
            <div className="sticky top-24">
              <Suspense
                fallback={
                  <div className="space-y-4">
                    <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-48 w-full animate-pulse rounded bg-gray-200" />
                  </div>
                }
              >
                <PartsFiltersWrapper searchParams={searchParams} />
              </Suspense>
            </div>
          </aside>

          {/* Main Content - Only this area needs Suspense */}
          <main className="min-h-[600px]">
            <Suspense fallback={<PartsResultsSkeleton />}>
              <PartsResults searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </Section>
    </>
  );
}
