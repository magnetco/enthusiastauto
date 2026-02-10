"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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

interface VehicleGallerySectionProps {
  images: GalleryImage[];
  vehicleTitle: string;
}

export function VehicleGallerySection({
  images,
  vehicleTitle,
}: VehicleGallerySectionProps) {
  const [visibleCount, setVisibleCount] = useState(8);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const visibleImages = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, images.length));
  };

  const handleImageClick = (index: number) => {
    setFullscreenIndex(index);
  };

  const handlePrevious = () => {
    if (fullscreenIndex !== null) {
      setFullscreenIndex((prev) =>
        prev === 0 ? images.length - 1 : (prev as number) - 1
      );
    }
  };

  const handleNext = () => {
    if (fullscreenIndex !== null) {
      setFullscreenIndex((prev) =>
        prev === images.length - 1 ? 0 : (prev as number) + 1
      );
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <section id="gallery" className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
            <h2 className="font-chromatic text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
              Gallery
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visibleImages.map((image, index) => (
              <button
                key={image.asset._id}
                onClick={() => handleImageClick(index)}
                className="group relative aspect-video overflow-hidden rounded-lg bg-gray-200 transition-transform hover:scale-105"
              >
                <Image
                  src={image.asset.url}
                  alt={image.alt || `${vehicleTitle} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-90"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                  placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
                  blurDataURL={image.asset.metadata?.lqip}
                />
              </button>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                className="border-gray-300 hover:border-[#F90020] hover:text-[#F90020]"
              >
                Show more images
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Dialog */}
      <Dialog
        open={fullscreenIndex !== null}
        onOpenChange={(open) => !open && setFullscreenIndex(null)}
      >
        <DialogContent className="max-h-[95vh] max-w-[95vw] border-0 bg-black p-0">
          <div className="relative flex h-[95vh] items-center justify-center">
            {fullscreenIndex !== null && images[fullscreenIndex] && (
              <Image
                src={images[fullscreenIndex].asset.url}
                alt={
                  images[fullscreenIndex].alt ||
                  `${vehicleTitle} - Image ${fullscreenIndex + 1}`
                }
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />
            )}

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
              {fullscreenIndex !== null && fullscreenIndex + 1} / {images.length}
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setFullscreenIndex(null)}
              aria-label="Close fullscreen"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
