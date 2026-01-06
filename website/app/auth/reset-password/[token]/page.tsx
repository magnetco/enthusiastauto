"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

export default function ResetPasswordTokenPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
  });

  // Validate token on mount
  useEffect(() => {
    async function validateToken() {
      try {
        const response = await fetch(
          `/api/auth/reset-password/validate?token=${token}`,
        );
        const result = await response.json();

        if (response.ok && result.valid) {
          setIsValidToken(true);
        } else {
          setError(
            result.error || "Invalid or expired reset link. Please request a new one.",
          );
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsValidating(false);
      }
    }

    if (token) {
      validateToken();
    }
  }, [token]);

  const onSubmit = async (data: NewPasswordFormData) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccess("Password reset successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/auth/signin?message=Password reset successfully. Please sign in with your new password.");
      }, 2000);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">
            Validating reset link...
          </p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Invalid Reset Link
            </h1>
          </div>

          <Alert variant="destructive" aria-live="polite">
            {error}
          </Alert>

          <div className="text-center">
            <Link
              href="/auth/reset-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Set new password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <Alert variant="destructive" aria-live="polite">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="default" aria-live="polite">
              {success}
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="password">
                New Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password
                    ? "password-error password-requirements"
                    : "password-requirements"
                }
                {...register("password")}
              />
              <p
                id="password-requirements"
                className="mt-1 text-xs text-muted-foreground"
              >
                At least 8 characters with uppercase, lowercase, and number
              </p>
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                aria-required="true"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="mt-1 text-sm text-destructive"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Resetting password..." : "Reset password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
