"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

/**
 * Generate a Gravatar URL from an email address
 */
function getGravatarUrl(email: string, size: number = 80): string {
  const hash = require("crypto")
    .createHash("md5")
    .update(email.toLowerCase().trim())
    .digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

/**
 * User account menu component
 * Shows "Sign In" link for unauthenticated users
 * Shows profile dropdown with logout for authenticated users
 */
export default function UserMenu() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
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
      <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-muted" />
    );
  }

  // Authenticated state: Show user dropdown with icon (matching unauthenticated state structure)
  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground p-4 border-l border-border/50"
          aria-label="User menu"
        >
          <UserIcon className="h-5 w-5" />
          <span className="hidden lg:inline">{session.user.name || session.user.email || "Account"}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account/profile" className="cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/garage" className="cursor-pointer">
              Garage
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account" className="cursor-pointer">
              Account Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={handleLogout}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Unauthenticated state: Show "Sign In" link
  return (
    <Link
      href="/auth/signin"
      className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground p-4 border-l border-border/50"
      aria-label="Sign in to your account"
    >
      <UserIcon className="h-5 w-5" />
      <span className="hidden lg:inline">Sign In</span>
    </Link>
  );
}
