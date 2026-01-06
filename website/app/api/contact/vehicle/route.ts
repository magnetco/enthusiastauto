import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { vehicleInquiryPayloadSchema } from '@/types/contact';
import { VehicleInquiryEmail } from '@/lib/email/vehicle-inquiry-template';
import { client } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting (10 requests per hour per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour
    });
    return true;
  }

  if (limit.count >= 10) {
    return false; // Rate limit exceeded
  }

  limit.count++;
  return true;
}

/**
 * POST /api/contact/vehicle
 * Submit vehicle inquiry form and send email to sales team
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Rate limit exceeded. Please try again later. (Max 10 requests per hour)',
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = vehicleInquiryPayloadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Fetch vehicle details from Sanity
    const vehicle = await client.fetch(
      `*[_type == "vehicle" && slug.current == $slug][0]{
        _id,
        listingTitle,
        chassis,
        listingPrice,
        vin,
        mileage,
        status,
        signatureShot{
          asset->{
            _id,
            url
          }
        }
      }`,
      { slug: data.vehicleSlug }
    );

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vehicle not found',
        },
        { status: 404 }
      );
    }

    // Build vehicle image URL
    let vehicleImageUrl: string | undefined;
    if (vehicle.signatureShot?.asset) {
      vehicleImageUrl = urlFor(vehicle.signatureShot).width(600).url();
    }

    // Build vehicle URL
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://enthusiastauto.com';
    const vehicleUrl = `${siteUrl}/vehicles/${data.vehicleSlug}`;

    // Extract year from listing title (e.g., "2023 BMW G82 M4 CSL")
    const yearMatch = vehicle.listingTitle.match(/^\d{4}/);
    const vehicleYear = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();

    // Render email HTML
    const emailHtml = await render(
      VehicleInquiryEmail({
        ...data,
        vehicleTitle: vehicle.listingTitle,
        vehicleYear,
        vehicleMake: 'BMW',
        vehicleModel: vehicle.chassis,
        vehiclePrice: vehicle.listingPrice || 0,
        vehicleVin: vehicle.vin,
        vehicleMileage: vehicle.mileage,
        vehicleImageUrl,
        vehicleUrl,
      })
    );

    // Send email via Resend
    // NOTE: Using development mode - emails sent from onboarding@resend.dev
    // To configure custom domain: https://resend.com/domains
    const salesEmail = process.env.SALES_EMAIL || 'sales@enthusiastauto.com';
    const fromEmail =
      process.env.EMAIL_FROM || 'onboarding@resend.dev';

    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: salesEmail,
      replyTo: data.email,
      subject: `New Vehicle Inquiry: ${vehicleYear} BMW ${vehicle.chassis}`,
      html: emailHtml,
    });

    if (!emailResult.data?.id) {
      throw new Error('Failed to send email');
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        messageId: emailResult.data.id,
        message: 'Inquiry sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Vehicle inquiry API error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
