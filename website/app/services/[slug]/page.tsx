import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { ServiceRequestForm } from "@/components/services/ServiceRequestForm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Service data - in the future, this will come from Sanity CMS
const services = {
	conditioning: {
		title: "Conditioning & Protection",
		heroTitle: "CONDITIONING",
		description:
			"Conditioning your vehicle is a level above getting a quick detail. It's a whole process that individually inspects each vehicle and through the best products as well latest procedures ensures a final product of the highest quality.",
		heroImage:
			"https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop",
		sections: [
			{
				title: "Evaluation",
				content:
					"With decades of experience seeing vehicles of all conditions we're able to predict and provide a roadmap to completing your goals.",
			},
			{
				title: "Paint Correction",
				content:
					"Our paint correction service is a meticulous multi-step process designed to restore your BMW's finish to better-than-new condition.",
			},
			{
				title: "Ceramic Coating",
				content:
					"Our ceramic coating service provides unparalleled protection for your BMW's paint, wheels, and other surfaces. This cutting-edge technology forms a permanent bond with your vehicle's clear coat, creating an extremely durable layer of protection.",
			},
			{
				title: "Additional Protection",
				content:
					"In order to seal in the level of condition your vehicle now holds we also offer several other options to protect and preserve.",
			},
		],
		conclusion:
			"Few things more satisfying than a vehicle that's completed our conditioning process. Not only is this the best your BMW has ever looked, it's also protected to ensure it continues to impress years down the road.",
	},
	rejuvenation: {
		title: "Full Rejuvenation",
		heroTitle: "REJUVENATION",
		description:
			"Complete restoration combining expert craftsmanship with specialized BMW M knowledge. Preserve heritage while exceeding original condition.",
		heroImage:
			"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop",
		sections: [
			{
				title: "Complete Assessment",
				content:
					"Every rejuvenation begins with a comprehensive evaluation of your vehicle's mechanical, cosmetic, and structural condition to develop a detailed restoration plan.",
			},
			{
				title: "Engine & Drivetrain",
				content:
					"Our specialists restore engines and drivetrains to factory specifications, replacing worn components with genuine BMW parts and addressing any hidden issues.",
			},
			{
				title: "Suspension Overhaul",
				content:
					"Complete suspension restoration including bushings, bearings, dampers, and alignment to restore the precise handling your BMW was designed to deliver.",
			},
			{
				title: "Interior Restoration",
				content:
					"From leather reconditioning to electronics refurbishment, we restore interiors to factory-new condition while preserving the authentic character of your BMW.",
			},
		],
		conclusion:
			"A full EAG rejuvenation transforms your BMW into a better-than-new example, ready to be enjoyed and appreciated for generations to come.",
	},
	mechanical: {
		title: "Mechanical Services",
		heroTitle: "MECHANICAL",
		description:
			"Expert mechanical services for BMW vehicles. From routine maintenance to complex repairs, our technicians deliver precise, reliable work.",
		heroImage:
			"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop",
		sections: [
			{
				title: "Routine Maintenance",
				content:
					"Oil changes, brake service, fluid flushes, and scheduled maintenance performed to BMW specifications using genuine parts.",
			},
			{
				title: "Diagnostics & Repair",
				content:
					"Our BMW-trained technicians use factory diagnostic equipment to accurately identify and resolve mechanical and electrical issues.",
			},
			{
				title: "Performance Upgrades",
				content:
					"Carefully selected performance modifications that enhance your driving experience while maintaining reliability and drivability.",
			},
			{
				title: "Pre-Purchase Inspections",
				content:
					"Comprehensive inspections for buyers seeking confidence in their next BMW purchase. We provide detailed reports on condition and needed repairs.",
			},
		],
		conclusion:
			"Trust your BMW to the specialists who understand these vehicles inside and out. Our mechanical services keep your enthusiast vehicle performing at its best.",
	},
	cosmetic: {
		title: "Cosmetic Repairs",
		heroTitle: "COSMETIC",
		description:
			"Professional repair of damage, dings, chips, and scratches using genuine BMW parts and factory-level painting techniques.",
		heroImage:
			"https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2070&auto=format&fit=crop",
		sections: [
			{
				title: "Collision Repair",
				content:
					"From minor fender benders to significant damage, our body shop restores your BMW to pre-accident condition using genuine parts and OE repair procedures.",
			},
			{
				title: "Paint Matching",
				content:
					"Our paint technicians achieve factory-level color matching using BMW's color formulas and proper techniques to ensure seamless repairs.",
			},
			{
				title: "Dent & Ding Removal",
				content:
					"Paintless dent repair and traditional bodywork options to address door dings, parking lot damage, and minor dents.",
			},
			{
				title: "Stone Chip Repair",
				content:
					"Professional repair of stone chips and scratches before they lead to rust or further paint damage.",
			},
		],
		conclusion:
			"Your BMW deserves repair work that matches its quality. Our cosmetic services restore both appearance and value, using only genuine parts and proven techniques.",
	},
} as const;

type ServiceSlug = keyof typeof services;

export async function generateStaticParams() {
	return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const service = services[params.slug as ServiceSlug];

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
	const params = await props.params;
	const service = services[params.slug as ServiceSlug];

	if (!service) {
		notFound();
	}

	return (
		<>
			{/* Hero Section */}
			<section className="relative w-full overflow-hidden bg-[#141721]">
				<div className="absolute inset-0 z-0">
					<div
						className="h-full w-full bg-cover bg-center bg-no-repeat opacity-30"
						style={{ backgroundImage: `url('${service.heroImage}')` }}
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-[#141721]/70 via-[#141721]/80 to-[#141721]" />
				</div>

				<Section as="div" dark className="relative z-10 py-20 sm:py-24 lg:py-28">
					<h1 className="heading-uppercase mb-4 text-title-1 font-bold text-blue-400 sm:text-hero">
						{service.heroTitle}
					</h1>
					<p className="mb-8 max-w-[40rem] text-body-large text-white/90 sm:text-body-xl">
						{service.description}
					</p>
					<a
						href="#request-form"
						className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black ring-offset-background transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					>
						Schedule Now
					</a>
				</Section>
			</section>

			{/* Content Sections */}
			<Section className="py-12 sm:py-16 lg:py-20">
				<div className="mx-auto max-w-3xl space-y-12">
					{service.sections.map((section, index) => (
						<div key={index}>
							<h2 className="mb-4 text-xl font-bold text-foreground">
								{section.title}
							</h2>
							<p className="text-body-base text-muted-foreground">
								{section.content}
							</p>
						</div>
					))}

					{service.conclusion && (
						<p className="border-t pt-8 text-body-base text-foreground">
							{service.conclusion}
						</p>
					)}
				</div>
			</Section>

			{/* Service Request Form */}
			<Section id="request-form" className="py-8 sm:py-12 lg:py-16">
				<div className="mb-8 text-center">
					<h2 className="mb-4 text-title-2 font-bold text-foreground">
						Schedule Your {service.title}
					</h2>
					<p className="mx-auto max-w-2xl text-body-large text-muted-foreground">
						Fill out the form below and we'll get back to you within 1 business
						day to discuss your needs.
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

			<Footer />
		</>
	);
}

