/**
 * Sanity Migration Script: Import Blog Posts from enthusiastauto.com
 *
 * This script imports blog posts from the legacy website into Sanity CMS.
 *
 * Usage:
 *   cd studio
 *   npx tsx migrations/import-blog-posts.ts
 *
 * Required env vars:
 *   SANITY_STUDIO_PROJECT_ID
 *   SANITY_STUDIO_DATASET
 *   SANITY_API_TOKEN (with write access)
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load environment variables from .env.local
function loadEnvFile(filePath: string) {
  try {
    const content = readFileSync(filePath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        let value = valueParts.join("=");
        // Remove surrounding quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  } catch (error) {
    // File doesn't exist, ignore
  }
}

loadEnvFile(resolve(__dirname, "../.env.local"));
// Also load from root project .env.local for shared tokens
loadEnvFile(resolve(__dirname, "../../.env.local"));

// Environment configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing required environment variables:");
  console.error("  SANITY_STUDIO_PROJECT_ID:", projectId ? "✓" : "✗");
  console.error("  SANITY_STUDIO_DATASET:", dataset ? "✓" : "✗");
  console.error("  SANITY_API_TOKEN:", token ? "✓" : "✗");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-06",
  useCdn: false,
});

// Blog post data scraped from https://www.enthusiastauto.com/under-the-hood
const blogPosts = [
  {
    title: "What does BMW M mean to you?",
    slug: "what-does-bmw-m-mean-to-you",
    excerpt:
      "In 1972 BMW Motorsport GmbH was created with only 35 employees with an emphasis racing and to this day is the desire for all BMW enthusiasts. With over 50 years of evolution the most powerful letter has evolved drastically be it the powerplant for McLaren F1, the beacon when you open your garage and tackle that project vehicle, or the goal you have when hearing a new ///M model is coming to a local dealership near you. From a full on race car smelling of sweat and gasoline to an SUV with groceries pilled in the back, the DNA and presence is still felt no matter how separated. So, what does BMW ///M mean to you? I'll start…",
    category: "around-the-shop",
    publishedAt: "2025-01-30",
    location: null,
    featured: true,
  },
  {
    title: "Ode to the E39 M5",
    slug: "ode-to-the-e39-m5",
    excerpt:
      "Whether you're attempting to film a high-speed vehicle on camera in the salt flats or getting Madona to her show, the E39 M5 captured the hearts of enthusiasts worldwide including ours, which is why it's a staple of EAG.",
    category: "around-the-shop",
    publishedAt: "2025-02-20",
    location: null,
    featured: true,
  },
  {
    title: "600 Mile E39 M5 Complete EAG Rejuvenation",
    slug: "600-mile-e39-m5-complete-eag-rejuvenation",
    excerpt:
      "Over the past week we've celebrated the E39 M5 and the responses from enthusiasts worldwide have been wonderful.",
    category: "around-the-shop",
    publishedAt: "2025-02-15", // Approximate - placed between other E39 content
    location: null,
    featured: true,
  },
  {
    title: "EAG Open House 2024",
    slug: "eag-open-house-2024",
    excerpt:
      "We started planning our open house months in advance, getting a killer assortment of cars together from our friends in the area, setting up some of our newly refurbished buildings for guests and organizing food trucks. We thought we had everything covered.",
    category: "events",
    publishedAt: "2024-09-28",
    location: "Cincinnati, OH",
    featured: true,
  },
  {
    title: "Cincinnati Concours Hangar Party",
    slug: "cincinnati-concours-hangar-party",
    excerpt:
      "Nothing marks the beginning of Summer in Cincinnati quite like the Ault Park Concours d'Elegance weekend! A highlight of this weekend takes place a day before the big show, an exclusive gathering known as the Hangar Party.",
    category: "events",
    publishedAt: "2024-06-15", // Approximate summer date based on content
    location: "Cincinnati, OH",
    featured: true,
  },
  {
    title: "Rejuvenation: E36 M3 & E39 M5",
    slug: "rejuvenation-e36-m3-e39-m5",
    excerpt:
      "With great knowledge comes great responsibility. Given that we have over 20 years of experience working exclusively on BMWs, we have quite a lot of knowledge to share. Where this holds most true for our Rejuvenation clients.",
    category: "around-the-shop",
    publishedAt: "2024-07-01", // Approximate
    location: "Cincinnati, OH",
    featured: false,
  },
  {
    title: "The Vintage 2024",
    slug: "the-vintage-2024",
    excerpt:
      "At Enthusiast Auto Group, there are few things we love more than attending a car show—especially when BMWs are the focus! No matter where it is, the passion we all share for BMW always makes for great conversation and a fun weekend. One of our favorite shows is The Vintage in Hot Springs, North Carolina, which takes place in mid-May every year. We had signed up for a booth and were slated to bring a few cars down, but unlike in past years, we were going to drive them.",
    category: "events",
    publishedAt: "2024-05-18",
    location: "Asheville, NC",
    featured: false,
  },
  {
    title: "GTechniq & Rupes Training",
    slug: "gtechniq-rupes-training",
    excerpt:
      "The detailing team from Enthusiast Auto Group had the exciting opportunity to head down to Cumming, Georgia, and see our friends at Gtechniq. But this was more than just a social visit; we were lucky to be the first group trained in Gtechniq's new 4,800-square-foot facility to learn about the massive advances that have taken place in the detailing space over the last 10 years.",
    category: "around-the-shop",
    publishedAt: "2024-04-05",
    location: "Atlanta, GA",
    featured: false,
  },
];

// Helper to generate a unique ID
function generateId(slug: string): string {
  return `post-${slug}`;
}

// Helper to create a block of text for Sanity's Portable Text
function createTextBlock(text: string) {
  return [
    {
      _type: "block",
      _key: Math.random().toString(36).substring(2, 15),
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: Math.random().toString(36).substring(2, 15),
          text: text,
          marks: [],
        },
      ],
    },
  ];
}

async function importPosts() {
  console.log("🚀 Starting blog post import...\n");

  const transaction = client.transaction();

  for (const post of blogPosts) {
    const document = {
      _id: generateId(post.slug),
      _type: "post",
      title: post.title,
      slug: {
        _type: "slug",
        current: post.slug,
      },
      excerpt: post.excerpt,
      category: post.category,
      publishedAt: new Date(post.publishedAt).toISOString(),
      location: post.location,
      featured: post.featured,
      // Body is a placeholder - the actual content would need to be scraped from individual post pages
      body: createTextBlock(
        `${post.excerpt}\n\n[Full content to be migrated from individual post page]`
      ),
      // Note: mainImage is required but we can't import images from the external site
      // This will need to be added manually in Sanity Studio
    };

    console.log(`📝 Preparing: ${post.title}`);
    transaction.createOrReplace(document);
  }

  try {
    console.log("\n⏳ Committing transaction...");
    const result = await transaction.commit();
    console.log(`\n✅ Successfully imported ${blogPosts.length} posts!`);
    console.log("\n⚠️  Note: Posts are missing required fields:");
    console.log("   - mainImage: Add featured images in Sanity Studio");
    console.log(
      "   - body: Update with full content from individual post pages"
    );
    return result;
  } catch (error) {
    console.error("\n❌ Error importing posts:", error);
    throw error;
  }
}

// Run the import
importPosts()
  .then(() => {
    console.log("\n🎉 Migration complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });

