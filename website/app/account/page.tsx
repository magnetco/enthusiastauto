import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { getVehicleDetail } from "@/lib/sanity/queries/vehicles";
import { getProduct } from "@/lib/shopify";
import { RecentFavorites } from "@/components/account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Warehouse,
  User,
  Car,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Enthusiast Auto account dashboard",
};

export default async function AccountDashboardPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/account");
  }

  const [user, favoritesData] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        emailVerified: true,
        addresses: true,
      },
    }),
    prisma.userFavorite.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        itemId: true,
        itemType: true,
        itemHandle: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  if (!user) {
    redirect("/auth/signin");
  }

  const totalFavorites = await prisma.userFavorite.count({
    where: { userId: session.user.id },
  });

  // Hydrate recent favorites
  const recentFavorites = await Promise.all(
    favoritesData.map(async (favorite) => {
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
            href: `/vehicles/${vehicle.slug.current}`,
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
            href: `/product/${product.handle}`,
          };
        }
      } catch (error) {
        console.error(`Failed to fetch ${favorite.itemType}:`, error);
        return null;
      }
    })
  );

  const validFavorites = recentFavorites.filter((item) => item !== null);
  const garageLimit = parseInt(process.env.GARAGE_ITEM_LIMIT || "50", 10);
  const addressCount = Array.isArray(user.addresses) ? user.addresses.length : 0;

  return (
    <div className="space-y-10">
      {/* Email Verification Notice */}
      {!user.emailVerified && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="flex items-start gap-4 py-4">
            <div className="rounded-lg bg-amber-100 p-2">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-base font-medium text-amber-900">
                Email not verified
              </p>
              <p className="text-body-small text-amber-700 mt-0.5">
                Verify your email to unlock all features.
              </p>
            </div>
            <button className="text-body-small font-medium text-amber-700 hover:text-amber-900 transition-colors">
              Resend
            </button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Link
          href="/account/garage"
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
        >
          <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Warehouse className="h-6 w-6" />
          </div>
          <h3 className="text-body-large font-semibold text-foreground mb-1">
            My Garage
          </h3>
          <p className="text-body-small text-muted-foreground mb-4">
            Saved vehicles and parts
          </p>
          <div className="flex items-center justify-between">
            <span className="text-title-2 font-bold text-foreground">
              {totalFavorites}
            </span>
            <span className="inline-flex items-center gap-1 text-body-small font-medium text-primary opacity-0 transition-all group-hover:opacity-100">
              View all
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
          <p className="text-body-mini text-muted-foreground mt-1">
            of {garageLimit} items
          </p>
        </Link>

        <Link
          href="/account/profile"
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
        >
          <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <User className="h-6 w-6" />
          </div>
          <h3 className="text-body-large font-semibold text-foreground mb-1">
            Profile
          </h3>
          <p className="text-body-small text-muted-foreground mb-4">
            Personal information
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-body-base font-medium text-foreground">
                {addressCount} {addressCount === 1 ? "address" : "addresses"}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-body-small font-medium text-primary opacity-0 transition-all group-hover:opacity-100">
              Edit
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        <Link
          href="/vehicles"
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
        >
          <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Car className="h-6 w-6" />
          </div>
          <h3 className="text-body-large font-semibold text-foreground mb-1">
            Inventory
          </h3>
          <p className="text-body-small text-muted-foreground mb-4">
            Browse our vehicles
          </p>
          <span className="inline-flex items-center gap-1 text-body-small font-medium text-primary transition-all group-hover:gap-2">
            View Inventory
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      {/* Recent Favorites Section */}
      <div>
        <div className="mb-6 flex items-center gap-3">
          <span className="text-brand-red font-semibold">///</span>
          <h2 className="text-title-3 font-semibold text-foreground">
            Recent Favorites
          </h2>
        </div>
        <RecentFavorites items={validFavorites} maxItems={4} />
      </div>
    </div>
  );
}
