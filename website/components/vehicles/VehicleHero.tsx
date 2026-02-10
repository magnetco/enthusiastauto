"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GalleryImage {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  alt?: string;
  caption?: string;
}

interface VehicleHeroProps {
  title: string;
  price?: number;
  showCallForPrice: boolean;
  status: "current" | "sold";
  images: GalleryImage[];
  createdAt: string;
  slug: string;
  isFavorited: boolean;
  onFavoriteToggle: () => Promise<void>;
}

const TABS = [
  { id: "specifications", label: "Specifications" },
  { id: "overview", label: "Overview" },
  { id: "gallery", label: "Gallery" },
  { id: "history", label: "History" },
  { id: "docs", label: "Docs" },
  { id: "inquiry", label: "Inquiry" },
  { id: "faqs", label: "FAQs" },
];

export function VehicleHero({
  title,
  price,
  showCallForPrice,
  status,
  images,
  createdAt,
  slug,
  isFavorited,
  onFavoriteToggle,
}: VehicleHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("specifications");
  const [isSticky, setIsSticky] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [localIsFavorited, setLocalIsFavorited] = useState(isFavorited);

  const isSold = status === "sold";
  const isNew = !isSold && isWithin21Days(createdAt);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length]);

  // Sticky tabs on scroll
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 600; // Approximate hero height
      setIsSticky(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for active tab
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    TABS.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveTab(tab.id);
              }
            });
          },
          { rootMargin: "-100px 0px -66% 0px" }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTabClick = (tabId: string) => {
    const element = document.getElementById(tabId);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleFavoriteClick = async () => {
    setFavoriteLoading(true);
    try {
      await onFavoriteToggle();
      setLocalIsFavorited(!localIsFavorited);
      toast.success(
        localIsFavorited ? "Removed from favorites" : "Added to favorites"
      );
    } catch (error) {
      toast.error("Failed to update favorites");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = async (platform?: string) => {
    const url = `${window.location.origin}/vehicles/${slug}`;
    const text = `Check out this ${title}`;

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      } catch (error) {
        toast.error("Failed to copy link");
      }
      return;
    }

    // Try native share API first
    if (!platform && navigator.share) {
      try {
        await navigator.share({ title: text, url });
        return;
      } catch (error) {
        // User cancelled or error, fall through to platform-specific
      }
    }

    // Platform-specific sharing
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform && shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const currentImage = images[currentIndex];

  return (
    <div className="bg-white">
      {/* Hero Image Section */}
      <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
          {currentImage && (
            <Image
              src={currentImage.asset.url}
              alt={currentImage.alt || `${title} - Image ${currentIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
              priority
              placeholder={currentImage.asset.metadata?.lqip ? "blur" : "empty"}
              blurDataURL={currentImage.asset.metadata?.lqip}
            />
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={handlePrevious}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={handleNext}
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 rounded-md bg-black/70 px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Title, Price, and Actions */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="font-chromatic text-3xl uppercase tracking-tight text-foreground sm:text-4xl">
                {title}
              </h1>
              {isSold && (
                <Badge variant="destructive" className="px-4 py-2 text-lg">
                  SOLD
                </Badge>
              )}
              {isNew && (
                <Badge className="bg-blue-500 px-4 py-2 text-lg text-white hover:bg-blue-600">
                  New
                </Badge>
              )}
            </div>
            <div className="text-3xl font-bold text-foreground">
              {showCallForPrice ? (
                "Call for Price"
              ) : price ? (
                `$${price.toLocaleString()}`
              ) : null}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleFavoriteClick}
              disabled={favoriteLoading}
              className={cn(
                "h-12 w-12",
                localIsFavorited && "bg-red-50 text-red-500 hover:bg-red-100"
              )}
              aria-label={localIsFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={cn("h-5 w-5", localIsFavorited && "fill-current")}
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare("copy")}>
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("facebook")}>
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("twitter")}>
                  Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                  LinkedIn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="lg"
              className="bg-[#F90020] hover:bg-[#d00018]"
              onClick={() => handleTabClick("inquiry")}
            >
              Inquire Now
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div
        className={cn(
          "border-b border-gray-200 bg-white transition-all",
          isSticky && "sticky top-0 z-40 shadow-md"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex gap-8 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-[#F90020] text-[#F90020]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

function isWithin21Days(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 21;
}
