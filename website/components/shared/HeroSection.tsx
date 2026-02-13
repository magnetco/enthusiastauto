import { PageHero } from "./PageHero";

/**
 * Homepage Hero Section
 * Full-height dramatic hero for the landing page
 */
export function HeroSection() {
  return (
    <PageHero
      size="medium"
      title="The Leading BMW Preservation Facility"
      subtitle="Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles. Where passion meets precision."
      backgroundImage="/bg-hero-home.jpg"
      ctas={[
        {
          label: "View Inventory",
          href: "/vehicles",
          variant: "shimmer",
          ariaLabel: "View vehicle inventory",
        },
        {
          label: "Our Services",
          href: "/services",
          variant: "outline",
          ariaLabel: "Explore our services",
        },
      ]}
    />
  );
}
