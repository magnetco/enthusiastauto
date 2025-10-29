import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Typography System Tests (Story 10.2)
 * Tests ensure consistent typography across the application
 * following Linear-inspired design system patterns
 */

describe("Typography System Consistency (Story 10.2)", () => {
  const globalsCSS = readFileSync(
    resolve(__dirname, "../app/globals.css"),
    "utf-8"
  );

  describe("AC1: Typography Design Tokens", () => {
    it("should define all 11 typography size tokens", () => {
      const expectedTokens = [
        "--font-size-micro",
        "--font-size-mini",
        "--font-size-small",
        "--font-size-base",
        "--font-size-regular",
        "--font-size-large",
        "--font-size-xl",
        "--font-size-title-3",
        "--font-size-title-2",
        "--font-size-title-1",
        "--font-size-hero",
      ];

      expectedTokens.forEach((token) => {
        expect(globalsCSS).toContain(token);
      });
    });

    it("should pair font-size with line-height for each token", () => {
      const pairedTokens = [
        { size: "--font-size-micro", lineHeight: "--line-height-micro" },
        { size: "--font-size-mini", lineHeight: "--line-height-mini" },
        { size: "--font-size-small", lineHeight: "--line-height-small" },
        { size: "--font-size-base", lineHeight: "--line-height-base" },
        { size: "--font-size-regular", lineHeight: "--line-height-regular" },
        { size: "--font-size-large", lineHeight: "--line-height-large" },
        { size: "--font-size-xl", lineHeight: "--line-height-xl" },
        { size: "--font-size-title-3", lineHeight: "--line-height-title-3" },
        { size: "--font-size-title-2", lineHeight: "--line-height-title-2" },
        { size: "--font-size-title-1", lineHeight: "--line-height-title-1" },
        { size: "--font-size-hero", lineHeight: "--line-height-hero" },
      ];

      pairedTokens.forEach(({ size, lineHeight }) => {
        expect(globalsCSS).toContain(size);
        expect(globalsCSS).toContain(lineHeight);
      });
    });

    it("should pair font-size with letter-spacing for each token", () => {
      const letterSpacingTokens = [
        "--letter-spacing-micro",
        "--letter-spacing-mini",
        "--letter-spacing-small",
        "--letter-spacing-base",
        "--letter-spacing-regular",
        "--letter-spacing-large",
        "--letter-spacing-xl",
        "--letter-spacing-title-3",
        "--letter-spacing-title-2",
        "--letter-spacing-title-1",
        "--letter-spacing-hero",
      ];

      letterSpacingTokens.forEach((token) => {
        expect(globalsCSS).toContain(token);
      });
    });
  });

  describe("AC3: Font Family Consistency", () => {
    it("should define Figtree as primary font family", () => {
      expect(globalsCSS).toContain('--font-sans: var(--font-figtree), "Figtree"');
    });

    it("should have fallback font stack", () => {
      expect(globalsCSS).toContain("-apple-system");
      expect(globalsCSS).toContain("BlinkMacSystemFont");
      expect(globalsCSS).toContain('"Segoe UI"');
    });
  });

  describe("AC4: Uppercase Transform Handling", () => {
    it("should NOT have global uppercase transform on headings", () => {
      // Match heading block and ensure it doesn't have "text-transform: uppercase;"
      const headingBlock = globalsCSS.match(
        /h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*{[^}]*}/s
      );
      expect(headingBlock).toBeDefined();

      // Should have comment about removal, not the actual property
      if (headingBlock) {
        expect(headingBlock[0]).not.toMatch(/text-transform:\s*uppercase;/);
        expect(headingBlock[0]).toContain("/* text-transform: uppercase removed");
      }
    });

    it("should define .heading-uppercase utility class", () => {
      expect(globalsCSS).toContain(".heading-uppercase");
      expect(globalsCSS).toMatch(/\.heading-uppercase\s*{[\s\S]*?text-transform:\s*uppercase/);
    });
  });

  describe("AC6: Typography Utility Classes", () => {
    it("should define all semantic typography classes", () => {
      const semanticClasses = [
        ".text-hero",
        ".text-title-1",
        ".text-title-2",
        ".text-title-3",
        ".text-body-xl",
        ".text-body-large",
        ".text-body-regular",
        ".text-body-base",
        ".text-body-small",
        ".text-body-mini",
        ".text-body-micro",
      ];

      semanticClasses.forEach((className) => {
        expect(globalsCSS).toContain(className);
      });
    });

    it("should map semantic classes to design tokens", () => {
      // Check .text-title-2 uses --font-size-title-2 token
      const titleClass = globalsCSS.match(/\.text-title-2\s*{[^}]*}/s);
      expect(titleClass).toBeDefined();
      if (titleClass) {
        expect(titleClass[0]).toContain("var(--font-size-title-2)");
        expect(titleClass[0]).toContain("var(--line-height-title-2)");
        expect(titleClass[0]).toContain("var(--letter-spacing-title-2)");
      }
    });
  });

  describe("AC7: Responsive Typography", () => {
    it("should define responsive hero typography class", () => {
      expect(globalsCSS).toMatch(/@media\s*\(min-width:\s*640px\)[\s\S]*?\.sm\\:text-hero/);
    });

    it("should use hero size on larger screens for h1", () => {
      const h1Responsive = globalsCSS.match(
        /@media\s*\(min-width:\s*640px\)[\s\S]*?h1\s*{[^}]*}/s
      );
      expect(h1Responsive).toBeDefined();
      if (h1Responsive) {
        expect(h1Responsive[0]).toContain("--font-size-hero");
      }
    });
  });

  describe("Code Quality", () => {
    it("should not have TODO comments about typography in globals.css", () => {
      expect(globalsCSS).not.toMatch(/TODO.*typography/i);
      expect(globalsCSS).not.toMatch(/FIXME.*typography/i);
    });

    it("should have comments explaining typography system", () => {
      expect(globalsCSS).toContain("Typography Scale");
      expect(globalsCSS).toContain("Typography Utility Classes");
    });
  });
});

