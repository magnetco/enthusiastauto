# Quick Start: Page Management in Sanity

## 5-Minute Setup

### 1. Start Sanity Studio
```bash
cd studio
pnpm dev
```
Open http://localhost:5040

### 2. Create Your First Page (Homepage)

1. Click **"Page"** in sidebar
2. Click **"Create"** button
3. Fill in:
   - **Title**: Homepage
   - **Slug**: Click "Generate" → should be `/`
   - **Page Type**: Homepage

4. **SEO Settings** (expand):
   ```
   Meta Title: Enthusiast Auto | The Leading BMW Preservation Facility
   Meta Description: The leading BMW preservation facility. Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles.
   Keywords: BMW, M-Series, preservation, Cincinnati, enthusiast
   ```

5. **Hero Section** (expand):
   - **Show Hero**: Toggle ON
   - **Size**: Full Screen
   - **Title**: The Leading BMW Preservation Facility
   - **Subtitle**: Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles.
   - **Background Image URL**: https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083
   - **Overlay**: 50
   - **CTAs**: Add 2 buttons:
     - Button 1: "View Inventory" → `/vehicles` → Primary
     - Button 2: "Our Services" → `/services` → Outline

6. **Sections** (expand):
   Click "Add item" 4 times and fill in:

   **Section 1:**
   ```
   Section ID: featured-vehicles
   Component Name: FeaturedVehicles
   Prompt: Display the 4 most recent vehicles marked as "featured" in a responsive grid (1 column mobile, 2 tablet, 4 desktop). Each vehicle card shows: signature shot image, year/make/model, price, and 3 key features. Include "View All Inventory" button linking to /vehicles.
   Enabled: ON
   Background Color: White
   Vertical Padding: Large
   Sort Order: 10
   ```

   **Section 2:**
   ```
   Section ID: services-section
   Component Name: ServicesSection
   Prompt: Display all 4 services in a numbered grid (01-04) on dark background. Each service shows number, title, description, and "Learn More" link.
   Enabled: ON
   Background Color: Navy Primary
   Vertical Padding: Large
   Sort Order: 20
   ```

   **Section 3:**
   ```
   Section ID: featured-blog-posts
   Component Name: FeaturedBlogPostsWrapper
   Prompt: Show the 3 most recent featured blog posts in a 3-column grid. Each card displays: featured image, category, title, excerpt, and date.
   Enabled: ON
   Background Color: White
   Vertical Padding: Large
   Sort Order: 30
   ```

   **Section 4:**
   ```
   Section ID: about-section
   Component Name: AboutSection
   Prompt: Display company overview with mission statement and "Learn More" button linking to /about.
   Enabled: ON
   Background Color: Neutral 50
   Vertical Padding: Large
   Sort Order: 40
   ```

7. **Published**: Toggle ON

8. **Save** (Cmd/Ctrl + S)

### 3. Test on Frontend

The page is now ready! To see it on the website, you'll need to implement the frontend integration (see PAGE-IMPLEMENTATION.md).

---

## Next Pages to Create

### About Page
```yaml
Title: About Us
Slug: /about
Page Type: About
Hero: Medium size, "Built by Enthusiasts For Enthusiasts"
Sections: AboutStorySection, AboutMissionSection, AboutDifferentiatorsSection, AboutVisitSection
```

### Contact Page
```yaml
Title: Contact Us
Slug: /contact
Page Type: Contact
Hero: Medium size, "We're Here to Help Let's Connect"
Sections: QuickContactCards, ContactFormSection, DepartmentTeamsSection, FAQCTASection
```

---

## Common Tasks

### Update Hero Image
1. Open page document
2. Scroll to "Hero Section"
3. Upload new image or paste URL
4. Save

### Add New Section
1. Scroll to "Page Sections"
2. Click "Add item"
3. Fill in all fields
4. Save

### Reorder Sections
1. Change "Sort Order" numbers (lower = higher)
2. Save

### Hide Section Temporarily
1. Toggle "Enabled" OFF
2. Save

---

## Tips

✅ **Use increments of 10** for sort order (10, 20, 30) to leave room for inserting sections later

✅ **Write detailed prompts** - The more specific, the better

✅ **Preview before publishing** - Use Sanity's preview mode

✅ **Keep titles concise** - Hero titles should be short and impactful

✅ **Optimize images** - Compress before uploading or use Unsplash URLs

---

## Full Documentation

- **Content Guide**: `studio/PAGE-CONTENT-GUIDE.md`
- **Implementation**: `studio/PAGE-IMPLEMENTATION.md`
- **Examples**: `studio/PAGE-EXAMPLES.md`
- **Migration**: `studio/PAGE-MIGRATION-SUMMARY.md`
- **Overview**: `SANITY-PAGE-MANAGEMENT.md`

---

## Support

Questions? See the full documentation or contact your dev team.
