"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
  const [selectedType, setSelectedType] = useState(
    documentation.length > 0 ? documentation[0].type : DOC_TYPES[0]
  );

  const selectedDoc = documentation.find((doc) => doc.type === selectedType);

  const handleDownloadAll = () => {
    // In a real implementation, this would generate a PDF with all documentation
    // For now, we'll just download the selected document
    if (selectedDoc?.file?.asset?.url) {
      window.open(selectedDoc.file.asset.url, "_blank");
    }
  };

  if (!documentation || documentation.length === 0) {
    return null;
  }

  return (
    <section id="docs" className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
          <h2 className="font-chromatic text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
            Documentation
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#F90020] to-transparent" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <div className="space-y-2">
            {DOC_TYPES.map((type) => {
              const hasDoc = documentation.some((doc) => doc.type === type);
              return (
                <button
                  key={type}
                  onClick={() => hasDoc && setSelectedType(type)}
                  disabled={!hasDoc}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
                    selectedType === type
                      ? "bg-[#F90020] text-white"
                      : hasDoc
                        ? "bg-white text-gray-700 hover:bg-gray-100"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2",
                      selectedType === type
                        ? "border-white bg-white"
                        : hasDoc
                          ? "border-gray-400"
                          : "border-gray-300"
                    )}
                  >
                    {selectedType === type && (
                      <div className="h-full w-full rounded-full bg-[#F90020]" />
                    )}
                  </div>
                  {type}
                </button>
              );
            })}

            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={handleDownloadAll}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex min-h-[500px] items-center justify-center rounded-lg bg-white p-8 shadow-sm">
            {selectedDoc?.image?.asset?.url ? (
              <div className="relative h-full w-full">
                <Image
                  src={selectedDoc.image.asset.url}
                  alt={`${vehicleTitle} - ${selectedType}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">No image available</p>
                <p className="mt-2 text-sm">
                  {selectedDoc?.file?.asset?.url
                    ? "Click Download PDF to view this document"
                    : "Documentation not yet uploaded"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
