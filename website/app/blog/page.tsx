import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { TextHero } from "@/components/shared/TextHero";
import { BlogGrid } from "@/components/blog/BlogGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blog | Under the Hood | Enthusiast Auto",
	description:
		"Stories from Enthusiast Auto Group. Events, shop updates, project builds, and insights from the world of BMW M-Series enthusiasts.",
	openGraph: {
		type: "website",
		title: "Blog | Enthusiast Auto",
		description:
			"Stories, events, and updates from Enthusiast Auto Group.",
		siteName: "Enthusiast Auto",
	},
};

// Placeholder blog posts - in the future, this will come from Sanity CMS
const blogPosts = [
	{
		slug: "e30-m3-restoration-complete",
		title: "E30 M3 Restoration Complete",
		excerpt:
			"After months of meticulous work, this Alpine White E30 M3 has been fully rejuvenated to better-than-new condition.",
		category: "Around The Shop",
		date: "2025-12-15",
		image:
			"https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop",
		featured: true,
	},
	{
		slug: "cars-and-coffee-december-2025",
		title: "Cars & Coffee December 2025 Recap",
		excerpt:
			"Our monthly Cars & Coffee brought out some incredible machines. Here's a look at the highlights from this month's gathering.",
		category: "Events",
		date: "2025-12-08",
		image:
			"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2070&auto=format&fit=crop",
		featured: true,
	},
	{
		slug: "ceramic-coating-explained",
		title: "Ceramic Coating: What You Need to Know",
		excerpt:
			"Everything you need to know about ceramic coating - how it works, why it matters, and how to maintain it.",
		category: "Around The Shop",
		date: "2025-11-28",
		image:
			"https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop",
		featured: false,
	},
	{
		slug: "e46-m3-buyers-guide",
		title: "E46 M3 Buyer's Guide",
		excerpt:
			"What to look for when purchasing an E46 M3. Common issues, what to avoid, and how to find the right one.",
		category: "Videos",
		date: "2025-11-20",
		image:
			"https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2070&auto=format&fit=crop",
		featured: false,
	},
	{
		slug: "fall-driving-tour-2025",
		title: "Fall Driving Tour 2025",
		excerpt:
			"Highlights from our annual fall driving tour through the scenic roads of southern Ohio and Kentucky.",
		category: "Events",
		date: "2025-10-15",
		image:
			"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop",
		featured: false,
	},
	{
		slug: "s54-engine-rebuild",
		title: "S54 Engine Rebuild: Behind the Scenes",
		excerpt:
			"A detailed look at our process for rebuilding BMW's legendary S54 inline-six engine.",
		category: "Around The Shop",
		date: "2025-10-01",
		image:
			"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop",
		featured: false,
	},
];

export default function BlogPage() {
	const featuredPosts = blogPosts.filter((post) => post.featured);
	const allPosts = blogPosts;

	return (
		<>
			<Section>
				<TextHero
					title="Under the Hood"
					subtitle="Stories, events, and updates from Enthusiast Auto Group"
				/>

				{/* Featured Stories */}
				{featuredPosts.length > 0 && (
					<div className="mb-16">
						<h2 className="mb-6 text-xl font-bold text-foreground">
							Featured Stories
						</h2>
						<BlogGrid posts={featuredPosts} featured />
					</div>
				)}

				{/* All Stories */}
				<div>
					<h2 className="mb-6 text-xl font-bold text-foreground">All Stories</h2>
					<BlogGrid posts={allPosts} />
				</div>
			</Section>
			<Footer />
		</>
	);
}

