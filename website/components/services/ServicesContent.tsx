"use client";

import { Suspense } from "react";
import Section from "@/components/layout/section";
import { TitleBlock } from "@/components/shared/TitleBlock";
import { ServiceCards } from "./ServiceCards";
import { ServiceRequestForm } from "./ServiceRequestForm";
import { ServiceSelectionProvider } from "./ServiceSelectionContext";

export function ServicesContent() {
  return (
    <ServiceSelectionProvider>
      {/* Services Overview */}
      <Section className="py-12 sm:py-16 lg:py-20">
        <TitleBlock
          title="Services"
          description="Choose the services that fit your BMW's needs. Select multiple if needed — our team will help determine the right approach."
          id="services-heading"
          className="mb-10"
        />
        <ServiceCards />
      </Section>

      {/* Service Request Form */}
      <Section id="request-form" className="bg-white py-12 sm:py-16 lg:py-20">
        <TitleBlock
          title="Request a Service"
          description="Tell us about your BMW and what you'd like us to help with. We'll contact you to discuss your needs and schedule an assessment."
          id="request-heading"
          className="mb-10"
        />
        <Suspense
          fallback={
            <div className="mx-auto max-w-3xl">
              <div className="h-[600px] animate-pulse rounded-lg bg-muted" />
            </div>
          }
        >
          <ServiceRequestForm />
        </Suspense>
      </Section>
    </ServiceSelectionProvider>
  );
}

