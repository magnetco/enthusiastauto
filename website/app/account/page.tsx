import { Metadata } from "next";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { getVehicleDetail } from "@/lib/sanity/queries/vehicles";
import { getProduct } from "@/lib/shopify";
import { QuickActionCard, RecentFavorites } from "@/components/account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Warehouse,
  User,
  MapPin,
  Heart,
  Car,
  Package,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Enthusiast Auto account dashboard - view your garage, manage your profile, and more.",
};

export default async function AccountDashboardPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/account");
  }

  // Fetch user data with counts
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
      take: 6,
    }),
  ]);

  if (!user) {
    redirect("/auth/signin");
  }

  // Count addresses from JSON field
  const addressCount = Array.isArray(user.addresses) ? user.addresses.length : 0;

  // Get total favorites count
  const totalFavorites = await prisma.userFavorite.count({
    where: { userId: session.user.id },
  });

  // Hydrate recent favorites with full data
  const recentFavorites = await Promise.all(
    favoritesData.slice(0, 4).map(async (favorite) => {
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

  const vehicleCount = favoritesData.filter(
    (f) => f.itemType === "vehicle"
  ).length;
  const productCount = favoritesData.filter(
    (f) => f.itemType === "product"
  ).length;

  const garageLimit = parseInt(process.env.GARAGE_ITEM_LIMIT || "50", 10);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-accent/5 to-transparent p-6">
        <h1 className="text-title-2 font-bold text-foreground">
          Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your garage, profile, and preferences from your account dashboard.
        </p>

        {/* Email Verification Status */}
        {!user.emailVerified && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Email not verified
              </p>
              <p className="text-xs text-yellow-700">
                Verify your email to unlock all features
              </p>
            </div>
            <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300 hover:bg-yellow-100">
              Resend
            </Button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{vehicleCount}</p>
              <p className="text-sm text-muted-foreground">Saved Vehicles</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{productCount}</p>
              <p className="text-sm text-muted-foreground">Saved Parts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{addressCount}</p>
              <p className="text-sm text-muted-foreground">Saved Addresses</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="My Garage"
            description="View and manage your saved vehicles and parts"
            href="/account/garage"
            icon={Warehouse}
            stat={totalFavorites}
            statLabel={`of ${garageLimit} slots used`}
            variant="primary"
          />
          <QuickActionCard
            title="Profile Settings"
            description="Update your personal information and password"
            href="/account/profile"
            icon={User}
          />
          <QuickActionCard
            title="Browse Inventory"
            description="Explore our collection of M-Series BMWs"
            href="/vehicles"
            icon={Car}
          />
        </div>
      </div>

      {/* Recent Favorites */}
      <RecentFavorites items={validFavorites} maxItems={4} />

      {/* Explore Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Explore More</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/parts"
              className="group flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <Package className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              <span className="font-medium text-foreground group-hover:text-primary">
                Shop Parts
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              href="/merchandise"
              className="group flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <Heart className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              <span className="font-medium text-foreground group-hover:text-primary">
                Merchandise
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              href="/services"
              className="group flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <ShieldCheck className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              <span className="font-medium text-foreground group-hover:text-primary">
                Services
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              href="/sell"
              className="group flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <Car className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              <span className="font-medium text-foreground group-hover:text-primary">
                Sell Your BMW
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
