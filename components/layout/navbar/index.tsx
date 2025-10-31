import CartModal from "components/cart/modal";
import Logo from "components/logo";
import { getCurrentUser } from "lib/auth/session";
import { getMenu } from "lib/shopify";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import { Suspense } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import MobileMenu from "./mobile-menu";
import UnifiedSearch, { UnifiedSearchSkeleton } from "./unified-search";

const { SITE_NAME } = process.env;

export async function Navbar() {
	const menu = await getMenu("next-js-frontend-header-menu");
	const user = await getCurrentUser();

	return (
		<nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
			<div className="relative before:absolute before:inset-y-0 before:left-0 before:w-4 before:bg-muted/10 after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted/10 pointer-events-none">
				<div className="block flex-none md:hidden">
					<Suspense fallback={null}>
						<MobileMenu menu={menu} />
					</Suspense>
				</div>
				{/* Two-row layout */}
				<div className="flex w-full flex-col gap-3 md:gap-4">
					{/* Top row: Logo left, Search + Cart right */}
					<div className="flex items-center border-b border-border/60 pb-3 md:pb-4 px-page-x">
						<Link
							href="/"
							prefetch={true}
							className="mr-2 flex items-center transition-opacity duration-200 hover:opacity-80 lg:mr-8"
						>
							<Logo />
						</Link>
						<div className="ml-auto flex items-stretch justify-end gap-4 h-full">
							<div className="hidden md:block">
								<Suspense fallback={<UnifiedSearchSkeleton />}>
									<UnifiedSearch />
								</Suspense>
							</div>
							{user ? (
								<Link
									href="/account"
									prefetch={true}
									className="inline-flex h-full items-center border-l border-border/60 px-3 md:px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
								>
									<UserIcon className="mr-2 h-4 w-4" />
									{user.name || user.email || "Account"}
								</Link>
							) : (
								<Link
									href="/auth/signin"
									prefetch={true}
									className="inline-flex h-full items-center border-l border-border/60 px-3 md:px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
								>
									Log in
								</Link>
							)}
							<CartModal />
						</div>
					</div>

					{/* Bottom row: Static links left, (reserve space on right if needed) */}
					<div className="flex items-center border-b border-border/60 md:h-12 px-page-x">
						{menu.length ? (
							<ul className="hidden md:flex items-stretch gap-4 lg:gap-6 xl:gap-8 text-sm overflow-x-auto whitespace-nowrap no-scrollbar">
								{menu.map((item: Menu) => (
									<li key={item.title}>
										<Link
											href={item.path}
											prefetch={true}
											className="h-full flex items-center font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
										>
											{item.title}
										</Link>
									</li>
								))}
							</ul>
						) : null}
						<div className="ml-auto hidden md:flex items-center" />
					</div>
				</div>
			</div>
		</nav>
	);
}
