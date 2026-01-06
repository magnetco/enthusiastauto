"use client";

import Link from "next/link";
import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { BMWNavigation } from "./bmw-navigation";

interface NavItem {
  title: string;
  href: string;
  hasDropdown?: boolean;
}

const mainNavItems: NavItem[] = [
  { title: "About EAG", href: "/about" },
  { title: "Inventory", href: "/inventory", hasDropdown: true },
  { title: "Services", href: "/services" },
  { title: "Sell your car", href: "/sell" },
  { title: "Under the hood", href: "/under-the-hood" },
  { title: "Parts", href: "/parts" },
  { title: "Merchandise", href: "/merchandise" },
  { title: "Contact", href: "/contact" },
];

export function DesktopNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {/* Main Navigation Bar */}
      <div className="relative flex items-center justify-between p-4 lg:px-8 lg:py-5">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            prefetch={true}
            className="flex items-center transition-opacity duration-200 hover:opacity-80"
          >
            <div className="mr-4">
              {/* Brand Icon placeholder - would contain the complex SVG from Figma */}
              <div className="w-8 h-8 bg-foreground rounded-sm opacity-20" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-wider uppercase">
              ENTHUSIAST AUTO
            </span>
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {mainNavItems.map((item, index) => (
            <div key={index} className="relative">
              <Link
                href={item.href}
                className="text-sm font-medium text-foreground transition-colors duration-200 hover:text-muted-foreground"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.title}
              </Link>
              
              {/* Active indicator for Inventory */}
              {item.title === "Inventory" && (
                <div className="absolute bg-muted-foreground h-[2px] left-0 right-0 top-[42px] w-full" />
              )}
            </div>
          ))}
        </div>

        {/* User Account Section */}
        <div className="flex items-center space-x-4">
          <UserIcon className="w-8 h-8 text-muted-foreground" />
          <Link 
            href="/account"
            className="text-sm font-medium text-foreground transition-colors duration-200 hover:text-muted-foreground"
          >
            Account
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link 
            href="/favorites"
            className="text-sm font-medium text-foreground transition-colors duration-200 hover:text-muted-foreground"
          >
            Favorites
          </Link>
        </div>
      </div>

      {/* BMW Navigation Dropdown */}
      {activeDropdown === "Inventory" && (
        <div className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <BMWNavigation />
          </div>
        </div>
      )}
    </nav>
  );
}
