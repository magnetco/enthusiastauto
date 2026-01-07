import { Suspense } from "react";
import { HeroSection } from "@/components/shared/HeroSection";
import { FeaturedVehicles } from "@/components/shared/FeaturedVehicles";
import { PopularParts } from "@/components/shared/PopularParts";
import { ServicesSection } from "@/components/shared/ServicesSection";
import { AboutSection } from "@/components/shared/AboutSection";
import { VehicleCardSkeleton } from "@/components/vehicles/VehicleCardSkeleton";
import { ProductGridLoading } from "@/components/product-grid";
import type { Metadata } from "next";

// ISR Configuration: Revalidate every 60 seconds
export const revalidate = 60;

// SEO Metadata with Open Graph tags
export const metadata: Metadata = {
  title: "Enthusiast Auto | The Leading BMW Preservation Facility",
  description:
    "The leading BMW preservation facility. Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles. Curated vehicles and premium parts.",
  openGraph: {
    type: "website",
    title: "Enthusiast Auto | The Leading BMW Preservation Facility",
    description:
      "Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles.",
    siteName: "Enthusiast Auto",
  },
};

/**
 * Homepage - Unified BMW enthusiast platform
 * Showcases vehicles (Sanity CMS), parts (Shopify), and services
 * Uses ISR with 60s revalidation for optimal performance
 */
export default function HomePage() {
  return (
    <>
      {/* Hero Section - Full height with dramatic styling */}
      <HeroSection />

      {/* Featured Vehicles Section - Server Component with Suspense */}
      <Suspense
        fallback={
          <div className="bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[var(--container-max)] px-page-x">
              <div className="mb-12 lg:mb-16">
                <h2 className="font-headline text-title-2 text-neutral-900 sm:text-title-1">
                  Inventory
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <VehicleCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <FeaturedVehicles />
      </Suspense>

      {/* Services Section - Numbered offerings (01-04) */}
      <ServicesSection />

      {/* Popular Parts Section - Server Component with Suspense */}
      <Suspense
        fallback={
          <div className="bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[var(--container-max)] px-page-x">
              <div className="mb-12 lg:mb-16">
                <h2 className="font-headline text-title-2 text-neutral-900 sm:text-title-1">
                  Parts
                </h2>
              </div>
              <ProductGridLoading />
            </div>
          </div>
        }
      >
        <PopularParts />
      </Suspense>

      {/* About Section */}
      <AboutSection />

      {/* JSON-LD Schema.org Organization Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Enthusiast Auto",
            description:
              "The leading BMW preservation facility. Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles.",
            url: "https://enthusiastauto.com",
            logo: "https://enthusiastauto.com/logo.png",
            sameAs: [],
          }),
        }}
      />
    </>
  );
}
