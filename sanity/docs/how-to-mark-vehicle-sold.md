# How to Mark a Vehicle as Sold

This guide explains how to update vehicle status in Sanity Studio to mark vehicles as sold. When you change a vehicle's status, the website automatically updates within 60 seconds.

## Step-by-Step Instructions

### 1. Open the Vehicle in Sanity Studio

1. Navigate to your Sanity Studio dashboard at: https://enthusiastauto.sanity.studio
2. Log in with your credentials
3. Click on **"Vehicle"** in the left sidebar
4. Find and click on the vehicle you want to mark as sold

### 2. Update the Status Field

1. Scroll to the **"Status"** field in the vehicle document
2. You'll see two radio button options:
   - **Current** - Vehicle is available for sale
   - **Sold** - Vehicle has been sold
3. Select **"Sold"** to mark the vehicle as sold

![Status Field Screenshot](./screenshots/vehicle-status-field.png)
_The Status field is located in the Status and Visibility section of the vehicle document._

### 3. Publish Your Changes

1. Click the **"Publish"** button in the bottom right corner
2. Wait for the confirmation message: "Document published"

### 4. Verify the Update on the Website

The website will automatically update within **60 seconds** after you publish the change.

**What happens when a vehicle is marked as sold:**

- ✅ Vehicle detail page shows a prominent "SOLD" badge
- ✅ Vehicle listing cards display "SOLD" overlay and badge
- ✅ Contact inquiry button is hidden on the vehicle detail page
- ✅ Vehicle is excluded from homepage featured sections
- ✅ "SOLD" badge appears in vehicle cards across the site

**Example of a sold vehicle:**

![Sold Vehicle Detail Page](./screenshots/sold-vehicle-detail.png)
_Vehicle detail page with SOLD badge and disabled contact button_

![Sold Vehicle Card](./screenshots/sold-vehicle-card.png)
_Vehicle listing card with SOLD overlay and badge_

## Expected Behavior

### Timing

- **Webhook Trigger:** Within 5 seconds of publishing
- **Website Update:** Within 60 seconds (usually much faster with webhook)
- **Fallback:** If webhook fails, ISR revalidation ensures update within 60 seconds

### Visual Changes

| Page Type | Change |
|-----------|--------|
| **Detail Page** | Red "SOLD" badge near title, contact button hidden, status shows "SOLD" |
| **Listing Page** | "SOLD" badge in top-right corner, semi-transparent overlay with "SOLD" text |
| **Homepage** | Vehicle removed from featured sections (if featured) |

## Troubleshooting

### Problem: Website hasn't updated after 2 minutes

**Solution:**
1. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check that you clicked **"Publish"** (not just "Save")
3. Verify the Status field is set to "Sold" in Sanity
4. Contact the development team if issue persists

### Problem: Vehicle still shows "Available" on website

**Possible Causes:**
- Changes were saved as a draft but not published
- Browser cache is showing old version
- Webhook delivery failed (rare)

**Solution:**
1. Open the vehicle in Sanity Studio
2. Check if there's a draft indicator (green dot next to Publish button)
3. If yes, click **"Publish"** to publish the draft
4. Wait 60 seconds and refresh the page

### Problem: Accidentally marked wrong vehicle as sold

**Solution:**
1. Open the vehicle in Sanity Studio
2. Change Status back to **"Current"**
3. Click **"Publish"**
4. Website will update within 60 seconds

## Technical Details

### How It Works

1. **Status Change:** You update the Status field and publish
2. **Webhook Trigger:** Sanity sends a webhook to the website API
3. **Revalidation:** Website clears cache for affected pages
4. **Update:** Next visitor sees the updated status

### Security

- Webhooks are cryptographically signed to prevent unauthorized updates
- Only authorized Sanity editors can change vehicle status
- All changes are logged in Sanity's revision history

### Pages Affected by Status Changes

When you mark a vehicle as sold, the following pages are automatically revalidated:

- `/vehicles/[vehicle-slug]` - The vehicle's detail page
- `/vehicles` - The main inventory listing page
- `/` - The homepage (if vehicle is featured)

## Best Practices

1. **Mark as sold immediately** after sale is finalized
2. **Verify the change** by visiting the vehicle page after 1-2 minutes
3. **Keep sold vehicles published** for historical records and SEO
4. **Don't delete sold vehicles** - use the Status field instead

## Need Help?

If you encounter any issues or have questions about marking vehicles as sold:

- **Email:** support@enthusiastauto.com
- **Slack:** #website-support channel
- **Phone:** (555) 123-4567

## Additional Resources

- [Sanity Studio Training Videos](link-to-training)
- [Vehicle Management Best Practices](link-to-best-practices)
- [Website Status Dashboard](link-to-dashboard)
