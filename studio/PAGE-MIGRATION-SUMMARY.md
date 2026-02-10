# Page Content Migration Summary

## What Was Created

### Sanity Studio

1. **Page Schema** (`studio/schemas/page.ts`)
   - Complete page content type with hero, SEO, and sections
   - Support for 13 page types (homepage, about, contact, etc.)
   - Prompt-based section configuration (no page builder needed)
   - Structured data (JSON-LD) support
   - Publishing workflow

2. **Studio Structure** (updated)
   - Added "Page" to navigation with ComponentIcon
   - Sorts by page type by default

3. **Documentation**
   - `PAGE-CONTENT-GUIDE.md` - Comprehensive content management guide
   - `PAGE-IMPLEMENTATION.md` - Step-by-step implementation guide
   - `PAGE-MIGRATION-SUMMARY.md` - This file

### Frontend Utilities

1. **Queries** (`website/lib/sanity/queries/pages.ts`)
   - `getPageBySlug()` - Fetch page by URL slug
   - `getPageByType()` - Fetch page by type
   - `getAllPages()` - Get all pages (for sitemap)
   - `getPageSlugs()` - Get slugs for static generation
   - Full TypeScript types

2. **Components** (`website/components/shared/SectionRenderer.tsx`)
   - `SectionRenderer` - Renders individual sections
   - `SectionList` - Renders multiple sections
   - Component mapping system
   - Background color and padding utilities

3. **Metadata** (`website/lib/sanity/metadata.ts`)
   - `generatePageMetadata()` - Generate Next.js metadata
   - `generatePageMetadataWithFallback()` - With fallback support
   - Full Open Graph and Twitter card support

---

## Page Schema Features

### SEO Settings
- Meta title and description
- Open Graph title, description, and image
- Keywords array
- No-index flag
- Full social sharing support

### Hero Section
- Toggle on/off
- 4 size options (small, medium, large, full)
- Eyebrow text
- Title with optional highlight text
- Subtitle
- Background image (upload or URL)
- Overlay opacity control
- Up to 2 CTA buttons with variant styles

### Sections (Prompt-Based)
- Section ID (unique identifier)
- Component name (maps to React component)
- **Prompt** (natural language description)
- Enable/disable toggle
- Background color (5 options)
- Vertical padding (4 options)
- Sort order

### Additional Features
- Structured data (JSON-LD) field
- Published toggle
- Published date tracking
- Last updated timestamp
- Page type categorization

---

## How It Works

### Content Management Flow

```
1. Content Editor creates page in Sanity Studio
   ↓
2. Fills in SEO metadata
   ↓
3. Configures hero section
   ↓
4. Adds sections with prompts describing what to display
   ↓
5. Publishes page
   ↓
6. Frontend fetches page data via GROQ query
   ↓
7. SectionRenderer maps component names to React components
   ↓
8. Sections render with configured styling
   ↓
9. ISR revalidates every 60 seconds (or via webhook)
```

### Section Prompt Example

Instead of a visual page builder, content editors write prompts:

```
Prompt:
"Display the 4 most recent vehicles marked as 'featured' in a 
responsive grid (1 column on mobile, 2 on tablet, 4 on desktop). 
Each vehicle card should show: vehicle image with hover zoom, 
year/make/model/chassis, price, and 3 key features. Include a 
'View All Inventory' button below the grid linking to /vehicles."

Component: FeaturedVehicles
Background: White
Padding: Large
Sort Order: 1
```

The prompt serves as:
- **Documentation** for what the section should do
- **Specification** for developers building components
- **Context** for future editors understanding the page

---

## Pages to Migrate

### Static Pages (13 total)

| Page | Route | Priority | Complexity |
|------|-------|----------|------------|
| Homepage | `/` | High | Medium |
| About | `/about` | High | High |
| Contact | `/contact` | High | Medium |
| Services | `/services` | High | Low |
| Blog | `/blog` | Medium | Low |
| Vehicles | `/vehicles` | Medium | Low |
| Parts | `/parts` | Medium | Low |
| Merchandise | `/merchandise` | Low | Low |
| Sell | `/sell` | Medium | Medium |
| Search | `/search` | Low | Low |
| Privacy | `/privacy` | Low | Low |
| Terms | `/terms` | Low | Low |
| Custom | (any) | - | Varies |

### Dynamic Pages (NOT migrated)
These remain as-is, managed by their content types:
- `/vehicles/[slug]` - Vehicle schema
- `/blog/[slug]` - Post schema
- `/services/[slug]` - Service schema
- `/product/[handle]` - Shopify
- `/account/*` - Auth/database

---

## Implementation Options

### Option 1: Catch-All Route (Recommended)

**Pros:**
- Single implementation for all pages
- Automatic handling of new pages
- Consistent behavior
- Less code duplication

**Cons:**
- Requires careful slug management
- All pages must follow same structure

**Implementation:**
```typescript
// app/[page]/page.tsx
export default async function DynamicPage({ params }) {
  const page = await getPageBySlug(`/${params.page}`);
  return <PageRenderer page={page} />;
}
```

### Option 2: Individual Routes

**Pros:**
- More control per page
- Can mix CMS and hardcoded content
- Easier to test incrementally

**Cons:**
- More files to maintain
- Code duplication
- Harder to add new pages

**Implementation:**
```typescript
// app/about/page.tsx
export default async function AboutPage() {
  const page = await getPageBySlug("/about");
  return <PageRenderer page={page} />;
}
```

