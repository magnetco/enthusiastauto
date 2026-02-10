"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Wrench, Sparkles, RefreshCw, Settings, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useServiceSelection, type ServiceType } from "./ServiceSelectionContext";

interface ServiceCardData {
  id: ServiceType;
  title: string;
  icon: React.ReactNode;
  badge?: string;
  description: string;
  features: string[];
  ideal: string;
}

const services: ServiceCardData[] = [
  {
    id: "conditioning",
    title: "Conditioning & Protection",
    icon: <Sparkles className="h-6 w-6" />,
    description:
      "Elevated vehicle care with paint correction, ceramic coating, and preservation treatments to restore and protect your BMW's finish.",
    features: [
      "Individual vehicle evaluation",
      "Multi-step paint correction",
      "Ceramic coating application",
      "Wheel & surface protection",
      "Better-than-new finish",
      "Long-term preservation",
    ],
    ideal: "Ideal for maintaining appearance and protecting paint, wheels, and surfaces",
  },
  {
    id: "rejuvenation",
    title: "Full Rejuvenation",
    icon: <RefreshCw className="h-6 w-6" />,
    badge: "M Series Specialists",
    description:
      "Complete restoration combining expert craftsmanship with specialized BMW M knowledge. Preserve heritage while exceeding original condition.",
    features: [
      "Complete vehicle assessment",
      "Engine & drivetrain restoration",
      "Suspension overhaul",
      "Interior restoration",
      "Electrical modernization",
      "Custom component fabrication",
    ],
    ideal: "Comprehensive restoration for enthusiasts seeking better-than-factory condition",
  },
  {
    id: "mechanical",
    title: "Mechanical Services",
    icon: <Settings className="h-6 w-6" />,
    badge: "BMW Specialists",
    description:
      "Expert mechanical services for BMW vehicles. From routine maintenance to complex repairs, our technicians deliver precise, reliable work.",
    features: [
      "Routine maintenance & inspections",
      "Engine diagnostics & repair",
      "Transmission service",
      "Brake & suspension work",
      "Performance upgrades",
      "Pre-purchase inspections",
    ],
    ideal: "Essential for maintenance, repairs, and performance enhancements",
  },
  {
    id: "cosmetic",
    title: "Cosmetic Repairs",
    icon: <Wrench className="h-6 w-6" />,
    badge: "Most Popular",
    description:
      "Professional repair of damage, dings, chips, and scratches using genuine BMW parts and factory-level painting techniques.",
    features: [
      "Door dings & stone chips",
      "Accident damage repair",
      "OE-level paint matching",
      "Genuine BMW parts only",
      "Factory-level orange peel",
      "Proper fitment guaranteed",
    ],
    ideal: "Perfect for minor to moderate exterior damage requiring bodywork and paint",
  },
];

export { services };
export type { ServiceType };

export function ServiceCards() {
  const { toggleService, isServiceSelected, selectedServices } = useServiceSelection();

  const scrollToForm = () => {
    const formElement = document.getElementById("request-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => {
          const isSelected = isServiceSelected(service.id);
          return (
            <Card
              key={service.id}
              role="button"
              tabIndex={0}
              onClick={() => toggleService(service.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleService(service.id);
                }
              }}
              className={cn(
                "group relative flex cursor-pointer flex-col transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/[0.03] ring-2 ring-primary/20"
                  : "hover:border-neutral-300 hover:shadow-md"
              )}
            >
              {/* Selection indicator */}
              <div
                className={cn(
                  "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-neutral-300 bg-white group-hover:border-neutral-400"
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </div>

              <CardHeader className="pb-3">
                <div className="mb-3 flex items-start gap-3">
                  <div
                    className={cn(
                      "rounded-lg p-2.5 transition-colors",
                      isSelected
                        ? "bg-primary/15 text-primary"
                        : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
                    )}
                  >
                    {service.icon}
                  </div>
                  {service.badge && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] font-medium uppercase tracking-wide",
                        isSelected && "bg-primary/10 text-primary"
                      )}
                    >
                      {service.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">{service.title}</CardTitle>
                <CardDescription className="text-body-xl leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col pt-0">
                <div className="mb-4 flex-1">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    What's Included
                  </h4>
                  <ul className="space-y-1.5">
                    {service.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-body-xl text-neutral-600">
                        <span
                          className={cn(
                            "mt-0.5 text-xs",
                            isSelected ? "text-primary" : "text-neutral-400"
                          )}
                        >
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {service.features.length > 4 && (
                      <li className="text-xs text-muted-foreground">
                        +{service.features.length - 4} more included
                      </li>
                    )}
                  </ul>
                </div>
                <div
                  className={cn(
                    "rounded-md p-2.5 text-xs",
                    isSelected ? "bg-primary/10" : "bg-neutral-50"
                  )}
                >
                  <p className="font-medium text-muted-foreground">{service.ideal}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selection summary and CTA */}
      {selectedServices.length > 0 && (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-primary/20 bg-primary/[0.03] p-4 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-neutral-700">Selected:</span>
            {selectedServices.map((serviceId) => {
              const service = services.find((s) => s.id === serviceId);
              return (
                <Badge key={serviceId} variant="secondary" className="bg-primary/10 text-primary">
                  {service?.title}
                </Badge>
              );
            })}
          </div>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Continue to Request Form
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
