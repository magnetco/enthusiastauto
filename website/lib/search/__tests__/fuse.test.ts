import { describe, it, expect } from "vitest";
import {
  createVehicleFuse,
  createProductFuse,
  extractFuseResults,
  vehicleFuseConfig,
  productFuseConfig,
} from "../fuse";
import type { SearchableVehicle, SearchableProduct } from "@/types/search";

describe("Fuse.js Configuration", () => {
  describe("vehicleFuseConfig", () => {
    it("should have threshold of 0.3 for balanced precision/recall", () => {
      expect(vehicleFuseConfig.threshold).toBe(0.3);
    });

    it("should include score in results", () => {
      expect(vehicleFuseConfig.includeScore).toBe(true);
    });

    it("should configure correct field weights", () => {
      const keys = vehicleFuseConfig.keys as Array<{
        name: string;
        weight: number;
      }>;
      const weightMap = Object.fromEntries(
        keys.map((k) => [k.name, k.weight]),
      );

      expect(weightMap.listingTitle).toBe(2.0);
      expect(weightMap.chassis).toBe(1.5);
      expect(weightMap.vin).toBe(1.5);
    });
  });

  describe("productFuseConfig", () => {
    it("should have threshold of 0.3 for balanced precision/recall", () => {
      expect(productFuseConfig.threshold).toBe(0.3);
    });

    it("should configure correct field weights", () => {
      const keys = productFuseConfig.keys as Array<{
        name: string;
        weight: number;
      }>;
      const weightMap = Object.fromEntries(
        keys.map((k) => [k.name, k.weight]),
      );

      expect(weightMap.title).toBe(2.0);
      expect(weightMap.tags).toBe(1.5);
      expect(weightMap.description).toBe(1.0);
    });
  });

  describe("createVehicleFuse", () => {
    it("should create Fuse instance with sample vehicle data", () => {
      const vehicles: SearchableVehicle[] = [
        {
          _id: "1",
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
          _id: "2",
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

      const fuse = createVehicleFuse(vehicles);
      expect(fuse).toBeDefined();

      const results = fuse.search("BMW");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should find exact matches with low score", () => {
      const vehicles: SearchableVehicle[] = [
        {
          _id: "1",
          listingTitle: "2006 BMW E46 M3",
          slug: "2006-bmw-e46-m3",
          chassis: "E46",
          mileage: 50000,
          status: "current",
          inventoryStatus: "Current Inventory",
          _createdAt: "2024-01-01",
        },
      ];

      const fuse = createVehicleFuse(vehicles);
      const results = fuse.search("BMW");

      expect(results[0].score).toBeLessThan(0.1);
    });

    it("should handle fuzzy matching for partial matches (E4 -> E46)", () => {
      const vehicles: SearchableVehicle[] = [
        {
          _id: "1",
          listingTitle: "2006 BMW E46 M3",
          slug: "2006-bmw-e46-m3",
          chassis: "E46",
          mileage: 50000,
          status: "current",
          inventoryStatus: "Current Inventory",
          _createdAt: "2024-01-01",
        },
      ];

      const fuse = createVehicleFuse(vehicles);
      const results = fuse.search("E4");

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item._id).toBe("1");
    });
  });

  describe("createProductFuse", () => {
    it("should create Fuse instance with sample product data", () => {
      const products: SearchableProduct[] = [
        {
          id: "1",
          handle: "m3-carbon-spoiler",
          title: "M3 Carbon Fiber Spoiler",
          description: "High quality carbon fiber spoiler for E46 M3",
          vendor: "Performance Parts Co",
          productType: "Exterior",
          tags: "E46 M3 carbon spoiler",
          minPrice: "599.99",
          maxPrice: "599.99",
          availableForSale: true,
          updatedAt: "2024-01-01",
        },
        {
          id: "2",
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

      const fuse = createProductFuse(products);
      expect(fuse).toBeDefined();

      const results = fuse.search("brake");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should rank exact title matches higher than partial matches", () => {
      const products: SearchableProduct[] = [
        {
          id: "1",
          handle: "brake-fluid",
          title: "Brake Fluid",
          description: "DOT 4 brake fluid",
          vendor: "Fluids Inc",
          productType: "Fluids",
          tags: "fluid maintenance",
          minPrice: "19.99",
          maxPrice: "19.99",
          availableForSale: true,
          updatedAt: "2024-01-01",
        },
        {
          id: "2",
          handle: "brake-pads",
          title: "Performance Brake Pads",
          description: "Premium pads",
          vendor: "Brake Masters",
          productType: "Brakes",
          tags: "brakes performance",
          minPrice: "149.99",
          maxPrice: "149.99",
          availableForSale: true,
          updatedAt: "2024-01-02",
        },
      ];

      const fuse = createProductFuse(products);
      const results = fuse.search("Brake Fluid");

      expect(results[0].item.id).toBe("1");
      expect(results[0].score).toBeLessThan(results[1]?.score ?? 1);
    });
  });

  describe("extractFuseResults", () => {
    it("should transform Fuse results into simplified format", () => {
      const vehicles: SearchableVehicle[] = [
        {
          _id: "1",
          listingTitle: "2006 BMW E46 M3",
          slug: "2006-bmw-e46-m3",
          chassis: "E46",
          mileage: 50000,
          status: "current",
          inventoryStatus: "Current Inventory",
          _createdAt: "2024-01-01",
        },
      ];

      const fuse = createVehicleFuse(vehicles);
      const fuseResults = fuse.search("BMW");
      const extracted = extractFuseResults(fuseResults);

      expect(extracted).toHaveLength(1);
      expect(extracted[0]).toHaveProperty("item");
      expect(extracted[0]).toHaveProperty("score");
      expect(extracted[0].item._id).toBe("1");
    });

    it("should default score to 1 if not provided", () => {
      const mockResults = [
        {
          item: {
            _id: "1",
            listingTitle: "Test",
            slug: "test",
            chassis: "E46",
            mileage: 50000,
            status: "current",
            inventoryStatus: "Current Inventory",
            _createdAt: "2024-01-01",
          },
          refIndex: 0,
        },
      ];

      const extracted = extractFuseResults(mockResults);
      expect(extracted[0].score).toBe(1);
    });
  });
});
