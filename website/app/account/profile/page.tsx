import {
  AddressManager,
  ChangePassword,
  ConnectedAccounts,
  DeleteAccount,
  ProfileCard,
  ProfileForm,
} from "@/components/account";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your profile information and account settings",
};

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/account/profile");
  }

  // Fetch user data with related accounts
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // Check if user has password authentication
  const hasPassword = !!(await prisma.account.findFirst({
    where: {
      userId: user.id,
      type: "credentials",
    },
  }));

  // Get authentication methods
  const authMethods = user.accounts.map((account) => {
    switch (account.provider) {
      case "google":
        return "Google";
      case "github":
        return "GitHub";
      default:
        return account.provider;
    }
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-title-2 font-bold text-foreground">
          Profile Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your personal information, security, and preferences
        </p>
      </div>

      {/* User Overview Card */}
      <ProfileCard
        user={{
          name: user.name,
          email: user.email,
          image: user.image,
        }}
        hasPassword={hasPassword}
        authMethods={authMethods}
        isOAuthAvatar={!!user.image && !hasPassword}
      />

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
      <ConnectedAccounts accounts={user.accounts} hasPassword={hasPassword} />

      {/* Delete Account - Danger Zone */}
      <DeleteAccount />
    </div>
  );
}
