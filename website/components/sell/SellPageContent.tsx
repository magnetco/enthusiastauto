"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Section from "@/components/layout/section";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
	DollarSign,
	Handshake,
	Gavel,
	Clock,
	Shield,
	TrendingUp,
	CheckCircle2,
} from "lucide-react";

// Form validation schema
const sellFormSchema = z.object({
	firstName: z.string().min(2, "First name is required"),
	lastName: z.string().min(2, "Last name is required"),
	phone: z.string().min(10, "Please enter a valid phone number"),
	email: z.string().email("Invalid email address"),
	make: z.string().min(1, "Make is required"),
	model: z.string().min(1, "Model is required"),
	year: z.string().min(4, "Year is required"),
	mileage: z.string().min(1, "Mileage is required"),
	vin: z.string().min(17, "VIN must be 17 characters").max(17),
	notes: z.string().optional(),
	existingCustomer: z.boolean(),
	newsletter: z.boolean(),
	privacyPolicy: z.boolean().refine((val) => val === true, {
		message: "You must agree to the privacy policy",
	}),
});

type SellFormData = z.infer<typeof sellFormSchema>;

type SellOption = "sell" | "consign" | "auction";

interface SellOptionData {
	id: SellOption;
	title: string;
	icon: React.ReactNode;
	description: string;
	benefits: { title: string; description: string }[];
}

const sellOptions: SellOptionData[] = [
	{
		id: "sell",
		title: "Sell",
		icon: <DollarSign className="h-8 w-8" />,
		description:
			"At Enthusiast Auto Group, we specialize in buying M-Series vehicles directly from you. We provide immediate payment and prompt payoff of any liens on your vehicle.",
		benefits: [
			{
				title: "Convenience",
				description:
					"Quick and straightforward purchase process from the EAG buying team.",
			},
			{
				title: "Focus",
				description:
					"Specializes in and focuses on M-Series BMWs that will be represented with the EAG collection.",
			},
			{
				title: "Control",
				description:
					"Direct transaction with immediate payment from the EAG financial team.",
			},
			{
				title: "Time",
				description:
					"Selling directly to EAG is the fastest transaction for you if you're ready to move on from your unit today.",
			},
			{
				title: "Preservation",
				description:
					"Each unit that EAG purchases will complete the full rejuvenation process prior to listing.",
			},
			{
				title: "Financial",
				description:
					'EAG offers market cash value for these units prior to investing heavily in the rejuvenation to create an "EAG Signature" car.',
			},
		],
	},
	{
		id: "consign",
		title: "Consign",
		icon: <Handshake className="h-8 w-8" />,
		description:
			"Consigning your investment is a great second option for many clients. We handle the sale readiness, sales process, and transaction on your behalf.",
		benefits: [
			{
				title: "Convenience",
				description:
					"We handle the sale readiness, sales process, and sale transaction on your behalf eliminating your stress load.",
			},
			{
				title: "Focus",
				description:
					"Specializes in and focuses on M-Series BMWs that will be represented with the EAG collection.",
			},
			{
				title: "Control",
				description:
					"Comprehensive marketing package and expert valuation with a standard consignment fee paid only after successful sale.",
			},
			{
				title: "Preservation",
				description:
					"Each unit on consignment completes the full rejuvenation process prior to listing.",
			},
			{
				title: "Financial",
				description:
					"Great for blue chip/collector grade units that demand an above average sale price. The client generally receives a larger amount.",
			},
		],
	},
	{
		id: "auction",
		title: "Auction",
		icon: <Gavel className="h-8 w-8" />,
		description:
			"If maximizing audience exposure and selling quickly is your main interest, we recommend having EAG represent your car on Bring a Trailer, Cars&Bids, or PcarMarket.",
		benefits: [
			{
				title: "Convenience",
				description:
					"Our team handles everything, from sale readiness, auction setup, inquiries, and transaction, minimizing your time commitment.",
			},
			{
				title: "Focus",
				description:
					"Ideal for those clients that want a combination of market value and a quick sale transaction.",
			},
			{
				title: "Control",
				description:
					"We prepare the unit for the auction audience and work with the auction platform on the reserve price.",
			},
			{
				title: "Time",
				description:
					"Once this direction is decided it will take 2-3 weeks for your vehicle to be properly represented and live.",
			},
			{
				title: "Preservation",
				description:
					"Each unit going to auction receives an EAG PPI and general maintenance prior to listing.",
			},
			{
				title: "Financial",
				description:
					"Great for driver's cars that will bring market value on a short timeline.",
			},
		],
	},
];

