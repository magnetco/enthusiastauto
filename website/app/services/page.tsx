import { ServiceHero } from "@/components/services/ServiceHero";
import { ServicesContent } from "@/components/services/ServicesContent";
import type { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
	title: "Request BMW Service | Enthusiast Auto",
	description:
		"From cosmetic repairs to complete restoration, we deliver factory-exceeding BMW care. Paint correction, ceramic coating, bodywork, and full M Series rejuvenation services.",
	openGraph: {
		type: "website",
		title: "Request BMW Service | Enthusiast Auto",
		description:
			"Professional BMW services: cosmetic repairs, conditioning, and full restoration.",
		siteName: "Enthusiast Auto",
	},
};

/**
 * Services page - Multi-step service request wizard
 * Full-width stage-by-stage experience for requesting BMW services
 */
export default function ServicesPage() {
	return (
		<>
			{/* Hero Section */}
			<ServiceHero />

			{/* Services Wizard - Full Width */}
			<ServicesContent />

			{/* Contact Information */}
			<section className="light-section border-t border-[#DFE5EA] py-12">
				<div className="mx-auto max-w-4xl px-4 text-center">
					<h3 className="mb-4 text-xl font-semibold text-[#282a30]">
						Have Questions?
					</h3>
					<p className="mb-4 text-[#6f6e77]">
						Our BMW Service Professionals are here to help
					</p>
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
						<a
							href="tel:513-554-1269"
							className="text-xl font-bold text-[#005A90] hover:underline"
						>
							513-554-1269
						</a>
						<span className="hidden text-[#CCCCCC] sm:inline">•</span>
						<p className="text-sm text-[#6f6e77]">Monday-Friday, 8am - 5pm</p>
					</div>
					<p className="mt-2 text-sm text-[#6f6e77]">
						11608 Reading Rd, Cincinnati, OH 45241
					</p>
				</div>
			</section>
		</>
	);
}
