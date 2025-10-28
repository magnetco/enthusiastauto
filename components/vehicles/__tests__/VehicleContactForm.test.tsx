import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleContactForm } from '../VehicleContactForm';

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('VehicleContactForm', () => {
  const mockVehicleProps = {
    slug: 'test-vehicle',
    title: '2020 BMW M3',
    year: 2020,
    make: 'BMW',
    model: 'M3',
    price: 65000,
    status: 'current' as const,
    source: 'Enthusiast Auto',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('Rendering', () => {
    it('should render all form fields for available vehicle', () => {
      render(<VehicleContactForm {...mockVehicleProps} />);

      expect(screen.getByText('Message Seller')).toBeInTheDocument();
      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Do you have a trade-in/i)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Email me price drops/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Send Message/i })
      ).toBeInTheDocument();
    });

    it('should show SOLD message for sold vehicles', () => {
      render(<VehicleContactForm {...mockVehicleProps} status="sold" />);

      expect(screen.getByText('SOLD')).toBeInTheDocument();
      expect(
        screen.getByText('This vehicle has been sold.')
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Send Message/i })
      ).not.toBeInTheDocument();
    });

    it('should pre-fill message with vehicle details', () => {
      render(<VehicleContactForm {...mockVehicleProps} />);

      const messageField = screen.getByLabelText(/Message/i) as HTMLTextAreaElement;
      expect(messageField.value).toContain('2020 BMW M3');
      expect(messageField.value).toContain('$65,000');
      expect(messageField.value).toContain('Enthusiast Auto');
    });

    it('should have price drop alerts checkbox pre-checked', () => {
      render(<VehicleContactForm {...mockVehicleProps} />);

      const checkbox = screen.getByLabelText(
        /Email me price drops/i
      ) as HTMLInputElement;
      expect(checkbox).toBeChecked();
    });

    it('should display character counter for message field', () => {
      render(<VehicleContactForm {...mockVehicleProps} />);

      expect(screen.getByText(/\/ 1000/)).toBeInTheDocument();
    });

    it('should display privacy disclaimer', () => {
      render(<VehicleContactForm {...mockVehicleProps} />);

      expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
      expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      const user = userEvent.setup();
      render(<VehicleContactForm {...mockVehicleProps} />);

      // Clear the pre-filled message
      const messageField = screen.getByLabelText(/Message/i);
      await user.clear(messageField);

      // Try to submit
      const submitButton = screen.getByRole('button', { name: /Send Message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/First name must be at least 2 characters/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Last name must be at least 2 characters/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Please enter a valid email address/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Message must be at least 10 characters/i)
        ).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      render(<VehicleContactForm {...mockVehicleProps} />);

      const emailField = screen.getByLabelText(/Email/i);
      await user.type(emailField, 'invalid-email');
      await user.tab(); // Trigger blur

      await waitFor(() => {
        expect(
          screen.getByText(/Please enter a valid email address/i)
        ).toBeInTheDocument();
      });
    });

    it('should validate message length limits', async () => {
      const user = userEvent.setup();
      render(<VehicleContactForm {...mockVehicleProps} />);

      const messageField = screen.getByLabelText(/Message/i);

      // Test min length
      await user.clear(messageField);
      await user.type(messageField, 'Short');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/Message must be at least 10 characters/i)
        ).toBeInTheDocument();
      });

      // Test max length (1001 characters)
      await user.clear(messageField);
      const longMessage = 'a'.repeat(1001);
      await user.type(messageField, longMessage);
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/Message must be less than 1000 characters/i)
        ).toBeInTheDocument();
      });
    });

    it('should update character counter as user types', async () => {
      const user = userEvent.setup();
      render(<VehicleContactForm {...mockVehicleProps} />);

      const messageField = screen.getByLabelText(/Message/i);
      await user.clear(messageField);
      await user.type(messageField, 'Hello world');

      await waitFor(() => {
        expect(screen.getByText('11 / 1000')).toBeInTheDocument();
      });
    });

    it('should allow phone field to be optional', async () => {
      const user = userEvent.setup();
      render(<VehicleContactForm {...mockVehicleProps} />);

      // Fill required fields only
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');

      const submitButton = screen.getByRole('button', { name: /Send Message/i });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, messageId: '123' }),
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      render(<VehicleContactForm {...mockVehicleProps} />);

      // Fill out form
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Phone/i), '555-123-4567');

      // Check trade-in
      const tradeinCheckbox = screen.getByLabelText(/Do you have a trade-in/i);
      await user.click(tradeinCheckbox);

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, messageId: '123' }),
      });

      const submitButton = screen.getByRole('button', { name: /Send Message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/contact/vehicle',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: expect.stringContaining('john@example.com'),
          })
        );
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      render(<VehicleContactForm {...mockVehicleProps} />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');

      (global.fetch as any).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true }),
                }),
              100
            )
          )
      );

      const submitButton = screen.getByRole('button', { name: /Send Message/i });
      await user.click(submitButton);

      expect(screen.getByText('Sending...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('should show success message after submission', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      render(<VehicleContactForm {...mockVehicleProps} />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, messageId: '123' }),
      });

      const submitButton = screen.getByRole('button', { name: /Send Message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Message sent! We'll be in touch soon.",
          expect.any(Object)
        );
      });
    });

    it('should show error message on submission failure', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');

      render(<VehicleContactForm {...mockVehicleProps} />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to send message' }),
      });

      const submitButton = screen.getByRole('button', { name: /Send Message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to send message',
          expect.any(Object)
        );
      });
    });

    it('should include vehicleSlug in submission payload', async () => {
      const user = userEvent.setup();
      render(<VehicleContactForm {...mockVehicleProps} />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const submitButton = screen.getByRole('button', { name: /Send Message/i });
      await user.click(submitButton);

      await waitFor(() => {
        const fetchCall = (global.fetch as any).mock.calls[0];
        const bodyData = JSON.parse(fetchCall[1].body);
        expect(bodyData.vehicleSlug).toBe('test-vehicle');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<VehicleContactForm {...mockVehicleProps} />);

      expect(screen.getByLabelText('First Name')).toHaveAttribute(
        'aria-label',
        'First Name'
      );
      expect(screen.getByLabelText('Last Name')).toHaveAttribute(
        'aria-label',
        'Last Name'
      );
      expect(screen.getByLabelText('Email Address')).toHaveAttribute(
        'aria-label',
        'Email Address'
      );
      expect(screen.getByLabelText('Phone Number')).toHaveAttribute(
        'aria-label',
        'Phone Number'
      );
      expect(screen.getByLabelText('Message')).toHaveAttribute(
        'aria-label',
        'Message'
      );
    });

    it('should mark required fields with asterisk', () => {
      render(<VehicleContactForm {...mockVehicleProps} />);

      const firstNameLabel = screen.getByText('First Name');
      expect(firstNameLabel.parentElement).toHaveTextContent('*');

      const lastNameLabel = screen.getByText('Last Name');
      expect(lastNameLabel.parentElement).toHaveTextContent('*');

      const emailLabel = screen.getByText(/^Email$/);
      expect(emailLabel.parentElement).toHaveTextContent('*');

      const messageLabel = screen.getByText(/^Message$/);
      expect(messageLabel.parentElement).toHaveTextContent('*');
    });

    it('should mark optional field without asterisk', () => {
      render(<VehicleContactForm {...mockVehicleProps} />);

      const phoneLabel = screen.getByText('Phone (optional)');
      expect(phoneLabel.textContent).toContain('optional');
    });
  });
});
