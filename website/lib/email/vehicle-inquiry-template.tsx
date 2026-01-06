import {
  Body,
  Button,
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
} from '@react-email/components';
import type { VehicleInquiryEmailPayload } from '@/types/contact';

interface VehicleInquiryEmailProps extends VehicleInquiryEmailPayload {
  vehicleTitle: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  vehiclePrice: number;
  vehicleVin?: string;
  vehicleMileage?: number;
  vehicleImageUrl?: string;
  vehicleUrl: string;
}

export function VehicleInquiryEmail({
  firstName,
  lastName,
  email,
  phone,
  message,
  hasTradein,
  subscribeToPriceDrops,
  vehicleTitle,
  vehicleYear,
  vehicleMake,
  vehicleModel,
  vehiclePrice,
  vehicleVin,
  vehicleMileage,
  vehicleImageUrl,
  vehicleUrl,
}: VehicleInquiryEmailProps) {
  const previewText = `New inquiry for ${vehicleYear} ${vehicleMake} ${vehicleModel} from ${firstName} ${lastName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Heading style={heading}>🚗 New Vehicle Inquiry</Heading>

          {/* Vehicle Image */}
          {vehicleImageUrl && (
            <Section style={imageSection}>
              <Img
                src={vehicleImageUrl}
                alt={vehicleTitle}
                width="300"
                height="200"
                style={vehicleImage}
              />
            </Section>
          )}

          {/* Vehicle Details */}
          <Section style={section}>
            <Heading as="h2" style={subheading}>
              Vehicle Information
            </Heading>
            <Text style={vehicleDetails}>
              <strong>{vehicleTitle}</strong>
            </Text>
            <Text style={detailRow}>
              <strong>Year:</strong> {vehicleYear}
            </Text>
            <Text style={detailRow}>
              <strong>Make:</strong> {vehicleMake}
            </Text>
            <Text style={detailRow}>
              <strong>Model:</strong> {vehicleModel}
            </Text>
            <Text style={detailRow}>
              <strong>Price:</strong> ${vehiclePrice.toLocaleString()}
            </Text>
            {vehicleVin && (
              <Text style={detailRow}>
                <strong>VIN:</strong> {vehicleVin}
              </Text>
            )}
            {vehicleMileage && (
              <Text style={detailRow}>
                <strong>Mileage:</strong> {vehicleMileage.toLocaleString()} miles
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* Buyer Information */}
          <Section style={section}>
            <Heading as="h2" style={subheading}>
              Buyer Information
            </Heading>
            <Text style={detailRow}>
              <strong>Name:</strong> {firstName} {lastName}
            </Text>
            <Text style={detailRow}>
              <strong>Email:</strong>{' '}
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>
            {phone && (
              <Text style={detailRow}>
                <strong>Phone:</strong>{' '}
                <Link href={`tel:${phone}`} style={link}>
                  {phone}
                </Link>
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* Message */}
          <Section style={section}>
            <Heading as="h2" style={subheading}>
              Message
            </Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          {/* Additional Details */}
          <Section style={section}>
            <Heading as="h2" style={subheading}>
              Additional Details
            </Heading>
            <Text style={detailRow}>
              <strong>Trade-In Interest:</strong> {hasTradein ? 'Yes ✅' : 'No'}
            </Text>
            <Text style={detailRow}>
              <strong>Price Drop Alerts:</strong>{' '}
              {subscribeToPriceDrops ? 'Yes ✅' : 'No'}
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button style={button} href={vehicleUrl}>
              View Vehicle Listing
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sent via Enthusiast Auto Contact Form
            </Text>
            <Text style={footerText}>
              {new Date().toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </Text>
            <Text style={footerText}>
              <strong>Reply-To:</strong> {email}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Email styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '40px 0 30px',
  color: '#1a1a1a',
};

const subheading = {
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 15px',
  color: '#1a1a1a',
};

const section = {
  padding: '0 48px',
  marginBottom: '20px',
};

const imageSection = {
  padding: '0 48px',
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const vehicleImage = {
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  objectFit: 'cover' as const,
};

const vehicleDetails = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: '0 0 15px',
};

const detailRow = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#3c4043',
  margin: '4px 0',
};

const messageText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#3c4043',
  whiteSpace: 'pre-wrap' as const,
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '6px',
  border: '1px solid #e5e7eb',
};

const buttonSection = {
  textAlign: 'center' as const,
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#1a1a1a',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footer = {
  padding: '0 48px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#6b7280',
  lineHeight: '18px',
  margin: '4px 0',
};

// Export default for rendering
export default VehicleInquiryEmail;
