import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Placeholder blog posts - in the future, this will come from Sanity CMS
const blogPosts = {
	"e30-m3-restoration-complete": {
		title: "E30 M3 Restoration Complete",
		excerpt:
			"After months of meticulous work, this Alpine White E30 M3 has been fully rejuvenated to better-than-new condition.",
		category: "Around The Shop",
		date: "2025-12-15",
		image:
			"https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop",
		content: `
## The Beginning

When this 1988 E30 M3 arrived at our shop, it had been sitting for several years. While the bones were solid, the car needed significant work to bring it back to its former glory.

## The Process

Our team spent over 400 hours on this restoration, touching every component of the vehicle:

### Mechanical
- Complete S14 engine refresh with new gaskets, timing chain, and valve adjustment
- Gearbox rebuild with new synchros
- Full suspension refresh with new bushings, dampers, and springs
- Brake system overhaul with new rotors, pads, and lines

### Exterior
- Full respray in original Alpine White
- All trim and seals replaced with NOS parts
- New Hella headlights and taillights
- Fresh BBS wheels with new tires

### Interior
- Leather reconditioning on sport seats
- New carpet and sound deadening
- Period-correct radio restoration
- All gauges rebuilt and calibrated

## The Result

The finished E30 M3 is now better than when it left the factory. Every detail has been attended to, creating a car that will be enjoyed for decades to come.

This project exemplifies what EAG's rejuvenation service can accomplish. If you have an M-Series BMW that deserves this level of care, we'd love to discuss your project.
		`,
	},
	"cars-and-coffee-december-2025": {
		title: "Cars & Coffee December 2025 Recap",
		excerpt:
			"Our monthly Cars & Coffee brought out some incredible machines. Here's a look at the highlights from this month's gathering.",
		category: "Events",
		date: "2025-12-08",
		image:
			"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2070&auto=format&fit=crop",
		content: `
## Another Great Turnout

Despite the chilly December weather, our monthly Cars & Coffee event saw an incredible turnout of enthusiasts and their machines.

## Highlights

This month's event featured several standout vehicles:

- A freshly completed EAG-restored E30 M3 in Alpine White
- Multiple E46 M3s including a rare Laguna Seca Blue example
- An E9X M3 GTS making its first public appearance
- Several classic E28 and E34 M5s

## Community

As always, the best part of these events is the community. Old friends reconnected, new friendships formed, and countless stories were shared over coffee.

## Next Event

Our next Cars & Coffee will be Saturday, January 11th, 2026. We hope to see you there!

Follow us on Instagram for updates and announcements.
		`,
	},
	"ceramic-coating-explained": {
		title: "Ceramic Coating: What You Need to Know",
		excerpt:
			"Everything you need to know about ceramic coating - how it works, why it matters, and how to maintain it.",
		category: "Around The Shop",
		date: "2025-11-28",
		image:
			"https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop",
		content: `
## What is Ceramic Coating?

Ceramic coating is a liquid polymer that bonds with your vehicle's paint to create a durable, protective layer. Unlike traditional waxes that sit on top of the paint, ceramic coatings form a chemical bond that lasts for years.

## Benefits

### Protection
- UV ray protection to prevent oxidation
- Chemical resistance against bird droppings, tree sap, and road salt
- Hydrophobic properties that repel water and contaminants

### Appearance
- Enhanced gloss and depth
- Easier cleaning - dirt and grime slide off
- Maintains that "just detailed" look longer

### Value
- Preserves paint condition and resale value
- Reduces the need for frequent detailing
- Long-term cost savings compared to regular waxing

## Our Process

At EAG, ceramic coating is part of our comprehensive conditioning service:

1. **Decontamination** - Complete removal of contaminants
2. **Paint Correction** - Multi-stage polishing to remove swirls and scratches
3. **Surface Preparation** - IPA wipe to ensure perfect bonding
4. **Coating Application** - Multiple layers of professional-grade ceramic
5. **Curing** - Proper curing time for maximum durability

## Maintenance

To maintain your ceramic coating:
- Wash regularly with pH-neutral soap
- Avoid automatic car washes
- Apply a ceramic boost spray quarterly
- Schedule annual inspections with us

Contact us to learn more about our conditioning services.
		`,
	},
} as const;

type BlogSlug = keyof typeof blogPosts;

export async function generateStaticParams() {
	return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const post = blogPosts[params.slug as BlogSlug];

	if (!post) {
		return { title: "Post Not Found" };
	}

	return {
		title: `${post.title} | Blog | Enthusiast Auto`,
		description: post.excerpt,
		openGraph: {
			type: "article",
			title: post.title,
			description: post.excerpt,
			siteName: "Enthusiast Auto",
			images: [{ url: post.image }],
		},
	};
}

export default async function BlogPostPage(props: {
	params: Promise<{ slug: string }>;
}) {
	const params = await props.params;
	const post = blogPosts[params.slug as BlogSlug];

	if (!post) {
		notFound();
	}

	const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<>
			{/* Hero Image */}
			<div className="relative h-[40vh] min-h-[300px] w-full">
				<Image
					src={post.image}
					alt={post.title}
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
			</div>

			<Section className="-mt-24 relative z-10">
				{/* Back Link */}
				<Link
					href="/blog"
					className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Blog
				</Link>

				{/* Article Header */}
				<article className="mx-auto max-w-3xl">
					<header className="mb-8">
						<div className="mb-4 flex items-center gap-3">
							<Badge variant="secondary">{post.category}</Badge>
							<span className="text-sm text-muted-foreground">
								{formattedDate}
							</span>
						</div>
						<h1 className="mb-4 text-title-1 font-bold text-foreground">
							{post.title}
						</h1>
						<p className="text-body-large text-muted-foreground">
							{post.excerpt}
						</p>
					</header>

					{/* Article Content */}
					<div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
						{post.content.split("\n").map((line, index) => {
							if (line.startsWith("## ")) {
								return (
									<h2 key={index} className="mt-8 mb-4 text-2xl font-bold">
										{line.replace("## ", "")}
									</h2>
								);
							}
							if (line.startsWith("### ")) {
								return (
									<h3 key={index} className="mt-6 mb-3 text-xl font-semibold">
										{line.replace("### ", "")}
									</h3>
								);
							}
							if (line.startsWith("- ")) {
								return (
									<li key={index} className="ml-4">
										{line.replace("- ", "")}
									</li>
								);
							}
							if (line.trim()) {
								return (
									<p key={index} className="mb-4">
										{line}
									</p>
								);
							}
							return null;
						})}
					</div>
				</article>
			</Section>

			<Footer />
		</>
	);
}

