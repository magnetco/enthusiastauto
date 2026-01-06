import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { SellPageContent } from "@/components/sell/SellPageContent";
import type { Metadata } from "next";

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

export default function SellPage() {
	return (
		<>
			<SellPageContent />
			<Footer />
		</>
	);
}

