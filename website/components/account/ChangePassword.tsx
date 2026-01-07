"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  passwordChangeSchema,
  type PasswordChangeInput,
  calculatePasswordStrength,
} from "@/lib/profile/types";
import { toast } from "sonner";
import { Info } from "lucide-react";

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
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="flex items-start gap-4 py-5">
          <div className="rounded-lg bg-blue-100 p-2">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-body-base font-medium text-blue-900">
              Password Not Set
            </p>
            <p className="text-body-small text-blue-700 mt-0.5">
              You're using social login. Add a password to enable email/password login as a backup.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-body-large">Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-body-small font-medium">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              disabled={isLoading}
            />
            {errors.currentPassword && (
              <p className="text-body-small text-destructive">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-body-small font-medium">
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
              <p className="text-body-small text-muted-foreground">
                Strength:{" "}
                <span
                  className={
                    passwordStrength === "strong"
                      ? "text-green-600 font-medium"
                      : passwordStrength === "medium"
                        ? "text-amber-600 font-medium"
                        : "text-red-600 font-medium"
                  }
                >
                  {passwordStrength}
                </span>
              </p>
            )}
            {errors.newPassword && (
              <p className="text-body-small text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-body-small font-medium">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-body-small text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
