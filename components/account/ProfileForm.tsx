"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.image || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name || "",
      image: user.image || "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      // Validate file type
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Only JPEG, PNG, and WebP images are supported");
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileUpdateInput) => {
    setIsLoading(true);
    try {
      let imageUrl = data.image;

      // If user uploaded a new avatar, upload to Vercel Blob
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        const uploadResponse = await fetch("/api/user/avatar", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload avatar");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, image: imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      setAvatarFile(null);
      onUpdate?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
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
    setAvatarFile(null);
    setAvatarPreview(user.image || null);
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="py-6">
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
            <Label htmlFor="avatar">Avatar Image</Label>
            {isEditing ? (
              <>
                <div className="flex items-center gap-4">
                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      JPEG, PNG, or WebP. Max 5MB.
                    </p>
                  </div>
                </div>
                {errors.image && (
                  <p className="text-sm text-red-600">{errors.image.message}</p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                {user.image && (
                  <img
                    src={user.image}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <p className="text-sm font-medium">
                  {user.image ? "Custom avatar set" : "No custom avatar"}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
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
      </CardContent>
    </Card>
  );
}
