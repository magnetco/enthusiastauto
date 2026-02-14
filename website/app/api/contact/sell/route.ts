import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { z } from "zod";
import { sendSellSubmissionEmails } from "@/lib/email/sell-submission";

// Sell submission validation schema
const sellSubmissionSchema = z.object({
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
	sellOption: z.enum(["sell", "consign", "auction"]).default("sell"),
	existingCustomer: z.boolean().default(false),
	newsletter: z.boolean().default(false),
	privacyPolicy: z.literal(true).optional(), // Already validated on frontend
});

/**
 * POST /api/contact/sell
 * Submit a sell/consign/auction form
 * Public route - no authentication required
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validationResult = sellSubmissionSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const data = validationResult.data;

		// Create sell submission in database
		const sellSubmission = await prisma.sellSubmission.create({
			data: {
				id: crypto.randomUUID(),
				firstName: data.firstName,
				lastName: data.lastName,
				phone: data.phone,
				email: data.email,
				make: data.make,
				model: data.model,
				year: data.year,
				mileage: data.mileage,
				vin: data.vin.toUpperCase(), // Store VIN in uppercase
				notes: data.notes || null,
				sellOption: data.sellOption,
				existingCustomer: data.existingCustomer,
				newsletter: data.newsletter,
				status: "pending",
				updatedAt: new Date(),
			},
		});

		console.log("Sell submission created:", {
			id: sellSubmission.id,
			sellOption: sellSubmission.sellOption,
			name: `${sellSubmission.firstName} ${sellSubmission.lastName}`,
			vehicle: `${sellSubmission.year} ${sellSubmission.make} ${sellSubmission.model}`,
		});

		// Send confirmation emails (async, don't block response)
		sendSellSubmissionEmails({
			submissionId: sellSubmission.id,
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone,
			sellOption: data.sellOption,
			year: data.year,
			make: data.make,
			model: data.model,
			mileage: data.mileage,
			vin: data.vin.toUpperCase(),
			notes: data.notes,
			existingCustomer: data.existingCustomer,
			newsletter: data.newsletter,
		}).then((result) => {
			if (result.success) {
				console.log("Sell submission emails sent:", {
					customerId: result.customerEmailId,
					adminId: result.adminEmailId,
				});
			} else {
				console.error("Failed to send sell submission emails:", result.error);
			}
		}).catch((err) => {
			console.error("Email sending error:", err);
		});

		// TODO: Subscribe to newsletter if newsletter === true

		return NextResponse.json({
			success: true,
			submissionId: sellSubmission.id,
			message: "Form submitted successfully",
		});
	} catch (error) {
		console.error("Sell submission error:", error);
		return NextResponse.json(
			{
				error: "Failed to submit form. Please try again or call us directly at 513-554-1269.",
			},
			{ status: 500 }
		);
	}
}

/**
 * GET /api/contact/sell
 * Retrieve all sell submissions (for admin use)
 * TODO: Add authentication and authorization
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");
		const sellOption = searchParams.get("sellOption");
		const limit = parseInt(searchParams.get("limit") || "50");

		const sellSubmissions = await prisma.sellSubmission.findMany({
			where: {
				...(status ? { status } : {}),
				...(sellOption ? { sellOption } : {}),
			},
			orderBy: { createdAt: "desc" },
			take: limit,
		});

		return NextResponse.json({
			success: true,
			submissions: sellSubmissions,
			count: sellSubmissions.length,
		});
	} catch (error) {
		console.error("Sell submission retrieval error:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve sell submissions" },
			{ status: 500 }
		);
	}
}
