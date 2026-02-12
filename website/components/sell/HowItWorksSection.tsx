"use client";

import { FileText, Search, Camera, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <section className="w-full bg-[#141721]">
      <div className="mx-auto max-w-[var(--container-max)] px-page-x py-16 sm:py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-headline text-3xl tracking-wider text-white sm:text-4xl">
            HOW IT WORKS
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            Our streamlined process makes selling your BMW simple and stress-free.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (hidden on mobile) */}
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-transparent via-[#2E90FA]/30 to-transparent lg:block" />

          {/* Steps Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="relative rounded-xl border border-gray-700 bg-[#1f2233] p-6 transition-all duration-200 hover:border-[#2E90FA] hover:shadow-lg hover:shadow-[#2E90FA]/20">
                  {/* Number Badge */}
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#005A90] text-2xl font-bold text-white">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2E90FA]/10 text-[#2E90FA]">
                    {step.icon}
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
                  <div className="absolute -right-4 top-8 hidden text-[#2E90FA]/50 lg:block">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
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
            className="inline-flex items-center justify-center rounded-lg bg-[#F90020] px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            Submit Your BMW
          </a>
        </div>
      </div>
    </section>
  );
}
