import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing Hub | Enthusiast Auto Group",
  description: "Marketing Hub for Enthusiast Auto Group",
};

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
