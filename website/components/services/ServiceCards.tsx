"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Sparkles, RefreshCw, Settings } from "lucide-react";

export type ServiceType = "conditioning" | "rejuvenation" | "mechanical" | "cosmetic";

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
    icon: <Sparkles className="h-8 w-8" />,
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
    icon: <RefreshCw className="h-8 w-8" />,
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
    icon: <Settings className="h-8 w-8" />,
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
    icon: <Wrench className="h-8 w-8" />,
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

export function ServiceCards() {
  const scrollToForm = (serviceType: ServiceType) => {
    const formElement = document.getElementById("request-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
      // Dispatch custom event to set the service type in the form
      window.dispatchEvent(
        new CustomEvent("selectService", { detail: { serviceType } })
      );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {services.map((service) => (
        <Card
          key={service.id}
          className="flex flex-col transition-shadow hover:shadow-lg"
        >
          <CardHeader>
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                {service.icon}
              </div>
              {service.badge && (
                <Badge variant="secondary" className="text-xs">
                  {service.badge}
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl">{service.title}</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {service.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <div className="mb-6 flex-1">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                What's Included
              </h4>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-primary">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4 rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground">
                {service.ideal}
              </p>
            </div>
            <Button
              onClick={() => scrollToForm(service.id)}
              className="w-full"
              variant={service.id === "cosmetic" ? "default" : "outline"}
            >
              Request {service.title}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
