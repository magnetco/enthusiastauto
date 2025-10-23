# Sanity CMS Editor Guide - Enthusiast Auto

**Last Updated:** October 22, 2025
**Version:** 1.0

## Table of Contents

1. [Getting Started](#getting-started)
2. [Adding a New Vehicle](#adding-a-new-vehicle)
3. [Bulk Image Upload](#bulk-image-upload)
4. [Updating Vehicle Status](#updating-vehicle-status)
5. [Draft/Publish Workflow](#draftpublish-workflow)
6. [SEO Best Practices](#seo-best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing Sanity Studio

1. Navigate to: `https://yourdomain.com/studio` (or your deployed Studio URL)
2. Click **"Sign in with Google"**
3. Use your authorized Google account to log in
4. You'll see the Enthusiast Auto Content Studio dashboard

### Studio Navigation

The left sidebar shows organized views:
- **Current Inventory** - Active vehicle listings (status: "current")
- **Sold Vehicles** - Sold inventory (status: "sold")
- **Drafts** - Unpublished work in progress
- **All Vehicles** - Complete unfiltered list

All views are sorted by newest first.

---

## Adding a New Vehicle

### Step 1: Choose a Template

1. Click the **"+"** button (top right) or press `Ctrl+Alt+N`
2. Select a vehicle type template:
   - **BMW Sedan** - Pre-configured for sedans
   - **BMW Coupe** - Pre-configured for coupes
   - **BMW SUV** - Pre-configured for SUVs (defaults to AWD)
   - **BMW Convertible** - Pre-configured for convertibles
   - **BMW Wagon** - Pre-configured for wagons

**Tip:** Templates pre-populate common fields like body style, drive type, and status. You can still change any field after selecting a template.

### Step 2: Fill Required Fields

**Critical Fields (Cannot publish without these):**

1. **Listing Title** ⚠️ SEO IMPORTANT
   - Format: `YEAR MAKE CHASSIS MODEL`
   - Example: `2003 BMW E39 M5`
   - Length: 10-100 characters
   - This appears in search results and page titles

2. **Slug**
   - Click "Generate" button to auto-create from title
   - Creates the URL: `/vehicles/your-slug-here`
   - Must be unique across all vehicles

3. **Stock Number**
   - Last 7 characters of VIN
   - Required for CarsForSale integration

4. **VIN**
   - Exactly 17 alphanumeric characters
   - Format validated automatically
   - Cannot contain I, O, or Q

5. **Vehicle Details**
   - Chassis Code (E39, E46, F30, etc.)
   - Mileage (positive integer)
   - Body Style
   - Drive Type

6. **Colors**
   - Exterior Color (e.g., "Jet Black")
   - Interior Color (e.g., "Caramel Leather")

7. **Pricing**
   - Listing Price (USD, positive number)
   - Toggle "Show Call For Price" if hiding amount

8. **Status**
   - Current (active inventory)
   - Sold (no longer available)

9. **Engine & Transmission**
   - Engine Code (S62, N54, B58, etc.)
   - Engine Type (Gasoline, Diesel, etc.)
   - Engine Size (V8, I6, etc.)
   - Transmission type

10. **Signature Shot** ⚠️ REQUIRED
    - Hero image for Current Inventory vehicles
    - Best practice: 3/4 front angle, clean background
    - Minimum resolution: 1920x1080
    - Click image after upload to set focal point (hotspot)

### Step 3: Add Content

**Listing Thumbnail Features** (Optional but recommended)
- Click "+ Add item" for each bullet point
- Examples:
  - "One-Owner Enthusiast Owned!"
  - "Extensive service history since new"
  - "Rare Factory Options"
- Keep under 50 characters each

**Highlights** (Key selling points)
- Rich text editor with formatting
- Use the list button (🔘) to create bullet points
- Use **Bold** (Ctrl+B) for emphasis
- Examples:
  - Recent service and maintenance
  - Notable modifications
  - Condition highlights
  - Rare features

**Overview** (Full description)
- Detailed vehicle story
- Use H2 and H3 headings to organize:
  - Condition
  - Service History
  - Modifications
  - Why This Car Is Special
- Include relevant keywords naturally for SEO
- Tell the story: history, ownership, what makes it unique

**History** (Plain text only)
- Brief summary for Featured Vehicle carousel
- No formatting available (just text)
- Example: "One-owner example with full service history. Recent major service including engine work, transmission rebuild, and suspension refresh. Clean Carfax."

### Step 4: Save and Publish

1. Click **"Publish"** button (top right)
2. If validation errors appear, fix them before publishing
3. Successfully published vehicles appear on the website within 1 minute

**Draft Mode:**
- Changes auto-save as drafts
- Draft documents have "DRAFT" label
- Only you can see drafts (not live on site)

---

## Bulk Image Upload

### Gallery Fields

The vehicle schema has 5 gallery fields:
- **Gallery Exterior 1** - Up to 25 images
- **Gallery Exterior 2** - Up to 25 images
- **Gallery Exterior 3** - Up to 25 images
- **Gallery Interior 1** - Up to 25 images
- **Gallery Interior 2** - Up to 25 images

### How to Upload Multiple Images at Once

#### Method 1: Drag and Drop (Recommended)

1. Open the gallery field you want to add to
2. Select multiple images in your file browser:
   - Windows: Hold `Ctrl` and click each image
   - Mac: Hold `Cmd` and click each image
   - Or click first image, hold `Shift`, click last image (selects range)
3. Drag all selected images into the gallery field
4. Wait for upload progress to complete
5. Images appear as thumbnails in the field

#### Method 2: Click to Browse

1. Click the "+ Select image" button
2. Hold `Ctrl` (Windows) or `Cmd` (Mac) and select multiple files
3. Click "Open"
4. Wait for upload to complete

### Best Practices

**Image Coverage:**
- Exterior: Front, rear, both sides, 3/4 angles, wheels, details, badges
- Interior: Dashboard, seats, door panels, headliner, trunk, controls, special features

**Optimal Formats:**
- JPEG for photos (preferred)
- Max 2MB per image (larger images will slow uploads)
- High resolution but web-optimized

**Adding Descriptions (Optional but recommended):**
1. Click the pencil icon on any uploaded image
2. Fill in:
   - **Alt Text** (SEO): "Front view of BMW M5", "M5 rear quarter panel"
   - **Caption** (Optional): "Recently detailed", "New wheels installed"

### Upload Progress

- Progress bar shows during bulk uploads
- Large batches (20-30 images) may take 1-3 minutes
- Don't close the browser until complete
- If upload fails, try smaller batches (10-15 at a time)

---

## Updating Vehicle Status

### Marking a Vehicle as Sold

1. Open the vehicle document
2. Find the **Status** field
3. Change from "Current" to "Sold"
4. (Optional) Upload a **Sold Shot** image if you have one
   - This replaces the Signature Shot for sold vehicles
5. Click **"Publish"** to save changes

**What Happens:**
- Vehicle moves to "Sold Vehicles" section in Studio
- Website updates within 1 minute (ISR revalidation)
- Sold badge appears on listing
- No longer appears in current inventory feeds

### Making a Sold Vehicle Current Again

1. Open the sold vehicle document
2. Change **Status** from "Sold" to "Current"
3. Ensure **Signature Shot** is set (required for current vehicles)
4. Click **"Publish"**

---

## Draft/Publish Workflow

### Understanding Drafts

- **Draft**: Work in progress, NOT live on website
- **Published**: Live and visible to public

### Working with Drafts

1. **Create Draft:**
   - Make any edits to a vehicle
   - Changes auto-save as a draft
   - Look for "DRAFT" label at top

2. **Preview Draft Changes:**
   - Click the **"Preview"** button (👁️ icon, top right toolbar)
   - Opens draft version on live website
   - URL includes `/api/preview?...`
   - Only you can see this preview (requires secret token)

3. **Publish Changes:**
   - Click **"Publish"** button
   - Removes "DRAFT" label
   - Changes go live on website
   - Triggers website revalidation (ISR)

4. **Discard Draft:**
   - Click the "⋮" menu (top right)
   - Select "Discard changes"
   - Reverts to last published version

### Preview vs Live

| Preview | Published |
|---------|----------|
| Only visible to you | Public on website |
| Requires preview URL | Normal vehicle URL |
| No ISR revalidation | Triggers ISR update |
| Draft label visible | No draft label |

**Tip:** Always preview major changes before publishing!

---

## SEO Best Practices

### Listing Title

✅ **Good Examples:**
- "2003 BMW E39 M5 6-Speed Manual"
- "2015 BMW F80 M3 Competition Package"
- "1995 BMW E36 M3 Lightweight"

❌ **Poor Examples:**
- "M5" (too short, no year/chassis)
- "Super Clean BMW!!!" (unprofessional, excessive punctuation)
- "2003 BMW E39 M5 6-Speed Manual Transmission with Navigation and Heated Seats" (too long)

### Alt Text for Images

✅ **Good Examples:**
- "Front 3/4 view of silver 2003 BMW M5"
- "BMW M5 interior showing caramel leather seats"
- "Close-up of BMW M5 S62 V8 engine bay"

❌ **Poor Examples:**
- "IMG_1234.jpg" (filename, not descriptive)
- "Car" (too vague)
- Left blank (missed SEO opportunity)

### Overview Content

**Tips:**
1. Use natural language (write for humans, not robots)
2. Include relevant keywords organically:
   - Model names (M5, E39, etc.)
   - Features (manual transmission, navigation, etc.)
   - Condition descriptors (clean, excellent, original, etc.)
3. Break into sections with H2/H3 headings
4. Tell the story - what makes this vehicle special?

**Example Structure:**
```
## Overview
Brief introduction to the vehicle...

## Condition
Exterior, interior, mechanical condition details...

## Service History
Recent work, maintenance records...

## Modifications
Any upgrades or changes from stock...

## Why This Car Is Special
What sets it apart from others...
```

---

## Troubleshooting

### "Validation Failed" Error

**Cause:** Required fields are missing or invalid

**Solution:**
1. Read the error message (tells you which field)
2. Scroll to that field (highlighted in red)
3. Fill or correct the field
4. Try publishing again

**Common Validation Errors:**

| Error | Fix |
|-------|-----|
| "Title must be between 10-100 characters" | Make title longer or shorter |
| "Slug is required" | Click "Generate" button next to Slug field |
| "VIN must be exactly 17 characters" | Check VIN length and format |
| "Price must be a positive number" | Enter a number greater than 0 |
| "Signature shot is required" | Upload a hero image |

### Images Won't Upload

**Troubleshooting Steps:**
1. Check image file size (keep under 2MB each)
2. Try uploading fewer images at once (10 instead of 30)
3. Check internet connection
4. Try a different browser
5. Clear browser cache and retry

### Preview Button Not Working

**Cause:** Slug not generated or invalid preview configuration

**Solution:**
1. Ensure Slug field is filled (click "Generate")
2. Save/publish the document first
3. Refresh the page
4. Try preview again

### Changes Not Appearing on Website

**Solution:**
1. Ensure you clicked **"Publish"** (not just saved draft)
2. Wait 60 seconds for ISR revalidation
3. Hard refresh the browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
4. Check if vehicle status is "Current" (not "Sold" or "Draft")

### Can't Find a Vehicle

**Solution:**
1. Check which view you're in:
   - Drafts only show unpublished work
   - Current Inventory only shows status: "current"
   - Sold Vehicles only shows status: "sold"
2. Try "All Vehicles" view for complete list
3. Use search bar at top (search by title, VIN, stock number)

### Lost Work / Accidental Changes

**Solution:**
1. Click document history icon (clock icon, top right)
2. Browse previous versions
3. Click "Restore" on the version you want
4. Publish to make it live again

---

## Tips for Efficiency

1. **Use Templates** - Start with the correct body style template
2. **Bulk Upload First** - Upload all images at once, then organize
3. **Copy Similar Vehicles** - Duplicate a similar vehicle and edit
4. **Keyboard Shortcuts:**
   - `Ctrl+S` / `Cmd+S` - Save
   - `Ctrl+Alt+N` / `Cmd+Opt+N` - New document
   - `Ctrl+P` / `Cmd+P` - Publish
5. **Set Hotspots** - Click uploaded images to set focal points for better cropping

---

## Support

**Questions or Issues?**
- Contact development team
- Refer to this guide first
- Check the "?" help icons throughout the Studio interface

**Document Version:** 1.0
**Created for:** Story 3.6 - Sanity Studio Workflow & Editor Training
