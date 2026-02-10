#!/usr/bin/env ts-node

/**
 * Script to download BMW chassis icons from the website
 * Run with: npx ts-node scripts/download-chassis-icons.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// Chassis icon mappings from the website
const chassisIcons: Record<string, string> = {
  e24: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896dd4_e24_light.avif',
  e26: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/6760879dd69be3dfbe296b7a_e26_light.avif',
  e28: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896dd5_e28_light.avif',
  e30: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896dd6_e30_light.avif',
  e31: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896dd7_e31_light.avif',
  e34: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896dd8_e34_light.avif',
  e36: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896dd9_e36_light.avif',
  e39: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896dda_e39_light.avif',
  e46: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896ddb_e46_light.avif',
  e60: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896ddc_e60_light.avif',
  e82: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896ddd_e82_light.avif',
  e9x: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896dde_e9x_light.avif',
  f8x: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896ddf_f8x_light.avif',
  f87: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896de0_f87_light.avif',
  g8x: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896de1_g8x_light.avif',
  z3: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896de2_z3_light.avif',
  z4: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896de3_z4_light.avif',
  z8: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896de4_z8_light.avif',
  sav: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896de5_sav_light.avif',
  other: 'https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63/67608c7070c6a5a8f3896de6_other_light.avif',
};

// Output directory
const outputDir = path.join(process.cwd(), 'website', 'public', 'chassis-icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✓ Created directory: ${outputDir}`);
}

// Function to download a file
function downloadFile(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Main execution
async function main() {
  console.log('Starting chassis icon downloads...\n');

  const downloads = Object.entries(chassisIcons).map(([chassis, url]) => {
    const filename = `${chassis}.avif`;
    return downloadFile(url, filename);
  });

  try {
    await Promise.all(downloads);
    console.log(`\n✓ Successfully downloaded ${downloads.length} chassis icons to ${outputDir}`);
  } catch (error) {
    console.error('\n✗ Error downloading icons:', error);
    process.exit(1);
  }
}

main();
