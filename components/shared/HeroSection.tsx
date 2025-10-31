import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Section from "@/components/layout/section";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        {/* Gradient Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background" />
      </div>

      {/* Hero Content */}
      <Section as="div" className="relative z-10 py-16 sm:py-20 lg:py-24">
        {/* Main Heading */}
        <h1 className="heading-uppercase mb-4 max-w-[50rem] text-title-1 font-bold text-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-hero">
          Your BMW Enthusiast Destination
        </h1>

        {/* Subheadline */}
        <p className="mb-3 max-w-[40rem] text-body-large text-muted-foreground drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-body-xl">
          Curated vehicles and premium parts for the ultimate driving machine
        </p>

        {/* Value Proposition */}
        <p className="mb-8 max-w-[35rem] text-body-base text-muted-foreground/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:mb-10 lg:mb-12">
          Enthusiast Auto offers hand-picked BMW vehicles for sale alongside a
          comprehensive catalog of quality parts and accessories.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
          <Link
            href="/vehicles"
            aria-label="Browse vehicle inventory"
            className={cn(buttonVariants({ size: "lg" }), "font-semibold")}
          >
            Browse Vehicles
          </Link>
          <Link
            href="/search"
            aria-label="Shop parts catalog"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "font-semibold",
            )}
          >
            Shop Parts
          </Link>
        </div>
      </Section>
    </section>
  );
}
