import Section from "@/components/layout/section";
import { PageHero } from "@/components/shared/PageHero";
import { BlogPageClient } from "@/components/blog/BlogPageClient";
import { getPosts, getFeaturedPosts } from "@/lib/sanity/queries/posts";
import type { PostListItem } from "@/lib/sanity/queries/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under the Hood | Blog | Enthusiast Auto",
  description:
    "Stories from Enthusiast Auto Group. Events, shop updates, project builds, and insights from the world of BMW M-Series enthusiasts.",
  openGraph: {
    type: "website",
    title: "Under the Hood | Enthusiast Auto",
    description:
      "Stories, events, and updates from Enthusiast Auto Group.",
    siteName: "Enthusiast Auto",
  },
};

// Placeholder blog posts for development (before Sanity data is available)
const placeholderPosts: PostListItem[] = [
  {
    _id: "1",
    slug: "what-does-bmw-m-mean-to-you",
    title: "What does BMW M mean to you?",
    excerpt:
      "In 1972 BMW Motorsport GmbH was created with only 35 employees with an emphasis racing and to this day is the desire for all BMW enthusiasts. With over 50 years of evolution the most powerful letter has evolved drastically.",
    category: "around-the-shop",
    publishedAt: "2025-01-30",
    featured: true,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop",
      },
    },
  },
  {
    _id: "2",
    slug: "ode-to-the-e39-m5",
    title: "Ode to the E39 M5",
    excerpt:
      "Whether you're attempting to film a high-speed vehicle on camera in the salt flats or getting Madonna to her show, the E39 M5 captured the hearts of enthusiasts worldwide including ours.",
    category: "around-the-shop",
    publishedAt: "2025-02-20",
    featured: true,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2070&auto=format&fit=crop",
      },
    },
  },
  {
    _id: "3",
    slug: "600-mile-e39-m5-rejuvenation",
    title: "600 Mile E39 M5 Complete EAG Rejuvenation",
    excerpt:
      "Over the past week we've celebrated the E39 M5 and the responses from enthusiasts worldwide have been wonderful.",
    category: "around-the-shop",
    publishedAt: "2025-02-15",
    featured: true,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2070&auto=format&fit=crop",
      },
    },
  },
  {
    _id: "4",
    slug: "eag-open-house-2024",
    title: "EAG Open House 2024",
    excerpt:
      "We started planning our open house months in advance, getting a killer assortment of cars together from our friends in the area, setting up some of our newly refurbished buildings for guests.",
    category: "events",
    publishedAt: "2024-09-28",
    location: "Cincinnati, OH",
    featured: true,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop",
      },
    },
  },
  {
    _id: "5",
    slug: "cincinnati-concours-hangar-party",
    title: "Cincinnati Concours Hangar Party",
    excerpt:
      "Nothing marks the beginning of Summer in Cincinnati quite like the Ault Park Concours d'Elegance weekend! A highlight of this weekend takes place a day before the big show, an exclusive gathering known as the Hangar Party.",
    category: "events",
    publishedAt: "2024-06-15",
    location: "Cincinnati, OH",
    featured: false,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop",
      },
    },
  },
  {
    _id: "6",
    slug: "rejuvenation-e36-m3-e39-m5",
    title: "Rejuvenation: E36 M3 & E39 M5",
    excerpt:
      "With great knowledge comes great responsibility. Given that we have over 20 years of experience working exclusively on BMWs, we have quite a lot of knowledge to share.",
    category: "around-the-shop",
    publishedAt: "2024-05-20",
    location: "Cincinnati, OH",
    featured: false,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop",
      },
    },
  },
  {
    _id: "7",
    slug: "the-vintage-2024",
    title: "The Vintage 2024",
    excerpt:
      "At Enthusiast Auto Group, there are few things we love more than attending a car show—especially when BMWs are the focus! One of our favorite shows is The Vintage in Hot Springs, North Carolina.",
    category: "events",
    publishedAt: "2024-05-18",
    location: "Asheville, NC",
    featured: false,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop",
      },
    },
  },
  {
    _id: "8",
    slug: "gtechniq-rupes-training",
    title: "GTechniq & Rupes Training",
    excerpt:
      "The detailing team from Enthusiast Auto Group had the exciting opportunity to head down to Cumming, Georgia, and see our friends at Gtechniq for training in their new 4,800-square-foot facility.",
    category: "around-the-shop",
    publishedAt: "2024-04-05",
    location: "Atlanta, GA",
    featured: false,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop",
      },
    },
  },
];

export default async function BlogPage() {
  // Try to fetch from Sanity, fall back to placeholder data
  let featuredPosts: PostListItem[] = [];
  let allPosts: PostListItem[] = [];

  try {
    [featuredPosts, allPosts] = await Promise.all([
      getFeaturedPosts(5),
      getPosts(),
    ]);
  } catch (error) {
    console.error("Error fetching posts from Sanity:", error);
  }

  // Use placeholder data if no posts from Sanity
  if (!allPosts.length) {
    allPosts = placeholderPosts;
    featuredPosts = placeholderPosts.filter((p) => p.featured);
  }

  return (
    <>
      {/* Hero */}
      <PageHero
        size="compact"
        eyebrow="Enthusiast Auto Group"
        title="Under the Hood"
        subtitle="Take a look under the hood and see what we do."
        backgroundImage="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop"
      />

      <Section className="py-16 sm:py-20 lg:py-24">
        <div>
          <BlogPageClient
            featuredPosts={featuredPosts}
            allPosts={allPosts}
          />
        </div>
      </Section>
    </>
  );
}
