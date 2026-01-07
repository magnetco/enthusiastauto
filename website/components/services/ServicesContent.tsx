"use client";

import { Suspense } from "react";
import { ServiceRequestWizard } from "./ServiceRequestWizard";

export function ServicesContent() {
  return (
    <Suspense
      fallback={
        <div className="light-section min-h-[70vh] w-full">
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#005A90] border-t-transparent" />
          </div>
        </div>
      }
    >
      <ServiceRequestWizard />
    </Suspense>
  );
}
