"use client";

import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { TitleBlock } from "@/components/shared/TitleBlock";
import { useState, useRef } from "react";

const services = [
  {
    number: "01",
    title: "Rejuvenation",
    slug: "rejuvenation",
    description:
      "Complete restoration combining expert craftsmanship with specialized BMW M knowledge. Preserve heritage while exceeding original condition.",
    features: [
      "Complete vehicle assessment",
      "Engine & drivetrain restoration",
      "Suspension overhaul",
      "Interior restoration",
      "Electrical modernization",
    ],
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Mechanical",
    slug: "mechanical",
    description:
      "Expert mechanical services for BMW vehicles. From routine maintenance to complex repairs, our technicians deliver precise, reliable work.",
    features: [
      "Routine maintenance & inspections",
      "Engine diagnostics & repair",
      "Transmission service",
      "Brake & suspension work",
      "Performance upgrades",
    ],
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Cosmetic",
    slug: "cosmetic",
    description:
      "Professional repair of damage, dings, chips, and scratches using genuine BMW parts and factory-level painting techniques.",
    features: [
      "Door dings & stone chips",
      "Accident damage repair",
      "OE-level paint matching",
      "Genuine BMW parts only",
      "Factory-level orange peel",
    ],
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2070&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "Conditioning",
    slug: "conditioning",
    description:
      "Elevated vehicle care with paint correction, ceramic coating, and preservation treatments to restore and protect your BMW's finish.",
    features: [
      "Individual vehicle evaluation",
      "Multi-step paint correction",
      "Ceramic coating application",
      "Wheel & surface protection",
      "Long-term preservation",
    ],
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop",
  },
];

export function ServicesSection() {
  const [featured, ...secondaryServices] = services;
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const rafRef = useRef<number>();
  
  // TypeScript guard - services array is always populated
  if (!featured) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Throttle updates using requestAnimationFrame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  };

  const handleMouseEnter = () => {
    setIsSectionHovered(true);
  };

  const handleMouseLeave = () => {
    setIsSectionHovered(false);
    setMousePosition(null);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  return (
    <section
      className="relative bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="services-heading"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-page-x">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16">
          <TitleBlock
            title="Services"
            description="We are highly specialized on high performance BMW M-series only. The best of Bavaria. Take your dirty Supra down the road."
            id="services-heading"
            action={
              <ShimmerButton
                href="/services"
                aria-label="Get an estimate"
                size="lg"
                variant="tertiary"
                mousePosition={mousePosition}
                isHeroHovered={isSectionHovered}
              >
                Get an estimate
              </ShimmerButton>
            }
          />
        </div>

        {/* Featured Service (01) - Large Card */}
        <div className="mb-2">
          <Link
            href={`/services/${featured.slug}`}
            className="group grid gap-8 lg:grid-cols-[2fr,1fr] lg:gap-12"
          >
            {/* Featured Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:aspect-auto lg:min-h-[400px]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              {/* Image pagination dots */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                <span className="h-2 w-2 rounded-full bg-white/90" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
              </div>
            </div>

            {/* Featured Content */}
            <div className="flex flex-col justify-center lg:py-4">
              <span className="mb-2 font-mono text-sm tracking-wider text-neutral-400">
                {featured.number}
              </span>
              <h3 className="mb-4 font-headline text-xl uppercase tracking-wide text-neutral-900 sm:text-2xl">
                {featured.title}
              </h3>
              <p className="mb-4 text-body-xl leading-relaxed text-neutral-600">
                {featured.description}
              </p>
              <ul className="space-y-2">
                {featured.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                    <span className="mt-0.5 text-neutral-400">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        </div>

        {/* Secondary Services (02-04) - Three Column Grid */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryServices.map((service) => (
            <Link
              key={service.number}
              href={`/services/${service.slug}`}
              className="group"
            >
              {/* Service Image */}
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Service Content */}
              <div>
                <span className="mb-1 block font-mono text-sm tracking-wider text-neutral-400">
                  {service.number}
                </span>
                <h3 className="mb-3 font-headline text-lg uppercase tracking-wide text-neutral-900 transition-colors group-hover:text-blue-600">
                  {service.title}
                </h3>
                <p className="mb-3 text-body-xl leading-relaxed text-neutral-600">
                  {service.description}
                </p>
                <ul className="space-y-1.5">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="mt-0.5 text-neutral-400">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA - Mobile */}
        <div className="mt-10 flex justify-center sm:hidden">
          <ShimmerButton
            href="/services"
            aria-label="Get an estimate"
            size="lg"
            variant="tertiary"
            mousePosition={mousePosition}
            isHeroHovered={isSectionHovered}
            className="w-full"
          >
            Get an estimate
          </ShimmerButton>
        </div>
      </div>
    </section>
  );
}
