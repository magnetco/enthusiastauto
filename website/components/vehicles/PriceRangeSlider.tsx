"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  formatValue = (v) => `$${v.toLocaleString()}`,
}: PriceRangeSliderProps) {
  // Local state for inputs to allow typing without immediate URL updates
  const [minInput, setMinInput] = useState(value[0].toString());
  const [maxInput, setMaxInput] = useState(value[1].toString());

  // Sync local state when prop value changes
  useEffect(() => {
    setMinInput(value[0].toString());
    setMaxInput(value[1].toString());
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    if (newValue[0] !== undefined && newValue[1] !== undefined) {
      onChange([newValue[0], newValue[1]]);
    }
  };

  const handleMinInputBlur = () => {
    const parsed = parseInt(minInput) || min;
    const clamped = Math.max(min, Math.min(parsed, value[1]));
    onChange([clamped, value[1]]);
  };

  const handleMaxInputBlur = () => {
    const parsed = parseInt(maxInput) || max;
    const clamped = Math.min(max, Math.max(parsed, value[0]));
    onChange([value[0], clamped]);
  };

  const handleMinInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMinInputBlur();
      e.currentTarget.blur();
    }
  };

  const handleMaxInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMaxInputBlur();
      e.currentTarget.blur();
    }
  };

  return (
    <div className="space-y-4">
      {/* Visual Slider */}
      <div className="px-2 pt-2">
        <Slider
          min={min}
          max={max}
          step={1000}
          value={value}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>

      {/* Range Display */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{formatValue(min)}</span>
        <span className="text-xs">
          {formatValue(value[0])} - {formatValue(value[1])}
        </span>
        <span>{formatValue(max)}</span>
      </div>

      {/* Precise Input Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="price-min-input" className="text-xs text-muted-foreground">
            Min Price
          </Label>
          <Input
            id="price-min-input"
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            onBlur={handleMinInputBlur}
            onKeyDown={handleMinInputKeyDown}
            min={min}
            max={value[1]}
            step={1000}
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price-max-input" className="text-xs text-muted-foreground">
            Max Price
          </Label>
          <Input
            id="price-max-input"
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            onBlur={handleMaxInputBlur}
            onKeyDown={handleMaxInputKeyDown}
            min={value[0]}
            max={max}
            step={1000}
            className="h-9"
          />
        </div>
      </div>
    </div>
  );
}
