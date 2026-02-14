"use client";

import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { SellRequestWizard } from "./SellRequestWizard";
import { BenefitsSection } from "./BenefitsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQSection, type FAQItem } from "@/components/shared/FAQSection";
import { openChatWithMessage } from "@/lib/utils/chat";

const sellFAQs: FAQItem[] = [
  {
    question: "How long does the selling process take?",
    chatPrompt:
      "I'd like to know more about the timeline for selling my BMW with EAG. How long does the process typically take from submission to sale?",
  },
  {
    question: "What's the difference between selling direct and consignment?",
    chatPrompt:
      "Can you explain the differences between selling my BMW directly to EAG versus consignment? What are the pros and cons of each option?",
  },
  {
    question: "Do you buy BMWs that need repairs or have high mileage?",
    chatPrompt:
      "I have a BMW that needs some repairs and has higher mileage. Do you still purchase vehicles in this condition, and how does it affect the offer?",
  },
  {
    question: "How do you determine the value of my vehicle?",
    chatPrompt:
      "I'm curious about how EAG evaluates BMWs. What factors do you consider when determining the value of my vehicle?",
  },
  {
    question: "Can I sell a BMW that still has a loan on it?",
    chatPrompt:
      "My BMW still has an outstanding loan. Can EAG still purchase it, and how do you handle the payoff process?",
  },
  {
    question: "What documents do I need to sell my BMW?",
    chatPrompt:
      "What paperwork and documents will I need to provide when selling my BMW to EAG?",
  },
  {
    question: "Do you only buy M-Series vehicles?",
    chatPrompt:
      "I have a BMW but it's not an M-Series. Does EAG purchase other BMW models, or do you specialize only in M cars?",
  },
  {
    question: "How does the auction process work?",
    chatPrompt:
      "I'm interested in the auction option for selling my BMW. Can you walk me through how the auction process works with Bring a Trailer or Cars&Bids?",
  },
];

export function SellPageContent() {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        size="medium"
        title={
          <>
            Allow EAG To
            <br />
            <span className="text-[#2E90FA]">Represent Your Car</span>
          </>
        }
        subtitle="At Enthusiast Auto Group, we understand that for many enthusiasts, their cars are more than just vehicles—they're family members. Parting with them can be a challenging decision, and we're here to make that process as smooth as possible."
        backgroundImage="/images/sell-hero-bg.avif"
        ctas={[
          {
            label: "Start Your Submission",
            href: "#sell-form",
            variant: "primary",
          },
        ]}
      />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <section className="light-section w-full">
        <div className="mx-auto max-w-[var(--container-max)] px-page-x py-16 sm:py-24">
          <FAQSection
            title="Common Questions"
            description="Get instant answers by chatting with our team. Click any question to start a conversation."
            faqs={sellFAQs}
            columns={2}
            onQuestionClick={openChatWithMessage}
          />
        </div>
      </section>

      {/* Form Section */}
      <section id="sell-form" className="scroll-mt-20">
        <Suspense
          fallback={
            <div className="light-section min-h-[70vh] w-full">
              <div className="flex items-center justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#005A90] border-t-transparent" />
              </div>
            </div>
          }
        >
          <SellRequestWizard />
        </Suspense>
      </section>
    </>
  );
}
