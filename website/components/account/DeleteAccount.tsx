"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AlertTriangle } from "lucide-react";

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
      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-body-large">Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleOpenDialog}>
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="text-body-base text-muted-foreground">
              <p className="font-medium text-foreground mb-2">What will be deleted:</p>
              <ul className="list-disc list-inside space-y-1 text-body-small">
                <li>Your profile information</li>
                <li>Saved addresses</li>
                <li>Garage favorites</li>
                <li>All session data</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmation">
                Type <span className="font-mono font-bold text-destructive">DELETE</span> to confirm
              </Label>
              <Input
                id="confirmation"
                {...register("confirmation")}
                placeholder="DELETE"
                disabled={isLoading}
                className="font-mono"
              />
              {errors.confirmation && (
                <p className="text-body-small text-destructive">{errors.confirmation.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="understood"
                checked={understood}
                onCheckedChange={(checked) => setValue("understood", checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="understood" className="text-body-base cursor-pointer leading-tight">
                I understand this action is permanent and cannot be undone
              </Label>
            </div>
            {errors.understood && (
              <p className="text-body-small text-destructive">{errors.understood.message}</p>
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
