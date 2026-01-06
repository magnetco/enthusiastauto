import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	MapPin,
	Phone,
	Clock,
	Mail,
	Car,
	Wrench,
	Package,
	MessageSquare,
	ArrowRight,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us | Enthusiast Auto",
	description:
		"Get in touch with Enthusiast Auto Group. Whether you're interested in buying a vehicle, scheduling service, ordering parts, or have general questions – we're here to help.",
	openGraph: {
		type: "website",
		title: "Contact Us | Enthusiast Auto",
		description:
			"Reach our sales, service, and parts teams. Located in Cincinnati, OH.",
		siteName: "Enthusiast Auto",
	},
};

interface QuickContactCard {
	title: string;
	description: string;
	icon: React.ReactNode;
	href: string;
	linkText: string;
	accent: string;
}

const quickContactCards: QuickContactCard[] = [
	{
		title: "Vehicle Sales",
		description:
			"Interested in a vehicle? Our sales team can answer questions about availability, pricing, and help you find the perfect BMW.",
		icon: <Car className="h-6 w-6" />,
		href: "/vehicles",
		linkText: "Browse Inventory",
		accent: "from-blue-500/20 to-blue-600/5",
	},
	{
		title: "Service & Repair",
		description:
			"From cosmetic touch-ups to complete restoration, our BMW specialists deliver factory-exceeding results.",
		icon: <Wrench className="h-6 w-6" />,
		href: "/services",
		linkText: "View Services",
		accent: "from-emerald-500/20 to-emerald-600/5",
	},
	{
		title: "Parts & Accessories",
		description:
			"Shop genuine BMW parts, performance upgrades, and accessories. Free fitment verification for your vehicle.",
		icon: <Package className="h-6 w-6" />,
		href: "/parts",
		linkText: "Shop Parts",
		accent: "from-amber-500/20 to-amber-600/5",
	},
	{
		title: "Sell Your BMW",
		description:
			"Looking to sell, consign, or auction your BMW? We offer competitive valuations and hassle-free transactions.",
		icon: <MessageSquare className="h-6 w-6" />,
		href: "/sell",
		linkText: "Learn More",
		accent: "from-purple-500/20 to-purple-600/5",
	},
];

