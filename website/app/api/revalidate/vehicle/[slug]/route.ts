import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

/**
 * Webhook handler for Sanity vehicle document updates
 * Triggers on-demand ISR revalidation when vehicles are created, updated, or deleted
 *
 * Webhook URL: https://shop.enthusiastauto.com/api/revalidate/vehicle/{slug.current}
 * Webhook Filter: _type == "vehicle"
 * Webhook Projection: { "slug": slug, "status": status }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;

  try {
    // Verify webhook signature from Sanity
    const signature = req.headers.get("sanity-webhook-signature");
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (!secret) {
      console.error(
        "[Revalidation API] SANITY_WEBHOOK_SECRET environment variable not configured",
      );
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    if (!signature) {
      console.error(
        "[Revalidation API] Missing sanity-webhook-signature header",
      );
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 401 },
      );
    }

    // Read request body
    const body = await req.text();

    // Verify HMAC SHA-256 signature
    const expectedSignature = createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("[Revalidation API] Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 },
      );
    }

    // Validate slug parameter
    if (!slug || slug.trim() === "") {
      console.error("[Revalidation API] Missing or empty slug parameter");
      return NextResponse.json(
        { error: "Missing slug parameter" },
        { status: 400 },
      );
    }

    // Parse webhook payload to get vehicle data
    let webhookData;
    try {
      webhookData = JSON.parse(body);
    } catch {
      console.error("[Revalidation API] Failed to parse webhook payload");
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 },
      );
    }

    // Log revalidation event for monitoring
    console.log(
      `[Revalidation API] Revalidating vehicle: ${slug}`,
      webhookData.status ? `(status: ${webhookData.status})` : "",
    );

    // Revalidate affected paths
    // 1. Vehicle detail page
    revalidatePath(`/vehicles/${slug}`, "page");

    // 2. Vehicle listing page (all filters)
    revalidatePath("/vehicles", "page");

    // 3. Homepage (featured vehicles section)
    revalidatePath("/", "page");

    console.log(
      `[Revalidation API] Successfully revalidated paths for vehicle: ${slug}`,
    );

    // Return success response
    return NextResponse.json(
      {
        revalidated: true,
        slug,
        paths: [`/vehicles/${slug}`, "/vehicles", "/"],
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      `[Revalidation API] Error revalidating vehicle ${slug}:`,
      error,
    );
    return NextResponse.json(
      {
        error: "Revalidation failed",
        slug,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
