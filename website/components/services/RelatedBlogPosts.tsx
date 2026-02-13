import { getPosts } from "@/lib/sanity/queries/posts";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { TitleBlock } from "@/components/shared/TitleBlock";
import Section from "@/components/layout/section";
import Link from "next/link";

interface RelatedBlogPostsProps {
  /** Maximum number of posts to display */
  limit?: number;
}

export async function RelatedBlogPosts({ limit = 3 }: RelatedBlogPostsProps) {
  const posts = await getPosts();
  const recentPosts = posts.slice(0, limit);

  if (!recentPosts.length) {
    return null;
  }

  return (
    <Section className="border-t border-neutral-200 bg-white py-12 sm:py-16 lg:py-20">
      <TitleBlock
        title="UNDER THE HOOD"
        description="News and updates, articles from events, around the shop and more."
        action={
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            View All Stories
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        }
        className="mb-8 sm:mb-10"
      />

      <BlogGrid posts={recentPosts} columns={3} />
    </Section>
  );
}

