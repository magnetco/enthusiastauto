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
  { id: 1, title: "Services", icon: Wrench, description: "Select what you need" },
  { id: 2, title: "Contact", icon: User, description: "Your information" },
  { id: 3, title: "Vehicle", icon: Car, description: "Tell us about your BMW" },
  { id: 4, title: "Details", icon: FileText, description: "Describe your needs" },
  { id: 5, title: "Review", icon: Send, description: "Confirm & submit" },
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
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#005A90]">
              <Check className="h-12 w-12 text-white" strokeWidth={3} />
            </div>

            <h2 className="mb-4 font-headline text-2xl tracking-wider text-[#282a30] sm:text-3xl">
              REQUEST SUBMITTED
            </h2>

            <p className="mb-8 text-lg text-[#6f6e77]">
              Thank you for your interest in our services. A BMW Service Professional will
              contact you within 1 business day to discuss your needs and schedule an
              assessment.
            </p>

            <p className="mb-2 text-sm text-[#6f6e77]">
              A confirmation email has been sent to your inbox.
            </p>

            {/* Contact Card */}
            <div className="my-12 rounded-xl border border-[#DFE5EA] bg-white p-8 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-[#282a30]">
                Need immediate assistance?
              </h3>
              <a
                href="tel:513-554-1269"
                className="mb-2 block text-2xl font-bold text-[#005A90] hover:underline"
              >
                513-554-1269
              </a>
              <p className="text-sm text-[#6f6e77]">Monday - Friday, 8am - 5pm</p>
              <p className="mt-4 text-sm text-[#6f6e77]">
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
              variant="outline"
              className="border-[#005A90] text-[#005A90] hover:bg-[#005A90] hover:text-white"
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
      {/* Progress Steps */}
      <div className="border-b border-[#DFE5EA] bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (isCompleted) setCurrentStep(step.id);
                      }}
                      disabled={!isCompleted && !isActive}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                        isActive &&
                          "border-[#005A90] bg-[#005A90] text-white shadow-lg",
                        isCompleted &&
                          "border-[#005A90] bg-[#005A90]/10 text-[#005A90] hover:bg-[#005A90]/20",
                        !isActive &&
                          !isCompleted &&
                          "border-[#DFE5EA] bg-white text-[#CCCCCC]"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" strokeWidth={3} />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "mt-2 text-xs font-medium",
                        isActive && "text-[#005A90]",
                        isCompleted && "text-[#005A90]",
                        !isActive && !isCompleted && "text-[#CCCCCC]"
                      )}
                    >
                      {step.title}
                    </span>
                    <span
                      className={cn(
                        "hidden text-xs sm:block",
                        isActive && "text-[#6f6e77]",
                        !isActive && "text-[#CCCCCC]"
                      )}
                    >
                      {step.description}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "mx-2 h-0.5 flex-1",
                        isCompleted ? "bg-[#005A90]" : "bg-[#DFE5EA]"
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
              <div className="mb-8 text-center">
                <h2 className="mb-2 font-headline text-2xl tracking-wider text-[#282a30]">
                  SELECT YOUR SERVICES
                </h2>
                <p className="text-[#6f6e77]">
                  Choose one or more services that match your BMW's needs
                </p>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                {services.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      disabled={needsAdvice}
                      className={cn(
                        "group relative flex flex-col rounded-xl border-2 p-6 text-left transition-all",
                        isSelected
                          ? "border-[#005A90] bg-[#005A90]/5 shadow-md"
                          : "border-[#DFE5EA] bg-white hover:border-[#CCCCCC] hover:shadow-sm",
                        needsAdvice && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {/* Selection indicator */}
                      <div
                        className={cn(
                          "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                          isSelected
                            ? "border-[#005A90] bg-[#005A90] text-white"
                            : "border-[#CCCCCC] bg-white"
                        )}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </div>

                      <div
                        className={cn(
                          "mb-3 flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                          isSelected
                            ? "bg-[#005A90] text-white"
                            : "bg-[#f4f4f4] text-[#6f6e77] group-hover:bg-[#DFE5EA]"
                        )}
                      >
                        {SERVICE_ICONS[service.id]}
                      </div>

                      <h3 className="mb-1 pr-8 text-lg font-semibold text-[#282a30]">
                        {service.title}
                      </h3>
                      <p className="text-sm text-[#6f6e77]">{service.description}</p>

                      {service.badge && (
                        <span className="mt-3 inline-flex w-fit rounded-full bg-[#005A90]/10 px-2.5 py-0.5 text-xs font-medium text-[#005A90]">
                          {service.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Not sure option */}
              <div className="rounded-lg border border-[#DFE5EA] bg-[#f8f8f8] p-4">
                <div className="flex items-start gap-3">
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
                  <div>
                    <Label
                      htmlFor="needsAdvice"
                      className="cursor-pointer text-base font-medium text-[#282a30]"
                    >
                      I'm not sure what I need
                    </Label>
                    <p className="text-sm text-[#6f6e77]">
                      Our BMW specialists will assess your vehicle and recommend the best
                      services
                    </p>
                  </div>
                </div>
              </div>

              {errors.serviceTypes && !needsAdvice && (
                <p className="mt-3 text-center text-sm text-[#F90020]">
                  {errors.serviceTypes.message}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-8 text-center">
                <h2 className="mb-2 font-headline text-2xl tracking-wider text-[#282a30]">
                  CONTACT INFORMATION
                </h2>
                <p className="text-[#6f6e77]">
                  How should we reach you to discuss your service needs?
                </p>
              </div>

              <div className="mx-auto max-w-xl space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#282a30]">
                    Full Name <span className="text-[#F90020]">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="John Smith"
                    disabled={isLoading}
                    className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                  />
                  {errors.name && (
                    <p className="text-sm text-[#F90020]">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#282a30]">
                    Email Address <span className="text-[#F90020]">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    disabled={isLoading}
                    className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                  />
                  {errors.email && (
                    <p className="text-sm text-[#F90020]">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#282a30]">
                    Phone Number <span className="text-[#F90020]">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="(513) 555-1234"
                    disabled={isLoading}
                    className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                  />
                  {errors.phone && (
                    <p className="text-sm text-[#F90020]">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="existingCustomer" className="text-[#282a30]">
                    Are you an existing customer?
                  </Label>
                  <Select
                    value={formData.existingCustomer}
                    onValueChange={(value) =>
                      setValue("existingCustomer", value as "yes" | "no")
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]">
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
              <div className="mb-8 text-center">
                <h2 className="mb-2 font-headline text-2xl tracking-wider text-[#282a30]">
                  VEHICLE INFORMATION
                </h2>
                <p className="text-[#6f6e77]">Tell us about your BMW</p>
              </div>

              <div className="mx-auto max-w-xl space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear" className="text-[#282a30]">
                      Year <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="vehicleYear"
                      {...register("vehicleYear")}
                      placeholder="2020"
                      disabled={isLoading}
                      className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                    />
                    {errors.vehicleYear && (
                      <p className="text-sm text-[#F90020]">
                        {errors.vehicleYear.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake" className="text-[#282a30]">
                      Make <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="vehicleMake"
                      {...register("vehicleMake")}
                      placeholder="BMW"
                      disabled={isLoading}
                      className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                    />
                    {errors.vehicleMake && (
                      <p className="text-sm text-[#F90020]">
                        {errors.vehicleMake.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel" className="text-[#282a30]">
                      Model <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="vehicleModel"
                      {...register("vehicleModel")}
                      placeholder="M3"
                      disabled={isLoading}
                      className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                    />
                    {errors.vehicleModel && (
                      <p className="text-sm text-[#F90020]">
                        {errors.vehicleModel.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vin" className="text-[#282a30]">
                    VIN <span className="text-[#6f6e77]">(Optional)</span>
                  </Label>
                  <Input
                    id="vin"
                    {...register("vin")}
                    placeholder="WBSWD93508PX12345"
                    disabled={isLoading}
                    className="h-12 border-[#DFE5EA] bg-white font-mono text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
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
              <div className="mb-8 text-center">
                <h2 className="mb-2 font-headline text-2xl tracking-wider text-[#282a30]">
                  SERVICE DETAILS
                </h2>
                <p className="text-[#6f6e77]">
                  Tell us more about what you're looking to achieve
                </p>
              </div>

              <div className="mx-auto max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#282a30]">
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
                    className="border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                  />
                  {errors.description && (
                    <p className="text-sm text-[#F90020]">{errors.description.message}</p>
                  )}
                  <p className="text-xs text-[#6f6e77]">
                    Include details about condition, timeline, goals, or any specific
                    concerns
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-8 text-center">
                <h2 className="mb-2 font-headline text-2xl tracking-wider text-[#282a30]">
                  REVIEW YOUR REQUEST
                </h2>
                <p className="text-[#6f6e77]">
                  Please confirm all details before submitting
                </p>
              </div>

              <div className="mx-auto max-w-2xl space-y-6">
                {/* Services */}
                <div className="rounded-xl border border-[#DFE5EA] bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-[#282a30]">Selected Services</h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-[#005A90] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {needsAdvice ? (
                      <span className="rounded-full bg-[#005A90]/10 px-3 py-1.5 text-sm font-medium text-[#005A90]">
                        Not Sure — Need Advice
                      </span>
                    ) : (
                      selectedServices.map((service) => (
                        <span
                          key={service}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#005A90]/10 px-3 py-1.5 text-sm font-medium text-[#005A90]"
                        >
                          {SERVICE_ICONS[service]}
                          {getServiceLabel(service)}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="rounded-xl border border-[#DFE5EA] bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-[#282a30]">Contact Information</h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-sm text-[#005A90] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-[#6f6e77]">Name</p>
                      <p className="font-medium text-[#282a30]">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6f6e77]">Phone</p>
                      <p className="font-medium text-[#282a30]">{formData.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-[#6f6e77]">Email</p>
                      <p className="font-medium text-[#282a30]">{formData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="rounded-xl border border-[#DFE5EA] bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-[#282a30]">Vehicle Information</h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-sm text-[#005A90] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#6f6e77]">Vehicle</p>
                      <p className="font-medium text-[#282a30]">
                        {formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}
                      </p>
                    </div>
                    {formData.vin && (
                      <div>
                        <p className="text-xs text-[#6f6e77]">VIN</p>
                        <p className="font-mono text-sm text-[#282a30]">{formData.vin}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-xl border border-[#DFE5EA] bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-[#282a30]">Service Details</h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-sm text-[#005A90] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-[#6f6e77]">
                    {formData.description}
                  </p>
                </div>

                {/* Submit disclaimer */}
                <p className="text-center text-xs text-[#6f6e77]">
                  By submitting this request, you agree to be contacted by Enthusiast Auto
                  regarding your service needs.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="border-t border-[#DFE5EA] bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isLoading}
              className="gap-2 border-[#DFE5EA] text-[#282a30] hover:bg-[#f4f4f4]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="text-sm text-[#6f6e77]">
              Step {currentStep} of {STEPS.length}
            </div>

            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={
                  isLoading ||
                  (currentStep === 1 && selectedServices.length === 0 && !needsAdvice)
                }
                className="gap-2 bg-[#005A90] text-white hover:bg-[#005A90]/90"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2 bg-[#005A90] px-8 text-white hover:bg-[#005A90]/90"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Request
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

