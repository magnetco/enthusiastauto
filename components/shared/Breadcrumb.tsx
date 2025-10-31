import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Breadcrumb as UiBreadcrumb,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
	return (
		<UiBreadcrumb className="mb-6">
			<BreadcrumbList>
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					const key = `${item.href ?? "root"}-${item.label}-${index}`;
					return (
						<React.Fragment key={key}>
							{index > 0 && <BreadcrumbSeparator />}
							<BreadcrumbItem>
								{item.href && !isLast ? (
									<BreadcrumbLink asChild>
										<Link href={item.href}>{item.label}</Link>
									</BreadcrumbLink>
								) : (
									<BreadcrumbPage>{item.label}</BreadcrumbPage>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</UiBreadcrumb>
	);
}

/**
 * Generates schema.org BreadcrumbList JSON-LD structured data
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl: string) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.label,
			item: item.href ? `${baseUrl}${item.href}` : undefined,
		})),
	};
}
