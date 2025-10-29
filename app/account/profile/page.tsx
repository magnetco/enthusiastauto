import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { ProfileForm } from "@/components/account/ProfileForm";
import { ChangePassword } from "@/components/account/ChangePassword";
import { AddressManager } from "@/components/account/AddressManager";
import { ConnectedAccounts } from "@/components/account/ConnectedAccounts";
import { DeleteAccount } from "@/components/account/DeleteAccount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * User Profile Page
 * Protected route - requires authentication (handled by middleware)
 * Displays user profile information, settings, and account management
 */

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your profile and account settings",
};

// Helper to get initials for avatar fallback
function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export default async function ProfilePage() {
  // Get authenticated user session
  const session = await getServerSession();

  // Redirect if not authenticated (extra protection beyond middleware)
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Fetch complete user data from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      accounts: {
        select: {
          id: true,
          provider: true,
          providerAccountId: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const hasPassword = !!user.password;
  const hasOAuthOnly = user.accounts.length > 0 && !hasPassword;
  const authMethods = [];
  if (hasPassword) authMethods.push("Email/Password");
  if (user.accounts.some((a) => a.provider === "google"))
    authMethods.push("Google");
  if (user.accounts.some((a) => a.provider === "facebook"))
    authMethods.push("Facebook");

  // Avatar priority: custom image > OAuth image
  // If user has set a custom image (doesn't start with https://lh3.googleusercontent.com etc), use it
  // Otherwise, use session image (which may be from OAuth)
  const isOAuthAvatar = user.image?.includes("googleusercontent.com") ||
                        user.image?.includes("facebook.com") ||
                        user.image?.includes("fbcdn.net");
  const displayImage = user.image;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <a href="/account" className="hover:text-foreground">
              Dashboard
            </a>
          </li>
          <li>&gt;</li>
          <li className="text-foreground font-medium">Profile</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div>
        <h1 className="text-title-2 font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile information and account settings
        </p>
      </div>

      {/* User Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold overflow-hidden">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={user.name || "User"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-title-3 font-semibold">
                {user.name || "Name not set"}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-2">
                {authMethods.map((method) => (
                  <Badge key={method} variant="secondary">
                    {method}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {isOAuthAvatar && (
                <p className="text-xs text-muted-foreground mt-1">
                  Using {user.accounts.find(a => user.image?.includes(a.provider))?.provider || 'OAuth'} avatar (you can upload a custom one below)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <ProfileForm
        user={{
          name: user.name,
          email: user.email,
          image: user.image,
        }}
      />

      {/* Change Password */}
      <ChangePassword hasPassword={hasPassword} />

      {/* Address Manager */}
      <AddressManager />

      {/* Connected Accounts */}
      <ConnectedAccounts
        accounts={user.accounts}
        hasPassword={hasPassword}
      />

      {/* Delete Account - Danger Zone */}
      <DeleteAccount />
    </div>
  );
}
