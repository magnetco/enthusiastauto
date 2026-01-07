import { SellPageContent } from "@/components/sell/SellPageContent";
import type { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
	title: "Sell Your BMW | Enthusiast Auto",
	description:
		"Sell, consign, or auction your BMW with Enthusiast Auto Group. We specialize in M-Series vehicles and provide immediate payment, expert valuation, and full rejuvenation services.",
	openGraph: {
		type: "website",
		title: "Sell Your BMW | Enthusiast Auto",
		description:
			"Three ways to sell your BMW: direct sale, consignment, or auction representation.",
		siteName: "Enthusiast Auto",
	},
};

/**
 * Sell Page - Multi-step vehicle submission wizard
 * Full-width, stage-by-stage form for sell/consign/auction submissions
 */
export default function SellPage() {
	return <SellPageContent />;
}
