import { AddressManager } from "@/components/account/AddressManager";
import { ChangePassword } from "@/components/account/ChangePassword";
import { ConnectedAccounts } from "@/components/account/ConnectedAccounts";
import { DeleteAccount } from "@/components/account/DeleteAccount";
import { ProfileCard } from "@/components/account/ProfileCard";
import { ProfileForm } from "@/components/account/ProfileForm";
import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import { TextHero } from "@/components/shared/TextHero";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { Metadata } from "next";
import { redirect } from "next/navigation";

/**
 * User Profile Page
 * Protected route - requires authentication (handled by middleware)
 * Displays user profile information, settings, and account management
 */

export const metadata: Metadata = {
	title: "My Profile",
	description: "Manage your profile and account settings",
};

// Helper to get initials for avatar fallback
function getInitials(name?: string | null): string {
	if (!name) return "U";

	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.substring(0, 2);
}

export default async function ProfilePage() {
	// Get authenticated user session
	const session = await getServerSession();

	// Redirect if not authenticated
	if (!session?.user?.id) {
		redirect("/auth/signin");
	}

	// Fetch user data with related accounts
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		include: {
			accounts: true,
		},
	});

	// Redirect if user not found
	if (!user) {
		redirect("/auth/signin");
	}

	// Check if user has password authentication
	const hasPassword = !!(await prisma.account.findFirst({
		where: {
			userId: user.id,
			type: "credentials",
		},
	}));

	// Get authentication methods
	const authMethods = user.accounts.map((account) => {
		switch (account.provider) {
			case "google":
				return "Google";
			case "github":
				return "GitHub";
			default:
				return account.provider;
		}
	});

	// Check if avatar is from OAuth provider
	const isOAuthAvatar = !!user.image && !hasPassword;

	const displayImage = user.image;

	return (
		<>
			{/* Page Header with TextHero - Full Width Section */}
			<Section>
				<TextHero
					title="My Profile"
					subtitle="Manage your profile information and account settings"
					breadcrumbs={{
						customItems: [{ label: "Dashboard", href: "/account" }],
					}}
				/>
			</Section>

			{/* Main Content Container */}
			<Container className="space-y-6 pt-0">
				{/* User Overview Card */}
				<ProfileCard
					user={{
						name: user.name,
						email: user.email,
						image: user.image,
					}}
					hasPassword={hasPassword}
					authMethods={authMethods}
					isOAuthAvatar={isOAuthAvatar}
				/>

				{/* Profile Form */}
				<ProfileForm
					user={{
						name: user.name,
						email: user.email,
						image: user.image,
					}}
				/>

				{/* Change Password */}
				<ChangePassword hasPassword={hasPassword} />

				{/* Address Manager */}
				<AddressManager />

				{/* Connected Accounts */}
				<ConnectedAccounts accounts={user.accounts} hasPassword={hasPassword} />

				{/* Delete Account - Danger Zone */}
				<DeleteAccount />
			</Container>
		</>
	);
}
