import Section from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PortableText } from "@portabletext/react";
import {
  getPostBySlug,
  getPostSlugs,
  getRelatedPosts,
  categoryLabels,
} from "@/lib/sanity/queries/posts";
import { urlFor } from "@/lib/sanity/image";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { TitleBlock } from "@/components/shared/TitleBlock";

/**
 * Check if the image asset is a valid Sanity asset reference (has proper _ref format)
 * vs a placeholder image that has a direct URL
 */
function isSanityAsset(asset: { _ref?: string; url?: string } | undefined): boolean {
  if (!asset) return false;
  // Sanity refs start with "image-" and have a specific format like "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg"
  return !!asset._ref && asset._ref.startsWith("image-") && asset._ref.includes("-") && asset._ref.split("-").length >= 3;
}

// Placeholder blog posts for development
const placeholderPosts = {
  "what-does-bmw-m-mean-to-you": {
    _id: "1",
    title: "What does BMW M mean to you?",
    slug: "what-does-bmw-m-mean-to-you",
    excerpt:
      "In 1972 BMW Motorsport GmbH was created with only 35 employees with an emphasis racing and to this day is the desire for all BMW enthusiasts.",
    category: "around-the-shop" as const,
    publishedAt: "2025-01-30",
    featured: true,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop",
      },
      alt: "BMW M car in dramatic lighting",
    },
    body: null,
    bodyText: `In 1972 BMW Motorsport GmbH was created with only 35 employees with an emphasis racing and to this day is the desire for all BMW enthusiasts. With over 50 years of evolution the most powerful letter has evolved drastically be it the powerplant for McLaren F1, the beacon when you open your garage and tackle that project vehicle, or the goal you have when hearing a new ///M model is coming to a local dealership near you.

From a full on race car smelling of sweat and gasoline to an SUV with groceries piled in the back, the DNA and presence is still felt no matter how separated.

## The Heritage

BMW M began as a racing division, and that DNA has never been diluted. Every M car carries the spirit of competition, from the legendary E30 M3 that dominated touring car racing to the modern G8X M3/M4 that continues to push boundaries.

## What M Means to Us

At Enthusiast Auto Group, the M badge represents the pinnacle of BMW engineering. It's not just about horsepower—it's about the complete driving experience. The precise steering, the communicative chassis, the sound of an inline-six at redline.

## Your Turn

So, what does BMW ///M mean to you? Is it your daily driver? A weekend warrior? A dream in your garage? We'd love to hear your story.`,
  },
  "ode-to-the-e39-m5": {
    _id: "2",
    title: "Ode to the E39 M5",
    slug: "ode-to-the-e39-m5",
    excerpt:
      "Whether you're attempting to film a high-speed vehicle on camera in the salt flats or getting Madonna to her show, the E39 M5 captured the hearts of enthusiasts worldwide.",
    category: "around-the-shop" as const,
    publishedAt: "2025-02-20",
    featured: true,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2070&auto=format&fit=crop",
      },
      alt: "BMW E39 M5 sedan in silver",
    },
    body: null,
    bodyText: `Whether you're attempting to film a high-speed vehicle on camera in the salt flats or getting Madonna to her show, the E39 M5 captured the hearts of enthusiasts worldwide including ours, which is why it's a staple of EAG.

## A Legend is Born

The E39 M5 debuted in 1998 and immediately set the benchmark for super sedans. With its 4.9-liter S62 V8 producing 394 horsepower, it was the most powerful BMW production car of its era.

## Why We Love It

The E39 M5 represents the perfect balance of performance and refinement. It's civilized enough for a cross-country trip, yet capable of embarrassing sports cars on a track.

### The Numbers
- 0-60 mph: 4.8 seconds
- Top Speed: 155 mph (limited)
- Production: 1998-2003
- Total Built: Approximately 20,000 units

## Our Collection

We've handled dozens of E39 M5s over the years, from low-mile time capsules to well-loved drivers. Each one tells a story, and we're honored to be part of their journey.`,
  },
  "600-mile-e39-m5-rejuvenation": {
    _id: "3",
    title: "600 Mile E39 M5 Complete EAG Rejuvenation",
    slug: "600-mile-e39-m5-rejuvenation",
    excerpt:
      "Over the past week we've celebrated the E39 M5 and the responses from enthusiasts worldwide have been wonderful.",
    category: "around-the-shop" as const,
    publishedAt: "2025-02-15",
    featured: true,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2070&auto=format&fit=crop",
      },
      alt: "Low-mileage E39 M5 undergoing rejuvenation",
    },
    body: null,
    bodyText: `Over the past week we've celebrated the E39 M5 and the responses from enthusiasts worldwide have been wonderful.

## The Discovery

This particular E39 M5 came to us with just 600 miles on the odometer. Yes, you read that right—600 miles on a 25-year-old car. It had been stored properly since new, but after decades of sitting, it needed our attention.

## The Process

Even with such low mileage, a stored vehicle requires comprehensive rejuvenation:

### Mechanical Work
- Complete fluid replacement (engine oil, transmission, differential, brake fluid, coolant)
- New fuel system components (pump, filter, lines)
- Fresh spark plugs and ignition components
- Brake system rebuild with new rotors and pads

### Cosmetic Attention
- Full paint correction to remove storage marks
- Ceramic coating for long-term protection
- Interior conditioning
- Engine bay detailing

## The Result

After our rejuvenation process, this E39 M5 drives exactly as BMW intended—like new. It's now ready for its next chapter, whether that's as a collection piece or a carefully driven driver.`,
  },
  "eag-open-house-2024": {
    _id: "4",
    title: "EAG Open House 2024",
    slug: "eag-open-house-2024",
    excerpt:
      "We started planning our open house months in advance, getting a killer assortment of cars together from our friends in the area.",
    category: "events" as const,
    publishedAt: "2024-09-28",
    location: "Cincinnati, OH",
    featured: true,
    mainImage: {
      asset: {
        _ref: "",
        url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop",
      },
      alt: "Cars gathered at EAG Open House 2024",
    },
    body: null,
    bodyText: `We started planning our open house months in advance, getting a killer assortment of cars together from our friends in the area, setting up some of our newly refurbished buildings for guests and organizing food trucks. We thought we had everything covered.

## The Day

Mother Nature had other plans. Despite some early morning rain, the BMW faithful showed up in force. By 10 AM, our lot was packed with everything from pristine E30 M3s to the latest G8X models.

## Highlights

- Over 150 BMWs in attendance
- Food trucks keeping everyone fed
- Tours of our restoration facility
- Special displays of our current projects

## Thank You

To everyone who braved the weather to join us—thank you. Events like this remind us why we do what we do. See you next year!`,
  },
} as const;

