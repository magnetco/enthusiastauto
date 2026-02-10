# Page Content Implementation Guide

Step-by-step guide for implementing Sanity CMS page management on the frontend.

---

## Overview

This guide shows how to:
1. Create page documents in Sanity for existing frontend pages
2. Update frontend routes to fetch from Sanity
3. Migrate hardcoded content to CMS

---

## Step 1: Create Page Documents in Sanity

For each static page, create a corresponding page document in Sanity Studio.

### Homepage (`/`)

```yaml
Title: Homepage
Slug: /
Page Type: Homepage

SEO:
  Meta Title: "Enthusiast Auto | The Leading BMW Preservation Facility"
  Meta Description: "The leading BMW preservation facility. Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles."
  OG Image: [upload or select]
  Keywords: ["BMW", "M-Series", "preservation", "Cincinnati", "enthusiast"]

Hero:
  Show Hero: true
  Size: Full Screen
  Eyebrow: "Enthusiast Auto Group"
  Title: "The Leading BMW\nPreservation Facility"
  Title Highlight: "Preservation Facility"
  Subtitle: "Specializing in the acquisition, restoration, and preservation of iconic BMW automobiles."
  Background Image URL: https://images.unsplash.com/photo-1492144534655-ae79c964c9d7
  Overlay: 50
  CTAs:
    - Label: "View Inventory", URL: "/vehicles", Style: Primary
    - Label: "Our Services", URL: "/services", Style: Outline

Sections:
  1. Featured Vehicles
     - Section ID: featured-vehicles
     - Component: FeaturedVehicles
     - Prompt: "Display the 4 most recent vehicles marked as 'featured' in a responsive grid..."
     - Background: White
     - Padding: Large
     - Sort Order: 1
     
  2. Services Section
     - Section ID: services-section
     - Component: ServicesSection
     - Prompt: "Display all 4 services in a numbered grid (01-04)..."
     - Background: Navy Primary
     - Padding: Large
     - Sort Order: 2
     
  3. Featured Blog Posts
     - Section ID: featured-blog-posts
     - Component: FeaturedBlogPostsWrapper
     - Prompt: "Show the 3 most recent featured blog posts..."
     - Background: White
     - Padding: Large
     - Sort Order: 3
     
  4. About Section
     - Section ID: about-section
     - Component: AboutSection
     - Prompt: "Display company overview with mission statement..."
     - Background: Neutral 50
     - Padding: Large
     - Sort Order: 4

Published: true
```

### About Page (`/about`)

```yaml
Title: About Us
Slug: /about
Page Type: About

SEO:
  Meta Title: "About | Enthusiast Auto Group"
  Meta Description: "Learn about Enthusiast Auto Group - Cincinnati's premier destination for BMW M-Series vehicles, services, and community."
  Keywords: ["about", "BMW dealer", "Cincinnati", "M-Series", "history"]

Hero:
  Show Hero: true
  Size: Medium
  Eyebrow: "Enthusiast Auto Group"
  Title: "Built by Enthusiasts\nFor Enthusiasts"
  Title Highlight: "For Enthusiasts"
  Subtitle: "Cincinnati's premier destination for BMW M-Series vehicles, expert service, and a passionate community."
  Background Image URL: https://images.unsplash.com/photo-1492144534655-ae79c964c9d7
  CTAs:
    - Label: "View Inventory", URL: "/vehicles", Style: Primary
    - Label: "Our Services", URL: "/services", Style: Outline

Sections:
  1. Our Story
     - Section ID: our-story
     - Component: AboutStorySection
     - Prompt: "Two-column layout with story text and timeline cards..."
     - Background: White
     - Padding: Large
     - Sort Order: 1
     
  2. Mission & Values
     - Section ID: mission-values
     - Component: AboutMissionSection
     - Prompt: "Dark section with mission blockquote and 3-column values grid..."
     - Background: Navy Primary
     - Padding: Large
     - Sort Order: 2
     
  3. What Sets Us Apart
     - Section ID: differentiators
     - Component: AboutDifferentiatorsSection
     - Prompt: "2x2 grid of differentiators with numbered cards..."
     - Background: White
     - Padding: Large
     - Sort Order: 3
     
  4. Visit Us
     - Section ID: visit-us
     - Component: AboutVisitSection
     - Prompt: "Location, hours, and contact cards with map and CTA banner..."
     - Background: Neutral 50
     - Padding: Large
     - Sort Order: 4

Published: true
```

