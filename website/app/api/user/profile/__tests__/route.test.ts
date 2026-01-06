import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH } from "../route";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  default: {
    user: {
      update: vi.fn(),
    },
  },
}));

import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

describe("PATCH /api/user/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if not authenticated", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({ name: "Test User" }),
    });

    const response = await PATCH(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should update user profile successfully", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: "test@example.com" },
    } as any);

    const mockUser = {
      id: "user-1",
      name: "Updated Name",
      email: "test@example.com",
      image: null,
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

    const request = new NextRequest("http://localhost/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({ name: "Updated Name" }),
    });

    const response = await PATCH(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.name).toBe("Updated Name");
  });

  it("should return 400 for invalid data", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: "test@example.com" },
    } as any);

    const request = new NextRequest("http://localhost/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({ name: "X" }), // Too short
    });

    const response = await PATCH(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
  });
});
