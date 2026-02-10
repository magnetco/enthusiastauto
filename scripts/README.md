# Scripts Directory

Utility scripts for the Enthusiast Auto Group project.

---

## Vehicle Inventory Sync Scripts

**NEW:** Complete solution for syncing vehicle inventory from the live Webflow site to Sanity CMS.

### Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure Sanity credentials
cp .env.example .env
# Edit .env with your Sanity credentials

# 3. Scrape live site
python3 scrape_inventory.py

# 4. Sync to Sanity
python3 sync_to_sanity.py --dry-run  # Preview first
python3 sync_to_sanity.py            # Apply changes
```

### Scripts

- **`scrape_inventory.py`** - Scrape vehicle data from live Webflow site
- **`sync_to_sanity.py`** - Upload scraped data and images to Sanity CMS
- **`compare_inventory.py`** - Generate diff reports between live and Sanity

### Documentation

See **[README-INVENTORY.md](./README-INVENTORY.md)** for complete documentation including:
- Detailed setup instructions
- Usage examples and options
- Data mapping reference
- Troubleshooting guide
- Best practices

---

## Blog Import Scripts

### `import-blog-stories-detailed.py`

Python script to import blog stories and images from enthusiastauto.com.

**Features:**
- Fetches blog listing from https://www.enthusiastauto.com/under-the-hood
- Extracts story URLs and visits each page individually
- Scrapes title, date, excerpt, category, and featured images
- Downloads images to `website/public/blog-images/`
- Saves structured data to `blog-stories-detailed.json`

**Usage:**
```bash
# Install dependencies
pip install requests beautifulsoup4

# Run the script
python3 scripts/import-blog-stories-detailed.py
```

**Output Files:**
- `blog-stories-detailed.json` - Structured story data
- `website/public/blog-images/*.{avif,jpg}` - Downloaded images

**Data Structure:**
```json
{
  "extracted_at": "2026-02-09T14:45:19.124794",
  "source_url": "https://www.enthusiastauto.com/under-the-hood",
  "total_stories": 8,
  "stories": [
    {
      "title": "Story Title",
      "slug": "story-slug",
      "excerpt": "Story excerpt...",
      "content": "Full content...",
      "date": "January 30, 2025",
      "category": "Around The Shop",
      "url": "https://www.enthusiastauto.com/under-the-hood/story-slug",
      "image_url": "https://cdn.prod.website-files.com/...",
      "local_image": "blog-images/story-slug.avif"
    }
  ]
}
```

---

## Import Summary

See `BLOG-IMPORT-SUMMARY.md` for a complete summary of the imported stories and images.

**Last Import:** February 9, 2026  
**Stories Imported:** 8  
**Images Downloaded:** 8 (1.7 MB total)

---

## Next Steps

1. **Import to Sanity CMS:**
   - Create migration script to import from JSON
   - Upload images to Sanity CDN
   - Map fields to Sanity blog post schema

2. **Update Website:**
   - Ensure blog components can display imported stories
   - Add proper routing for blog posts
   - Implement category filtering

3. **SEO Optimization:**
   - Add meta tags and Open Graph data
   - Generate sitemap entries
   - Add JSON-LD structured data
