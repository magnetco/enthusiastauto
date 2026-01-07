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
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/account");
  }

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
      <div className="px-page-x py-8 lg:py-12">
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
              className="mb-4"
            />
            <AccountNavMobile />
          </div>

          {/* Desktop Layout */}
          <div className="flex gap-12 lg:gap-16">
            {/* Sidebar */}
            <aside className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-[calc(var(--header-height)+2rem)]">
                <AccountHeader
                  user={{
                    name: user.name,
                    email: user.email,
                    image: user.image,
                  }}
                  memberSince={user.createdAt}
                  className="mb-6 pb-6 border-b border-border"
                />
                <AccountNav />
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
