"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { toast } from "sonner";
import { useHeaderScroll } from "./StickyHeader";
import { cn } from "@/lib/utils";

/**
 * Auth button for the header
 * Shows "Log in" link when logged out
 * Shows avatar + name + sign out link when logged in
 */
export function HeaderAuthButton() {
  const { data: session, status } = useSession();
  const isScrolled = useHeaderScroll();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/" });
      toast.success("You've been logged out");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "h-8 w-8 animate-pulse rounded-full transition-colors duration-300",
            isScrolled ? "bg-gray-200" : "bg-white/10"
          )}
        />
        <div
          className={cn(
            "h-4 w-20 animate-pulse rounded transition-colors duration-300",
            isScrolled ? "bg-gray-200" : "bg-white/10"
          )}
        />
      </div>
    );
  }

  // Logged in: Show avatar + name + sign out link
  if (session?.user) {
    const displayName = session.user.name || session.user.email || "Account";
    const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div className="flex items-center gap-3 text-sm">
        {/* Avatar - shows user image if available, otherwise initials */}
        <Link
          href="/account"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors duration-300 overflow-hidden",
            isScrolled
              ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
              : "bg-white/20 text-white hover:bg-white/30"
          )}
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt=""
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </Link>

        {/* Name - links to account page */}
        <Link
          href="/account"
          className={cn(
            "font-medium transition-colors duration-300",
            isScrolled
              ? "text-gray-900 hover:text-gray-600"
              : "text-white hover:text-white/70"
          )}
        >
          {displayName}
        </Link>

        {/* Sign out link */}
        <button
          onClick={handleSignOut}
          className={cn(
            "transition-colors duration-300",
            isScrolled
              ? "text-gray-500 hover:text-gray-900"
              : "text-white/50 hover:text-white"
          )}
        >
          Sign out
        </button>
      </div>
    );
  }

  // Logged out: Show Sign in with Google button
  return (
    <button
      onClick={() => signIn("google")}
      className={cn(
        "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300",
        isScrolled
          ? "bg-gray-900 text-white hover:bg-gray-800"
          : "bg-white text-gray-900 hover:bg-white/90"
      )}
    >
      <GoogleIcon className="h-4 w-4" />
      Sign in with Google
    </button>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

