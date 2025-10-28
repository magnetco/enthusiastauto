'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type {
  VehicleInquiryFormData,
  VehicleContactFormProps,
} from '@/types/contact';
import { vehicleInquiryFormSchema } from '@/types/contact';

/**
 * VehicleContactForm Component
 * Inline contact form for vehicle detail pages with email delivery to sales team
 * Features: auto-filled message, trade-in checkbox, price drop alerts, validation
 */
export function VehicleContactForm({
  slug,
  title,
  year,
  make,
  model,
  price,
  status,
  source = 'Enthusiast Auto',
}: VehicleContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [messageLength, setMessageLength] = useState(0);

  // Auto-fill message with vehicle details
  const defaultMessage = `I'm interested and want to know more about the ${year} ${make} ${model} you have listed for $${price.toLocaleString()} on ${source}.`;

  const form = useForm({
    resolver: zodResolver(vehicleInquiryFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: defaultMessage,
      hasTradein: false,
      subscribeToPriceDrops: true, // Pre-checked by default
    },
  });

  // Update message length when message changes
  const watchMessage = form.watch('message');
  if (watchMessage && watchMessage.length !== messageLength) {
    setMessageLength(watchMessage.length);
  }

  // Handle form submission
  const onSubmit = async (data: VehicleInquiryFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          vehicleSlug: slug,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || 'Failed to send message');
      }

      // Success
      setIsSubmitted(true);
      toast.success("Message sent! We'll be in touch soon.", {
        description: 'Our team will review your inquiry and respond shortly.',
      });

      // Clear form after 2 seconds
      setTimeout(() => {
        form.reset({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: defaultMessage,
          hasTradein: false,
          subscribeToPriceDrops: true,
        });
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to send message', {
        description:
          error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show "sold" message instead of form
  if (status === 'sold') {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div className="text-center">
          <div className="mb-2 inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
            SOLD
          </div>
          <p className="text-gray-600">This vehicle has been sold.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h3 className="mb-6 text-sm font-bold uppercase tracking-wide text-gray-900">
        Message Seller
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name fields - two-column grid on desktop */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="John"
                      aria-label="First Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Doe"
                      aria-label="Last Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact fields - two-column grid on desktop */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled={isSubmitting}
                      placeholder="john@example.com"
                      aria-label="Email Address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      disabled={isSubmitting}
                      placeholder="(555) 123-4567"
                      aria-label="Phone Number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Message field with character counter */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Message <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isSubmitting}
                    rows={5}
                    placeholder="I'm interested in this vehicle..."
                    aria-label="Message"
                    className="resize-none"
                  />
                </FormControl>
                <div className="flex items-center justify-between">
                  <FormMessage />
                  <span className="text-xs text-gray-500">
                    {messageLength} / 1000
                  </span>
                </div>
              </FormItem>
            )}
          />

          {/* Trade-in checkbox */}
          <FormField
            control={form.control}
            name="hasTradein"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    aria-label="Do you have a trade-in?"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">
                    Do you have a trade-in?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Price drop alerts checkbox */}
          <FormField
            control={form.control}
            name="subscribeToPriceDrops"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    aria-label="Email me price drops for this vehicle"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">
                    Email me price drops for this vehicle
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting || isSubmitted}
            className="w-full"
            size="lg"
          >
            {isSubmitting
              ? 'Sending...'
              : isSubmitted
                ? 'Message Sent!'
                : 'Send Message'}
          </Button>

          {/* Privacy disclaimer */}
          <p className="text-xs text-gray-500">
            By submitting this form, you agree to our{' '}
            <a href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </a>
            . We will use your contact information to respond to your inquiry.
          </p>
        </form>
      </Form>
    </div>
  );
}
