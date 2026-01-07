"use client";

import { cn } from "@/lib/utils";

interface AccountHeaderProps {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
  memberSince?: Date;
  className?: string;
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

export function AccountHeader({ user, memberSince, className }: AccountHeaderProps) {
  const formattedDate = memberSince
    ? new Date(memberSince).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Avatar */}
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary-foreground">
            {getInitials(user.name)}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-title-3 font-semibold text-foreground">
          {user.name || "Welcome"}
        </h2>
        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        {formattedDate && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Member since {formattedDate}
          </p>
        )}
      </div>
    </div>
  );
}

