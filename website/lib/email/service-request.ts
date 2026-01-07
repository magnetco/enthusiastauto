import { Resend } from "resend";
import ServiceRequestConfirmationEmail from "@/emails/service-request-confirmation";
import ServiceRequestAdminEmail from "@/emails/service-request-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

// Admin email for service request notifications
const ADMIN_EMAIL = "gavin@magnet.co";

// From email address (update when you have a verified domain)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Enthusiast Auto <onboarding@resend.dev>";

interface ServiceRequestEmailData {
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vin?: string | null;
  description: string;
  existingCustomer: boolean;
  requestId: string;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  conditioning: "Conditioning & Protection",
  rejuvenation: "Full Rejuvenation",
  mechanical: "Mechanical Services",
  cosmetic: "Cosmetic Repairs",
  "not-sure": "Not Sure / Need Advice",
};

/**
 * Parse service types from comma-separated string to array
 */
function parseServiceTypes(serviceType: string): string[] {
  return serviceType.split(",").map((t) => t.trim()).filter(Boolean);
}

/**
 * Get formatted service labels for email subject
 */
function getServiceLabels(serviceTypes: string[]): string {
  return serviceTypes
    .map((type) => SERVICE_TYPE_LABELS[type] || type)
    .join(", ");
}

/**
 * Format date for display in emails
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Send confirmation email to the customer
 */
async function sendCustomerConfirmation(data: ServiceRequestEmailData) {
  const serviceTypes = parseServiceTypes(data.serviceType);
  
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.email],
      subject: `Service Request Confirmed - ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`,
      react: ServiceRequestConfirmationEmail({
        customerName: data.name.split(" ")[0] || data.name, // Use first name
        requestId: data.requestId.slice(-8).toUpperCase(), // Short ID for display
        serviceTypes,
        vehicleYear: data.vehicleYear,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        description: data.description,
      }),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send customer confirmation email:", error);
    return { success: false, error };
  }
}

/**
 * Send notification email to admin/service team
 */
async function sendAdminNotification(data: ServiceRequestEmailData) {
  const serviceTypes = parseServiceTypes(data.serviceType);
  const serviceLabels = getServiceLabels(serviceTypes);
  
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: data.email,
      subject: `🔔 New Service Request: ${serviceLabels} - ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`,
      react: ServiceRequestAdminEmail({
        requestId: data.requestId,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        serviceTypes,
        vehicleYear: data.vehicleYear,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        vin: data.vin,
        description: data.description,
        existingCustomer: data.existingCustomer,
        submittedAt: formatDate(new Date()),
      }),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    return { success: false, error };
  }
}

/**
 * Send email notifications when a new service request is submitted
 * Sends both customer confirmation and admin notification emails
 */
export async function sendServiceRequestNotification(data: ServiceRequestEmailData) {
  // Send both emails in parallel
  const [customerResult, adminResult] = await Promise.allSettled([
    sendCustomerConfirmation(data),
    sendAdminNotification(data),
  ]);

  // Log results
  if (customerResult.status === "fulfilled" && customerResult.value.success) {
    console.log("Customer confirmation email sent successfully");
  } else {
    console.error("Customer confirmation email failed:", 
      customerResult.status === "rejected" ? customerResult.reason : customerResult.value.error
    );
  }

  if (adminResult.status === "fulfilled" && adminResult.value.success) {
    console.log("Admin notification email sent successfully");
  } else {
    console.error("Admin notification email failed:",
      adminResult.status === "rejected" ? adminResult.reason : adminResult.value.error
    );
  }

  // Return success if at least admin email was sent
  const adminSuccess = adminResult.status === "fulfilled" && adminResult.value.success;
  const customerSuccess = customerResult.status === "fulfilled" && customerResult.value.success;

  return {
    success: adminSuccess || customerSuccess,
    customerEmailSent: customerSuccess,
    adminEmailSent: adminSuccess,
  };
}
