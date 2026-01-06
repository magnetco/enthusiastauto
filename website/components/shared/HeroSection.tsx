import { PageHero } from "./PageHero";

/**
 * Homepage Hero Section
 * Full-height dramatic hero for the landing page
 */
export function HeroSection() {
  return (
    <PageHero
      size="full"
      eyebrow="Enthusiast Auto Group"
      title="The Leading BMW Preservation Facility"
      subtitle="Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles. Where passion meets precision."
      backgroundImage="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop"
      ctas={[
        {
          label: "View Inventory",
          href: "/vehicles",
          variant: "primary",
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
