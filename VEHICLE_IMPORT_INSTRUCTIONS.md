# Vehicle Import Instructions

This guide walks you through importing your 112 vehicles from the CSV file into Sanity CMS.

## Overview

The import script will:
- Import all 112 vehicles from `Enthusiast Auto - Inventories (1).csv`
- Download and upload ~5,600 images to Sanity
- Convert HTML content to Sanity's Portable Text format
- Map all vehicle data to your Sanity schema
- Take approximately 2-3 hours to complete

## Prerequisites

- CSV file is at: `/Users/heggiedesign/Development/enthusiastauto-1/Enthusiast Auto - Inventories (1).csv`
- All dependencies are already installed
- Dev server can be running or stopped (doesn't matter)

## Step-by-Step Instructions

### Step 1: Get Your Sanity API Token

1. Open your browser and go to: https://www.sanity.io/manage/personal/tokens

2. Click the **"Create new token"** button

3. Fill in the form:
   - **Name**: `Vehicle Import` (or any name you prefer)
   - **Permissions**: Select **"Editor"** role
   - **Dataset**: Make sure it's for the `production` dataset

4. Click **"Create"**

5. **IMPORTANT**: Copy the token immediately (it starts with `sk...`)
   - You won't be able to see it again after closing the dialog

### Step 2: Add Token to .env.local

1. Open the file: `.env.local` in your project root

2. Find this line:
   ```
   SANITY_API_TOKEN="YOUR_SANITY_API_TOKEN_HERE"
   ```

3. Replace `YOUR_SANITY_API_TOKEN_HERE` with your actual token:
   ```
   SANITY_API_TOKEN="sk_your_actual_token_here"
   ```

4. Save the file

### Step 3: Run the Import

1. Open your terminal

2. Make sure you're in the project directory:
   ```bash
   cd /Users/heggiedesign/Development/enthusiastauto-1
   ```

3. Run the import command:
   ```bash
   pnpm run import:vehicles
   ```

### Step 4: Monitor the Progress

You'll see output like this:

```
📖 Reading CSV file...

✅ Found 112 vehicles in CSV

[1/112] Processing: 1985 BMW E24 M635CSI
  📸 Uploading signature shot...
  📸 Uploading secondary shot...
  🖼️  Processing gallery images...
    Uploading image: 1051594-E24-Diamond-Schwarz-001.jpg
    Uploading image: 1051594-E24-Diamond-Schwarz-002.jpg
    ...
  📝 Converting content to Portable Text...
  💾 Saving to Sanity...
  ✅ Successfully imported!

[2/112] Processing: 1987 BMW E24 M6
  ...
```

**IMPORTANT**:
- The process takes 2-3 hours - let it run!
- Don't close the terminal window
- If it stops or errors, you can safely re-run the command

### Step 5: Wait for Completion

When done, you'll see a summary:

```
======================================
📊 Import Summary
======================================
✅ Successfully imported: 110
❌ Failed: 2
📦 Total: 112
======================================
```

### Step 6: Verify in Sanity Studio

1. Start your dev server (if not already running):
   ```bash
   pnpm dev
   ```

2. Open: http://localhost:3000/studio

3. You should see all imported vehicles!

4. Click on a few vehicles to verify:
   - ✅ Images are displaying
   - ✅ Content looks correct
   - ✅ All fields are populated

## Troubleshooting

### "SANITY_API_TOKEN not set"
- Double-check you saved `.env.local` after adding the token
- Make sure there are no extra spaces around the token
- Verify the token starts with `sk`

### "CSV file not found"
- The file should be at the project root: `Enthusiast Auto - Inventories (1).csv`
- Check the filename matches exactly (case-sensitive)

### Script stops or crashes
- Check your internet connection
- You can safely re-run `pnpm run import:vehicles`
- The script uses `createOrReplace`, so it won't duplicate vehicles

### Some vehicles failed to import
- Check the error messages in the terminal
- Common issues:
  - Missing required fields (title, VIN, stock number)
  - Signature shot image URL is broken
  - Invalid data in certain fields
- You can manually fix these vehicles in Sanity Studio later

### Images not showing up
- Wait a few minutes - Sanity processes images asynchronously
- Refresh the Studio page
- Check your Sanity project's asset quotas/limits

## After Import

### Option 1: Keep the CSV as Backup
Move it to a backup folder:
```bash
mkdir -p backups
mv "Enthusiast Auto - Inventories (1).csv" backups/
```

### Option 2: Delete the CSV
If you're confident the import worked:
```bash
rm "Enthusiast Auto - Inventories (1).csv"
```

## Re-running the Import

If you need to update vehicles or re-import:

1. Place the updated CSV file at the project root
2. Run: `pnpm run import:vehicles`
3. Existing vehicles will be **updated** (not duplicated)
4. New vehicles will be **added**

The script identifies vehicles by their slug, so vehicles with matching slugs will be replaced with updated data.

## What Gets Imported

- **Basic Info**: Title, slug, VIN, stock number, chassis, mileage, body style
- **Colors**: Exterior and interior colors (cleaned and formatted)
- **Pricing**: Listing price, call-for-price toggle
- **Status**: Inventory status, status tags, visibility settings
- **Engine**: Engine code, type, size, transmission
- **Images**:
  - Signature shot (hero image)
  - Secondary shot
  - Sold shot
  - Up to 75 gallery images per vehicle (5 galleries × 15 images)
- **Content**: Highlights, overview, history (HTML → Portable Text)
- **Features**: Bullet points for listing cards
- **Metadata**: Created/updated timestamps

## Need Help?

- Check the detailed docs: `scripts/README.md`
- View the import script: `scripts/import-vehicles.ts`
- Check Sanity logs: https://www.sanity.io/manage

## Quick Reference

```bash
# Run the import
pnpm run import:vehicles

# View Sanity Studio
pnpm dev
# Then visit: http://localhost:3000/studio

# Check environment variables
cat .env.local
```
