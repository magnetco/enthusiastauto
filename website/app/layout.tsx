import { CartProvider } from "components/cart/cart-context";
import { WelcomeToast } from "components/welcome-toast";
import { SessionProvider } from "lib/auth/SessionProvider";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { Figtree } from "next/font/google";
import localFont from "next/font/local";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";

import { Header } from "components/shared/Header";
import { MobileMenuProvider } from "components/shared/MobileMenuContext";
import { MobileMenu } from "components/shared/MobileMenu";
import { ClientProviders } from "components/layout/ClientProviders";
import { DevModePopout } from "components/dev/DevModePopout";
import "./globals.css";

const isDev = process.env.NODE_ENV === "development";

// Load Figtree font with complete weight range
const figtree = Figtree({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-figtree",
	display: "swap",
});

// Load Chromatic Gothic for headlines
const chromaticGothic = localFont({
	src: "../fonts/chromatic-gothic-regular-trial.woff2",
	variable: "--font-chromatic",
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

export default async function RootLayout({ children }: { children: ReactNode }) {
	// Don't await the fetch, pass the Promise to the context provider
	const cart = getCart();

	return (
		<html lang="en" className={`dark ${figtree.variable} ${chromaticGothic.variable}`}>
			<body className="bg-background text-foreground selection:bg-accent/30 selection:text-accent-foreground antialiased">
				{/* Skip to main content link for keyboard navigation */}
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Skip to main content
				</a>
				<SessionProvider>
					<CartProvider cartPromise={cart}>
						<Suspense fallback={null}>
							<ClientProviders>
								<MobileMenuProvider>
									<Header />
									<MobileMenu />
									<main id="main-content" role="main">
										{children}
										<Toaster closeButton />
										<WelcomeToast />
										{isDev && <DevModePopout />}
									</main>
								</MobileMenuProvider>
							</ClientProviders>
						</Suspense>
					</CartProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
