"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  passwordChangeSchema,
  type PasswordChangeInput,
  calculatePasswordStrength,
} from "@/lib/profile/types";
import { toast } from "sonner";

interface ChangePasswordProps {
  hasPassword: boolean;
}

export function ChangePassword({ hasPassword }: ChangePasswordProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const newPassword = watch("newPassword");

  // Update password strength indicator as user types
  useState(() => {
    if (newPassword) {
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setPasswordStrength(null);
    }
  });

  const onSubmit = async (data: PasswordChangeInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to change password");
      }

      toast.success("Password changed successfully. Please log in again.");

      // Sign out and redirect to signin page
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1500);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setIsLoading(false);
    }
  };

  if (!hasPassword) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900">
            <p className="font-medium mb-2">Password Not Set</p>
            <p>
              You're currently using social login (Google/Facebook) without a password.
              You can add a password here if you'd like to enable traditional
              email/password login as a backup authentication method.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-4 text-sm text-blue-900">
          <p className="font-medium mb-1">ℹ️ About Password Changes</p>
          <p>
            You have a password set for your account. Changing it will sign you out of all devices
            for security purposes. You'll need to log in again with your new password.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              disabled={isLoading}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              disabled={isLoading}
              onChange={(e) => {
                register("newPassword").onChange(e);
                if (e.target.value) {
                  setPasswordStrength(
                    calculatePasswordStrength(e.target.value)
                  );
                } else {
                  setPasswordStrength(null);
                }
              }}
            />
            {passwordStrength && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Strength:</span>
                <Badge
                  variant={
                    passwordStrength === "strong"
                      ? "default"
                      : passwordStrength === "medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {passwordStrength}
                </Badge>
              </div>
            )}
            {errors.newPassword && (
              <p className="text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, and
              number
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-900">
            <p className="font-medium mb-1">Security Notice</p>
            <p>
              Changing your password will sign you out of all devices. You'll
              need to log in again.
            </p>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
