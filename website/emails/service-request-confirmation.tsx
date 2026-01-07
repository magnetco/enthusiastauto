import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ServiceRequestConfirmationEmailProps {
  customerName: string;
  requestId: string;
  serviceTypes: string[];
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  description: string;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  conditioning: "Conditioning & Protection",
  rejuvenation: "Full Rejuvenation",
  mechanical: "Mechanical Services",
  cosmetic: "Cosmetic Repairs",
  "not-sure": "Not Sure / Need Advice",
};

export const ServiceRequestConfirmationEmail = ({
  customerName = "there",
  requestId = "SR-XXXX",
  serviceTypes = ["conditioning"],
  vehicleYear = "2020",
  vehicleMake = "BMW",
  vehicleModel = "M3",
  description = "Service description...",
}: ServiceRequestConfirmationEmailProps) => {
  const serviceLabels = serviceTypes.map(
    (type) => SERVICE_TYPE_LABELS[type] || type
  );

  return (
    <Html>
      <Head />
      <Preview>
        Service Request Confirmed - {vehicleYear} {vehicleMake} {vehicleModel}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <div style={logoSection}>
              <div style={logoStripes}>
                <div style={stripeRed} />
                <div style={stripeDeepBlue} />
                <div style={stripeBlue} />
              </div>
              <Text style={logoText}>ENTHUSIAST AUTO</Text>
            </div>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Service Request Received</Heading>

            <Text style={greeting}>Hi {customerName},</Text>

            <Text style={paragraph}>
              Thank you for submitting your service request. We've received your
              inquiry and a BMW Service Professional will contact you within{" "}
              <strong>1 business day</strong> to discuss your needs and schedule
              an assessment.
            </Text>

            {/* Request Summary Card */}
            <Section style={summaryCard}>
              <Text style={summaryTitle}>Request Summary</Text>

              <div style={summaryRow}>
                <Text style={summaryLabel}>Request ID</Text>
                <Text style={summaryValue}>{requestId}</Text>
              </div>

              <div style={summaryRow}>
                <Text style={summaryLabel}>Vehicle</Text>
                <Text style={summaryValue}>
                  {vehicleYear} {vehicleMake} {vehicleModel}
                </Text>
              </div>

              <div style={summaryRow}>
                <Text style={summaryLabel}>Services</Text>
                <Text style={summaryValue}>{serviceLabels.join(", ")}</Text>
              </div>

              <Hr style={divider} />

              <Text style={summaryLabel}>Your Description</Text>
              <Text style={descriptionText}>{description}</Text>
            </Section>

            {/* What's Next */}
            <Text style={sectionTitle}>What Happens Next?</Text>

            <div style={stepContainer}>
              <div style={step}>
                <div style={stepNumber}>1</div>
                <div>
                  <Text style={stepTitle}>We Review Your Request</Text>
                  <Text style={stepDescription}>
                    Our team will review your vehicle details and service needs.
                  </Text>
                </div>
              </div>

              <div style={step}>
                <div style={stepNumber}>2</div>
                <div>
                  <Text style={stepTitle}>We Contact You</Text>
                  <Text style={stepDescription}>
                    A BMW specialist will reach out to discuss your project and
                    answer any questions.
                  </Text>
                </div>
              </div>

              <div style={step}>
                <div style={stepNumber}>3</div>
                <div>
                  <Text style={stepTitle}>Schedule Your Assessment</Text>
                  <Text style={stepDescription}>
                    We'll arrange a time for you to bring your vehicle in for a
                    detailed evaluation.
                  </Text>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <Section style={contactCard}>
              <Text style={contactTitle}>Need Immediate Assistance?</Text>
              <Link href="tel:513-554-1269" style={phoneLink}>
                513-554-1269
              </Link>
              <Text style={contactHours}>Monday - Friday, 8am - 5pm</Text>
            </Section>

            <Text style={paragraph}>
              We appreciate your interest in Enthusiast Auto and look forward to
              discussing how we can help with your BMW.
            </Text>

            <Text style={signature}>
              The Enthusiast Auto Team
              <br />
              <span style={signatureTagline}>
                Cincinnati's Premier BMW Specialists
              </span>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Enthusiast Auto Group
              <br />
              11608 Reading Rd, Cincinnati, OH 45241
              <br />
              <Link href="tel:513-554-1269" style={footerLink}>
                (513) 554-1269
              </Link>
              {" • "}
              <Link href="https://enthusiastauto.com" style={footerLink}>
                enthusiastauto.com
              </Link>
            </Text>
            <Text style={footerDisclaimer}>
              You received this email because you submitted a service request on
              our website.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ServiceRequestConfirmationEmail;

// ===== STYLES =====

const main = {
  backgroundColor: "#f4f4f4",
  fontFamily:
    'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#141721",
  padding: "24px 32px",
  borderRadius: "8px 8px 0 0",
};

const logoSection = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const logoStripes = {
  display: "flex",
  gap: "3px",
};

const stripeBase = {
  width: "6px",
  height: "24px",
  borderRadius: "2px",
};

const stripeRed = {
  ...stripeBase,
  backgroundColor: "#F90020",
};

const stripeDeepBlue = {
  ...stripeBase,
  backgroundColor: "#005A90",
};

const stripeBlue = {
  ...stripeBase,
  backgroundColor: "#2E90FA",
};

const logoText = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  margin: "0",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "40px 32px",
};

const h1 = {
  color: "#282a30",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 24px 0",
};

const greeting = {
  color: "#282a30",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const paragraph = {
  color: "#6f6e77",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 24px 0",
};

const summaryCard = {
  backgroundColor: "#f8f8f8",
  border: "1px solid #DFE5EA",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 32px 0",
};

const summaryTitle = {
  color: "#282a30",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 16px 0",
};

const summaryRow = {
  marginBottom: "12px",
};

const summaryLabel = {
  color: "#6f6e77",
  fontSize: "12px",
  fontWeight: "500",
  textTransform: "uppercase" as const,
  letterSpacing: "0.03em",
  margin: "0 0 4px 0",
};

const summaryValue = {
  color: "#282a30",
  fontSize: "15px",
  fontWeight: "500",
  margin: "0",
};

const divider = {
  borderColor: "#DFE5EA",
  margin: "16px 0",
};

const descriptionText = {
  color: "#282a30",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "8px 0 0 0",
  whiteSpace: "pre-wrap" as const,
};

const sectionTitle = {
  color: "#282a30",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 20px 0",
};

const stepContainer = {
  margin: "0 0 32px 0",
};

const step = {
  display: "flex",
  gap: "16px",
  marginBottom: "20px",
};

const stepNumber = {
  backgroundColor: "#005A90",
  color: "#ffffff",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "600",
  flexShrink: 0,
};

const stepTitle = {
  color: "#282a30",
  fontSize: "15px",
  fontWeight: "600",
  margin: "0 0 4px 0",
};

const stepDescription = {
  color: "#6f6e77",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
};

const contactCard = {
  backgroundColor: "#005A90",
  borderRadius: "8px",
  padding: "24px",
  textAlign: "center" as const,
  margin: "0 0 32px 0",
};

const contactTitle = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 8px 0",
};

const phoneLink = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700",
  textDecoration: "none",
};

const contactHours = {
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "13px",
  margin: "8px 0 0 0",
};

const signature = {
  color: "#282a30",
  fontSize: "15px",
  fontWeight: "500",
  lineHeight: "1.6",
  margin: "24px 0 0 0",
};

const signatureTagline = {
  color: "#6f6e77",
  fontSize: "13px",
  fontWeight: "400",
};

const footer = {
  backgroundColor: "#141721",
  padding: "24px 32px",
  borderRadius: "0 0 8px 8px",
};

const footerText = {
  color: "#a8adb7",
  fontSize: "13px",
  lineHeight: "1.6",
  textAlign: "center" as const,
  margin: "0 0 12px 0",
};

const footerLink = {
  color: "#2E90FA",
  textDecoration: "none",
};

const footerDisclaimer = {
  color: "#6b7280",
  fontSize: "11px",
  textAlign: "center" as const,
  margin: "0",
};

