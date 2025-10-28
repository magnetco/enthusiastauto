import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchAll, POPULAR_SEARCH_TERMS } from "../unified";

// Mock indexer
vi.mock("../indexer", () => ({
  getVehicleIndex: vi.fn(),
  getProductIndex: vi.fn(),
}));

// Mock memory cache
vi.mock("@/lib/cache/memory", () => ({
  memoryCache: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

import { getVehicleIndex, getProductIndex } from "../indexer";
import { memoryCache } from "@/lib/cache/memory";
import type { SearchableVehicle, SearchableProduct } from "@/types/search";

describe("Unified Search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockVehicles: SearchableVehicle[] = [
    {
      _id: "v1",
      listingTitle: "2006 BMW E46 M3",
      slug: "2006-bmw-e46-m3",
      chassis: "E46",
      mileage: 50000,
      listingPrice: 35000,
      status: "current",
      inventoryStatus: "Current Inventory",
      _createdAt: "2024-01-01",
    },
    {
      _id: "v2",
      listingTitle: "2003 BMW E39 M5",
      slug: "2003-bmw-e39-m5",
      chassis: "E39",
      mileage: 75000,
      listingPrice: 28000,
      status: "current",
      inventoryStatus: "Current Inventory",
      _createdAt: "2024-01-02",
    },
  ];

  const mockProducts: SearchableProduct[] = [
    {
      id: "p1",
      handle: "m3-carbon-spoiler",
      title: "M3 Carbon Fiber Spoiler",
      description: "High quality carbon fiber spoiler for E46 M3",
      vendor: "Performance Parts",
      productType: "Exterior",
      tags: "E46 M3 carbon spoiler",
      minPrice: "599.99",
      maxPrice: "599.99",
      availableForSale: true,
      updatedAt: "2024-01-01",
    },
    {
      id: "p2",
      handle: "brake-pads",
      title: "Performance Brake Pads",
      description: "Premium brake pads for BMW",
      vendor: "Brake Masters",
      productType: "Brakes",
      tags: "BMW brakes performance",
      minPrice: "149.99",
      maxPrice: "149.99",
      availableForSale: true,
      updatedAt: "2024-01-02",
    },
  ];

  describe("searchAll", () => {
    it("should return empty array for queries less than 2 characters", async () => {
      const results = await searchAll("a");
      expect(results).toEqual([]);
    });

    it("should return empty array for empty query", async () => {
      const results = await searchAll("");
      expect(results).toEqual([]);
    });

    it("should search both vehicles and products when type is 'all'", async () => {
      vi.mocked(memoryCache.get).mockReturnValue(undefined);
      vi.mocked(getVehicleIndex).mockResolvedValue(mockVehicles);
      vi.mocked(getProductIndex).mockResolvedValue(mockProducts);

      const results = await searchAll("BMW", "all");

      expect(getVehicleIndex).toHaveBeenCalled();
      expect(getProductIndex).toHaveBeenCalled();
      expect(results.length).toBeGreaterThan(0);
    });

    it("should search only vehicles when type is 'vehicles'", async () => {
      vi.mocked(memoryCache.get).mockReturnValue(undefined);
      vi.mocked(getVehicleIndex).mockResolvedValue(mockVehicles);
      vi.mocked(getProductIndex).mockResolvedValue(mockProducts);

      const results = await searchAll("BMW", "vehicles");

      expect(getVehicleIndex).toHaveBeenCalled();
      expect(getProductIndex).not.toHaveBeenCalled();
      expect(results.every((r) => r.type === "vehicle")).toBe(true);
    });

    it("should search only products when type is 'parts'", async () => {
      vi.mocked(memoryCache.get).mockReturnValue(undefined);
      vi.mocked(getVehicleIndex).mockResolvedValue(mockVehicles);
      vi.mocked(getProductIndex).mockResolvedValue(mockProducts);

      const results = await searchAll("brake", "parts");

      expect(getProductIndex).toHaveBeenCalled();
      expect(getVehicleIndex).not.toHaveBeenCalled();
      expect(results.every((r) => r.type === "product")).toBe(true);
    });

    it("should merge and sort results by score", async () => {
      vi.mocked(memoryCache.get).mockReturnValue(undefined);
      vi.mocked(getVehicleIndex).mockResolvedValue(mockVehicles);
      vi.mocked(getProductIndex).mockResolvedValue(mockProducts);

      const results = await searchAll("M3", "all");

      // Verify results are sorted by score (lower is better in Fuse.js)
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeLessThanOrEqual(results[i + 1].score);
      }
    });

    it("should respect limit parameter", async () => {
      vi.mocked(memoryCache.get).mockReturnValue(undefined);
      vi.mocked(getVehicleIndex).mockResolvedValue(mockVehicles);
      vi.mocked(getProductIndex).mockResolvedValue(mockProducts);

      const results = await searchAll("BMW", "all", 1);

      expect(results.length).toBeLessThanOrEqual(1);
    });

    it("should return cached results if available", async () => {
      const cachedResults = [
        {
          type: "vehicle" as const,
          item: mockVehicles[0],
          score: 0.1,
        },
      ];

      vi.mocked(memoryCache.get).mockReturnValue(cachedResults);

      const results = await searchAll("BMW", "all");

      expect(memoryCache.get).toHaveBeenCalled();
      expect(getVehicleIndex).not.toHaveBeenCalled();
      expect(getProductIndex).not.toHaveBeenCalled();
      expect(results).toEqual(cachedResults);
    });

    it("should cache search results after execution", async () => {
      vi.mocked(memoryCache.get).mockReturnValue(undefined);
      vi.mocked(getVehicleIndex).mockResolvedValue(mockVehicles);
      vi.mocked(getProductIndex).mockResolvedValue(mockProducts);

      await searchAll("BMW", "all");

      expect(memoryCache.set).toHaveBeenCalledWith(
        expect.stringContaining("search:results:all:bmw"),
        expect.any(Array),
        5 * 60 * 1000, // 5 minutes
      );
    });

    it("should normalize query (trim and lowercase for cache key)", async () => {
      vi.mocked(memoryCache.get).mockReturnValue(undefined);
      vi.mocked(getVehicleIndex).mockResolvedValue(mockVehicles);
      vi.mocked(getProductIndex).mockResolvedValue(mockProducts);

      await searchAll("  BMW  ", "all");

      expect(memoryCache.set).toHaveBeenCalledWith(
        expect.stringContaining("bmw"),
        expect.any(Array),
        expect.any(Number),
      );
    });

    it("should include type discrimination in results", async () => {
      vi.mocked(memoryCache.get).mockReturnValue(undefined);
      vi.mocked(getVehicleIndex).mockResolvedValue(mockVehicles);
      vi.mocked(getProductIndex).mockResolvedValue(mockProducts);

      const results = await searchAll("BMW", "all");

      results.forEach((result) => {
        expect(["vehicle", "product"]).toContain(result.type);
        expect(result).toHaveProperty("item");
        expect(result).toHaveProperty("score");
      });
    });

    it("should handle partial matching (E4 -> E46)", async () => {
      vi.mocked(memoryCache.get).mockReturnValue(undefined);
      vi.mocked(getVehicleIndex).mockResolvedValue(mockVehicles);
      vi.mocked(getProductIndex).mockResolvedValue([]);

      const results = await searchAll("E4", "all");

      // Should find E46 with partial match
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.type === "vehicle")).toBe(true);
    });

    it("should handle partial queries (M3 matches multiple items)", async () => {
      vi.mocked(memoryCache.get).mockReturnValue(undefined);
      vi.mocked(getVehicleIndex).mockResolvedValue(mockVehicles);
      vi.mocked(getProductIndex).mockResolvedValue(mockProducts);

      const results = await searchAll("M3", "all");

      // Should match both vehicle and product
      expect(results.some((r) => r.type === "vehicle")).toBe(true);
      expect(results.some((r) => r.type === "product")).toBe(true);
    });
  });

  describe("POPULAR_SEARCH_TERMS", () => {
    it("should include common BMW and automotive terms", () => {
      expect(POPULAR_SEARCH_TERMS).toContain("BMW");
      expect(POPULAR_SEARCH_TERMS).toContain("E46");
      expect(POPULAR_SEARCH_TERMS).toContain("M3");
      expect(POPULAR_SEARCH_TERMS).toContain("parts");
    });

    it("should have reasonable number of terms for cache warming", () => {
      expect(POPULAR_SEARCH_TERMS.length).toBeGreaterThan(5);
      expect(POPULAR_SEARCH_TERMS.length).toBeLessThan(20);
    });
  });
});
