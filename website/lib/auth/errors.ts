// Auth error messages (user-friendly, no sensitive data)
export const AUTH_ERRORS = {
  // Registration errors
  DUPLICATE_EMAIL: "An account with this email already exists",
  INVALID_EMAIL: "Please enter a valid email address",
  WEAK_PASSWORD:
    "Password must be at least 8 characters with uppercase, lowercase, and number",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  REQUIRED_FIELD: "This field is required",

  // Login errors
  INVALID_CREDENTIALS: "Invalid email or password",
  RATE_LIMIT_EXCEEDED:
    "Too many login attempts. Please try again in 15 minutes.",
  ACCOUNT_NOT_FOUND: "Invalid email or password", // Same as invalid credentials (prevent enumeration)

  // Email verification errors
  INVALID_TOKEN: "Invalid or expired verification link",
  TOKEN_EXPIRED: "Verification link has expired. Please request a new one.",
  EMAIL_ALREADY_VERIFIED: "This email address is already verified",

  // Password reset errors
  RESET_TOKEN_INVALID: "Invalid or expired password reset link",
  RESET_TOKEN_EXPIRED:
    "Password reset link has expired. Please request a new one.",

  // Network/system errors
  NETWORK_ERROR: "Something went wrong. Please try again.",
  EMAIL_SEND_FAILED: "Email could not be sent. Please try again.",
  DATABASE_ERROR: "Something went wrong. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;

// HTTP status codes for auth errors
export const AUTH_HTTP_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
