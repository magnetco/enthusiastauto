"use client";

import { Suspense } from "react";
import { ServiceRequestWizard } from "./ServiceRequestWizard";
import { ServiceBenefitsSection } from "./ServiceBenefitsSection";
import { ServiceProcessSection } from "./ServiceProcessSection";
import { ServiceTestimonialsSection } from "./ServiceTestimonialsSection";
import { FAQSection, type FAQItem } from "@/components/shared/FAQSection";
import { openChatWithMessage } from "@/lib/utils/chat";

const serviceFAQs: FAQItem[] = [
  {
    question: "What types of services do you offer?",
    chatPrompt:
      "I'd like to learn more about the services EAG offers. What types of BMW services do you provide?",
  },
  {
    question: "How long does paint correction and ceramic coating take?",
    chatPrompt:
      "I'm interested in paint correction and ceramic coating for my BMW. How long does this process typically take?",
  },
  {
    question: "Do you work on all BMW models or just M Series?",
    chatPrompt:
      "I have a BMW but it's not an M Series. Do you provide services for all BMW models?",
  },
  {
    question: "Can you provide a quote before I bring my vehicle in?",
    chatPrompt:
      "I'd like to get an estimate for service work on my BMW. Can you provide a quote before I schedule an appointment?",
  },
  {
    question: "Do you offer pickup and delivery services?",
    chatPrompt:
      "I'm interested in your services but I'm located outside Cincinnati. Do you offer pickup and delivery for service work?",
  },
  {
    question: "What's included in a full restoration service?",
    chatPrompt:
      "I'm considering a full restoration for my BMW. What does your restoration service include and what's the typical timeline?",
  },
  {
    question: "Can you work with insurance companies for repairs?",
    chatPrompt:
      "My BMW needs bodywork and I have insurance coverage. Do you work with insurance companies for claims?",
  },
  {
    question: "Do you provide warranties on your service work?",
    chatPrompt:
      "I'd like to know about warranties and guarantees. Do you provide any warranties on your service work?",
  },
];

export function ServicesContent() {
  return (
    <>
      {/* Benefits Section */}
      <ServiceBenefitsSection />

      {/* Process Section */}
      <ServiceProcessSection />

      {/* Testimonials Section */}
      <ServiceTestimonialsSection />

      {/* FAQ Section */}
      <section className="light-section w-full">
        <div className="mx-auto max-w-max px-page-x py-16 sm:py-24">
          <FAQSection
            title="Common Questions"
            description="Get instant answers by chatting with our team. Click any question to start a conversation."
            faqs={serviceFAQs}
            columns={2}
            onQuestionClick={openChatWithMessage}
          />
        </div>
      </section>

      {/* Form Section */}
      <section id="service-form" className="scroll-mt-20">
        <Suspense
          fallback={
            <div className="light-section min-h-[70vh] w-full">
              <div className="flex items-center justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-deep-blue border-t-transparent" />
              </div>
            </div>
          }
        >
          <ServiceRequestWizard />
        </Suspense>
      </section>
    </>
  );
}
