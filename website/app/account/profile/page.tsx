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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const hasPassword = !!(await prisma.account.findFirst({
    where: {
      userId: user.id,
      type: "credentials",
    },
  }));

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
    <div className="space-y-12">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Account Settings
        </p>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Profile
        </h1>
      </div>

      {/* Account Overview */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-brand-red font-medium">///</span>
          <h2 className="text-lg font-semibold text-foreground">
            Account Overview
          </h2>
        </div>
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
      </section>

      {/* Profile Information */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-brand-red font-medium">///</span>
          <h2 className="text-lg font-semibold text-foreground">
            Profile Information
          </h2>
        </div>
        <ProfileForm
          user={{
            name: user.name,
            email: user.email,
            image: user.image,
          }}
        />
      </section>

      {/* Security */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-brand-red font-medium">///</span>
          <h2 className="text-lg font-semibold text-foreground">
            Security
          </h2>
        </div>
        <div className="space-y-6">
          <ChangePassword hasPassword={hasPassword} />
          <ConnectedAccounts accounts={user.accounts} hasPassword={hasPassword} />
        </div>
      </section>

      {/* Addresses */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-brand-red font-medium">///</span>
          <h2 className="text-lg font-semibold text-foreground">
            Addresses
          </h2>
        </div>
        <AddressManager />
      </section>

      {/* Danger Zone */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-red-500 font-medium">///</span>
          <h2 className="text-lg font-semibold text-foreground">
            Danger Zone
          </h2>
        </div>
        <DeleteAccount />
      </section>
    </div>
  );
}
