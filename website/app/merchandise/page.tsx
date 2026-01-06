import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { TextHero } from "@/components/shared/TextHero";
import { SearchProductsClient } from "components/SearchProductsClient";
import { defaultSort, sorting } from "lib/constants";
import { getCollectionProducts } from "lib/shopify";
import type { Product } from "lib/shopify/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Merchandise | Enthusiast Auto",
	description:
		"Shop official Enthusiast Auto Group merchandise. Premium apparel, accessories, and collectibles for BMW enthusiasts.",
	openGraph: {
		type: "website",
		title: "Merchandise | Enthusiast Auto",
		description:
			"Premium apparel, accessories, and collectibles for BMW enthusiasts.",
		siteName: "Enthusiast Auto",
	},
};

export default async function MerchandisePage(props: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const searchParams = await props.searchParams;
	const { sort, q: searchValue } = searchParams as { [key: string]: string };
	const { sortKey, reverse } =
		sorting.find((item) => item.slug === sort) || defaultSort;

	// Fetch merchandise from the "merchandise" or "apparel" collection
	// Fallback to an empty array if collection doesn't exist yet
	let products: Product[] = [];
	try {
		products = await getCollectionProducts({
			collection: "merchandise",
			sortKey,
			reverse,
		});
	} catch {
		// Collection might not exist yet, show empty state
		console.log("Merchandise collection not found");
	}

	const resultsText = products.length > 1 ? "items" : "item";

	return (
		<>
			<Section>
				{/* Header */}
				<TextHero
					title="Merchandise"
					subtitle="Official Enthusiast Auto Group apparel and accessories"
				/>

				{/* Search Results Info */}
				{searchValue ? (
					<p className="mb-4 text-sm text-gray-600">
						{products.length === 0
							? "There are no items that match "
							: `Showing ${products.length} ${resultsText} for `}
						<span className="font-bold">&quot;{searchValue}&quot;</span>
					</p>
				) : null}

				{/* Product Grid */}
				{products.length > 0 ? (
					<SearchProductsClient products={products} />
				) : (
					<div className="py-16 text-center">
						<p className="text-lg text-muted-foreground">
							Merchandise coming soon! Check back later for official EAG apparel and accessories.
						</p>
					</div>
				)}
			</Section>
			<Footer />
		</>
	);
}

