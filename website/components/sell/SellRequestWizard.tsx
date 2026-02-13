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
import { TitleBlock } from "@/components/shared/TitleBlock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Handshake,
  Gavel,
  User,
  Car,
  FileText,
  Send,
  CheckCircle2,
} from "lucide-react";

// Form validation schema
const sellFormSchema = z.object({
  sellOption: z.enum(["sell", "consign", "auction"]),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Invalid email address"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year is required"),
  mileage: z.string().min(1, "Mileage is required"),
  vin: z.string().min(17, "VIN must be 17 characters").max(17, "VIN must be 17 characters"),
  notes: z.string().optional(),
  existingCustomer: z.boolean(),
  newsletter: z.boolean(),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy",
  }),
});

type SellFormData = z.infer<typeof sellFormSchema>;
type SellOption = "sell" | "consign" | "auction";

const STEPS = [
  { id: 1, title: "Option", icon: DollarSign, description: "How to sell" },
  { id: 2, title: "Contact", icon: User, description: "Your information" },
  { id: 3, title: "Vehicle", icon: Car, description: "Your BMW details" },
  { id: 4, title: "Details", icon: FileText, description: "Additional info" },
  { id: 5, title: "Review", icon: Send, description: "Confirm & submit" },
];

interface SellOptionData {
  id: SellOption;
  title: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  benefits: { title: string; description: string }[];
}

const sellOptions: SellOptionData[] = [
  {
    id: "sell",
    title: "Sell Direct",
    icon: <DollarSign className="h-6 w-6" />,
    tagline: "Fast & Simple",
    description:
      "We buy M-Series vehicles directly with immediate payment and prompt payoff of any liens.",
    benefits: [
      { title: "Immediate Payment", description: "Quick transaction with the EAG buying team" },
      { title: "Lien Payoff", description: "We handle outstanding loans directly" },
      { title: "No Hassle", description: "Skip the back-and-forth of private sales" },
    ],
  },
  {
    id: "consign",
    title: "Consignment",
    icon: <Handshake className="h-6 w-6" />,
    tagline: "Maximum Value",
    description:
      "We handle everything—sale readiness, marketing, and transaction—for the best price.",
    benefits: [
      { title: "Full Rejuvenation", description: "Your car receives our complete prep process" },
      { title: "Expert Marketing", description: "Professional photography and listings" },
      { title: "Higher Returns", description: "Ideal for collector-grade vehicles" },
    ],
  },
  {
    id: "auction",
    title: "Auction",
    icon: <Gavel className="h-6 w-6" />,
    tagline: "Wide Exposure",
    description:
      "EAG represents your car on Bring a Trailer, Cars&Bids, or PcarMarket.",
    benefits: [
      { title: "Maximum Exposure", description: "Reach thousands of enthusiast buyers" },
      { title: "Quick Timeline", description: "Live auction in 2-3 weeks" },
      { title: "EAG Prep", description: "PPI and maintenance before listing" },
    ],
  },
];

