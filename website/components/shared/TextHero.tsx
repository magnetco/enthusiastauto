import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { cn } from "@/lib/utils";

interface TextHeroProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  breadcrumbs?: {
    customTitle?: string;
    customItems?: Array<{ label: string; href?: string }>;
    includeSchema?: boolean;
  };
}

export function TextHero({ title, subtitle, align = "left", className, breadcrumbs }: TextHeroProps) {
  return (
    <div className={cn("py-8", align === "center" ? "text-center" : "", className)}>
      <Breadcrumbs
        customTitle={breadcrumbs?.customTitle || title}
        customItems={breadcrumbs?.customItems}
        includeSchema={breadcrumbs?.includeSchema}
      />
      <h1 className="text-title-2 font-bold text-foreground">{title}</h1>
      {subtitle ? (
        <p className={cn("mt-2 text-body-base text-muted-foreground", align === "center" ? "mx-auto max-w-2xl" : "")}>{subtitle}</p>
      ) : null}
    </div>
  );
}