describe("Typography Usage in Components", () => {
  describe("Hero Components", () => {
    it("HeroSection should use hero typography and uppercase", () => {
      const heroSectionContent = readFileSync(
        resolve(__dirname, "../components/shared/HeroSection.tsx"),
        "utf-8"
      );

      // Hero heading should use text-hero class and heading-uppercase
      expect(heroSectionContent).toContain("text-hero");
      expect(heroSectionContent).toContain("heading-uppercase");

      // Should use semantic body classes
      expect(heroSectionContent).toMatch(/text-body-(large|xl|base)/);
    });

    it("ServiceHero should use hero typography and uppercase", () => {
      const serviceHeroContent = readFileSync(
        resolve(__dirname, "../components/services/ServiceHero.tsx"),
        "utf-8"
      );

      expect(serviceHeroContent).toContain("text-hero");
      expect(serviceHeroContent).toContain("heading-uppercase");
    });
  });

  describe("Section Headings", () => {
    it("should use text-title-2 for section headings", () => {
      const files = [
        "../components/shared/FeaturedVehicles.tsx",
        "../components/shared/PopularParts.tsx",
        "../components/shared/AboutSection.tsx",
        "../app/services/page.tsx",
      ];

      files.forEach((file) => {
        const content = readFileSync(resolve(__dirname, file), "utf-8");
        expect(content).toContain("text-title-2");
      });
    });

    it("should NOT use hardcoded text-3xl or text-4xl classes", () => {
      const files = [
        "../components/shared/FeaturedVehicles.tsx",
        "../components/shared/PopularParts.tsx",
        "../app/services/page.tsx",
      ];

      files.forEach((file) => {
        const content = readFileSync(resolve(__dirname, file), "utf-8");
        // Should not have text-3xl or text-4xl (replaced with semantic classes)
        expect(content).not.toMatch(/className="[^"]*text-3xl[^"]*"/);
        expect(content).not.toMatch(/className="[^"]*text-4xl[^"]*"/);
      });
    });
  });

  describe("Body Text Consistency", () => {
    it("should use semantic body text classes instead of text-lg/text-xl", () => {
      const files = [
        "../components/shared/AboutSection.tsx",
        "../app/services/page.tsx",
      ];

      files.forEach((file) => {
        const content = readFileSync(resolve(__dirname, file), "utf-8");
        // Should use text-body-* classes
        expect(content).toMatch(/text-body-(small|base|large|xl)/);
      });
    });
  });
});
