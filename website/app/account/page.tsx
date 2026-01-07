import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { getVehicleDetail } from "@/lib/sanity/queries/vehicles";
import { getProduct } from "@/lib/shopify";
import { RecentFavorites } from "@/components/account";
import {
  Warehouse,
  User,
  Car,
  ArrowRight,
  ShieldCheck,
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

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Account Dashboard
        </p>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
      </div>

      {/* Email Verification Notice */}
      {!user.emailVerified && (
        <div className="flex items-start gap-3 border-l-2 border-amber-500 bg-amber-50/50 py-3 pl-4 pr-4">
          <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-900">
              Email not verified
            </p>
            <p className="text-sm text-amber-700 mt-0.5">
              Verify your email to unlock all features.
            </p>
          </div>
          <button className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors">
            Resend
          </button>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid gap-px bg-border rounded-lg overflow-hidden sm:grid-cols-3">
        <Link
          href="/account/garage"
          className="group flex items-center justify-between bg-background p-5 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <Warehouse className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">My Garage</p>
              <p className="text-sm text-muted-foreground">
                {totalFavorites} of {garageLimit} items
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
        </Link>

        <Link
          href="/account/profile"
          className="group flex items-center justify-between bg-background p-5 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Profile</p>
              <p className="text-sm text-muted-foreground">
                Manage your account
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
        </Link>

        <Link
          href="/vehicles"
          className="group flex items-center justify-between bg-background p-5 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <Car className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Inventory</p>
              <p className="text-sm text-muted-foreground">
                Browse vehicles
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
        </Link>
      </div>

      {/* Recent Favorites */}
      <RecentFavorites items={validFavorites} maxItems={4} />
    </div>
  );
}
