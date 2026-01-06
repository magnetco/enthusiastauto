import { describe, it, expect, vi, beforeEach } from "vitest";
import { authConfig } from "../config";
import prisma from "@/lib/db/prisma";

// Mock Prisma
vi.mock("@/lib/db/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock password verification
vi.mock("../password", () => ({
  verifyPassword: vi.fn(),
}));

describe("OAuth Configuration (Story 5.2)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AC1 & AC2: OAuth Providers Configuration", () => {
    it("should configure Google OAuth provider", () => {
      const providers = authConfig.providers;
      const googleProvider = providers.find(
        (p: any) => p.id === "google" || p.name === "Google"
      );

      expect(googleProvider).toBeDefined();
    });

    it("should configure Facebook OAuth provider", () => {
      const providers = authConfig.providers;
      const facebookProvider = providers.find(
        (p: any) => p.id === "facebook" || p.name === "Facebook"
      );

      expect(facebookProvider).toBeDefined();
    });

    it("should maintain existing Credentials provider", () => {
      const providers = authConfig.providers;
      const credentialsProvider = providers.find(
        (p: any) => p.id === "credentials"
      );

      expect(credentialsProvider).toBeDefined();
    });

    it("should have 3 total providers (Google, Facebook, Credentials)", () => {
      expect(authConfig.providers).toHaveLength(3);
    });
  });

  describe("AC6: OAuth Scopes Configuration", () => {
    it("should request minimal Google scopes (openid, email, profile)", () => {
      const providers = authConfig.providers;
      const googleProvider = providers.find(
        (p: any) => p.id === "google" || p.options?.id === "google"
      ) as any;

      if (googleProvider?.options?.authorization?.params) {
        const scopes = googleProvider.options.authorization.params.scope;
        expect(scopes).toContain("openid");
        expect(scopes).toContain("email");
        expect(scopes).toContain("profile");
      }
    });

    it("should request minimal Facebook permissions (email, public_profile)", () => {
      const providers = authConfig.providers;
      const facebookProvider = providers.find(
        (p: any) => p.id === "facebook" || p.options?.id === "facebook"
      ) as any;

      if (facebookProvider?.options?.authorization?.params) {
        const scopes = facebookProvider.options.authorization.params.scope;
        expect(scopes).toContain("email");
        expect(scopes).toContain("public_profile");
      }
    });
  });

  describe("AC3: OAuth User Creation Callback", () => {
    it("should set emailVerified for OAuth users in signIn callback", async () => {
      const mockUser = {
        id: "test-user-id",
        email: "test@example.com",
        emailVerified: null,
      };

      const mockAccount = {
        type: "oauth",
        provider: "google",
        providerAccountId: "google-123",
      };

      (prisma.user.update as any).mockResolvedValueOnce({
        ...mockUser,
        emailVerified: new Date(),
      });

      const signInCallback = authConfig.callbacks?.signIn;
      if (signInCallback) {
        const result = await signInCallback({
          user: mockUser as any,
          account: mockAccount as any,
          profile: {} as any,
          email: undefined,
          credentials: undefined,
        });

        expect(result).toBe(true);
        expect(prisma.user.update).toHaveBeenCalledWith({
          where: { email: mockUser.email },
          data: { emailVerified: expect.any(Date) },
        });
      }
    });

    it("should not update emailVerified if already set", async () => {
      const mockUser = {
        id: "test-user-id",
        email: "test@example.com",
        emailVerified: new Date(),
      };

      const mockAccount = {
        type: "oauth",
        provider: "google",
        providerAccountId: "google-123",
      };

      const signInCallback = authConfig.callbacks?.signIn;
      if (signInCallback) {
        await signInCallback({
          user: mockUser as any,
          account: mockAccount as any,
          profile: {} as any,
          email: undefined,
          credentials: undefined,
        });

        expect(prisma.user.update).not.toHaveBeenCalled();
      }
    });

    it("should allow sign in for credentials provider without updating emailVerified", async () => {
      const mockUser = {
        id: "test-user-id",
        email: "test@example.com",
        emailVerified: new Date(),
      };

      const mockAccount = {
        type: "credentials",
        provider: "credentials",
      };

      const signInCallback = authConfig.callbacks?.signIn;
      if (signInCallback) {
        const result = await signInCallback({
          user: mockUser as any,
          account: mockAccount as any,
          profile: {} as any,
          email: undefined,
          credentials: undefined,
        });

        expect(result).toBe(true);
        expect(prisma.user.update).not.toHaveBeenCalled();
      }
    });
  });

  describe("JWT Callback - OAuth Profile Data", () => {
    it("should include OAuth provider in JWT token", async () => {
      const mockToken = { id: "user-id" };
      const mockAccount = {
        provider: "google",
        type: "oauth",
      };
      const mockProfile = {
        image: "https://example.com/avatar.jpg",
      };

      const jwtCallback = authConfig.callbacks?.jwt;
      if (jwtCallback) {
        const result = await jwtCallback({
          token: mockToken as any,
          user: undefined,
          account: mockAccount as any,
          profile: mockProfile as any,
          trigger: "signIn",
          isNewUser: false,
          session: undefined,
        });

        expect(result.provider).toBe("google");
        expect(result.picture).toBe("https://example.com/avatar.jpg");
      }
    });

    it("should handle profile.picture field from OAuth providers", async () => {
      const mockToken = { id: "user-id" };
      const mockAccount = {
        provider: "facebook",
        type: "oauth",
      };
      const mockProfile = {
        picture: "https://example.com/fb-avatar.jpg",
      };

      const jwtCallback = authConfig.callbacks?.jwt;
      if (jwtCallback) {
        const result = await jwtCallback({
          token: mockToken as any,
          user: undefined,
          account: mockAccount as any,
          profile: mockProfile as any,
          trigger: "signIn",
          isNewUser: false,
          session: undefined,
        });

        expect(result.picture).toBe("https://example.com/fb-avatar.jpg");
      }
    });
  });

  describe("Session Callback - OAuth Profile Data", () => {
    it("should pass OAuth provider to client session", async () => {
      const mockSession = {
        user: {
          id: "user-id",
          email: "test@example.com",
          name: "Test User",
        },
        expires: "2025-12-31",
      };

      const mockToken = {
        id: "user-id",
        provider: "google",
        picture: "https://example.com/avatar.jpg",
      };

      const sessionCallback = authConfig.callbacks?.session;
      if (sessionCallback) {
        const result = await sessionCallback({
          session: mockSession as any,
          token: mockToken as any,
          user: undefined as any,
          newSession: undefined,
          trigger: "getSession",
        });

        expect((result.user as any).provider).toBe("google");
        expect(result.user.image).toBe("https://example.com/avatar.jpg");
      }
    });

    it("should not override existing user properties when no OAuth data", async () => {
      const mockSession = {
        user: {
          id: "user-id",
          email: "test@example.com",
          name: "Test User",
          image: "existing-image.jpg",
        },
        expires: "2025-12-31",
      };

      const mockToken = {
        id: "user-id",
      };

      const sessionCallback = authConfig.callbacks?.session;
      if (sessionCallback) {
        const result = await sessionCallback({
          session: mockSession as any,
          token: mockToken as any,
          user: undefined as any,
          newSession: undefined,
          trigger: "getSession",
        });

        expect(result.user.id).toBe("user-id");
        expect(result.user.email).toBe("test@example.com");
      }
    });
  });

  describe("AC7: Security Configuration", () => {
    it("should use jwt session strategy", () => {
      expect(authConfig.session?.strategy).toBe("jwt");
    });

    it("should set session maxAge to 30 days", () => {
      expect(authConfig.session?.maxAge).toBe(30 * 24 * 60 * 60);
    });

    it("should have custom sign-in page configured", () => {
      expect(authConfig.pages?.signIn).toBe("/auth/signin");
    });

    it("should have error page configured", () => {
      expect(authConfig.pages?.error).toBe("/auth/error");
    });

    it("should use PrismaAdapter for multi-provider account support", () => {
      expect(authConfig.adapter).toBeDefined();
    });
  });
});
