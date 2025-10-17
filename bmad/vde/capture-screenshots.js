const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BREAKPOINTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];

const TARGET_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, 'data', 'screenshots');

async function waitForPageReady(page) {
  try {
    // Wait for network to be idle
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
      console.log('      Network idle timeout - continuing anyway');
    });

    // Wait for document ready state
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 5000 }).catch(() => {
      console.log('      Document ready timeout - continuing anyway');
    });

    // Wait for fonts to be ready
    await page.waitForFunction(() => document.fonts.ready, { timeout: 5000 }).catch(() => {
      console.log('      Fonts ready timeout - continuing anyway');
    });

    // Check for any images and wait for them to load
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images
          .filter(img => !img.complete)
          .map(img => new Promise(resolve => {
            const timeout = setTimeout(resolve, 3000);
            img.onload = img.onerror = () => {
              clearTimeout(timeout);
              resolve();
            };
          }))
      );
    }).catch(() => {
      console.log('      Image load timeout - continuing anyway');
    });

    // Additional buffer for final settling (animations, lazy loads, etc.)
    await page.waitForTimeout(500);
  } catch (error) {
    console.log('      Wait error:', error.message);
  }
}

async function captureScreenshots() {
  const metadata = {
    screenshots: [],
    capturedAt: new Date().toISOString(),
    targetUrl: TARGET_URL
  };

  console.log('🚀 Starting screenshot capture process...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage']
  });

  try {
    for (const breakpoint of BREAKPOINTS) {
      console.log(`📸 Capturing ${breakpoint.name} at ${breakpoint.width}x${breakpoint.height}...`);

      const context = await browser.newContext({
        viewport: { width: breakpoint.width, height: breakpoint.height },
        deviceScaleFactor: 1,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      });

      const page = await context.newPage();
      const warnings = [];

      // Monitor console errors and warnings
      page.on('console', msg => {
        if (msg.type() === 'error') {
          warnings.push(`Console error: ${msg.text()}`);
        }
      });

      // Monitor failed requests
      page.on('requestfailed', request => {
        warnings.push(`Failed request: ${request.url()} - ${request.failure().errorText}`);
      });

      try {
        // Navigate to the page
        const response = await page.goto(TARGET_URL, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });

        if (!response || !response.ok()) {
          warnings.push(`HTTP ${response?.status()} response from ${TARGET_URL}`);
        }

        // Wait for page to be fully ready
        await waitForPageReady(page);

        // Capture screenshot
        const filename = `baseline-${breakpoint.name}-${breakpoint.width}x${breakpoint.height}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);

        await page.screenshot({
          path: filepath,
          fullPage: false // Capture viewport only for consistency
        });

        console.log(`   ✅ Saved to: ${filename}`);
        if (warnings.length > 0) {
          console.log(`   ⚠️  Warnings: ${warnings.length}`);
          warnings.forEach(w => console.log(`      - ${w}`));
        }

        metadata.screenshots.push({
          path: filepath,
          filename: filename,
          viewport: { width: breakpoint.width, height: breakpoint.height },
          breakpoint: breakpoint.name,
          capturedAt: new Date().toISOString(),
          warnings: warnings
        });

      } catch (error) {
        console.error(`   ❌ Error capturing ${breakpoint.name} at ${breakpoint.width}x${breakpoint.height}:`, error.message);
        metadata.screenshots.push({
          path: null,
          filename: null,
          viewport: { width: breakpoint.width, height: breakpoint.height },
          breakpoint: breakpoint.name,
          capturedAt: new Date().toISOString(),
          error: error.message,
          warnings: warnings
        });
      } finally {
        await context.close();
      }
    }

    // Save metadata
    const metadataPath = path.join(OUTPUT_DIR, 'baseline-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`\n📋 Metadata saved to: baseline-metadata.json`);

    // Summary
    const successful = metadata.screenshots.filter(s => s.path).length;
    const failed = metadata.screenshots.filter(s => !s.path).length;
    const totalWarnings = metadata.screenshots.reduce((sum, s) => sum + (s.warnings?.length || 0), 0);

    console.log('\n' + '='.repeat(60));
    console.log('📊 CAPTURE SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successful}/${BREAKPOINTS.length}`);
    console.log(`❌ Failed: ${failed}/${BREAKPOINTS.length}`);
    console.log(`⚠️  Total warnings: ${totalWarnings}`);
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);
    console.log('='.repeat(60) + '\n');

    return metadata;

  } finally {
    await browser.close();
  }
}

// Run the capture
captureScreenshots()
  .then(metadata => {
    console.log('🎉 Screenshot capture completed successfully!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
