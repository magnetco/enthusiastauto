import Link from "next/link";
import Section from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const errorMessages: Record<string, { title: string; description: string }> = {
	Configuration: {
		title: "Configuration Error",
		description:
			"There is a problem with the server configuration. Please contact support if this persists.",
	},
	AccessDenied: {
		title: "Access Denied",
		description:
			"You do not have permission to sign in. Please use a different account or contact support.",
	},
	Verification: {
		title: "Verification Error",
		description:
			"The verification link may have expired or already been used. Please request a new one.",
	},
	OAuthSignin: {
		title: "Sign In Error",
		description:
			"There was a problem signing in with this provider. Please try again.",
	},
	OAuthCallback: {
		title: "Callback Error",
		description:
			"There was a problem processing the sign-in callback. Please try again.",
	},
	OAuthCreateAccount: {
		title: "Account Creation Error",
		description:
			"Could not create an account with this provider. The email may already be in use.",
	},
	EmailCreateAccount: {
		title: "Account Creation Error",
		description:
			"Could not create an account with this email. It may already be in use.",
	},
	Callback: {
		title: "Callback Error",
		description: "There was a problem during the authentication callback.",
	},
	OAuthAccountNotLinked: {
		title: "Account Not Linked",
		description:
			"This email is already associated with another account. Please sign in with your original method.",
	},
	SessionRequired: {
		title: "Session Required",
		description: "Please sign in to access this page.",
	},
	Default: {
		title: "Authentication Error",
		description:
			"An unexpected error occurred during authentication. Please try again.",
	},
};

export default async function AuthErrorPage(props: {
	searchParams?: Promise<{ error?: string }>;
}) {
	const searchParams = await props.searchParams;
	const errorType = searchParams?.error || "Default";
	const error = errorMessages[errorType] ?? errorMessages.Default!;

	return (
		<Section className="flex min-h-[60vh] items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
						<AlertTriangle className="h-6 w-6 text-destructive" />
					</div>
					<CardTitle className="text-xl">{error.title}</CardTitle>
					<CardDescription className="text-base">
						{error.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					<Link href="/auth/signin">
						<Button className="w-full">Try Again</Button>
					</Link>
					<Link href="/">
						<Button variant="outline" className="w-full">Return Home</Button>
					</Link>
				</CardContent>
			</Card>
		</Section>
	);
}

