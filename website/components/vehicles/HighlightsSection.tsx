import { PortableText } from "@portabletext/react";
import Image from "next/image";
import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";

interface HighlightsSectionProps {
  vehicle: VehicleDetail;
}

export function HighlightsSection({ vehicle }: HighlightsSectionProps) {
  if (!vehicle.highlights || vehicle.highlights.length === 0) {
    return null;
  }

  // Get the first gallery image or signature shot for the right column
  const highlightImage =
    vehicle.galleryImages?.[0]?.asset?.url ||
    vehicle.signatureShot?.asset?.url;

  return (
    <section id="highlights" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
          <h2 className="font-chromatic text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
            Highlights
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Text Column */}
          <div className="space-y-6">
            <div className="prose max-w-none space-y-4">
              <PortableText
                value={vehicle.highlights}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <p className="text-sm leading-relaxed text-gray-700">
                        {children}
                      </p>
                    ),
                    h2: ({ children }) => (
                      <h2 className="font-chromatic text-lg uppercase tracking-tight text-foreground">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold text-foreground">
                        {children}
                      </h3>
                    ),
                  },
                  marks: {
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                        {children}
                      </ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
                        {children}
                      </ol>
                    ),
                  },
                }}
              />
            </div>
          </div>

          {/* Image Column */}
          {highlightImage && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={highlightImage}
                alt={`${vehicle.listingTitle} - Highlights`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
