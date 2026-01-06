"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export interface VehicleSelectorProps {
  modelOptions: string[];
  yearOptions: number[];
  selectedModel: string | null;
  selectedYear: number | null;
  onSelect: (model: string, year: number) => void;
  onClear: () => void;
}

export function VehicleSelector({
  modelOptions,
  yearOptions,
  selectedModel,
  selectedYear,
  onSelect,
  onClear,
}: VehicleSelectorProps) {
  // Local state to track interim selections
  const [localModel, setLocalModel] = useState<string | null>(selectedModel);
  const [localYear, setLocalYear] = useState<number | null>(selectedYear);

  // Sync with props when they change (e.g., from localStorage or clear)
  useEffect(() => {
    setLocalModel(selectedModel);
    setLocalYear(selectedYear);
  }, [selectedModel, selectedYear]);

  const handleModelChange = (model: string) => {
    setLocalModel(model);
    // If year is already selected, trigger the filter immediately
    if (localYear) {
      onSelect(model, localYear);
    }
  };

  const handleYearChange = (year: string) => {
    const yearNum = parseInt(year, 10);
    setLocalYear(yearNum);
    // If model is already selected, trigger the filter immediately
    if (localModel) {
      onSelect(localModel, yearNum);
    }
  };

  const handleClear = () => {
    setLocalModel(null);
    setLocalYear(null);
    onClear();
  };

  const hasSelection = localModel && localYear;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 space-y-2">
          <label
            htmlFor="vehicle-model"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Model
          </label>
          <Select
            key={`model-${localModel || "empty"}`}
            value={localModel || undefined}
            onValueChange={handleModelChange}
          >
            <SelectTrigger
              id="vehicle-model"
              className="w-full"
              aria-label="Select BMW model"
            >
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4}>
              {modelOptions.length > 0 ? (
                modelOptions.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-models" disabled>
                  No models available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label
            htmlFor="vehicle-year"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Year
          </label>
          <Select
            key={`year-${localYear || "empty"}`}
            value={localYear?.toString() || undefined}
            onValueChange={handleYearChange}
          >
            <SelectTrigger
              id="vehicle-year"
              className="w-full"
              aria-label="Select vehicle year"
            >
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4}>
              {yearOptions.length > 0 ? (
                yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-years" disabled>
                  No years available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasSelection && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="w-full sm:w-auto"
          aria-label="Clear vehicle selection"
        >
          <X className="mr-2 h-4 w-4" />
          Clear Selection
        </Button>
      )}
    </div>
  );
}
