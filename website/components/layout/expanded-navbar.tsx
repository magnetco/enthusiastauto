"use client";

import Link from "next/link";
import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { BMWNavigation } from "./bmw-navigation";

// Image constants from Figma
const imgRectangle = "http://localhost:3845/assets/b8f3c1538f92bff51caab37e36bf79249005f20a.png";
const imgRectangle1 = "http://localhost:3845/assets/08248d7fc7e9705dedb983ea615ceb9a497a25bd.png";
const imgEllipse3 = "http://localhost:3845/assets/885839a7f277c433921cc9e1953585285cc89a98.png";

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

export function ExpandedNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="bg-[#0a0d11] relative w-full min-h-screen">
      {/* Background Images */}
      <div className="absolute bottom-0 left-0 right-0 top-[41.83%]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img 
              alt="" 
              className="absolute left-0 max-w-none size-full top-0" 
              src={imgRectangle} 
            />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img 
              alt="" 
              className="absolute left-0 max-w-none size-full top-0" 
              src={imgRectangle1} 
            />
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="absolute h-[40px] left-[174px] top-[35px] w-[358px]">
        <p className="absolute font-['Chromatic_Trial:Gothic_Medium',_sans-serif] inset-[22.5%_-26.82%_15%_24.3%] leading-[1.2] not-italic text-[#ebf1f5] text-[23px] tracking-[0.92px] uppercase">
          ENTHUSIAST AUTO
        </p>
        {/* Brand Icon - Complex SVG structure would go here */}
        <div className="absolute bottom-[0.7%] left-0 right-[79.16%] top-0">
          {/* This would contain the complex brand icon from Figma */}
          <div className="w-full h-full bg-[#ebf1f5] rounded-sm opacity-20" />
        </div>
      </div>

      {/* User Account Section */}
      <div className="absolute flex gap-4 items-center justify-end left-[calc(75%-26px)] top-[41px]">
        <div className="relative shrink-0 size-[32px]">
          <UserIcon className="block max-w-none size-full" />
        </div>
        <Link 
          href="/account"
          className="font-medium leading-[1.5] relative shrink-0 text-[#ebf1f5] text-[15px] text-nowrap whitespace-pre transition-colors duration-200 hover:text-muted-foreground"
        >
          Account
        </Link>
        <span className="font-normal leading-[1.5] relative shrink-0 text-[#ebf1f5] text-[15px] text-nowrap whitespace-pre">
          |
        </span>
        <Link 
          href="/favorites"
          className="font-medium leading-[1.5] relative shrink-0 text-[#ebf1f5] text-[15px] text-nowrap whitespace-pre transition-colors duration-200 hover:text-muted-foreground"
        >
          Favorites
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="absolute flex font-medium gap-12 items-center leading-[1.5] left-[174px] text-[#ebf1f5] text-[15px] text-nowrap whitespace-pre top-[132px]">
        {mainNavItems.map((item, index) => (
          <div key={index} className="relative">
            <Link
              href={item.href}
              className="relative shrink-0 transition-colors duration-200 hover:text-muted-foreground"
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.title)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.title}
            </Link>
            
            {/* Active indicator */}
            {item.title === "Inventory" && (
              <div className="absolute bg-[#92a7b4] h-[2px] left-[calc(12.5%+123px)] top-[42px] w-[65px]" />
            )}
          </div>
        ))}
      </div>

      {/* BMW Navigation Dropdown */}
      {activeDropdown === "Inventory" && (
        <div className="absolute left-[172px] top-[209px] w-[1055px] z-50">
          <BMWNavigation />
        </div>
      )}

      {/* Grid Lines */}
      <div className="absolute bg-[#141c27] h-px left-0 top-[112px] w-full" />
      <div className="absolute bg-[#141c27] h-px left-0 top-[768px] w-full" />
      <div className="absolute bg-[#141c27] h-px left-0 top-[176px] w-full" />
      <div className="absolute bg-[#141c27] h-px left-0 top-[424px] w-full" />
      <div className="absolute bg-[#141c27] h-full left-[32px] top-0 w-px" />
      <div className="absolute bg-[rgba(20,28,39,0.4)] h-full left-0 top-0 w-[33px]" />
      <div className="absolute bg-[#141c27] h-full left-[calc(100%-33px)] top-0 w-px" />
      <div className="absolute bg-[rgba(20,28,39,0.4)] h-full left-[calc(100%-33px)] top-0 w-[33px]" />
      <div className="absolute bg-[#141c27] h-[5px] left-0 top-0 w-full" />
    </div>
  );
}
