import Link from "next/link";
import FlagIcon from "@/components/icons/flag";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const { COMPANY_NAME, SITE_NAME } = process.env;

const footerLinks = {
	inventory: {
		title: "Inventory",
		links: [
			{ label: "Current Inventory", href: "/vehicles" },
			{ label: "Previously Sold", href: "/vehicles?status=sold" },
			{ label: "Incoming Vehicles", href: "/vehicles?status=incoming" },
			{ label: "Sell Your Car", href: "/sell" },
		],
	},
	shop: {
		title: "Shop",
		links: [
			{ label: "All Parts", href: "/search" },
			{ label: "Merchandise", href: "/merchandise" },
			{ label: "EAG Collection", href: "/collection" },
		],
	},
	services: {
		title: "Services",
		links: [
			{ label: "All Services", href: "/services" },
			{ label: "Pre-Purchase Inspection", href: "/services/pre-purchase-inspection" },
			{ label: "Performance Upgrades", href: "/services/performance-upgrades" },
			{ label: "Maintenance", href: "/services/maintenance" },
		],
	},
	company: {
		title: "Company",
		links: [
			{ label: "About EAG", href: "/about" },
			{ label: "Under the Hood", href: "/blog" },
			{ label: "Contact Us", href: "/contact" },
			{ label: "My Account", href: "/account" },
		],
	},
	legal: {
		title: "Legal",
		links: [
			{ label: "Privacy Policy", href: "/privacy" },
			{ label: "Terms of Service", href: "/terms" },
		],
	},
};

const socialLinks = [
	{ 
		label: "Instagram", 
		href: "https://www.instagram.com/eagbmw/", 
		icon: Instagram 
	},
	{ 
		label: "Facebook", 
		href: "https://www.facebook.com/EAGBMW/", 
		icon: Facebook 
	},
	{ 
		label: "YouTube", 
		href: "https://www.youtube.com/@EnthusiastAutoGroupCincinnati", 
		icon: Youtube 
	},
];

export default function Footer() {
	const currentYear = new Date().getFullYear();
	const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
	const copyrightName = COMPANY_NAME || SITE_NAME || "Enthusiast Auto Group";

	return (
		<footer className="border-t border-white/10 bg-[#0a0a0a]">
			{/* Main Footer Content */}
			<div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
				<div className="grid gap-12 lg:grid-cols-6">
					{/* Brand Column */}
					<div className="lg:col-span-2">
						<Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-80">
							<FlagIcon className="h-10 w-auto" />
						</Link>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
							Curating the finest BMW enthusiast vehicles. From classic E30s to modern M cars, 
							we specialize in driver-focused machines for the true enthusiast.
						</p>
						
						{/* Contact Info */}
						<div className="mt-6 space-y-2">
							<a 
								href="tel:+15551234567" 
								className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
							>
								<Phone className="h-4 w-4" />
								<span>(555) 123-4567</span>
							</a>
							<a 
								href="mailto:info@enthusiastauto.com" 
								className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
							>
								<Mail className="h-4 w-4" />
								<span>info@enthusiastauto.com</span>
							</a>
							<div className="flex items-start gap-2 text-sm text-white/60">
								<MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
								<span>123 Performance Drive<br />Houston, TX 77001</span>
							</div>
						</div>

						{/* Social Links */}
						<div className="mt-6 flex items-center gap-3">
							{socialLinks.map((social) => (
								<a
									key={social.label}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-white/30 hover:bg-white/5 hover:text-white"
									aria-label={social.label}
								>
									<social.icon className="h-4 w-4" />
								</a>
							))}
						</div>
					</div>

					{/* Link Columns */}
					<div className="grid gap-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
						{Object.values(footerLinks).slice(0, 4).map((section) => (
							<div key={section.title}>
								<h3 className="text-xs font-semibold uppercase tracking-wider text-white">
									{section.title}
								</h3>
								<ul className="mt-4 space-y-3">
									{section.links.map((link) => (
										<li key={link.href}>
											<Link
												href={link.href}
												className="text-sm text-white/60 transition-colors hover:text-white"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-white/10">
				<div className="mx-auto flex max-w-[var(--container-max)] flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
					<p className="text-sm text-white/40">
						© {copyrightDate} {copyrightName}. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						{footerLinks.legal.links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-sm text-white/40 transition-colors hover:text-white/70"
							>
								{link.label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
