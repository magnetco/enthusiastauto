import { SearchProductsClient } from "components/SearchProductsClient";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

/**
 * /parts route - alias for product search
 * Part of Epic 4 routing architecture (Story 4.3)
 * This route provides a semantic URL for browsing parts/products
 */

export const metadata: Metadata = {
  title: "Parts & Accessories | Enthusiast Auto",
  description: "Browse our selection of BMW parts and accessories. Quality OEM and aftermarket parts for your enthusiast vehicle.",
  openGraph: {
    title: "Parts & Accessories | Enthusiast Auto",
    description: "Browse our selection of BMW parts and accessories.",
    type: "website",
  },
};

export default async function PartsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue, category } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // Fetch all products (can be filtered by category in future)
  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Parts & Accessories
        </h1>
        <p className="mt-2 text-gray-600">
          Browse our selection of BMW parts and accessories
        </p>
      </div>

      {/* Search Results Info */}
      {searchValue ? (
        <p className="mb-4 text-sm text-gray-600">
          {products.length === 0
            ? "There are no parts that match "
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {/* Product Grid */}
      <SearchProductsClient products={products} />
    </div>
  );
}
