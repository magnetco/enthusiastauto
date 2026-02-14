import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const GARAGE_ITEM_LIMIT = parseInt(
  process.env.GARAGE_ITEM_LIMIT || "50",
  10
);

// Validation schema for favorite operations
const favoriteSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  itemType: z.enum(["vehicle", "product"], {
    message: "Item type must be 'vehicle' or 'product'",
  }),
  itemHandle: z.string().optional(), // Shopify product handle or Sanity vehicle slug
});

/**
 * GET /api/user/favorites
 * Fetch all favorites for the authenticated user
 * Query params: ?itemType=vehicle|product (optional filter)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get optional itemType filter from query params
    const searchParams = request.nextUrl.searchParams;
    const itemType = searchParams.get("itemType");

    // Build where clause
    const where: {
      userId: string;
      itemType?: string;
    } = {
      userId: session.user.id,
    };

    if (itemType === "vehicle" || itemType === "product") {
      where.itemType = itemType;
    }

    // Fetch favorites
    const favorites = await prisma.userFavorite.findMany({
      where,
      select: {
        id: true,
        itemId: true,
        itemType: true,
        itemHandle: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Fetch favorites error:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/favorites
 * Add item to garage
 * Body: { itemId: string, itemType: 'vehicle' | 'product' }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = favoriteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { itemId, itemType, itemHandle } = validationResult.data;

    // Check if garage is at capacity
    const currentCount = await prisma.userFavorite.count({
      where: { userId: session.user.id },
    });

    if (currentCount >= GARAGE_ITEM_LIMIT) {
      return NextResponse.json(
        {
          error: `Garage is full. Maximum ${GARAGE_ITEM_LIMIT} items allowed.`,
          limit: GARAGE_ITEM_LIMIT,
          current: currentCount,
        },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await prisma.userFavorite.findFirst({
      where: {
        userId: session.user.id,
        itemType,
        itemId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Item already in garage" },
        { status: 409 }
      );
    }

    // Create favorite
    const favorite = await prisma.userFavorite.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        itemType,
        itemId,
        itemHandle,
      },
      select: {
        id: true,
        itemId: true,
        itemType: true,
        itemHandle: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, favorite });
  } catch (error) {
    console.error("Add favorite error:", error);
    return NextResponse.json(
      { error: "Failed to add item to garage" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/favorites
 * Remove item from garage
 * Body: { itemId: string, itemType: 'vehicle' | 'product' }
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = favoriteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { itemId, itemType } = validationResult.data;

    // Delete favorite
    const deleted = await prisma.userFavorite.deleteMany({
      where: {
        userId: session.user.id,
        itemType,
        itemId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Item not found in garage" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove favorite error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from garage" },
      { status: 500 }
    );
  }
}
