import { randomBytes } from "crypto";

/**
 * Generate a cryptographically secure random token
 * @returns Random token string (32 bytes, hex encoded)
 */
export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Verify a token against stored token data
 * @param token - Token to verify
 * @param storedToken - Stored token data with expiry
 * @returns True if token matches and hasn't expired
 */
export function verifyToken(
  token: string,
  storedToken: { token: string; expires: Date }
): boolean {
  if (token !== storedToken.token) {
    return false;
  }

  if (new Date() > storedToken.expires) {
    return false;
  }

  return true;
}

/**
 * Check if a token has expired
 * @param expiresAt - Token expiry date
 * @returns True if token has expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
