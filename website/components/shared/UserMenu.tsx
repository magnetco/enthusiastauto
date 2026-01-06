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
 * User account menu component for dark header
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
      <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-white/10" />
    );
  }

  // Authenticated state: Show user dropdown
  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white px-3 lg:px-4"
          aria-label="User menu"
        >
          <UserIcon className="h-5 w-5" />
          <span className="hidden lg:inline">{session.user.name || session.user.email || "Account"}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-white/20 bg-[#1a1a1a]">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-white">
                {session.user.name || "User"}
              </p>
              <p className="text-xs leading-none text-white/50">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem asChild className="text-white/70 hover:text-white focus:text-white focus:bg-white/10">
            <Link href="/account/profile" className="cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="text-white/70 hover:text-white focus:text-white focus:bg-white/10">
            <Link href="/account/garage" className="cursor-pointer">
              Garage
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="text-white/70 hover:text-white focus:text-white focus:bg-white/10">
            <Link href="/account" className="cursor-pointer">
              Account Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
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
      className="flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white px-3 lg:px-4"
      aria-label="Sign in to your account"
    >
      <UserIcon className="h-5 w-5" />
      <span className="hidden lg:inline">Sign In</span>
    </Link>
  );
}
