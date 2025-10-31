"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/account/ProfileCard";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
      toast.error(
        "Cannot unlink your only authentication method. Please add a password first."
      );
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

      toast.success(`${provider} account unlinked successfully`);
      setUnlinkConfirm(null);
      onUpdate?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "google":
        return "🔵"; // In production, use actual Google icon
      case "facebook":
        return "🔷"; // In production, use actual Facebook icon
      default:
        return "🔗";
    }
  };

  return (
    <ProfileCard
      title="Connected Accounts"
      description="Manage your social login connections"
    >
      {accounts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            No social accounts linked.
          </p>
          <p className="text-sm text-gray-400">
            Link Google or Facebook for faster login.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getProviderIcon(account.provider)}
                </span>
                <div>
                  <p className="font-semibold capitalize">
                    {account.provider}
                  </p>
                  <p className="text-sm text-gray-500">
                    Account ID: {account.providerAccountId.substring(0, 12)}...
                  </p>
                </div>
                <Badge variant="secondary">Linked</Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setUnlinkConfirm(account.provider)}
                disabled={!canUnlink || isLoading}
                title={
                  !canUnlink
                    ? "Add a password before unlinking your only authentication method"
                    : ""
                }
              >
                Unlink
              </Button>
            </div>
          ))}
        </div>
      )}

      {!canUnlink && accounts.length > 0 && (
        <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-900">
          <p className="font-medium mb-1">Cannot Unlink</p>
          <p>
            Add a password to your account before unlinking your only
            authentication method.
          </p>
        </div>
      )}

      <Dialog
        open={!!unlinkConfirm}
        onOpenChange={() => setUnlinkConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlink {unlinkConfirm} Account?</DialogTitle>
            <DialogDescription>
              Are you sure you want to unlink your {unlinkConfirm} account?
              You can re-link it at any time.
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
              onClick={() =>
                unlinkConfirm && handleUnlink(unlinkConfirm)
              }
              disabled={isLoading}
            >
              {isLoading ? "Unlinking..." : "Unlink Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProfileCard>
  );
}
