import Section from "@/components/layout/section";
import { ServiceRequestForm } from "@/components/services/ServiceRequestForm";
import { ServiceSelectionProvider } from "@/components/services/ServiceSelectionContext";
import { ServiceFeatureGrid } from "@/components/services/ServiceFeatureCard";
import { ServiceContactInfo } from "@/components/services/ServiceContactInfo";
import { RelatedBlogPosts } from "@/components/services/RelatedBlogPosts";
import { TitleBlock } from "@/components/shared/TitleBlock";
import { PageHero } from "@/components/shared/PageHero";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface ServiceSection {
  title: string;
  content: string;
}

interface Service {
  title: string;
  heroTitle: string;
  tagline: string;
  description: string;
  heroImage: string;
  sections: ServiceSection[];
  conclusion: string;
  formTitle: string;
  formDescription: string;
  extendedDescription?: string;
  sectionImages?: string[];
  layout?: "grid" | "horizontal";
}

// Service data - in the future, this will come from Sanity CMS
const services: Record<string, Service> = {
  conditioning: {
    title: "Conditioning & Protection",
    heroTitle: "CONDITIONING",
    tagline: "Next Level Conditioning Services",
    description:
      "Conditioning your vehicle is a level above getting a quick detail. It's a whole process that individually inspects each vehicle and through the best products as well as the latest procedures ensures a final product of the highest quality.",
    heroImage:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop",
    sections: [
      {
        title: "Evaluation",
        content:
          "With decades of experience seeing vehicles of all conditions, we're able to predict and provide a roadmap to completing your goals. Every vehicle receives a thorough inspection to identify areas requiring attention.",
      },
      {
        title: "Paint Correction",
        content:
          "Our paint correction service is a meticulous multi-step process designed to restore your BMW's finish to better-than-new condition. We remove swirls, scratches, and oxidation to reveal the true depth of your paint.",
      },
      {
        title: "Ceramic Coating",
        content:
          "Our ceramic coating service provides unparalleled protection for your BMW's paint, wheels, and other surfaces. This cutting-edge technology forms a permanent bond with your vehicle's clear coat, creating an extremely durable layer of protection.",
      },
      {
        title: "Additional Protection",
        content:
          "Maintaining the quality of how your vehicle presents is paramount in long-term enjoyment. We offer paint protection film, wheel coatings, and interior treatments to preserve your investment.",
      },
    ],
    conclusion:
      "Few things are more satisfying than a vehicle that's completed our conditioning process. Not only is this the best your BMW has ever looked, it's also protected to ensure it continues to impress years down the road.",
    formTitle: "Request a conditioning appointment",
    formDescription:
      "Simply enter in the vehicle information below along with your contact information and one of our BMW Service Professionals will contact you shortly to schedule the appointment.",
  },
  rejuvenation: {
    title: "Full Rejuvenation",
    heroTitle: "REJUVENATION",
    tagline: "PRESERVING THE PASSION | EMBRACING THE EXPERIENCE",
    description:
      "Experience the ultimate in BMW M series preservation with EAG's bespoke rejuvenation service, combining restoration expertise with unparalleled marque knowledge.",
    heroImage:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop",
    layout: "horizontal",
    sectionImages: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2070&auto=format&fit=crop",
    ],
    sections: [
      {
        title: "Complete Assessment",
        content:
          "Every rejuvenation begins with a comprehensive evaluation of your vehicle's mechanical, cosmetic, and structural condition. We document everything and develop a detailed restoration plan tailored to your car's needs and your goals. Our specialists inspect each system, photograph the current state, and create a prioritized roadmap for the work ahead. This thorough assessment ensures no detail is overlooked and provides you with complete transparency throughout the process.",
      },
      {
        title: "Engine & Drivetrain",
        content:
          "Our specialists restore engines and drivetrains to factory specifications or beyond, replacing worn components with genuine BMW parts and addressing any hidden issues. From complete rebuilds to targeted reconditioning, we ensure optimal performance and reliability. We replace timing components, refresh seals and gaskets, address oil consumption issues, and restore proper compression. Every engine receives proper break-in procedures and comprehensive dyno testing to verify performance meets or exceeds factory specifications.",
      },
      {
        title: "Suspension & Chassis",
        content:
          "Complete suspension restoration including bushings, bearings, dampers, subframe reinforcement, and precision alignment to restore the exact handling characteristics your BMW was designed to deliver. We source OE parts or fabricate custom components when originals are unavailable. Every suspension component is inspected, measured, and replaced as needed. The result is a chassis that drives like new, with the precise feedback and control that makes BMW special.",
      },
      {
        title: "Interior & Finishing",
        content:
          "From leather reconditioning and seat restoration to electronics refurbishment and trim refinishing, we restore interiors to factory-new condition while preserving the authentic character of your BMW. We use correct materials, proper dye techniques, and period-appropriate methods to ensure lasting quality. Climate control systems are rebuilt, audio systems are restored or tastefully upgraded, and every switch and button functions as it should. The final result is an interior that looks, feels, and smells like the day it left Munich.",
      },
    ],
    extendedDescription: `EAG's Rejuvenation service goes far beyond traditional restoration. We breathe new life into your classic BMW M car, preserving its heritage while ensuring it performs and looks better than the day it left the factory. Our approach combines painstaking attention to detail with deep expertise in BMW M series history, engineering, and parts.

Our comprehensive rejuvenation process includes:
• Thorough assessment and documentation of your vehicle's current condition
• Development of a bespoke rejuvenation plan tailored to your car's needs and your goals
• Sourcing of genuine BMW parts or fabrication of custom components when originals are unavailable
• Meticulous disassembly and cataloging of components
• Engine rebuilding or reconditioning to factory specifications or beyond
• Suspension and drivetrain overhaul for optimal performance
• Electrical system modernization while maintaining original appearance
• Interior restoration using correct materials and techniques
• Paint and bodywork perfection, including correction of previous poor repairs
• Extensive testing and tuning to ensure everything functions flawlessly

Our goal is not just to make your BMW look new, but to preserve its character and enhance its driving experience for years to come.`,
    conclusion:
      "A full EAG rejuvenation transforms your BMW into a better-than-new example, ready to be enjoyed and appreciated for generations to come.",
    formTitle: "Rejuvenation Service Request",
    formDescription:
      "Your rejuvenation journey begins here! Enter your vehicle as well as contact information and one of our team members will reach out to discuss the next steps.",
  },
  mechanical: {
    title: "Mechanical Services",
    heroTitle: "MECHANICAL",
    tagline: "Expert BMW Mechanical Care",
    description:
      "Expert mechanical services for BMW vehicles. From routine maintenance to complex repairs, our technicians deliver precise, reliable work using genuine parts and factory procedures.",
    heroImage:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop",
    sections: [
      {
        title: "Routine Maintenance",
        content:
          "Oil changes, brake service, fluid flushes, and scheduled maintenance performed to BMW specifications using genuine parts. We follow factory service intervals to keep your BMW running at its best.",
      },
      {
        title: "Diagnostics & Repair",
        content:
          "Our BMW-trained technicians use factory diagnostic equipment to accurately identify and resolve mechanical and electrical issues. From check engine lights to complex drivetrain problems, we have the expertise to fix it right.",
      },
      {
        title: "Performance Upgrades",
        content:
          "Carefully selected performance modifications that enhance your driving experience while maintaining reliability and drivability. We only recommend proven upgrades that complement the BMW driving character.",
      },
      {
        title: "Pre-Purchase Inspections",
        content:
          "Comprehensive inspections for buyers seeking confidence in their next BMW purchase. We provide detailed reports on condition, needed repairs, and estimated costs so you can make an informed decision.",
      },
    ],
    conclusion:
      "Trust your BMW to the specialists who understand these vehicles inside and out. Our mechanical services keep your enthusiast vehicle performing at its best.",
    formTitle: "Request a mechanical service appointment",
    formDescription:
      "Enter your vehicle information and describe the work needed. One of our BMW Service Professionals will contact you to schedule your appointment.",
  },
  cosmetic: {
    title: "Cosmetic Repairs",
    heroTitle: "COSMETIC",
    tagline: "Professional BMW Cosmetic Restoration",
    description:
      "Professional repair of damage, dings, chips, and scratches using genuine BMW parts and factory-level painting techniques. We restore your BMW's appearance to better-than-new condition.",
    heroImage:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2070&auto=format&fit=crop",
    sections: [
      {
        title: "Collision Repair",
        content:
          "From minor fender benders to significant damage, our body shop restores your BMW to pre-accident condition using genuine parts and OE repair procedures. We work with all major insurance companies.",
      },
      {
        title: "Paint Matching",
        content:
          "Our paint technicians achieve factory-level color matching using BMW's color formulas and proper techniques. We replicate the factory orange peel texture to ensure seamless, invisible repairs.",
      },
      {
        title: "Dent & Ding Removal",
        content:
          "Paintless dent repair and traditional bodywork options to address door dings, parking lot damage, and minor dents. We assess each situation to recommend the best approach for your vehicle.",
      },
      {
        title: "Stone Chip Repair",
        content:
          "Professional repair of stone chips and scratches before they lead to rust or further paint damage. Early intervention saves both the appearance and the value of your BMW.",
      },
    ],
    conclusion:
      "Your BMW deserves repair work that matches its quality. Our cosmetic services restore both appearance and value, using only genuine parts and proven techniques.",
    formTitle: "Request a cosmetic repair appointment",
    formDescription:
      "Describe the cosmetic work needed and upload photos if available. Our team will review your request and contact you with next steps.",
  },
};