### Contact Page (`/contact`)

```yaml
Title: Contact Us
Slug: /contact
Page Type: Contact

SEO:
  Meta Title: "Contact Us | Enthusiast Auto"
  Meta Description: "Get in touch with Enthusiast Auto Group. Located in Cincinnati, OH."
  Keywords: ["contact", "Cincinnati", "BMW dealer", "phone", "email"]

Hero:
  Show Hero: true
  Size: Medium
  Eyebrow: "Contact Us"
  Title: "We're Here to Help\nLet's Connect"
  Title Highlight: "Let's Connect"
  Subtitle: "Whether you're shopping for your next BMW, need expert service, or have questions about parts – our team is ready to assist."
  Background Image URL: https://images.unsplash.com/photo-1621839673705-6617adf9e890

Sections:
  1. Quick Contact Cards
     - Section ID: quick-contact-cards
     - Component: QuickContactCards
     - Prompt: "4-column grid of quick contact options (Sales, Service, Parts, Sell)..."
     - Background: White
     - Padding: Medium
     - Sort Order: 1
     
  2. Contact Form & Info
     - Section ID: contact-form-section
     - Component: ContactFormSection
     - Prompt: "Two-column layout: contact form (left) and contact info card with map (right)..."
     - Background: White
     - Padding: Large
     - Sort Order: 2
     
  3. Department Teams
     - Section ID: department-teams
     - Component: DepartmentTeamsSection
     - Prompt: "3-column grid of department contact cards (Sales, Service, Parts)..."
     - Background: White
     - Padding: Large
     - Sort Order: 3
     
  4. FAQ CTA
     - Section ID: faq-cta
     - Component: FAQCTASection
     - Prompt: "Centered CTA banner promoting FAQ or quick answers..."
     - Background: White
     - Padding: Medium
     - Sort Order: 4

Published: true
```

---

## Step 2: Update Frontend Routes

### Option A: Dynamic Catch-All Route (Recommended)

Create a catch-all route that fetches page data from Sanity:

```typescript
// app/[page]/page.tsx
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/sanity/queries/pages";
import { generatePageMetadata } from "@/lib/sanity/metadata";
import { PageHero } from "@/components/shared/PageHero";
import { SectionList } from "@/components/shared/SectionRenderer";

// ISR Configuration
export const revalidate = 60;

// Generate static params for all pages
export async function generateStaticParams() {
  const { getPageSlugs } = await import("@/lib/sanity/queries/pages");
  const slugs = await getPageSlugs();
  
  return slugs
    .filter((slug) => slug !== "/") // Exclude homepage
    .map((slug) => ({
      page: slug.replace("/", ""),
    }));
}

// Generate metadata
export async function generateMetadata({ params }: { params: { page: string } }) {
  const slug = `/${params.page}`;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  return generatePageMetadata(page);
}

// Page component
export default async function DynamicPage({ params }: { params: { page: string } }) {
  const slug = `/${params.page}`;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      {page.hero?.enabled && (
        <PageHero
          size={page.hero.size}
          eyebrow={page.hero.eyebrow}
          title={page.hero.title}
          titleHighlight={page.hero.titleHighlight}
          subtitle={page.hero.subtitle}
          backgroundImage={page.hero.backgroundImage || page.hero.backgroundImageUrl}
          ctas={page.hero.ctas}
        />
      )}

      {/* Dynamic Sections */}
      <SectionList sections={page.sections} />

      {/* Structured Data */}
      {page.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.structuredData }}
        />
      )}
    </>
  );
}
```

### Option B: Individual Route Updates

Update each existing page file to fetch from Sanity:

