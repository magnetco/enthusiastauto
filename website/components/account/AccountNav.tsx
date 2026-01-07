"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  Warehouse,
  Settings,
  LogOut,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/account",
    icon: Settings,
    description: "Account overview",
  },
  {
    label: "My Garage",
    href: "/account/garage",
    icon: Warehouse,
    description: "Saved vehicles & parts",
  },
  {
    label: "Profile",
    href: "/account/profile",
    icon: User,
    description: "Personal information",
  },
];

export function AccountNav() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            <div className="flex-1 min-w-0">
              <span className="block truncate">{item.label}</span>
              {item.description && (
                <span
                  className={cn(
                    "block truncate text-xs",
                    isActive
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {item.description}
                </span>
              )}
            </div>
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 opacity-0 transition-opacity",
                isActive && "opacity-100"
              )}
            />
          </Link>
        );
      })}

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600"
      >
        <LogOut className="h-5 w-5 shrink-0 transition-colors group-hover:text-red-600" />
        <span>Sign Out</span>
      </button>
    </nav>
  );
}

interface AccountNavMobileProps {
  user?: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export function AccountNavMobile({ user }: AccountNavMobileProps) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

