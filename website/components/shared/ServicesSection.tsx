import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { BMWMStripesHorizontal } from "@/components/icons/bmw-m-stripes";

const services = [
  {
    number: "01",
    title: "Acquisition",
    description:
      "Expert sourcing of rare and exceptional BMW vehicles worldwide. We locate the perfect addition to your collection.",
  },
  {
    number: "02",
    title: "Restoration",
    description:
      "Comprehensive restoration services from mechanical rebuilds to concours-level cosmetic work.",
  },
  {
    number: "03",
    title: "Preservation",
    description:
      "Climate-controlled storage and ongoing maintenance to keep your investment in pristine condition.",
  },
  {
    number: "04",
    title: "Consignment",
    description:
      "Professional sales representation to connect your vehicle with discerning collectors and enthusiasts.",
  },
];

export function ServicesSection() {
  return (
    <section
      className="relative bg-card py-16 sm:py-20 lg:py-24"
      aria-labelledby="services-heading"
    >
      {/* Subtle top border accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-[var(--container-max)] px-page-x">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end lg:mb-16">
          <div>
            {/* Section Label */}
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-body-small font-medium text-muted-foreground">
                //
              </span>
              <BMWMStripesHorizontal className="h-0.5 w-8" />
            </div>

            <h2
              id="services-heading"
              className="font-mono text-body-small font-medium uppercase tracking-[0.15em] text-muted-foreground"
            >
              // Services
            </h2>

            <p className="mt-3 text-title-1 font-bold text-foreground sm:text-hero">
              What We Offer
            </p>

            <p className="mt-3 max-w-md text-body-base text-muted-foreground sm:text-body-large">
              Comprehensive services for BMW collectors and enthusiasts
            </p>
          </div>

          {/* CTA - Desktop */}
          <Link
            href="/services"
            aria-label="Learn more about our services"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "hidden gap-2 sm:inline-flex"
            )}
          >
            All Services
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Services Grid - Numbered Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {services.map((service) => (
            <div
              key={service.number}
              className="group relative overflow-hidden rounded-lg border border-border/50 bg-background p-6 transition-all duration-300 hover:border-border hover:shadow-medium sm:p-8"
            >
              {/* Large Number */}
              <span className="absolute -right-4 -top-8 font-mono text-[8rem] font-bold leading-none text-muted/20 transition-colors duration-300 group-hover:text-muted/30 sm:text-[10rem]">
                {service.number}
              </span>

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-body-large font-bold text-primary">
                    {service.number}
                  </span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>

                <h3 className="mb-3 text-title-3 font-semibold text-foreground">
                  {service.title}
                </h3>

                <p className="text-body-base text-muted-foreground">
                  {service.description}
                </p>
              </div>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#0066B1] via-[#6B3FA0] to-[#E32526] transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* CTA - Mobile */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/services"
            aria-label="Learn more about our services"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full gap-2"
            )}
          >
            All Services
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