export function SellRequestWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SellOption | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset,
  } = useForm<SellFormData>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      sellOption: "sell",
      existingCustomer: false,
      newsletter: false,
      privacyPolicy: false,
    },
    mode: "onChange",
  });

  const formData = watch();

  const handleSelectOption = useCallback(
    (option: SellOption) => {
      setSelectedOption(option);
      setValue("sellOption", option);
    },
    [setValue]
  );

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return selectedOption !== null;
      case 2:
        return await trigger(["firstName", "lastName", "email", "phone"]);
      case 3:
        return await trigger(["year", "make", "model", "mileage", "vin"]);
      case 4:
        return await trigger("privacyPolicy");
      default:
        return true;
    }
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return selectedOption !== null;
      case 2:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 3:
        return !!(formData.year && formData.make && formData.model && formData.mileage && formData.vin);
      case 4:
        return formData.privacyPolicy;
      default:
        return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 1 && !selectedOption) {
      toast.error("Please select how you'd like to sell your vehicle");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const onSubmit = async (data: SellFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contact/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit");
      }

      toast.success("Your request has been submitted! Check your email for confirmation.", {
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

  const getOptionLabel = (option: SellOption): string => {
    const found = sellOptions.find((o) => o.id === option);
    return found?.title || option;
  };

  if (isSubmitted) {
    return (
      <div className="light-section min-h-[70vh] w-full">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#005A90]">
              <Check className="h-12 w-12 text-white" strokeWidth={3} />
            </div>

            <h2 className="mb-4 font-headline text-2xl tracking-wider text-[#282a30] sm:text-3xl">
              SUBMISSION RECEIVED
            </h2>

            <p className="mb-8 text-lg text-[#6f6e77]">
              Thank you for your interest in {getOptionLabel(selectedOption || "sell").toLowerCase()}ing
              your vehicle with EAG. A member of our acquisitions team will contact you
              within 1 business day to discuss your {formData.year} {formData.make} {formData.model}.
            </p>

            <p className="mb-2 text-sm text-[#6f6e77]">
              A confirmation email has been sent to your inbox.
            </p>

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
                setSelectedOption(null);
                reset();
              }}
              variant="outline"
              className="border-[#005A90] text-[#005A90] hover:bg-[#005A90] hover:text-white"
            >
              Submit Another Vehicle
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="light-section w-full">
      {/* Progress Steps - Full Width with Horizontal Scroll */}
      <div className="border-b border-[#DFE5EA] bg-white">
        <div className="mx-auto max-w-[var(--container-max)] px-page-x py-8">
          <div className="overflow-x-auto">
            <div className="flex min-w-max items-center gap-4 md:min-w-0 md:justify-between">
              {STEPS.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = isStepComplete(step.id);
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="flex flex-1 items-center">
                    <button
                      type="button"
                      onClick={() => goToStep(step.id)}
                      className={cn(
                        "flex min-w-[200px] cursor-pointer items-center gap-4 rounded-lg border-2 px-4 py-3 text-left transition-all md:min-w-0",
                        isActive && "border-[#005A90] bg-[#005A90]/5 shadow-md",
                        isCompleted && !isActive &&
                          "border-[#005A90]/30 bg-white hover:border-[#005A90]/50 hover:bg-[#005A90]/5",
                        !isActive && !isCompleted && "border-[#DFE5EA] bg-white hover:border-[#DFE5EA] hover:bg-[#f8f8f8]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all",
                          isActive && "bg-[#005A90] text-white",
                          isCompleted && !isActive && "bg-[#005A90] text-white",
                          !isActive && !isCompleted && "bg-[#f4f4f4] text-[#CCCCCC]"
                        )}
                      >
                        {isCompleted && !isActive ? (
                          <Check className="h-5 w-5" strokeWidth={3} />
                        ) : (
                          <StepIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div
                          className={cn(
                            "text-sm font-semibold",
                            isActive && "text-[#005A90]",
                            isCompleted && !isActive && "text-[#005A90]",
                            !isActive && !isCompleted && "text-[#CCCCCC]"
                          )}
                        >
                          {step.title}
                        </div>
                        <div
                          className={cn(
                            "text-xs",
                            isActive && "text-[#6f6e77]",
                            isCompleted && !isActive && "text-[#6f6e77]",
                            !isActive && !isCompleted && "text-[#CCCCCC]"
                          )}
                        >
                          {step.description}
                        </div>
                      </div>
                    </button>
                    {index < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "mx-3 h-0.5 w-8 shrink-0 md:flex-1",
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
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[50vh]">
        <div className="mx-auto max-w-[var(--container-max)] px-page-x py-12">
          {/* Step 1: Sell Option */}
          <div className={cn(
            "mb-12 transition-all duration-300",
            currentStep !== 1 && "pointer-events-none opacity-40"
          )}>
            {currentStep !== 1 && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-headline text-xl tracking-wide text-[#282a30]">
                  STEP 1: HOW TO SELL
                </h3>
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="text-sm text-[#005A90] hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            {currentStep === 1 ? (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-headline text-3xl tracking-wider text-[#282a30] sm:text-4xl lg:text-5xl">
                  HOW WOULD YOU LIKE TO SELL?
                </h2>
                <p className="mx-auto max-w-2xl text-base text-[#6f6e77] sm:text-lg">
                  Choose the option that best fits your timeline and goals
                </p>
              </div>

              <div className="space-y-6">
                {sellOptions.map((option) => {
                  const isSelected = selectedOption === option.id;
                  return (
                    <div
                      key={option.id}
                      className={cn(
                        "relative flex w-full flex-col rounded-xl border p-8 text-left transition-all md:flex-row md:items-start md:gap-8",
                        isSelected
                          ? "border-[#2E90FA] border-4 bg-white shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      )}
                    >
                      {/* Select Button */}
                      <button
                        type="button"
                        onClick={() => handleSelectOption(option.id)}
                        className={cn(
                          "absolute right-6 top-6 flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:scale-105",
                          isSelected
                            ? "bg-[#2E90FA] text-white shadow-md"
                            : "border-2 border-[#2E90FA] bg-white text-[#2E90FA] hover:bg-[#2E90FA]/5"
                        )}
                        aria-label={`Select ${option.title}`}
                      >
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                            isSelected
                              ? "border-white bg-white text-[#2E90FA]"
                              : "border-[#2E90FA] bg-transparent"
                          )}
                        >
                          {isSelected && <Check className="h-4 w-4" strokeWidth={3} />}
                        </div>
                        <span>{isSelected ? "Selected" : "Select"}</span>
                      </button>

                      {/* Icon */}
                      <div
                        className={cn(
                          "mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl transition-colors md:mb-0",
                          isSelected
                            ? "bg-[#005A90] text-white"
                            : "bg-[#f4f4f4] text-[#6f6e77]"
                        )}
                      >
                        {option.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pr-32">
                        <div className="mb-3 flex items-center gap-3">
                          <h3 className="font-headline text-xl tracking-wide text-[#282a30] sm:text-2xl">
                            {option.title}
                          </h3>
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-medium",
                              isSelected
                                ? "bg-[#005A90]/10 text-[#005A90]"
                                : "bg-[#f4f4f4] text-[#6f6e77]"
                            )}
                          >
                            {option.tagline}
                          </span>
                        </div>

                        <p className="mb-6 text-base leading-relaxed text-[#6f6e77]">
                          {option.description}
                        </p>

                        <div className="space-y-3">
                          {option.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle2
                                className={cn(
                                  "mt-1 h-5 w-5 shrink-0",
                                  isSelected ? "text-[#005A90]" : "text-[#CCCCCC]"
                                )}
                              />
                              <div>
                                <span className="font-semibold text-[#282a30]">
                                  {benefit.title}
                                </span>
                                <span className="text-[#6f6e77]"> — {benefit.description}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            ) : (
              <div className="rounded-xl border border-[#DFE5EA] bg-white p-6">
                {selectedOption ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#005A90]/10 text-[#005A90]">
                      {sellOptions.find((o) => o.id === selectedOption)?.icon}
                    </div>
                    <div>
                      <p className="font-medium text-[#282a30]">
                        {getOptionLabel(selectedOption)}
                      </p>
                      <p className="text-sm text-[#6f6e77]">
                        {sellOptions.find((o) => o.id === selectedOption)?.tagline}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#6f6e77]">No option selected yet</p>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Contact Information */}
          <div className={cn(
            "mb-12 transition-all duration-300",
            currentStep !== 2 && "pointer-events-none opacity-40"
          )}>
            {currentStep !== 2 && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-headline text-xl tracking-wide text-[#282a30]">
                  STEP 2: CONTACT INFORMATION
                </h3>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="text-sm text-[#005A90] hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            {currentStep === 2 ? (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12">
                <TitleBlock
                  title="CONTACT INFORMATION"
                  description="How should we reach you about your vehicle?"
                />
              </div>

              <div className="mx-auto max-w-2xl space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[#282a30]">
                      First Name <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      placeholder="John"
                      disabled={isLoading}
                      className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-[#F90020]">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[#282a30]">
                      Last Name <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      placeholder="Smith"
                      disabled={isLoading}
                      className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-[#F90020]">{errors.lastName.message}</p>
                    )}
                  </div>
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
              </div>
            </div>
            ) : (
              <div className="rounded-xl border border-[#DFE5EA] bg-white p-6">
                {formData.firstName || formData.lastName || formData.email || formData.phone ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-[#6f6e77]">Name</p>
                      <p className="font-medium text-[#282a30]">
                        {formData.firstName || "—"} {formData.lastName || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6f6e77]">Phone</p>
                      <p className="font-medium text-[#282a30]">{formData.phone || "—"}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-[#6f6e77]">Email</p>
                      <p className="font-medium text-[#282a30]">{formData.email || "—"}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#6f6e77]">No contact information entered yet</p>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Vehicle Information */}
          <div className={cn(
            "mb-12 transition-all duration-300",
            currentStep !== 3 && "pointer-events-none opacity-40"
          )}>
            {currentStep !== 3 && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-headline text-xl tracking-wide text-[#282a30]">
                  STEP 3: VEHICLE INFORMATION
                </h3>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="text-sm text-[#005A90] hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            {currentStep === 3 ? (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12">
                <TitleBlock
                  title="VEHICLE INFORMATION"
                  description="Tell us about your BMW"
                />
              </div>

              <div className="mx-auto max-w-2xl space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-[#282a30]">
                      Year <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="year"
                      {...register("year")}
                      placeholder="2020"
                      disabled={isLoading}
                      className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                    />
                    {errors.year && (
                      <p className="text-sm text-[#F90020]">{errors.year.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="make" className="text-[#282a30]">
                      Make <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="make"
                      {...register("make")}
                      placeholder="BMW"
                      disabled={isLoading}
                      className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                    />
                    {errors.make && (
                      <p className="text-sm text-[#F90020]">{errors.make.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-[#282a30]">
                      Model <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="model"
                      {...register("model")}
                      placeholder="M3"
                      disabled={isLoading}
                      className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                    />
                    {errors.model && (
                      <p className="text-sm text-[#F90020]">{errors.model.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mileage" className="text-[#282a30]">
                      Mileage <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="mileage"
                      {...register("mileage")}
                      placeholder="45,000"
                      disabled={isLoading}
                      className="h-12 border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                    />
                    {errors.mileage && (
                      <p className="text-sm text-[#F90020]">{errors.mileage.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vin" className="text-[#282a30]">
                      VIN <span className="text-[#F90020]">*</span>
                    </Label>
                    <Input
                      id="vin"
                      {...register("vin")}
                      placeholder="WBSWD93508PX12345"
                      disabled={isLoading}
                      className="h-12 border-[#DFE5EA] bg-white font-mono text-base uppercase focus:border-[#005A90] focus:ring-[#2E90FA]"
                      maxLength={17}
                    />
                    {errors.vin && (
                      <p className="text-sm text-[#F90020]">{errors.vin.message}</p>
                    )}
                    <p className="text-xs text-[#6f6e77]">17-character Vehicle Identification Number</p>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              <div className="rounded-xl border border-[#DFE5EA] bg-white p-6">
                {formData.year || formData.make || formData.model || formData.mileage || formData.vin ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#6f6e77]">Vehicle</p>
                      <p className="font-medium text-[#282a30]">
                        {formData.year || "—"} {formData.make || "—"} {formData.model || "—"}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-[#6f6e77]">Mileage</p>
                        <p className="font-medium text-[#282a30]">{formData.mileage || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6f6e77]">VIN</p>
                        <p className="font-mono text-sm text-[#282a30]">{formData.vin?.toUpperCase() || "—"}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#6f6e77]">No vehicle information entered yet</p>
                )}
              </div>
            )}
          </div>

          {/* Step 4: Additional Details */}
          <div className={cn(
            "mb-12 transition-all duration-300",
            currentStep !== 4 && "pointer-events-none opacity-40"
          )}>
            {currentStep !== 4 && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-headline text-xl tracking-wide text-[#282a30]">
                  STEP 4: ADDITIONAL DETAILS
                </h3>
                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  className="text-sm text-[#005A90] hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            {currentStep === 4 ? (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12">
                <TitleBlock
                  title="ADDITIONAL DETAILS"
                  description="Share any additional information about your vehicle"
                />
              </div>

              <div className="mx-auto max-w-2xl space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-[#282a30]">
                    Vehicle Notes <span className="text-[#6f6e77]">(Optional)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Tell us about your vehicle's condition, modifications, service history, recent maintenance, or anything else that would help us evaluate it..."
                    rows={6}
                    disabled={isLoading}
                    className="border-[#DFE5EA] bg-white text-base focus:border-[#005A90] focus:ring-[#2E90FA]"
                  />
                </div>

                <div className="space-y-4 rounded-lg border border-[#DFE5EA] bg-[#f8f8f8] p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="existingCustomer"
                      checked={formData.existingCustomer}
                      onCheckedChange={(checked) =>
                        setValue("existingCustomer", checked as boolean)
                      }
                      disabled={isLoading}
                      className="mt-0.5"
                    />
                    <Label htmlFor="existingCustomer" className="cursor-pointer font-normal text-[#282a30]">
                      I am an existing EAG customer
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) => setValue("newsletter", checked as boolean)}
                      disabled={isLoading}
                      className="mt-0.5"
                    />
                    <Label htmlFor="newsletter" className="cursor-pointer font-normal text-[#282a30]">
                      Sign up for our newsletter to receive special offers and updates
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="privacyPolicy"
                      checked={formData.privacyPolicy}
                      onCheckedChange={(checked) => setValue("privacyPolicy", checked as boolean)}
                      disabled={isLoading}
                      className="mt-0.5"
                    />
                    <div>
                      <Label htmlFor="privacyPolicy" className="cursor-pointer font-normal text-[#282a30]">
                        I agree with the{" "}
                        <a href="/privacy" className="text-[#005A90] hover:underline">
                          Privacy Policy
                        </a>{" "}
                        <span className="text-[#F90020]">*</span>
                      </Label>
                    </div>
                  </div>
                  {errors.privacyPolicy && (
                    <p className="text-sm text-[#F90020]">{errors.privacyPolicy.message}</p>
                  )}
                </div>
              </div>
            </div>
            ) : (
              <div className="rounded-xl border border-[#DFE5EA] bg-white p-6">
                {formData.notes || formData.existingCustomer || formData.newsletter || formData.privacyPolicy ? (
                  <div className="space-y-3">
                    {formData.notes && (
                      <div>
                        <p className="text-xs text-[#6f6e77]">Notes</p>
                        <p className="line-clamp-2 text-sm text-[#282a30]">{formData.notes}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formData.existingCustomer && (
                        <span className="rounded-full bg-[#005A90]/10 px-3 py-1 text-xs text-[#005A90]">
                          Existing Customer
                        </span>
                      )}
                      {formData.newsletter && (
                        <span className="rounded-full bg-[#005A90]/10 px-3 py-1 text-xs text-[#005A90]">
                          Newsletter
                        </span>
                      )}
                      {formData.privacyPolicy && (
                        <span className="rounded-full bg-[#005A90]/10 px-3 py-1 text-xs text-[#005A90]">
                          Privacy Policy Agreed
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#6f6e77]">No additional details entered yet</p>
                )}
              </div>
            )}
          </div>

          {/* Step 5: Review */}
          <div className={cn(
            "transition-all duration-300",
            currentStep !== 5 && "pointer-events-none opacity-40"
          )}>
            {currentStep !== 5 && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-headline text-xl tracking-wide text-[#282a30]">
                  STEP 5: REVIEW & SUBMIT
                </h3>
                <button
                  type="button"
                  onClick={() => goToStep(5)}
                  className="text-sm text-[#005A90] hover:underline"
                >
                  View
                </button>
              </div>
            )}
            {currentStep === 5 ? (
            <div className="animate-in fade-in duration-300">
              <div className="mb-12">
                <TitleBlock
                  title="REVIEW YOUR SUBMISSION"
                  description="Please confirm all details before submitting"
                />
              </div>

              <div className="mx-auto max-w-3xl space-y-6">
                {/* Sell Option */}
                <div className="rounded-xl border border-[#DFE5EA] bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-[#282a30]">Sell Option</h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-[#005A90] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedOption && (
                      <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#005A90]/10 text-[#005A90]">
                          {sellOptions.find((o) => o.id === selectedOption)?.icon}
                        </div>
                        <div>
                          <p className="font-medium text-[#282a30]">
                            {getOptionLabel(selectedOption)}
                          </p>
                          <p className="text-sm text-[#6f6e77]">
                            {sellOptions.find((o) => o.id === selectedOption)?.tagline}
                          </p>
                        </div>
                      </>
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
                      <p className="font-medium text-[#282a30]">
                        {formData.firstName} {formData.lastName}
                      </p>
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
                        {formData.year} {formData.make} {formData.model}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-[#6f6e77]">Mileage</p>
                        <p className="font-medium text-[#282a30]">{formData.mileage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6f6e77]">VIN</p>
                        <p className="font-mono text-sm text-[#282a30]">{formData.vin?.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {formData.notes && (
                  <div className="rounded-xl border border-[#DFE5EA] bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-[#282a30]">Additional Notes</h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="text-sm text-[#005A90] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="whitespace-pre-wrap text-[#6f6e77]">{formData.notes}</p>
                  </div>
                )}

                <p className="text-center text-xs text-[#6f6e77]">
                  By submitting this form, you agree to be contacted by Enthusiast Auto regarding
                  your vehicle.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-[#DFE5EA] bg-white p-6">
                <p className="text-sm text-[#6f6e77]">Complete all steps to review your submission</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-[#DFE5EA] bg-white">
          <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-page-x py-6">
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

            <div className="flex items-center gap-4">
              <div className="text-sm text-[#6f6e77]">
                Step {currentStep} of {STEPS.length}
              </div>
              {currentStep === 5 && (
                <div className="text-xs text-[#6f6e77]">
                  {[1, 2, 3, 4].filter(step => isStepComplete(step)).length} of 4 steps complete
                </div>
              )}
            </div>

            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={isLoading}
                className="gap-2 bg-[#005A90] text-white hover:bg-[#005A90]/90"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !isStepComplete(1) || !isStepComplete(2) || !isStepComplete(3) || !isStepComplete(4)}
                className="gap-2 bg-[#005A90] px-8 text-white hover:bg-[#005A90]/90 disabled:cursor-not-allowed disabled:opacity-50"
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

