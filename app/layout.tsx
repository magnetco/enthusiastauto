import { CartProvider } from "components/cart/cart-context";
import { FilterProvider } from "contexts/FilterContext";
import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { Inter } from "next/font/google";
import { getCart } from "lib/shopify";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";

// Load Inter Variable with Linear's custom weights
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
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
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="bg-background text-foreground selection:bg-accent/30 selection:text-accent-foreground antialiased">
        <CartProvider cartPromise={cart}>
          <Suspense fallback={null}>
            <FilterProvider>
              <Navbar />
              <main>
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
