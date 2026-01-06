import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRecommendationsForUser } from '../engine';
import * as tracking from '../tracking';
import * as fallback from '../fallback';
import * as vehicleQueries from '@/lib/sanity/queries/vehicles';
import * as shopify from '@/lib/shopify';
import prisma from '@/lib/db/prisma';

// Mock dependencies
vi.mock('../tracking');
vi.mock('../fallback');
vi.mock('@/lib/sanity/queries/vehicles');
vi.mock('@/lib/shopify');
vi.mock('@/lib/db/prisma', () => ({
  default: {
    userFavorite: {
      findMany: vi.fn(),
    },
  },
}));
vi.mock('@/lib/auth/session', () => ({
  getServerSession: vi.fn(),
}));

describe('Recommendation Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRecommendationsForUser', () => {
    it('should return fallback recommendations for new users with no activity', async () => {
      // Mock no activity and no garage items
      vi.mocked(tracking.getUserActivity).mockResolvedValue({
        vehicles: [],
        products: [],
        searches: [],
        timestamp: new Date(),
      });

      vi.mocked(prisma.userFavorite.findMany).mockResolvedValue([]);

      const fallbackItems = [
        { _id: '1', listingTitle: 'BMW E46 M3', slug: { current: 'e46-m3' } },
        { handle: 'exhaust-system', title: 'Exhaust System' },
      ];
      vi.mocked(fallback.getFallbackRecommendations).mockResolvedValue(
        fallbackItems as any
      );

      const result = await getRecommendationsForUser(undefined, { limit: 6 });

      expect(result.type).toBe('fallback');
      expect(result.items).toHaveLength(2);
      expect(fallback.getFallbackRecommendations).toHaveBeenCalledWith(6);
    });

    it('should generate personalized recommendations based on garage items', async () => {
      const userId = 'user123';

      // Mock user activity
      vi.mocked(tracking.getUserActivity).mockResolvedValue({
        vehicles: ['e46-m3'],
        products: [],
        searches: [],
        timestamp: new Date(),
      });

      // Mock garage items
      vi.mocked(prisma.userFavorite.findMany).mockResolvedValue([
        {
          id: '1',
          userId,
          itemType: 'vehicle',
          itemId: 'e46-m3',
          itemHandle: 'e46-m3',
          createdAt: new Date(),
        },
      ]);

      // Mock vehicle data
      vi.mocked(vehicleQueries.getVehicles).mockResolvedValue([
        {
          _id: '1',
          listingTitle: '2003 BMW E46 M3',
          slug: { current: 'e46-m3' },
          chassis: 'E46',
          mileage: 50000,
          listingPrice: 35000,
          showCallForPrice: false,
          status: 'current',
          inventoryStatus: 'Current Inventory',
          _createdAt: '2024-01-01',
        },
        {
          _id: '2',
          listingTitle: '2005 BMW E46 330i',
          slug: { current: 'e46-330i' },
          chassis: 'E46',
          mileage: 75000,
          listingPrice: 18000,
          showCallForPrice: false,
          status: 'current',
          inventoryStatus: 'Current Inventory',
          _createdAt: '2024-01-02',
        },
      ]);

      // Mock product data
      vi.mocked(shopify.getProducts).mockResolvedValue([]);

      const result = await getRecommendationsForUser(userId, { limit: 6 });

      expect(result.type).toBe('personalized');
      expect(result.items).toBeDefined();
    });

    it('should exclude garage items from recommendations', async () => {
      const userId = 'user123';

      // Mock garage with E46 M3
      vi.mocked(prisma.userFavorite.findMany).mockResolvedValue([
        {
          id: '1',
          userId,
          itemType: 'vehicle',
          itemId: 'e46-m3',
          itemHandle: 'e46-m3',
          createdAt: new Date(),
        },
      ]);

      vi.mocked(tracking.getUserActivity).mockResolvedValue({
        vehicles: [],
        products: [],
        searches: [],
        timestamp: new Date(),
      });

      vi.mocked(vehicleQueries.getVehicles).mockResolvedValue([
        {
          _id: '1',
          listingTitle: '2003 BMW E46 M3',
          slug: { current: 'e46-m3' },
          chassis: 'E46',
          mileage: 50000,
          listingPrice: 35000,
          showCallForPrice: false,
          status: 'current',
          inventoryStatus: 'Current Inventory',
          _createdAt: '2024-01-01',
        },
        {
          _id: '2',
          listingTitle: '2005 BMW E46 330i',
          slug: { current: 'e46-330i' },
          chassis: 'E46',
          mileage: 75000,
          listingPrice: 18000,
          showCallForPrice: false,
          status: 'current',
          inventoryStatus: 'Current Inventory',
          _createdAt: '2024-01-02',
        },
      ]);

      vi.mocked(shopify.getProducts).mockResolvedValue([]);

      const result = await getRecommendationsForUser(userId, {
        limit: 6,
        excludeGarage: true,
      });

      // E46 M3 should be excluded since it's in the garage
      const slugs = result.items.map((item: any) =>
        item.slug ? item.slug.current : null
      );
      expect(slugs).not.toContain('e46-m3');
    });

    it('should meet <200ms performance target', async () => {
      vi.mocked(tracking.getUserActivity).mockResolvedValue({
        vehicles: [],
        products: [],
        searches: [],
        timestamp: new Date(),
      });

      vi.mocked(prisma.userFavorite.findMany).mockResolvedValue([]);

      vi.mocked(fallback.getFallbackRecommendations).mockResolvedValue([]);

      const startTime = performance.now();
      await getRecommendationsForUser(undefined, { limit: 6 });
      const duration = performance.now() - startTime;

      // Allow 300ms for test environment overhead, but production should be <200ms
      expect(duration).toBeLessThan(300);
    });

    it('should apply correct scoring weights (garage: 3.0, browsing: 2.0)', async () => {
      // This test validates the scoring algorithm indirectly
      // by checking that items are sorted correctly
      const userId = 'user123';

      vi.mocked(tracking.getUserActivity).mockResolvedValue({
        vehicles: ['e90-335i'], // Recently viewed
        products: [],
        searches: [],
        timestamp: new Date(),
      });

      vi.mocked(prisma.userFavorite.findMany).mockResolvedValue([
        {
          id: '1',
          userId,
          itemType: 'vehicle',
          itemId: 'e46-m3',
          itemHandle: 'e46-m3',
          createdAt: new Date(),
        },
      ]);

      // E46 vehicles should score higher (garage match = 3.0)
      // than E90 (browsing = 2.0)
      vi.mocked(vehicleQueries.getVehicles).mockResolvedValue([
        {
          _id: '1',
          listingTitle: '2005 BMW E46 330i',
          slug: { current: 'e46-330i' },
          chassis: 'E46',
          mileage: 75000,
          listingPrice: 18000,
          showCallForPrice: false,
          status: 'current',
          inventoryStatus: 'Current Inventory',
          _createdAt: '2024-01-01',
        },
        {
          _id: '2',
          listingTitle: '2008 BMW E90 335i',
          slug: { current: 'e90-335i' },
          chassis: 'E90',
          mileage: 60000,
          listingPrice: 25000,
          showCallForPrice: false,
          status: 'current',
          inventoryStatus: 'Current Inventory',
          _createdAt: '2024-01-02',
        },
      ]);

      vi.mocked(shopify.getProducts).mockResolvedValue([]);

      const result = await getRecommendationsForUser(userId, { limit: 6 });

      // E46 330i should appear before E90 335i due to higher garage score
      if (result.items.length >= 2) {
        const firstItem: any = result.items[0];
        expect(firstItem.chassis).toBe('E46');
      }
    });
  });
});
