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

interface SellSubmissionAdminEmailProps {
  submissionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  sellOption: "sell" | "consign" | "auction";
  year: string;
  make: string;
  model: string;
  mileage: string;
  vin: string;
  notes?: string;
  existingCustomer: boolean;
  newsletter: boolean;
  submittedAt: string;
}

const SELL_OPTION_LABELS: Record<string, { title: string; priority: string; color: string }> = {
  sell: {
    title: "Direct Sale",
    priority: "High Priority",
    color: "#F90020",
  },
  consign: {
    title: "Consignment",
    priority: "Standard",
    color: "#005A90",
  },
  auction: {
    title: "Auction",
    priority: "Standard",
    color: "#2E90FA",
  },
};

export const SellSubmissionAdminEmail = ({
  submissionId = "clxyz123abc",
  customerName = "John Smith",
  customerEmail = "john@example.com",
  customerPhone = "513-555-1234",
  sellOption = "sell",
  year = "2020",
  make = "BMW",
  model = "M3",
  mileage = "45,000",
  vin = "WBSWD93508PX12345",
  notes = "Excellent condition, one owner, always garaged.",
  existingCustomer = false,
  newsletter = false,
  submittedAt = "January 6, 2026 at 3:45 PM EST",
}: SellSubmissionAdminEmailProps) => {
  const optionInfo = SELL_OPTION_LABELS[sellOption] ?? SELL_OPTION_LABELS.sell;
  
  // TypeScript guard
  if (!optionInfo) return null;

  return (
    <Html>
      <Head />
      <Preview>
        🚗 New {optionInfo.title} Submission: {year} {make} {model}
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
            <Text style={headerSubtitle}>Vehicle Acquisition Alert</Text>
          </Section>

          {/* Priority Banner */}
          <Section
            style={{
              ...priorityBanner,
              backgroundColor: optionInfo.color,
            }}
          >
            <Text style={priorityText}>
              {optionInfo.priority} — {optionInfo.title}
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>
              New Vehicle Submission
            </Heading>

            <Text style={submissionMeta}>
              Submission ID: <strong>{submissionId}</strong>
              <br />
              Received: {submittedAt}
            </Text>

            {/* Vehicle Summary */}
            <Section style={vehicleCard}>
              <Text style={vehicleYear}>{year}</Text>
              <Text style={vehicleName}>{make} {model}</Text>
              <div style={vehicleDetails}>
                <Text style={vehicleDetailItem}>{mileage} miles</Text>
                <Text style={vehicleDetailDivider}>•</Text>
                <Text style={vehicleDetailItem}>VIN: {vin}</Text>
              </div>
            </Section>

            {/* Customer Info */}
            <Section style={infoSection}>
              <Text style={sectionTitle}>Customer Information</Text>
              
              <table style={infoTable}>
                <tbody>
                  <tr>
                    <td style={infoLabel}>Name</td>
                    <td style={infoValue}>{customerName}</td>
                  </tr>
                  <tr>
                    <td style={infoLabel}>Email</td>
                    <td style={infoValue}>
                      <Link href={`mailto:${customerEmail}`} style={link}>
                        {customerEmail}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={infoLabel}>Phone</td>
                    <td style={infoValue}>
                      <Link href={`tel:${customerPhone}`} style={link}>
                        {customerPhone}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={infoLabel}>Existing Customer</td>
                    <td style={infoValue}>{existingCustomer ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td style={infoLabel}>Newsletter Opt-in</td>
                    <td style={infoValue}>{newsletter ? "Yes" : "No"}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Notes */}
            {notes && (
              <Section style={infoSection}>
                <Text style={sectionTitle}>Customer Notes</Text>
                <div style={notesBox}>
                  <Text style={notesText}>{notes}</Text>
                </div>
              </Section>
            )}

            {/* Quick Actions */}
            <Section style={actionsSection}>
              <Text style={sectionTitle}>Quick Actions</Text>
              <div style={buttonRow}>
                <Button href={`mailto:${customerEmail}`} style={primaryButton}>
                  Email Customer
                </Button>
                <Button href={`tel:${customerPhone}`} style={secondaryButton}>
                  Call Customer
                </Button>
              </div>
            </Section>

            <Hr style={divider} />

            <Text style={footerNote}>
              This vehicle submission requires follow-up within 1 business day.
              The customer has received a confirmation email with expected response timeline.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Enthusiast Auto Group — Internal Notification
              <br />
              This email was sent to the acquisitions team.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default SellSubmissionAdminEmail;

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
  marginBottom: "8px",
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

const headerSubtitle = {
  color: "#a8adb7",
  fontSize: "13px",
  margin: "0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const priorityBanner = {
  padding: "12px 32px",
  textAlign: "center" as const,
};

const priorityText = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
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

const submissionMeta = {
  color: "#6f6e77",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const vehicleCard = {
  backgroundColor: "#141721",
  borderRadius: "8px",
  padding: "24px",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

const vehicleYear = {
  color: "#2E90FA",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  margin: "0 0 4px 0",
};

const vehicleName = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 12px 0",
};

const vehicleDetails = {
  display: "flex",
  justifyContent: "center",
  gap: "8px",
};

const vehicleDetailItem = {
  color: "#a8adb7",
  fontSize: "13px",
  margin: "0",
};

const vehicleDetailDivider = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0",
};

const infoSection = {
  margin: "0 0 24px 0",
};

const sectionTitle = {
  color: "#282a30",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 12px 0",
};

const infoTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const infoLabel = {
  color: "#6f6e77",
  fontSize: "13px",
  padding: "8px 0",
  width: "140px",
  verticalAlign: "top" as const,
};

const infoValue = {
  color: "#282a30",
  fontSize: "14px",
  fontWeight: "500",
  padding: "8px 0",
  verticalAlign: "top" as const,
};

const link = {
  color: "#005A90",
  textDecoration: "none",
};

const notesBox = {
  backgroundColor: "#f8f8f8",
  border: "1px solid #DFE5EA",
  borderRadius: "6px",
  padding: "16px",
};

const notesText = {
  color: "#282a30",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const actionsSection = {
  margin: "0 0 24px 0",
};

const buttonRow = {
  display: "flex",
  gap: "12px",
};

const primaryButton = {
  backgroundColor: "#005A90",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
};

const secondaryButton = {
  backgroundColor: "#ffffff",
  border: "1px solid #DFE5EA",
  borderRadius: "6px",
  color: "#282a30",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
};

const divider = {
  borderColor: "#DFE5EA",
  margin: "24px 0",
};

const footerNote = {
  backgroundColor: "#FEF3C7",
  border: "1px solid #FCD34D",
  borderRadius: "6px",
  color: "#92400E",
  fontSize: "13px",
  lineHeight: "1.5",
  padding: "12px 16px",
  margin: "0",
};

const footer = {
  backgroundColor: "#141721",
  padding: "20px 32px",
  borderRadius: "0 0 8px 8px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "0",
  lineHeight: "1.5",
};

