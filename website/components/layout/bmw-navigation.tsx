"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavigationItem {
  title: string;
  href: string;
  isActive?: boolean;
}

interface NavigationCategory {
  title: string;
  items: NavigationItem[];
}

const bmwNavigationData: NavigationCategory[] = [
  {
    title: "New arrivals",
    items: [
      { title: "M1", href: "/search?q=m1", isActive: true },
      { title: "M2", href: "/search?q=m2", isActive: true },
    ],
  },
  {
    title: "Current inventory",
    items: [
      { title: "F87 M2", href: "/search?q=f87-m2" },
      { title: "G87 M2", href: "/search?q=g87-m2" },
    ],
  },
  {
    title: "Previous inventory",
    items: [
      { title: "M3", href: "/search?q=m3", isActive: true },
      { title: "E30 M3", href: "/search?q=e30-m3" },
      { title: "E36 M3", href: "/search?q=e36-m3" },
      { title: "E46 M3", href: "/search?q=e46-m3" },
      { title: "E9X M3", href: "/search?q=e9x-m3" },
      { title: "F8X M3", href: "/search?q=f8x-m3" },
    ],
  },
  {
    title: "Sell your car",
    items: [
      { title: "M5", href: "/search?q=m5", isActive: true },
      { title: "E24 M5", href: "/search?q=e24-m5" },
      { title: "E34 M5", href: "/search?q=e34-m5" },
      { title: "E39 M5", href: "/search?q=e39-m5" },
      { title: "E60 M5", href: "/search?q=e60-m5" },
    ],
  },
  {
    title: "",
    items: [
      { title: "Z3/Z4", href: "/search?q=z3-z4", isActive: true },
      { title: "Z3 M", href: "/search?q=z3-m" },
      { title: "Z4 M", href: "/search?q=z4-m" },
      { title: "Z8", href: "/search?q=z8" },
    ],
  },
];

export function BMWNavigation() {
  return (
    <div className="flex items-start justify-between w-full">
      {/* Categories Column */}
      <div className="flex flex-col gap-3 w-[126px]">
        {bmwNavigationData.map((category, index) => (
          <div key={index} className="flex flex-col gap-3">
            {category.title && (
              <p className="text-muted-foreground text-sm font-medium leading-[1.5]">
                {category.title}
              </p>
            )}
            <div className="flex flex-col gap-3">
              {category.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium leading-[1.5] transition-colors duration-200",
                    item.isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Vertical Divider */}
      <div className="w-px bg-border mx-3 flex-shrink-0" />

      {/* M-Series Categories */}
      <div className="flex flex-col gap-3 w-[126px]">
        <div className="flex flex-col gap-3">
          <Link
            href="/search?q=m1"
            className="text-foreground text-sm font-medium leading-[1.5] transition-colors duration-200 hover:text-muted-foreground"
          >
            M1
          </Link>
          <Link
            href="/search?q=m2"
            className="text-foreground text-sm font-medium leading-[1.5] transition-colors duration-200 hover:text-muted-foreground"
          >
            M2
          </Link>
          <Link
            href="/search?q=f87-m2"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            F87 M2
          </Link>
          <Link
            href="/search?q=g87-m2"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            G87 M2
          </Link>
        </div>
      </div>

      {/* M3 Series */}
      <div className="flex flex-col gap-3 w-[126px]">
        <div className="flex flex-col gap-3">
          <Link
            href="/search?q=m3"
            className="text-foreground text-sm font-medium leading-[1.5] transition-colors duration-200 hover:text-muted-foreground"
          >
            M3
          </Link>
          <Link
            href="/search?q=e30-m3"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            E30 M3
          </Link>
          <Link
            href="/search?q=e36-m3"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            E36 M3
          </Link>
          <Link
            href="/search?q=e46-m3"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            E46 M3
          </Link>
          <Link
            href="/search?q=e9x-m3"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            E9X M3
          </Link>
          <Link
            href="/search?q=f8x-m3"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            F8X M3
          </Link>
        </div>
      </div>

      {/* M5 Series */}
      <div className="flex flex-col gap-3 w-[126px]">
        <div className="flex flex-col gap-3">
          <Link
            href="/search?q=m5"
            className="text-foreground text-sm font-medium leading-[1.5] transition-colors duration-200 hover:text-muted-foreground"
          >
            M5
          </Link>
          <Link
            href="/search?q=e24-m5"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            E24 M5
          </Link>
          <Link
            href="/search?q=e34-m5"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            E34 M5
          </Link>
          <Link
            href="/search?q=e39-m5"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            E39 M5
          </Link>
          <Link
            href="/search?q=e60-m5"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            E60 M5
          </Link>
        </div>
      </div>

      {/* Z Series */}
      <div className="flex flex-col gap-3 w-[126px]">
        <div className="flex flex-col gap-3">
          <Link
            href="/search?q=z3-z4"
            className="text-foreground text-sm font-medium leading-[1.5] transition-colors duration-200 hover:text-muted-foreground"
          >
            Z3/Z4
          </Link>
          <Link
            href="/search?q=z3-m"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            Z3 M
          </Link>
          <Link
            href="/search?q=z4-m"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            Z4 M
          </Link>
          <Link
            href="/search?q=z8"
            className="text-muted-foreground text-xs font-medium leading-[1.5] transition-colors duration-200 hover:text-foreground"
          >
            Z8
          </Link>
        </div>
      </div>
    </div>
  );
}
