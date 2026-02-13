import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Marketing Hub | Enthusiast Auto Group",
  description: "Sign in to the Marketing Hub",
};

export default function HubLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[#171717]">
            Enthusiast Auto Group
          </h1>
        </div>

        {/* Login Card */}
        <div className="overflow-hidden rounded-lg border border-[#e5e5e5] bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-6 py-4">
            <h2 className="text-base font-medium text-[#171717]">
              Marketing Hub
            </h2>
            <p className="mt-1 text-sm text-[#737373]">
              Sign in with your work account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5 p-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#171717]"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@company.com"
                className="h-10 w-full rounded-md border border-[#d4d4d4] bg-white px-3 text-sm text-[#171717] placeholder:text-[#a3a3a3] focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#171717]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className="h-10 w-full rounded-md border border-[#d4d4d4] bg-white px-3 text-sm text-[#171717] placeholder:text-[#a3a3a3] focus:border-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717]"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="h-10 w-full rounded-md bg-[#171717] text-sm font-medium text-white transition-colors hover:bg-[#262626] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e5e5]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-[#737373]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Microsoft SSO */}
            <button
              type="button"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#d4d4d4] bg-white text-sm font-medium text-[#171717] transition-colors hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
              Sign in with Microsoft
            </button>
          </form>

          {/* Footer */}
          <div className="border-t border-[#e5e5e5] bg-[#fafafa] px-6 py-4">
            <p className="text-center text-xs text-[#737373]">
              Need help? Contact your IT administrator for access.
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#737373] hover:text-[#171717] hover:underline"
          >
            &larr; Back to main site
          </Link>
        </div>
      </div>
    </div>
  );
}
