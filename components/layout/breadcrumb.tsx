import Link from "next/link";
import { Product } from "lib/shopify/types";

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
        <ol className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <li>
            <Link
              href="/"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/search/${categoryHandle}`}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li
            className="text-neutral-900 dark:text-neutral-100 font-medium"
            aria-current="page"
          >
            {product.title}
          </li>
        </ol>
      </nav>
    </>
  );
}
