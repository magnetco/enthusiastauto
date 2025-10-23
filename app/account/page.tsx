import { Metadata } from "next";
import Link from "next/link";

/**
 * /account route - User dashboard placeholder
 * Part of Epic 4 routing architecture (Story 4.3)
 * Full implementation in Epic 5 (User Account & Personalization)
 *
 * This placeholder prevents 404 errors and sets up the route structure
 * for future Epic 5 development
 */

export const metadata: Metadata = {
  title: "My Account | Enthusiast Auto",
  description: "Manage your Enthusiast Auto account, garage, and orders.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          My Account
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          User accounts coming soon in Epic 5
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-3">Coming Soon</h2>
          <p className="text-gray-700 mb-4">
            We're building a comprehensive account system where you'll be able to:
          </p>
          <ul className="text-left space-y-2 mb-6">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Save your favorite vehicles to "My Garage"</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Track your order history</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Manage your profile and preferences</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Receive personalized recommendations</span>
            </li>
          </ul>

          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
