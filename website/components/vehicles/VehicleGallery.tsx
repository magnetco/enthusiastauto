"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

interface VehicleGalleryProps {
  images: GalleryImage[];
  vehicleTitle: string;
}

export function VehicleGallery({ images, vehicleTitle }: VehicleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, isFullscreen]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-800 text-gray-400">
        No images available
      </div>
    );
  }

  const currentImage = images[currentIndex];

  if (!currentImage) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="group relative aspect-video overflow-hidden rounded-lg bg-gray-900">
        <Image
          src={currentImage.asset.url}
          alt={
            currentImage.alt || `${vehicleTitle} - Image ${currentIndex + 1}`
          }
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
          priority={currentIndex === 0}
          placeholder={currentImage.asset.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={currentImage.asset.metadata?.lqip}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
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

        {/* Fullscreen Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
          onClick={() => setIsFullscreen(true)}
          aria-label="Fullscreen"
        >
          <Expand className="h-5 w-5" />
        </Button>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={image.asset._id}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-video overflow-hidden rounded-md transition-all ${
                index === currentIndex
                  ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-950"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image.asset.url}
                alt={image.alt || `${vehicleTitle} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 16vw, (max-width: 1200px) 11vw, 8vw"
                loading="lazy"
                placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
                blurDataURL={image.asset.metadata?.lqip}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-0">
          <div className="relative flex h-[95vh] items-center justify-center">
            <Image
              src={currentImage.asset.url}
              alt={
                currentImage.alt ||
                `${vehicleTitle} - Image ${currentIndex + 1}`
              }
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />

            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={handlePrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Fullscreen Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-4 py-2 text-white">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
