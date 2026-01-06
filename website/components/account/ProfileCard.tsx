import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as React from "react";

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "danger";
  children?: React.ReactNode;
  // Props for user overview card
  user?: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
  hasPassword?: boolean;
  authMethods?: string[];
  isOAuthAvatar?: boolean;
}

// Helper to get initials for avatar fallback
function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function ProfileCard({
  title,
  description,
  action,
  variant = "default",
  className,
  children,
  user,
  hasPassword,
  authMethods,
  isOAuthAvatar,
  ...props
}: ProfileCardProps) {
  // If user prop is provided, render user overview card
  if (user) {
    return (
      <Card
        className={cn(
          "shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all duration-100",
          variant === "danger" && "border-red-200",
          className
        )}
        {...props}
      >
        <CardHeader>
          <CardTitle
            className={cn(
              "leading-tight tracking-[-0.012em]",
              variant === "danger" && "text-red-600"
            )}
          >
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold overflow-hidden">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-title-3 font-semibold">
                {user.name || "Name not set"}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              {authMethods && (
                <div className="flex gap-2 mt-2">
                  {authMethods.map((method) => (
                    <Badge key={method} variant="secondary">
                      {method}
                    </Badge>
                  ))}
                </div>
              )}
              {hasPassword !== undefined && (
                <p className="text-sm text-muted-foreground mt-2">
                  Member since{" "}
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              {isOAuthAvatar && (
                <p className="text-xs text-muted-foreground mt-1">
                  Using OAuth avatar (you can upload a custom one below)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default card rendering
  return (
    <Card
      className={cn(
        "shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all duration-100",
        variant === "danger" && "border-red-200",
        className
      )}
      {...props}
    >
      <CardHeader>
        <div className="space-y-1">
          <CardTitle
            className={cn(
              "leading-tight tracking-[-0.012em]",
              variant === "danger" && "text-red-600"
            )}
          >
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
