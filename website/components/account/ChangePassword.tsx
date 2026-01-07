"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
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
      <div className="rounded-lg border border-border p-6">
        <div className="border-l-2 border-blue-500 bg-blue-50/50 py-3 pl-4 pr-4">
          <p className="text-sm font-medium text-blue-900">Password Not Set</p>
          <p className="text-sm text-blue-700 mt-0.5">
            You're using social login. Add a password to enable email/password login as a backup.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-xs font-medium uppercase tracking-wide">
            Current Password
          </Label>
          <Input
            id="currentPassword"
            type="password"
            {...register("currentPassword")}
            disabled={isLoading}
          />
          {errors.currentPassword && (
            <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-xs font-medium uppercase tracking-wide">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            {...register("newPassword")}
            disabled={isLoading}
            onChange={(e) => {
              register("newPassword").onChange(e);
              if (e.target.value) {
                setPasswordStrength(calculatePasswordStrength(e.target.value));
              } else {
                setPasswordStrength(null);
              }
            }}
          />
          {passwordStrength && (
            <p className="text-xs text-muted-foreground">
              Strength:{" "}
              <span
                className={
                  passwordStrength === "strong"
                    ? "text-green-600"
                    : passwordStrength === "medium"
                      ? "text-amber-600"
                      : "text-red-600"
                }
              >
                {passwordStrength}
              </span>
            </p>
          )}
          {errors.newPassword && (
            <p className="text-sm text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-xs font-medium uppercase tracking-wide">
            Confirm New Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <Button type="submit" size="sm" disabled={isLoading}>
            {isLoading ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
