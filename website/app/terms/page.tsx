import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { TextHero } from "@/components/shared/TextHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service | Enthusiast Auto",
	description: "Terms of Service for Enthusiast Auto Group.",
};

export default function TermsPage() {
	const lastUpdated = "January 1, 2025";

	return (
		<>
			<Section>
				<TextHero title="Terms of Service" />

				<div className="mx-auto max-w-3xl">
					<p className="mb-8 text-sm italic text-muted-foreground">
						Last updated: {lastUpdated}
					</p>

					<div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
						<h2>Agreement to Terms</h2>
						<p>
							By accessing or using the Enthusiast Auto Group website and
							services, you agree to be bound by these Terms of Service. If you
							do not agree to these terms, please do not use our services.
						</p>

						<h2>Use of Our Services</h2>
						<h3>Eligibility</h3>
						<p>
							You must be at least 18 years old to use our services or make
							purchases. By using our website, you represent that you meet this
							age requirement.
						</p>

						<h3>Account Responsibilities</h3>
						<p>
							If you create an account, you are responsible for maintaining the
							confidentiality of your account credentials and for all activities
							that occur under your account. Please notify us immediately of any
							unauthorized use.
						</p>

						<h3>Prohibited Activities</h3>
						<p>You agree not to:</p>
						<ul>
							<li>Use our services for any unlawful purpose</li>
							<li>Attempt to gain unauthorized access to our systems</li>
							<li>Interfere with the proper functioning of our website</li>
							<li>
								Submit false or misleading information in forms or listings
							</li>
							<li>Violate any applicable laws or regulations</li>
						</ul>

						<h2>Vehicle Sales and Purchases</h2>
						<h3>Vehicle Listings</h3>
						<p>
							We make every effort to ensure the accuracy of vehicle listings,
							including descriptions, specifications, and pricing. However, we
							are not responsible for typographical errors or omissions. All
							listings are subject to prior sale.
						</p>

						<h3>Vehicle Condition</h3>
						<p>
							While we conduct thorough inspections and rejuvenation processes,
							all vehicles are sold in their current condition. We recommend a
							personal inspection or independent pre-purchase inspection before
							completing any purchase.
						</p>

						<h3>Pricing and Payment</h3>
						<p>
							All prices are in US dollars unless otherwise stated. Payment terms
							and methods will be agreed upon during the purchase process. Full
							payment is required before vehicle delivery.
						</p>

						<h2>Consignment and Selling Services</h2>
						<p>
							If you choose to sell, consign, or auction your vehicle through
							Enthusiast Auto Group, separate terms and agreements will apply.
							These will be provided and must be signed before we represent your
							vehicle.
						</p>

						<h2>Service Appointments</h2>
						<p>
							Service appointments are scheduled based on availability. We
							reserve the right to modify service recommendations based on our
							inspection of your vehicle. Service estimates are provided in good
							faith but may change based on actual conditions discovered during
							work.
						</p>

						<h2>Intellectual Property</h2>
						<p>
							All content on our website, including text, images, logos, and
							design elements, is owned by Enthusiast Auto Group or our
							licensors and is protected by copyright and trademark laws. You may
							not reproduce, distribute, or create derivative works without our
							written permission.
						</p>

						<h2>Disclaimer of Warranties</h2>
						<p>
							Our website and services are provided "as is" without warranties of
							any kind, either express or implied. We do not guarantee that our
							website will be uninterrupted, secure, or error-free.
						</p>

						<h2>Limitation of Liability</h2>
						<p>
							To the fullest extent permitted by law, Enthusiast Auto Group shall
							not be liable for any indirect, incidental, special, consequential,
							or punitive damages arising from your use of our services.
						</p>

						<h2>Indemnification</h2>
						<p>
							You agree to indemnify and hold harmless Enthusiast Auto Group and
							its officers, directors, employees, and agents from any claims,
							damages, or expenses arising from your use of our services or
							violation of these terms.
						</p>

						<h2>Governing Law</h2>
						<p>
							These Terms of Service are governed by the laws of the State of
							Ohio, without regard to conflict of law principles. Any disputes
							shall be resolved in the courts located in Hamilton County, Ohio.
						</p>

						<h2>Changes to Terms</h2>
						<p>
							We reserve the right to modify these Terms of Service at any time.
							Changes will be effective when posted on this page. Your continued
							use of our services after changes constitutes acceptance of the new
							terms.
						</p>

						<h2>Severability</h2>
						<p>
							If any provision of these Terms is found to be unenforceable, the
							remaining provisions will continue in full force and effect.
						</p>

						<h2>Contact Information</h2>
						<p>
							For questions about these Terms of Service, please contact us:
						</p>
						<ul>
							<li>
								<strong>Address:</strong> 11608 Reading Rd, Cincinnati, OH 45241
							</li>
							<li>
								<strong>Phone:</strong> 513-554-1269
							</li>
							<li>
								<strong>Email:</strong> legal@enthusiastauto.com
							</li>
						</ul>
					</div>
				</div>
			</Section>
			<Footer />
		</>
	);
}

