import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

/**
 * DELETE /api/user/accounts/[provider]
 * Unlink a social account (Google, Facebook, etc.)
 * Protected route - requires authentication
 * Prevents unlinking if it's the only authentication method
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params;

    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with accounts
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        password: true,
        accounts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has password or multiple accounts
    const hasPassword = !!user.password;
    const accountCount = user.accounts.length;

    // Prevent account lockout - user must have at least one auth method
    if (!hasPassword && accountCount === 1) {
      return NextResponse.json(
        {
          error:
            "Cannot unlink your only authentication method. Please add a password first.",
        },
        { status: 400 }
      );
    }

    // Find the account to unlink
    const accountToUnlink = user.accounts.find(
      (account) => account.provider === provider
    );

    if (!accountToUnlink) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Delete the account
    await prisma.account.delete({
      where: { id: accountToUnlink.id },
    });

    return NextResponse.json({
      success: true,
      message: `${provider} account unlinked successfully`,
    });
  } catch (error) {
    console.error("Unlink account error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
