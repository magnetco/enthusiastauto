"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/profile/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ProfileFormProps {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
  onUpdate?: () => void;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name || "",
      image: user.image || "",
    },
  });

  const onSubmit = async (data: ProfileUpdateInput) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      const fileInput = imageFileRef.current;
      if (fileInput?.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file) {
          formData.append("imageFile", file);
        }
      } else if (data.image === "") {
        formData.append("removeImage", "true");
      }

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
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

  const handleCancel = () => {
    reset({
      name: user.name || "",
      image: user.image || "",
    });
    setSelectedFileName(null);
    if (imageFileRef.current) {
      imageFileRef.current.value = "";
    }
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Card>
        <CardContent className="p-6 space-y-5">
          <div>
            <p className="text-body-mini font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Name
            </p>
            <p className="text-body-base font-medium text-foreground">
              {user.name || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-body-mini font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Email
            </p>
            <p className="text-body-base font-medium text-foreground">{user.email}</p>
            <p className="text-body-small text-muted-foreground mt-0.5">
              Email cannot be changed
            </p>
          </div>
          <div>
            <p className="text-body-mini font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Profile Picture
            </p>
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-body-mini text-muted-foreground">None</span>
                </div>
              )}
              <p className="text-body-base text-muted-foreground">
                {user.image ? "Profile picture set" : "No profile picture"}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-body-small font-medium">
              Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your name"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-body-small text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-body-small font-medium">
              Email
            </Label>
            <Input id="email" value={user.email} disabled className="bg-muted" />
            <p className="text-body-small text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-body-small font-medium">
              Profile Picture
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              ref={imageFileRef}
              disabled={isLoading}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0 && files[0]) {
                  setSelectedFileName(files[0].name);
                } else {
                  setSelectedFileName(null);
                }
              }}
            />
            {selectedFileName && (
              <p className="text-body-small text-muted-foreground">
                Selected: {selectedFileName}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
