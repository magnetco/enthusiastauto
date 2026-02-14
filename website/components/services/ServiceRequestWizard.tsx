"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { type ServiceType } from "./ServiceSelectionContext";
import { services } from "./ServiceCards";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Sparkles,
  RefreshCw,
  Settings,
  User,
  Car,
  FileText,
  Send,
} from "lucide-react";

// Form validation schema
const serviceRequestSchema = z.object({
  serviceTypes: z
    .array(z.enum(["conditioning", "rejuvenation", "mechanical", "cosmetic"]))
    .min(1, "Please select at least one service"),
  needsAdvice: z.boolean().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  vehicleYear: z.string().min(4, "Please enter vehicle year"),
  vehicleMake: z.string().min(1, "Please enter vehicle make"),
  vehicleModel: z.string().min(1, "Please enter vehicle model"),
  vin: z.string().optional(),
  description: z
    .string()
    .min(20, "Please provide at least 20 characters describing your needs"),
  existingCustomer: z.enum(["yes", "no"]).optional(),
});

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

const STEPS = [
  { id: 1, title: "Services", icon: Wrench },
  { id: 2, title: "Contact", icon: User },
  { id: 3, title: "Vehicle", icon: Car },
  { id: 4, title: "Details", icon: FileText },
  { id: 5, title: "Review", icon: Send },
];

const SERVICE_ICONS: Record<ServiceType, React.ReactNode> = {
  conditioning: <Sparkles className="h-5 w-5" />,
  rejuvenation: <RefreshCw className="h-5 w-5" />,
  mechanical: <Settings className="h-5 w-5" />,
  cosmetic: <Wrench className="h-5 w-5" />,
};

