import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import Section from "components/layout/section";
import { Breadcrumb } from "components/layout/breadcrumb";
import { Gallery } from "components/product/gallery";
import { ProductProvider } from "components/product/product-context";
import { ProductDescription } from "components/product/product-description";
import { StickyAddToCart } from "components/product/sticky-add-to-cart";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getProduct, getProductRecommendations } from "lib/shopify";
import { Image as ShopifyImage, Product } from "lib/shopify/types";
import { RecommendationCarousel } from "@/components/shared/RecommendationCarousel";
import { getVehiclesWithPart } from "@/lib/shared/recommendations";
import { Badge } from "@/components/ui/badge";
import Price from "@/components/price";
import { TitleBlock } from "@/components/shared/TitleBlock";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://shop.enthusiastauto.com";
  const canonicalUrl = `${baseUrl}/product/${params.handle}`;

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          url: canonicalUrl,
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  // Fetch vehicles that are compatible with this product
  const compatibleVehicles = await getVehiclesWithPart(
    product.handle,
    product.tags,
  );

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <ProductProvider>
        <Section className="py-8 lg:py-12">
          {/* Breadcrumb Navigation */}
          <Breadcrumb product={product} />

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            {/* Main Content (2/3 width on desktop) */}
            <div className="space-y-8 lg:col-span-2">
              {/* Product Title and Status - Mobile */}
              <div className="lg:hidden">
                <ProductHeader product={product} />
              </div>

              {/* Photo Gallery */}
              <Suspense
                fallback={
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 animate-pulse" />
                }
              >
                <Gallery
                  images={product.images.slice(0, 8).map((image: ShopifyImage) => ({
                    src: image.url,
                    altText: image.altText,
                  }))}
                />
              </Suspense>

              {/* Product Description Section */}
              <ProductDetails product={product} />
            </div>

            {/* Sidebar (1/3 width on desktop, sticky) */}
            <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
              {/* Product Title - Desktop Only */}
              <div className="hidden lg:block">
                <ProductHeader product={product} />
              </div>

              {/* Purchase Section */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
                <Suspense fallback={null}>
                  <ProductDescription product={product} />
                </Suspense>
              </div>

              {/* Back to Parts */}
              <Link
                href="/parts"
                className="block rounded-lg border border-neutral-200 p-4 text-center text-sm text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
              >
                ← Browse All Parts
              </Link>
            </div>
          </div>
        </Section>

        {/* Vehicles in Stock Section */}
        {compatibleVehicles.length > 0 && (
          <Section className="border-t border-neutral-200 py-12 lg:py-16">
            <TitleBlock title="Vehicles in Stock with This Part" className="mb-8" />
            <RecommendationCarousel
              items={compatibleVehicles}
              type="vehicle"
              title=""
              hideIfEmpty={true}
            />
          </Section>
        )}

        {/* Related Products */}
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts id={product.id} />
        </Suspense>

        <StickyAddToCart product={product} />
      </ProductProvider>
    </>
  );
}

function ProductHeader({ product }: { product: Product }) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {product.vendor && (
          <Badge variant="outline" className="border-primary/30 text-primary text-xs font-medium">
            {product.vendor}
          </Badge>
        )}
        <Badge
          variant={product.availableForSale ? "success" : "destructive"}
          className="text-xs font-medium"
        >
          {product.availableForSale ? "In Stock" : "Out of Stock"}
        </Badge>
      </div>
      <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-2xl xl:text-3xl">
        {product.title}
      </h1>
    </div>
  );
}

function ProductDetails({ product }: { product: Product }) {
  if (!product.descriptionHtml) return null;

  return (
    <div className="border-t border-neutral-200 pt-8">
      <h2 className="mb-4 text-xl font-semibold text-neutral-900">
        Product Details
      </h2>
      <div
        className="prose prose-neutral max-w-none prose-headings:font-semibold prose-p:text-neutral-600 prose-li:text-neutral-600"
        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
      />
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <Section className="border-t border-neutral-200 py-12 lg:py-16">
      <div className="mb-8 h-8 w-48 animate-pulse rounded-md bg-neutral-200" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-lg bg-neutral-200" />
        ))}
      </div>
    </Section>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <Section className="border-t border-neutral-200 py-12 lg:py-16" aria-labelledby="related-products-heading">
      <TitleBlock title="Related Products" className="mb-8" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
        {relatedProducts.map((product) => (
          <RelatedProductCard key={product.handle} product={product} />
        ))}
      </div>
    </Section>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  const imageUrl = product.featuredImage?.url;

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group block"
      prefetch={true}
    >
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all duration-200 hover:border-neutral-300 hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="mb-1 line-clamp-2 text-sm font-medium text-neutral-900 transition-colors group-hover:text-primary">
            {product.title}
          </h3>
          <div className="text-sm font-semibold text-neutral-900">
            <Price
              amount={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
