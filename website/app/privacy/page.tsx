import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { TextHero } from "@/components/shared/TextHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy | Enthusiast Auto",
	description: "Privacy Policy for Enthusiast Auto Group.",
};

export default function PrivacyPage() {
	const lastUpdated = "January 1, 2025";

	return (
		<>
			<Section>
				<TextHero title="Privacy Policy" />

				<div className="mx-auto max-w-3xl">
					<p className="mb-8 text-sm italic text-muted-foreground">
						Last updated: {lastUpdated}
					</p>

					<div className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
						<h2>Introduction</h2>
						<p>
							Enthusiast Auto Group ("we," "our," or "us") respects your privacy
							and is committed to protecting your personal information. This
							Privacy Policy explains how we collect, use, disclose, and
							safeguard your information when you visit our website or use our
							services.
						</p>

						<h2>Information We Collect</h2>
						<h3>Information You Provide</h3>
						<p>We collect information you voluntarily provide to us, including:</p>
						<ul>
							<li>
								Contact information (name, email address, phone number, mailing
								address)
							</li>
							<li>
								Vehicle information (make, model, year, VIN, mileage) when
								submitting forms
							</li>
							<li>
								Account information when you create an account on our website
							</li>
							<li>
								Payment information when making purchases (processed securely by
								our payment providers)
							</li>
							<li>Any other information you choose to provide</li>
						</ul>

						<h3>Information Collected Automatically</h3>
						<p>
							When you visit our website, we automatically collect certain
							information, including:
						</p>
						<ul>
							<li>IP address and browser type</li>
							<li>Device information</li>
							<li>Pages viewed and time spent on pages</li>
							<li>Referring website addresses</li>
							<li>Cookies and similar tracking technologies</li>
						</ul>

						<h2>How We Use Your Information</h2>
						<p>We use the information we collect to:</p>
						<ul>
							<li>Provide, maintain, and improve our services</li>
							<li>Process transactions and send related information</li>
							<li>
								Respond to your inquiries and provide customer support
							</li>
							<li>
								Send promotional communications (with your consent where
								required)
							</li>
							<li>Analyze usage patterns to improve our website</li>
							<li>Comply with legal obligations</li>
						</ul>

						<h2>Information Sharing</h2>
						<p>
							We do not sell your personal information. We may share your
							information with:
						</p>
						<ul>
							<li>
								Service providers who assist in our operations (payment
								processing, email delivery, analytics)
							</li>
							<li>
								Professional advisors (lawyers, accountants) as necessary
							</li>
							<li>Law enforcement when required by law</li>
							<li>
								Other parties in connection with a merger, acquisition, or sale
								of assets
							</li>
						</ul>

						<h2>Cookies and Tracking</h2>
						<p>
							We use cookies and similar technologies to enhance your experience
							on our website. You can control cookie preferences through your
							browser settings. Note that disabling cookies may affect website
							functionality.
						</p>

						<h2>Data Security</h2>
						<p>
							We implement appropriate technical and organizational measures to
							protect your personal information. However, no method of
							transmission over the Internet is 100% secure, and we cannot
							guarantee absolute security.
						</p>

						<h2>Your Rights</h2>
						<p>
							Depending on your location, you may have rights regarding your
							personal information, including:
						</p>
						<ul>
							<li>Access to your personal information</li>
							<li>Correction of inaccurate information</li>
							<li>Deletion of your information</li>
							<li>Opting out of marketing communications</li>
						</ul>
						<p>
							To exercise these rights, please contact us using the information
							below.
						</p>

						<h2>Third-Party Links</h2>
						<p>
							Our website may contain links to third-party websites. We are not
							responsible for the privacy practices of these websites and
							encourage you to review their privacy policies.
						</p>

						<h2>Children's Privacy</h2>
						<p>
							Our services are not directed to individuals under 18 years of age.
							We do not knowingly collect personal information from children.
						</p>

						<h2>Changes to This Policy</h2>
						<p>
							We may update this Privacy Policy from time to time. We will notify
							you of any changes by posting the new policy on this page and
							updating the "Last updated" date.
						</p>

						<h2>Contact Us</h2>
						<p>
							If you have questions about this Privacy Policy, please contact us:
						</p>
						<ul>
							<li>
								<strong>Address:</strong> 11608 Reading Rd, Cincinnati, OH 45241
							</li>
							<li>
								<strong>Phone:</strong> 513-554-1269
							</li>
							<li>
								<strong>Email:</strong> privacy@enthusiastauto.com
							</li>
						</ul>
					</div>
				</div>
			</Section>
			<Footer />
		</>
	);
}

