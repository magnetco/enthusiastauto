/**
 * Vehicle Import Script
 * Imports vehicles from CSV to Sanity CMS
 */

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { createClient } from "@sanity/client";
import { htmlToBlocks } from "@sanity/block-tools";
import { JSDOM } from "jsdom";
import { Schema } from "@sanity/schema";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

// Schema for HTML to Portable Text conversion
const defaultSchema = Schema.compile({
  name: "default",
  types: [
    {
      type: "document",
      name: "vehicle",
      fields: [
        {
          title: "Block",
          name: "block",
          type: "array",
          of: [{ type: "block" }],
        },
      ],
    },
  ],
});

const blockContentType = defaultSchema
  .get("vehicle")
  .fields.find((field: any) => field.name === "block").type;

/**
 * Convert HTML to Portable Text blocks
 */
function htmlToPortableText(html: string): any[] {
  if (!html || html.trim() === "") return [];

  try {
    const dom = new JSDOM(html);
    const blocks = htmlToBlocks(html, blockContentType, {
      parseHtml: (htmlString) => new JSDOM(htmlString).window.document,
    });
    return blocks || [];
  } catch (error) {
    console.error("Error converting HTML to Portable Text:", error);
    return [];
  }
}

/**
 * Download image from URL and upload to Sanity
 */
async function uploadImageFromUrl(
  url: string,
  filename: string,
): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to download image: ${url}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload("image", Buffer.from(buffer), {
      filename,
    });

    return asset._id;
  } catch (error) {
    console.error(`Error uploading image ${url}:`, error);
    return null;
  }
}

/**
 * Parse semicolon-separated image URLs and upload to Sanity
 */
