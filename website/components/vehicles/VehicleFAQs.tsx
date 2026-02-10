"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  question: string;
  answer: string;
}

interface VehicleFAQsProps {
  vehicleFaqs: FAQ[];
  globalFaqs: FAQ[];
}

export function VehicleFAQs({
  vehicleFaqs,
  globalFaqs,
}: VehicleFAQsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const allFaqs = [...vehicleFaqs, ...globalFaqs];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
          <h2 className="font-chromatic text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
            FAQs
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
        </div>

        <div className="mx-auto max-w-4xl">
          {/* FAQ List */}
          {allFaqs.length > 0 && (
            <div className="space-y-4">
              {allFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
                  >
                    <span className="font-medium text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-gray-500 transition-transform",
                        openIndex === index && "rotate-180"
                      )}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="border-t border-gray-200 px-6 py-4">
                      <p className="text-sm leading-relaxed text-gray-700">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Default FAQs if none provided */}
          {allFaqs.length === 0 && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <button
                  onClick={() => toggleFaq(0)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="font-medium text-foreground">
                    What are some key performance features of the 2008 M3?
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-gray-500 transition-transform",
                      openIndex === 0 && "rotate-180"
                    )}
                  />
                </button>
                {openIndex === 0 && (
                  <div className="border-t border-gray-200 px-6 py-4">
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
                      <li>0-60 mph acceleration in about 4.5 seconds</li>
                      <li>Electronic damper control for adjustable suspension</li>
                      <li>M Dynamic Mode for enhanced driving dynamics</li>
                      <li>
                        Large cross-drilled brake rotors for improved stopping power
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <button
                  onClick={() => toggleFaq(1)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="font-medium text-foreground">
                    How does the fuel economy of the 2008 M3 compare to other sports
                    cars?
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-gray-500 transition-transform",
                      openIndex === 1 && "rotate-180"
                    )}
                  />
                </button>
                {openIndex === 1 && (
                  <div className="border-t border-gray-200 px-6 py-4">
                    <p className="text-sm leading-relaxed text-gray-700">
                      The 2008 M3's fuel economy is rated at approximately 14 mpg city
                      and 20 mpg highway. This is typical for high-performance vehicles
                      of its era, but less efficient than many modern sports cars.
                    </p>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <button
                  onClick={() => toggleFaq(2)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <span className="font-medium text-foreground">
                    What are some distinctive exterior features of the 2008 M3?
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-gray-500 transition-transform",
                      openIndex === 2 && "rotate-180"
                    )}
                  />
                </button>
                {openIndex === 2 && (
                  <div className="border-t border-gray-200 px-6 py-4">
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
                      <li>Power dome on the aluminum hood</li>
                      <li>Wider fenders to accommodate larger wheels and tires</li>
                      <li>Quad exhaust tips</li>
                      <li>
                        Unique M3-specific side vents and aerodynamic elements
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
