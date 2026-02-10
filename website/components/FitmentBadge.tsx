import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, AlertCircle } from "lucide-react";

export interface FitmentBadgeProps {
  variant: "compatible" | "universal" | "check-fitment";
  modelName?: string;
  year?: number;
}

export function FitmentBadge({ variant, modelName, year }: FitmentBadgeProps) {
  if (variant === "compatible") {
    const badge = (
      <Badge
        variant="default"
        className="gap-1 bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
        role="status"
        aria-label={`This product fits your ${modelName}${year ? ` ${year}` : ''}`}
      >
        <Check className="h-3 w-3" aria-hidden="true" />
        <span>Fits Your {modelName}</span>
      </Badge>
    );

    // Add tooltip with year information if available
    if (year) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{badge}</TooltipTrigger>
            <TooltipContent>
              <p>
                Compatible with {modelName} {year}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return badge;
  }

  if (variant === "check-fitment") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="secondary"
              className="gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:hover:bg-yellow-900/40"
              role="status"
              aria-label="Check fitment - No fitment data available"
            >
              <AlertCircle className="h-3 w-3" aria-hidden="true" />
              <span>Check Fitment</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent role="tooltip">
            <p>
              No fitment data available. Please verify compatibility before
              purchasing.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Universal fit
  return (
    <Badge
      variant="secondary"
      className="bg-muted-foreground text-background hover:bg-muted-foreground/90"
      role="status"
      aria-label="Universal fit - Compatible with all vehicles"
    >
      Universal Fit
    </Badge>
  );
}
