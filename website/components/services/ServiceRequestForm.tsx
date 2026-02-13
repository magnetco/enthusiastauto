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
    <div className="mx-auto max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Select Services */}
        <Card className="border-2 border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold">Select Services</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">
                  Choose the services you need <span className="text-red-500">*</span>
                </Label>
                {selectedServices.length > 0 && (
                  <button
                    type="button"
                    onClick={clearServices}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Service selection chips */}
              <div className="flex flex-wrap gap-3">
                {services.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleToggleService(service.id)}
                      disabled={needsAdvice}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border-2 px-5 py-3 text-base font-medium transition-all",
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50",
                        needsAdvice && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {service.title}
                      {isSelected && <X className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>

              {/* Not sure option */}
              <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
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
                <Label htmlFor="needsAdvice" className="cursor-pointer text-base">
                  I'm not sure what I need — please advise me
                </Label>
              </div>

              {errors.serviceTypes && !needsAdvice && (
                <p className="text-sm text-red-600">{errors.serviceTypes.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Contact Information */}
        <Card className="border-2 border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold">Contact Information</h3>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="John Doe"
                    disabled={isLoading}
                    className="h-12 text-base"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="(513) 555-1234"
                    disabled={isLoading}
                    className="h-12 text-base"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  disabled={isLoading}
                  className="h-12 text-base"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Vehicle Information & Details */}
        <Card className="border-2 border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold">Vehicle Information & Requirements</h3>
            </div>

            <div className="space-y-6">
              {/* Vehicle Info */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear" className="text-base">
                    Year <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vehicleYear"
                    {...register("vehicleYear")}
                    placeholder="2020"
                    disabled={isLoading}
                    className="h-12 text-base"
                  />
                  {errors.vehicleYear && (
                    <p className="text-sm text-red-600">{errors.vehicleYear.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleMake" className="text-base">
                    Make <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vehicleMake"
                    {...register("vehicleMake")}
                    placeholder="BMW"
                    disabled={isLoading}
                    className="h-12 text-base"
                  />
                  {errors.vehicleMake && (
                    <p className="text-sm text-red-600">{errors.vehicleMake.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleModel" className="text-base">
                    Model <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vehicleModel"
                    {...register("vehicleModel")}
                    placeholder="M3"
                    disabled={isLoading}
                    className="h-12 text-base"
                  />
                  {errors.vehicleModel && (
                    <p className="text-sm text-red-600">{errors.vehicleModel.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin" className="text-base">VIN (Optional)</Label>
                <Input
                  id="vin"
                  {...register("vin")}
                  placeholder="WBSWD93508PX12345"
                  disabled={isLoading}
                  className="h-12 text-base"
                />
              </div>

              {/* Service Details */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
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
                  rows={6}
                  disabled={isLoading}
                  className="text-base"
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Include any relevant details about condition, goals, timeline, etc.
                </p>
              </div>

              {/* Existing Customer */}
              <div className="space-y-2">
                <Label htmlFor="existingCustomer" className="text-base">Are you an existing customer?</Label>
                <Select
                  value={watch("existingCustomer")}
                  onValueChange={(value) =>
                    setValue("existingCustomer", value as "yes" | "no")
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id="existingCustomer" className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || (selectedServices.length === 0 && !needsAdvice)}
            className="h-14 w-full max-w-md text-lg"
          >
            {isLoading ? "Submitting..." : "Submit Service Request"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            By submitting this form, you agree to be contacted by Enthusiast Auto regarding your service request.
          </p>
        </div>
      </form>
    </div>
  );
}
