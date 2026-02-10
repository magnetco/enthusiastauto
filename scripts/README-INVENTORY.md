# Vehicle Inventory Sync Scripts

Python scripts to scrape vehicle inventory data from the live EnthusiastAuto.com (Webflow) site and sync it to the development Sanity CMS, including images, specifications, descriptions, and all metadata.

---

## Overview

These scripts provide a complete solution for keeping your development Sanity CMS in sync with the live Webflow site:

1. **`scrape_inventory.py`** - Scrapes all vehicle data from the live site
2. **`sync_to_sanity.py`** - Uploads scraped data and images to Sanity CMS
3. **`compare_inventory.py`** - Generates diff reports between live and Sanity

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Live Site (Webflow)                       │
│              https://www.enthusiastauto.com                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ scrape_inventory.py
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  inventory_data.json                         │
│                  vehicle-images/                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├─── compare_inventory.py ──> Reports
                       │
                       │ sync_to_sanity.py
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Sanity CMS (Dev)                          │
│              Vehicle documents + images                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Setup

### 1. Install Python Dependencies

```bash
cd scripts
pip install -r requirements.txt
```

**Dependencies:**
- `requests` - HTTP requests
- `beautifulsoup4` - HTML parsing
- `python-dotenv` - Environment variables
- `rich` - Beautiful console output (optional)

### 2. Configure Sanity Credentials

Copy the example environment file and fill in your Sanity credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Sanity configuration:

```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token
SANITY_API_VERSION=2021-06-07
```

**How to get your Sanity API token:**
1. Go to https://www.sanity.io/manage
2. Select your project
3. Navigate to "API" → "Tokens"
4. Create a new token with "Editor" or "Administrator" permissions
5. Copy the token to your `.env` file

### 3. Verify Setup

Test your configuration by running the comparison script (read-only):

```bash
python3 compare_inventory.py
```

If you see errors about missing configuration, double-check your `.env` file.

---

## Usage

### Full Sync Workflow

The recommended workflow for a complete sync:

```bash
# 1. Scrape live site
python3 scrape_inventory.py

# 2. Review differences (optional)
python3 compare_inventory.py --format html

# 3. Dry-run sync to preview changes
python3 sync_to_sanity.py --dry-run

# 4. Apply changes to Sanity
python3 sync_to_sanity.py
```

### Script 1: `scrape_inventory.py`

Scrapes vehicle data from the live Webflow site.

**Basic usage:**
```bash
python3 scrape_inventory.py
```

**Options:**
```bash
# Limit to first 5 vehicles (for testing)
python3 scrape_inventory.py --limit 5

# Only scrape current inventory (exclude sold)
python3 scrape_inventory.py --status current

# Only scrape sold vehicles
python3 scrape_inventory.py --status sold

# Scrape all vehicles (default)
python3 scrape_inventory.py --status all
```

**Output:**
- `inventory_data.json` - Structured vehicle data
- `vehicle-images/` - Downloaded images

**What it scrapes:**
- Basic info: title, year, model, chassis, VIN, stock number
- Pricing: list price or "call for price" flag
- Specifications: mileage, transmission, engine code, colors
- Status: current/sold/sale-pending, badges
- Content: highlights, overview, history
- Images: signature shot + gallery images

**Performance:**
- Rate limited to ~1.5 seconds per vehicle
- 117 vehicles takes approximately 3-5 minutes
- Images are downloaded in parallel

### Script 2: `sync_to_sanity.py`

Uploads scraped data and images to Sanity CMS.

**Basic usage:**
```bash
# Dry-run (preview changes without applying)
python3 sync_to_sanity.py --dry-run

# Apply changes
python3 sync_to_sanity.py
```

**Options:**
```bash
# Sync only E92 chassis vehicles
python3 sync_to_sanity.py --chassis E92

# Sync specific vehicles by slug
python3 sync_to_sanity.py --slugs 2013-bmw-e92-m3-lrpe,2002-bmw-e52-z8

# Limit to first 10 vehicles
python3 sync_to_sanity.py --limit 10

# Combine options
python3 sync_to_sanity.py --chassis E92 --limit 5 --dry-run
```

**What it does:**
1. Checks if each vehicle exists in Sanity (by slug)
2. Uploads signature shot to Sanity CDN
3. Uploads gallery images to Sanity CDN
4. Creates or updates vehicle document with all fields
5. Maps scraped data to Sanity schema

**Safety features:**
- `--dry-run` flag to preview changes
- Validates required fields before upload
- Continues on image upload failures
- Rate limited to respect Sanity API limits

**Performance:**
- Rate limited to ~1 second per vehicle
- Image uploads add ~0.2 seconds per image
- 117 vehicles with images takes approximately 10-15 minutes

### Script 3: `compare_inventory.py`

Generates diff reports between live site and Sanity CMS.

**Basic usage:**
```bash
# Console output (default)
python3 compare_inventory.py

# JSON output
python3 compare_inventory.py --format json

# HTML report
python3 compare_inventory.py --format html

# All formats
python3 compare_inventory.py --format all
```

