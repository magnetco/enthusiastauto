import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { TextHero } from "@/components/shared/TextHero";
import type { Metadata } from "next";
import Image from "next/image";

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

export default function AboutPage() {
	return (
		<>
			<Section>
				<TextHero
					title="About Enthusiast Auto Group"
					subtitle="Cincinnati's premier destination for BMW M-Series vehicles"
				/>

				<div className="mx-auto max-w-4xl space-y-12">
					{/* Hero Image */}
					<div className="relative aspect-[21/9] overflow-hidden rounded-lg">
						<Image
							src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop"
							alt="Enthusiast Auto Group showroom"
							fill
							className="object-cover"
						/>
					</div>

					{/* Story */}
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-foreground">Our Story</h2>
						<p className="text-body-base text-muted-foreground">
							Enthusiast Auto Group was founded by passionate BMW enthusiasts who
							saw a need for a different kind of dealership—one that truly
							understands what these vehicles mean to their owners.
						</p>
						<p className="text-body-base text-muted-foreground">
							What started as a small operation has grown into one of the
							country's most respected sources for BMW M-Series vehicles. Our
							team includes certified technicians, restoration specialists, and
							fellow enthusiasts who share our customers' passion for these
							incredible machines.
						</p>
					</div>

					{/* Mission */}
					<div className="rounded-lg bg-card p-8">
						<h2 className="mb-4 text-2xl font-bold text-foreground">Our Mission</h2>
						<p className="text-body-large text-muted-foreground">
							To preserve and celebrate BMW's M heritage by providing exceptional
							vehicles, expert services, and a community for enthusiasts who
							share our passion.
						</p>
					</div>

					{/* What Sets Us Apart */}
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-foreground">What Sets Us Apart</h2>
						<div className="grid gap-6 md:grid-cols-2">
							<div className="rounded-lg border bg-card p-6">
								<h3 className="mb-2 text-lg font-semibold text-foreground">
									Curated Inventory
								</h3>
								<p className="text-sm text-muted-foreground">
									Every vehicle we offer has been carefully inspected and vetted.
									We only sell the best examples we can find.
								</p>
							</div>
							<div className="rounded-lg border bg-card p-6">
								<h3 className="mb-2 text-lg font-semibold text-foreground">
									Full Rejuvenation
								</h3>
								<p className="text-sm text-muted-foreground">
									Before listing, every vehicle undergoes our comprehensive
									rejuvenation process to meet our exacting standards.
								</p>
							</div>
							<div className="rounded-lg border bg-card p-6">
								<h3 className="mb-2 text-lg font-semibold text-foreground">
									Expert Knowledge
								</h3>
								<p className="text-sm text-muted-foreground">
									Our team knows these vehicles inside and out. We're here to
									share our expertise and help you make informed decisions.
								</p>
							</div>
							<div className="rounded-lg border bg-card p-6">
								<h3 className="mb-2 text-lg font-semibold text-foreground">
									Community Focus
								</h3>
								<p className="text-sm text-muted-foreground">
									We're more than a dealership—we're a hub for the enthusiast
									community with events, content, and connections.
								</p>
							</div>
						</div>
					</div>

					{/* Location */}
					<div className="space-y-6">
						<h2 className="text-2xl font-bold text-foreground">Visit Us</h2>
						<div className="grid gap-6 md:grid-cols-2">
							<div>
								<h3 className="mb-2 text-lg font-semibold text-foreground">
									Location
								</h3>
								<p className="text-muted-foreground">
									11608 Reading Rd
									<br />
									Cincinnati, OH 45241
								</p>
							</div>
							<div>
								<h3 className="mb-2 text-lg font-semibold text-foreground">
									Hours
								</h3>
								<p className="text-muted-foreground">
									Monday - Friday: 8am - 5pm
									<br />
									Saturday - Sunday: By Appointment
								</p>
							</div>
							<div>
								<h3 className="mb-2 text-lg font-semibold text-foreground">
									Contact
								</h3>
								<p className="text-muted-foreground">
									<a
										href="tel:513-554-1269"
										className="text-primary hover:underline"
									>
										513-554-1269
									</a>
								</p>
							</div>
							<div>
								<h3 className="mb-2 text-lg font-semibold text-foreground">
									Follow Us
								</h3>
								<div className="flex gap-4">
									<a
										href="https://instagram.com/enthusiastauto"
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground hover:text-primary"
									>
										Instagram
									</a>
									<a
										href="https://youtube.com/@enthusiastauto"
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground hover:text-primary"
									>
										YouTube
									</a>
									<a
										href="https://facebook.com/enthusiastauto"
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground hover:text-primary"
									>
										Facebook
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Section>
			<Footer />
		</>
	);
}

