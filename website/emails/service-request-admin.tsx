import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ServiceRequestAdminEmailProps {
  requestId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceTypes: string[];
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vin?: string | null;
  description: string;
  existingCustomer: boolean;
  submittedAt: string;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  conditioning: "Conditioning & Protection",
  rejuvenation: "Full Rejuvenation",
  mechanical: "Mechanical Services",
  cosmetic: "Cosmetic Repairs",
  "not-sure": "Not Sure / Need Advice",
};

export const ServiceRequestAdminEmail = ({
  requestId = "clxyz123abc",
  customerName = "John Smith",
  customerEmail = "john@example.com",
  customerPhone = "(513) 555-1234",
  serviceTypes = ["conditioning", "cosmetic"],
  vehicleYear = "2020",
  vehicleMake = "BMW",
  vehicleModel = "M3 Competition",
  vin = "WBSWD93508PX12345",
  description = "Looking for a complete detail and paint correction. The car has some swirl marks from previous washes and I want to protect it with ceramic coating.",
  existingCustomer = false,
  submittedAt = "January 6, 2026 at 2:30 PM",
}: ServiceRequestAdminEmailProps) => {
  const serviceLabels = serviceTypes.map(
    (type) => SERVICE_TYPE_LABELS[type] || type
  );

  return (
    <Html>
      <Head />
      <Preview>
        New Service Request: {vehicleYear} {vehicleMake} {vehicleModel} -{" "}
        {customerName}
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
            <Text style={headerBadge}>NEW SERVICE REQUEST</Text>
          </Section>

          {/* Alert Banner */}
          <Section style={alertBanner}>
            <Text style={alertText}>
              ⏱️ Please respond within 1 business day
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>
              {vehicleYear} {vehicleMake} {vehicleModel}
            </Heading>

            <Text style={subtitle}>
              Request ID: <span style={requestIdStyle}>{requestId}</span>
            </Text>

            {/* Quick Actions */}
            <Section style={actionRow}>
              <Button href={`mailto:${customerEmail}`} style={primaryButton}>
                Reply to Customer
              </Button>
              <Button href={`tel:${customerPhone}`} style={secondaryButton}>
                Call Customer
              </Button>
            </Section>

            {/* Customer Card */}
            <Section style={card}>
              <div style={cardHeader}>
                <Text style={cardTitle}>Customer Information</Text>
                <Text style={customerBadge}>
                  {existingCustomer ? "🔁 Returning" : "✨ New Customer"}
                </Text>
              </div>

              <Hr style={cardDivider} />

              <table style={infoTable}>
                <tbody>
                  <tr>
                    <td style={labelCell}>Name</td>
                    <td style={valueCell}>{customerName}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Email</td>
                    <td style={valueCell}>
                      <Link href={`mailto:${customerEmail}`} style={linkStyle}>
                        {customerEmail}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Phone</td>
                    <td style={valueCell}>
                      <Link href={`tel:${customerPhone}`} style={linkStyle}>
                        {customerPhone}
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Services Card */}
            <Section style={card}>
              <Text style={cardTitle}>Requested Services</Text>
              <Hr style={cardDivider} />

              <div style={servicesContainer}>
                {serviceLabels.map((label, index) => (
                  <span key={index} style={serviceBadge}>
                    {label}
                  </span>
                ))}
              </div>
            </Section>

            {/* Vehicle Card */}
            <Section style={card}>
              <Text style={cardTitle}>Vehicle Details</Text>
              <Hr style={cardDivider} />

              <table style={infoTable}>
                <tbody>
                  <tr>
                    <td style={labelCell}>Year</td>
                    <td style={valueCell}>{vehicleYear}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Make</td>
                    <td style={valueCell}>{vehicleMake}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Model</td>
                    <td style={valueCell}>{vehicleModel}</td>
                  </tr>
                  {vin && (
                    <tr>
                      <td style={labelCell}>VIN</td>
                      <td style={vinCell}>{vin}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            {/* Description Card */}
            <Section style={card}>
              <Text style={cardTitle}>Customer Description</Text>
              <Hr style={cardDivider} />

              <div style={descriptionBox}>
                <Text style={descriptionText}>{description}</Text>
              </div>
            </Section>

            {/* Metadata */}
            <Text style={metadata}>
              Submitted: {submittedAt}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Enthusiast Auto Service Request System
              <br />
              This is an automated notification. Please respond promptly.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ServiceRequestAdminEmail;

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
  padding: "20px 32px",
  borderRadius: "8px 8px 0 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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
  width: "5px",
  height: "20px",
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
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  margin: "0",
};

const headerBadge = {
  backgroundColor: "#F90020",
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: "700",
  letterSpacing: "0.05em",
  padding: "4px 10px",
  borderRadius: "4px",
  margin: "0",
};

const alertBanner = {
  backgroundColor: "#FEF3C7",
  borderLeft: "4px solid #F59E0B",
  padding: "12px 32px",
};

const alertText = {
  color: "#92400E",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "32px",
};

const h1 = {
  color: "#282a30",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 8px 0",
};

const subtitle = {
  color: "#6f6e77",
  fontSize: "14px",
  margin: "0 0 24px 0",
};

const requestIdStyle = {
  fontFamily: "monospace",
  backgroundColor: "#f4f4f4",
  padding: "2px 6px",
  borderRadius: "4px",
  fontSize: "12px",
};

const actionRow = {
  display: "flex",
  gap: "12px",
  marginBottom: "24px",
};

const primaryButton = {
  backgroundColor: "#005A90",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 20px",
  borderRadius: "6px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const secondaryButton = {
  backgroundColor: "#ffffff",
  color: "#005A90",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 20px",
  borderRadius: "6px",
  textDecoration: "none",
  textAlign: "center" as const,
  border: "2px solid #005A90",
};

const card = {
  backgroundColor: "#f8f8f8",
  border: "1px solid #DFE5EA",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "16px",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const cardTitle = {
  color: "#282a30",
  fontSize: "13px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0",
};

const customerBadge = {
  fontSize: "12px",
  margin: "0",
};

const cardDivider = {
  borderColor: "#DFE5EA",
  margin: "12px 0",
};

const infoTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const labelCell = {
  color: "#6f6e77",
  fontSize: "13px",
  fontWeight: "500",
  padding: "6px 0",
  width: "100px",
  verticalAlign: "top" as const,
};

const valueCell = {
  color: "#282a30",
  fontSize: "14px",
  fontWeight: "500",
  padding: "6px 0",
};

const vinCell = {
  ...valueCell,
  fontFamily: "monospace",
  fontSize: "13px",
  letterSpacing: "0.02em",
};

const linkStyle = {
  color: "#005A90",
  textDecoration: "none",
};

const servicesContainer = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "8px",
};

const serviceBadge = {
  backgroundColor: "#005A90",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "500",
  padding: "6px 12px",
  borderRadius: "20px",
  display: "inline-block",
};

const descriptionBox = {
  backgroundColor: "#ffffff",
  border: "1px solid #DFE5EA",
  borderRadius: "6px",
  padding: "16px",
};

const descriptionText = {
  color: "#282a30",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const metadata = {
  color: "#a8adb7",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "16px 0 0 0",
};

const footer = {
  backgroundColor: "#141721",
  padding: "20px 32px",
  borderRadius: "0 0 8px 8px",
};

const footerText = {
  color: "#a8adb7",
  fontSize: "12px",
  lineHeight: "1.6",
  textAlign: "center" as const,
  margin: "0",
};

