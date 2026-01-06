import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { PageHero } from "@/components/shared/PageHero";
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
	Target,
	Shield,
	Users,
	Wrench,
	Search,
	Star,
	Heart,
	ArrowRight,
} from "lucide-react";
import Link from "next/link";
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
		icon: <Target className="h-6 w-6" />,
		title: "Authenticity",
		description:
			"Every vehicle we offer is genuine, documented, and true to its heritage.",
		accent: "from-blue-500/20 to-blue-600/5",
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-500",
	},
	{
		icon: <Shield className="h-6 w-6" />,
		title: "Excellence",
		description:
			"We never compromise on quality—in our vehicles or our service.",
		accent: "from-emerald-500/20 to-emerald-600/5",
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-500",
	},
	{
		icon: <Users className="h-6 w-6" />,
		title: "Community",
		description:
			"We're building connections between enthusiasts who share our passion.",
		accent: "from-purple-500/20 to-purple-600/5",
		iconBg: "bg-purple-500/10",
		iconColor: "text-purple-500",
	},
];

const differentiators = [
	{
		icon: <Search className="h-6 w-6" />,
		title: "Curated Inventory",
		description:
			"Every vehicle we offer has been carefully inspected and vetted. We only sell the best examples we can find.",
		accent: "from-blue-500/5 to-transparent",
		iconBg: "bg-blue-500/10",
		iconColor: "text-blue-500",
	},
	{
		icon: <Wrench className="h-6 w-6" />,
		title: "Full Rejuvenation",
		description:
			"Before listing, every vehicle undergoes our comprehensive rejuvenation process to meet our exacting standards.",
		accent: "from-emerald-500/5 to-transparent",
		iconBg: "bg-emerald-500/10",
		iconColor: "text-emerald-500",
	},
	{
		icon: <Star className="h-6 w-6" />,
		title: "Expert Knowledge",
		description:
			"Our team knows these vehicles inside and out. We're here to share our expertise and help you make informed decisions.",
		accent: "from-amber-500/5 to-transparent",
		iconBg: "bg-amber-500/10",
		iconColor: "text-amber-500",
	},
	{
		icon: <Heart className="h-6 w-6" />,
		title: "Community Focus",
		description:
			"We're more than a dealership—we're a hub for the enthusiast community with events, content, and connections.",
		accent: "from-purple-500/5 to-transparent",
		iconBg: "bg-purple-500/10",
		iconColor: "text-purple-500",
	},
];

