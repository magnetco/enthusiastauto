import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { AUTH_ERRORS, AUTH_HTTP_CODES } from "@/lib/auth/errors";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token is required" },
        { status: AUTH_HTTP_CODES.BAD_REQUEST },
      );
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { valid: false, error: AUTH_ERRORS.RESET_TOKEN_INVALID },
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
        { valid: false, error: AUTH_ERRORS.RESET_TOKEN_EXPIRED },
        { status: AUTH_HTTP_CODES.BAD_REQUEST },
      );
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, error: AUTH_ERRORS.UNKNOWN_ERROR },
      { status: AUTH_HTTP_CODES.INTERNAL_SERVER_ERROR },
    );
  }
}
