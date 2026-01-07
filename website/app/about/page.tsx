import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { TitleBlock } from "@/components/shared/TitleBlock";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	ArrowRightIcon,
	MapPinIcon,
	PhoneIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About | Enthusiast Auto Group",
	description:
		"Learn about Enthusiast Auto Group - Cincinnati's premier destination for BMW M-Series vehicles, services, and community.",
	openGraph: {
		type: "website",
		title: "About | Enthusiast Auto Group",
		description:
			"Cincinnati's premier destination for BMW M-Series enthusiasts.",
		siteName: "Enthusiast Auto",
	},
};

const milestones = [
	{
		year: "2015",
		title: "The Beginning",
		description:
			"Started sourcing rare M-Series vehicles from across the country",
	},
	{
		year: "2018",
		title: "Cincinnati Home",
		description: "Opened our current facility on Reading Road",
	},
	{
		year: "2023",
		title: "Full Service",
		description:
			"Expanded to include complete restoration and preservation services",
	},
];

const values = [
	{
		number: "01",
		title: "Authenticity",
		description:
			"Every vehicle we offer is genuine, documented, and true to its heritage. No stories, no surprises.",
	},
	{
		number: "02",
		title: "Excellence",
		description:
			"We never compromise on quality—in our vehicles, our service, or our craftsmanship.",
	},
	{
		number: "03",
		title: "Community",
		description:
			"We're building connections between enthusiasts who share our passion for the marque.",
	},
];

const differentiators = [
	{
		number: "01",
		title: "Curated Inventory",
		description:
			"Every vehicle is carefully inspected and vetted. We only sell the best examples.",
	},
	{
		number: "02",
		title: "Full Rejuvenation",
		description:
			"Before listing, every vehicle undergoes our comprehensive rejuvenation process.",
	},
	{
		number: "03",
		title: "Expert Knowledge",
		description:
			"Decades of M-Series experience. We're here to share expertise, not just sell cars.",
	},
	{
		number: "04",
		title: "Community Focus",
		description:
			"Events, content, and connections that extend beyond the transaction.",
	},
];

