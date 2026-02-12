"use client";

import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  vehicle: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Michael R.",
    location: "Columbus, OH",
    vehicle: "2015 BMW M4",
    quote:
      "EAG made selling my M4 incredibly easy. They handled everything from photos to marketing, and I got significantly more than I would have through a trade-in. Highly recommend their consignment service.",
    rating: 5,
  },
  {
    name: "Sarah T.",
    location: "Indianapolis, IN",
    vehicle: "2008 E92 M3",
    quote:
      "I needed to sell quickly, and EAG's direct purchase option was perfect. They gave me a fair offer, handled my loan payoff, and I had the money in my account within days. No hassle at all.",
    rating: 5,
  },
  {
    name: "David K.",
    location: "Louisville, KY",
    vehicle: "2018 M2 Competition",
    quote:
      "The team at EAG truly understands BMWs and the enthusiast market. They positioned my M2 perfectly and found a buyer who appreciated all the work I'd put into it. Worth every penny of their commission.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="light-section w-full">
      <div className="mx-auto max-w-[var(--container-max)] px-page-x py-16 sm:py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-headline text-3xl tracking-wider text-[#282a30] sm:text-4xl">
            WHAT OUR SELLERS SAY
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#6f6e77]">
            Real experiences from BMW enthusiasts who trusted us with their vehicles.
          </p>
        </div>

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
                    className="h-5 w-5 fill-[#F90020] text-[#F90020]"
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
                <p className="mt-1 text-sm font-medium text-[#005A90]">
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