async function processImageGallery(
  imageUrls: string,
): Promise<Array<{ _type: string; _key: string; asset: { _ref: string } }>> {
  if (!imageUrls || imageUrls.trim() === "") return [];

  const urls = imageUrls.split(";").map((url) => url.trim());
  const uploadedImages = [];

  for (const url of urls) {
    if (!url) continue;

    const filename = url.split("/").pop() || "image.jpg";
    console.log(`  Uploading image: ${filename}`);

    const assetId = await uploadImageFromUrl(url, filename);
    if (assetId) {
      uploadedImages.push({
        _type: "image",
        _key: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        asset: {
          _ref: assetId,
          _type: "reference",
        },
      });
    }

    // Add small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return uploadedImages;
}

/**
 * Map CSV field to chassis code
 */
function mapChassisCode(chassisValue: string): string {
  const normalized = chassisValue.toLowerCase().trim();

  // Map common variants
  const chassisMap: { [key: string]: string } = {
    e24: "E24",
    e28: "E28",
    e30: "E30",
    e34: "E34",
    e36: "E36",
    e39: "E39",
    e46: "E46",
    e60: "E60",
    e90: "E90",
    e92: "E92",
    e93: "E93",
    f30: "F30",
    f80: "F80",
    g80: "G80",
    x3: "X3",
    x5: "X5",
  };

  return chassisMap[normalized] || chassisValue;
}

/**
 * Map CSV engine size to schema format
 */
function mapEngineSize(engineSizeValue: string): string {
  const normalized = engineSizeValue.toLowerCase().trim();

  if (
    normalized.includes("straight 6") ||
    normalized.includes("inline 6") ||
    normalized.includes("i6")
  ) {
    return "I6 Engine";
  }
  if (normalized.includes("v8")) return "V8 Engine";
  if (normalized.includes("v10")) return "V10 Engine";
  if (
    normalized.includes("i4") ||
    normalized.includes("inline 4") ||
    normalized.includes("4-cylinder")
  ) {
    return "I4 Engine";
  }

  return "I6 Engine"; // Default fallback
}

/**
 * Extract engine code from text
 */
function extractEngineCode(engineCodeValue: string): string {
  if (!engineCodeValue) return "S62"; // Default fallback

  const normalized = engineCodeValue.toUpperCase().trim();

  const validCodes = ["S62", "S54", "S65", "N54", "N55", "B58", "S58", "S38"];
  const found = validCodes.find((code) => normalized.includes(code));

  return found || "S62";
}

/**
 * Parse listing features from HTML
 */
function parseListingFeatures(html: string): string[] {
  if (!html || html.trim() === "") return [];

  const dom = new JSDOM(html);
  const paragraphs = dom.window.document.querySelectorAll("p");
  const features: string[] = [];

  paragraphs.forEach((p) => {
    const text = p.textContent?.trim();
    if (text && text.startsWith("•")) {
      features.push(text.replace(/^•\s*/, "").trim());
    }
  });

  return features;
}

/**
 * Clean color value (convert slug format to readable)
 */
function cleanColorValue(color: string): string {
  if (!color) return "";

  // Convert slug format to readable (e.g., "diamond-schwarz-metallic" to "Diamond Schwarz Metallic")
  return color
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get list of existing vehicle IDs from Sanity
 */
async function getExistingVehicleIds(): Promise<Set<string>> {
  console.log("🔍 Checking for existing vehicles in Sanity...");

  try {
    const existingVehicles = await client.fetch(
      '*[_type == "vehicle"]{ _id, slug }'
    );

    const existingIds = new Set(
      existingVehicles.map((v: any) => v._id)
    );

    console.log(`   Found ${existingIds.size} existing vehicles\n`);
    return existingIds;
  } catch (error) {
    console.error("⚠️  Warning: Could not fetch existing vehicles:", error);
    console.log("   Continuing anyway...\n");
    return new Set();
  }
}

/**
 * Parse CSV and import to Sanity
 */
async function importVehicles(csvFilePath: string) {
  const vehicles: any[] = [];

  console.log("📖 Reading CSV file...");

  // Read CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => vehicles.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`\n✅ Found ${vehicles.length} vehicles in CSV\n`);

  // Get existing vehicle IDs to avoid re-importing
  const existingVehicleIds = await getExistingVehicleIds();

  let imported = 0;
  let failed = 0;
  let skipped = 0;

  for (const [index, row] of vehicles.entries()) {
    const vehicleNumber = index + 1;
    console.log(
      `\n[${vehicleNumber}/${vehicles.length}] Processing: ${row["Listing Title"]}`,
    );

    try {
      // Parse basic info
      const listingTitle = row["Listing Title"];
      const slug = row["Slug"];
      const stockNumber = row["Stock Number"];
      const vin = row["VIN"];

      if (!listingTitle || !slug || !stockNumber || !vin) {
        console.error(
          `  ❌ Skipping - missing required fields (title, slug, stock, or VIN)`,
        );
        failed++;
        continue;
      }

      // Check if vehicle already exists
      const vehicleId = `vehicle-${slug}`;
      if (existingVehicleIds.has(vehicleId)) {
        console.log(`  ⏭️  Already exists - skipping`);
        skipped++;
        continue;
      }

      // Upload signature shot
      console.log("  📸 Uploading signature shot...");
      const signatureShotUrl = row["Signature Shot"];
      const signatureShotAssetId = signatureShotUrl
        ? await uploadImageFromUrl(
            signatureShotUrl,
            `${slug}-signature.jpg`,
          )
        : null;

      if (!signatureShotAssetId) {
        console.error("  ❌ Failed to upload signature shot - skipping vehicle");
        failed++;
        continue;
      }

      // Upload secondary shot (optional)
      console.log("  📸 Uploading secondary shot...");
      const secondaryShotUrl = row["Secondary Shot"];
      const secondaryShotAssetId = secondaryShotUrl
        ? await uploadImageFromUrl(
            secondaryShotUrl,
            `${slug}-secondary.jpg`,
          )
        : null;

      // Upload sold shot (optional)
      const soldShotUrl = row["Sold Shot"];
      const soldShotAssetId = soldShotUrl
        ? await uploadImageFromUrl(soldShotUrl, `${slug}-sold.jpg`)
        : null;

      // Process gallery images
      console.log("  🖼️  Processing gallery images...");
      const galleryExterior1 = await processImageGallery(
        row["Gallery Exterior 1"],
      );
      const galleryExterior2 = await processImageGallery(
        row["Gallery Exterior 2"],
      );
      const galleryExterior3 = await processImageGallery(
        row["Gallery Exterior 3"],
      );
      const galleryInterior1 = await processImageGallery(
        row["Gallery Interior 1"],
      );
      const galleryInterior2 = await processImageGallery(
        row["Gallery Interior 2"],
      );

      // Convert HTML to Portable Text
      console.log("  📝 Converting content to Portable Text...");
      const overview = htmlToPortableText(row["Overview"]);
      const highlights = htmlToPortableText(row["Highlights"]);

      // Parse listing features
      const listingFeatures = parseListingFeatures(
        row["Listing thumbnail features"],
      );

      // Extract colors
      const exteriorColor = cleanColorValue(row["Exterior Color(s)"]);
      const interiorColor = cleanColorValue(row["Interior Color(s)"]);

      // Build vehicle document
      const vehicleDoc = {
        _type: "vehicle",
        _id: `vehicle-${slug}`,
        listingTitle,
        slug: {
          _type: "slug",
          current: slug,
        },
        stockNumber,
        vin,
        chassis: mapChassisCode(row["Chassis"] || ""),
        mileage: parseInt(row["Mileage"]) || 0,
        bodyStyle: row["Body Style"] || "Coupe",
        drive: row["Drive"] || "Rear-Wheel Drive",
        exteriorColor,
        interiorColor,
        listingPrice: parseFloat(row["Listing Price"]) || 0,
        showCallForPrice: row["Show Call For Price"] === "true",
        availabilityDate: row["Availability Date"]
          ? new Date(row["Availability Date"]).toISOString()
          : null,
        inventoryStatus:
          row["Current or Sold Inventory?"] || "Current Inventory",
        statusTag: row["Status Tag"] !== "None" ? row["Status Tag"] : null,
        isLive: row["Is Live"] === "true",
        featuredVehicle: row["Featured Vehicle"] === "true",
        featuredInventory: row["Featured Inventory"] === "true",
        sortOrder: parseInt(row["Sort Order"]) || 0,
        engineCodes: extractEngineCode(row["Engine Codes"]),
        engineType: row["Engine Type"] || "Gasoline",
        engineSize: mapEngineSize(row["Engine Size"]),
        transmission: row["Transmission"] || "Manual Transmission",
        signatureShot: {
          _type: "image",
          asset: {
            _ref: signatureShotAssetId,
            _type: "reference",
          },
        },
        ...(secondaryShotAssetId && {
          secondaryShot: {
            _type: "image",
            asset: {
              _ref: secondaryShotAssetId,
              _type: "reference",
            },
          },
        }),
        ...(soldShotAssetId && {
          soldShot: {
            _type: "image",
            asset: {
              _ref: soldShotAssetId,
              _type: "reference",
            },
          },
        }),
        ...(galleryExterior1.length > 0 && { galleryExterior1 }),
        ...(galleryExterior2.length > 0 && { galleryExterior2 }),
        ...(galleryExterior3.length > 0 && { galleryExterior3 }),
        ...(galleryInterior1.length > 0 && { galleryInterior1 }),
        ...(galleryInterior2.length > 0 && { galleryInterior2 }),
        ...(listingFeatures.length > 0 && {
          listingThumbnailFeatures: listingFeatures,
        }),
        ...(highlights.length > 0 && { highlights }),
        ...(overview.length > 0 && { overview }),
        ...(row["History"] && { history: row["History"] }),
        createdAt: row["Created On"]
          ? new Date(row["Created On"]).toISOString()
          : new Date().toISOString(),
        updatedAt: row["Updated On"]
          ? new Date(row["Updated On"]).toISOString()
          : new Date().toISOString(),
      };

      // Create or update vehicle in Sanity
      console.log("  💾 Saving to Sanity...");
      await client.createOrReplace(vehicleDoc);

      console.log(`  ✅ Successfully imported!`);
      imported++;
    } catch (error) {
      console.error(`  ❌ Error importing vehicle:`, error);
      failed++;
    }
  }

  console.log(`\n\n======================================`);
  console.log(`📊 Import Summary`);
  console.log(`======================================`);
  console.log(`✅ Successfully imported: ${imported}`);
  console.log(`⏭️  Skipped (already exist): ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📦 Total: ${vehicles.length}`);
  console.log(`======================================\n`);
}

// Run import
const csvPath = path.join(
  process.cwd(),
  "Enthusiast Auto - Inventories (1).csv",
);

if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV file not found: ${csvPath}`);
  process.exit(1);
}

if (!process.env.SANITY_API_TOKEN) {
  console.error(`❌ SANITY_API_TOKEN not set in .env.local`);
  console.error(
    `Please generate a token at: https://www.sanity.io/manage/personal/tokens`,
  );
  process.exit(1);
}

importVehicles(csvPath).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
