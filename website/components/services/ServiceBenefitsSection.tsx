"use client";

import { Shield, Wrench, Award, Clock, Users, Sparkles } from "lucide-react";
import { TitleBlock } from "@/components/shared/TitleBlock";

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "BMW Specialists",
    description:
      "Over a decade of exclusive BMW experience means we understand the unique needs of your M Series and classic models.",
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: "Factory-Exceeding Standards",
    description:
      "We don't just meet BMW specifications—we exceed them. Every service is performed with precision and attention to detail.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Preservation Focus",
    description:
      "Our approach prioritizes long-term preservation and value retention, not just quick fixes.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Transparent Timeline",
    description:
      "Clear communication throughout the process. You'll always know the status of your vehicle and when it will be ready.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Enthusiast-Owned",
    description:
      "We're BMW enthusiasts ourselves. We treat every vehicle as if it were our own and understand what matters to you.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Concours-Level Results",
    description:
      "From paint correction to full restoration, we deliver show-quality results that enhance both appearance and value.",
  },
];

export function ServiceBenefitsSection() {
  return (
    <section className="light-section w-full">
      <div className="mx-auto max-w-max px-page-x py-16 sm:py-24">
        {/* Header */}
        <TitleBlock
          title="WHY CHOOSE EAG SERVICE?"
          description="We're not just another repair shop. We're BMW preservation specialists who understand what makes your vehicle special and how to keep it performing at its best."
          className="mb-16"
        />

        {/* Benefits Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-gray-200 bg-white p-8 transition-all duration-200 hover:border-[#2E90FA] hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-deep-blue/10 text-brand-deep-blue transition-colors group-hover:bg-brand-deep-blue group-hover:text-white">
                {benefit.icon}
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold text-[#282a30]">
                {benefit.title}
              </h3>
              <p className="text-base leading-relaxed text-[#6f6e77]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-lg text-[#6f6e77]">
            Ready to experience the EAG difference?
          </p>
          <a
            href="#service-form"
            className="inline-flex items-center justify-center rounded-lg bg-brand-deep-blue px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-deep-blue/90"
          >
            Request Service Today
          </a>
        </div>
      </div>
    </section>
  );
}
