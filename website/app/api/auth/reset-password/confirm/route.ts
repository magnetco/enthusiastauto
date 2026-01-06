import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { AUTH_ERRORS, AUTH_HTTP_CODES } from "@/lib/auth/errors";

const confirmResetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = confirmResetSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error:
            validationResult.error.issues[0]?.message ||
            AUTH_ERRORS.REQUIRED_FIELD,
        },
        { status: AUTH_HTTP_CODES.BAD_REQUEST },
      );
    }

    const { token, password } = validationResult.data;

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(", ") },
        { status: AUTH_HTTP_CODES.BAD_REQUEST },
      );
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: AUTH_ERRORS.RESET_TOKEN_INVALID },
        { status: AUTH_HTTP_CODES.NOT_FOUND },
      );
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });

      return NextResponse.json(
        { error: AUTH_ERRORS.RESET_TOKEN_EXPIRED },
        { status: AUTH_HTTP_CODES.BAD_REQUEST },
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: AUTH_HTTP_CODES.NOT_FOUND },
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete all verification tokens and sessions for this user (for security)
    await Promise.all([
      prisma.verificationToken.deleteMany({
        where: { identifier: user.email },
      }),
      prisma.session.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset confirmation error:", error);
    return NextResponse.json(
      { error: AUTH_ERRORS.UNKNOWN_ERROR },
      { status: AUTH_HTTP_CODES.INTERNAL_SERVER_ERROR },
    );
  }
}
