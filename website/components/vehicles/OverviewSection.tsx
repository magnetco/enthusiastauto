import { PortableText } from "@portabletext/react";
import Image from "next/image";
import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";

interface OverviewSectionProps {
  vehicle: VehicleDetail;
}

export function OverviewSection({ vehicle }: OverviewSectionProps) {
  if (!vehicle.overview || vehicle.overview.length === 0) {
    return null;
  }

  // Get the first gallery image for the right column
  const overviewImage = vehicle.galleryImages?.[0]?.asset?.url;

  return (
    <section id="overview" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
          <h2 className="font-chromatic text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
            Overview
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[60%_40%]">
          {/* Text Column */}
          <div className="prose prose-lg max-w-none">
            <PortableText
              value={vehicle.overview}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="mb-4 text-base leading-relaxed text-gray-700">
                      {children}
                    </p>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-4 mt-8 font-chromatic text-xl uppercase tracking-tight text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-3 mt-6 text-lg font-semibold text-foreground">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="mb-2 mt-4 text-base font-semibold text-foreground">
                      {children}
                    </h4>
                  ),
                },
                marks: {
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-700">{children}</em>
                  ),
                  link: ({ children, value }) => (
                    <a
                      href={value?.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#005A90] underline hover:text-[#F90020]"
                    >
                      {children}
                    </a>
                  ),
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="mb-4 list-disc space-y-2 pl-6 text-base text-gray-700">
                      {children}
                    </ul>
                  ),
                  number: ({ children }) => (
                    <ol className="mb-4 list-decimal space-y-2 pl-6 text-base text-gray-700">
                      {children}
                    </ol>
                  ),
                },
              }}
            />
          </div>

          {/* Image Column */}
          {overviewImage && (
            <div className="relative min-h-[400px] overflow-hidden rounded-lg bg-gray-200 lg:min-h-[600px]">
              <Image
                src={overviewImage}
                alt={`${vehicle.listingTitle} - Overview`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
