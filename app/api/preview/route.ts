import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Preview Mode API Route
 * Story 3.6: Enable draft content preview from Sanity Studio
 * https://nextjs.org/docs/app/building-your-application/configuring/draft-mode
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const secret = searchParams.get("secret");

  // Verify the secret to prevent unauthorized access
  // In production, use an environment variable
  const previewSecret = process.env.SANITY_PREVIEW_SECRET || "preview-secret";

  if (secret !== previewSecret) {
    return new Response("Invalid token", { status: 401 });
  }

  // Verify slug parameter exists
  if (!slug) {
    return new Response("Missing slug parameter", { status: 400 });
  }

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the vehicle page
  redirect(`/vehicles/${slug}`);
}
