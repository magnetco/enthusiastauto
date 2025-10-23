import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Disable Preview Mode API Route
 * Story 3.6: Exit draft mode and return to published content
 */

export async function GET() {
  // Disable Draft Mode
  const draft = await draftMode();
  draft.disable();

  // Redirect to home
  redirect("/");
}
