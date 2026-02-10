# Chassis Icons Implementation

## Overview

I've implemented visual chassis icons for the vehicle inventory filter. The icons are displayed in a grid layout that makes it easy for users to visually identify and select BMW chassis types.

## What's Been Done

### 1. Created Component Structure

- **`ChassisIcon.tsx`**: A reusable component that displays chassis icons with fallback to text labels
- **Updated `VehicleFilters.tsx`**: Replaced checkbox list with visual icon grid

### 2. Icon Storage

- Created directory: `website/public/chassis-icons/`
- Successfully downloaded: `e24.avif`, `e26.avif`
- Placeholder files created for remaining icons (need actual downloads)

### 3. Filter UI Improvements

The chassis filter now displays as a responsive grid of clickable icon cards:
- Visual BMW chassis silhouettes
- Hover effects
- Selected state indicators
- Responsive layout (2-3 columns depending on screen size)
- Maintains all existing filter functionality

## Completing the Icon Downloads

The CDN blocks automated downloads, so you'll need to manually download the remaining icons. Here are three methods:

### Method 1: Browser DevTools (Recommended)

1. Open https://www.enthusiastauto.com/inventory?status=Current%20Inventory
2. Open DevTools (F12)
3. Go to Network tab
4. Filter by "avif"
5. Scroll to chassis filter section
6. Right-click each icon → "Open in new tab"
7. Save each as `{chassis-code}.avif` to `website/public/chassis-icons/`

### Method 2: Browser Console

Run this in the browser console on the inventory page:

```javascript
// Extract all chassis icon URLs
const icons = Array.from(document.querySelectorAll('img[src*="_light.avif"]'));
icons.forEach(img => {
  const match = img.src.match(/([a-z0-9]+)_light\.avif/i);
  if (match) {
    console.log(`${match[1]}: ${img.src}`);
  }
});
```

Then use curl to download each:

```bash
curl -o website/public/chassis-icons/e28.avif \
  -H "User-Agent: Mozilla/5.0" \
  -H "Referer: https://www.enthusiastauto.com/" \
  "https://cdn.prod.website-files.com/..."
```

### Method 3: Use the Shell Script

I've created `scripts/download-remaining-icons.sh` but you'll need to update the file IDs:

1. Use Method 2 above to get the correct URLs
2. Extract the file IDs from the URLs
3. Update the script with correct IDs
4. Run: `bash scripts/download-remaining-icons.sh`

## Required Icons

All icons should be saved as `.avif` files:

- [x] e24.avif ✓
- [x] e26.avif ✓
- [ ] e28.avif
- [ ] e30.avif
- [ ] e31.avif
- [ ] e34.avif
- [ ] e36.avif
- [ ] e39.avif
- [ ] e46.avif
- [ ] e60.avif
- [ ] e82.avif
- [ ] e9x.avif
- [ ] f8x.avif
- [ ] f87.avif
- [ ] g8x.avif
- [ ] z3.avif
- [ ] z4.avif
- [ ] z8.avif
- [ ] sav.avif
- [ ] other.avif

## Testing

Once icons are downloaded:

1. Start the development server: `cd website && npm run dev`
2. Navigate to `/vehicles`
3. Check that chassis icons display correctly
4. Test filter functionality
5. Verify responsive layout on mobile/tablet

## Fallback Behavior

The `ChassisIcon` component includes error handling:
- If an icon fails to load, it displays the chassis code as text
- This ensures the filter remains functional even with missing icons

## File Structure

```
website/
├── public/
│   └── chassis-icons/
│       ├── e24.avif ✓
│       ├── e26.avif ✓
│       └── ... (18 more needed)
├── components/
│   └── vehicles/
│       ├── ChassisIcon.tsx (new)
│       └── VehicleFilters.tsx (updated)
└── app/
    └── vehicles/
        └── page.tsx (unchanged)
```

## Next Steps

1. Download remaining 18 chassis icons using one of the methods above
2. Test the filter on the vehicles page
3. Optionally: Add dark mode variants (`_dark.avif`) if needed
4. Consider adding loading states for icons

## Notes

- Icons are 80x40px for optimal display
- AVIF format provides excellent compression
- Component gracefully handles missing icons
- All existing filter functionality is preserved
- The visual grid improves UX significantly
