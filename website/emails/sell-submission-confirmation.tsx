import {
  Body,
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

interface SellSubmissionConfirmationEmailProps {
  customerName: string;
  submissionId: string;
  sellOption: "sell" | "consign" | "auction";
  year: string;
  make: string;
  model: string;
  mileage: string;
  vin: string;
  notes?: string;
}

const SELL_OPTION_LABELS: Record<string, { title: string; description: string }> = {
  sell: {
    title: "Direct Sale",
    description: "Quick transaction with immediate payment from EAG",
  },
  consign: {
    title: "Consignment",
    description: "We handle everything for maximum value",
  },
  auction: {
    title: "Auction Representation",
    description: "Maximum exposure on major auction platforms",
  },
};

export const SellSubmissionConfirmationEmail = ({
  customerName = "there",
  submissionId = "SUB-XXXX",
  sellOption = "sell",
  year = "2020",
  make = "BMW",
  model = "M3",
  mileage = "45,000",
  vin = "WBSWD93508PX12345",
  notes,
}: SellSubmissionConfirmationEmailProps) => {
  const optionInfo = SELL_OPTION_LABELS[sellOption] ?? SELL_OPTION_LABELS.sell;
  
  // TypeScript guard
  if (!optionInfo) return null;

  return (
    <Html>
      <Head />
      <Preview>
        Vehicle Submission Received - {year} {make} {model}
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
            <Heading style={h1}>Vehicle Submission Received</Heading>

            <Text style={greeting}>Hi {customerName},</Text>

            <Text style={paragraph}>
              Thank you for submitting your {year} {make} {model} for evaluation.
              Our acquisitions team will review your submission and contact you within{" "}
              <strong>1 business day</strong> to discuss the best options for your vehicle.
            </Text>

            {/* Submission Summary Card */}
            <Section style={summaryCard}>
              <Text style={summaryTitle}>Submission Summary</Text>

              <div style={summaryRow}>
                <Text style={summaryLabel}>Submission ID</Text>
                <Text style={summaryValue}>{submissionId}</Text>
              </div>

              <div style={summaryRow}>
                <Text style={summaryLabel}>Selected Option</Text>
                <Text style={summaryValue}>{optionInfo.title}</Text>
              </div>

              <Text style={optionDescription}>{optionInfo.description}</Text>

              <Hr style={divider} />

              <div style={summaryRow}>
                <Text style={summaryLabel}>Vehicle</Text>
                <Text style={summaryValue}>
                  {year} {make} {model}
                </Text>
              </div>

              <div style={summaryRow}>
                <Text style={summaryLabel}>Mileage</Text>
                <Text style={summaryValue}>{mileage}</Text>
              </div>

              <div style={summaryRow}>
                <Text style={summaryLabel}>VIN</Text>
                <Text style={vinValue}>{vin}</Text>
              </div>

              {notes && (
                <>
                  <Hr style={divider} />
                  <Text style={summaryLabel}>Your Notes</Text>
                  <Text style={notesText}>{notes}</Text>
                </>
              )}
            </Section>

            {/* What's Next */}
            <Text style={sectionTitle}>What Happens Next?</Text>

            <div style={stepContainer}>
              <div style={step}>
                <div style={stepNumber}>1</div>
                <div>
                  <Text style={stepTitle}>Vehicle Evaluation</Text>
                  <Text style={stepDescription}>
                    Our team reviews your submission and researches comparable sales.
                  </Text>
                </div>
              </div>

              <div style={step}>
                <div style={stepNumber}>2</div>
                <div>
                  <Text style={stepTitle}>Personal Consultation</Text>
                  <Text style={stepDescription}>
                    An acquisitions specialist contacts you to discuss your vehicle and goals.
                  </Text>
                </div>
              </div>

              <div style={step}>
                <div style={stepNumber}>3</div>
                <div>
                  <Text style={stepTitle}>In-Person Assessment</Text>
                  <Text style={stepDescription}>
                    We schedule a time to see your vehicle and provide a formal offer.
                  </Text>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <Section style={contactCard}>
              <Text style={contactTitle}>Questions About Your Submission?</Text>
              <Link href="tel:513-554-1269" style={phoneLink}>
                513-554-1269
              </Link>
              <Text style={contactHours}>Monday - Friday, 8am - 5pm</Text>
            </Section>

            <Text style={paragraph}>
              We understand that parting with your BMW can be a significant decision.
              Our team is committed to making this process as smooth and rewarding as possible.
            </Text>

            <Text style={signature}>
              The EAG Acquisitions Team
              <br />
              <span style={signatureTagline}>Curating the Finest BMW Enthusiast Vehicles</span>
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
              You received this email because you submitted a vehicle for evaluation on our website.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default SellSubmissionConfirmationEmail;

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

const optionDescription = {
  color: "#6f6e77",
  fontSize: "13px",
  margin: "0 0 16px 0",
  fontStyle: "italic" as const,
};

const vinValue = {
  ...summaryValue,
  fontFamily: "monospace",
  letterSpacing: "0.02em",
};

const divider = {
  borderColor: "#DFE5EA",
  margin: "16px 0",
};

const notesText = {
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

