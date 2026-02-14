"use client";

import { Star } from "lucide-react";
import { TitleBlock } from "@/components/shared/TitleBlock";

interface Testimonial {
  name: string;
  location: string;
  vehicle: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "James P.",
    location: "Cincinnati, OH",
    vehicle: "2011 E92 M3",
    quote:
      "EAG's paint correction and ceramic coating service transformed my M3. The attention to detail was incredible—they spent hours perfecting every panel. It looks better than the day I bought it.",
    rating: 5,
  },
  {
    name: "Robert M.",
    location: "Dayton, OH",
    vehicle: "1995 E36 M3",
    quote:
      "I brought my E36 to EAG for a full restoration. They understood the importance of preserving originality while addressing wear. The result exceeded my expectations, and they kept me informed every step of the way.",
    rating: 5,
  },
  {
    name: "Jennifer L.",
    location: "Lexington, KY",
    vehicle: "2019 F90 M5",
    quote:
      "After a minor parking lot incident, EAG's bodywork was flawless. You can't tell anything ever happened. Their color matching and attention to detail is unmatched in the region.",
    rating: 5,
  },
];

export function ServiceTestimonialsSection() {
  return (
    <section className="light-section w-full">
      <div className="mx-auto max-w-max px-page-x py-16 sm:py-24">
        {/* Header */}
        <TitleBlock
          title="WHAT OUR CLIENTS SAY"
          description="Real experiences from BMW enthusiasts who trust us with their vehicles."
          className="mb-16"
        />

        {/* Testimonials Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-8 transition-all duration-200 hover:border-[#2E90FA] hover:shadow-lg"
            >
              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-brand-red text-brand-red"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-6 flex-1 text-base leading-relaxed text-[#6f6e77]">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-[#282a30]">{testimonial.name}</p>
                <p className="text-sm text-[#6f6e77]">{testimonial.location}</p>
                <p className="mt-1 text-sm font-medium text-brand-deep-blue">
                  {testimonial.vehicle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
