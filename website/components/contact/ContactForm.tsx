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

const contactFormSchema = z.object({
	name: z.string().min(2, "Name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().optional(),
	subject: z.string().min(1, "Subject is required"),
	message: z.string().min(10, "Please provide more detail"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactFormSchema),
	});

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

	if (isSubmitted) {
		return (
			<Card>
				<CardContent className="py-12 text-center">
					<div className="mb-4 text-6xl">✓</div>
					<h3 className="mb-2 text-2xl font-bold text-foreground">
						Message Sent!
					</h3>
					<p className="mb-6 text-muted-foreground">
						Thank you for reaching out. We'll get back to you as soon
						as possible.
					</p>
					<Button
						onClick={() => setIsSubmitted(false)}
						variant="outline"
					>
						Send Another Message
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Send a Message</CardTitle>
				<CardDescription>
					Fill out the form below and we'll respond within 1 business
					day
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name *</Label>
						<Input
							id="name"
							{...register("name")}
							disabled={isLoading}
						/>
						{errors.name && (
							<p className="text-sm text-red-600">
								{errors.name.message}
							</p>
						)}
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
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
						<div className="space-y-2">
							<Label htmlFor="phone">Phone</Label>
							<Input
								id="phone"
								{...register("phone")}
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
							<p className="text-sm text-red-600">
								{errors.subject.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="message">Message *</Label>
						<Textarea
							id="message"
							{...register("message")}
							rows={5}
							placeholder="Tell us more about your inquiry..."
							disabled={isLoading}
						/>
						{errors.message && (
							<p className="text-sm text-red-600">
								{errors.message.message}
							</p>
						)}
					</div>

					<Button
						type="submit"
						size="lg"
						disabled={isLoading}
						className="w-full"
					>
						{isLoading ? "Sending..." : "Send Message"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

