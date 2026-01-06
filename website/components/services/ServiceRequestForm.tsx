"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useServiceSelection, type ServiceType } from "./ServiceSelectionContext";
import { services } from "./ServiceCards";
import { X } from "lucide-react";

// Form validation schema - now supports multiple services
const serviceRequestSchema = z.object({
  serviceTypes: z.array(z.enum(["conditioning", "rejuvenation", "mechanical", "cosmetic"])).min(1, "Please select at least one service"),
  needsAdvice: z.boolean().optional(),
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
  const { selectedServices, toggleService, clearServices } = useServiceSelection();

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
      serviceTypes: selectedServices,
      needsAdvice: false,
      existingCustomer: "no",
    },
  });

  // Sync context with form
  const formServices = watch("serviceTypes") || [];
  const needsAdvice = watch("needsAdvice");

  // Keep form in sync with context
  if (JSON.stringify(formServices) !== JSON.stringify(selectedServices)) {
    setValue("serviceTypes", selectedServices);
  }

  const handleToggleService = (service: ServiceType) => {
    toggleService(service);
  };

  const onSubmit = async (data: ServiceRequestFormData) => {
    setIsLoading(true);
    try {
      // Convert to API format (supports both single and multiple services)
      const payload = {
        ...data,
        serviceType: data.needsAdvice ? "not-sure" : data.serviceTypes.join(","),
      };

      const response = await fetch("/api/services/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      clearServices();
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
      <Card className="mx-auto max-w-3xl border-0 bg-neutral-50">
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl text-white">
            ✓
          </div>
          <h3 className="mb-2 text-2xl font-bold text-foreground">
            Request Submitted Successfully!
          </h3>
          <p className="mb-6 text-muted-foreground">
            Thank you for your interest. A BMW Service Professional will contact you
            within 1 business day to discuss your needs and schedule an assessment.
          </p>
          <div className="rounded-lg bg-white p-4 shadow-sm">
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
    <Card className="mx-auto max-w-3xl border-0 bg-neutral-50">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Selected Services Display */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Selected Services <span className="text-red-500">*</span>
              </Label>
              {selectedServices.length > 0 && (
                <button
                  type="button"
                  onClick={clearServices}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Service selection chips */}
            <div className="flex flex-wrap gap-2">
              {services.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleToggleService(service.id)}
                    disabled={needsAdvice}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50",
                      needsAdvice && "cursor-not-allowed opacity-50"
                    )}
                  >
                    {service.title}
                    {isSelected && <X className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>

            {/* Not sure option */}
            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="needsAdvice"
                checked={needsAdvice}
                onCheckedChange={(checked) => {
                  setValue("needsAdvice", checked === true);
                  if (checked) {
                    clearServices();
                  }
                }}
              />
              <Label htmlFor="needsAdvice" className="cursor-pointer text-sm text-muted-foreground">
                I'm not sure what I need — please advise me
              </Label>
            </div>

            {errors.serviceTypes && !needsAdvice && (
              <p className="text-sm text-red-600">{errors.serviceTypes.message}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Contact Information</h3>
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
                  className="bg-white"
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
                  className="bg-white"
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
                className="bg-white"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Vehicle Information</h3>
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
                  className="bg-white"
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
                  className="bg-white"
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
                  className="bg-white"
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
                className="bg-white"
              />
              {errors.vin && (
                <p className="text-sm text-red-600">{errors.vin.message}</p>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Service Details</h3>
            <div className="space-y-2">
              <Label htmlFor="description">
                Describe Your Needs <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder={
                  needsAdvice
                    ? "Tell us about your BMW and what you're hoping to achieve. We'll help determine the best services for your needs..."
                    : selectedServices.length > 1
                      ? "Tell us about your BMW and what you need help with across the selected services..."
                      : selectedServices.includes("conditioning")
                        ? "Tell us about your vehicle's current condition and protection goals..."
                        : selectedServices.includes("rejuvenation")
                          ? "Share your restoration goals and vehicle history..."
                          : selectedServices.includes("mechanical")
                            ? "Describe the maintenance or repairs needed, any symptoms, or performance concerns..."
                            : selectedServices.includes("cosmetic")
                              ? "Describe any damage, dings, chips, or repairs needed..."
                              : "Tell us what you're looking to achieve with your BMW..."
                }
                rows={5}
                disabled={isLoading}
                className="bg-white"
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
              <SelectTrigger id="existingCustomer" className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || (selectedServices.length === 0 && !needsAdvice)}
              className="w-full text-base"
            >
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
