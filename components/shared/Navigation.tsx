import CartModal from "components/cart/modal";
import Logo from "components/logo";
import { getMenu } from "lib/shopify";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./MobileMenu";
import { NavLink } from "./NavLink";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const { SITE_NAME } = process.env;

export async function Navigation() {
	const menu = await getMenu("next-js-frontend-header-menu");

	return (
		<nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
			<div className="relative">
				{/* Mobile Menu Button */}
				<div className="block flex-none md:hidden">
					<Suspense fallback={null}>
						<MobileMenu menu={menu} />
					</Suspense>
				</div>

				{/* Two-row layout */}
				<div className="flex w-full flex-col">
					{/* Top row: Logo left, Search + Cart right */}
					<div className="flex items-center px-page-x py-4 border-b border-border/50">
						<div className="mx-auto w-full max-w-[var(--container-max)] flex items-center">
							<Link
								href="/"
								prefetch={true}
								className="mr-2 flex items-center transition-opacity duration-200 hover:opacity-80 lg:mr-8"
							>
								<Logo />
							</Link>

							<div className="ml-auto flex items-center justify-end gap-4">
								<div className="hidden md:block">
									<Suspense fallback={<SearchBarSkeleton />}>
										<SearchBar />
									</Suspense>
								</div>
								<CartModal />
							</div>
						</div>
					</div>

					{/* Bottom row: Static links left, User menu right */}
					<div className="flex items-center h-16 px-page-x">
						<div className="mx-auto w-full h-full max-w-[var(--container-max)] flex items-center">
							{/* Desktop Navigation Links */}
							<ul className="hidden md:flex md:items-center gap-4 lg:gap-6 xl:gap-8 text-sm overflow-x-auto whitespace-nowrap no-scrollbar h-full">
								{/* Primary navigation links: Vehicles, Parts, About, Contact */}
								<li className="h-full">
									<NavLink href="/vehicles">Vehicles</NavLink>
								</li>
								<li className="h-full">
									<NavLink href="/products">Parts</NavLink>
								</li>
								<li className="h-full">
									<NavLink href="/services">Services</NavLink>
								</li>
								<li className="h-full">
									<NavLink href="/about">About</NavLink>
								</li>
								<li className="h-full">
									<NavLink href="/contact">Contact</NavLink>
								</li>
								{/* Additional menu items from Shopify */}
								{menu.length
									? menu
											.filter(
												(item) =>
													![
														"Vehicles",
														"Parts",
														"Services",
														"About",
														"Contact",
													].includes(item.title)
											)
											.map((item) => (
												<li key={item.title} className="h-full">
													<NavLink href={item.path}>{item.title}</NavLink>
												</li>
											))
									: null}
							</ul>

							<div className="ml-auto hidden md:flex items-stretch h-full">
								<UserMenu />
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

function SearchBarSkeleton() {
  return (
    <div className="w-full lg:w-80 xl:w-full">
      <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
