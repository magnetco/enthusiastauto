import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/account", "/api/favorites"];

// Public routes (accessible without authentication)
const publicRoutes = ["/", "/products", "/vehicles", "/search", "/product"];

/**
 * Check if a path matches any of the protected route patterns
 */
function isProtectedRoute(pathname: string): boolean {
	return protectedRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Check if a path is a public route
 */
function isPublicRoute(pathname: string): boolean {
	// Auth routes are public
	if (pathname.startsWith("/auth/")) {
		return true;
	}

	return publicRoutes.some((route) => pathname.startsWith(route));
}

export async function proxy(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;

	// #region agent log
	fetch("http://127.0.0.1:7243/ingest/277d85c7-ac6c-45cc-89d6-a194307a4c56", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			location: "proxy.ts:30",
			message: "Proxy entry",
			data: { pathname, isAuthRoute: pathname.startsWith("/api/auth/") },
			timestamp: Date.now(),
			sessionId: "debug-session",
			runId: "run1",
			hypothesisId: "H1",
		}),
	}).catch(() => {});
	// #endregion

	// Redirect /search to /parts when accessed without a search query
	// This handles the legacy Shopify menu link pointing to /search
	if (pathname === "/search" && !searchParams.has("q")) {
		return NextResponse.redirect(new URL("/parts", request.url));
	}

	// Skip proxy for NextAuth API routes
	if (pathname.startsWith("/api/auth/")) {
		return NextResponse.next();
	}

	// Get the session token
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	const isAuthenticated = !!token;

	// Check if the route is protected
	if (isProtectedRoute(pathname)) {
		if (!isAuthenticated) {
			// For API routes, return 401
			if (pathname.startsWith("/api/")) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}

			// For page routes, redirect to signin with callbackUrl
			const signInUrl = new URL("/auth/signin", request.url);
			signInUrl.searchParams.set("callbackUrl", pathname);
			return NextResponse.redirect(signInUrl);
		}
	}

	// Allow the request to continue
	return NextResponse.next();
}

// Configure which routes the proxy should run on
export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
