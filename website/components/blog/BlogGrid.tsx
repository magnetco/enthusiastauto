import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface BlogPost {
	slug: string;
	title: string;
	excerpt: string;
	category: string;
	date: string;
	image: string;
	featured?: boolean;
}

interface BlogGridProps {
	posts: BlogPost[];
	featured?: boolean;
}

export function BlogGrid({ posts, featured = false }: BlogGridProps) {
	if (featured) {
		return (
			<div className="grid gap-6 md:grid-cols-2">
				{posts.map((post) => (
					<FeaturedBlogCard key={post.slug} post={post} />
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{posts.map((post) => (
				<BlogCard key={post.slug} post={post} />
			))}
		</div>
	);
}

function FeaturedBlogCard({ post }: { post: BlogPost }) {
	const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<Link href={`/blog/${post.slug}`} className="group">
			<Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
				<div className="relative aspect-[16/9] overflow-hidden">
					<Image
						src={post.image}
						alt={post.title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
					<Badge
						variant="secondary"
						className="absolute left-4 top-4"
					>
						{post.category}
					</Badge>
				</div>
				<CardHeader>
					<CardDescription>{formattedDate}</CardDescription>
					<CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
						{post.title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="line-clamp-2 text-sm text-muted-foreground">
						{post.excerpt}
					</p>
				</CardContent>
			</Card>
		</Link>
	);
}

function BlogCard({ post }: { post: BlogPost }) {
	const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	return (
		<Link href={`/blog/${post.slug}`} className="group">
			<Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
				<div className="relative aspect-[16/10] overflow-hidden">
					<Image
						src={post.image}
						alt={post.title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<Badge
						variant="secondary"
						className="absolute left-3 top-3 text-xs"
					>
						{post.category}
					</Badge>
				</div>
				<CardHeader className="p-4">
					<CardDescription className="text-xs">{formattedDate}</CardDescription>
					<CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors">
						{post.title}
					</CardTitle>
				</CardHeader>
			</Card>
		</Link>
	);
}