export function ServiceRequestWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset,
  } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      serviceTypes: [],
      needsAdvice: false,
      existingCustomer: "no",
    },
    mode: "onChange",
  });

  const formData = watch();
  const needsAdvice = watch("needsAdvice");

  const toggleService = useCallback(
    (service: ServiceType) => {
      const newServices = selectedServices.includes(service)
        ? selectedServices.filter((s) => s !== service)
        : [...selectedServices, service];
      setSelectedServices(newServices);
      setValue("serviceTypes", newServices);
    },
    [selectedServices, setValue]
  );

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        if (needsAdvice) return true;
        return await trigger("serviceTypes");
      case 2:
        return await trigger(["name", "email", "phone"]);
      case 3:
        return await trigger(["vehicleYear", "vehicleMake", "vehicleModel"]);
      case 4:
        return await trigger("description");
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ServiceRequestFormData) => {
    setIsLoading(true);
    try {
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

      toast.success("Service request submitted! Check your email for confirmation.", {
        duration: 5000,
      });
      setIsSubmitted(true);
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

  const getServiceLabel = (type: ServiceType): string => {
    const service = services.find((s) => s.id === type);
    return service?.title || type;
  };

  if (isSubmitted) {
    return (
      <div className="light-section min-h-[70vh] w-full">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#005A90]">
              <Check className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>

            <h2 className="mb-4 font-headline text-2xl tracking-wider text-[#282a30] sm:text-3xl">
              REQUEST SUBMITTED
            </h2>

            <p className="mb-6 text-base leading-relaxed text-[#6f6e77]">
              Thank you for your interest in our services. A BMW Service Professional will
              contact you within 1 business day to discuss your needs and schedule an
              assessment.
            </p>

            <p className="mb-12 text-xs text-[#6f6e77]">
              A confirmation email has been sent to your inbox.
            </p>

            {/* Contact Card */}
            <div className="my-12 bg-white p-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#282a30]">
                Need Immediate Assistance?
              </h3>
              <a
                href="tel:513-554-1269"
                className="mb-2 block text-xl font-bold text-[#005A90] hover:underline sm:text-2xl"
              >
                513-554-1269
              </a>
              <p className="text-xs text-[#6f6e77]">Monday - Friday, 8am - 5pm</p>
              <p className="mt-4 text-xs text-[#6f6e77]">
                11608 Reading Rd, Cincinnati, OH 45241
              </p>
            </div>

            <Button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
                setSelectedServices([]);
                reset();
              }}
              variant="ghost"
              className="text-[#005A90] hover:bg-[#005A90]/5"
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="light-section w-full">
      {/* Progress Steps - Minimalist Design */}
      <div className="border-b border-[#DFE5EA]/50 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted) setCurrentStep(step.id);
                    }}
                    disabled={!isCompleted && !isActive}
                    className={cn(
                      "group flex flex-col items-center gap-2 transition-all",
                      (isCompleted || isActive) && "cursor-pointer"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                        isActive && "bg-[#005A90] text-white",
                        isCompleted && "bg-[#005A90]/10 text-[#005A90]",
                        !isActive && !isCompleted && "bg-[#f4f4f4] text-[#CCCCCC]"
                      )}
                    >
                      <span className="text-xs font-semibold">{step.id}</span>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium transition-colors",
                        isActive && "text-[#282a30]",
                        isCompleted && "text-[#6f6e77]",
                        !isActive && !isCompleted && "text-[#CCCCCC]"
                      )}
                    >
                      {step.title}
                    </span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "mx-2 h-px flex-1 transition-colors",
                        isCompleted ? "bg-[#005A90]/30" : "bg-[#DFE5EA]"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[50vh]">
        <div className="mx-auto max-w-4xl px-4 py-12">
          {/* Step 1: Services */}
          {currentStep === 1 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12 text-center">
                <h2 className="mb-3 font-headline text-2xl tracking-wider text-[#282a30] sm:text-3xl">
                  SELECT YOUR SERVICES
                </h2>
                <p className="text-[#6f6e77]">
                  Choose one or more services that match your BMW's needs
                </p>
              </div>

              <div className="mb-8 space-y-3">
                {services.map((service, index) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      disabled={needsAdvice}
                      className={cn(
                        "group relative w-full text-left transition-all",
                        isSelected
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white",
                        needsAdvice && "cursor-not-allowed opacity-40"
                      )}
                    >
                      <div className="flex items-start gap-6 p-6 sm:p-8">
                        {/* Number indicator */}
                        <div className="flex shrink-0 flex-col items-center gap-2">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all",
                              isSelected
                                ? "bg-[#005A90] text-white"
                                : "bg-[#f4f4f4] text-[#CCCCCC] group-hover:bg-[#DFE5EA]"
                            )}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-headline text-lg uppercase tracking-wider text-[#282a30] sm:text-xl">
                                  {service.title}
                                </h3>
                                {service.badge && (
                                  <span className="rounded-full bg-[#005A90]/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-[#005A90]">
                                    {service.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm leading-relaxed text-[#6f6e77]">
                                {service.description}
                              </p>
                            </div>
                            
                            {/* Selection indicator */}
                            <div
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all",
                                isSelected
                                  ? "bg-[#005A90]"
                                  : "border border-[#DFE5EA] bg-white group-hover:border-[#005A90]/30"
                              )}
                            >
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                              )}
                            </div>
                          </div>

                          {/* Features - compact inline display */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6f6e77]">
                            {service.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="flex items-center gap-1.5">
                                <span
                                  className={cn(
                                    "text-[10px]",
                                    isSelected ? "text-[#005A90]" : "text-[#CCCCCC]"
                                  )}
                                >
                                  •
                                </span>
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom border accent */}
                      <div
                        className={cn(
                          "h-px w-full transition-colors",
                          isSelected ? "bg-[#005A90]" : "bg-[#DFE5EA]/50"
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Not sure option - minimalist */}
              <div className="rounded-lg bg-[#f4f4f4] p-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    id="needsAdvice"
                    checked={needsAdvice}
                    onCheckedChange={(checked) => {
                      setValue("needsAdvice", checked === true);
                      if (checked) {
                        setSelectedServices([]);
                        setValue("serviceTypes", []);
                      }
                    }}
                    className="mt-0.5"
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="needsAdvice"
                      className="cursor-pointer text-sm font-medium text-[#282a30]"
                    >
                      I'm not sure what I need
                    </Label>
                    <p className="text-xs text-[#6f6e77]">
                      Our BMW specialists will assess your vehicle and recommend the best services
                    </p>
                  </div>
                </div>
              </div>

              {errors.serviceTypes && !needsAdvice && (
                <p className="mt-4 text-center text-sm text-[#F90020]">
                  {errors.serviceTypes.message}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12 text-center">
                <h2 className="mb-3 font-headline text-2xl tracking-wider text-[#282a30] sm:text-3xl">
                  CONTACT INFORMATION
                </h2>
                <p className="text-[#6f6e77]">
                  How should we reach you to discuss your service needs?
                </p>
              </div>

              <div className="mx-auto max-w-xl space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-[#282a30]">
                    Full Name <span className="text-[#F90020]">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="John Smith"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-xs text-[#F90020]">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-[#282a30]">
                    Email Address <span className="text-[#F90020]">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-xs text-[#F90020]">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-[#282a30]">
                    Phone Number <span className="text-[#F90020]">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="(513) 555-1234"
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <p className="text-xs text-[#F90020]">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="existingCustomer" className="text-sm font-medium text-[#282a30]">
                    Are you an existing customer?
                  </Label>
                  <Select
                    value={formData.existingCustomer}
                    onValueChange={(value) =>
                      setValue("existingCustomer", value as "yes" | "no")
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No, I'm new to Enthusiast Auto</SelectItem>
                      <SelectItem value="yes">Yes, I'm a returning customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Vehicle Information */}
          {currentStep === 3 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12 text-center">
                <h2 className="mb-3 font-headline text-2xl tracking-wider text-[#282a30] sm:text-3xl">
                  VEHICLE INFORMATION
                </h2>
                <p className="text-[#6f6e77]">Tell us about your BMW</p>
              </div>

              <div className="mx-auto max-w-xl space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear" className="text-sm font-medium text-[#282a30]">
                      Year <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="vehicleYear"
                      {...register("vehicleYear")}
                      placeholder="2020"
                      disabled={isLoading}
                    />
                    {errors.vehicleYear && (
                      <p className="text-xs text-[#F90020]">
                        {errors.vehicleYear.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake" className="text-sm font-medium text-[#282a30]">
                      Make <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="vehicleMake"
                      {...register("vehicleMake")}
                      placeholder="BMW"
                      disabled={isLoading}
                    />
                    {errors.vehicleMake && (
                      <p className="text-xs text-[#F90020]">
                        {errors.vehicleMake.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel" className="text-sm font-medium text-[#282a30]">
                      Model <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="vehicleModel"
                      {...register("vehicleModel")}
                      placeholder="M3"
                      disabled={isLoading}
                    />
                    {errors.vehicleModel && (
                      <p className="text-xs text-[#F90020]">
                        {errors.vehicleModel.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vin" className="text-sm font-medium text-[#282a30]">
                    VIN <span className="text-[#6f6e77]">(Optional)</span>
                  </Label>
                  <Input
                    id="vin"
                    {...register("vin")}
                    placeholder="WBSWD93508PX12345"
                    disabled={isLoading}
                    className="font-mono"
                  />
                  <p className="text-xs text-[#6f6e77]">
                    Providing your VIN helps us identify your exact vehicle specifications
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Service Details */}
          {currentStep === 4 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12 text-center">
                <h2 className="mb-3 font-headline text-2xl tracking-wider text-[#282a30] sm:text-3xl">
                  SERVICE DETAILS
                </h2>
                <p className="text-[#6f6e77]">
                  Tell us more about what you're looking to achieve
                </p>
              </div>

              <div className="mx-auto max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-[#282a30]">
                    Describe Your Needs <span className="text-[#F90020]">*</span>
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
                    rows={8}
                    disabled={isLoading}
                    className="border-[#DFE5EA]/50 bg-white text-sm focus:border-[#005A90] focus:ring-1 focus:ring-[#005A90]"
                  />
                  {errors.description && (
                    <p className="text-xs text-[#F90020]">{errors.description.message}</p>
                  )}
                  <p className="text-xs text-[#6f6e77]">
                    Include details about condition, timeline, goals, or any specific concerns
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12 text-center">
                <h2 className="mb-3 font-headline text-2xl tracking-wider text-[#282a30] sm:text-3xl">
                  REVIEW YOUR REQUEST
                </h2>
                <p className="text-[#6f6e77]">
                  Please confirm all details before submitting
                </p>
              </div>

              <div className="mx-auto max-w-2xl space-y-4">
                {/* Services */}
                <div className="bg-white p-6">
                  <div className="mb-4 flex items-center justify-between border-b border-[#DFE5EA]/50 pb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#282a30]">
                      Selected Services
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[#005A90] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {needsAdvice ? (
                      <span className="rounded-full bg-[#005A90]/10 px-3 py-1 text-xs font-medium text-[#005A90]">
                        Not Sure — Need Advice
                      </span>
                    ) : (
                      selectedServices.map((service) => (
                        <span
                          key={service}
                          className="rounded-full bg-[#005A90]/10 px-3 py-1 text-xs font-medium text-[#005A90]"
                        >
                          {getServiceLabel(service)}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-white p-6">
                  <div className="mb-4 flex items-center justify-between border-b border-[#DFE5EA]/50 pb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#282a30]">
                      Contact Information
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-[#005A90] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wider text-[#6f6e77]">Name</p>
                      <p className="text-sm font-medium text-[#282a30]">{formData.name}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wider text-[#6f6e77]">Phone</p>
                      <p className="text-sm font-medium text-[#282a30]">{formData.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="mb-1 text-xs uppercase tracking-wider text-[#6f6e77]">Email</p>
                      <p className="text-sm font-medium text-[#282a30]">{formData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="bg-white p-6">
                  <div className="mb-4 flex items-center justify-between border-b border-[#DFE5EA]/50 pb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#282a30]">
                      Vehicle Information
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-[#005A90] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wider text-[#6f6e77]">Vehicle</p>
                      <p className="text-sm font-medium text-[#282a30]">
                        {formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}
                      </p>
                    </div>
                    {formData.vin && (
                      <div>
                        <p className="mb-1 text-xs uppercase tracking-wider text-[#6f6e77]">VIN</p>
                        <p className="font-mono text-xs text-[#282a30]">{formData.vin}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white p-6">
                  <div className="mb-4 flex items-center justify-between border-b border-[#DFE5EA]/50 pb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#282a30]">
                      Service Details
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-xs text-[#005A90] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#6f6e77]">
                    {formData.description}
                  </p>
                </div>

                {/* Submit disclaimer */}
                <p className="pt-4 text-center text-xs text-[#6f6e77]">
                  By submitting this request, you agree to be contacted by Enthusiast Auto regarding your service needs.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="border-t border-[#DFE5EA]/50 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-6">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1 || isLoading}
              className="gap-2 text-[#6f6e77] hover:bg-[#f4f4f4] hover:text-[#282a30] disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <div className="text-xs font-medium text-[#6f6e77]">
              {currentStep} / {STEPS.length}
            </div>

            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={
                  isLoading ||
                  (currentStep === 1 && selectedServices.length === 0 && !needsAdvice)
                }
                className="gap-2 bg-[#005A90] px-6 text-sm text-white hover:bg-[#005A90]/90 disabled:opacity-50"
              >
                <span className="hidden sm:inline">Continue</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2 bg-[#005A90] px-8 text-sm text-white hover:bg-[#005A90]/90"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="hidden sm:inline">Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Submit Request</span>
                    <span className="sm:hidden">Submit</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