const socialLinks = [
	{
		name: "Instagram",
		href: "https://instagram.com/enthusiastauto",
	},
	{
		name: "YouTube",
		href: "https://youtube.com/@enthusiastauto",
	},
	{
		name: "Facebook",
		href: "https://facebook.com/enthusiastauto",
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
			>
				{/* Quick info badges */}
				<div className="flex flex-wrap gap-6 text-body-small font-medium text-white/80">
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4 text-blue-400" />
						<span>Cincinnati, OH</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4 text-blue-400" />
						<span>Since 2015</span>
					</div>
					<div className="flex items-center gap-2">
						<Star className="h-4 w-4 text-blue-400" />
						<span>M-Series Specialists</span>
					</div>
				</div>
			</PageHero>

			{/* Our Story Section */}
			<Section className="py-12 sm:py-16 lg:py-20">
				<div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
					{/* Story Content */}
					<div>
						<h2 className="mb-6 text-title-2 font-bold text-foreground">
							Our Story
						</h2>
						<div className="space-y-4 text-body-large text-muted-foreground">
							<p>
								Enthusiast Auto Group was founded by passionate BMW enthusiasts
								who saw a need for a different kind of dealership—one that
								truly understands what these vehicles mean to their owners.
							</p>
							<p>
								What started as a small operation in a modest garage has grown
								into one of the country's most respected sources for BMW
								M-Series vehicles. We didn't set out to build just another
								dealership—we set out to create a destination for those who
								share our obsession.
							</p>
							<p>
								Our team includes certified technicians, restoration specialists,
								and fellow enthusiasts who have spent decades behind the wheel
								of these incredible machines.
							</p>
						</div>
					</div>

					{/* Timeline */}
					<div className="space-y-6">
						<h3 className="text-lg font-semibold text-foreground">
							Our Journey
						</h3>
						{milestones.map((milestone) => (
							<Card key={milestone.year} className="relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
								<CardHeader className="relative pb-2">
									<span className="text-body-small font-bold text-primary">
										{milestone.year}
									</span>
									<CardTitle className="text-lg">{milestone.title}</CardTitle>
								</CardHeader>
								<CardContent className="relative">
									<p className="text-body-base text-muted-foreground">
										{milestone.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</Section>

			{/* Mission Section */}
			<Section className="py-12 sm:py-16 lg:py-20">
				<div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-card p-8 md:p-12">
					<div className="mx-auto max-w-3xl text-center">
						<h2 className="mb-6 text-title-2 font-bold text-foreground">
							Our Mission
						</h2>
						<blockquote className="text-title-3 font-medium leading-relaxed text-foreground">
							"To preserve and celebrate BMW's M heritage by providing
							exceptional vehicles, expert services, and a community for
							enthusiasts who share our passion for the ultimate driving
							machines."
						</blockquote>
						<p className="mt-6 text-body-base text-muted-foreground">
							— The Enthusiast Auto Group Team
						</p>
					</div>
				</div>

				{/* Values Grid */}
				<div className="mt-12 grid gap-6 sm:grid-cols-3">
					{values.map((value) => (
						<Card
							key={value.title}
							className="group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
						>
							<div
								className={`absolute inset-0 bg-gradient-to-br ${value.accent} opacity-0 transition-opacity group-hover:opacity-100`}
							/>
							<CardHeader className="relative">
								<div
									className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg ${value.iconBg}`}
								>
									<span className={value.iconColor}>{value.icon}</span>
								</div>
								<CardTitle>{value.title}</CardTitle>
							</CardHeader>
							<CardContent className="relative">
								<p className="text-body-base text-muted-foreground">
									{value.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</Section>

			{/* What Sets Us Apart */}
			<Section className="py-12 sm:py-16 lg:py-20">
				<div className="mb-10 text-center">
					<h2 className="mb-3 text-title-2 font-bold text-foreground">
						What Sets Us Apart
					</h2>
					<p className="mx-auto max-w-2xl text-body-large text-muted-foreground">
						We're not just another dealership. Here's what makes Enthusiast Auto
						Group different.
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{differentiators.map((item) => (
						<Card
							key={item.title}
							className="group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
						>
							<div
								className={`absolute inset-0 bg-gradient-to-br ${item.accent}`}
							/>
							<CardHeader className="relative">
								<div
									className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg ${item.iconBg} transition-colors group-hover:bg-primary group-hover:text-primary-foreground`}
								>
									<span
										className={`${item.iconColor} transition-colors group-hover:text-primary-foreground`}
									>
										{item.icon}
									</span>
								</div>
								<CardTitle className="text-lg">{item.title}</CardTitle>
							</CardHeader>
							<CardContent className="relative">
								<p className="text-sm text-muted-foreground">
									{item.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</Section>

			{/* Visit Us / Contact Section */}
			<Section className="py-12 sm:py-16 lg:py-20">
				<div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
					{/* Map / Location Card */}
					<div className="lg:col-span-3">
						<Card className="h-full">
							<CardHeader>
								<CardTitle className="text-title-2">Visit Us</CardTitle>
								<CardDescription>
									Come see our collection in person. We're located in
									Cincinnati, Ohio and we'd love to meet you.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="overflow-hidden rounded-xl border border-border">
									<iframe
										src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3089.8!2d-84.4547!3d39.2562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDE1JzIyLjMiTiA4NMKwMjcnMTYuOSJX!5e0!3m2!1sen!2sus!4v1234567890"
										width="100%"
										height="300"
										style={{ border: 0 }}
										allowFullScreen
										loading="lazy"
										referrerPolicy="no-referrer-when-downgrade"
										title="Enthusiast Auto Group Location"
										className="grayscale transition-all hover:grayscale-0"
									/>
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
											className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
										>
											Get Directions
											<ArrowRight className="h-3 w-3" />
										</a>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Contact Info Sidebar */}
					<div className="space-y-6 lg:col-span-2">
						{/* Hours */}
						<Card>
							<CardHeader>
								<div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
									<Clock className="h-5 w-5 text-primary" />
								</div>
								<CardTitle>Business Hours</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2 text-body-base">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Monday – Friday
										</span>
										<span className="font-medium text-foreground">
											8am – 5pm
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Saturday – Sunday
										</span>
										<span className="font-medium text-foreground">
											By Appointment
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Contact */}
						<Card>
							<CardHeader>
								<div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
									<Phone className="h-5 w-5 text-primary" />
								</div>
								<CardTitle>Contact</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<a
									href="tel:513-554-1269"
									className="flex items-center gap-2 text-body-large font-semibold text-primary hover:underline"
								>
									513-554-1269
								</a>
								<a
									href="mailto:info@enthusiastauto.com"
									className="flex items-center gap-2 text-body-base text-primary hover:underline"
								>
									info@enthusiastauto.com
								</a>
							</CardContent>
						</Card>

						{/* Social */}
						<Card>
							<CardHeader>
								<CardTitle>Follow Us</CardTitle>
								<CardDescription>
									Stay connected with the community
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-3">
									{socialLinks.map((social) => (
										<a
											key={social.name}
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
										>
											{social.name}
										</a>
									))}
								</div>
							</CardContent>
						</Card>

						{/* CTA */}
						<Link
							href="/contact"
							className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Send us a message
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</Section>

			<Footer />
		</>
	);
}
