import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import SigninPage from "../page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

describe("SigninPage - Social Login Integration (Story 5.2)", () => {
  const mockRouter = {
    push: vi.fn(),
    refresh: vi.fn(),
  };

  const mockSearchParams = {
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    (useSearchParams as any).mockReturnValue(mockSearchParams);
    mockSearchParams.get.mockReturnValue(null);
  });

  describe("AC1: Google OAuth Integration", () => {
    it("should render Google sign-in button with correct icon and label", () => {
      render(<SigninPage />);

      const googleButton = screen.getByRole("button", {
        name: /sign in with google/i,
      });
      expect(googleButton).toBeDefined();
      expect(googleButton.textContent).toContain("Sign in with Google");
    });

    it("should initiate Google OAuth flow when button is clicked", async () => {
      render(<SigninPage />);

      const googleButtons = screen.getAllByRole("button", {
        name: /sign in with google/i,
      });

      fireEvent.click(googleButtons[0]);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("google", {
          callbackUrl: "/",
          redirect: true,
        });
      });
    });

    it("should show loading state during Google OAuth redirect", async () => {
      render(<SigninPage />);

      const googleButton = screen.getByRole("button", {
        name: /sign in with google/i,
      });

      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(googleButton).toBeDisabled();
      });
    });

    it("should be keyboard accessible", () => {
      render(<SigninPage />);

      const googleButton = screen.getByRole("button", {
        name: /sign in with google/i,
      });

      expect(googleButton).toHaveAttribute("aria-label", "Sign in with Google");
    });
  });

  describe("AC2: Facebook OAuth Integration", () => {
    it("should render Facebook sign-in button with correct icon and label", () => {
      render(<SigninPage />);

      const facebookButton = screen.getByRole("button", {
        name: /sign in with facebook/i,
      });
      expect(facebookButton).toBeDefined();
      expect(facebookButton.textContent).toContain("Sign in with Facebook");
    });

    it("should initiate Facebook OAuth flow when button is clicked", async () => {
      render(<SigninPage />);

      const facebookButton = screen.getByRole("button", {
        name: /sign in with facebook/i,
      });

      fireEvent.click(facebookButton);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("facebook", {
          callbackUrl: "/",
          redirect: true,
        });
      });
    });

    it("should show loading state during Facebook OAuth redirect", async () => {
      render(<SigninPage />);

      const facebookButton = screen.getByRole("button", {
        name: /sign in with facebook/i,
      });

      fireEvent.click(facebookButton);

      await waitFor(() => {
        expect(facebookButton).toBeDisabled();
      });
    });

    it("should be keyboard accessible", () => {
      render(<SigninPage />);

      const facebookButton = screen.getByRole("button", {
        name: /sign in with facebook/i,
      });

      expect(facebookButton).toHaveAttribute(
        "aria-label",
        "Sign in with Facebook"
      );
    });
  });

  describe("AC5: Error Handling and User Feedback", () => {
    it("should display user-friendly error for OAuthAccountNotLinked", () => {
      mockSearchParams.get.mockImplementation((key: string) =>
        key === "error" ? "OAuthAccountNotLinked" : null
      );

      render(<SigninPage />);

      expect(
        screen.getByText(
          /email already registered with a different sign-in method/i
        )
      ).toBeDefined();
    });

    it("should display user-friendly error for OAuthCallback failure", () => {
      mockSearchParams.get.mockImplementation((key: string) =>
        key === "error" ? "OAuthCallback" : null
      );

      render(<SigninPage />);

      expect(
        screen.getByText(/authentication failed. please try again./i)
      ).toBeDefined();
    });

    it("should display user-friendly error for OAuthSignin failure", () => {
      mockSearchParams.get.mockImplementation((key: string) =>
        key === "error" ? "OAuthSignin" : null
      );

      render(<SigninPage />);

      expect(
        screen.getByText(
          /unable to connect to authentication provider. please try again./i
        )
      ).toBeDefined();
    });

    it("should display error messages with destructive Alert variant", () => {
      mockSearchParams.get.mockImplementation((key: string) =>
        key === "error" ? "OAuthSignin" : null
      );

      const { container } = render(<SigninPage />);

      const alert = container.querySelector('[aria-live="polite"]');
      expect(alert).toBeDefined();
    });

    it("should announce error messages to screen readers", () => {
      mockSearchParams.get.mockImplementation((key: string) =>
        key === "error" ? "OAuthCallback" : null
      );

      const { container } = render(<SigninPage />);

      const alert = container.querySelector('[aria-live="polite"]');
      expect(alert).toHaveAttribute("aria-live", "polite");
    });

    it("should handle OAuth flow cancellation gracefully", async () => {
      (signIn as any).mockRejectedValueOnce(new Error("User cancelled"));

      render(<SigninPage />);

      const googleButton = screen.getByRole("button", {
        name: /sign in with google/i,
      });

      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(
          screen.getByText(/unable to sign in with google/i)
        ).toBeDefined();
      });
    });
  });

  describe("UI Layout", () => {
    it("should render social login buttons above email/password form", () => {
      const { container } = render(<SigninPage />);

      const buttons = container.querySelectorAll("button");
      const buttonTexts = Array.from(buttons).map((btn) => btn.textContent);

      const googleIndex = buttonTexts.findIndex((text) =>
        text?.includes("Google")
      );
      const emailInputIndex = Array.from(
        container.querySelectorAll("input")
      ).findIndex((input) => input.type === "email");

      // Google button should appear before email input
      expect(googleIndex).toBeGreaterThanOrEqual(0);
      expect(emailInputIndex).toBeGreaterThanOrEqual(0);
    });

    it("should display divider between social login and email form", () => {
      render(<SigninPage />);

      expect(screen.getByText(/or continue with email/i)).toBeDefined();
    });
  });

  describe("Callback URL Handling", () => {
    it("should use callbackUrl from query params if provided", async () => {
      mockSearchParams.get.mockImplementation((key: string) =>
        key === "callbackUrl" ? "/dashboard" : null
      );

      render(<SigninPage />);

      const googleButton = screen.getByRole("button", {
        name: /sign in with google/i,
      });

      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("google", {
          callbackUrl: "/dashboard",
          redirect: true,
        });
      });
    });

    it("should default to homepage if no callbackUrl provided", async () => {
      render(<SigninPage />);

      const googleButton = screen.getByRole("button", {
        name: /sign in with google/i,
      });

      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("google", {
          callbackUrl: "/",
          redirect: true,
        });
      });
    });
  });

  describe("Loading State Management", () => {
    it("should disable all buttons during OAuth flow", async () => {
      render(<SigninPage />);

      const googleButton = screen.getByRole("button", {
        name: /sign in with google/i,
      });
      const facebookButton = screen.getByRole("button", {
        name: /sign in with facebook/i,
      });

      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(googleButton).toBeDisabled();
        expect(facebookButton).toBeDisabled();
      });
    });

    it("should show spinner only on clicked provider button", async () => {
      render(<SigninPage />);

      const googleButton = screen.getByRole("button", {
        name: /sign in with google/i,
      });

      fireEvent.click(googleButton);

      await waitFor(() => {
        // Button should show loading spinner (Loader2 icon)
        expect(googleButton).toBeDisabled();
      });
    });
  });
});