function getService(slug: string): Service | undefined {
  return services[slug];
}

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getService(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: `${service.title} | Services | Enthusiast Auto`,
    description: service.description,
    openGraph: {
      type: "website",
      title: `${service.title} | Enthusiast Auto`,
      description: service.description,
      siteName: "Enthusiast Auto",
    },
  };
}

export default async function ServiceDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const service = getService(slug);

  if (!service) {
    return notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <PageHero
        size="medium"
        eyebrow="ENTHUSIAST AUTO GROUP"
        title={service.heroTitle}
        subtitle={service.description}
        backgroundImage={service.heroImage}
        ctas={[
          {
            label: "Schedule Now",
            href: "#request-form",
            variant: "primary",
          },
        ]}
      >
        {/* Tagline below title */}
        <p className="mb-10 text-xl font-medium tracking-wide text-[#2E90FA] sm:text-2xl">
          {service.tagline}
        </p>
      </PageHero>

      {/* Service Overview Section */}
      <Section className={slug === "rejuvenation" ? "bg-bg-primary py-12 sm:py-16 lg:py-20" : "bg-white py-12 sm:py-16 lg:py-20"}>
        <TitleBlock
          title={service.tagline ?? service.title}
          description={service.description}
          className="mb-10 sm:mb-12"
          variant={slug === "rejuvenation" ? "dark" : "light"}
        />

        {/* Feature Grid */}
        <ServiceFeatureGrid
          sections={service.sections}
          layout={service.layout}
          images={service.sectionImages}
          variant={slug === "rejuvenation" ? "dark" : "default"}
        />
      </Section>

      {/* Extended Description Section (for rejuvenation) */}
      {"extendedDescription" in service && service.extendedDescription && (
        <Section className="bg-bg-primary py-12 sm:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: Image */}
            <div className="relative aspect-4/3 overflow-hidden rounded-xl">
              <img
                src={service.sectionImages?.[1] || service.heroImage}
                alt="Rejuvenation Service"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Right: Content */}
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 font-headline text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                EAG'S REJUVENATION SERVICE GOES FAR BEYOND TRADITIONAL RESTORATION.
              </h2>
              
              <div className="space-y-4 text-white/80">
                {service.extendedDescription.split("\n\n").map((paragraph, idx) => {
                  if (paragraph.startsWith("•")) {
                    // Render bullet points
                    const bullets = paragraph.split("\n").filter(line => line.trim().startsWith("•"));
                    return (
                      <ul key={idx} className="space-y-2">
                        {bullets.map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="flex gap-3">
                            <span className="text-[#2E90FA]">•</span>
                            <span>{bullet.replace("•", "").trim()}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Conclusion */}
              {service.conclusion && (
                <p className="mt-8 text-lg font-medium text-white">
                  {service.conclusion}
                </p>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* Service Request Form with Contact Sidebar */}
      <Section
        id="request-form"
        className="border-t border-neutral-200 bg-neutral-50 py-12 sm:py-16 lg:py-20"
      >
        <TitleBlock
          title={service.formTitle || `${service.title}`}
          description={
            service.formDescription ||
            "Fill out the form below and we'll get back to you within 1 business day to discuss your needs."
          }
          className="mb-10 sm:mb-12"
        />
        
        <p className="mb-8 text-center text-sm text-neutral-500">
          Fields marked with (*) are required.
        </p>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Form - takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Suspense
              fallback={
                <div className="h-[600px] animate-pulse rounded-lg bg-neutral-200" />
              }
            >
              <ServiceSelectionProvider>
                <ServiceRequestForm />
              </ServiceSelectionProvider>
            </Suspense>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <ServiceContactInfo variant="card" />
            </div>
          </div>
        </div>
      </Section>

      {/* Related Blog Posts */}
      <Suspense fallback={null}>
        <RelatedBlogPosts limit={3} />
      </Suspense>
    </>
  );
}
