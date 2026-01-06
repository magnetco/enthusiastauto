/**
 * Contact form types and interfaces
 * Used for vehicle inquiry form submission and email delivery
 */

import { z } from 'zod';

/**
 * Form data schema for vehicle inquiry form
 * Validated client-side with React Hook Form + Zod
 */
export const vehicleInquiryFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(
      /^[\d\s()+-]*$/,
      'Phone number can only contain digits, spaces, and ()+-'
    )
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  hasTradein: z.boolean().default(false),
  subscribeToPriceDrops: z.boolean().default(true),
});

/**
 * Inferred TypeScript type from Zod schema
 */
export type VehicleInquiryFormData = z.infer<
  typeof vehicleInquiryFormSchema
>;

/**
 * API request payload for vehicle inquiry submission
 * Includes vehicleSlug to fetch vehicle details server-side
 */
export const vehicleInquiryPayloadSchema = vehicleInquiryFormSchema.extend({
  vehicleSlug: z.string().min(1, 'Vehicle slug is required'),
});

export type VehicleInquiryEmailPayload = z.infer<
  typeof vehicleInquiryPayloadSchema
>;

/**
 * API response for successful inquiry submission
 */
export interface VehicleInquiryResponse {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
}

/**
 * Vehicle data passed to contact form component
 */
export interface VehicleContactFormProps {
  slug: string;
  title: string;
  year: number;
  make: string;
  model: string;
  price: number;
  status: 'current' | 'sold' | 'pending';
  source?: 'Enthusiast Auto' | 'Cars & Bids' | string;
}
