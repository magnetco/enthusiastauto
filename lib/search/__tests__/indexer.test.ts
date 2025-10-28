import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  transformVehicleToSearchable,
  transformProductToSearchable,
  buildVehicleIndex,
  buildProductIndex,
  getVehicleIndex,
  getProductIndex,
  refreshVehicleIndex,
  refreshProductIndex,
} from "../indexer";
import type { VehicleListItem } from "@/lib/sanity/queries/vehicles";
import type { Product } from "@/lib/shopify/types";

// Mock Sanity client
vi.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: vi.fn(),
  },
}));

// Mock Shopify client
vi.mock("@/lib/shopify", () => ({
  getProducts: vi.fn(),
}));

// Mock memory cache
vi.mock("@/lib/cache/memory", () => ({
  memoryCache: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  },
}));

import { client } from "@/sanity/lib/client";
import { getProducts } from "@/lib/shopify";
import { memoryCache } from "@/lib/cache/memory";

describe("Search Indexer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("transformVehicleToSearchable", () => {
    it("should transform VehicleListItem to SearchableVehicle", () => {
      const vehicle: VehicleListItem = {
        _id: "v1",
        listingTitle: "2006 BMW E46 M3",
        slug: { current: "2006-bmw-e46-m3" },
        chassis: "E46",
        mileage: 50000,
        listingPrice: 35000,
        showCallForPrice: false,
        status: "current",
        inventoryStatus: "Current Inventory",
        _createdAt: "2024-01-01",
      };

      const searchable = transformVehicleToSearchable(vehicle);

      expect(searchable._id).toBe("v1");
      expect(searchable.listingTitle).toBe("2006 BMW E46 M3");
      expect(searchable.slug).toBe("2006-bmw-e46-m3");
      expect(searchable.chassis).toBe("E46");
    });

    it("should flatten nested slug object", () => {
      const vehicle: VehicleListItem = {
        _id: "v1",
        listingTitle: "2006 BMW E46 M3",
        slug: { current: "test-slug" },
        chassis: "E46",
        mileage: 50000,
        status: "current",
        inventoryStatus: "Current Inventory",
        showCallForPrice: false,
        _createdAt: "2024-01-01",
      };

      const searchable = transformVehicleToSearchable(vehicle);
      expect(searchable.slug).toBe("test-slug");
    });
  });

  describe("transformProductToSearchable", () => {
    it("should transform Product to SearchableProduct", () => {
      const product: Product = {
        id: "p1",
        handle: "brake-pads",
        title: "Performance Brake Pads",
        description: "Premium brake pads",
        vendor: "Brake Masters",
        productType: "Brakes",
        tags: ["BMW", "performance", "brakes"],
        priceRange: {
          minVariantPrice: { amount: "149.99", currencyCode: "USD" },
          maxVariantPrice: { amount: "149.99", currencyCode: "USD" },
        },
        availableForSale: true,
        updatedAt: "2024-01-01",
        descriptionHtml: "<p>Premium brake pads</p>",
        options: [],
        variants: [],
        images: [],
        featuredImage: {
          url: "https://example.com/image.jpg",
          altText: "Brake Pads",
          width: 800,
          height: 600,
        },
        seo: {
          title: "Performance Brake Pads",
          description: "Premium brake pads",
        },
      };

      const searchable = transformProductToSearchable(product);

      expect(searchable.id).toBe("p1");
      expect(searchable.title).toBe("Performance Brake Pads");
      expect(searchable.handle).toBe("brake-pads");
      expect(searchable.tags).toBe("BMW performance brakes");
      expect(searchable.minPrice).toBe("149.99");
      expect(searchable.maxPrice).toBe("149.99");
    });

    it("should concatenate tags into searchable string", () => {
      const product: Product = {
        id: "p1",
        handle: "test",
        title: "Test Product",
        description: "Test",
        vendor: "Test Vendor",
        productType: "Test Type",
        tags: ["tag1", "tag2", "tag3"],
        priceRange: {
          minVariantPrice: { amount: "100", currencyCode: "USD" },
          maxVariantPrice: { amount: "200", currencyCode: "USD" },
        },
        availableForSale: true,
        updatedAt: "2024-01-01",
        descriptionHtml: "<p>Test</p>",
        options: [],
        variants: [],
        images: [],
        featuredImage: {
          url: "https://example.com/image.jpg",
          altText: "Test",
          width: 800,
          height: 600,
        },
        seo: { title: "Test", description: "Test" },
      };

      const searchable = transformProductToSearchable(product);
      expect(searchable.tags).toBe("tag1 tag2 tag3");
    });
  });

  describe("buildVehicleIndex", () => {
    it("should fetch vehicles from Sanity and transform them", async () => {
      const mockVehicles: VehicleListItem[] = [
        {
          _id: "v1",
          listingTitle: "2006 BMW E46 M3",
          slug: { current: "2006-bmw-e46-m3" },
          chassis: "E46",
          mileage: 50000,
          showCallForPrice: false,
          status: "current",
          inventoryStatus: "Current Inventory",
          _createdAt: "2024-01-01",
        },
      ];

      vi.mocked(client.fetch).mockResolvedValue(mockVehicles);

      const index = await buildVehicleIndex();

      expect(client.fetch).toHaveBeenCalled();
      expect(index).toHaveLength(1);
      expect(index[0]._id).toBe("v1");
      expect(index[0].slug).toBe("2006-bmw-e46-m3");
    });

    it("should return empty array on error", async () => {
      vi.mocked(client.fetch).mockRejectedValue(new Error("Fetch failed"));

      const index = await buildVehicleIndex();

      expect(index).toEqual([]);
    });
  });

  describe("buildProductIndex", () => {
    it("should fetch products from Shopify and transform them", async () => {
      const mockProducts: Product[] = [
        {
          id: "p1",
          handle: "brake-pads",
          title: "Performance Brake Pads",
          description: "Premium brake pads",
          vendor: "Brake Masters",
          productType: "Brakes",
          tags: ["BMW"],
          priceRange: {
            minVariantPrice: { amount: "149.99", currencyCode: "USD" },
            maxVariantPrice: { amount: "149.99", currencyCode: "USD" },
          },
          availableForSale: true,
          updatedAt: "2024-01-01",
          descriptionHtml: "<p>Premium brake pads</p>",
          options: [],
          variants: [],
          images: [],
          featuredImage: {
            url: "https://example.com/image.jpg",
            altText: "Brake Pads",
            width: 800,
            height: 600,
          },
          seo: { title: "Brake Pads", description: "Premium" },
        },
      ];

      vi.mocked(getProducts).mockResolvedValue(mockProducts);

      const index = await buildProductIndex();

      expect(getProducts).toHaveBeenCalledWith({});
      expect(index).toHaveLength(1);
      expect(index[0].id).toBe("p1");
    });

    it("should return empty array on error", async () => {
      vi.mocked(getProducts).mockRejectedValue(new Error("Fetch failed"));

      const index = await buildProductIndex();

      expect(index).toEqual([]);
    });
  });

  describe("getVehicleIndex", () => {
    it("should return cached index if available", async () => {
      const mockIndex = [
        {
          _id: "v1",
          listingTitle: "Cached Vehicle",
          slug: "cached",
          chassis: "E46",
          mileage: 50000,
          status: "current",
          inventoryStatus: "Current Inventory",
          _createdAt: "2024-01-01",
        },
      ];

      vi.mocked(memoryCache.get).mockReturnValue(mockIndex);

      const index = await getVehicleIndex();

      expect(memoryCache.get).toHaveBeenCalledWith("search:vehicles:index");
      expect(client.fetch).not.toHaveBeenCalled();
      expect(index).toEqual(mockIndex);
    });

    it("should build fresh index if cache miss", async () => {
      const mockVehicles: VehicleListItem[] = [
        {
          _id: "v1",
          listingTitle: "Fresh Vehicle",
          slug: { current: "fresh" },
          chassis: "E46",
          mileage: 50000,
          showCallForPrice: false,
          status: "current",
          inventoryStatus: "Current Inventory",
          _createdAt: "2024-01-01",
        },
      ];

      vi.mocked(memoryCache.get).mockReturnValue(undefined);
      vi.mocked(client.fetch).mockResolvedValue(mockVehicles);

      const index = await getVehicleIndex();

      expect(client.fetch).toHaveBeenCalled();
      expect(memoryCache.set).toHaveBeenCalledWith(
        "search:vehicles:index",
        expect.any(Array),
        15 * 60 * 1000, // 15 minutes
      );
      expect(index).toHaveLength(1);
    });
  });

  describe("getProductIndex", () => {
    it("should return cached index if available", async () => {
      const mockIndex = [
        {
          id: "p1",
          handle: "cached-product",
          title: "Cached Product",
          description: "Cached",
          vendor: "Vendor",
          productType: "Type",
          tags: "tags",
          minPrice: "100",
          maxPrice: "100",
          availableForSale: true,
          updatedAt: "2024-01-01",
        },
      ];

      vi.mocked(memoryCache.get).mockReturnValue(mockIndex);

      const index = await getProductIndex();

      expect(memoryCache.get).toHaveBeenCalledWith("search:products:index");
      expect(getProducts).not.toHaveBeenCalled();
      expect(index).toEqual(mockIndex);
    });
  });

  describe("refreshVehicleIndex", () => {
    it("should rebuild and cache vehicle index", async () => {
      const mockVehicles: VehicleListItem[] = [
        {
          _id: "v1",
          listingTitle: "Refreshed Vehicle",
          slug: { current: "refreshed" },
          chassis: "E46",
          mileage: 50000,
          showCallForPrice: false,
          status: "current",
          inventoryStatus: "Current Inventory",
          _createdAt: "2024-01-01",
        },
      ];

      vi.mocked(client.fetch).mockResolvedValue(mockVehicles);

      await refreshVehicleIndex();

      expect(client.fetch).toHaveBeenCalled();
      expect(memoryCache.set).toHaveBeenCalledWith(
        "search:vehicles:index",
        expect.any(Array),
        15 * 60 * 1000,
      );
    });
  });

  describe("refreshProductIndex", () => {
    it("should rebuild and cache product index", async () => {
      const mockProducts: Product[] = [];
      vi.mocked(getProducts).mockResolvedValue(mockProducts);

      await refreshProductIndex();

      expect(getProducts).toHaveBeenCalled();
      expect(memoryCache.set).toHaveBeenCalledWith(
        "search:products:index",
        expect.any(Array),
        15 * 60 * 1000,
      );
    });
  });
});
