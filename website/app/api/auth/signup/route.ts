import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db/prisma";
import { hashPassword, validatePassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/tokens";
import { AUTH_ERRORS, AUTH_HTTP_CODES } from "@/lib/auth/errors";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || AUTH_ERRORS.REQUIRED_FIELD },
        { status: AUTH_HTTP_CODES.BAD_REQUEST }
      );
    }

    const { name, email, password } = validationResult.data;

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(", ") },
        { status: AUTH_HTTP_CODES.BAD_REQUEST }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: AUTH_ERRORS.DUPLICATE_EMAIL },
        { status: AUTH_HTTP_CODES.BAD_REQUEST }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Generate verification token (24 hours expiry)
    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires,
      },
    });

    // Send verification email via Resend
    const { sendVerificationEmail } = await import("@/lib/auth/email");
    const emailResult = await sendVerificationEmail(user.email, user.name || "there", token);

    if (!emailResult.success) {
      // Log error but don't fail registration
      console.error("Failed to send verification email:", emailResult.error);
      // Note: We could still return success here since the account was created
      // The user can request a new verification email later
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully! Please check your email to verify your account.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: AUTH_ERRORS.UNKNOWN_ERROR },
      { status: AUTH_HTTP_CODES.INTERNAL_SERVER_ERROR }
    );
  }
}
