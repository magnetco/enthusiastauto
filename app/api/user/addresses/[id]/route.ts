import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { addressSchema, type Address } from "@/lib/profile/types";

/**
 * PATCH /api/user/addresses/[id]
 * Update an existing address
 * Protected route - requires authentication
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Find address to update
    const addressIndex = currentAddresses.findIndex((addr) => addr.id === id);

    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // If setting as default, unset all other defaults
    let updatedAddresses = currentAddresses;
    if (addressData.isDefault) {
      updatedAddresses = currentAddresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    }

    // Update the address
    updatedAddresses[addressIndex] = {
      ...updatedAddresses[addressIndex],
      ...addressData,
      id, // Preserve the ID
    };

    // Update user with modified addresses array
    await prisma.user.update({
      where: { email: session.user.email },
      data: { addresses: updatedAddresses as any },
    });

    return NextResponse.json({
      success: true,
      address: updatedAddresses[addressIndex],
    });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/addresses/[id]
 * Delete an address
 * Protected route - requires authentication
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user addresses
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { addresses: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentAddresses = (user.addresses as unknown as Address[]) || [];

    // Filter out the address to delete
    const updatedAddresses = currentAddresses.filter((addr) => addr.id !== id);

    if (updatedAddresses.length === currentAddresses.length) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Update user with modified addresses array
    await prisma.user.update({
      where: { email: session.user.email },
      data: { addresses: updatedAddresses as any },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
