import Section from "@/components/layout/section";
import { TextHero } from "@/components/shared/TextHero";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { getVehicleDetail } from "@/lib/sanity/queries/vehicles";
import { getProduct } from "@/lib/shopify";
import { redirect } from "next/navigation";
import { GarageContent } from "./GarageContent";

export const metadata = {
	title: "My Garage - Enthusiast Auto",
	description: "View and manage your saved vehicles and parts",
};

export default async function GaragePage() {
	const session = await getServerSession();

	if (!session?.user?.id) {
		redirect("/auth/signin?callbackUrl=/account/garage");
	}

	// Fetch user's favorites
	const favorites = await prisma.userFavorite.findMany({
		where: { userId: session.user.id },
		select: {
			id: true,
			itemId: true,
			itemType: true,
			itemHandle: true,
			createdAt: true,
		},
		orderBy: { createdAt: "desc" },
	});

	// Hydrate full item data
	const items = await Promise.all(
		favorites.map(async (favorite) => {
			try {
				if (favorite.itemType === "vehicle") {
					// Fetch vehicle from Sanity using itemHandle (slug) if available, otherwise itemId
					const vehicleSlug = favorite.itemHandle || favorite.itemId;
					const vehicle = await getVehicleDetail(vehicleSlug);
					if (!vehicle) return null;

					return {
						id: favorite.itemId,
						type: "vehicle" as const,
						title: vehicle.listingTitle,
						price: vehicle.showCallForPrice
							? "Call for Price"
							: vehicle.listingPrice,
						image:
							vehicle.status === "sold"
								? vehicle.soldShot?.asset?.url
								: vehicle.signatureShot?.asset?.url,
						specs: [
							`${vehicle.mileage.toLocaleString()} mi`,
							vehicle.chassis,
							vehicle.exteriorColor,
						],
						href: `/vehicles/${vehicle.slug.current}`,
						createdAt: favorite.createdAt,
					};
				} else {
					// Fetch product from Shopify using itemHandle
					if (!favorite.itemHandle) {
						console.warn(
							`Product favorite ${favorite.itemId} missing itemHandle`
						);
						return null;
					}

					const product = await getProduct(favorite.itemHandle);
					if (!product) return null;

					return {
						id: favorite.itemId,
						type: "product" as const,
						title: product.title,
						price:
							parseFloat(product.priceRange.minVariantPrice.amount) ||
							undefined,
						image: product.featuredImage?.url,
						specs: product.productType ? [product.productType] : [],
						href: `/product/${product.handle}`,
						createdAt: favorite.createdAt,
					};
				}
			} catch (error) {
				console.error(
					`Failed to fetch ${favorite.itemType} ${favorite.itemId}:`,
					error
				);
				return null;
			}
		})
	);

	// Filter out null items (failed fetches)
	const validItems = items.filter((item) => item !== null);

	const garageLimit = parseInt(process.env.GARAGE_ITEM_LIMIT || "50", 10);

	const baseUrl =
		process.env.NEXT_PUBLIC_SITE_URL || "https://shop.enthusiastauto.com";

	return (
		<Section>
			<TextHero
				title="My Garage"
				subtitle={`${favorites.length} / ${garageLimit} items saved`}
				breadcrumbs={{
					customItems: [{ label: "Account", href: "/account/profile" }],
					includeSchema: true,
				}}
			/>

			<GarageContent
				items={validItems}
				totalCount={favorites.length}
				garageLimit={garageLimit}
			/>
		</Section>
	);
}
