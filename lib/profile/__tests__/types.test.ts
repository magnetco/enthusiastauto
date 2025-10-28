import { describe, it, expect } from "vitest";
import { calculatePasswordStrength, addressSchema } from "../types";

describe("Profile Types", () => {
  describe("calculatePasswordStrength", () => {
    it("should return weak for short password", () => {
      expect(calculatePasswordStrength("test")).toBe("weak");
    });

    it("should return medium for decent password", () => {
      expect(calculatePasswordStrength("Test1234")).toBe("medium");
    });

    it("should return strong for strong password", () => {
      expect(calculatePasswordStrength("Test1234!@#")).toBe("strong");
    });
  });

  describe("addressSchema", () => {
    it("should validate correct address", () => {
      const validAddress = {
        label: "Home",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        isDefault: false,
      };

      const result = addressSchema.safeParse(validAddress);
      expect(result.success).toBe(true);
    });

    it("should reject invalid postal code", () => {
      const invalidAddress = {
        label: "Home",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "123", // Too short
        country: "USA",
        isDefault: false,
      };

      const result = addressSchema.safeParse(invalidAddress);
      expect(result.success).toBe(false);
    });
  });
});
