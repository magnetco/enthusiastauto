import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";

// Mock unified search
vi.mock("@/lib/search/unified", () => ({
  searchAll: vi.fn(),
}));

import { searchAll } from "@/lib/search/unified";

describe("Search API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createRequest(url: string): NextRequest {
    return new NextRequest(new URL(url, "http://localhost:3000"));
  }

  describe("GET /api/search", () => {
    it("should return 400 if query parameter is missing", async () => {
      const request = createRequest("/api/search");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing query parameter");
    });

    it("should return 400 if query is less than 2 characters", async () => {
      const request = createRequest("/api/search?q=a");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid query");
      expect(data.message).toContain("at least 2 characters");
    });

    it("should return 400 if query exceeds 100 characters", async () => {
      const longQuery = "a".repeat(101);
      const request = createRequest(`/api/search?q=${longQuery}`);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid query");
      expect(data.message).toContain("must not exceed 100 characters");
    });

    it("should return 400 if type parameter is invalid", async () => {
      const request = createRequest("/api/search?q=BMW&type=invalid");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid type parameter");
    });

    it("should return 400 if limit is not a positive integer", async () => {
      const request = createRequest("/api/search?q=BMW&limit=-5");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid limit parameter");
    });

    it("should accept valid query and return search results", async () => {
      const mockResults = [
        {
          type: "vehicle" as const,
          item: {
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
          },
          score: 0.1,
        },
      ];

      vi.mocked(searchAll).mockResolvedValue(mockResults);

      const request = createRequest("/api/search?q=BMW");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("results");
      expect(data).toHaveProperty("totalResults");
      expect(data).toHaveProperty("searchTime");
      expect(data.results).toEqual(mockResults);
      expect(data.totalResults).toBe(1);
    });

    it("should use default type 'all' if not specified", async () => {
      vi.mocked(searchAll).mockResolvedValue([]);

      const request = createRequest("/api/search?q=BMW");
      await GET(request);

      expect(searchAll).toHaveBeenCalledWith("BMW", "all", 20);
    });

    it("should use specified type parameter", async () => {
      vi.mocked(searchAll).mockResolvedValue([]);

      const request = createRequest("/api/search?q=BMW&type=vehicles");
      await GET(request);

      expect(searchAll).toHaveBeenCalledWith("BMW", "vehicles", 20);
    });

    it("should use default limit of 20 if not specified", async () => {
      vi.mocked(searchAll).mockResolvedValue([]);

      const request = createRequest("/api/search?q=BMW");
      await GET(request);

      expect(searchAll).toHaveBeenCalledWith("BMW", "all", 20);
    });

    it("should respect custom limit parameter", async () => {
      vi.mocked(searchAll).mockResolvedValue([]);

      const request = createRequest("/api/search?q=BMW&limit=5");
      await GET(request);

      expect(searchAll).toHaveBeenCalledWith("BMW", "all", 5);
    });

    it("should cap limit at 100", async () => {
      vi.mocked(searchAll).mockResolvedValue([]);

      const request = createRequest("/api/search?q=BMW&limit=200");
      await GET(request);

      expect(searchAll).toHaveBeenCalledWith("BMW", "all", 100);
    });

    it("should return cache headers in response", async () => {
      vi.mocked(searchAll).mockResolvedValue([]);

      const request = createRequest("/api/search?q=BMW");
      const response = await GET(request);

      const cacheControl = response.headers.get("Cache-Control");
      expect(cacheControl).toContain("public");
      expect(cacheControl).toContain("max-age=300");
    });

    it("should trim whitespace from query", async () => {
      vi.mocked(searchAll).mockResolvedValue([]);

      const request = createRequest("/api/search?q=%20%20BMW%20%20");
      await GET(request);

      expect(searchAll).toHaveBeenCalledWith("BMW", "all", 20);
    });

    it("should return 500 on internal error", async () => {
      vi.mocked(searchAll).mockRejectedValue(new Error("Search failed"));

      const request = createRequest("/api/search?q=BMW");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });

    it("should include searchTime in response", async () => {
      vi.mocked(searchAll).mockResolvedValue([]);

      const request = createRequest("/api/search?q=BMW");
      const response = await GET(request);
      const data = await response.json();

      expect(data.searchTime).toBeGreaterThanOrEqual(0);
      expect(typeof data.searchTime).toBe("number");
    });

    it("should return totalResults matching results length", async () => {
      const mockResults = [
        {
          type: "vehicle" as const,
          item: {} as any,
          score: 0.1,
        },
        {
          type: "product" as const,
          item: {} as any,
          score: 0.2,
        },
      ];

      vi.mocked(searchAll).mockResolvedValue(mockResults);

      const request = createRequest("/api/search?q=BMW");
      const response = await GET(request);
      const data = await response.json();

      expect(data.totalResults).toBe(2);
    });

    // Note: Rate limiting tests are challenging in unit tests due to shared state
    // In production, rate limiting would be tested via integration/E2E tests
  });
});
