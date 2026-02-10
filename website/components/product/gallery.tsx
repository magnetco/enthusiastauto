"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "components/grid/tile";
import { useProduct, useUpdateURL } from "components/product/product-context";
import Image from "next/image";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "h-full px-5 transition-all duration-200 ease-in-out hover:text-foreground flex items-center justify-center text-muted-foreground hover:bg-muted active:scale-95";

  return (
    <form>
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain transition-opacity duration-300"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}

        {/* Navigation Arrows */}
        {images.length > 1 ? (
          <div className="absolute bottom-4 flex w-full justify-center">
            <div className="flex h-11 items-center overflow-hidden rounded-full border border-border bg-background shadow-sm">
              <button
                formAction={() => {
                  const newState = updateImage(previousImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Previous product image"
                className={buttonClassName}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              <div className="h-5 w-px bg-border" />
              <button
                formAction={() => {
                  const newState = updateImage(nextImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Next product image"
                className={buttonClassName}
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 ? (
        <ul className="mt-4 flex flex-wrap items-center justify-start gap-2 lg:mt-5">
          {images.map((image, index) => {
            const isActive = index === imageIndex;

            return (
              <li key={image.src} className="h-16 w-16 sm:h-18 sm:w-18">
                <button
                  formAction={() => {
                    const newState = updateImage(index.toString());
                    updateURL(newState);
                  }}
                  aria-label="Select product image"
                  className="group h-full w-full"
                >
                  <div
                    className={`h-full w-full overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      isActive
                        ? "border-foreground"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    <GridTileImage
                      alt={image.altText}
                      src={image.src}
                      width={72}
                      height={72}
                      active={isActive}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