type PlaceholderSlug = keyof typeof placeholderPosts;

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs();
    if (slugs.length > 0) {
      return slugs.map(({ slug }) => ({ slug }));
    }
  } catch (error) {
    console.error("Error fetching post slugs:", error);
  }

  // Fall back to placeholder slugs
  return Object.keys(placeholderPosts).map((slug) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  // Try Sanity first
  try {
    const post = await getPostBySlug(params.slug);
    if (post) {
      const imageUrl = post.mainImage?.asset?.url
        ? urlFor(post.mainImage).width(1200).height(630).url()
        : undefined;

      return {
        title: `${post.title} | Blog | Enthusiast Auto`,
        description: post.excerpt,
        openGraph: {
          type: "article",
          title: post.title,
          description: post.excerpt,
          siteName: "Enthusiast Auto",
          images: imageUrl ? [{ url: imageUrl }] : undefined,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching post metadata:", error);
  }

  // Fall back to placeholder
  const placeholder = placeholderPosts[params.slug as PlaceholderSlug];
  if (placeholder) {
    return {
      title: `${placeholder.title} | Blog | Enthusiast Auto`,
      description: placeholder.excerpt,
      openGraph: {
        type: "article",
        title: placeholder.title,
        description: placeholder.excerpt,
        siteName: "Enthusiast Auto",
        images: [{ url: placeholder.mainImage.asset.url }],
      },
    };
  }

  return { title: "Post Not Found" };
}

// Portable Text components for rendering rich text
const portableTextComponents = {
  types: {
    image: ({ value }: { value: { asset: { url: string }; alt?: string; caption?: string } }) => {
      const imageUrl = value.asset?.url
        ? urlFor(value).width(1200).url()
        : null;
      
      if (!imageUrl) return null;

      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={value.alt || ""}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-neutral-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-10 text-2xl font-bold text-neutral-900 sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-8 text-xl font-semibold text-neutral-900 sm:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mb-3 mt-6 text-lg font-semibold text-neutral-900">
        {children}
      </h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 text-lg leading-relaxed text-neutral-600">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-6 border-l-4 border-blue-600 pl-6 italic text-neutral-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-lg text-neutral-600">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-lg text-neutral-600">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string } }) => (
      <a
        href={value?.href}
        className="text-blue-600 underline hover:text-blue-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  // Try Sanity first
  let post = null;
  let relatedPosts: Awaited<ReturnType<typeof getRelatedPosts>> = [];

  try {
    post = await getPostBySlug(params.slug);
    if (post) {
      relatedPosts = await getRelatedPosts(post.category, post.slug, 3);
    }
  } catch (error) {
    console.error("Error fetching post:", error);
  }

  // Fall back to placeholder
  const placeholder = !post
    ? placeholderPosts[params.slug as PlaceholderSlug]
    : null;

  if (!post && !placeholder) {
    notFound();
  }

  const displayPost = post || placeholder;
  if (!displayPost) {
    notFound();
  }

  const formattedDate = new Date(displayPost.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Use urlFor only for valid Sanity assets, otherwise use the direct URL
  const imageUrl = displayPost.mainImage?.asset?.url
    ? isSanityAsset(displayPost.mainImage?.asset)
      ? urlFor(displayPost.mainImage).width(1600).height(900).url()
      : displayPost.mainImage.asset.url
    : null;

  return (
    <>
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-neutral-900 lg:h-[60vh]">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={displayPost.mainImage?.alt || displayPost.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
      </div>

      <Section className="-mt-32 relative z-10 pb-16 lg:pb-24">
        {/* Back Link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Article */}
        <article className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-neutral-100 text-neutral-700"
              >
                {categoryLabels[displayPost.category]}
              </Badge>
              <span className="text-sm text-neutral-500">{formattedDate}</span>
              {"location" in displayPost && displayPost.location && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span className="text-sm text-neutral-500">
                    {displayPost.location}
                  </span>
                </>
              )}
            </div>
            <h1 className="mb-6 text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
              {displayPost.title}
            </h1>
            <p className="text-xl text-neutral-600">{displayPost.excerpt}</p>
          </header>

          {/* Divider */}
          <div className="mb-10 h-px bg-neutral-200" />

          {/* Content */}
          <div className="prose-lg">
            {post?.body ? (
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            ) : placeholder && "bodyText" in placeholder ? (
              // Render placeholder text
              placeholder.bodyText.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2
                      key={index}
                      className="mb-4 mt-10 text-2xl font-bold text-neutral-900 sm:text-3xl"
                    >
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3
                      key={index}
                      className="mb-3 mt-8 text-xl font-semibold text-neutral-900 sm:text-2xl"
                    >
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  const items = paragraph.split("\n");
                  return (
                    <ul
                      key={index}
                      className="mb-4 ml-6 list-disc space-y-2 text-lg text-neutral-600"
                    >
                      {items.map((item, i) => (
                        <li key={i}>{item.replace("- ", "")}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p
                    key={index}
                    className="mb-4 text-lg leading-relaxed text-neutral-600"
                  >
                    {paragraph}
                  </p>
                );
              })
            ) : null}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 border-t border-neutral-200 pt-16">
            <TitleBlock title="Related Stories" className="mb-8" />
            <BlogGrid posts={relatedPosts} />
          </div>
        )}
      </Section>
    </>
  );
}
