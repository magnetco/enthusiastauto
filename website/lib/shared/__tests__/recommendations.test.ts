import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parseFitmentTag,
  extractYearFromTitle,
  extractModelsFromTags,
  getCompatibleParts,
  getVehiclesWithPart,
} from "../recommendations";
import type { VehicleDetail } from "@/lib/sanity/queries/vehicles";

// Mock dependencies
vi.mock("@/lib/shopify", () => ({
  shopifyFetch: vi.fn(),
}));

vi.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: vi.fn(),
  },
}));

vi.mock("@/lib/cache/memory", () => ({
  memoryCache: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

describe("Fitment Tag Parsing", () => {
  describe("parseFitmentTag", () => {
    it("should parse model and year range correctly", () => {
      const result = parseFitmentTag("BMW E46 2001-2006");
      expect(result).toEqual({
        model: "E46",
        yearMin: 2001,
        yearMax: 2006,
        isUniversal: false,
      });
    });

    it("should parse model-only tags", () => {
      const result = parseFitmentTag("BMW E46");
      expect(result).toEqual({
        model: "E46",
        isUniversal: false,
      });
    });

    it("should parse model with single year", () => {
      const result = parseFitmentTag("BMW E90 2008");
      expect(result).toEqual({
        model: "E90",
        yearMin: 2008,
        yearMax: 2008,
        isUniversal: false,
      });
    });

    it("should identify universal fit tags", () => {
      const result = parseFitmentTag("BMW Universal");
      expect(result).toEqual({
        isUniversal: true,
      });
    });

    it("should handle case-insensitive tags", () => {
      const result = parseFitmentTag("bmw e46 2001-2006");
      expect(result.model).toBe("E46");
    });

    it("should handle F-series models", () => {
      const result = parseFitmentTag("BMW F30 2012-2019");
      expect(result).toEqual({
        model: "F30",
        yearMin: 2012,
        yearMax: 2019,
        isUniversal: false,
      });
    });

    it("should handle G-series models", () => {
      const result = parseFitmentTag("BMW G20 2019-2023");
      expect(result).toEqual({
        model: "G20",
        yearMin: 2019,
        yearMax: 2023,
        isUniversal: false,
      });
    });

    it("should return empty object for malformed tags", () => {
      const result = parseFitmentTag("Random Text");
      expect(result).toEqual({
        model: undefined,
        isUniversal: false,
      });
    });
  });

  describe("extractYearFromTitle", () => {
    it("should extract year from vehicle listing title", () => {
      expect(extractYearFromTitle("2003 BMW E46 M3")).toBe(2003);
      expect(extractYearFromTitle("1999 BMW E36 328i")).toBe(1999);
      expect(extractYearFromTitle("2019 BMW F90 M5")).toBe(2019);
    });

    it("should return undefined if no year found", () => {
      expect(extractYearFromTitle("BMW E46 M3")).toBeUndefined();
      expect(extractYearFromTitle("No year here")).toBeUndefined();
    });
  });

  describe("extractModelsFromTags", () => {
    it("should extract unique models from product tags", () => {
      const tags = [
        "BMW E46 2001-2006",
        "BMW E46",
        "BMW E90 2005-2012",
        "BMW Universal",
        "OEM",
      ];
      const models = extractModelsFromTags(tags);
      expect(models).toEqual(["E46", "E90"]);
    });

    it("should handle empty tag array", () => {
      const models = extractModelsFromTags([]);
      expect(models).toEqual([]);
    });

    it("should deduplicate models", () => {
      const tags = ["BMW E46 2001-2003", "BMW E46 2004-2006", "BMW E46"];
      const models = extractModelsFromTags(tags);
      expect(models).toEqual(["E46"]);
    });

    it("should skip universal and non-model tags", () => {
      const tags = ["BMW Universal", "OEM", "Performance", "New"];
      const models = extractModelsFromTags(tags);
      expect(models).toEqual([]);
    });
  });
});

describe("getCompatibleParts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and rank products by fitment relevance", async () => {
    const mockVehicle: VehicleDetail = {
      _id: "v1",
      listingTitle: "2003 BMW E46 M3",
      slug: { current: "2003-bmw-e46-m3" },
      stockNumber: "123",
      chassis: "E46",
      mileage: 50000,
      bodyStyle: "Coupe",
      drive: "RWD",
      exteriorColor: "Silver",
      interiorColor: "Black",
      listingPrice: 45000,
      showCallForPrice: false,
      status: "current",
      inventoryStatus: "Current Inventory",
      isLive: true,
      featuredVehicle: false,
      featuredInventory: false,
      engineCodes: "S54",
      engineType: "Inline-6",
      engineSize: "3.2L",
      transmission: "6-Speed Manual",
      _createdAt: "2025-01-01",
    };

    const mockShopifyResponse = {
      status: 200,
      body: {
        data: {
          products: {
            edges: [
              {
                node: {
                  id: "p1",
                  handle: "brake-pads-e46",
                  availableForSale: true,
                  title: "Performance Brake Pads",
                  description: "High-performance brake pads",
                  descriptionHtml: "<p>High-performance brake pads</p>",
                  vendor: "BMW Performance",
                  productType: "Brakes",
                  priceRange: {
                    minVariantPrice: { amount: "199.99", currencyCode: "USD" },
                    maxVariantPrice: { amount: "199.99", currencyCode: "USD" },
                  },
                  featuredImage: {
                    url: "https://example.com/image.jpg",
                    altText: "Brake Pads",
                    width: 800,
                    height: 800,
                  },
                  tags: ["BMW E46 2001-2006", "Brakes"],
                  updatedAt: "2025-01-01",
                },
              },
              {
                node: {
                  id: "p2",
                  handle: "air-filter-universal",
                  availableForSale: true,
                  title: "Universal Air Filter",
                  description: "Universal fit air filter",
                  descriptionHtml: "<p>Universal fit air filter</p>",
                  vendor: "K&N",
                  productType: "Filters",
                  priceRange: {
                    minVariantPrice: { amount: "49.99", currencyCode: "USD" },
                    maxVariantPrice: { amount: "49.99", currencyCode: "USD" },
                  },
                  featuredImage: {
                    url: "https://example.com/filter.jpg",
                    altText: "Air Filter",
                    width: 800,
                    height: 800,
                  },
                  tags: ["BMW Universal", "Filters"],
                  updatedAt: "2025-01-01",
                },
              },
            ],
          },
        },
      },
    };

    const { shopifyFetch } = await import("@/lib/shopify");
    const { memoryCache } = await import("@/lib/cache/memory");

    vi.mocked(memoryCache.get).mockReturnValue(undefined);
    vi.mocked(shopifyFetch).mockResolvedValue(mockShopifyResponse);

    const products = await getCompatibleParts(mockVehicle);

    // Should return both products, with exact match ranked higher
    expect(products).toHaveLength(2);
    expect(products[0].title).toBe("Performance Brake Pads"); // Exact match should be first
    expect(products[1].title).toBe("Universal Air Filter"); // Universal should be second

    // Verify cache was called
    expect(memoryCache.set).toHaveBeenCalledWith(
      "compatible-parts:2003-bmw-e46-m3",
      expect.any(Array),
      300000,
    );
  });

  it("should limit results to 6 products", async () => {
    const mockVehicle: VehicleDetail = {
      _id: "v1",
      listingTitle: "2003 BMW E46 M3",
      slug: { current: "2003-bmw-e46-m3" },
      stockNumber: "123",
      chassis: "E46",
      mileage: 50000,
      bodyStyle: "Coupe",
      drive: "RWD",
      exteriorColor: "Silver",
      interiorColor: "Black",
      showCallForPrice: false,
      status: "current",
      inventoryStatus: "Current Inventory",
      isLive: true,
      featuredVehicle: false,
      featuredInventory: false,
      engineCodes: "S54",
      engineType: "Inline-6",
      engineSize: "3.2L",
      transmission: "6-Speed Manual",
      _createdAt: "2025-01-01",
    };

    // Create 10 mock products
    const mockProducts = Array.from({ length: 10 }, (_, i) => ({
      node: {
        id: `p${i}`,
        handle: `product-${i}`,
        availableForSale: true,
        title: `Product ${i}`,
        description: `Description ${i}`,
        descriptionHtml: `<p>Description ${i}</p>`,
        vendor: "BMW",
        productType: "Parts",
        priceRange: {
          minVariantPrice: { amount: "100.00", currencyCode: "USD" },
          maxVariantPrice: { amount: "100.00", currencyCode: "USD" },
        },
        featuredImage: {
          url: "https://example.com/image.jpg",
          altText: "Product",
          width: 800,
          height: 800,
        },
        tags: ["BMW E46"],
        updatedAt: "2025-01-01",
      },
    }));

    const mockResponse = {
      status: 200,
      body: { data: { products: { edges: mockProducts } } },
    };

    const { shopifyFetch } = await import("@/lib/shopify");
    const { memoryCache } = await import("@/lib/cache/memory");

    vi.mocked(memoryCache.get).mockReturnValue(undefined);
    vi.mocked(shopifyFetch).mockResolvedValue(mockResponse);

    const products = await getCompatibleParts(mockVehicle);

    // Should limit to 6 products
    expect(products).toHaveLength(6);
  });

  it("should return cached results if available", async () => {
    const mockVehicle: VehicleDetail = {
      _id: "v1",
      listingTitle: "2003 BMW E46 M3",
      slug: { current: "2003-bmw-e46-m3" },
      stockNumber: "123",
      chassis: "E46",
      mileage: 50000,
      bodyStyle: "Coupe",
      drive: "RWD",
      exteriorColor: "Silver",
      interiorColor: "Black",
      showCallForPrice: false,
      status: "current",
      inventoryStatus: "Current Inventory",
      isLive: true,
      featuredVehicle: false,
      featuredInventory: false,
      engineCodes: "S54",
      engineType: "Inline-6",
      engineSize: "3.2L",
      transmission: "6-Speed Manual",
      _createdAt: "2025-01-01",
    };

    const cachedProducts = [
      {
        id: "cached1",
        handle: "cached-product",
        title: "Cached Product",
        vendor: "BMW",
      },
    ];

    const { memoryCache } = await import("@/lib/cache/memory");
    const { shopifyFetch } = await import("@/lib/shopify");

    vi.mocked(memoryCache.get).mockReturnValue(cachedProducts);

    const products = await getCompatibleParts(mockVehicle);

    // Should return cached data
    expect(products).toEqual(cachedProducts);
    // Should not call Shopify API
    expect(shopifyFetch).not.toHaveBeenCalled();
  });

  it("should handle errors gracefully and return empty array", async () => {
    const mockVehicle: VehicleDetail = {
      _id: "v1",
      listingTitle: "2003 BMW E46 M3",
      slug: { current: "2003-bmw-e46-m3" },
      stockNumber: "123",
      chassis: "E46",
      mileage: 50000,
      bodyStyle: "Coupe",
      drive: "RWD",
      exteriorColor: "Silver",
      interiorColor: "Black",
      showCallForPrice: false,
      status: "current",
      inventoryStatus: "Current Inventory",
      isLive: true,
      featuredVehicle: false,
      featuredInventory: false,
      engineCodes: "S54",
      engineType: "Inline-6",
      engineSize: "3.2L",
      transmission: "6-Speed Manual",
      _createdAt: "2025-01-01",
    };

    const { shopifyFetch } = await import("@/lib/shopify");
    const { memoryCache } = await import("@/lib/cache/memory");

    vi.mocked(memoryCache.get).mockReturnValue(undefined);
    vi.mocked(shopifyFetch).mockRejectedValue(new Error("API Error"));

    const products = await getCompatibleParts(mockVehicle);

    expect(products).toEqual([]);
  });
});

describe("getVehiclesWithPart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch vehicles matching product fitment tags", async () => {
    const productTags = ["BMW E46 2001-2006", "Brakes", "Performance"];
    const productHandle = "brake-pads-e46";

    const mockVehicles = [
      {
        _id: "v1",
        listingTitle: "2003 BMW E46 M3",
        slug: { current: "2003-bmw-e46-m3" },
        chassis: "E46",
        mileage: 50000,
        listingPrice: 45000,
        showCallForPrice: false,
        status: "current" as const,
        inventoryStatus: "Current Inventory" as const,
        signatureShot: null,
        soldShot: null,
        _createdAt: "2025-01-01",
      },
    ];

    const { client } = await import("@/sanity/lib/client");
    const { memoryCache } = await import("@/lib/cache/memory");

    vi.mocked(memoryCache.get).mockReturnValue(undefined);
    vi.mocked(client.fetch).mockResolvedValue(mockVehicles);

    const vehicles = await getVehiclesWithPart(productHandle, productTags);

    expect(vehicles).toEqual(mockVehicles);
    expect(client.fetch).toHaveBeenCalledWith(
      expect.stringContaining("chassis in $models"),
      { models: ["E46"] },
    );
    expect(memoryCache.set).toHaveBeenCalledWith(
      "vehicles-with-part:brake-pads-e46",
      mockVehicles,
      300000,
    );
  });

  it("should return empty array if no models found in tags", async () => {
    const productTags = ["Universal", "OEM", "Performance"];
    const productHandle = "universal-part";

    const { memoryCache } = await import("@/lib/cache/memory");

    vi.mocked(memoryCache.get).mockReturnValue(undefined);

    const vehicles = await getVehiclesWithPart(productHandle, productTags);

    expect(vehicles).toEqual([]);
  });

  it("should return cached results if available", async () => {
    const productTags = ["BMW E46"];
    const productHandle = "brake-pads-e46";

    const cachedVehicles = [
      {
        _id: "v1",
        listingTitle: "Cached Vehicle",
        chassis: "E46",
      },
    ];

    const { memoryCache } = await import("@/lib/cache/memory");
    const { client } = await import("@/sanity/lib/client");

    vi.mocked(memoryCache.get).mockReturnValue(cachedVehicles);

    const vehicles = await getVehiclesWithPart(productHandle, productTags);

    expect(vehicles).toEqual(cachedVehicles);
    expect(client.fetch).not.toHaveBeenCalled();
  });

  it("should handle errors gracefully and return empty array", async () => {
    const productTags = ["BMW E46"];
    const productHandle = "brake-pads-e46";

    const { client } = await import("@/sanity/lib/client");
    const { memoryCache } = await import("@/lib/cache/memory");

    vi.mocked(memoryCache.get).mockReturnValue(undefined);
    vi.mocked(client.fetch).mockRejectedValue(new Error("API Error"));

    const vehicles = await getVehiclesWithPart(productHandle, productTags);

    expect(vehicles).toEqual([]);
  });

  it("should extract multiple models from tags", async () => {
    const productTags = ["BMW E46 2001-2006", "BMW E90 2005-2012", "OEM"];
    const productHandle = "universal-brake-pads";

    const { client } = await import("@/sanity/lib/client");
    const { memoryCache } = await import("@/lib/cache/memory");

    vi.mocked(memoryCache.get).mockReturnValue(undefined);
    vi.mocked(client.fetch).mockResolvedValue([]);

    await getVehiclesWithPart(productHandle, productTags);

    expect(client.fetch).toHaveBeenCalledWith(expect.any(String), {
      models: expect.arrayContaining(["E46", "E90"]),
    });
  });
});
