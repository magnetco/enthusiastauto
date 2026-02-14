import { PageHero } from "@/components/shared/PageHero";

/**
 * Service Page Hero
 * Medium-height hero with feature badges
 */
export function ServiceHero() {
  return (
    <PageHero
      size="medium"
      eyebrow="SERVICES"
      title={
        <>
          Expert BMW Care
          <br />
          <span className="text-blue-400">From Touch-Ups to Total Restoration</span>
        </>
      }
      subtitle="Whether you need cosmetic repairs, protective treatments, or complete restoration, we deliver factory-exceeding results."
      backgroundImage="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop"
      ctas={[
        {
          label: "Start Your Request",
          href: "#service-form",
          variant: "primary",
        },
      ]}
    />
  );
}
