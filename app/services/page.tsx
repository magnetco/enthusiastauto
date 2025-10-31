import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { ServiceCards } from "@/components/services/ServiceCards";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceRequestForm } from "@/components/services/ServiceRequestForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
	title: "Expert BMW Services | Enthusiast Auto",
	description:
		"From cosmetic repairs to complete restoration, we deliver factory-exceeding BMW care. Paint correction, ceramic coating, bodywork, and full M Series rejuvenation services.",
	openGraph: {
		type: "website",
		title: "Expert BMW Services | Enthusiast Auto",
		description:
			"Professional BMW services: cosmetic repairs, conditioning, and full restoration.",
		siteName: "Enthusiast Auto",
	},
};

/**
 * Services page - Unified service request flow
 * Consolidates cosmetic, conditioning, and rejuvenation services
 */
export default function ServicesPage() {
	return (
		<>
			{/* Hero Section */}
			<ServiceHero />

			{/* Services Overview */}
			<Section className="py-8 sm:py-12 lg:py-16">
				<div className="mb-12 text-center">
					<h2 className="mb-4 text-title-2 font-bold text-foreground">
						Our Services
					</h2>
					<p className="mx-auto max-w-2xl text-body-large text-muted-foreground">
						Choose the service that best fits your BMW's needs. Not sure? Our
						team will help determine the right approach.
					</p>
				</div>
				<ServiceCards />
			</Section>

			{/* Service Request Form */}
			<Section id="request-form" className="py-8 sm:py-12 lg:py-16">
				<div className="mb-8 text-center">
					<h2 className="mb-4 text-title-2 font-bold text-foreground">
						Request a Service
					</h2>
					<p className="mx-auto max-w-2xl text-body-large text-muted-foreground">
						Tell us about your BMW and what you'd like us to help with. We'll
						contact you to discuss your needs and schedule an assessment.
					</p>
				</div>
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

			{/* Contact Information */}
			<Section className="py-8 sm:py-12 lg:py-16">
				<div className="rounded-lg border bg-card p-8 text-center">
					<h3 className="mb-4 text-title-3 font-semibold">Have Questions?</h3>
					<p className="mb-4 text-body-base text-muted-foreground">
						Our BMW Service Professionals are here to help
					</p>
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
						<a
							href="tel:513-554-1269"
							className="text-body-large font-semibold text-primary hover:underline"
						>
							513-554-1269
						</a>
						<span className="hidden text-muted-foreground sm:inline">•</span>
						<p className="text-sm text-muted-foreground">
							Monday-Friday, 8am - 5pm
						</p>
					</div>
					<p className="mt-2 text-sm text-muted-foreground">
						11608 Reading Rd, Cincinnati, OH 45241
					</p>
				</div>
			</Section>

			{/* Footer */}
			<Footer />
		</>
	);
}
