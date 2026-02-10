"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Code2,
  Map,
  ChevronRight,
  X,
  RefreshCw,
  ExternalLink,
  Home,
  Car,
  Wrench,
  ShoppingBag,
  Search,
  User,
  FileText,
  Settings,
  Info,
  BookOpen,
  Mail,
} from "lucide-react";

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

const GOOGLE_OAUTH_CONSOLE_URL =
  "https://console.cloud.google.com/auth/clients/61341800176-l4i5d8vl66bjitku4sp96m8854f4l3qa.apps.googleusercontent.com?project=vital-amphora-440806-v7";

// Sitemap data structure
const sitemapData = {
  main: [
    { path: "/", label: "Homepage", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: Mail },
    { path: "/privacy", label: "Privacy Policy", icon: FileText },
    { path: "/terms", label: "Terms of Service", icon: FileText },
  ],
  inventory: [
    { path: "/vehicles", label: "Vehicle Inventory", icon: Car },
    { path: "/parts", label: "Parts Catalog", icon: Wrench },
    { path: "/merchandise", label: "Merchandise", icon: ShoppingBag },
  ],
  services: [
    { path: "/services", label: "All Services", icon: Settings },
    { path: "/services/conditioning", label: "Conditioning", icon: Wrench },
    { path: "/services/rejuvenation", label: "Rejuvenation", icon: Wrench },
    { path: "/services/mechanical", label: "Mechanical", icon: Wrench },
    { path: "/services/cosmetic", label: "Cosmetic", icon: Wrench },
  ],
  commerce: [
    { path: "/search", label: "Search", icon: Search },
    { path: "/sell", label: "Sell Your Car", icon: Car },
  ],
  blog: [
    { path: "/blog", label: "Under the Hood", icon: BookOpen },
  ],
  auth: [
    { path: "/auth/signin", label: "Sign In", icon: User },
    { path: "/auth/signup", label: "Sign Up", icon: User },
    { path: "/auth/reset-password", label: "Reset Password", icon: User },
  ],
  account: [
    { path: "/account", label: "Account Dashboard", icon: User },
    { path: "/account/profile", label: "Profile", icon: Settings },
    { path: "/account/garage", label: "My Garage", icon: Car },
  ],
};

function StatusIndicator({
  status,
  type,
  href,
}: {
  status: "running" | "stopped" | "connected" | "disconnected" | "configured" | "misconfigured" | "error";
  type: "sanity" | "shopify" | "google";
  href?: string;
}) {
  const isGood = status === "running" || status === "connected" || status === "configured";
  const isError = status === "error";

  const labels: Record<typeof type, string> = {
    sanity: "Sanity",
    shopify: "Shopify",
    google: "Google OAuth",
  };

  const content = (
    <div className={`flex items-center gap-2 ${href ? "group cursor-pointer" : ""}`}>
      <span
        className={`relative flex h-2.5 w-2.5 ${isGood ? "" : "animate-none"}`}
      >
        {isGood && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            isGood
              ? "bg-green-500"
              : isError
                ? "bg-red-500"
                : "bg-yellow-500"
          }`}
        />
      </span>
      <span className={`text-xs font-medium text-white/80 ${href ? "group-hover:text-white" : ""}`}>
        {labels[type]}
      </span>
      <span
        className={`text-xs ${
          isGood
            ? "text-green-400"
            : isError
              ? "text-red-400"
              : "text-yellow-400"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      {href && (
        <ExternalLink className="h-3 w-3 text-white/30 transition-colors group-hover:text-white/60" />
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}

function SitemapSection({
  title,
  items,
}: {
  title: string;
  items: { path: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
        {title}
      </h4>
      <div className="grid gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.path}
              href={item.path}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-all hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-4 w-4 text-white/40 transition-colors group-hover:text-blue-400" />
              <span className="flex-1">{item.label}</span>
              <code className="hidden text-xs text-white/30 transition-colors group-hover:text-white/50 sm:block">
                {item.path}
              </code>
              <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function DevModePopout() {
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/dev/status");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Failed to fetch dev status:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return (
    <div className="relative w-full border-t border-white/10 bg-[#0a0c10]">
      <div className="mx-auto max-w-[var(--container-max)] px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Dev Tools</h2>
                <p className="text-sm text-white/50">
                  Development environment status and navigation
                </p>
              </div>
            </div>
            <span className="rounded-full bg-blue-500/20 px-3 py-1.5 text-xs font-medium text-blue-400">
              DEV MODE
            </span>
          </div>
        </div>

        {/* Status Cards */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Sanity Status */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">
                  <span className="text-lg font-bold text-orange-400">S</span>
                </div>
                <span className="font-semibold text-white">Sanity CMS</span>
              </div>
              {status && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    status.sanity.status === "running"
                      ? "bg-green-500/20 text-green-400"
                      : status.sanity.status === "error"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {status.sanity.status.toUpperCase()}
                </span>
              )}
            </div>
            {status?.sanity.latency && (
              <p className="text-xs text-white/40">
                Response time: {status.sanity.latency}ms
              </p>
            )}
            {status?.sanity.error && (
              <p className="mt-1 text-xs text-red-400">
                {status.sanity.error}
              </p>
            )}
          </div>

          {/* Shopify Status */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
                  <ShoppingBag className="h-4 w-4 text-green-400" />
                </div>
                <span className="font-semibold text-white">
                  Shopify Storefront
                </span>
              </div>
              {status && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    status.shopify.status === "connected"
                      ? "bg-green-500/20 text-green-400"
                      : status.shopify.status === "error"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {status.shopify.status.toUpperCase()}
                </span>
              )}
            </div>
            {status?.shopify.latency && (
              <p className="text-xs text-white/40">
                Response time: {status.shopify.latency}ms
              </p>
            )}
            {status?.shopify.error && (
              <p className="mt-1 text-xs text-red-400">
                {status.shopify.error}
              </p>
            )}
          </div>

          {/* Google OAuth Status */}
          <a
            href={GOOGLE_OAUTH_CONSOLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:border-white/20 hover:bg-white/10"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-white">
                  Google OAuth
                </span>
              </div>
              <div className="flex items-center gap-2">
                {status && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      status.googleOAuth.status === "configured"
                        ? "bg-green-500/20 text-green-400"
                        : status.googleOAuth.status === "error"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {status.googleOAuth.status.toUpperCase()}
                  </span>
                )}
                <ExternalLink className="h-4 w-4 text-white/30 transition-colors group-hover:text-white/60" />
              </div>
            </div>
            {status?.googleOAuth.clientId && (
              <p className="text-xs text-white/40">
                Client ID: <code className="text-white/60">{status.googleOAuth.clientId}</code>
              </p>
            )}
            {status?.googleOAuth.error && (
              <p className="mt-1 text-xs text-red-400">
                {status.googleOAuth.error}
              </p>
            )}
            <p className="mt-2 text-xs text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
              Open Google Cloud Console →
            </p>
          </a>
        </div>

        {/* Sitemap Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <Map className="h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Sitemap</h3>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <SitemapSection title="Main Pages" items={sitemapData.main} />
            <SitemapSection title="Inventory" items={sitemapData.inventory} />
            <SitemapSection title="Services" items={sitemapData.services} />
            <SitemapSection title="Commerce" items={sitemapData.commerce} />
            <SitemapSection title="Blog" items={sitemapData.blog} />
            <SitemapSection title="Authentication" items={sitemapData.auth} />
            <SitemapSection title="Account" items={sitemapData.account} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end border-t border-white/10 pt-6">
          <button
            onClick={fetchStatus}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}

