"use client";

import { FileText, Search, Camera, Handshake } from "lucide-react";
import { TitleBlock } from "@/components/shared/TitleBlock";

interface Step {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: <FileText className="h-6 w-6" />,
    title: "Submit Your Vehicle",
    description:
      "Fill out our simple form with your BMW's details. It takes just a few minutes and there's no obligation.",
  },
  {
    number: 2,
    icon: <Search className="h-6 w-6" />,
    title: "Expert Evaluation",
    description:
      "Our team reviews your submission and researches current market conditions to provide an accurate assessment.",
  },
  {
    number: 3,
    icon: <Camera className="h-6 w-6" />,
    title: "Inspection & Offer",
    description:
      "We schedule an in-person inspection (or review your photos) and present you with a detailed offer or consignment plan.",
  },
  {
    number: 4,
    icon: <Handshake className="h-6 w-6" />,
    title: "Close the Deal",
    description:
      "Accept our offer for immediate payment, or we'll handle marketing, showings, and the sale on your behalf.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative w-full overflow-hidden bg-bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/bg-hero-home.jpg)" }}
        />
        <div className="absolute inset-0 bg-bg-primary/90" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-max px-page-x py-16 sm:py-24">
        {/* Header */}
        <TitleBlock
          title="HOW IT WORKS"
          description="Our streamlined process makes selling your BMW simple and stress-free."
          className="mb-16 [&_h2]:text-white [&_p]:text-gray-300"
        />

        {/* Steps */}
        <div className="relative">
          {/* Steps Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col">
                {/* Step Card */}
                <div className="relative flex h-full flex-col rounded-xl border border-gray-700 bg-bg-secondary p-6 transition-all duration-200 hover:border-[#2E90FA] hover:shadow-lg hover:shadow-[#2E90FA]/20">
                  {/* Number Badge with Icon */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-deep-blue text-xl font-bold text-white">
                      {step.number}
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2E90FA]/10 text-[#2E90FA]">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-300">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (desktop only, not after last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-[#2E90FA]/60 lg:block">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-lg text-gray-300">
            Get started today — no commitment required.
          </p>
          <a
            href="#sell-form"
            className="inline-flex items-center justify-center rounded-lg bg-brand-red px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            Submit Your BMW
          </a>
        </div>
      </div>
    </section>
  );
}
