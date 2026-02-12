"use client";

import { Shield, TrendingUp, Users, Clock, Award, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Trusted Expertise",
    description:
      "Over a decade of BMW specialization means we understand the true value of your vehicle and can position it to the right buyers.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Maximum Market Value",
    description:
      "Our enthusiast network and marketing expertise consistently achieve higher sale prices than traditional channels.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Enthusiast Buyers",
    description:
      "We connect you with serious BMW enthusiasts who appreciate quality and are willing to pay for well-maintained vehicles.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Flexible Timeline",
    description:
      "Whether you need immediate payment or want to maximize value through consignment, we offer options that fit your needs.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Professional Presentation",
    description:
      "Our in-house photography, detailing, and marketing team presents your vehicle in the best possible light.",
  },
  {
    icon: <FileCheck className="h-6 w-6" />,
    title: "Transparent Process",
    description:
      "No hidden fees or surprises. We clearly communicate every step, from initial evaluation to final sale.",
  },
];

export function BenefitsSection() {
  return (
    <section className="light-section w-full">
      <div className="mx-auto max-w-[var(--container-max)] px-page-x py-16 sm:py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-headline text-3xl tracking-wider text-[#282a30] sm:text-4xl">
            WHY SELL WITH EAG?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#6f6e77]">
            We're not just another car dealer. We're BMW enthusiasts who understand
            what makes your vehicle special and how to connect it with the right buyer.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-gray-200 bg-white p-8 transition-all duration-200 hover:border-[#2E90FA] hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#005A90]/10 text-[#005A90] transition-colors group-hover:bg-[#005A90] group-hover:text-white">
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
            Ready to see what your BMW is worth?
          </p>
          <a
            href="#sell-form"
            className="inline-flex items-center justify-center rounded-lg bg-[#005A90] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#005A90]/90"
          >
            Get Your Free Evaluation
          </a>
        </div>
      </div>
    </section>
  );
}
