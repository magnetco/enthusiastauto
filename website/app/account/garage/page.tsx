import { getServerSession } from "@/lib/auth/session";
import { SectionHeading } from "@/components/shared/SectionHeading";
import prisma from "@/lib/db/prisma";
import { getVehicleDetail } from "@/lib/sanity/queries/vehicles";
import { getProduct } from "@/lib/shopify";
import { redirect } from "next/navigation";
import { GarageContent } from "./GarageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Garage",
  description: "View and manage your saved vehicles and parts",
};

export default async function GaragePage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/account/garage");
  }

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

  const items = await Promise.all(
    favorites.map(async (favorite) => {
      try {
        if (favorite.itemType === "vehicle") {
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
          if (!favorite.itemHandle) return null;
          const product = await getProduct(favorite.itemHandle);
          if (!product) return null;

          return {
            id: favorite.itemId,
            type: "product" as const,
            title: product.title,
            price:
              parseFloat(product.priceRange.minVariantPrice.amount) || undefined,
            image: product.featuredImage?.url,
            specs: product.productType ? [product.productType] : [],
            href: `/product/${product.handle}`,
            createdAt: favorite.createdAt,
          };
        }
      } catch (error) {
        console.error(`Failed to fetch ${favorite.itemType}:`, error);
        return null;
      }
    })
  );

  const validItems = items.filter((item) => item !== null);
  const garageLimit = parseInt(process.env.GARAGE_ITEM_LIMIT || "50", 10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading title="Saved Items" />
        <p className="text-body-base text-muted-foreground">
          {favorites.length} of {garageLimit} items saved
        </p>
      </div>

      {/* Garage Content */}
      <GarageContent
        items={validItems}
        totalCount={favorites.length}
        garageLimit={garageLimit}
      />
    </div>
  );
}
