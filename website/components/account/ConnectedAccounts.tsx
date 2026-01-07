"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
      <div className="rounded-lg border border-border p-6">
        <div className="text-center py-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Link2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            No connected accounts. Link Google or GitHub for faster login.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border divide-y divide-border">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {account.provider[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground capitalize">
                  {account.provider}
                </p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
            <button
              onClick={() => setUnlinkConfirm(account.provider)}
              disabled={!canUnlink || isLoading}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Unlink
            </button>
          </div>
        ))}
      </div>

      {!canUnlink && (
        <p className="text-xs text-muted-foreground mt-2">
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
