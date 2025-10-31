/**
 * Layout & Spacing Consistency Tests
 * Story 10.5: Verify standardized layout patterns across all pages
 *
 * Tests cover:
 * - Container width consistency
 * - Horizontal padding standardization
 * - Section spacing (vertical rhythm)
 * - Grid gap standardization
 * - Responsive layout patterns
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Story 10.5: Layout & Spacing Consistency', () => {
  // Helper to read file content
  const readFile = (filePath: string): string => {
    const fullPath = path.join(process.cwd(), filePath);
    return fs.readFileSync(fullPath, 'utf-8');
  };

  // Helper to check if content contains pattern
  const containsPattern = (content: string, pattern: RegExp): boolean => {
    return pattern.test(content);
  };

  describe('AC1: Container width consistency for listing pages', () => {
    const listingPages = [
      'app/vehicles/page.tsx',
      'app/search/page.tsx',
      'app/account/garage/page.tsx',
      'app/services/page.tsx',
    ];

    const listingComponents = [
      'components/shared/FeaturedVehicles.tsx',
      'components/shared/PopularParts.tsx',
    ];

    it('should use max-w-screen-2xl for all listing pages', () => {
      listingPages.forEach(pagePath => {
        const content = readFile(pagePath);
        expect(content).toMatch(/max-w-screen-2xl/);
      });
    });

    it('should use max-w-screen-2xl for homepage section components', () => {
      listingComponents.forEach(componentPath => {
        const content = readFile(componentPath);
        expect(content).toMatch(/max-w-screen-2xl/);
      });
    });

    it('should use max-w-4xl for profile page (form page)', () => {
      const content = readFile('app/account/profile/page.tsx');
      expect(content).toMatch(/max-w-4xl/);
    });

    it('should not use max-w-7xl as main container (replaced with max-w-screen-2xl)', () => {
      const allPages = [
        ...listingPages,
        'app/page.tsx',
      ];

      allPages.forEach(pagePath => {
        const content = readFile(pagePath);
        // max-w-7xl should not be used for main containers (updated to screen-2xl)
        // Note: max-w-2xl, max-w-3xl can be used for inner content width (intentional)
        const mainContainerWithMax7xl = /className="[^"]*mx-auto[^"]*max-w-7xl/;
        expect(content).not.toMatch(mainContainerWithMax7xl);
      });
    });
  });

  describe('AC2: Spacing tokens from 4px grid system', () => {
    it('should use standard padding classes that align with 4px grid', () => {
      const content = readFile('app/vehicles/page.tsx');
      // px-4 = 16px, px-6 = 24px, px-8 = 32px (all multiples of 4)
      expect(content).toMatch(/px-4/);
      expect(content).toMatch(/px-6/);
      expect(content).toMatch(/px-8/);
    });

    it('should use standard vertical spacing that aligns with 4px grid', () => {
      const content = readFile('components/shared/FeaturedVehicles.tsx');
      // py-8 = 32px, py-12 = 48px, py-16 = 64px (all multiples of 4)
      expect(content).toMatch(/py-8/);
      expect(content).toMatch(/py-12/);
      expect(content).toMatch(/py-16/);
    });

    it('should not use arbitrary spacing values', () => {
      const pages = [
        'app/vehicles/page.tsx',
        'app/search/page.tsx',
        'components/shared/FeaturedVehicles.tsx',
        'components/shared/PopularParts.tsx',
      ];

      pages.forEach(pagePath => {
        const content = readFile(pagePath);
        // Should not use non-standard values like px-5, py-7, etc
        expect(content).not.toMatch(/[pm][xy]-5(?!\d)/); // px-5, py-5 (but not px-50)
        expect(content).not.toMatch(/[pm][xy]-7(?!\d)/); // px-7, py-7
      });
    });
  });

  describe('AC3: Consistent section spacing (vertical rhythm)', () => {
    const sectionComponents = [
      'components/shared/FeaturedVehicles.tsx',
      'components/shared/PopularParts.tsx',
    ];

    it('should use progressive section spacing pattern: py-8 sm:py-12 lg:py-16', () => {
      sectionComponents.forEach(componentPath => {
        const content = readFile(componentPath);
        // Check for progressive vertical spacing
        expect(content).toMatch(/py-8/);
        expect(content).toMatch(/sm:py-12/);
        expect(content).toMatch(/lg:py-16/);
      });
    });

    it('should apply consistent vertical spacing across all pages', () => {
      const pages = [
        'app/vehicles/page.tsx',
        'app/search/page.tsx',
        'app/account/garage/page.tsx',
        'app/account/profile/page.tsx',
      ];

      pages.forEach(pagePath => {
        const content = readFile(pagePath);
        // All pages should have py-8 as base
        expect(content).toMatch(/py-8/);
      });
    });
  });

  describe('AC4: Standardized grid gaps', () => {
    it('should use gap-6 lg:gap-8 for vehicle grids', () => {
      const content = readFile('components/vehicles/VehicleGrid.tsx');
      expect(content).toMatch(/gap-6/);
      expect(content).toMatch(/lg:gap-8/);
    });

    it('should use gap-6 lg:gap-8 for featured vehicles', () => {
      const content = readFile('components/shared/FeaturedVehicles.tsx');
      expect(content).toMatch(/gap-6/);
      expect(content).toMatch(/lg:gap-8/);
    });

    it('should use gap-6 lg:gap-8 for popular parts', () => {
      const content = readFile('components/shared/PopularParts.tsx');
      expect(content).toMatch(/gap-6/);
      expect(content).toMatch(/lg:gap-8/);
    });

    it('should use gap-6 lg:gap-8 for garage item grids', () => {
      const content = readFile('app/account/garage/GarageContent.tsx');
      const matches = content.match(/gap-6/g);
      expect(matches).toBeTruthy();
      expect(matches!.length).toBeGreaterThan(0);
      expect(content).toMatch(/lg:gap-8/);
    });

    it('should use gap-6 for search results (single column)', () => {
      const content = readFile('components/search/SearchResults.tsx');
      expect(content).toMatch(/gap-6/);
    });

    it('should not use arbitrary gap values like gap-4 or gap-5', () => {
      const components = [
        'components/vehicles/VehicleGrid.tsx',
        'components/shared/FeaturedVehicles.tsx',
        'components/shared/PopularParts.tsx',
      ];

      components.forEach(componentPath => {
        const content = readFile(componentPath);
        // Should not have gap-4 in grid layouts (gap-6 is standard)
        // Allow gap-4 in other contexts, but primary grids should use gap-6
        const gridGapPattern = /grid.*gap-4(?!.*lg:gap-)/;
        expect(content).not.toMatch(gridGapPattern);
      });
    });
  });

  describe('AC5: Search page layout issues resolved', () => {
    it('should have max-width defined (was missing)', () => {
      const content = readFile('app/search/page.tsx');
      expect(content).toMatch(/max-w-screen-2xl/);
    });

    it('should have standard horizontal padding', () => {
      const content = readFile('app/search/page.tsx');
      expect(content).toMatch(/px-4/);
      expect(content).toMatch(/sm:px-6/);
      expect(content).toMatch(/lg:px-8/);
    });

    it('should have progressive vertical spacing', () => {
      const content = readFile('app/search/page.tsx');
      expect(content).toMatch(/py-8/);
      expect(content).toMatch(/sm:py-12/);
      expect(content).toMatch(/lg:py-16/);
    });

    it('should use standard grid gaps in search results', () => {
      const content = readFile('components/search/SearchResults.tsx');
      expect(content).toMatch(/gap-6/);
    });
  });

  describe('AC6: Responsive spacing scales consistently', () => {
    const pages = [
      'app/vehicles/page.tsx',
      'app/search/page.tsx',
      'app/account/garage/page.tsx',
      'app/services/page.tsx',
    ];

    it('should have mobile padding (px-4)', () => {
      pages.forEach(pagePath => {
        const content = readFile(pagePath);
        expect(content).toMatch(/px-4/);
      });
    });

    it('should have tablet padding (sm:px-6)', () => {
      pages.forEach(pagePath => {
        const content = readFile(pagePath);
        expect(content).toMatch(/sm:px-6/);
      });
    });

    it('should have desktop padding (lg:px-8)', () => {
      pages.forEach(pagePath => {
        const content = readFile(pagePath);
        expect(content).toMatch(/lg:px-8/);
      });
    });

    it('should scale vertical spacing progressively', () => {
      const components = [
        'components/shared/FeaturedVehicles.tsx',
        'components/shared/PopularParts.tsx',
      ];

      components.forEach(componentPath => {
        const content = readFile(componentPath);
        // Should have all three levels of vertical spacing
        expect(content).toMatch(/py-8/);
        expect(content).toMatch(/sm:py-12/);
        expect(content).toMatch(/lg:py-16/);
      });
    });
  });

  describe('AC7: Container alignment consistency', () => {
    it('should use consistent container classes across listing pages', () => {
      const listingPages = [
        'app/vehicles/page.tsx',
        'app/search/page.tsx',
        'app/account/garage/page.tsx',
      ];

      const expectedPattern = /mx-auto max-w-screen-2xl/;

      listingPages.forEach(pagePath => {
        const content = readFile(pagePath);
        expect(content).toMatch(expectedPattern);
      });
    });

    it('should use mx-auto for all centered containers', () => {
      const pages = [
        'app/vehicles/page.tsx',
        'app/search/page.tsx',
        'app/account/garage/page.tsx',
        'app/account/profile/page.tsx',
        'app/services/page.tsx',
      ];

      pages.forEach(pagePath => {
        const content = readFile(pagePath);
        expect(content).toMatch(/mx-auto/);
      });
    });
  });

  describe('AC8: Layout patterns documented', () => {
    it('should have Layout Patterns section in design-system.md', () => {
      const content = readFile('docs/design-system.md');
      expect(content).toMatch(/## Layout Patterns/);
    });

    it('should document container width standards', () => {
      const content = readFile('docs/design-system.md');
      expect(content).toMatch(/max-w-screen-2xl/);
      expect(content).toMatch(/max-w-4xl/);
      expect(content).toMatch(/Container Widths/);
    });

    it('should document horizontal padding pattern', () => {
      const content = readFile('docs/design-system.md');
      expect(content).toMatch(/px-4 sm:px-6 lg:px-8/);
      expect(content).toMatch(/Horizontal Padding/);
    });

    it('should document section spacing pattern', () => {
      const content = readFile('docs/design-system.md');
      expect(content).toMatch(/py-8 sm:py-12 lg:py-16/);
      expect(content).toMatch(/Section Spacing/);
    });

    it('should document grid gap pattern', () => {
      const content = readFile('docs/design-system.md');
      expect(content).toMatch(/gap-6 lg:gap-8/);
      expect(content).toMatch(/Grid Gaps/);
    });

    it('should include layout pattern examples', () => {
      const content = readFile('docs/design-system.md');
      expect(content).toMatch(/Wide Listing Page/);
      expect(content).toMatch(/Narrow Form Page/);
      expect(content).toMatch(/Section Pattern/);
    });

    it('should document intentional layout differences', () => {
      const content = readFile('docs/design-system.md');
      expect(content).toMatch(/Intentional Layout Differences/);
    });

    it('should include best practices for layouts', () => {
      const content = readFile('docs/design-system.md');
      expect(content).toMatch(/Best Practices/);
      expect(content).toMatch(/DO:/);
      expect(content).toMatch(/DON'T:/);
    });
  });

  describe('Implementation validation', () => {
    it('should have all layout changes applied to homepage fallbacks', () => {
      const content = readFile('app/page.tsx');
      // Check fallback skeleton has updated classes
      expect(content).toMatch(/max-w-screen-2xl/);
      expect(content).toMatch(/px-4.*py-8.*sm:px-6.*sm:py-12.*lg:px-8.*lg:py-16/);
      expect(content).toMatch(/gap-6.*lg:gap-8/);
    });

    it('should not have legacy non-standard padding in components', () => {
      const components = [
        'components/shared/FeaturedVehicles.tsx',
        'components/shared/PopularParts.tsx',
      ];

      components.forEach(componentPath => {
        const content = readFile(componentPath);
        // Should not have px-5 (was legacy non-standard)
        expect(content).not.toMatch(/px-5(?!\d)/);
      });
    });

    it('should have vehicles page updated from max-w-7xl to max-w-screen-2xl', () => {
      const content = readFile('app/vehicles/page.tsx');
      expect(content).toMatch(/max-w-screen-2xl/);
      expect(content).not.toMatch(/max-w-7xl/);
    });

    it('should have garage page updated to max-w-screen-2xl (was max-w-7xl)', () => {
      const content = readFile('app/account/garage/page.tsx');
      expect(content).toMatch(/max-w-screen-2xl/);
      expect(content).not.toMatch(/max-w-7xl/);
    });

    it('should have all search components using gap-6', () => {
      const searchComponents = [
        'components/search/SearchResults.tsx',
        'components/search/SearchEmptyState.tsx',
        'components/search/SearchResultsSkeleton.tsx',
      ];

      searchComponents.forEach(componentPath => {
        const content = readFile(componentPath);
        expect(content).toMatch(/gap-6/);
      });
    });
  });
});
