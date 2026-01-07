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
      {/* Account Overview Section */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <span className="text-brand-red font-semibold">///</span>
          <h2 className="text-title-3 font-semibold text-foreground">
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

      {/* Profile Information Section */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <span className="text-brand-red font-semibold">///</span>
          <h2 className="text-title-3 font-semibold text-foreground">
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

      {/* Security Section */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <span className="text-brand-red font-semibold">///</span>
          <h2 className="text-title-3 font-semibold text-foreground">
            Security
          </h2>
        </div>
        <div className="space-y-6">
          <ChangePassword hasPassword={hasPassword} />
          <ConnectedAccounts accounts={user.accounts} hasPassword={hasPassword} />
        </div>
      </section>

      {/* Addresses Section */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <span className="text-brand-red font-semibold">///</span>
          <h2 className="text-title-3 font-semibold text-foreground">
            Addresses
          </h2>
        </div>
        <AddressManager />
      </section>

      {/* Danger Zone Section */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <span className="text-destructive font-semibold">///</span>
          <h2 className="text-title-3 font-semibold text-foreground">
            Danger Zone
          </h2>
        </div>
        <DeleteAccount />
      </section>
    </div>
  );
}
