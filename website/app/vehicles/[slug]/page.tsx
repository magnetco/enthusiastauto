import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getVehicleDetail,
  getVehicleSlugs,
  getSimilarVehicles,
  getGlobalFAQs,
} from "@/lib/sanity/queries/vehicles";
import { VehicleHeroClient } from "@/components/vehicles/VehicleHeroClient";
import { VehicleSpecsSection } from "@/components/vehicles/VehicleSpecsSection";
import { EAGImpressionsSection } from "@/components/vehicles/EAGImpressionsSection";
import { HighlightsSection } from "@/components/vehicles/HighlightsSection";
import { OverviewSection } from "@/components/vehicles/OverviewSection";
import { VehicleGallerySection } from "@/components/vehicles/VehicleGallerySection";
import { HistorySection } from "@/components/vehicles/HistorySection";
import { VehicleDocumentation } from "@/components/vehicles/VehicleDocumentation";
import { VehicleInquirySection } from "@/components/vehicles/VehicleInquirySection";
import { VehicleFAQs } from "@/components/vehicles/VehicleFAQs";
import { OtherCarsSection } from "@/components/vehicles/OtherCarsSection";

// Enable ISR with 60-second revalidation
export const revalidate = 60;

interface VehicleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for top 50 current vehicles at build time
 * Enables ISR with pre-rendered pages for better performance
 */
export async function generateStaticParams() {
  const slugs = await getVehicleSlugs(50);
  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

/**
 * Generate dynamic metadata for SEO optimization
 */
export async function generateMetadata({
  params,
}: VehicleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleDetail(slug);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found",
      description: "The requested vehicle could not be found.",
    };
  }

  const isSold = vehicle.status === "sold";
  const price = vehicle.showCallForPrice
    ? "Call for Price"
    : vehicle.listingPrice
      ? `$${vehicle.listingPrice.toLocaleString()}`
      : "";

  // Generate meta title (max 60 chars)
  const metaTitle = `${vehicle.listingTitle} - Enthusiast Auto`;

  // Generate meta description (max 160 chars)
  const metaDescription = `${vehicle.listingTitle} • ${vehicle.mileage.toLocaleString()} mi • ${price} • ${isSold ? "SOLD" : "Available Now"} at Enthusiast Auto`;

  // Get primary image for Open Graph
  const primaryImage = isSold
    ? vehicle.soldShot?.asset?.url
    : vehicle.signatureShot?.asset?.url;

  // Canonical URL
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shop.enthusiastauto.com";
  const canonicalUrl = `${baseUrl}/vehicles/${slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      images: primaryImage
        ? [{ url: primaryImage, width: 1200, height: 630 }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: primaryImage ? [primaryImage] : [],
    },
  };
}


export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleDetail(slug);

  // Handle 404 for non-existent vehicles
  if (!vehicle) {
    return notFound();
  }

  const isSold = vehicle.status === "sold";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://enthusiastauto.com";

  // Prepare gallery images
  const galleryImages = vehicle.galleryImages || [];

  // Fetch similar vehicles and global FAQs
  const [similarVehicles, globalFaqs] = await Promise.all([
    getSimilarVehicles(vehicle.chassis, slug, 6),
    getGlobalFAQs(),
  ]);

  // Generate schema.org Vehicle structured data
  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: vehicle.listingTitle,
    vehicleIdentificationNumber: vehicle.vin,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "SMI",
    },
    vehicleTransmission: vehicle.transmission,
    driveWheelConfiguration: vehicle.drive,
    color: vehicle.exteriorColor,
    vehicleInteriorColor: vehicle.interiorColor,
    fuelType: vehicle.engineType,
    vehicleEngine: {
      "@type": "EngineSpecification",
      name: `${vehicle.engineSize} ${vehicle.engineCodes}`,
    },
    offers: {
      "@type": "Offer",
      price: vehicle.listingPrice || 0,
      priceCurrency: "USD",
      availability: isSold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Enthusiast Auto",
      },
    },
    image: galleryImages.map((img) => img.asset.url),
  };

  // Extract year from title for form
  const vehicleYear = parseInt(
    vehicle.listingTitle.match(/^\d{4}/)?.[0] || new Date().getFullYear().toString()
  );

  return (
    <>
      {/* Structured Data - Vehicle Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
      />

      {/* Hero Section */}
      <VehicleHeroClient
        title={vehicle.listingTitle}
        price={vehicle.listingPrice}
        showCallForPrice={vehicle.showCallForPrice}
        status={vehicle.status}
        images={galleryImages}
        createdAt={vehicle._createdAt}
        slug={slug}
        isFavorited={false}
      />

      {/* Specifications Section */}
      <VehicleSpecsSection vehicle={vehicle} />

      {/* EAG Impressions Section */}
      <EAGImpressionsSection vehicle={vehicle} />

      {/* Highlights Section */}
      <HighlightsSection vehicle={vehicle} />

      {/* Overview Section */}
      <OverviewSection vehicle={vehicle} />

      {/* Gallery Section */}
      <VehicleGallerySection
        images={galleryImages}
        vehicleTitle={vehicle.listingTitle}
      />

      {/* History Section */}
      <HistorySection vehicle={vehicle} />

      {/* Documentation Section */}
      {vehicle.documentation && vehicle.documentation.length > 0 && (
        <VehicleDocumentation
          documentation={vehicle.documentation}
          vehicleTitle={vehicle.listingTitle}
        />
      )}

      {/* Inquiry Section */}
      <VehicleInquirySection
        vehicle={vehicle}
        vehicleSlug={slug}
        vehicleYear={vehicleYear}
      />

      {/* FAQs Section */}
      <VehicleFAQs
        vehicleFaqs={vehicle.faqs || []}
        globalFaqs={globalFaqs}
      />

      {/* Other Cars Section */}
      {similarVehicles.length > 0 && (
        <OtherCarsSection vehicles={similarVehicles} />
      )}
    </>
  );
}