export default function AboutPage() {
	return (
		<>
			{/* Hero */}
			<PageHero
				size="medium"
				eyebrow="Enthusiast Auto Group"
				title={
					<>
						Built by Enthusiasts
						<br />
						<span className="text-blue-400">For Enthusiasts</span>
					</>
				}
				subtitle="Cincinnati's premier destination for BMW M-Series vehicles, expert service, and a passionate community."
				backgroundImage="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop"
				ctas={[
					{ label: "View Inventory", href: "/vehicles", variant: "primary" },
					{ label: "Our Services", href: "/services", variant: "outline" },
				]}
			/>

			{/* Our Story */}
			<section
				className="relative bg-white py-16 sm:py-20 lg:py-24"
				aria-labelledby="story-heading"
			>
				<div className="mx-auto max-w-[var(--container-max)] px-page-x">
					<div className="mb-12 lg:mb-16">
						<TitleBlock
							title="Our Story"
							description="Founded by passionate BMW enthusiasts who saw a need for a different kind of dealership—one that truly understands what these vehicles mean to their owners."
							id="story-heading"
							action={
								<Link
									href="/contact"
									className={cn(
										buttonVariants({ variant: "outline", size: "lg" }),
										"gap-2 border-neutral-300 text-neutral-900 hover:bg-neutral-100"
									)}
								>
									Get in Touch
									<ArrowRightIcon className="h-4 w-4" />
								</Link>
							}
						/>
					</div>

					<div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
						{/* Story Content */}
						<div className="space-y-6">
							<p className="text-body-large leading-relaxed text-neutral-700">
								What started as a small operation in a modest garage has grown
								into one of the country's most respected sources for BMW
								M-Series vehicles. We didn't set out to build just another
								dealership—we set out to create a destination for those who
								share our obsession.
							</p>
							<p className="text-body-base leading-relaxed text-neutral-600">
								Our team includes certified technicians, restoration specialists,
								and fellow enthusiasts who have spent decades behind the wheel
								of these incredible machines. Every vehicle that passes through
								our doors receives the same care and attention we would give our
								own collection.
							</p>
						</div>

						{/* Timeline Cards */}
						<div className="space-y-4">
							{milestones.map((milestone) => (
								<div
									key={milestone.year}
									className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg"
								>
									{/* Background Year */}
									<span className="absolute -right-2 -top-4 font-mono text-[5rem] font-bold leading-none text-neutral-200 transition-colors duration-300 group-hover:text-neutral-300">
										{milestone.year.slice(-2)}
									</span>

									<div className="relative z-10">
										<span className="font-mono text-body-small font-bold text-primary">
											{milestone.year}
										</span>
										<h3 className="mt-1 text-title-3 font-semibold text-neutral-900">
											{milestone.title}
										</h3>
										<p className="mt-2 text-body-base text-neutral-600">
											{milestone.description}
										</p>
									</div>

									{/* Hover accent */}
									<div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#E32526] via-[#0066B1] to-[#6EB5E0] transition-all duration-300 group-hover:w-full" />
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Mission & Values */}
			<section
				className="relative bg-neutral-900 py-16 sm:py-20 lg:py-24"
				aria-labelledby="mission-heading"
			>
				<div className="mx-auto max-w-[var(--container-max)] px-page-x">
					<div className="mb-12 lg:mb-16">
						<TitleBlock
							title="Our Mission"
							id="mission-heading"
							className="[&_h2]:text-white [&_p]:text-neutral-400 [&_svg_polygon]:fill-white/30"
						/>
					</div>

					{/* Mission Statement */}
					<div className="mb-16 max-w-4xl">
						<blockquote className="border-l-4 border-primary pl-8">
							<p className="text-title-2 font-medium leading-relaxed text-white sm:text-title-1">
								"To preserve and celebrate BMW's M heritage by providing
								exceptional vehicles, expert services, and a community for
								enthusiasts who share our passion."
							</p>
							<footer className="mt-6 text-body-base font-medium text-neutral-500">
								— The Enthusiast Auto Group Team
							</footer>
						</blockquote>
					</div>

					{/* Values Grid */}
					<div className="grid gap-6 sm:grid-cols-3 lg:gap-8">
						{values.map((value) => (
							<div
								key={value.number}
								className="group relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-800/50 p-6 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-800 sm:p-8"
							>
								{/* Large Number */}
								<span className="absolute -right-2 -top-6 font-mono text-[6rem] font-bold leading-none text-neutral-800 transition-colors duration-300 group-hover:text-neutral-700">
									{value.number}
								</span>

								<div className="relative z-10">
									<div className="mb-4 flex items-center gap-3">
										<span className="font-mono text-body-large font-bold text-primary">
											{value.number}
										</span>
										<div className="h-px flex-1 bg-neutral-700" />
									</div>

									<h3 className="mb-3 text-title-3 font-semibold text-white">
										{value.title}
									</h3>

									<p className="text-body-base text-neutral-400">
										{value.description}
									</p>
								</div>

								{/* Hover accent */}
								<div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#E32526] via-[#0066B1] to-[#6EB5E0] transition-all duration-300 group-hover:w-full" />
							</div>
						))}
					</div>
				</div>
			</section>

			{/* What Sets Us Apart */}
			<section
				className="relative bg-white py-16 sm:py-20 lg:py-24"
				aria-labelledby="differentiators-heading"
			>
				<div className="mx-auto max-w-[var(--container-max)] px-page-x">
					<div className="mb-12 lg:mb-16">
						<TitleBlock
							title="What Sets Us Apart"
							description="We're not just another dealership. Here's what makes Enthusiast Auto Group different."
							id="differentiators-heading"
							action={
								<Link
									href="/vehicles"
									className={cn(
										buttonVariants({ variant: "outline", size: "lg" }),
										"gap-2 border-neutral-300 text-neutral-900 hover:bg-neutral-100"
									)}
								>
									Browse Inventory
									<ArrowRightIcon className="h-4 w-4" />
								</Link>
							}
						/>
					</div>

					{/* Differentiators Grid */}
					<div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
						{differentiators.map((item) => (
							<div
								key={item.number}
								className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg sm:p-8"
							>
								{/* Large Background Number */}
								<span className="absolute -right-4 -top-8 font-mono text-[8rem] font-bold leading-none text-neutral-200 transition-colors duration-300 group-hover:text-neutral-300 sm:text-[10rem]">
									{item.number}
								</span>

								<div className="relative z-10">
									<div className="mb-4 flex items-center gap-3">
										<span className="font-mono text-body-large font-bold text-primary">
											{item.number}
										</span>
										<div className="h-px flex-1 bg-neutral-200" />
									</div>

									<h3 className="mb-3 text-title-3 font-semibold text-neutral-900">
										{item.title}
									</h3>

									<p className="text-body-base text-neutral-600">
										{item.description}
									</p>
								</div>

								{/* Hover accent */}
								<div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#E32526] via-[#0066B1] to-[#6EB5E0] transition-all duration-300 group-hover:w-full" />
							</div>
						))}
					</div>

					{/* Mobile CTA */}
					<div className="mt-10 flex justify-center sm:hidden">
						<Link
							href="/vehicles"
							className={cn(
								buttonVariants({ variant: "outline", size: "lg" }),
								"w-full gap-2 border-neutral-300 text-neutral-900 hover:bg-neutral-100"
							)}
						>
							Browse Inventory
							<ArrowRightIcon className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</section>

			{/* Visit Us */}
			<section
				className="relative bg-neutral-50 py-16 sm:py-20 lg:py-24"
				aria-labelledby="visit-heading"
			>
				<div className="mx-auto max-w-[var(--container-max)] px-page-x">
					<div className="mb-12 lg:mb-16">
						<TitleBlock
							title="Visit Us"
							description="Come see our collection in person. We're located in Cincinnati, Ohio and we'd love to meet you."
							id="visit-heading"
							action={
								<Link
									href="/contact"
									className={cn(
										buttonVariants({ variant: "outline", size: "lg" }),
										"gap-2 border-neutral-300 text-neutral-900 hover:bg-neutral-100"
									)}
								>
									Contact Us
									<ArrowRightIcon className="h-4 w-4" />
								</Link>
							}
						/>
					</div>

					<div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
						{/* Location Card */}
						<div className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg sm:p-8">
							<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<MapPinIcon className="h-6 w-6 text-primary" />
							</div>
							<h3 className="mb-2 text-title-3 font-semibold text-neutral-900">
								Location
							</h3>
							<p className="mb-4 text-body-base text-neutral-600">
								11608 Reading Rd
								<br />
								Cincinnati, OH 45241
							</p>
							<a
								href="https://maps.google.com/?q=11608+Reading+Rd+Cincinnati+OH+45241"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1 text-body-base font-medium text-primary hover:underline"
							>
								Get Directions
								<ArrowRightIcon className="h-4 w-4" />
							</a>
						</div>

						{/* Hours Card */}
						<div className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg sm:p-8">
							<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<ClockIcon className="h-6 w-6 text-primary" />
							</div>
							<h3 className="mb-2 text-title-3 font-semibold text-neutral-900">
								Hours
							</h3>
							<div className="space-y-2 text-body-base">
								<div className="flex justify-between">
									<span className="text-neutral-600">Monday – Friday</span>
									<span className="font-medium text-neutral-900">8am – 5pm</span>
								</div>
								<div className="flex justify-between">
									<span className="text-neutral-600">Saturday – Sunday</span>
									<span className="font-medium text-neutral-500">
										By Appointment
									</span>
								</div>
							</div>
						</div>

						{/* Contact Card */}
						<div className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg sm:p-8">
							<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<PhoneIcon className="h-6 w-6 text-primary" />
							</div>
							<h3 className="mb-2 text-title-3 font-semibold text-neutral-900">
								Contact
							</h3>
							<a
								href="tel:513-554-1269"
								className="mb-2 block text-title-3 font-semibold text-primary hover:underline"
							>
								513-554-1269
							</a>
							<a
								href="mailto:info@enthusiastauto.com"
								className="text-body-base text-neutral-600 hover:text-primary hover:underline"
							>
								info@enthusiastauto.com
							</a>
						</div>
					</div>

					{/* CTA Banner */}
					<div className="mt-12 rounded-lg bg-neutral-900 p-8 sm:p-12">
						<div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
							<div>
								<h3 className="text-title-2 font-semibold text-white">
									Ready to find your next BMW?
								</h3>
								<p className="mt-2 text-body-large text-neutral-400">
									Browse our curated collection or reach out to discuss your
									needs.
								</p>
							</div>
							<div className="flex flex-col gap-3 sm:flex-row">
								<Link
									href="/vehicles"
									className={cn(
										buttonVariants({ variant: "default", size: "lg" }),
										"gap-2"
									)}
								>
									View Inventory
									<ArrowRightIcon className="h-4 w-4" />
								</Link>
								<Link
									href="/contact"
									className={cn(
										buttonVariants({ variant: "outline", size: "lg" }),
										"gap-2 border-neutral-700 text-white hover:bg-neutral-800 hover:border-neutral-600"
									)}
								>
									Send Message
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