```typescript
// app/about/page.tsx
import { getPageBySlug } from "@/lib/sanity/queries/pages";
import { generatePageMetadata } from "@/lib/sanity/metadata";
import { PageHero } from "@/components/shared/PageHero";
import { SectionList } from "@/components/shared/SectionRenderer";

export const revalidate = 60;

export async function generateMetadata() {
  const page = await getPageBySlug("/about");
  return generatePageMetadata(page);
}

export default async function AboutPage() {
  const page = await getPageBySlug("/about");

  if (!page) {
    // Fallback to hardcoded content
    return <HardcodedAboutPage />;
  }

  return (
    <>
      {page.hero?.enabled && (
        <PageHero
          size={page.hero.size}
          eyebrow={page.hero.eyebrow}
          title={page.hero.title}
          titleHighlight={page.hero.titleHighlight}
          subtitle={page.hero.subtitle}
          backgroundImage={page.hero.backgroundImage || page.hero.backgroundImageUrl}
          ctas={page.hero.ctas}
        />
      )}

      <SectionList sections={page.sections} />

      {page.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.structuredData }}
        />
      )}
    </>
  );
}
```

---

## Step 3: Extract Section Components

For pages with complex hardcoded sections, extract them into reusable components.

### Example: About Page Story Section

**Before (hardcoded in page.tsx):**
```tsx
// app/about/page.tsx
<section className="bg-white py-16 sm:py-20 lg:py-24">
  <div className="mx-auto max-w-[var(--container-max)] px-page-x">
    <TitleBlock title="Our Story" description="..." />
    <div className="grid gap-12 lg:grid-cols-2">
      {/* Story content */}
    </div>
  </div>
</section>
```

**After (extracted component):**
```tsx
// components/about/AboutStorySection.tsx
export function AboutStorySection() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-page-x">
      <TitleBlock title="Our Story" description="..." />
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Story content */}
      </div>
    </div>
  );
}

// Add to SectionRenderer.tsx
const COMPONENT_MAP = {
  // ...
  AboutStorySection,
};
```

---

## Step 4: Migration Checklist

### Phase 1: Setup (Complete ✅)
- [x] Create page schema in Sanity
- [x] Add to studio structure
- [x] Create frontend queries
- [x] Create SectionRenderer component
- [x] Create metadata utilities

### Phase 2: Create Page Documents
- [ ] Homepage
- [ ] About
- [ ] Contact
- [ ] Services (overview)
- [ ] Blog (listing)
- [ ] Vehicles (listing)
- [ ] Parts
- [ ] Merchandise
- [ ] Sell
- [ ] Privacy Policy
- [ ] Terms of Service

### Phase 3: Extract Components
- [ ] AboutStorySection
- [ ] AboutMissionSection
- [ ] AboutDifferentiatorsSection
- [ ] AboutVisitSection
- [ ] QuickContactCards
- [ ] ContactFormSection
- [ ] DepartmentTeamsSection
- [ ] FAQCTASection

### Phase 4: Update Routes
- [ ] Implement catch-all route OR
- [ ] Update individual page files
- [ ] Test each page
- [ ] Verify metadata
- [ ] Check structured data

### Phase 5: Testing
- [ ] Verify all pages load correctly
- [ ] Check SEO meta tags in page source
- [ ] Test hero sections
- [ ] Test section toggling (enable/disable)
- [ ] Test section reordering
- [ ] Verify ISR revalidation
- [ ] Test preview mode

### Phase 6: Cleanup
- [ ] Remove hardcoded content from page files
- [ ] Archive old page components (if needed)
- [ ] Update documentation
- [ ] Train content team on CMS

---

## Step 5: Testing

### Manual Testing Checklist

For each page:
1. ✅ Page loads without errors
2. ✅ Hero section displays correctly
3. ✅ All sections render in correct order
4. ✅ Background colors are correct
5. ✅ Spacing/padding looks good
6. ✅ CTAs link to correct pages
7. ✅ Images load properly
8. ✅ Meta tags appear in page source
9. ✅ Open Graph tags work (test with social media debugger)
10. ✅ Structured data validates (Google Rich Results Test)

