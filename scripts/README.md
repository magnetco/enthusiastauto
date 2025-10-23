# Vehicle Import Script

This script imports vehicle inventory data from CSV into Sanity CMS.

## Prerequisites

1. **Sanity API Token**: You need an API token with Editor permissions.
   - Go to https://www.sanity.io/manage/personal/tokens
   - Create a new token with Editor role
   - Add it to `.env.local`:
     ```
     SANITY_API_TOKEN="your-token-here"
     ```

2. **CSV File**: Place your CSV file at the root of the project:
   ```
   Enthusiast Auto - Inventories (1).csv
   ```

## What the Script Does

The import script handles:

- ✅ **Field Mapping**: Maps CSV columns to Sanity vehicle schema
- ✅ **Image Uploads**: Downloads images from URLs and uploads to Sanity
- ✅ **HTML Conversion**: Converts HTML content to Portable Text format
- ✅ **Data Transformation**: Cleans and normalizes data (colors, chassis codes, etc.)
- ✅ **Gallery Processing**: Handles multiple image galleries per vehicle
- ✅ **Error Handling**: Continues processing if individual vehicles fail

## Field Mappings

### Basic Information
- `Listing Title` → `listingTitle`
- `Slug` → `slug`
- `Stock Number` → `stockNumber`
- `VIN` → `vin`
- `Chassis` → `chassis` (normalized to E39, E46, etc.)
- `Mileage` → `mileage`
- `Body Style` → `bodyStyle`
- `Drive` → `drive`

### Colors & Pricing
- `Exterior Color(s)` → `exteriorColor` (cleaned and formatted)
- `Interior Color(s)` → `interiorColor` (cleaned and formatted)
- `Listing Price` → `listingPrice`
- `Show Call For Price` → `showCallForPrice`

### Status & Visibility
- `Current or Sold Inventory?` → `inventoryStatus`
- `Status Tag` → `statusTag`
- `Is Live` → `isLive`
- `Featured Vehicle` → `featuredVehicle`
- `Featured Inventory` → `featuredInventory`
- `Sort Order` → `sortOrder`

### Engine & Transmission
- `Engine Codes` → `engineCodes` (extracted and normalized)
- `Engine Type` → `engineType`
- `Engine Size` → `engineSize` (mapped to standard format)
- `Transmission` → `transmission`

### Images
- `Signature Shot` → `signatureShot` (uploaded to Sanity)
- `Secondary Shot` → `secondaryShot` (uploaded to Sanity)
- `Sold Shot` → `soldShot` (uploaded to Sanity)
- `Gallery Exterior 1/2/3` → `galleryExterior1/2/3` (array of images)
- `Gallery Interior 1/2` → `galleryInterior1/2` (array of images)

### Content
- `Listing thumbnail features` → `listingThumbnailFeatures` (parsed bullets)
- `Highlights` → `highlights` (HTML → Portable Text)
- `Overview` → `overview` (HTML → Portable Text)
- `History` → `history` (text)

### Metadata
- `Created On` → `createdAt`
- `Updated On` → `updatedAt`

## Running the Import

### Step 1: Set up Sanity Token

Edit `.env.local` and add your Sanity API token:

```bash
SANITY_API_TOKEN="skxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Step 2: Run the Import

```bash
pnpm run import:vehicles
```

### Expected Output

```
📖 Reading CSV file...

✅ Found 112 vehicles in CSV

[1/112] Processing: 1985 BMW E24 M635CSI
  📸 Uploading signature shot...
  📸 Uploading secondary shot...
  🖼️  Processing gallery images...
  📝 Converting content to Portable Text...
  💾 Saving to Sanity...
  ✅ Successfully imported!

[2/112] Processing: 1987 BMW E24 M6
  📸 Uploading signature shot...
  ...

======================================
📊 Import Summary
======================================
✅ Successfully imported: 110
❌ Failed: 2
📦 Total: 112
======================================
```

## What Gets Imported

For each vehicle, the script:

1. **Validates** required fields (title, slug, stock number, VIN)
2. **Downloads** the signature shot (required) - skips vehicle if this fails
3. **Downloads** optional shots (secondary, sold)
4. **Processes** up to 5 image galleries (exterior 1/2/3, interior 1/2)
5. **Converts** HTML content to Portable Text for rich text fields
6. **Parses** bullet points from listing features
7. **Creates or updates** the vehicle document in Sanity

## Error Handling

- **Missing required fields**: Vehicle is skipped with error message
- **Image download failures**: Non-critical images are skipped, import continues
- **Signature shot failure**: Vehicle is skipped (signature shot is required)
- **Invalid data**: Default values are used where possible

## Rate Limiting

The script includes a 500ms delay between image uploads to avoid rate limiting on:
- Image hosting CDN
- Sanity asset uploads

For 112 vehicles with ~50 images each, expect the import to take **2-3 hours**.

## Troubleshooting

### "SANITY_API_TOKEN not set"
- Make sure you've added the token to `.env.local`
- Verify the token has Editor permissions

### "CSV file not found"
- Ensure the CSV file is at the project root
- Check the filename matches exactly: `Enthusiast Auto - Inventories (1).csv`

### Images not uploading
- Check your internet connection
- Verify the image URLs in the CSV are accessible
- Check Sanity project quotas and limits

### HTML conversion errors
- Some HTML may not convert perfectly to Portable Text
- Check the Sanity Studio to verify content looks correct
- Manual cleanup may be needed for complex HTML

## After Import

1. **Verify in Sanity Studio**
   - Go to http://localhost:3000/studio
   - Check that vehicles are imported correctly
   - Verify images are displaying

2. **Test on Frontend**
   - Navigate to your inventory pages
   - Confirm vehicles are showing up
   - Check that filtering/sorting works

3. **Clean Up**
   - You can archive the CSV file after successful import
   - Keep the import script for future updates

## Updating Vehicles

The script uses `createOrReplace`, so:
- Running it again will **update** existing vehicles
- Vehicle ID is based on the slug: `vehicle-${slug}`
- You can safely re-run the import to update data

## Notes

- The import preserves original created/updated timestamps from the CSV
- Empty/optional fields are omitted from the document
- Color values are cleaned (slug format → readable format)
- Chassis codes are normalized to standard formats (E39, E46, etc.)
- Engine codes are extracted and validated against schema
