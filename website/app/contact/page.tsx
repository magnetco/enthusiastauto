import Footer from "@/components/layout/footer";
import Section from "@/components/layout/section";
import { TextHero } from "@/components/shared/TextHero";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export default function ContactPage() {
	return (
		<>
			<Section>
				<TextHero
					title="Contact Us"
					subtitle="We'd love to hear from you"
				/>

				<div className="grid gap-8 lg:grid-cols-2">
					{/* Contact Information */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Get in Touch</CardTitle>
								<CardDescription>
									Reach out to us through any of these channels
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="flex items-start gap-4">
									<div className="rounded-lg bg-primary/10 p-3">
										<MapPin className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">Address</h3>
										<p className="text-sm text-muted-foreground">
											11608 Reading Rd
											<br />
											Cincinnati, OH 45241
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="rounded-lg bg-primary/10 p-3">
										<Phone className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">Phone</h3>
										<a
											href="tel:513-554-1269"
											className="text-sm text-primary hover:underline"
										>
											513-554-1269
										</a>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="rounded-lg bg-primary/10 p-3">
										<Mail className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">Email</h3>
										<a
											href="mailto:info@enthusiastauto.com"
											className="text-sm text-primary hover:underline"
										>
											info@enthusiastauto.com
										</a>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="rounded-lg bg-primary/10 p-3">
										<Clock className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">Hours</h3>
										<p className="text-sm text-muted-foreground">
											Monday - Friday: 8am - 5pm
											<br />
											Saturday - Sunday: By Appointment
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Map Placeholder */}
						<div className="aspect-video overflow-hidden rounded-lg bg-muted">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3089.8!2d-84.4547!3d39.2562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDE1JzIyLjMiTiA4NMKwMjcnMTYuOSJX!5e0!3m2!1sen!2sus!4v1234567890"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Enthusiast Auto Group Location"
							/>
						</div>
					</div>

					{/* Contact Form */}
					<div>
						<ContactForm />
					</div>
				</div>
			</Section>
			<Footer />
		</>
	);
}
