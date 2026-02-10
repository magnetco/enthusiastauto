#!/usr/bin/env node

/**
 * Script to scrape chassis icons from the inventory page using Puppeteer
 * Run with: node scripts/scrape-chassis-icons.mjs
 * 
 * Install puppeteer first: npm install puppeteer
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '..', 'website', 'public', 'chassis-icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function main() {
  console.log('Launching browser...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for production
  });
  
  const page = await browser.newPage();
  
  // Navigate to the inventory page
  console.log('Navigating to inventory page...');
  await page.goto('https://www.enthusiastauto.com/inventory?status=Current%20Inventory', {
    waitUntil: 'networkidle2',
  });
  
  // Wait for chassis icons to load
  await page.waitForSelector('img[alt*="chassis"], img[src*="chassis"], img[src*="_light.avif"]', {
    timeout: 10000,
  });
  
  // Extract all chassis icon URLs
  const iconData = await page.evaluate(() => {
    const icons = [];
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      const src = img.src;
      const alt = img.alt || '';
      
      // Look for chassis-related images
      if (src.includes('_light.avif') || alt.toLowerCase().includes('chassis')) {
        // Try to extract chassis code from filename
        const match = src.match(/([a-z0-9]+)_light\.avif/i);
        if (match) {
          icons.push({
            chassis: match[1].toLowerCase(),
            url: src,
            alt: alt,
          });
        }
      }
    });
    
    return icons;
  });
  
  console.log(`\nFound ${iconData.length} chassis icons:`);
  iconData.forEach(icon => {
    console.log(`  - ${icon.chassis}: ${icon.url}`);
  });
  
  // Download each icon
  console.log('\nDownloading icons...');
  for (const icon of iconData) {
    try {
      const response = await page.goto(icon.url, { waitUntil: 'networkidle2' });
      const buffer = await response.buffer();
      
      const filename = `${icon.chassis}.avif`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, buffer);
      console.log(`✓ Downloaded: ${filename}`);
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`✗ Failed to download ${icon.chassis}:`, error.message);
    }
  }
  
  await browser.close();
  console.log(`\n✓ Complete! Icons saved to ${outputDir}`);
}

main().catch(console.error);
