"use client";

import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { TitleBlock } from "@/components/shared/TitleBlock";
import { SellRequestWizard } from "./SellRequestWizard";

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
        backgroundImage="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop"
        ctas={[
          {
            label: "Start Your Submission",
            href: "#sell-form",
            variant: "primary",
          },
        ]}
      />

      {/* Form Section */}
      <section id="sell-form" className="scroll-mt-20">
        <div className="light-section border-b border-[#DFE5EA] px-page-x py-12">
          <div className="mx-auto max-w-5xl">
            <TitleBlock
              title="SELL YOUR BMW"
              description="Whether you're looking to sell directly, consign for maximum value, or reach a wider audience through auction, we have the expertise and network to get the best outcome for your vehicle."
            />
          </div>
        </div>

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
