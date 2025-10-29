import { Suspense } from "react";
import { HeroSection } from "@/components/shared/HeroSection";
import { FeaturedVehicles } from "@/components/shared/FeaturedVehicles";
import { PopularParts } from "@/components/shared/PopularParts";
import { AboutSection } from "@/components/shared/AboutSection";
import { VehicleCardSkeleton } from "@/components/vehicles/VehicleCardSkeleton";
import { ProductGridLoading } from "@/components/product-grid";
import Footer from "@/components/layout/footer";
import type { Metadata } from "next";

// ISR Configuration: Revalidate every 60 seconds
export const revalidate = 60;

// SEO Metadata with Open Graph tags
export const metadata: Metadata = {
  title: "Enthusiast Auto | BMW Vehicles & Parts",
  description:
    "Your BMW enthusiast destination. Curated BMW vehicles for sale and premium parts. Hand-picked inventory and quality components for the ultimate driving machine.",
  openGraph: {
    type: "website",
    title: "Enthusiast Auto | BMW Vehicles & Parts",
    description:
      "Curated BMW vehicles for sale and premium parts for BMW enthusiasts.",
    siteName: "Enthusiast Auto",
  },
};

/**
 * Homepage - Unified BMW enthusiast platform
 * Showcases both vehicles (Sanity CMS) and parts (Shopify)
 * Uses ISR with 60s revalidation for optimal performance
 */
export default function HomePage() {
  return (
    <>
      {/* Hero Section with Value Proposition and CTAs */}
      <HeroSection />

      {/* Featured Vehicles Section - Server Component with Suspense */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <h2 className="mb-8 text-title-2 font-bold text-foreground">
              Featured Vehicles
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <VehicleCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <FeaturedVehicles />
      </Suspense>

      {/* Popular Parts Section - Server Component with Suspense */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <h2 className="mb-8 text-title-2 font-bold text-foreground">
              Popular Parts
            </h2>
            <ProductGridLoading />
          </div>
        }
      >
        <PopularParts />
      </Suspense>

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />

      {/* JSON-LD Schema.org Organization Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Enthusiast Auto",
            description:
              "Curated BMW vehicles for sale and premium parts for BMW enthusiasts.",
            url: "https://enthusiastauto.com",
            logo: "https://enthusiastauto.com/logo.png",
            sameAs: [],
          }),
        }}
      />
    </>
  );
}
