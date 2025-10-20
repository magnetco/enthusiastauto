import { CartProvider } from "components/cart/cart-context";
import { FilterProvider } from "contexts/FilterContext";
import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { Figtree } from "next/font/google";
import { getCart } from "lib/shopify";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";

// Load Figtree font with complete weight range
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
  display: "swap",
});

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en" className={`dark ${figtree.variable}`}>
      <body className="bg-background text-foreground selection:bg-accent/30 selection:text-accent-foreground antialiased">
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <CartProvider cartPromise={cart}>
          <Suspense fallback={null}>
            <FilterProvider>
              <Navbar />
              <main id="main-content" role="main">
                {children}
                <Toaster closeButton />
                <WelcomeToast />
              </main>
            </FilterProvider>
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}
