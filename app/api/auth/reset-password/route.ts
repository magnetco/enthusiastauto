import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { generateToken } from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/auth/email";
import { AUTH_ERRORS, AUTH_HTTP_CODES } from "@/lib/auth/errors";

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = resetPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error:
            validationResult.error.issues[0]?.message ||
            AUTH_ERRORS.INVALID_EMAIL,
        },
        { status: AUTH_HTTP_CODES.BAD_REQUEST },
      );
    }

    const { email } = validationResult.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent user enumeration
    // (Don't reveal whether email exists or not)
    const successResponse = {
      success: true,
      message:
        "If an account exists with this email, you will receive password reset instructions.",
    };

    if (!user) {
      // Return success even if user doesn't exist
      return NextResponse.json(successResponse, { status: 200 });
    }

    // Delete any existing reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: user.email,
      },
    });

    // Generate password reset token (1 hour expiry)
    const token = generateToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires,
      },
    });

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.name || "there",
      token,
    );

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      // Still return success to user to prevent enumeration
    }

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: AUTH_ERRORS.UNKNOWN_ERROR },
      { status: AUTH_HTTP_CODES.INTERNAL_SERVER_ERROR },
    );
  }
}
