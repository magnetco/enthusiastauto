import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({
        data: { id: 'mock-email-id-123' },
      }),
    },
  })),
}));

vi.mock('@react-email/components', () => ({
  render: vi.fn().mockResolvedValue('<html>Mock email</html>'),
}));

vi.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: vi.fn(),
  },
}));

vi.mock('@/sanity/lib/image', () => ({
  urlFor: vi.fn().mockReturnValue({
    width: vi.fn().mockReturnValue({
      url: vi.fn().mockReturnValue('https://example.com/image.jpg'),
    }),
  }),
}));

describe('POST /api/contact/vehicle', () => {
  const mockVehicleData = {
    _id: '1',
    title: '2020 BMW M3',
    year: 2020,
    make: 'BMW',
    model: 'M3',
    price: 65000,
    vin: 'WBS123456789',
    mileage: 15000,
    status: 'current',
    images: [
      {
        asset: {
          _id: 'img1',
          url: 'https://example.com/image.jpg',
        },
      },
    ],
  };

  const validPayload = {
    vehicleSlug: 'test-vehicle',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    message: "I'm interested in this vehicle",
    hasTradein: true,
    subscribeToPriceDrops: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock environment variables
    process.env.RESEND_API_KEY = 'test-key';
    process.env.SALES_EMAIL = 'sales@test.com';
    process.env.EMAIL_FROM = 'noreply@test.com';
    process.env.NEXT_PUBLIC_SITE_URL = 'https://test.com';

    // Mock Sanity client fetch
    const { client } = require('@/sanity/lib/client');
    client.fetch.mockResolvedValue(mockVehicleData);
  });

  function createMockRequest(body: any, headers: Record<string, string> = {}) {
    return new NextRequest('http://localhost:3000/api/contact/vehicle', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  }

  describe('Success Cases', () => {
    it('should successfully send email with valid payload', async () => {
      const request = createMockRequest(validPayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.messageId).toBe('mock-email-id-123');
    });

    it('should fetch vehicle details from Sanity', async () => {
      const { client } = await import('@/sanity/lib/client');
      const request = createMockRequest(validPayload);

      await POST(request);

      expect(client.fetch).toHaveBeenCalledWith(
        expect.stringContaining('*[_type == "vehicle"'),
        { slug: 'test-vehicle' }
      );
    });

    it('should send email to sales team', async () => {
      const { Resend } = await import('resend');
      const request = createMockRequest(validPayload);

      await POST(request);

      const resendInstance = (Resend as any).mock.results[0].value;
      expect(resendInstance.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'sales@test.com',
          from: 'noreply@test.com',
          replyTo: 'john@example.com',
          subject: expect.stringContaining('2020 BMW M3'),
        })
      );
    });

    it('should include customer email as reply-to', async () => {
      const { Resend } = await import('resend');
      const request = createMockRequest(validPayload);

      await POST(request);

      const resendInstance = (Resend as any).mock.results[0].value;
      const emailCall = resendInstance.emails.send.mock.calls[0][0];
      expect(emailCall.replyTo).toBe('john@example.com');
    });

    it('should work without optional phone number', async () => {
      const payloadWithoutPhone = { ...validPayload, phone: '' };
      const request = createMockRequest(payloadWithoutPhone);

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('Validation Errors', () => {
    it('should return 400 for missing required fields', async () => {
      const invalidPayload = {
        vehicleSlug: 'test-vehicle',
        // Missing firstName, lastName, email, message
      };

      const request = createMockRequest(invalidPayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid request data');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidPayload = {
        ...validPayload,
        email: 'invalid-email',
      };

      const request = createMockRequest(invalidPayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for message too short', async () => {
      const invalidPayload = {
        ...validPayload,
        message: 'Short',
      };

      const request = createMockRequest(invalidPayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for message too long', async () => {
      const invalidPayload = {
        ...validPayload,
        message: 'a'.repeat(1001),
      };

      const request = createMockRequest(invalidPayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('Not Found Cases', () => {
    it('should return 404 if vehicle not found', async () => {
      const { client } = await import('@/sanity/lib/client');
      client.fetch.mockResolvedValueOnce(null);

      const request = createMockRequest(validPayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Vehicle not found');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow up to 10 requests per hour', async () => {
      const headers = { 'x-forwarded-for': '192.168.1.1' };

      // Send 10 requests
      for (let i = 0; i < 10; i++) {
        const request = createMockRequest(validPayload, headers);
        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });

    it('should return 429 after 10 requests from same IP', async () => {
      const headers = { 'x-forwarded-for': '192.168.1.2' };

      // Send 10 requests
      for (let i = 0; i < 10; i++) {
        const request = createMockRequest(validPayload, headers);
        await POST(request);
      }

      // 11th request should be rate limited
      const request = createMockRequest(validPayload, headers);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Rate limit exceeded');
    });

    it('should track different IPs separately', async () => {
      const ip1Request = createMockRequest(validPayload, {
        'x-forwarded-for': '192.168.1.3',
      });
      const ip2Request = createMockRequest(validPayload, {
        'x-forwarded-for': '192.168.1.4',
      });

      const response1 = await POST(ip1Request);
      const response2 = await POST(ip2Request);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should return 500 if Sanity fetch fails', async () => {
      const { client } = await import('@/sanity/lib/client');
      client.fetch.mockRejectedValueOnce(new Error('Database error'));

      const request = createMockRequest(validPayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });

    it('should return 500 if email sending fails', async () => {
      const { Resend } = await import('resend');
      const mockResend = (Resend as any).mock.results[0].value;
      mockResend.emails.send.mockResolvedValueOnce({
        data: null, // No email ID returned
      });

      const request = createMockRequest(validPayload);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });

    it('should handle missing environment variables gracefully', async () => {
      delete process.env.SALES_EMAIL;
      delete process.env.EMAIL_FROM;

      const request = createMockRequest(validPayload);
      const response = await POST(request);

      // Should still work with defaults
      expect(response.status).toBe(200);
    });
  });

  describe('Email Content', () => {
    it('should include all vehicle details in email', async () => {
      const { render } = await import('@react-email/components');
      const request = createMockRequest(validPayload);

      await POST(request);

      expect(render).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({
            vehicleTitle: '2020 BMW M3',
            vehicleYear: 2020,
            vehicleMake: 'BMW',
            vehicleModel: 'M3',
            vehiclePrice: 65000,
            vehicleVin: 'WBS123456789',
            vehicleMileage: 15000,
          }),
        })
      );
    });

    it('should include all customer details in email', async () => {
      const { render } = await import('@react-email/components');
      const request = createMockRequest(validPayload);

      await POST(request);

      expect(render).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '555-123-4567',
            message: "I'm interested in this vehicle",
            hasTradein: true,
            subscribeToPriceDrops: true,
          }),
        })
      );
    });

    it('should include vehicle URL in email', async () => {
      const { render } = await import('@react-email/components');
      const request = createMockRequest(validPayload);

      await POST(request);

      expect(render).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({
            vehicleUrl: 'https://test.com/vehicles/test-vehicle',
          }),
        })
      );
    });
  });
});
