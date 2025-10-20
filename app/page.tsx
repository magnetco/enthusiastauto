import { Suspense } from "react";
import { ProductGridLoading } from "@/components/product-grid";
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
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-border bg-muted p-8">
        <h3 className="mb-2 text-lg font-semibold">
          Unable to load products
        </h3>
        <p className="text-center text-sm text-muted-foreground">
          Products are currently unavailable. Please check back later.
        </p>
      </div>
    );
  }
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Full Width with Background Image */}
      <div className="relative mb-8 w-full overflow-hidden bg-background">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop')",
            }}
          />
          {/* Gradient Overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-screen-2xl px-4 py-12 sm:px-5 sm:py-16 lg:px-6 lg:py-20">
          <h1 className="max-w-[41.4rem] text-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            BMW Parts & Accessories
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Premium quality parts for your ultimate driving machine
          </p>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="mx-auto max-w-screen-2xl px-4 pb-10 sm:px-5 lg:px-6">
        <Suspense fallback={<ProductGridLoading />}>
          <ProductListing />
        </Suspense>
      </div>

      <Footer />
    </>
  );
}
