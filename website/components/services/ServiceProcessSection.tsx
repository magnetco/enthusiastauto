"use client";

import { MessageSquare, ClipboardCheck, Wrench, CheckCircle2 } from "lucide-react";
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
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Request Service",
    description:
      "Submit your service request online or call us directly. Tell us about your BMW and what services you're interested in.",
  },
  {
    number: 2,
    icon: <ClipboardCheck className="h-6 w-6" />,
    title: "Consultation & Quote",
    description:
      "We'll review your request, schedule an inspection if needed, and provide a detailed quote with timeline and pricing.",
  },
  {
    number: 3,
    icon: <Wrench className="h-6 w-6" />,
    title: "Expert Service",
    description:
      "Our team performs the work with precision and care. We'll keep you updated throughout the process with photos and progress reports.",
  },
  {
    number: 4,
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: "Quality Inspection",
    description:
      "Every service undergoes thorough inspection to ensure it meets our exacting standards before your vehicle is returned.",
  },
];

export function ServiceProcessSection() {
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
          title="OUR SERVICE PROCESS"
          description="A streamlined approach that ensures quality results and complete transparency from start to finish."
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
            Experience the difference of true BMW expertise.
          </p>
          <a
            href="#service-form"
            className="inline-flex items-center justify-center rounded-lg bg-brand-red px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            Schedule Your Service
          </a>
        </div>
      </div>
    </section>
  );
}
