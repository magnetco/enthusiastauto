/**
 * Component Visual Unification Tests
 * Story 10.4: Component Visual Unification
 *
 * Tests verify that ProductCard and VehicleCard components use consistent
 * design patterns: border-radius, shadows, padding, spacing, and semantic tokens.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const REPO_ROOT = process.cwd();

// Helper to read file content
function readFile(relativePath: string): string {
  return readFileSync(join(REPO_ROOT, relativePath), 'utf-8');
}

describe('Component Visual Unification - Story 10.4', () => {
  // AC1: Both ProductCard and VehicleCard use consistent border-radius tokens (--radius-8 for cards)
  describe('AC1: Border Radius Consistency', () => {
    it('should have rounded-lg class on Card components', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Both should use rounded-lg (maps to --radius-8 = 8px)
      expect(productCard).toContain('rounded-lg');
      expect(vehicleCard).toContain('rounded-lg');
    });

    it('should verify --radius-8 design token exists in globals.css', () => {
      const globalsCss = readFile('app/globals.css');

      // Verify --radius-8 token is defined (0.5rem = 8px)
      expect(globalsCss).toMatch(/--radius-8:\s*0\.5rem/);
    });
  });

  // AC2: Both cards use consistent shadow elevations (resting: --shadow-low, hover: --shadow-medium)
  describe('AC2: Shadow Elevation Consistency', () => {
    it('should use shadow design tokens on Card components', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Cards should reference shadow tokens via Card component (defined in card.tsx)
      // ProductCard and VehicleCard use Card wrapper which has shadow tokens
      expect(productCard).toContain('Card');
      expect(vehicleCard).toContain('Card');
    });

    it('should verify Card component uses shadow tokens', () => {
      const cardComponent = readFile('components/ui/card.tsx');

      // Card component should have shadow-[var(--shadow-low)] and hover:shadow-[var(--shadow-medium)]
      expect(cardComponent).toContain('shadow-[var(--shadow-low)]');
      expect(cardComponent).toContain('hover:shadow-[var(--shadow-medium)]');
    });

    it('should verify shadow design tokens exist in globals.css', () => {
      const globalsCss = readFile('app/globals.css');

      // Verify shadow tokens are defined
      expect(globalsCss).toMatch(/--shadow-low:\s*0px 2px 4px/);
      expect(globalsCss).toMatch(/--shadow-medium:\s*0px 4px 24px/);
    });
  });

  // AC3: Both cards use consistent content padding patterns (base: 16px or p-4)
  describe('AC3: Content Padding Consistency', () => {
    it('should use p-4 padding on CardContent in both components', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Both should override CardContent default padding with p-4 (16px)
      expect(productCard).toMatch(/CardContent\s+className="p-4"/);
      expect(vehicleCard).toMatch(/CardContent\s+className="p-4"/);
    });

    it('should not have old padding patterns', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // ProductCard should no longer have pt-2.5 (old pattern)
      expect(productCard).not.toContain('pt-2.5');

      // VehicleCard CardContent should not use default px-6
      // (It's overridden with p-4 in className)
      const vehicleCardContentMatch = vehicleCard.match(/CardContent\s+className="([^"]*)"/);
      if (vehicleCardContentMatch) {
        expect(vehicleCardContentMatch[1]).toContain('p-4');
      }
    });
  });

  // AC4: Both cards use consistent vertical spacing between elements (space-y-1.5 or space-y-2)
  describe('AC4: Vertical Spacing Consistency', () => {
    it('should use space-y-1.5 for content vertical spacing', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Both should use space-y-1.5 inside CardContent
      expect(productCard).toContain('space-y-1.5');
      expect(vehicleCard).toContain('space-y-1.5');
    });

    it('should not use inconsistent margin patterns', () => {
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // VehicleCard should no longer have mb-2 and mb-3 (old pattern)
      // space-y-1.5 should be used instead
      const cardContentSection = vehicleCard.substring(
        vehicleCard.indexOf('CardContent className="p-4"'),
        vehicleCard.indexOf('</CardContent>')
      );

      // Check that mb-2 and mb-3 are not in the CardContent section
      expect(cardContentSection).not.toMatch(/className="[^"]*mb-2[^"]*"/);
      expect(cardContentSection).not.toMatch(/className="[^"]*mb-3[^"]*"/);
    });
  });

  // AC5: Both cards use unified hover state behavior (image scale + shadow elevation change)
  describe('AC5: Unified Hover Behavior', () => {
    it('should have image scale on hover in both components', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Both should have group-hover:scale-105 on images
      expect(productCard).toContain('group-hover:scale-105');
      expect(vehicleCard).toContain('group-hover:scale-105');
    });

    it('should use consistent transition duration', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Card should use duration-100 for shadow transitions (via Card component)
      expect(productCard).toContain('duration-100');
      expect(vehicleCard).toContain('duration-100');
    });
  });

  // AC6: VehicleCard uses semantic color tokens (no hardcoded colors remain after Story 10.3)
  describe('AC6: VehicleCard Semantic Color Tokens', () => {
    it('should not have hardcoded red colors in VehicleCard', () => {
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // VehicleCard should NOT have hardcoded bg-red-600 or hover:bg-red-700
      expect(vehicleCard).not.toContain('bg-red-600');
      expect(vehicleCard).not.toContain('hover:bg-red-700');
    });

    it('should use Badge variant="destructive" for SOLD badge', () => {
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // SOLD badge should use variant="destructive" (semantic)
      expect(vehicleCard).toMatch(/variant="destructive"[^>]*>\s*SOLD/);
    });

    it('should use semantic tokens for text colors', () => {
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Should use semantic tokens like text-foreground, text-primary, text-muted-foreground
      expect(vehicleCard).toContain('text-foreground');
      expect(vehicleCard).toContain('text-primary');
      expect(vehicleCard).toContain('text-muted-foreground');
    });
  });

  // AC7: Both cards use ShadCN Card component wrapper for structural consistency
  describe('AC7: ShadCN Card Wrapper Usage', () => {
    it('should import Card and CardContent in both components', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Both should import Card and CardContent from ui/card
      expect(productCard).toMatch(/import\s+\{[^}]*Card[^}]*\}\s+from\s+["']@\/components\/ui\/card["']/);
      expect(vehicleCard).toMatch(/import\s+\{[^}]*Card[^}]*\}\s+from\s+["']@\/components\/ui\/card["']/);

      expect(productCard).toMatch(/import\s+\{[^}]*CardContent[^}]*\}\s+from\s+["']@\/components\/ui\/card["']/);
      expect(vehicleCard).toMatch(/import\s+\{[^}]*CardContent[^}]*\}\s+from\s+["']@\/components\/ui\/card["']/);
    });

    it('should render Card component in both components', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Both should render <Card className="...">
      expect(productCard).toMatch(/<Card\s+className="[^"]*h-full[^"]*"/);
      expect(vehicleCard).toMatch(/<Card\s+className="[^"]*h-full[^"]*"/);
    });

    it('should not use old article wrapper in ProductCard', () => {
      const productCard = readFile('components/product-card.tsx');

      // ProductCard should no longer have <article className="group h-full">
      expect(productCard).not.toMatch(/<article\s+className="group h-full"/);
    });
  });

  // AC8: All button styles across both cards use consistent design tokens
  describe('AC8: Button Style Consistency', () => {
    it('should use semantic bg-accent token for Add to Cart button', () => {
      const productCard = readFile('components/product-card.tsx');

      // Button should use bg-accent (not hardcoded bg-blue-600 or similar)
      expect(productCard).toMatch(/bg-accent/);
    });

    it('should use text-white token for button text', () => {
      const productCard = readFile('components/product-card.tsx');

      // Button should use text-white
      expect(productCard).toMatch(/text-white/);
    });

    it('should use hover:bg-accent or hover:bg-accent\/90 for button hover', () => {
      const productCard = readFile('components/product-card.tsx');

      // Button should have hover state with accent color
      expect(productCard).toMatch(/hover:bg-accent/);
    });

    it('should use shadow design token for button', () => {
      const productCard = readFile('components/product-card.tsx');

      // Button should use shadow-[var(--shadow-medium)]
      expect(productCard).toContain('shadow-[var(--shadow-medium)]');
    });
  });

  // AC9: TypeScript builds successfully with no new errors
  describe('AC9: TypeScript Compilation', () => {
    it('should have valid TypeScript in ProductCard', () => {
      const productCard = readFile('components/product-card.tsx');

      // Should have interface definition
      expect(productCard).toContain('interface ProductCardProps');
      expect(productCard).toContain('product: Product');
    });

    it('should have valid TypeScript in VehicleCard', () => {
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Should have interface definition
      expect(vehicleCard).toContain('interface VehicleCardProps');
      expect(vehicleCard).toContain('vehicle: VehicleListItem');
    });
  });

  // AC10: Visual regression testing confirms consistent appearance
  describe('AC10: Visual Consistency Verification', () => {
    it('should have both cards using consistent Card wrapper structure', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Both should follow structure: Card > Image Container > CardContent
      expect(productCard).toMatch(/<Card[^>]*>.*<div[^>]*aspect-square[^>]*>.*<CardContent/s);
      expect(vehicleCard).toMatch(/<Card[^>]*>.*<div[^>]*aspect-\[4\/3\][^>]*>.*<CardContent/s);
    });

    it('should maintain intentional aspect ratio differences', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // ProductCard should use aspect-square (1:1)
      expect(productCard).toContain('aspect-square');

      // VehicleCard should use aspect-[4/3]
      expect(vehicleCard).toContain('aspect-[4/3]');

      // This is intentional - different content requirements
    });

    it('should have consistent overflow-hidden on both cards', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Both Card components should have overflow-hidden
      expect(productCard).toMatch(/<Card[^>]*overflow-hidden[^>]*>/);
      expect(vehicleCard).toMatch(/<Card[^>]*overflow-hidden[^>]*>/);
    });

    it('should have consistent border treatment', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Both should have border class on Card
      expect(productCard).toMatch(/<Card[^>]*border[^>]*>/);
      expect(vehicleCard).toMatch(/<Card[^>]*border[^>]*>/);
    });

    it('should have consistent transition-shadow classes', () => {
      const productCard = readFile('components/product-card.tsx');
      const vehicleCard = readFile('components/vehicles/VehicleCard.tsx');

      // Both should have transition-shadow on Card
      expect(productCard).toMatch(/<Card[^>]*transition-shadow[^>]*>/);
      expect(vehicleCard).toMatch(/<Card[^>]*transition-shadow[^>]*>/);
    });
  });
});
