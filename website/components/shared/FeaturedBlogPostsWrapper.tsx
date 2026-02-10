import { FeaturedBlogPosts } from "./FeaturedBlogPosts";
import { getPosts } from "@/lib/sanity/queries/posts";

/**
 * Server Component wrapper for FeaturedBlogPosts
 * Fetches posts from Sanity and passes to client component
 */
export async function FeaturedBlogPostsWrapper() {
  const posts = await getPosts();
  
  return <FeaturedBlogPosts posts={posts} />;
}
