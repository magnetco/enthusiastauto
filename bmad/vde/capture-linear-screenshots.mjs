import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const breakpoints = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];

async function captureScreenshots() {
  const browser = await chromium.launch({
    headless: true
  });

  try {
    for (const breakpoint of breakpoints) {
      console.log(`Capturing ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})...`);

      const page = await browser.newPage({
        viewport: {
          width: breakpoint.width,
          height: breakpoint.height
        },
        deviceScaleFactor: 2 // Retina quality
      });

      // Navigate to the page
      await page.goto('http://localhost:3000', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for main content
      await page.waitForSelector('main', { timeout: 10000 });

      // Additional wait for images and dynamic content
      await page.evaluate(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
      });

      // Capture screenshot
      const screenshotPath = path.join(
        __dirname,
        'data/screenshots',
        `linear-transform-${breakpoint.name}-${breakpoint.width}.png`
      );

      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      console.log(`✓ Saved: ${screenshotPath}`);

      await page.close();
    }
  } catch (error) {
    console.error('Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('\nAll screenshots captured successfully!');
}

captureScreenshots().catch(console.error);
