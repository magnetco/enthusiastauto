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
    <div className={cn("flex items-center gap-3", className)}>
      {/* Avatar */}
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-foreground">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-background">
            {getInitials(user.name)}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {user.name || "Welcome"}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
