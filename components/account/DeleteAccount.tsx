"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  accountDeletionSchema,
  type AccountDeletionInput,
} from "@/lib/profile/types";
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

      toast.success("Your account has been deleted. We're sorry to see you go.");

      // Redirect to homepage after deletion
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    reset();
    setIsDialogOpen(true);
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <div className="space-y-4">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-900 font-medium mb-2">
              Delete Your Account
            </p>
            <p className="text-sm text-red-800">
              Once you delete your account, there is no going back. This action
              is permanent and cannot be undone.
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={handleOpenDialog}
            className="w-full"
          >
            Delete My Account
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600">
                Delete Account Permanently?
              </DialogTitle>
              <DialogDescription className="text-red-800">
                This will permanently delete your account, profile, favorites,
                and all associated data. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm">
                <p className="font-medium text-red-900 mb-2">
                  What will be deleted:
                </p>
                <ul className="list-disc list-inside text-red-800 space-y-1">
                  <li>Your profile information</li>
                  <li>Saved addresses</li>
                  <li>Connected social accounts</li>
                  <li>All sessions (you'll be logged out)</li>
                  <li>Saved favorites (if any)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmation">
                  Type <span className="font-bold">DELETE</span> to confirm
                </Label>
                <Input
                  id="confirmation"
                  {...register("confirmation")}
                  placeholder="DELETE"
                  disabled={isLoading}
                  className="font-mono"
                />
                {errors.confirmation && (
                  <p className="text-sm text-red-600">
                    {errors.confirmation.message}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="understood"
                  checked={understood}
                  onCheckedChange={(checked) =>
                    setValue("understood", checked as boolean)
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="understood"
                  className="text-sm cursor-pointer leading-tight"
                >
                  I understand this action is permanent and cannot be undone
                </Label>
              </div>
              {errors.understood && (
                <p className="text-sm text-red-600">
                  {errors.understood.message}
                </p>
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
                  disabled={
                    isLoading || !understood || confirmation !== "DELETE"
                  }
                >
                  {isLoading
                    ? "Deleting..."
                    : "Permanently Delete Account"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
