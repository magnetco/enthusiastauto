import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { z } from "zod";
import { sendServiceRequestNotification } from "@/lib/email/service-request";

// Valid service types
const validServiceTypes = ["conditioning", "rejuvenation", "mechanical", "cosmetic", "not-sure"] as const;

// Service request validation schema - supports comma-separated multiple services
const serviceRequestSchema = z.object({
  serviceType: z.string().refine(
    (val) => {
      const types = val.split(",").map(t => t.trim());
      return types.every(t => validServiceTypes.includes(t as typeof validServiceTypes[number]));
    },
    { message: "Invalid service type" }
  ),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  vehicleYear: z.string().min(4),
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  vin: z.string().optional(),
  description: z.string().min(20),
  existingCustomer: z.enum(["yes", "no"]).optional(),
});

/**
 * POST /api/services/request
 * Submit a service request form
 * Public route - no authentication required
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = serviceRequestSchema.safeParse(body);

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

    // Create service request in database
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        id: crypto.randomUUID(),
        serviceType: data.serviceType,
        name: data.name,
        email: data.email,
        phone: data.phone,
        vehicleYear: data.vehicleYear,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        vin: data.vin || null,
        description: data.description,
        existingCustomer: data.existingCustomer === "yes",
        status: "pending",
        updatedAt: new Date(),
      },
    });

    // Send email notification to service team
    // Note: We don't await this or check result to avoid blocking the response
    sendServiceRequestNotification({
      serviceType: serviceRequest.serviceType,
      name: serviceRequest.name,
      email: serviceRequest.email,
      phone: serviceRequest.phone,
      vehicleYear: serviceRequest.vehicleYear,
      vehicleMake: serviceRequest.vehicleMake,
      vehicleModel: serviceRequest.vehicleModel,
      vin: serviceRequest.vin,
      description: serviceRequest.description,
      existingCustomer: serviceRequest.existingCustomer,
      requestId: serviceRequest.id,
    }).catch((error) => {
      console.error("Email notification failed:", error);
      // Log but don't fail the request
    });

    return NextResponse.json({
      success: true,
      requestId: serviceRequest.id,
      message: "Service request submitted successfully",
    });
  } catch (error) {
    console.error("Service request submission error:", error);
    return NextResponse.json(
      {
        error: "Failed to submit service request. Please try again or call us directly.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/services/request
 * Retrieve all service requests (for admin use)
 * TODO: Add authentication and authorization
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    // const session = await getServerSession();
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const serviceRequests = await prisma.serviceRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      requests: serviceRequests,
      count: serviceRequests.length,
    });
  } catch (error) {
    console.error("Service request retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve service requests" },
      { status: 500 }
    );
  }
}
