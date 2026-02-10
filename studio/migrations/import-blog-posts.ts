/**
 * Migration script to import blog posts from scraped JSON data into Sanity
 * 
 * Usage:
 *   npx tsx studio/migrations/import-blog-posts.ts
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n2usssau",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2025-10-21",
  useCdn: false,
});

// Category mapping from scraped data to Sanity categories
const categoryMap: Record<string, string> = {
  "Around The Shop": "around-the-shop",
  "Event": "events",
  "Events": "events",
  "Videos": "videos",
};

// Parse date string to ISO format
function parseDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // If invalid, use current date
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch (error) {
    console.error(`Error parsing date: ${dateStr}`, error);
    return new Date().toISOString();
  }
}

// Upload image from local file to Sanity
async function uploadImage(imagePath: string): Promise<any> {
  try {
    const fullPath = path.join(__dirname, "../../website/public", imagePath);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Image file not found: ${fullPath}`);
      return null;
    }

    const imageBuffer = fs.readFileSync(fullPath);
    const filename = path.basename(imagePath);
    
    console.log(`  → Uploading image: ${filename}`);
    
    const asset = await client.assets.upload("image", imageBuffer, {
      filename: filename,
    });
    
    console.log(`  ✓ Image uploaded: ${asset._id}`);
    
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error);
    return null;
  }
}

// Create a blog post document
async function createPost(story: any, imageRef: any) {
  const category = categoryMap[story.category] || "around-the-shop";
  const publishedAt = parseDate(story.date);
  
  const post = {
    _type: "post",
    title: story.title,
    slug: {
      _type: "slug",
      current: story.slug,
    },
    excerpt: story.excerpt || "",
    category: category,
    publishedAt: publishedAt,
    featured: false, // Can be updated manually in Sanity Studio
    mainImage: imageRef,
    body: [
      {
        _type: "block",
        _key: "content",
        style: "normal",
        children: [
          {
            _type: "span",
            text: story.content || story.excerpt || "",
          },
        ],
      },
    ],
  };
  
  // Add location if available
  if (story.location) {
    post.location = story.location;
  }
  
  return post;
}

async function main() {
  console.log("=" .repeat(70));
  console.log("Blog Post Import to Sanity CMS");
  console.log("=" .repeat(70));
  console.log();
  
  // Check for required environment variables
  if (!process.env.SANITY_API_TOKEN) {
    console.error("❌ Error: SANITY_API_TOKEN environment variable is required");
    console.log("\nPlease set it in your .env file or run:");
    console.log("  export SANITY_API_TOKEN=your_token_here");
    process.exit(1);
  }
  
  // Load the scraped blog data
  const jsonPath = path.join(__dirname, "../../scripts/blog-stories-detailed.json");
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Error: Blog stories JSON not found at ${jsonPath}`);
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const stories = data.stories;
  
  console.log(`Found ${stories.length} stories to import\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    console.log(`\n[${i + 1}/${stories.length}] Processing: ${story.title}`);
    
    try {
      // Check if post already exists
      const existingPost = await client.fetch(
        `*[_type == "post" && slug.current == $slug][0]`,
        { slug: story.slug }
      );
      
      if (existingPost) {
        console.log(`  ⚠ Post already exists, skipping...`);
        continue;
      }
      
      // Upload image
      let imageRef = null;
      if (story.local_image) {
        imageRef = await uploadImage(story.local_image);
      }
      
      if (!imageRef) {
        console.log(`  ⚠ No image available, using placeholder`);
      }
      
      // Create post document
      const post = await createPost(story, imageRef);
      
      // Create post in Sanity
      console.log(`  → Creating post in Sanity...`);
      const result = await client.create(post);
      
      console.log(`  ✓ Post created: ${result._id}`);
      successCount++;
      
    } catch (error) {
      console.error(`  ✗ Error processing story:`, error);
      errorCount++;
    }
  }
  
  console.log("\n" + "=".repeat(70));
  console.log("Import Summary");
  console.log("=".repeat(70));
  console.log(`✓ Successfully imported: ${successCount} posts`);
  console.log(`✗ Errors: ${errorCount}`);
  console.log();
  
  if (successCount > 0) {
    console.log("🎉 Import completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Visit Sanity Studio to review and edit the imported posts");
    console.log("2. Set 'featured' flag on posts you want to highlight");
    console.log("3. Add or edit body content as needed");
    console.log("4. Publish the posts");
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