### Automated Testing

```typescript
// __tests__/pages/sanity-pages.test.ts
import { getPageBySlug } from "@/lib/sanity/queries/pages";

describe("Sanity Pages", () => {
  test("Homepage exists and is published", async () => {
    const page = await getPageBySlug("/");
    expect(page).toBeTruthy();
    expect(page?.isPublished).toBe(true);
    expect(page?.seo.metaTitle).toBeTruthy();
  });

  test("About page exists and is published", async () => {
    const page = await getPageBySlug("/about");
    expect(page).toBeTruthy();
    expect(page?.isPublished).toBe(true);
  });

  // Add more tests for each page
});
```

---

## Step 6: Content Team Training

### Quick Start Guide for Content Editors

1. **Log in to Sanity Studio**: https://enthusiastauto.sanity.studio
2. **Navigate to "Page"** in the sidebar
3. **Select the page** you want to edit
4. **Make changes** to hero, SEO, or sections
5. **Save** (Cmd/Ctrl + S)
6. **Publish** if needed
7. **Wait 60 seconds** for changes to appear on website (or trigger webhook)

### Common Tasks

**Update Hero Image:**
1. Open page document
2. Scroll to "Hero Section"
3. Upload new image or paste URL
4. Adjust overlay if needed
5. Save

**Add New Section:**
1. Scroll to "Page Sections"
2. Click "Add item"
3. Fill in Section ID, Component Name, and Prompt
4. Set background color and padding
5. Set sort order
6. Toggle "Enabled" on
7. Save

**Reorder Sections:**
1. Change "Sort Order" numbers
2. Lower numbers appear first
3. Save

**Hide Section Temporarily:**
1. Toggle "Enabled" off
2. Save

---

## Troubleshooting

### Page Not Found (404)

**Possible causes:**
- Page not published in Sanity
- Slug doesn't match route
- ISR cache not updated

**Solution:**
1. Check "Published" toggle in Sanity
2. Verify slug matches exactly (including leading slash)
3. Wait 60 seconds or trigger revalidation webhook
4. Clear browser cache

### Section Not Rendering

**Possible causes:**
- Component not in COMPONENT_MAP
- Section disabled
- Component error

**Solution:**
1. Check browser console for errors
2. Verify component name matches COMPONENT_MAP
3. Check "Enabled" toggle is on
4. Ensure component is imported in SectionRenderer

### Metadata Not Appearing

**Possible causes:**
- SEO fields not filled in
- generateMetadata not implemented
- Cache issue

**Solution:**
1. Fill in all required SEO fields
2. View page source to check meta tags
3. Clear cache and hard refresh
4. Check generateMetadata function

---

## Best Practices

### Content
- ✅ Write clear, descriptive prompts for sections
- ✅ Use consistent naming for section IDs (kebab-case)
- ✅ Keep hero titles concise and impactful
- ✅ Optimize images before uploading (compress, resize)
- ✅ Test changes in preview mode before publishing

### Development
- ✅ Extract reusable components for sections
- ✅ Add new components to COMPONENT_MAP
- ✅ Use TypeScript for type safety
- ✅ Implement error boundaries for section rendering
- ✅ Log warnings for missing components in dev mode

### Performance
- ✅ Use ISR with 60s revalidation
- ✅ Implement webhook revalidation for instant updates
- ✅ Optimize images with next/image
- ✅ Lazy load sections below the fold
- ✅ Monitor Core Web Vitals

---

## Next Steps

1. **Create page documents** for all static pages in Sanity Studio
2. **Extract section components** from existing page files
3. **Update routes** to fetch from Sanity (catch-all or individual)
4. **Test thoroughly** on staging environment
5. **Train content team** on CMS usage
6. **Deploy to production** with monitoring
7. **Set up webhooks** for instant revalidation

---

## Support

- **Sanity Studio**: https://enthusiastauto.sanity.studio
- **Documentation**: See PAGE-CONTENT-GUIDE.md
- **Dev Team**: Contact for component creation or technical issues
