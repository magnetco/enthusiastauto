import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import Container from "@/components/layout/container";
import { AccountNav, AccountNavMobile, AccountHeader } from "@/components/account";

export const metadata: Metadata = {
  title: {
    template: "%s | My Account | Enthusiast Auto",
    default: "My Account | Enthusiast Auto",
  },
  description: "Manage your Enthusiast Auto account, garage, and profile settings",
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get authenticated user session
  const session = await getServerSession();

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/account");
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="light-section min-h-screen">
      <div className="px-page-x py-6 lg:py-10">
        <Container>
          {/* Mobile Header */}
          <div className="mb-6 lg:hidden">
            <AccountHeader
              user={{
                name: user.name,
                email: user.email,
                image: user.image,
              }}
              memberSince={user.createdAt}
            />
            <div className="mt-4">
              <AccountNavMobile />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-[calc(var(--header-height)+2rem)]">
                {/* User Info */}
                <AccountHeader
                  user={{
                    name: user.name,
                    email: user.email,
                    image: user.image,
                  }}
                  memberSince={user.createdAt}
                  className="mb-6 rounded-xl border bg-card p-4"
                />

                {/* Navigation */}
                <div className="rounded-xl border bg-card p-3">
                  <AccountNav />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </Container>
      </div>
    </div>
  );
}