export function SellPageContent() {
	const [selectedOption, setSelectedOption] = useState<SellOption>("sell");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<SellFormData>({
		resolver: zodResolver(sellFormSchema),
		defaultValues: {
			existingCustomer: false,
			newsletter: false,
		},
	});

	const onSubmit = async (data: SellFormData) => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/contact/sell", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...data, sellOption: selectedOption }),
			});

			if (!response.ok) {
				throw new Error("Failed to submit");
			}

			toast.success("Your request has been submitted! We'll contact you shortly.");
			setIsSubmitted(true);
			reset();
		} catch {
			toast.error("Something went wrong. Please try calling us at 513-554-1269.");
		} finally {
			setIsLoading(false);
		}
	};

	const currentOption = sellOptions.find((opt) => opt.id === selectedOption)!;

	return (
		<>
			<PageHero
				size="medium"
				title={
					<>
						Allow EAG To
						<br />
						<span className="text-blue-400">Represent Your Car</span>
					</>
				}
				subtitle="At Enthusiast Auto Group, we understand that for many enthusiasts, their cars are more than just vehicles—they're family members. Parting with them can be a challenging decision, and we're here to make that process as smooth as possible."
				backgroundImage="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop"
			/>

			{/* Sell Options Tabs */}
			<Section className="py-8 sm:py-12 lg:py-16">
				<div className="mb-8 flex flex-wrap justify-center gap-4">
					{sellOptions.map((option) => (
						<button
							key={option.id}
							onClick={() => setSelectedOption(option.id)}
							className={`flex items-center gap-3 rounded-lg border-2 px-6 py-4 text-left transition-all ${
								selectedOption === option.id
									? "border-primary bg-primary/10 text-primary"
									: "border-border bg-card hover:border-primary/50"
							}`}
						>
							<div
								className={`rounded-lg p-2 ${
									selectedOption === option.id
										? "bg-primary/20"
										: "bg-muted"
								}`}
							>
								{option.icon}
							</div>
							<span className="text-lg font-semibold">{option.title}</span>
						</button>
					))}
				</div>

				{/* Selected Option Details */}
				<Card className="mb-12">
					<CardHeader>
						<div className="flex items-center gap-4">
							<div className="rounded-lg bg-primary/10 p-3 text-primary">
								{currentOption.icon}
							</div>
							<div>
								<CardTitle className="text-2xl">{currentOption.title}</CardTitle>
								<CardDescription className="mt-2 text-base">
									{currentOption.description}
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{currentOption.benefits.map((benefit, index) => (
								<div
									key={index}
									className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
								>
									<div className="mb-2 flex items-center gap-2">
										<CheckCircle2 className="h-5 w-5 text-primary" />
										<h4 className="font-semibold">{benefit.title}</h4>
									</div>
									<p className="text-sm text-muted-foreground">
										{benefit.description}
									</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</Section>

			{/* Vehicle Submission Form */}
			<Section className="py-8 sm:py-12 lg:py-16">
				<div className="mb-8 text-center">
					<h2 className="mb-4 text-title-2 font-bold text-foreground">
						Let Us Evaluate the Best Option for Your Vehicle
					</h2>
					<p className="mx-auto max-w-2xl text-body-large text-muted-foreground">
						Simply enter your vehicle information below along with your contact
						information and we will contact you shortly.
					</p>
				</div>

				{isSubmitted ? (
					<Card className="mx-auto max-w-5xl">
						<CardContent className="py-12 text-center">
							<div className="mb-4 text-6xl">✓</div>
							<h3 className="mb-2 text-2xl font-bold text-foreground">
								Message Sent. Thank You!
							</h3>
							<p className="mb-6 text-muted-foreground">
								A member of our team will contact you shortly to discuss your
								vehicle.
							</p>
							<Button onClick={() => setIsSubmitted(false)} variant="outline">
								Submit Another Vehicle
							</Button>
						</CardContent>
					</Card>
				) : (
					<Card className="mx-auto max-w-5xl">
						<CardHeader>
							<CardTitle>Vehicle Information</CardTitle>
							<CardDescription>
								Fields marked with (*) are required.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								{/* Contact Info - 4 columns to match real website */}
								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
									<div className="space-y-2">
										<Label htmlFor="firstName">First Name *</Label>
										<Input
											id="firstName"
											{...register("firstName")}
											disabled={isLoading}
										/>
										{errors.firstName && (
											<p className="text-sm text-red-600">
												{errors.firstName.message}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">Last Name *</Label>
										<Input
											id="lastName"
											{...register("lastName")}
											disabled={isLoading}
										/>
										{errors.lastName && (
											<p className="text-sm text-red-600">
												{errors.lastName.message}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="phone">Phone Number *</Label>
										<Input
											id="phone"
											{...register("phone")}
											disabled={isLoading}
										/>
										{errors.phone && (
											<p className="text-sm text-red-600">
												{errors.phone.message}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email *</Label>
										<Input
											id="email"
											type="email"
											{...register("email")}
											disabled={isLoading}
										/>
										{errors.email && (
											<p className="text-sm text-red-600">
												{errors.email.message}
											</p>
										)}
									</div>
								</div>

								{/* Vehicle Info - 4 columns to match real website */}
								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
									<div className="space-y-2">
										<Label htmlFor="make">Make *</Label>
										<Input
											id="make"
											{...register("make")}
											disabled={isLoading}
										/>
										{errors.make && (
											<p className="text-sm text-red-600">
												{errors.make.message}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="model">Model *</Label>
										<Input
											id="model"
											{...register("model")}
											disabled={isLoading}
										/>
										{errors.model && (
											<p className="text-sm text-red-600">
												{errors.model.message}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="year">Year *</Label>
										<Input
											id="year"
											{...register("year")}
											disabled={isLoading}
										/>
										{errors.year && (
											<p className="text-sm text-red-600">
												{errors.year.message}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="mileage">Mileage *</Label>
										<Input
											id="mileage"
											{...register("mileage")}
											disabled={isLoading}
										/>
										{errors.mileage && (
											<p className="text-sm text-red-600">
												{errors.mileage.message}
											</p>
										)}
									</div>
								</div>

								{/* VIN and Notes */}
								<div className="grid gap-4 sm:grid-cols-4">
									<div className="space-y-2">
										<Label htmlFor="vin">VIN *</Label>
										<Input
											id="vin"
											{...register("vin")}
											disabled={isLoading}
										/>
										{errors.vin && (
											<p className="text-sm text-red-600">
												{errors.vin.message}
											</p>
										)}
									</div>
									<div className="space-y-2 sm:col-span-3">
										<Label htmlFor="notes">Vehicle Notes</Label>
										<Textarea
											id="notes"
											{...register("notes")}
											placeholder="Tell us about your vehicle's condition, modifications, service history, etc."
											rows={4}
											disabled={isLoading}
										/>
									</div>
								</div>

								{/* Checkboxes */}
								<div className="space-y-4">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="existingCustomer"
											checked={watch("existingCustomer")}
											onCheckedChange={(checked) =>
												setValue("existingCustomer", checked as boolean)
											}
											disabled={isLoading}
										/>
										<Label htmlFor="existingCustomer" className="font-normal">
											I am an existing EAG customer
										</Label>
									</div>

									<div className="flex items-center space-x-2">
										<Checkbox
											id="newsletter"
											checked={watch("newsletter")}
											onCheckedChange={(checked) =>
												setValue("newsletter", checked as boolean)
											}
											disabled={isLoading}
										/>
										<Label htmlFor="newsletter" className="font-normal">
											Sign up for our Newsletter to receive special offers +
											updates
										</Label>
									</div>

									<div className="flex items-center space-x-2">
										<Checkbox
											id="privacyPolicy"
											checked={watch("privacyPolicy")}
											onCheckedChange={(checked) =>
												setValue("privacyPolicy", checked as boolean)
											}
											disabled={isLoading}
										/>
										<Label htmlFor="privacyPolicy" className="font-normal">
											I agree with the{" "}
											<a
												href="/privacy"
												className="text-primary hover:underline"
											>
												Privacy Policy
											</a>{" "}
											*
										</Label>
									</div>
									{errors.privacyPolicy && (
										<p className="text-sm text-red-600">
											{errors.privacyPolicy.message}
										</p>
									)}
								</div>

								<Button
									type="submit"
									size="lg"
									disabled={isLoading}
									className="w-full"
								>
									{isLoading ? "Submitting..." : "Submit Form"}
								</Button>
							</form>
						</CardContent>
					</Card>
				)}
			</Section>
		</>
	);
}

