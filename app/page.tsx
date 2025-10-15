import { Suspense } from "react";
import { ProductGridLoading } from "@/components/product-grid";
import { ProductGridError } from "@/components/product-grid-error";
import { ProductGridWithFilters } from "@/components/ProductGridWithFilters";
import { getProducts } from "@/lib/shopify";
import Footer from "components/layout/footer";

export const metadata = {
  title: "BMW Parts & Accessories | Enthusiast Auto",
  description:
    "Browse our curated collection of premium BMW parts and accessories. Quality components for BMW enthusiasts.",
  openGraph: {
    type: "website",
  },
};

async function ProductListing() {
  try {
    const products = await getProducts({});
    return <ProductGridWithFilters products={products} />;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
}

export default function HomePage() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
            BMW Parts & Accessories
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Premium quality parts for your ultimate driving machine
          </p>
        </div>

        <Suspense fallback={<ProductGridLoading />}>
          <ProductListing />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