**Output:**
- Console: Formatted text report
- `inventory_comparison.json` - Machine-readable diff
- `inventory_comparison.html` - Visual HTML report

**What it compares:**
- Vehicles missing in Sanity
- Vehicles missing on live site (likely sold)
- Field-by-field differences for common vehicles
- Image presence and gallery counts

**Example output:**
```
INVENTORY COMPARISON REPORT
Generated: 2026-02-09 15:30:00

SUMMARY:
  Live Site: 117 vehicles
  Sanity CMS: 105 vehicles
  Missing in Sanity: 15 vehicles
  Missing on Live: 3 vehicles (likely sold)
  Mismatched Data: 8 vehicles

MISSING IN SANITY:
  1. 2013 BMW E92 M3 LRPE ($249,490)
     Slug: 2013-bmw-e92-m3-lrpe
     VIN: ...
     Status: Current Inventory
```

---

## Data Mapping

### Scraped Data → Sanity Schema

| Scraped Field | Sanity Field | Notes |
|---------------|--------------|-------|
| `slug` | `slug.current` | URL-friendly identifier |
| `listingTitle` | `listingTitle` | Full vehicle title |
| `year` | Extracted from title | Not stored separately |
| `chassis` | `chassis` | E39, E92, F80, etc. |
| `model` | Extracted from title | M3, M5, Z8, etc. |
| `vin` | `vin` | 17-character VIN |
| `stockNumber` | `stockNumber` | Last 7 of VIN |
| `listingPrice` | `listingPrice` | USD price |
| `showCallForPrice` | `showCallForPrice` | Boolean flag |
| `mileage` | `mileage` | Odometer reading |
| `transmission` | `transmission` | Manual, DCT, etc. |
| `engineCode` | `engineCodes[]` | S65, S62, etc. |
| `engineSize` | `engineSize` | V8, I6, etc. |
| `exteriorColor` | `exteriorColor` | Color name |
| `interiorColor` | `interiorColor` | Color + material |
| `status` | `status` | current, sold |
| `badges` | `statusTag` | New Arrival, etc. |
| `highlights[]` | `highlights` | Portable Text (bullets) |
| `overview` | `overview` | Portable Text (paragraphs) |
| `history` | `history` | Portable Text (paragraphs) |
| `images.signatureShot` | `signatureShot` | Main listing image |
| `images.gallery[]` | `galleryExterior[]`, `galleryInterior[]`, etc. | Categorized gallery |

### Content Conversion

**Plain text → Portable Text:**
- Paragraphs split by `\n\n`
- Each paragraph becomes a block
- Preserves line breaks and formatting

**List items → Portable Text:**
- Each item becomes a bullet block
- Maintains list structure
- Supports nested content

---

## Troubleshooting

### "SANITY_PROJECT_ID not set"

**Problem:** Missing environment variables

**Solution:**
1. Copy `.env.example` to `.env`
2. Fill in your Sanity credentials
3. Make sure `.env` is in the `scripts/` directory

### "Input file not found: inventory_data.json"

**Problem:** Haven't run the scraper yet

**Solution:**
```bash
python3 scrape_inventory.py
```

### "Failed to download image"

**Problem:** Network issues or rate limiting

**Solution:**
- Check your internet connection
- The script will continue with other images
- Re-run the sync to retry failed images

### "Error syncing vehicle: 401 Unauthorized"

**Problem:** Invalid or expired Sanity API token

**Solution:**
1. Generate a new token at https://www.sanity.io/manage
2. Update your `.env` file
3. Make sure the token has "Editor" permissions

### "Error syncing vehicle: 429 Too Many Requests"

**Problem:** Exceeded Sanity API rate limits

**Solution:**
- The script includes rate limiting, but you may need to increase delays
- Wait a few minutes and try again
- Consider syncing in smaller batches with `--limit`

### Scraper finds 0 vehicles

**Problem:** Webflow site structure changed

**Solution:**
1. Check if the live site is accessible
2. The HTML structure may have changed - script may need updates
3. Try with `--limit 1` to debug a single vehicle

---

## Advanced Usage

### Selective Sync Strategies

**Sync only new vehicles:**
```bash
# 1. Compare to find missing vehicles
python3 compare_inventory.py --format json

# 2. Extract slugs from JSON (manual or script)
# 3. Sync only those vehicles
python3 sync_to_sanity.py --slugs slug1,slug2,slug3
```

**Sync by chassis code:**
```bash
# Sync all E92 M3s
python3 sync_to_sanity.py --chassis E92

# Sync all F80 M3s
python3 sync_to_sanity.py --chassis F80
```

**Update existing vehicles:**
```bash
# Re-sync all vehicles (updates existing)
python3 sync_to_sanity.py
```

### Automated Scheduling

