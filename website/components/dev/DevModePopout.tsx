"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Code2,
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
  ChevronDown,
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
  blog: [{ path: "/blog", label: "Under the Hood", icon: BookOpen }],
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

function StatusDot({
  status,
}: {
  status: "running" | "stopped" | "connected" | "disconnected" | "configured" | "misconfigured" | "error";
}) {
  const isGood = status === "running" || status === "connected" || status === "configured";
  const isError = status === "error";

  return (
    <span className={`relative flex h-2 w-2 ${isGood ? "" : "animate-none"}`}>
      {isGood && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      )}
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${
          isGood ? "bg-green-500" : isError ? "bg-red-500" : "bg-yellow-500"
        }`}
      />
    </span>
  );
}

function SitemapSection({
  title,
  items,
}: {
  title: string;
  items: { path: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-white/50 transition-colors hover:text-white/70"
      >
        {title}
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pb-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className="group flex items-center gap-2 rounded px-3 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Icon className="h-3 w-3 text-white/30 transition-colors group-hover:text-blue-400" />
                    <span className="flex-1 truncate">{item.label}</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-50" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DevModePopout() {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="fixed bottom-6 right-24 z-40">
      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 rounded-xl border border-white/10 bg-[#141721] shadow-high"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Code2 className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">Dev Tools</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close dev tools"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto">
              {/* Service Status */}
              <div className="border-b border-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-white/50">
                    Services
                  </span>
                  <button
                    onClick={fetchStatus}
                    disabled={isLoading}
                    className="rounded p-1 text-white/40 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
                    aria-label="Refresh status"
                  >
                    <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
                <div className="space-y-2">
                  {/* Sanity */}
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-orange-500/20">
                        <span className="text-xs font-bold text-orange-400">S</span>
                      </div>
                      <span className="text-xs text-white/80">Sanity</span>
                    </div>
                    {status && <StatusDot status={status.sanity.status} />}
                  </div>

                  {/* Shopify */}
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-green-500/20">
                        <ShoppingBag className="h-3 w-3 text-green-400" />
                      </div>
                      <span className="text-xs text-white/80">Shopify</span>
                    </div>
                    {status && <StatusDot status={status.shopify.status} />}
                  </div>

                  {/* Google OAuth */}
                  <a
                    href={GOOGLE_OAUTH_CONSOLE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/20">
                        <svg className="h-3 w-3" viewBox="0 0 24 24">
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
                      <span className="text-xs text-white/80">Google</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {status && <StatusDot status={status.googleOAuth.status} />}
                      <ExternalLink className="h-3 w-3 text-white/20 transition-colors group-hover:text-white/40" />
                    </div>
                  </a>
                </div>
              </div>

              {/* Sitemap */}
              <div className="p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/50">
                  Sitemap
                </div>
                <div className="space-y-0">
                  <SitemapSection title="Main" items={sitemapData.main} />
                  <SitemapSection title="Inventory" items={sitemapData.inventory} />
                  <SitemapSection title="Services" items={sitemapData.services} />
                  <SitemapSection title="Commerce" items={sitemapData.commerce} />
                  <SitemapSection title="Blog" items={sitemapData.blog} />
                  <SitemapSection title="Auth" items={sitemapData.auth} />
                  <SitemapSection title="Account" items={sitemapData.account} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-high transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0a0c10]"
          aria-label="Open dev tools"
        >
          <Code2 className="h-6 w-6" />

          {/* Tooltip */}
          <span className="absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded-lg bg-[#141721] px-3 py-2 text-sm text-white shadow-medium group-hover:block">
            Dev Tools
          </span>
        </button>
      )}
    </div>
  );
}

