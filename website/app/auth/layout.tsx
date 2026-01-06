import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Enthusiast Auto",
    default: "Authentication | Enthusiast Auto",
  },
  description: "Sign in or create an account at Enthusiast Auto",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="light-section min-h-screen">{children}</div>;
}