**Daily sync with cron:**
```bash
# Edit crontab
crontab -e

# Add daily sync at 2 AM
0 2 * * * cd /path/to/scripts && python3 scrape_inventory.py && python3 sync_to_sanity.py
```

**Weekly comparison report:**
```bash
# Add weekly report on Mondays at 9 AM
0 9 * * 1 cd /path/to/scripts && python3 compare_inventory.py --format html
```

### Batch Processing

**Process in batches of 10:**
```bash
# Batch 1
python3 sync_to_sanity.py --limit 10

# Batch 2 (modify script to add --offset flag if needed)
# Or use --slugs with specific vehicles
```

---

## File Structure

```
scripts/
├── scrape_inventory.py          # Scraper script
├── sync_to_sanity.py             # Sync script
├── compare_inventory.py          # Comparison script
├── requirements.txt              # Python dependencies
├── .env.example                  # Environment template
├── .env                          # Your credentials (gitignored)
├── README-INVENTORY.md           # This file
├── inventory_data.json           # Scraped data (generated)
├── inventory_comparison.json     # Diff report (generated)
├── inventory_comparison.html     # HTML report (generated)
└── vehicle-images/               # Downloaded images (generated)
    ├── 2013-bmw-e92-m3-lrpe-signature.jpg
    ├── 2013-bmw-e92-m3-lrpe-gallery-0.jpg
    └── ...
```

---

## Best Practices

### Before Running in Production

1. **Test with limits:**
   ```bash
   python3 scrape_inventory.py --limit 5
   python3 sync_to_sanity.py --limit 5 --dry-run
   ```

2. **Review comparison report:**
   ```bash
   python3 compare_inventory.py --format html
   ```

3. **Backup Sanity data:**
   - Export current dataset before major syncs
   - Use Sanity Studio's export feature

4. **Verify in Sanity Studio:**
   - Check a few vehicles manually
   - Verify images display correctly
   - Test vehicle pages on dev site

### Regular Maintenance

- **Weekly:** Run comparison report to catch drift
- **Monthly:** Full re-sync to ensure data accuracy
- **After live site updates:** Re-scrape and sync
- **Before deployments:** Verify data consistency

### Performance Optimization

- Use `--chassis` to sync specific models
- Use `--limit` for testing and debugging
- Run during off-peak hours for large syncs
- Monitor Sanity API usage in dashboard

---

## Data Quality

### Validation

The scripts include validation for:
- VIN format (17 characters, valid pattern)
- Price ranges (positive numbers)
- Required fields (title, slug, chassis)
- Image URLs (valid and accessible)

### Known Limitations

1. **Year extraction:** Parsed from title, may fail for unusual formats
2. **Model extraction:** Uses regex patterns, may miss custom models
3. **Body style:** Not reliably extracted, may need manual entry
4. **Drive type:** Not available on live site, defaults required
5. **Engine details:** Limited to what's visible on live site

### Manual Review Recommended

After syncing, manually review in Sanity Studio:
- Body style (Sedan, Coupe, Convertible)
- Drive type (RWD, AWD)
- Engine type (Gasoline, Diesel, Hybrid)
- Featured flags (featuredVehicle, featuredInventory)
- Sort order for featured lists

---

## Security

### API Tokens

- **Never commit `.env` to git** (already in `.gitignore`)
- Use tokens with minimum required permissions
- Rotate tokens periodically
- Use separate tokens for dev/production

### Rate Limiting

- Scripts include delays to respect rate limits
- Webflow: 1.5 seconds between vehicles
- Sanity: 0.2 seconds between images, 1 second between vehicles
- Adjust if you encounter 429 errors

### Data Privacy

- Downloaded images are stored locally temporarily
- VINs and personal data are handled securely
- Clean up `vehicle-images/` after successful sync if desired

---

## Support

### Common Issues

See the [Troubleshooting](#troubleshooting) section above.

### Getting Help

1. Check script output for error messages
2. Review generated JSON files for data issues
3. Verify Sanity Studio for uploaded data
4. Check Sanity API logs in dashboard

### Reporting Bugs

When reporting issues, include:
- Script output (full error messages)
- Python version (`python3 --version`)
- Dependency versions (`pip list`)
- Example vehicle slug that failed
- Steps to reproduce

---

## Future Enhancements

Potential improvements for future versions:

- [ ] Resume capability for interrupted syncs
- [ ] Incremental sync (only changed vehicles)
- [ ] Webhook integration for real-time sync
- [ ] Better error recovery and retry logic
- [ ] Progress bars with `rich` library
- [ ] Parallel image downloads
- [ ] Database for sync history
- [ ] Rollback capability
- [ ] Automated testing suite
- [ ] Docker containerization

---

## License

Internal use only for Enthusiast Auto Group.

---

## Changelog

### Version 1.0.0 (2026-02-09)

Initial release with:
- Complete scraping of live Webflow site
- Full sync to Sanity CMS with images
- Comparison reports in multiple formats
- Comprehensive documentation
- Error handling and rate limiting
- Dry-run mode for safety
