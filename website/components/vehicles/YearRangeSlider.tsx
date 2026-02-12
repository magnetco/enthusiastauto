"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { YearDistribution } from "@/lib/sanity/queries/vehicles";

interface YearRangeSliderProps {
  min?: number;
  max?: number;
  distribution: YearDistribution[];
  onChange: (min: number, max: number) => void;
}

export function YearRangeSlider({
  min,
  max,
  distribution,
  onChange,
}: YearRangeSliderProps) {
  const searchParams = useSearchParams();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);

  // Get available year range from distribution
  const availableYears = distribution.map((d) => d.year);
  const availableMin = Math.min(...availableYears, 1990);
  const availableMax = Math.max(...availableYears, new Date().getFullYear());

  // Current selected range
  const [minYear, setMinYear] = useState(min || availableMin);
  const [maxYear, setMaxYear] = useState(max || availableMax);

  // Update local state when props change
  useEffect(() => {
    setMinYear(min || availableMin);
    setMaxYear(max || availableMax);
  }, [min, max, availableMin, availableMax]);

  // Calculate position percentage
  const getPositionPercent = (year: number) => {
    const range = availableMax - availableMin;
    return ((year - availableMin) / range) * 100;
  };

  // Calculate year from position
  const getYearFromPosition = (clientX: number) => {
    if (!trackRef.current) return availableMin;

    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const range = availableMax - availableMin;
    const year = Math.round(availableMin + percent * range);

    return Math.max(availableMin, Math.min(availableMax, year));
  };

  // Handle mouse/touch move
  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;

      const year = getYearFromPosition(clientX);

      if (isDragging === "min") {
        const newMin = Math.min(year, maxYear - 1);
        setMinYear(newMin);
      } else {
        const newMax = Math.max(year, minYear + 1);
        setMaxYear(newMax);
      }
    },
    [isDragging, minYear, maxYear, availableMin, availableMax],
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(null);
      onChange(minYear, maxYear);
    }
  }, [isDragging, minYear, maxYear, onChange]);

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMove, handleDragEnd]);

  // Touch event handlers
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };
    const handleTouchEnd = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, handleMove, handleDragEnd]);

  // Calculate vehicle count in selected range
  const vehicleCount = distribution
    .filter((d) => d.year >= minYear && d.year <= maxYear)
    .reduce((sum, d) => sum + d.count, 0);

  // Get bar height for a year
  const getBarHeight = (year: number) => {
    const data = distribution.find((d) => d.year === year);
    if (!data) return 0;
    return data.percentage;
  };

  // Get bar color based on percentage
  const getBarColor = (year: number, percentage: number) => {
    const isInRange = year >= minYear && year <= maxYear;
    const opacity = isInRange ? 1 : 0.3;

    if (percentage >= 75) {
      return `rgba(249, 0, 32, ${opacity})`; // Brand red for high density
    } else if (percentage >= 25) {
      return `rgba(46, 144, 250, ${opacity})`; // Blue for medium density
    } else {
      return `rgba(223, 229, 234, ${opacity})`; // Gray for low density
    }
  };

  // Generate bars for visualization
  const yearRange = availableMax - availableMin;
  const bars = Array.from({ length: yearRange + 1 }, (_, i) => {
    const year = availableMin + i;
    const height = getBarHeight(year);
    const color = getBarColor(year, height);

    return { year, height, color };
  });

  return (
    <div className="space-y-4">
      {/* Heatmap Visualization */}
      <div className="relative h-16 w-full">
        {/* Bars */}
        <div className="flex h-full items-end justify-between gap-px">
          {bars.map(({ year, height, color }) => (
            <div
              key={year}
              className="flex-1 transition-all duration-200"
              style={{
                height: `${Math.max(height, 5)}%`,
                backgroundColor: color,
                borderRadius: "2px 2px 0 0",
              }}
              title={`${year}: ${distribution.find((d) => d.year === year)?.count || 0} vehicles`}
            />
          ))}
        </div>

        {/* Year labels */}
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{availableMin}</span>
          <span>{Math.floor((availableMin + availableMax) / 2)}</span>
          <span>{availableMax}</span>
        </div>
      </div>

      {/* Slider Track */}
      <div className="relative py-4">
        <div
          ref={trackRef}
          className="relative h-2 w-full cursor-pointer rounded-full bg-gray-200"
          onClick={(e) => {
            const year = getYearFromPosition(e.clientX);
            const distToMin = Math.abs(year - minYear);
            const distToMax = Math.abs(year - maxYear);

            if (distToMin < distToMax) {
              const newMin = Math.min(year, maxYear - 1);
              setMinYear(newMin);
              onChange(newMin, maxYear);
            } else {
              const newMax = Math.max(year, minYear + 1);
              setMaxYear(newMax);
              onChange(minYear, newMax);
            }
          }}
        >
          {/* Active range highlight */}
          <div
            className="absolute h-full rounded-full bg-blue-500 transition-all duration-200"
            style={{
              left: `${getPositionPercent(minYear)}%`,
              width: `${getPositionPercent(maxYear) - getPositionPercent(minYear)}%`,
            }}
          />

          {/* Min handle */}
          <button
            type="button"
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-red-600 shadow-md transition-all hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:cursor-grabbing"
            style={{ left: `${getPositionPercent(minYear)}%` }}
            onMouseDown={() => setIsDragging("min")}
            onTouchStart={() => setIsDragging("min")}
            aria-label={`Minimum year: ${minYear}`}
            aria-valuemin={availableMin}
            aria-valuemax={maxYear - 1}
            aria-valuenow={minYear}
            role="slider"
          >
            <span className="sr-only">Minimum year</span>
          </button>

          {/* Max handle */}
          <button
            type="button"
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-red-600 shadow-md transition-all hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:cursor-grabbing"
            style={{ left: `${getPositionPercent(maxYear)}%` }}
            onMouseDown={() => setIsDragging("max")}
            onTouchStart={() => setIsDragging("max")}
            aria-label={`Maximum year: ${maxYear}`}
            aria-valuemin={minYear + 1}
            aria-valuemax={availableMax}
            aria-valuenow={maxYear}
            role="slider"
          >
            <span className="sr-only">Maximum year</span>
          </button>
        </div>

        {/* Year labels below handles */}
        <div className="relative mt-2">
          <div
            className="absolute text-sm font-medium text-gray-900"
            style={{
              left: `${getPositionPercent(minYear)}%`,
              transform: "translateX(-50%)",
            }}
          >
            {minYear}
          </div>
          <div
            className="absolute text-sm font-medium text-gray-900"
            style={{
              left: `${getPositionPercent(maxYear)}%`,
              transform: "translateX(-50%)",
            }}
          >
            {maxYear}
          </div>
        </div>
      </div>

      {/* Vehicle count */}
      <div className="text-center text-sm text-muted-foreground">
        {vehicleCount} {vehicleCount === 1 ? "vehicle" : "vehicles"} available
      </div>
    </div>
  );
}
