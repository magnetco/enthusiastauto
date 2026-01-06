"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { ServiceType } from "./ServiceCards";

// Form validation schema
const serviceRequestSchema = z.object({
  serviceType: z.enum(["conditioning", "rejuvenation", "mechanical", "cosmetic", "not-sure"], {
    required_error: "Please select a service type",
  }),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  vehicleYear: z.string().min(4, "Please enter vehicle year"),
  vehicleMake: z.string().min(1, "Please enter vehicle make"),
  vehicleModel: z.string().min(1, "Please enter vehicle model"),
  vin: z.string().optional(),
  description: z.string().min(20, "Please provide at least 20 characters describing your needs"),
  existingCustomer: z.enum(["yes", "no"]).optional(),
});

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

export function ServiceRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      serviceType: undefined,
      existingCustomer: "no",
    },
  });

  const selectedService = watch("serviceType");

  // Listen for service selection from cards
  useEffect(() => {
    const handleServiceSelect = (event: CustomEvent<{ serviceType: ServiceType }>) => {
      setValue("serviceType", event.detail.serviceType);
    };

    window.addEventListener("selectService", handleServiceSelect as EventListener);
    return () => {
      window.removeEventListener("selectService", handleServiceSelect as EventListener);
    };
  }, [setValue]);

  const onSubmit = async (data: ServiceRequestFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/services/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit request");
      }

      toast.success(
        "Service request submitted! We'll contact you within 1 business day.",
        { duration: 5000 }
      );
      setIsSubmitted(true);
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try calling us at 513-554-1269."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardContent className="py-12 text-center">
          <div className="mb-4 text-6xl">✓</div>
          <h3 className="mb-2 text-2xl font-bold text-foreground">
            Request Submitted Successfully!
          </h3>
          <p className="mb-6 text-muted-foreground">
            Thank you for your interest. A BMW Service Professional will contact you
            within 1 business day to discuss your needs and schedule an assessment.
          </p>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Need immediate assistance?</p>
            <a
              href="tel:513-554-1269"
              className="text-lg font-semibold text-primary hover:underline"
            >
              Call us at 513-554-1269
            </a>
            <p className="text-xs text-muted-foreground">Monday-Friday, 8am - 5pm</p>
          </div>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="mt-6"
          >
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Service Request Form</CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you within 1 business day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="serviceType">
              Service Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedService}
              onValueChange={(value) =>
                setValue("serviceType", value as ServiceRequestFormData["serviceType"])
              }
              disabled={isLoading}
            >
              <SelectTrigger id="serviceType">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conditioning">Conditioning & Protection</SelectItem>
                <SelectItem value="rejuvenation">Full Rejuvenation</SelectItem>
                <SelectItem value="mechanical">Mechanical Services</SelectItem>
                <SelectItem value="cosmetic">Cosmetic Repairs</SelectItem>
                <SelectItem value="not-sure">Not Sure / Need Advice</SelectItem>
              </SelectContent>
            </Select>
            {errors.serviceType && (
              <p className="text-sm text-red-600">{errors.serviceType.message}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="(513) 555-1234"
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Information</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="vehicleYear">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vehicleYear"
                  {...register("vehicleYear")}
                  placeholder="2020"
                  disabled={isLoading}
                />
                {errors.vehicleYear && (
                  <p className="text-sm text-red-600">{errors.vehicleYear.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleMake">
                  Make <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vehicleMake"
                  {...register("vehicleMake")}
                  placeholder="BMW"
                  disabled={isLoading}
                />
                {errors.vehicleMake && (
                  <p className="text-sm text-red-600">{errors.vehicleMake.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleModel">
                  Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vehicleModel"
                  {...register("vehicleModel")}
                  placeholder="M3"
                  disabled={isLoading}
                />
                {errors.vehicleModel && (
                  <p className="text-sm text-red-600">{errors.vehicleModel.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin">VIN (Optional)</Label>
              <Input
                id="vin"
                {...register("vin")}
                placeholder="WBSWD93508PX12345"
                disabled={isLoading}
              />
              {errors.vin && (
                <p className="text-sm text-red-600">{errors.vin.message}</p>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Details</h3>
            <div className="space-y-2">
              <Label htmlFor="description">
                Describe Your Needs <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder={
                  selectedService === "conditioning"
                    ? "Tell us about your vehicle's current condition and protection goals..."
                    : selectedService === "rejuvenation"
                      ? "Share your restoration goals and vehicle history..."
                      : selectedService === "mechanical"
                        ? "Describe the maintenance or repairs needed, any symptoms, or performance concerns..."
                        : selectedService === "cosmetic"
                          ? "Describe any damage, dings, chips, or repairs needed..."
                          : "Tell us what you're looking to achieve with your BMW..."
                }
                rows={6}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Include any relevant details about condition, goals, timeline, etc.
              </p>
            </div>
          </div>

          {/* Existing Customer */}
          <div className="space-y-2">
            <Label htmlFor="existingCustomer">Are you an existing customer?</Label>
            <Select
              value={watch("existingCustomer")}
              onValueChange={(value) =>
                setValue("existingCustomer", value as "yes" | "no")
              }
              disabled={isLoading}
            >
              <SelectTrigger id="existingCustomer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col gap-4">
            <Button type="submit" size="lg" disabled={isLoading} className="w-full">
              {isLoading ? "Submitting..." : "Submit Service Request"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By submitting this form, you agree to be contacted by Enthusiast Auto
              regarding your service request.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
