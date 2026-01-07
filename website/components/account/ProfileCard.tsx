import { cn } from "@/lib/utils";
import * as React from "react";

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "danger";
  children?: React.ReactNode;
  user?: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
  hasPassword?: boolean;
  authMethods?: string[];
  isOAuthAvatar?: boolean;
}

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
  // User overview card
  if (user) {
    return (
      <div
        className={cn(
          "rounded-lg border border-border p-6",
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center text-background text-lg font-medium overflow-hidden shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(user.name)
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground">
              {user.name || "Name not set"}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
            {authMethods && authMethods.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {authMethods.map((method) => (
                  <span
                    key={method}
                    className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded"
                  >
                    {method}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Generic section card
  return (
    <div
      className={cn(
        "rounded-lg border p-6",
        variant === "danger" ? "border-red-200 bg-red-50/50" : "border-border",
        className
      )}
      {...props}
    >
      {(title || description || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3
                className={cn(
                  "text-base font-semibold",
                  variant === "danger" ? "text-red-900" : "text-foreground"
                )}
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                className={cn(
                  "text-sm mt-0.5",
                  variant === "danger" ? "text-red-700" : "text-muted-foreground"
                )}
              >
                {description}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
