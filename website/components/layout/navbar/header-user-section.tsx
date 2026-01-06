"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";

/**
 * Header user section component
 * Shows "Log in" link for unauthenticated users
 * Shows avatar + name + sign out link for authenticated users
 */
export function HeaderUserSection() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/" });
      toast.success("You've been logged out");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  // Authenticated state: Show avatar + name + sign out
  if (session?.user) {
    const displayName = session.user.name || session.user.email || "Account";
    const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div className="flex items-center gap-3">
        {/* Avatar - links to account page */}
        <Link
          href="/account"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80"
          aria-label="Go to account"
        >
          {initials}
        </Link>

        {/* Name - links to account page */}
        <Link
          href="/account"
          className="text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
        >
          {displayName}
        </Link>

        {/* Sign out link */}
        <button
          onClick={handleSignOut}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    );
  }

  // Unauthenticated state: Show "Log in" link
  return (
    <Link
      href="/auth/signin"
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      Log in
    </Link>
  );
}

