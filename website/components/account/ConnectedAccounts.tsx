"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link2 } from "lucide-react";

interface Account {
  id: string;
  provider: string;
  providerAccountId: string;
}

interface ConnectedAccountsProps {
  accounts: Account[];
  hasPassword: boolean;
  onUpdate?: () => void;
}

const providerIcons: Record<string, string> = {
  google: "G",
  github: "GH",
};

export function ConnectedAccounts({
  accounts,
  hasPassword,
  onUpdate,
}: ConnectedAccountsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [unlinkConfirm, setUnlinkConfirm] = useState<string | null>(null);

  const canUnlink = hasPassword || accounts.length > 1;

  const handleUnlink = async (provider: string) => {
    if (!canUnlink) {
      toast.error("Cannot unlink your only authentication method");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/accounts/${provider}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to unlink account");
      }

      toast.success(`${provider} account unlinked`);
      setUnlinkConfirm(null);
      onUpdate?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Link2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-body-base text-muted-foreground">
            No connected accounts. Link Google or GitHub for faster login.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-body-large">Connected Accounts</CardTitle>
          <CardDescription>
            Manage your linked authentication providers
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-body-base font-semibold text-primary">
                    {providerIcons[account.provider] || account.provider[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-body-base font-medium text-foreground capitalize">
                    {account.provider}
                  </p>
                  <p className="text-body-small text-muted-foreground">Connected</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUnlinkConfirm(account.provider)}
                disabled={!canUnlink || isLoading}
                className="text-muted-foreground hover:text-foreground"
              >
                Unlink
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {!canUnlink && (
        <p className="text-body-small text-muted-foreground mt-2">
          Add a password before unlinking your only authentication method.
        </p>
      )}

      <Dialog open={!!unlinkConfirm} onOpenChange={() => setUnlinkConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlink {unlinkConfirm}?</DialogTitle>
            <DialogDescription>
              You can re-link this account at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUnlinkConfirm(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => unlinkConfirm && handleUnlink(unlinkConfirm)}
              disabled={isLoading}
            >
              {isLoading ? "Unlinking..." : "Unlink"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
