import { Metadata } from "next";

/**
 * Account section layout
 * Part of Epic 4 routing architecture (Story 4.3)
 *
 * This layout will be expanded in Epic 5 to include:
 * - Navigation sidebar for account sections
 * - Auth protection middleware
 * - User profile context
 */

export const metadata: Metadata = {
  title: {
    template: "%s | My Account | Enthusiast Auto",
    default: "My Account | Enthusiast Auto",
  },
  description: "Manage your Enthusiast Auto account and preferences",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="light-section min-h-screen">{children}</div>;
}
