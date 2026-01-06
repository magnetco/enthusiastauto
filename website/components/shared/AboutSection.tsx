import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const values = [
  {
    number: "01",
    title: "Quality Curation",
    description:
      "Every vehicle is hand-selected and every part is carefully chosen for quality and authenticity.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "BMW Expertise",
    description:
      "Decades of combined experience with BMW vehicles and parts ensure you get the right fit.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Dual Offering",
    description:
      "Whether you're buying your dream BMW or upgrading your current one, we've got you covered.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
  },
];

export function AboutSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#0a0c10] py-20 sm:py-28 lg:py-32"
      aria-labelledby="about-heading"
    >
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Subtle radial gradient */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-page-x">
        {/* Top Section - Split Layout */}
        <div className="mb-16 grid gap-12 lg:mb-20 lg:grid-cols-2 lg:gap-16">
          {/* Left: Heading */}
          <div>
            <p className="mb-4 text-body-small font-medium uppercase tracking-[0.25em] text-blue-400">
              Est. 2015 · Cincinnati, Ohio
            </p>
            <h2
              id="about-heading"
              className="font-headline text-[2rem] leading-[1.1] text-white sm:text-[2.5rem] lg:text-[3rem]"
            >
              The Ultimate Destination for BMW Enthusiasts
            </h2>
          </div>

          {/* Right: Description + CTA */}
          <div className="flex flex-col justify-end">
            <p className="mb-8 text-body-large leading-relaxed text-neutral-400 sm:text-body-xl">
              Enthusiast Auto offers curated BMW vehicles for sale and premium
              parts for BMW enthusiasts. We understand the passion for the
              ultimate driving machine—because we share it.
            </p>
            <div>
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "group gap-2 border-neutral-700 bg-transparent text-white hover:border-white hover:bg-white/5"
                )}
              >
                Our Story
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* M-Colors Divider */}
        <div className="mb-16 flex h-1 lg:mb-20">
          <div className="flex-1 bg-gradient-to-r from-transparent via-[#0066B1] to-[#0066B1]" />
          <div className="w-24 bg-[#6B3FA0]" />
          <div className="flex-1 bg-gradient-to-l from-transparent via-[#E32526] to-[#E32526]" />
        </div>

        {/* Value Propositions */}
        <div className="grid gap-6 sm:grid-cols-3 lg:gap-8">
          {values.map((value, index) => (
            <div
              key={value.number}
              className="group relative rounded-xl border border-neutral-800/50 bg-gradient-to-b from-neutral-900/50 to-transparent p-6 transition-all duration-500 hover:border-neutral-700 hover:bg-neutral-900/80 sm:p-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Large Background Number */}
              <span className="absolute right-4 top-4 font-mono text-[5rem] font-bold leading-none text-white/[0.03] transition-colors duration-500 group-hover:text-white/[0.06] sm:right-6 sm:top-6 sm:text-[6rem]">
                {value.number}
              </span>

              {/* Icon */}
              <div className="relative mb-5 inline-flex rounded-lg bg-blue-500/10 p-3 text-blue-400 ring-1 ring-blue-500/20">
                {value.icon}
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="mb-3 text-title-3 font-semibold text-white">
                  {value.title}
                </h3>
                <p className="text-body-base leading-relaxed text-neutral-400">
                  {value.description}
                </p>
              </div>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-neutral-800/50 pt-16 sm:grid-cols-4 lg:mt-20 lg:pt-20">
          {[
            { value: "500+", label: "Vehicles Sold" },
            { value: "10K+", label: "Parts Shipped" },
            { value: "25+", label: "Years Combined Experience" },
            { value: "4.9★", label: "Customer Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 font-headline text-[1.75rem] text-white sm:text-[2rem] lg:text-[2.5rem]">
                {stat.value}
              </div>
              <div className="text-body-small text-neutral-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
