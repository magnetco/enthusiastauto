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

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// #region agent log
	fetch("http://127.0.0.1:7242/ingest/8e57bd47-1002-4b54-b949-1c0c7f037699", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			location: "middleware.ts:30",
			message: "Middleware entry",
			data: { pathname, isAuthRoute: pathname.startsWith("/api/auth/") },
			timestamp: Date.now(),
			sessionId: "debug-session",
			runId: "run1",
			hypothesisId: "A",
		}),
	}).catch(() => {});
	// #endregion

	// Skip middleware for NextAuth API routes (hypothesis A)
	if (pathname.startsWith("/api/auth/")) {
		// #region agent log
		fetch("http://127.0.0.1:7242/ingest/8e57bd47-1002-4b54-b949-1c0c7f037699", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				location: "middleware.ts:36",
				message: "Skipping middleware for auth route",
				data: { pathname },
				timestamp: Date.now(),
				sessionId: "debug-session",
				runId: "run1",
				hypothesisId: "A",
			}),
		}).catch(() => {});
		// #endregion
		return NextResponse.next();
	}

	// Get the session token
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	const isAuthenticated = !!token;

	// #region agent log
	fetch("http://127.0.0.1:7242/ingest/8e57bd47-1002-4b54-b949-1c0c7f037699", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			location: "middleware.ts:48",
			message: "Token check result",
			data: { pathname, isAuthenticated, hasToken: !!token },
			timestamp: Date.now(),
			sessionId: "debug-session",
			runId: "run1",
			hypothesisId: "A",
		}),
	}).catch(() => {});
	// #endregion

	// Check if the route is protected
	if (isProtectedRoute(pathname)) {
		if (!isAuthenticated) {
			// For API routes, return 401
			if (pathname.startsWith("/api/")) {
				// #region agent log
				fetch(
					"http://127.0.0.1:7242/ingest/8e57bd47-1002-4b54-b949-1c0c7f037699",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							location: "middleware.ts:56",
							message: "Returning 401 for protected API route",
							data: { pathname },
							timestamp: Date.now(),
							sessionId: "debug-session",
							runId: "run1",
							hypothesisId: "A",
						}),
					}
				).catch(() => {});
				// #endregion
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}

			// For page routes, redirect to signin with callbackUrl
			const signInUrl = new URL("/auth/signin", request.url);
			signInUrl.searchParams.set("callbackUrl", pathname);
			// #region agent log
			fetch(
				"http://127.0.0.1:7242/ingest/8e57bd47-1002-4b54-b949-1c0c7f037699",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						location: "middleware.ts:64",
						message: "Redirecting to signin",
						data: { pathname, signInUrl: signInUrl.toString() },
						timestamp: Date.now(),
						sessionId: "debug-session",
						runId: "run1",
						hypothesisId: "A",
					}),
				}
			).catch(() => {});
			// #endregion
			return NextResponse.redirect(signInUrl);
		}
	}

	// Allow the request to continue
	// #region agent log
	fetch("http://127.0.0.1:7242/ingest/8e57bd47-1002-4b54-b949-1c0c7f037699", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			location: "middleware.ts:70",
			message: "Allowing request to continue",
			data: { pathname },
			timestamp: Date.now(),
			sessionId: "debug-session",
			runId: "run1",
			hypothesisId: "A",
		}),
	}).catch(() => {});
	// #endregion
	return NextResponse.next();
}

// Configure which routes the middleware should run on
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
