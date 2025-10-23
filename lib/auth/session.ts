import NextAuth from "next-auth";
import { authConfig } from "./config";

// Initialize NextAuth with our config
const { auth } = NextAuth(authConfig);

/**
 * Get the current user session on the server
 * Use this in Server Components, Route Handlers, and Server Actions
 */
export async function getServerSession() {
  return await auth();
}

/**
 * Get the current user from the session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user || null;
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session?.user;
}
