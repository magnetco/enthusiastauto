"use client";

import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/account/ProfileCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/profile/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name || "",
      image: user.image || "",
    },
  });

  const imageFile = watch("imageFile");

  const onSubmit = async (data: ProfileUpdateInput) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      
      if (data.imageFile && data.imageFile.length > 0) {
        formData.append("imageFile", data.imageFile[0]);
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
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  return (
    <ProfileCard
      title="Profile Information"
      description="Manage your personal information and profile picture"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          {isEditing ? (
            <>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter your name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </>
          ) : (
            <p className="text-sm font-medium">{user.name || "Not set"}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <p className="text-sm font-medium text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Profile Picture</Label>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                {...register("imageFile")}
                disabled={isLoading}
              />
              {imageFile && imageFile.length > 0 && (
                <p className="text-xs text-gray-500">
                  Selected: {imageFile[0].name}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Upload a new profile picture. Leave empty to keep current.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">
                  {user.image ? "Profile picture set" : "No profile picture"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {isEditing ? (
            <>
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
            </>
          ) : (
            <Button type="button" onClick={handleEditClick}>
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </ProfileCard>
  );
}
