"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Chrome, Loader2 } from "lucide-react";

const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SigninFormData = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socialProvider, setSocialProvider] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Account created successfully! Please check your email to verify your account.");
    }
    if (searchParams.get("verified") === "true") {
      setSuccess("Email verified successfully! You can now sign in.");
    }
    const message = searchParams.get("message");
    if (message) {
      setSuccess(message);
    }
    const errorParam = searchParams.get("error");
    if (errorParam) {
      // Map OAuth error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        OAuthSignin: "Unable to connect to authentication provider. Please try again.",
        OAuthCallback: "Authentication failed. Please try again.",
        OAuthCreateAccount: "Unable to create account. Please try again.",
        OAuthAccountNotLinked: "Email already registered with a different sign-in method. Please use your original sign-in method.",
        EmailSignin: "Unable to send sign-in email. Please try again.",
        Callback: "Authentication callback failed. Please try again.",
        CredentialsSignin: "Invalid email or password.",
        SessionRequired: "Please sign in to access this page.",
        Default: "An error occurred during sign-in. Please try again.",
      };
      setError(errorMessages[errorParam] || errorMessages.Default || "An error occurred");
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  async function handleSocialLogin(provider: "google" | "facebook") {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    setSocialProvider(provider);

    try {
      await signIn(provider, {
        callbackUrl: callbackUrl || "/",
        redirect: true,
      });
    } catch (err) {
      setError(`Unable to sign in with ${provider === "google" ? "Google" : "Facebook"}. Please try again.`);
      setIsLoading(false);
      setSocialProvider(null);
    }
  }

  async function onSubmit(data: SigninFormData) {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    setSocialProvider(null);

    try {
      const result = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex">
      {/* Left side - Form */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back to Enthusiast Auto
            </p>
          </div>

          <div className="mt-8 space-y-6">
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

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                aria-label="Sign in with Google"
              >
                {isLoading && socialProvider === "google" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Chrome className="mr-2 h-4 w-4" />
                )}
                Sign in with Google
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Link
                    href="/auth/reset-password"
                    className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  {...register("password")}
                />
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative hidden lg:block lg:w-1/2 lg:min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0c10] to-[#141721]">
          <div className="absolute inset-0 bg-[url('/images/auth-bg-e34-m5-touring.avif')] bg-cover bg-center opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div className="relative flex h-full flex-col items-center justify-center p-12 text-white">
          <h2 className="mb-4 text-4xl font-bold">The Leading BMW Preservation Facility</h2>
          <p className="max-w-md text-center text-lg text-gray-200">
            Access your garage, track your favorite vehicles, and manage your BMW collection.
          </p>
        </div>
      </div>
    </div>
  );
}
