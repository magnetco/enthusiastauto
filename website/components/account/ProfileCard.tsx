import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as React from "react";

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
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
  className,
  user,
  hasPassword,
  authMethods,
  isOAuthAvatar,
  ...props
}: ProfileCardProps) {
  if (!user) return null;

  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold overflow-hidden shrink-0">
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
            <h3 className="text-body-large font-semibold text-foreground">
              {user.name || "Name not set"}
            </h3>
            <p className="text-body-base text-muted-foreground mt-0.5">
              {user.email}
            </p>
            {authMethods && authMethods.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {authMethods.map((method) => (
                  <Badge key={method} variant="secondary" className="font-medium">
                    {method}
                  </Badge>
                ))}
                {hasPassword && (
                  <Badge variant="secondary" className="font-medium">
                    Password
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
