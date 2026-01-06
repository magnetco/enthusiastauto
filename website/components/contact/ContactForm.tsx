"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
	Car,
	Wrench,
	Package,
	HelpCircle,
	CheckCircle2,
	ArrowRight,
} from "lucide-react";

const contactFormSchema = z.object({
	name: z.string().min(2, "Name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().optional(),
	department: z.enum(["sales", "services", "parts", "general"]),
	subject: z.string().min(1, "Subject is required"),
	message: z.string().min(10, "Please provide more detail"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

type Department = "sales" | "services" | "parts" | "general";

interface DepartmentOption {
	id: Department;
	label: string;
	icon: React.ReactNode;
	description: string;
	placeholder: string;
}

const departments: DepartmentOption[] = [
	{
		id: "sales",
		label: "Vehicle Sales",
		icon: <Car className="h-5 w-5" />,
		description: "Inquire about vehicles, pricing, or availability",
		placeholder: "I'm interested in a specific vehicle...",
	},
	{
		id: "services",
		label: "Service & Repair",
		icon: <Wrench className="h-5 w-5" />,
		description: "Schedule service, repairs, or restoration work",
		placeholder: "I'd like to schedule service for my BMW...",
	},
	{
		id: "parts",
		label: "Parts & Accessories",
		icon: <Package className="h-5 w-5" />,
		description: "Questions about parts, fitment, or orders",
		placeholder: "I'm looking for a specific part...",
	},
	{
		id: "general",
		label: "General Inquiry",
		icon: <HelpCircle className="h-5 w-5" />,
		description: "Other questions, feedback, or partnerships",
		placeholder: "I have a question about...",
	},
];

interface ContactFormProps {
	/** Pre-select a department */
	defaultDepartment?: Department;
	/** Show compact version without department selection */
	compact?: boolean;
}

export function ContactForm({
	defaultDepartment = "general",
	compact = false,
}: ContactFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [selectedDepartment, setSelectedDepartment] =
		useState<Department>(defaultDepartment);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			department: defaultDepartment,
		},
	});

	const handleDepartmentSelect = (dept: Department) => {
		setSelectedDepartment(dept);
		setValue("department", dept);
	};

	const onSubmit = async (data: ContactFormData) => {
		setIsLoading(true);
		try {
			// TODO: Implement actual contact form submission
			console.log("Contact form submission:", data);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast.success("Message sent! We'll get back to you soon.");
			setIsSubmitted(true);
			reset();
		} catch {
			toast.error("Something went wrong. Please try calling us.");
		} finally {
			setIsLoading(false);
		}
	};

	const currentDepartment = departments.find((d) => d.id === selectedDepartment)!;

	if (isSubmitted) {
		return (
			<Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
				<CardContent className="py-12 text-center">
					<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
						<CheckCircle2 className="h-8 w-8 text-green-500" />
					</div>
					<h3 className="mb-2 text-2xl font-bold text-foreground">
						Message Sent!
					</h3>
					<p className="mb-6 text-muted-foreground">
						Thank you for reaching out. Our{" "}
						{currentDepartment.label.toLowerCase()} team will get back to you
						within 1 business day.
					</p>
					<Button onClick={() => setIsSubmitted(false)} variant="outline">
						Send Another Message
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Send Us a Message</CardTitle>
				<CardDescription>
					Fill out the form below and we'll respond within 1 business day
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Department Selection */}
					{!compact && (
						<div className="space-y-3">
							<Label>What can we help you with?</Label>
							<div className="grid gap-3 sm:grid-cols-2">
								{departments.map((dept) => (
									<button
										key={dept.id}
										type="button"
										onClick={() => handleDepartmentSelect(dept.id)}
										className={cn(
											"group flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
											selectedDepartment === dept.id
												? "border-primary bg-primary/5 ring-1 ring-primary"
												: "border-border hover:border-primary/50 hover:bg-muted/50"
										)}
									>
										<div
											className={cn(
												"mt-0.5 rounded-md p-2 transition-colors",
												selectedDepartment === dept.id
													? "bg-primary text-primary-foreground"
													: "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
											)}
										>
											{dept.icon}
										</div>
										<div className="flex-1">
											<div className="font-medium text-foreground">
												{dept.label}
											</div>
											<div className="mt-0.5 text-sm text-muted-foreground">
												{dept.description}
											</div>
										</div>
									</button>
								))}
							</div>
							<input type="hidden" {...register("department")} />
						</div>
					)}

					{/* Contact Information */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name *</Label>
							<Input
								id="name"
								{...register("name")}
								placeholder="Your full name"
								disabled={isLoading}
							/>
							{errors.name && (
								<p className="text-sm text-red-600">{errors.name.message}</p>
							)}
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="email">Email *</Label>
								<Input
									id="email"
									type="email"
									{...register("email")}
									placeholder="you@example.com"
									disabled={isLoading}
								/>
								{errors.email && (
									<p className="text-sm text-red-600">{errors.email.message}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Phone</Label>
								<Input
									id="phone"
									{...register("phone")}
									placeholder="(555) 123-4567"
									disabled={isLoading}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subject">Subject *</Label>
							<Input
								id="subject"
								{...register("subject")}
								placeholder="How can we help?"
								disabled={isLoading}
							/>
							{errors.subject && (
								<p className="text-sm text-red-600">{errors.subject.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="message">Message *</Label>
							<Textarea
								id="message"
								{...register("message")}
								rows={5}
								placeholder={currentDepartment.placeholder}
								disabled={isLoading}
							/>
							{errors.message && (
								<p className="text-sm text-red-600">{errors.message.message}</p>
							)}
						</div>
					</div>

					<Button
						type="submit"
						size="lg"
						disabled={isLoading}
						className="w-full gap-2"
					>
						{isLoading ? (
							"Sending..."
						) : (
							<>
								Send Message
								<ArrowRight className="h-4 w-4" />
							</>
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
