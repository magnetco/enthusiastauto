"use client";

import Image from "next/image";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentationItem {
  type: string;
  image?: {
    asset: {
      url: string;
      _id: string;
    };
  };
  file?: {
    asset: {
      url: string;
      _id: string;
    };
  };
}

interface VehicleDocumentationProps {
  documentation: DocumentationItem[];
  vehicleTitle: string;
}

const DOC_TYPES = [
  "Manuals",
  "Keys",
  "Window Sticker",
  "Service Records",
  "Accessories",
  "Tools",
];

export function VehicleDocumentation({
  documentation,
  vehicleTitle,
}: VehicleDocumentationProps) {
  if (!documentation || documentation.length === 0) {
    return null;
  }

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  return (
    <section id="docs" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
          <h2 className="font-chromatic text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
            Documentation
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOC_TYPES.map((type) => {
            const doc = documentation.find((d) => d.type === type);
            const hasFile = doc?.file?.asset?.url;
            const hasImage = doc?.image?.asset?.url;

            return (
              <div
                key={type}
                className={cn(
                  "group relative overflow-hidden rounded-lg border-2 bg-white shadow-sm transition-all",
                  hasFile
                    ? "border-gray-200 hover:border-[#F90020] hover:shadow-md cursor-pointer"
                    : "border-gray-200 bg-gray-50"
                )}
                onClick={() => hasFile && doc.file?.asset?.url && handleDownload(doc.file.asset.url)}
              >
                {/* Image/Icon Area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {hasImage && doc.image?.asset?.url ? (
                    <Image
                      src={doc.image.asset.url}
                      alt={`${vehicleTitle} - ${type}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FileText className="h-16 w-16 text-gray-300" />
                    </div>
                  )}

                  {/* PDF Unavailable Badge */}
                  {!hasFile && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <span className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        PDF Unavailable
                      </span>
                    </div>
                  )}

                  {/* Download Icon Overlay */}
                  {hasFile && (
                    <div className="absolute right-3 top-3 rounded-full bg-white/90 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Download className="h-5 w-5 text-[#F90020]" />
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{type}</h3>
                    {hasFile && (
                      <FileText className="h-5 w-5 text-[#F90020]" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
