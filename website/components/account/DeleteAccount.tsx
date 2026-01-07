"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { accountDeletionSchema } from "@/lib/profile/types";
import { toast } from "sonner";

export function DeleteAccount() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<{ confirmation: string; understood: boolean }>({
    resolver: zodResolver(accountDeletionSchema),
    defaultValues: {
      confirmation: "",
      understood: false,
    },
  });

  const understood = watch("understood");
  const confirmation = watch("confirmation");

  const onSubmit = async (data: { confirmation: string; understood: boolean }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to delete account");
      }

      toast.success("Account deleted. Goodbye.");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    reset();
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-lg border border-red-200 bg-red-50/30 p-6">
        <p className="text-sm text-foreground mb-1">
          Permanently delete your account
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          This action cannot be undone. All your data will be removed.
        </p>
        <Button variant="destructive" size="sm" onClick={handleOpenDialog}>
          Delete Account
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">What will be deleted:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your profile information</li>
                <li>Saved addresses</li>
                <li>Garage favorites</li>
                <li>All session data</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmation">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="confirmation"
                {...register("confirmation")}
                placeholder="DELETE"
                disabled={isLoading}
                className="font-mono"
              />
              {errors.confirmation && (
                <p className="text-sm text-red-600">{errors.confirmation.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="understood"
                checked={understood}
                onCheckedChange={(checked) => setValue("understood", checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="understood" className="text-sm cursor-pointer leading-tight">
                I understand this action is permanent
              </Label>
            </div>
            {errors.understood && (
              <p className="text-sm text-red-600">{errors.understood.message}</p>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isLoading || !understood || confirmation !== "DELETE"}
              >
                {isLoading ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