---

## Migration Strategy

### Phase 1: Foundation (Complete ✅)
- [x] Create page schema
- [x] Add to studio structure
- [x] Create frontend queries
- [x] Create SectionRenderer
- [x] Create metadata utilities
- [x] Write documentation

### Phase 2: Homepage (Priority 1)
- [ ] Create homepage document in Sanity
- [ ] Configure hero section
- [ ] Define sections with prompts
- [ ] Test on staging
- [ ] Deploy to production

### Phase 3: High-Priority Pages (Priority 2)
- [ ] About page
- [ ] Contact page
- [ ] Services page

### Phase 4: Medium-Priority Pages (Priority 3)
- [ ] Blog listing
- [ ] Vehicles listing
- [ ] Sell page

### Phase 5: Low-Priority Pages (Priority 4)
- [ ] Parts page
- [ ] Merchandise page
- [ ] Search page
- [ ] Privacy policy
- [ ] Terms of service

---

## Component Extraction Needed

These section components need to be extracted from existing pages:

### About Page
- `AboutStorySection` - Story content with timeline
- `AboutMissionSection` - Mission statement and values grid
- `AboutDifferentiatorsSection` - What sets us apart grid
- `AboutVisitSection` - Location, hours, contact cards

### Contact Page
- `QuickContactCards` - 4-column quick contact grid
- `ContactFormSection` - Form + info sidebar
- `DepartmentTeamsSection` - Department contact cards
- `FAQCTASection` - FAQ CTA banner

### Services Page
- `ServicesOverviewSection` - Services grid with descriptions

### Other Pages
- Most other pages use existing shared components
- May need minor adjustments for SectionRenderer

---

## Testing Checklist

### Sanity Studio
- [ ] Can create new page
- [ ] Can edit existing page
- [ ] Can upload hero images
- [ ] Can add/remove sections
- [ ] Can reorder sections
- [ ] Can toggle sections on/off
- [ ] Can publish/unpublish
- [ ] Preview works correctly

### Frontend
- [ ] Pages load without errors
- [ ] Hero sections display correctly
- [ ] Sections render in correct order
- [ ] Background colors are correct
- [ ] Spacing/padding is correct
- [ ] CTAs link correctly
- [ ] Images load properly
- [ ] Metadata appears in page source
- [ ] Open Graph tags work
- [ ] Structured data validates
- [ ] ISR revalidation works
- [ ] Webhook revalidation works

### SEO
- [ ] Meta titles are unique
- [ ] Meta descriptions are compelling
- [ ] Keywords are relevant
- [ ] Open Graph images work
- [ ] Twitter cards work
- [ ] Structured data validates
- [ ] No duplicate content
- [ ] Canonical URLs set

---

## Performance Considerations

### ISR Configuration
```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

### Webhook Revalidation
Set up Sanity webhook to trigger revalidation on publish:
```
POST https://enthusiastauto.com/api/revalidate
Body: { secret: "...", type: "page", slug: "/about" }
```

### Image Optimization
- Use next/image for all images
- Provide width/height or use fill
- Set priority for above-the-fold images
- Use Sanity CDN for uploaded images

### Code Splitting
- SectionRenderer lazy loads components
- Use dynamic imports for heavy components
- Implement Suspense boundaries

---

## Content Team Training

### Key Concepts
1. **Pages** = Static website pages (homepage, about, contact, etc.)
2. **Hero** = Large section at top of page with image and CTAs
3. **Sections** = Individual content blocks on the page
4. **Prompts** = Natural language descriptions of what sections should display
5. **Published** = Toggle to make page live on website

### Common Tasks
- Update hero image
- Change hero text
- Add new section
- Reorder sections
- Hide section temporarily
- Update SEO metadata

### Best Practices
- Write clear, detailed prompts
- Use consistent section IDs (kebab-case)
- Keep hero titles concise
- Optimize images before uploading
- Test in preview before publishing

---

## Next Steps

1. **Create homepage document** in Sanity Studio
2. **Test on staging** environment
3. **Extract section components** as needed
4. **Implement catch-all route** or update individual routes
5. **Migrate remaining pages** in priority order
6. **Train content team** on CMS usage
7. **Set up webhooks** for instant revalidation
8. **Monitor performance** and Core Web Vitals
9. **Gather feedback** from content team
10. **Iterate and improve** based on usage

---

## Benefits

### For Content Editors
✅ Edit page content without code deployment
✅ Control hero sections (images, text, CTAs)
✅ Manage SEO metadata per page
✅ Toggle sections on/off for A/B testing
✅ Reorder sections without developer help
✅ Preview changes before publishing

### For Developers
✅ Centralized page management
✅ Consistent page structure
✅ Type-safe queries and components
✅ Easy to add new pages
✅ Reduced code duplication
✅ Better separation of concerns

### For Business
✅ Faster content updates (no deployment needed)
✅ Better SEO control
✅ A/B testing capabilities
✅ Reduced developer bottleneck
✅ Improved content workflow
✅ Scalable page management

---

## Questions?

- **Sanity Schema**: See `studio/schemas/page.ts`
- **Content Guide**: See `PAGE-CONTENT-GUIDE.md`
- **Implementation**: See `PAGE-IMPLEMENTATION.md`
- **Frontend Queries**: See `website/lib/sanity/queries/pages.ts`
- **Section Renderer**: See `website/components/shared/SectionRenderer.tsx`
