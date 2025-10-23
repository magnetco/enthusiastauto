"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, generateBreadcrumbSchema } from "./Breadcrumb";

interface BreadcrumbsProps {
  /**
   * Custom title for the current page (overrides auto-generated label)
   * Useful for dynamic routes like /vehicles/[slug]
   */
  customTitle?: string;

  /**
   * Additional custom breadcrumb items to prepend
   * Useful for nested pages with specific navigation hierarchy
   */
  customItems?: Array<{ label: string; href?: string }>;

  /**
   * If true, render schema.org JSON-LD structured data
   * @default true
   */
  includeSchema?: boolean;

  /**
   * Base URL for schema.org structured data
   * @default https://shop.enthusiastauto.com
   */
  baseUrl?: string;
}

/**
 * Breadcrumbs component - Auto-generates breadcrumb navigation from current URL
 * Part of Epic 4 routing architecture (Story 4.3)
 *
 * Automatically generates breadcrumb trail from current pathname using Next.js usePathname()
 * Supports custom titles for dynamic routes and schema.org BreadcrumbList structured data
 *
 * @example
 * // Basic usage (auto-generates from URL)
 * <Breadcrumbs />
 *
 * @example
 * // With custom title for dynamic route
 * <Breadcrumbs customTitle="1990 BMW E30 M3" />
 *
 * @example
 * // With custom items for complex hierarchy
 * <Breadcrumbs customItems={[{ label: "Dashboard", href: "/account" }]} />
 */
export function Breadcrumbs({
  customTitle,
  customItems = [],
  includeSchema = true,
  baseUrl = "https://shop.enthusiastauto.com",
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const items = generateBreadcrumbItems(pathname, customTitle);

  // Prepend custom items if provided
  const allItems = [...customItems, ...items];

  return (
    <>
      <Breadcrumb items={allItems} />
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbSchema(allItems, baseUrl)),
          }}
        />
      )}
    </>
  );
}

/**
 * Generate breadcrumb items from pathname
 * Home > Vehicles > [Vehicle Title]
 * Home > Parts > Brakes > Brake Pads
 */
function generateBreadcrumbItems(
  pathname: string,
  customTitle?: string
): Array<{ label: string; href?: string }> {
  // Always start with Home
  const items: Array<{ label: string; href?: string }> = [
    { label: "Home", href: "/" },
  ];

  // Handle homepage - no additional breadcrumbs
  if (pathname === "/") {
    return items;
  }

  // Split pathname into segments
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb trail
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Generate label from segment
    let label = formatSegmentLabel(segment);

    // Use custom title for last segment if provided
    if (isLast && customTitle) {
      label = customTitle;
    }

    // Add item
    items.push({
      label,
      href: isLast ? undefined : currentPath, // Last item has no href
    });
  });

  return items;
}

/**
 * Format URL segment into human-readable label
 * vehicles -> Vehicles
 * product -> Products
 * brake-pads -> Brake Pads
 */
function formatSegmentLabel(segment: string): string {
  // Special cases for known routes
  const labelMap: Record<string, string> = {
    vehicles: "Vehicles",
    product: "Products",
    products: "Products",
    parts: "Parts",
    search: "Search",
    account: "My Account",
    studio: "Studio",
  };

  if (labelMap[segment]) {
    return labelMap[segment];
  }

  // For dynamic segments or unknown routes
  // Convert kebab-case to Title Case
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
