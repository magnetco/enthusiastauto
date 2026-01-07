import { Resend } from "resend";
import SellSubmissionConfirmationEmail from "@/emails/sell-submission-confirmation";
import SellSubmissionAdminEmail from "@/emails/sell-submission-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

// Admin email for sell submission notifications
const ADMIN_EMAIL = "gavin@magnet.co";

// From email address (update when you have a verified domain)
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Enthusiast Auto <onboarding@resend.dev>";

interface SellSubmissionEmailData {
  submissionId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sellOption: "sell" | "consign" | "auction";
  year: string;
  make: string;
  model: string;
  mileage: string;
  vin: string;
  notes?: string | null;
  existingCustomer: boolean;
  newsletter: boolean;
}

const SELL_OPTION_LABELS: Record<string, string> = {
  sell: "Direct Sale",
  consign: "Consignment",
  auction: "Auction",
};

/**
 * Send sell submission confirmation emails
 * - Customer receives a confirmation email
 * - Admin receives a notification email
 */
export async function sendSellSubmissionEmails(
  data: SellSubmissionEmailData
): Promise<{
  success: boolean;
  customerEmailId?: string;
  adminEmailId?: string;
  error?: string;
}> {
  const customerName = `${data.firstName} ${data.lastName}`;
  const sellOptionLabel = SELL_OPTION_LABELS[data.sellOption] || data.sellOption;
  const submittedAt = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  // Short submission ID for customer reference
  const shortId = `VS-${data.submissionId.slice(-8).toUpperCase()}`;

  try {
    // Send both emails in parallel
    const [customerResult, adminResult] = await Promise.all([
      // Customer confirmation email
      resend.emails.send({
        from: FROM_EMAIL,
        to: data.email,
        subject: `Vehicle Submission Received - ${data.year} ${data.make} ${data.model}`,
        react: SellSubmissionConfirmationEmail({
          customerName: data.firstName,
          submissionId: shortId,
          sellOption: data.sellOption,
          year: data.year,
          make: data.make,
          model: data.model,
          mileage: data.mileage,
          vin: data.vin,
          notes: data.notes || undefined,
        }),
      }),

      // Admin notification email
      resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `🚗 New ${sellOptionLabel} Submission: ${data.year} ${data.make} ${data.model}`,
        react: SellSubmissionAdminEmail({
          submissionId: data.submissionId,
          customerName,
          customerEmail: data.email,
          customerPhone: data.phone,
          sellOption: data.sellOption,
          year: data.year,
          make: data.make,
          model: data.model,
          mileage: data.mileage,
          vin: data.vin,
          notes: data.notes || undefined,
          existingCustomer: data.existingCustomer,
          newsletter: data.newsletter,
          submittedAt,
        }),
      }),
    ]);

    // Check for errors
    if (customerResult.error) {
      console.error("Customer email error:", customerResult.error);
    }
    if (adminResult.error) {
      console.error("Admin email error:", adminResult.error);
    }

    // Return success even if one email fails - we don't want to block the submission
    return {
      success: true,
      customerEmailId: customerResult.data?.id,
      adminEmailId: adminResult.data?.id,
      error:
        customerResult.error || adminResult.error
          ? "Some emails may not have been sent"
          : undefined,
    };
  } catch (error) {
    console.error("Failed to send sell submission emails:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send emails",
    };
  }
}

