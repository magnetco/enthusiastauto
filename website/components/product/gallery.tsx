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
    "h-full px-6 transition-all duration-200 ease-in-out hover:scale-110 hover:text-foreground flex items-center justify-center";

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[600px] w-full overflow-hidden rounded-xl bg-muted/30">
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

        {images.length > 1 ? (
          <div className="absolute bottom-6 flex w-full justify-center">
            <div className="mx-auto flex h-12 items-center rounded-full border border-border/50 bg-background/90 text-muted-foreground shadow-lg backdrop-blur-md">
              <button
                formAction={() => {
                  const newState = updateImage(previousImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Previous product image"
                className={buttonClassName}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-border"></div>
              <button
                formAction={() => {
                  const newState = updateImage(nextImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Next product image"
                className={buttonClassName}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="my-8 flex items-center flex-wrap justify-center gap-3 overflow-auto py-1 lg:mb-0 lg:mt-6">
          {images.map((image, index) => {
            const isActive = index === imageIndex;

            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  formAction={() => {
                    const newState = updateImage(index.toString());
                    updateURL(newState);
                  }}
                  aria-label="Select product image"
                  className="group h-full w-full"
                >
                  <div className={`overflow-hidden rounded-lg ring-2 transition-all duration-200 ${isActive ? 'ring-primary' : 'ring-transparent hover:ring-muted-foreground/30'}`}>
                    <GridTileImage
                      alt={image.altText}
                      src={image.src}
                      width={80}
                      height={80}
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
