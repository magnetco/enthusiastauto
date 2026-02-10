# Chassis Icon Download Instructions

## Manual Download Method

Since the CDN blocks automated downloads, please download the icons manually:

1. Open https://www.enthusiastauto.com/inventory?status=Current%20Inventory in your browser
2. Open browser DevTools (F12 or Right-click → Inspect)
3. Go to the Network tab
4. Filter by "avif" or "images"
5. Scroll to the chassis filter section
6. Right-click each chassis icon and select "Open in new tab"
7. Save each image with the following naming convention:
   - `e24.avif`, `e26.avif`, `e28.avif`, etc.
8. Save all files to: `website/public/chassis-icons/`

## Required Icons

- e24.avif ✓ (downloaded)
- e26.avif ✓ (downloaded)
- e28.avif
- e30.avif
- e31.avif
- e34.avif
- e36.avif
- e39.avif
- e46.avif
- e60.avif
- e82.avif
- e9x.avif
- f8x.avif
- f87.avif
- g8x.avif
- z3.avif
- z4.avif
- z8.avif
- sav.avif
- other.avif

## Alternative: Extract from Page Source

You can also inspect the page HTML and find the image URLs directly:

```javascript
// Run this in browser console on the inventory page
const images = document.querySelectorAll('img[src*="_light.avif"]');
images.forEach(img => {
  console.log(img.src);
});
```

Then use curl or wget to download each URL.
