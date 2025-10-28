import { z } from "zod";

// Address type
export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  image: z.string().url().optional().nullable(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

// Address schema
export const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z
    .string()
    .min(5, "Postal code must be at least 5 characters")
    .max(10, "Postal code must be less than 10 characters"),
  country: z.string(),
  phone: z.string().optional(),
  isDefault: z.boolean(),
});

export type AddressInput = z.infer<typeof addressSchema>;

// Account deletion confirmation schema
export const accountDeletionSchema = z.object({
  confirmation: z.string().refine((val) => val === "DELETE", {
    message: 'Please type "DELETE" to confirm',
  }),
  understood: z.boolean().refine((val) => val === true, {
    message: "You must confirm you understand this action is permanent",
  }),
});

export type AccountDeletionInput = z.infer<typeof accountDeletionSchema>;

// Password strength calculation
export function calculatePasswordStrength(
  password: string
): "weak" | "medium" | "strong" {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}
