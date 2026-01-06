import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { AUTH_ERRORS } from "@/lib/auth/errors";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/auth/signin?error=Invalid verification link",
          request.url,
        ),
      );
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL(
          "/auth/signin?error=Invalid or expired verification link",
          request.url,
        ),
      );
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });

      return NextResponse.redirect(
        new URL(
          "/auth/signin?error=Verification link has expired. Please request a new one.",
          request.url,
        ),
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=User not found", request.url),
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      // Delete the token
      await prisma.verificationToken.delete({
        where: { token },
      });

      return NextResponse.redirect(
        new URL(
          "/auth/signin?message=Email already verified. Please sign in.",
          request.url,
        ),
      );
    }

    // Update user's emailVerified timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete the used verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Redirect to signin with success message
    return NextResponse.redirect(
      new URL(
        "/auth/signin?verified=true&message=Email verified successfully! You can now sign in.",
        request.url,
      ),
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL(
        "/auth/signin?error=Something went wrong. Please try again.",
        request.url,
      ),
    );
  }
}
