import CartModal from "components/cart/modal";
import Logo from "components/logo";
import { getMenu } from "lib/shopify";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import UnifiedSearch, { UnifiedSearchSkeleton } from "./unified-search";
import { FavoritesBadge } from "@/components/shared/FavoritesBadge";
import { HeaderAuthButton } from "@/components/shared/HeaderAuthButton";

export async function Navbar() {
	const rawMenu = await getMenu("next-js-frontend-header-menu");
	
	// Override Parts link to go to /parts instead of /search
	const menu = rawMenu.map((item) => ({
		...item,
		path: item.title === "Parts" || item.title === "Part"
			? "/parts" 
			: item.path,
	}));

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
					{/* Top row: Logo left, Search + Favorites + Cart right */}
					<div className="flex items-center border-b border-border/60 pb-3 md:pb-4 px-page-x">
						<Link
							href="/"
							prefetch={true}
							className="mr-2 flex items-center transition-opacity duration-200 hover:opacity-80 lg:mr-8"
						>
							<Logo />
						</Link>
						<div className="ml-auto flex items-center justify-end gap-3 h-full">
							{/* Search + Favorites + Cart in bordered containers */}
							<div className="hidden md:block">
								<Suspense fallback={<UnifiedSearchSkeleton />}>
									<UnifiedSearch />
								</Suspense>
							</div>
							<Suspense fallback={null}>
								<FavoritesBadge />
							</Suspense>
							<CartModal />
						</div>
					</div>

					{/* Bottom row: Static links left, user section right */}
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
						<div className="ml-auto hidden md:flex items-center">
							<Suspense fallback={null}>
								<HeaderAuthButton />
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
