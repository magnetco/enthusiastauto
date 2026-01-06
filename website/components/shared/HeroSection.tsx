import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BMWMStripesHorizontal } from "@/components/icons/bmw-m-stripes";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] w-full items-center overflow-hidden bg-black lg:min-h-[85vh]">
      {/* Background Image with darker overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        {/* Dark gradient overlay for dramatic effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>

      {/* Decorative M stripe accent at top */}
      <div className="absolute left-0 top-0 z-10 h-1 w-full">
        <div className="flex h-full">
          <div className="h-full w-1/3 bg-[#0066B1]" />
          <div className="h-full w-1/3 bg-[#6B3FA0]" />
          <div className="h-full w-1/3 bg-[#E32526]" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-[var(--container-max)] px-page-x py-20 lg:py-24">
        <div className="max-w-3xl">
          {/* M Stripes Accent */}
          <BMWMStripesHorizontal className="mb-6" />

          {/* Eyebrow Text */}
          <p className="mb-4 text-body-small font-medium uppercase tracking-[0.2em] text-white/60">
            Enthusiast Auto Group
          </p>

          {/* Main Heading - Large and Bold */}
          <h1 className="mb-6 text-4xl font-bold uppercase leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            The Leading{" "}
            <span className="bg-gradient-to-r from-[#0066B1] via-[#6B3FA0] to-[#E32526] bg-clip-text text-transparent">
              BMW
            </span>{" "}
            Preservation Facility
          </h1>

          {/* Subheadline */}
          <p className="mb-10 max-w-xl text-body-large text-white/70 sm:text-body-xl">
            Specializing in the acquisition, restoration, and preservation of 
            iconic BMW automobiles. Where passion meets precision.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
            <Link
              href="/vehicles"
              aria-label="View vehicle inventory"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white px-8 font-semibold text-black hover:bg-white/90"
              )}
            >
              View Inventory
            </Link>
            <Link
              href="/services"
              aria-label="Explore our services"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-white/30 font-semibold text-white hover:bg-white/10 hover:border-white/50"
              )}
            >
              Our Services
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade to content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