export default function ContactPage() {
	return (
		<>
			{/* Hero Section */}
			<PageHero
				size="medium"
				eyebrow="Contact Us"
				title={
					<>
						We're Here to Help
						<br />
						<span className="text-blue-400">Let's Connect</span>
					</>
				}
				subtitle="Whether you're shopping for your next BMW, need expert service, or have questions about parts – our team is ready to assist."
				backgroundImage="https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=2070&auto=format&fit=crop"
			>
				{/* Quick contact info badges */}
				<div className="flex flex-wrap gap-6 text-body-small font-medium text-white/80">
					<a
						href="tel:513-554-1269"
						className="flex items-center gap-2 transition-colors hover:text-white"
					>
						<Phone className="h-4 w-4 text-blue-400" />
						<span>513-554-1269</span>
					</a>
					<a
						href="mailto:info@enthusiastauto.com"
						className="flex items-center gap-2 transition-colors hover:text-white"
					>
						<Mail className="h-4 w-4 text-blue-400" />
						<span>info@enthusiastauto.com</span>
					</a>
					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4 text-blue-400" />
						<span>Mon–Fri: 8am – 5pm</span>
					</div>
				</div>
			</PageHero>

			{/* Quick Contact Cards - What Are You Looking For? */}
			<Section className="py-12 sm:py-16 lg:py-20">
				<div className="mb-10 text-center">
					<h2 className="mb-3 text-title-2 font-bold text-foreground">
						How Can We Help You Today?
					</h2>
					<p className="mx-auto max-w-2xl text-body-large text-muted-foreground">
						Select the area you need assistance with, or scroll down to send us
						a message.
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{quickContactCards.map((card) => (
						<Link
							key={card.title}
							href={card.href}
							className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
						>
							<div
								className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 transition-opacity group-hover:opacity-100`}
							/>
							<div className="relative p-6">
								<div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
									{card.icon}
								</div>
								<h3 className="mb-2 text-lg font-semibold text-foreground">
									{card.title}
								</h3>
								<p className="mb-4 text-sm text-muted-foreground">
									{card.description}
								</p>
								<span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
									{card.linkText}
									<ArrowRight className="h-4 w-4" />
								</span>
							</div>
						</Link>
					))}
				</div>
			</Section>

			{/* Main Contact Section - Form + Info */}
			<Section className="py-12 sm:py-16 lg:py-20" id="contact-form">
				<div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
					{/* Contact Form - Takes more space */}
					<div className="lg:col-span-3">
						<ContactForm />
					</div>

					{/* Contact Information Sidebar */}
					<div className="space-y-6 lg:col-span-2">
						{/* Contact Details Card */}
						<Card>
							<CardHeader>
								<CardTitle>Contact Information</CardTitle>
								<CardDescription>
									Reach out directly through any of these channels
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-5">
								<div className="flex items-start gap-4">
									<div className="rounded-lg bg-primary/10 p-3">
										<Phone className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h4 className="font-semibold text-foreground">Phone</h4>
										<a
											href="tel:513-554-1269"
											className="text-body-base text-primary hover:underline"
										>
											513-554-1269
										</a>
										<p className="mt-1 text-sm text-muted-foreground">
											Call us during business hours
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="rounded-lg bg-primary/10 p-3">
										<Mail className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h4 className="font-semibold text-foreground">Email</h4>
										<a
											href="mailto:info@enthusiastauto.com"
											className="text-body-base text-primary hover:underline"
										>
											info@enthusiastauto.com
										</a>
										<p className="mt-1 text-sm text-muted-foreground">
											We respond within 1 business day
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="rounded-lg bg-primary/10 p-3">
										<MapPin className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h4 className="font-semibold text-foreground">Location</h4>
										<p className="text-body-base text-foreground">
											11608 Reading Rd
											<br />
											Cincinnati, OH 45241
										</p>
										<a
											href="https://maps.google.com/?q=11608+Reading+Rd+Cincinnati+OH+45241"
											target="_blank"
											rel="noopener noreferrer"
											className="mt-1 inline-block text-sm text-primary hover:underline"
										>
											Get Directions →
										</a>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="rounded-lg bg-primary/10 p-3">
										<Clock className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h4 className="font-semibold text-foreground">
											Business Hours
										</h4>
										<div className="mt-1 space-y-1 text-body-base">
											<div className="flex justify-between gap-4">
												<span className="text-muted-foreground">
													Monday – Friday
												</span>
												<span className="font-medium text-foreground">
													8am – 5pm
												</span>
											</div>
											<div className="flex justify-between gap-4">
												<span className="text-muted-foreground">
													Saturday – Sunday
												</span>
												<span className="font-medium text-foreground">
													By Appointment
												</span>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Map */}
						<div className="overflow-hidden rounded-xl border border-border">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3089.8!2d-84.4547!3d39.2562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDE1JzIyLjMiTiA4NMKwMjcnMTYuOSJX!5e0!3m2!1sen!2sus!4v1234567890"
								width="100%"
								height="250"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Enthusiast Auto Group Location"
								className="grayscale transition-all hover:grayscale-0"
							/>
						</div>
					</div>
				</div>
			</Section>

			{/* Department-Specific Contact Section */}
			<Section className="py-12 sm:py-16 lg:py-20">
				<div className="mb-10 text-center">
					<h2 className="mb-3 text-title-2 font-bold text-foreground">
						Contact Our Teams Directly
					</h2>
					<p className="mx-auto max-w-2xl text-body-large text-muted-foreground">
						Reach the right team for faster assistance
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					{/* Sales Team */}
					<Card className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
						<CardHeader className="relative">
							<div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
								<Car className="h-6 w-6 text-blue-500" />
							</div>
							<CardTitle>Sales Team</CardTitle>
							<CardDescription>
								Vehicle inquiries, pricing & availability
							</CardDescription>
						</CardHeader>
						<CardContent className="relative space-y-3">
							<a
								href="tel:513-554-1269"
								className="flex items-center gap-2 text-body-base text-primary hover:underline"
							>
								<Phone className="h-4 w-4" />
								513-554-1269
							</a>
							<a
								href="mailto:sales@enthusiastauto.com"
								className="flex items-center gap-2 text-body-base text-primary hover:underline"
							>
								<Mail className="h-4 w-4" />
								sales@enthusiastauto.com
							</a>
						</CardContent>
					</Card>

					{/* Service Team */}
					<Card className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
						<CardHeader className="relative">
							<div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
								<Wrench className="h-6 w-6 text-emerald-500" />
							</div>
							<CardTitle>Service Team</CardTitle>
							<CardDescription>
								Repairs, maintenance & restoration
							</CardDescription>
						</CardHeader>
						<CardContent className="relative space-y-3">
							<a
								href="tel:513-554-1269"
								className="flex items-center gap-2 text-body-base text-primary hover:underline"
							>
								<Phone className="h-4 w-4" />
								513-554-1269
							</a>
							<a
								href="mailto:service@enthusiastauto.com"
								className="flex items-center gap-2 text-body-base text-primary hover:underline"
							>
								<Mail className="h-4 w-4" />
								service@enthusiastauto.com
							</a>
						</CardContent>
					</Card>

					{/* Parts Team */}
					<Card className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
						<CardHeader className="relative">
							<div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
								<Package className="h-6 w-6 text-amber-500" />
							</div>
							<CardTitle>Parts Team</CardTitle>
							<CardDescription>
								Parts orders, fitment & accessories
							</CardDescription>
						</CardHeader>
						<CardContent className="relative space-y-3">
							<a
								href="tel:513-554-1269"
								className="flex items-center gap-2 text-body-base text-primary hover:underline"
							>
								<Phone className="h-4 w-4" />
								513-554-1269
							</a>
							<a
								href="mailto:parts@enthusiastauto.com"
								className="flex items-center gap-2 text-body-base text-primary hover:underline"
							>
								<Mail className="h-4 w-4" />
								parts@enthusiastauto.com
							</a>
						</CardContent>
					</Card>
				</div>
			</Section>

			{/* FAQ / Quick Answers CTA */}
			<Section className="py-12 sm:py-16">
				<div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-card p-8 text-center md:p-12">
					<h2 className="mb-4 text-title-2 font-bold text-foreground">
						Need a Quick Answer?
					</h2>
					<p className="mx-auto mb-6 max-w-xl text-body-large text-muted-foreground">
						Check out our most commonly asked questions, or give us a call for
						immediate assistance.
					</p>
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<a
							href="tel:513-554-1269"
							className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
						>
							<Phone className="h-5 w-5" />
							Call Now: 513-554-1269
						</a>
						<Link
							href="/about"
							className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
						>
							Learn About Us
							<ArrowRight className="h-5 w-5" />
						</Link>
					</div>
				</div>
			</Section>

			<Footer />
		</>
	);
}
