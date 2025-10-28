import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { addressSchema, type Address } from "@/lib/profile/types";

/**
 * GET /api/user/addresses
 * Get all addresses for authenticated user
 * Protected route - requires authentication
 */
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with addresses
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { addresses: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse addresses from JSON field
    const addresses = (user.addresses as unknown as Address[]) || [];

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/addresses
 * Create a new address for authenticated user
 * Protected route - requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = addressSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const addressData = validationResult.data;

    // Get current user addresses
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { addresses: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentAddresses = (user.addresses as unknown as Address[]) || [];

    // Create new address with unique ID
    const newAddress: Address = {
      id: `addr_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      ...addressData,
    };

    // If this is set as default, unset all other defaults
    let updatedAddresses = currentAddresses;
    if (newAddress.isDefault) {
      updatedAddresses = currentAddresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    }

    // Add new address
    updatedAddresses.push(newAddress);

    // Update user with new addresses array
    await prisma.user.update({
      where: { email: session.user.email },
      data: { addresses: updatedAddresses as any },
    });

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
