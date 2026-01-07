import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

// Only available in development
export const dynamic = "force-dynamic";

interface ServiceStatus {
  sanity: {
    status: "running" | "stopped" | "error";
    latency?: number;
    error?: string;
  };
  shopify: {
    status: "connected" | "disconnected" | "error";
    latency?: number;
    error?: string;
  };
  googleOAuth: {
    status: "configured" | "misconfigured" | "error";
    clientId?: string;
    error?: string;
  };
}

export async function GET(): Promise<NextResponse<ServiceStatus>> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({
      sanity: { status: "stopped", error: "Not available in production" },
      shopify: { status: "disconnected", error: "Not available in production" },
      googleOAuth: { status: "error", error: "Not available in production" },
    });
  }

  const status: ServiceStatus = {
    sanity: { status: "stopped" },
    shopify: { status: "disconnected" },
    googleOAuth: { status: "misconfigured" },
  };

  // Check Sanity connection
  try {
    const sanityStart = Date.now();
    await client.fetch('*[_type == "vehicle"][0]{ _id }');
    status.sanity = {
      status: "running",
      latency: Date.now() - sanityStart,
    };
  } catch (error) {
    status.sanity = {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // Check Shopify connection
  try {
    const shopifyStart = Date.now();
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !key) {
      status.shopify = {
        status: "disconnected",
        error: "Missing Shopify credentials",
      };
    } else {
      const endpoint = `https://${domain.replace(/^https?:\/\//, "")}/api/2024-01/graphql.json`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": key,
        },
        body: JSON.stringify({
          query: `{ shop { name } }`,
        }),
      });

      const data = await response.json();
      
      if (data.errors) {
        status.shopify = {
          status: "error",
          error: data.errors[0]?.message || "GraphQL error",
        };
      } else {
        status.shopify = {
          status: "connected",
          latency: Date.now() - shopifyStart,
        };
      }
    }
  } catch (error) {
    status.shopify = {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // Check Google OAuth configuration
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      const missing = [];
      if (!clientId) missing.push("GOOGLE_CLIENT_ID");
      if (!clientSecret) missing.push("GOOGLE_CLIENT_SECRET");
      status.googleOAuth = {
        status: "misconfigured",
        error: `Missing: ${missing.join(", ")}`,
      };
    } else {
      // Mask the client ID for display (show first 20 chars)
      const maskedClientId = clientId.length > 20 
        ? `${clientId.substring(0, 20)}...` 
        : clientId;
      status.googleOAuth = {
        status: "configured",
        clientId: maskedClientId,
      };
    }
  } catch (error) {
    status.googleOAuth = {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  return NextResponse.json(status);
}

