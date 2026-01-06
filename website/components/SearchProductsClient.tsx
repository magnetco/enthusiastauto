"use client";

import { FilterProvider } from "contexts/FilterContext";
import { Product } from "lib/shopify/types";
import { ProductGridWithFilters } from "./ProductGridWithFilters";

interface SearchProductsClientProps {
  products: Product[];
}

export function SearchProductsClient({ products }: SearchProductsClientProps) {
  return (
    <FilterProvider>
      <ProductGridWithFilters products={products} showFilters={true} />
    </FilterProvider>
  );
}
