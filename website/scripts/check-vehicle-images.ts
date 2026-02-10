/**
 * Diagnostic script to check vehicle images in Sanity
 * Run with: npx tsx scripts/check-vehicle-images.ts
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2025-10-21";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

async function checkVehicleImages() {
  console.log("🔍 Checking vehicle images in Sanity...\n");
  console.log(`Project ID: ${projectId}`);
  console.log(`Dataset: ${dataset}\n`);

  // Query for all vehicles
  const query = `
    *[_type == "vehicle"] | order(_createdAt desc) {
      _id,
      listingTitle,
      status,
      isLive,
      "hasSignatureShot": defined(signatureShot),
      "hasSoldShot": defined(soldShot),
      "signatureShotAsset": signatureShot.asset->url,
      "soldShotAsset": soldShot.asset->url,
      "galleryCount": count([
        ...coalesce(galleryExterior1[], []),
        ...coalesce(galleryExterior2[], []),
        ...coalesce(galleryExterior3[], []),
        ...coalesce(galleryInterior1[], []),
        ...coalesce(galleryInterior2[], [])
      ])
    }
  `;

  try {
    const vehicles = await client.fetch(query);
    
    console.log(`📊 Found ${vehicles.length} total vehicles\n`);
    
    let withImages = 0;
    let withoutImages = 0;
    let currentVehicles = 0;
    let soldVehicles = 0;
    let liveVehicles = 0;
    
    vehicles.forEach((vehicle: any, index: number) => {
      const hasImage = vehicle.hasSignatureShot && vehicle.signatureShotAsset;
      if (hasImage) {
        withImages++;
      } else {
        withoutImages++;
      }
      
      if (vehicle.status === 'current') currentVehicles++;
      if (vehicle.status === 'sold') soldVehicles++;
      if (vehicle.isLive) liveVehicles++;
      
      console.log(`${index + 1}. ${vehicle.listingTitle}`);
      console.log(`   Status: ${vehicle.status} | Live: ${vehicle.isLive ? '✅' : '❌'}`);
      console.log(`   Signature Shot: ${vehicle.hasSignatureShot ? '✅' : '❌'} ${vehicle.signatureShotAsset ? `(${vehicle.signatureShotAsset.substring(0, 50)}...)` : '(no URL)'}`);
      console.log(`   Gallery Images: ${vehicle.galleryCount || 0}`);
      console.log('');
    });
    
    console.log('\n📈 Summary:');
    console.log(`   📊 Total vehicles: ${vehicles.length}`);
    console.log(`   🟢 Current vehicles: ${currentVehicles}`);
    console.log(`   🔴 Sold vehicles: ${soldVehicles}`);
    console.log(`   👁️  Live vehicles: ${liveVehicles}`);
    console.log(`   ✅ Vehicles with images: ${withImages}`);
    console.log(`   ❌ Vehicles without images: ${withoutImages}`);
    
  } catch (error) {
    console.error("❌ Error fetching vehicles:", error);
  }
}

checkVehicleImages();
