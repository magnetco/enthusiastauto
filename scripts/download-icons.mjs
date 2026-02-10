#!/usr/bin/env node

/**
 * Script to download BMW chassis icons
 * Run with: node scripts/download-icons.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chassis icon mappings
const chassisIcons = {
  e24: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896dd4_e24_light.avif',
  e26: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/6760879dd69be3dfbe296b7a_e26_light.avif',
  e28: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7e1_e28_light.avif',
  e30: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7e2_e30_light.avif',
  e31: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7e3_e31_light.avif',
  e34: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7e4_e34_light.avif',
  e36: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7e5_e36_light.avif',
  e39: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7e6_e39_light.avif',
  e46: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7e7_e46_light.avif',
  e60: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7e8_e60_light.avif',
  e82: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7e9_e82_light.avif',
  e9x: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7ea_e9x_light.avif',
  f8x: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7eb_f8x_light.avif',
  f87: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7ec_f87_light.avif',
  g8x: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7ed_g8x_light.avif',
  z3: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7ee_z3_light.avif',
  z4: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7ef_z4_light.avif',
  z8: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7f0_z8_light.avif',
  sav: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7f1_sav_light.avif',
  other: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/676089e7e1f1c0d8b1c0f7f2_other_light.avif',
};

// Output directory
const outputDir = path.join(__dirname, '..', 'website', 'public', 'chassis-icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✓ Created directory: ${outputDir}`);
}

// Function to download a file with proper headers
async function downloadFile(url, filename) {
  const filePath = path.join(outputDir, filename);
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/*,*/*;q=0.8',
        'Referer': 'https://www.enthusiastauto.com/',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log(`✓ Downloaded: ${filename}`);
  } catch (error) {
    console.error(`✗ Failed to download ${filename}:`, error.message);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('Starting chassis icon downloads...\n');

  for (const [chassis, url] of Object.entries(chassisIcons)) {
    const filename = `${chassis}.avif`;
    try {
      await downloadFile(url, filename);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Skipping ${chassis} due to error`);
    }
  }

  console.log(`\n✓ Download complete! Icons saved to ${outputDir}`);
}

main().catch(console.error);
