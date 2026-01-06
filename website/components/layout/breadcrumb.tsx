import Link from "next/link";
import { Product } from "lib/shopify/types";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export function Breadcrumb({ product }: { product: Product }) {
  // Use productType as category (e.g., "Performance Parts", "Accessories")
  const category = product.productType || "Products";
  const categoryHandle =
    product.productType?.toLowerCase().replace(/\s+/g, "-") || "all";

  // Generate breadcrumb structured data for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://shop.enthusiastauto.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category,
        item: `https://shop.enthusiastauto.com/search/${categoryHandle}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `https://shop.enthusiastauto.com/product/${product.handle}`,
      },
    ],
  };

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Visual breadcrumb navigation */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm">
          <li>
            <Link
              href="/"
              className="text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRightIcon className="h-4 w-4 text-neutral-400" />
          </li>
          <li>
            <Link
              href={`/search/${categoryHandle}`}
              className="text-neutral-500 transition-colors hover:text-neutral-900"
            >
              {category}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRightIcon className="h-4 w-4 text-neutral-400" />
          </li>
          <li
            className="max-w-[200px] truncate font-medium text-neutral-900 sm:max-w-[300px]"
            aria-current="page"
          >
            {product.title}
          </li>
        </ol>
      </nav>
    </>
  );
}
