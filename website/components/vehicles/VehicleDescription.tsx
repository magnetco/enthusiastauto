import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";

interface VehicleDescriptionProps {
  vehicle: VehicleDetail;
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 text-muted-foreground">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mb-3 mt-6 text-2xl font-semibold text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-4 text-xl font-semibold text-foreground">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-muted-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export function VehicleDescription({ vehicle }: VehicleDescriptionProps) {
  return (
    <div className="space-y-6">
      {/* Highlights Section */}
      {vehicle.highlights && vehicle.highlights.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Highlights</h2>
          <div className="prose prose-invert max-w-none">
            <PortableText
              value={vehicle.highlights}
              components={portableTextComponents}
            />
          </div>
        </div>
      )}

      {/* Overview Section */}
      {vehicle.overview && vehicle.overview.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Overview</h2>
          <div className="prose prose-invert max-w-none">
            <PortableText
              value={vehicle.overview}
              components={portableTextComponents}
            />
          </div>
        </div>
      )}

      {/* History Section */}
      {vehicle.history && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">History</h2>
          <p className="whitespace-pre-wrap text-muted-foreground">{vehicle.history}</p>
        </div>
      )}
    </div>
  );
}
