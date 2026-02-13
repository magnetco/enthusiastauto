"use client";

import { cn } from "@/lib/utils";
import {
  ClipboardCheck,
  Paintbrush,
  Shield,
  Sparkles,
  Wrench,
  Settings,
  Car,
  Gauge,
  Eye,
  Hammer,
  Palette,
  CircleDot,
} from "lucide-react";
import type { ReactNode } from "react";

// Map section titles to appropriate icons
const iconMap: Record<string, ReactNode> = {
  // Conditioning
  Evaluation: <ClipboardCheck className="h-6 w-6" />,
  "Paint Correction": <Paintbrush className="h-6 w-6" />,
  "Ceramic Coating": <Shield className="h-6 w-6" />,
  "Additional Protection": <Sparkles className="h-6 w-6" />,
  // Rejuvenation
  "Complete Assessment": <ClipboardCheck className="h-6 w-6" />,
  "Engine & Drivetrain": <Settings className="h-6 w-6" />,
  "Suspension Overhaul": <Gauge className="h-6 w-6" />,
  "Interior Restoration": <Car className="h-6 w-6" />,
  // Mechanical
  "Routine Maintenance": <Wrench className="h-6 w-6" />,
  "Diagnostics & Repair": <Eye className="h-6 w-6" />,
  "Performance Upgrades": <Gauge className="h-6 w-6" />,
  "Pre-Purchase Inspections": <ClipboardCheck className="h-6 w-6" />,
  // Cosmetic
  "Collision Repair": <Hammer className="h-6 w-6" />,
  "Paint Matching": <Palette className="h-6 w-6" />,
  "Dent & Ding Removal": <CircleDot className="h-6 w-6" />,
  "Stone Chip Repair": <Paintbrush className="h-6 w-6" />,
};

interface ServiceSection {
  title: string;
  content: string;
}

interface ServiceFeatureCardProps {
  section: ServiceSection;
  index: number;
  variant?: "default" | "dark";
  layout?: "grid" | "horizontal";
  image?: string;
}

export function ServiceFeatureCard({
  section,
  index,
  variant = "default",
  layout = "grid",
  image,
}: ServiceFeatureCardProps) {
  const icon = iconMap[section.title] || <Sparkles className="h-6 w-6" />;

  if (layout === "horizontal" && image) {
    return (
      <div
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg md:flex-row",
          variant === "dark"
            ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
            : "border-neutral-200 bg-white hover:border-neutral-300"
        )}
      >
        {/* Image - Smaller, left side on desktop */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-auto md:w-64">
          <img
            src={image}
            alt={section.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent" />
          {/* Number overlay on image */}
          <span
            className={cn(
              "absolute left-4 top-4 font-headline text-5xl font-bold text-white/90 md:text-6xl"
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Content - Takes remaining space */}
        <div className="relative flex-1 p-6 md:p-8">
          {/* Subtle gradient accent on hover */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
              variant === "dark"
                ? "from-blue-500/5 to-transparent"
                : "from-blue-50 to-transparent"
            )}
          />

          <div className="relative z-10 flex h-full flex-col">
            {/* Icon & Title Row */}
            <div className="mb-4 flex items-start gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors",
                  variant === "dark"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                )}
              >
                {icon}
              </div>
              
              {/* Title */}
              <h3
                className={cn(
                  "text-xl font-bold leading-tight md:text-2xl",
                  variant === "dark" ? "text-white" : "text-neutral-900"
                )}
              >
                {section.title}
              </h3>
            </div>

            {/* Content */}
            <p
              className={cn(
                "text-base leading-relaxed md:text-lg",
                variant === "dark" ? "text-white/80" : "text-neutral-600"
              )}
            >
              {section.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-lg",
        variant === "dark"
          ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
          : "border-neutral-200 bg-white hover:border-neutral-300"
      )}
    >
      {/* Subtle gradient accent on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          variant === "dark"
            ? "from-blue-500/5 to-transparent"
            : "from-blue-50 to-transparent"
        )}
      />

      <div className="relative z-10">
        {/* Icon & Number */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
              variant === "dark"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-blue-50 text-blue-600"
            )}
          >
            {icon}
          </div>
          <span
            className={cn(
              "font-headline text-4xl font-bold",
              variant === "dark" ? "text-white/10" : "text-neutral-100"
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "mb-3 text-lg font-bold",
            variant === "dark" ? "text-white" : "text-neutral-900"
          )}
        >
          {section.title}
        </h3>

        {/* Content */}
        <p
          className={cn(
            "text-sm leading-relaxed",
            variant === "dark" ? "text-white/70" : "text-neutral-600"
          )}
        >
          {section.content}
        </p>
      </div>
    </div>
  );
}

interface ServiceFeatureGridProps {
  sections: ServiceSection[];
  variant?: "default" | "dark";
  layout?: "grid" | "horizontal";
  images?: string[];
}

export function ServiceFeatureGrid({
  sections,
  variant = "default",
  layout = "grid",
  images,
}: ServiceFeatureGridProps) {
  return (
    <div
      className={cn(
        layout === "horizontal"
          ? "flex flex-col gap-6"
          : "grid gap-4 sm:grid-cols-2 lg:gap-6"
      )}
    >
      {sections.map((section, index) => (
        <ServiceFeatureCard
          key={section.title}
          section={section}
          index={index}
          variant={variant}
          layout={layout}
          image={images?.[index]}
        />
      ))}
    </div>
  );
}

