"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useHeaderScroll } from "@/components/shared/StickyHeader";
import { cn } from "@/lib/utils";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  const isScrolled = useHeaderScroll();

  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2 rounded-md px-4 transition-colors duration-300",
        isScrolled
          ? "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <ShoppingCartIcon
        className={clsx("h-5 w-5 transition-all ease-in-out", className)}
      />
      <span className="text-sm font-medium">{quantity ?? 0}</span>
    </div>
  );
}
