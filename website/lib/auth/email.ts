import { Resend } from "resend";
import { render } from "@react-email/components";
import VerificationEmail from "@/emails/verification-email";
import PasswordResetEmail from "@/emails/password-reset-email";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@resend.dev";
const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

/**
 * Send email verification email
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const verificationUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;

    const emailHtml = await render(
      VerificationEmail({
        userName: name,
        verificationUrl,
      }),
    );

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Verify your email address - Enthusiast Auto",
      html: emailHtml,
    });

    if (error) {
      console.error("Failed to send verification email:", error);
      return { success: false, error: error.message };
    }

    console.log("Verification email sent successfully:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const resetUrl = `${APP_URL}/auth/reset-password/${token}`;

    const emailHtml = await render(
      PasswordResetEmail({
        userName: name,
        resetUrl,
      }),
    );

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Reset your password - Enthusiast Auto",
      html: emailHtml,
    });

    if (error) {
      console.error("Failed to send password reset email:", error);
      return { success: false, error: error.message };
    }

    console.log("Password reset email sent successfully:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
