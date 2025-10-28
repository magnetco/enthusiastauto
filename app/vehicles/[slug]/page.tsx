import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getVehicleDetail,
  getVehicleSlugs,
} from "@/lib/sanity/queries/vehicles";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { VehicleSpecs } from "@/components/vehicles/VehicleSpecs";
import { VehicleDescription } from "@/components/vehicles/VehicleDescription";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { VehicleContactForm } from "@/components/vehicles/VehicleContactForm";
import { Badge } from "@/components/ui/badge";
import { RecommendationCarousel } from "@/components/shared/RecommendationCarousel";
import { getCompatibleParts } from "@/lib/shared/recommendations";

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
    notFound();
  }

  const isSold = vehicle.status === "sold";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://enthusiastauto.com";

  // Prepare gallery images
  const galleryImages = vehicle.galleryImages || [];

  // Fetch compatible parts for this vehicle
  const compatibleParts = await getCompatibleParts(vehicle);

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

  return (
    <>
      {/* Structured Data - Vehicle Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation with auto-generation and schema.org */}
        <Breadcrumbs
          customTitle={vehicle.listingTitle}
          baseUrl={baseUrl}
        />

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content (2/3 width on desktop) */}
          <div className="space-y-8 lg:col-span-2">
            {/* Vehicle Title and SOLD Badge */}
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  {vehicle.listingTitle}
                </h1>
                {isSold && (
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    SOLD
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span>{vehicle.mileage.toLocaleString()} miles</span>
                {vehicle.vin && <span>VIN: {vehicle.vin}</span>}
              </div>
            </div>

            {/* Photo Gallery */}
            {galleryImages.length > 0 ? (
              <VehicleGallery
                images={galleryImages}
                vehicleTitle={vehicle.listingTitle}
              />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-800 text-gray-400">
                No images available
              </div>
            )}

            {/* Vehicle Features */}
            {vehicle.listingThumbnailFeatures &&
              vehicle.listingThumbnailFeatures.length > 0 && (
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                  <h2 className="mb-4 text-xl font-semibold text-white">
                    Features
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.listingThumbnailFeatures.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {/* Vehicle Description */}
            <VehicleDescription vehicle={vehicle} />

            {/* Specifications */}
            <VehicleSpecs vehicle={vehicle} />
          </div>

          {/* Sidebar (1/3 width on desktop, sticky) */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            {/* Pricing Card */}
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <div className="mb-4">
                {vehicle.showCallForPrice ? (
                  <p className="text-2xl font-bold text-white">
                    Call for Price
                  </p>
                ) : vehicle.listingPrice ? (
                  <p className="text-3xl font-bold text-white">
                    ${vehicle.listingPrice.toLocaleString()}
                  </p>
                ) : null}
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-400">Mileage</dt>
                  <dd className="font-medium text-white">
                    {vehicle.mileage.toLocaleString()} mi
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Chassis</dt>
                  <dd className="font-medium text-white">{vehicle.chassis}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Status</dt>
                  <dd className="font-medium text-white">
                    {vehicle.status === "sold" ? "SOLD" : "Available"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Contact Form */}
            <VehicleContactForm
              slug={slug}
              title={vehicle.listingTitle}
              year={parseInt(vehicle.listingTitle.match(/^\d{4}/)?.[0] || new Date().getFullYear().toString())}
              make="BMW"
              model={vehicle.chassis}
              price={vehicle.listingPrice || 0}
              status={vehicle.status}
              source="Enthusiast Auto"
            />

            {/* Back to Inventory */}
            <Link
              href="/vehicles"
              className="block rounded-lg border border-gray-800 bg-gray-900 p-4 text-center text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              ← Back to Inventory
            </Link>
          </div>
        </div>

        {/* Compatible Parts Section - Full Width Below Main Content */}
        <RecommendationCarousel
          items={compatibleParts}
          type="product"
          title="Compatible Parts"
          hideIfEmpty={false}
        />
      </div>
    </>
  );
}
