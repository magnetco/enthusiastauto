import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
 * Send email notification when a new service request is submitted
 */
export async function sendServiceRequestNotification(data: ServiceRequestEmailData) {
  const serviceLabel = SERVICE_TYPE_LABELS[data.serviceType] || data.serviceType;

  try {
    // Send to your service team
    const result = await resend.emails.send({
      from: "Enthusiast Auto <onboarding@resend.dev>", // Using Resend development domain
      to: ["delivered@resend.dev"], // Development mode - update with your email when ready
      replyTo: data.email,
      subject: `New Service Request: ${serviceLabel} - ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Service Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">New Service Request</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
    <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
        Service Type: ${serviceLabel}
      </h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 40%; color: #6b7280;">Request ID:</td>
          <td style="padding: 8px 0;">${data.requestId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Existing Customer:</td>
          <td style="padding: 8px 0;">${data.existingCustomer ? "Yes" : "No"}</td>
        </tr>
      </table>
    </div>

    <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
      <h3 style="color: #374151; margin-top: 0; font-size: 16px;">Contact Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 40%; color: #6b7280;">Name:</td>
          <td style="padding: 8px 0;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #667eea;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Phone:</td>
          <td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #667eea;">${data.phone}</a></td>
        </tr>
      </table>
    </div>

    <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
      <h3 style="color: #374151; margin-top: 0; font-size: 16px;">Vehicle Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 40%; color: #6b7280;">Vehicle:</td>
          <td style="padding: 8px 0;">${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}</td>
        </tr>
        ${
          data.vin
            ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">VIN:</td>
          <td style="padding: 8px 0; font-family: monospace;">${data.vin}</td>
        </tr>
        `
            : ""
        }
      </table>
    </div>

    <div style="background: white; padding: 20px; border-radius: 6px;">
      <h3 style="color: #374151; margin-top: 0; font-size: 16px;">Service Details</h3>
      <div style="background: #f9fafb; padding: 15px; border-radius: 4px; border-left: 4px solid #667eea;">
        <p style="margin: 0; white-space: pre-wrap;">${data.description}</p>
      </div>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0;">Enthusiast Auto Service Request System</p>
      <p style="margin: 5px 0 0 0;">11608 Reading Rd, Cincinnati, OH 45241 • (513) 554-1269</p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send service request email:", error);
    // Don't throw - we don't want email failures to break the form submission
    return { success: false, error };
  }
}
