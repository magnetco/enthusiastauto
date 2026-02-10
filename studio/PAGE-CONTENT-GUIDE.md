# Page Content Management Guide

This guide explains how to manage static pages in Sanity CMS for the Enthusiast Auto Group website.

---

## Overview

Every static page on the frontend can now be edited in Sanity CMS with:
- **Hero content** (title, subtitle, background image, CTAs)
- **SEO metadata** (meta title, description, Open Graph tags)
- **Section components** (defined via natural language prompts)

**No page builder needed** — sections are specified via text prompts that describe what should appear and how it should behave.

---

## Page Mapping

Here's every page on the frontend and its corresponding Sanity page type:

| Frontend Route | Page Type | Slug | Description |
|----------------|-----------|------|-------------|
| `/` | Homepage | `/` | Main landing page |
| `/about` | About | `/about` | Company story, mission, values |
| `/contact` | Contact | `/contact` | Contact form and information |
| `/services` | Services Overview | `/services` | Services listing page |
| `/blog` | Blog Listing | `/blog` | Blog posts listing |
| `/vehicles` | Vehicles Listing | `/vehicles` | Inventory listing |
| `/parts` | Parts Catalog | `/parts` | Parts search/catalog |
| `/merchandise` | Merchandise | `/merchandise` | Apparel and accessories |
| `/sell` | Sell Your Car | `/sell` | Sell/consign submission form |
| `/search` | Search | `/search` | Global search results |
| `/privacy` | Privacy Policy | `/privacy` | Privacy policy |
| `/terms` | Terms of Service | `/terms` | Terms of service |

**Note:** Dynamic pages like `/vehicles/[slug]`, `/blog/[slug]`, `/services/[slug]` are managed by their respective content types (Vehicle, Post, Service), not the Page type.

---

## Creating a New Page

### 1. Basic Information

- **Page Title**: Internal name (e.g., "Homepage", "About Us")
- **URL Slug**: The URL path (e.g., `/`, `/about`, `/contact`)
- **Page Type**: Select from dropdown (Homepage, About, Contact, etc.)

### 2. SEO Settings

All pages require SEO metadata:

```
Meta Title: "About | Enthusiast Auto Group"
Meta Description: "Learn about Cincinnati's premier BMW preservation facility..."
Open Graph Title: (optional, defaults to Meta Title)
Open Graph Description: (optional, defaults to Meta Description)
Open Graph Image: Upload or select image for social shares (1200x630px)
Keywords: ["BMW", "Cincinnati", "M-Series", "enthusiast"]
No Index: false (only check for pages you don't want indexed)
```

**Best Practices:**
- Meta Title: 50-60 characters
- Meta Description: 150-160 characters
- Include primary keywords naturally
- Make descriptions compelling (they appear in search results)

---

## Hero Section Configuration

Every page can have a customizable hero section:

### Hero Settings

| Field | Description | Example |
|-------|-------------|---------|
| **Show Hero** | Toggle on/off | true |
| **Hero Size** | small, medium, large, full | medium |
| **Eyebrow Text** | Small text above title | "Enthusiast Auto Group" |
| **Hero Title** | Main headline | "Built by Enthusiasts\nFor Enthusiasts" |
| **Title Highlight** | Text to highlight in blue | "For Enthusiasts" |
| **Subtitle** | Supporting text | "Cincinnati's premier destination..." |
| **Background Image** | Upload image | (upload 1920x1080px image) |
| **Background Image URL** | Or use external URL | https://images.unsplash.com/... |
| **Overlay Opacity** | Dark overlay (0-100) | 50 |

### Call-to-Action Buttons

Add up to 2 CTA buttons:

**Button 1:**
```
Label: "View Inventory"
Link URL: "/vehicles"
Button Style: Primary (Red)
```

**Button 2:**
```
Label: "Our Services"
Link URL: "/services"
Button Style: Outline (White)
```

---

## Section Components (Prompt-Based)

This is where the magic happens. Instead of a visual page builder, you define sections using **natural language prompts**.

### How It Works

Each section has:
1. **Section ID**: Unique identifier (kebab-case)
2. **Component Name**: React component to render
3. **Prompt**: Natural language description of what to display
4. **Settings**: Background color, padding, sort order
5. **Enabled**: Toggle on/off

### Example Sections

#### Homepage - Featured Vehicles Section

```yaml
Section ID: featured-vehicles
Component Name: FeaturedVehicles
Prompt: |
  Display the 4 most recent vehicles marked as "featured" in a 
  responsive grid (1 col mobile, 2 cols tablet, 4 cols desktop). 
  Each card shows: vehicle image, year/make/model, price, and 
  3 key features. Include a "View All Inventory" button linking 
  to /vehicles.
Enabled: true
Background Color: White
Vertical Padding: Large (py-16 sm:py-20 lg:py-24)
Sort Order: 1
```

#### Homepage - Services Section

```yaml
Section ID: services-section
Component Name: ServicesSection
Prompt: |
  Display all 4 services in a numbered grid (01-04) with service 
  title, description, and icon. Each service is clickable and 
  links to its detail page. Use dark background with white text.
Enabled: true
Background Color: Navy Primary
Vertical Padding: Large
Sort Order: 2
```

#### Homepage - Blog Posts Section

```yaml
Section ID: featured-blog-posts
Component Name: FeaturedBlogPostsWrapper
Prompt: |
  Show the 3 most recent blog posts marked as "featured" in a 
  3-column grid (1 col mobile, 2 cols tablet, 3 cols desktop). 
  Each card displays: featured image, category badge, title, 
  excerpt (truncated to 2 lines), and publish date. Cards link 
  to individual blog posts.
Enabled: true
Background Color: White
Vertical Padding: Large
Sort Order: 3
```

#### About Page - Story Section

```yaml
Section ID: our-story
Component Name: AboutStorySection
Prompt: |
  Two-column layout: left side has rich text story content, 
  right side shows timeline cards with milestones (year, title, 
  description). Timeline cards have hover effects with gradient 
  accent at bottom.
Enabled: true
Background Color: White
Vertical Padding: Large
Sort Order: 1
```

#### About Page - Mission Section

```yaml
Section ID: mission-values
Component Name: AboutMissionSection
Prompt: |
  Dark section with mission statement blockquote followed by 
  3-column grid of values (Authenticity, Excellence, Community). 
  Each value card has large background number, title, and 
  description with hover effects.
Enabled: true
Background Color: Navy Primary
Vertical Padding: Large
Sort Order: 2
```

---

## Available Components

Here are the existing React components you can reference in sections:

### Homepage Components
- `HeroSection` - Full-screen hero with image and CTAs
- `FeaturedVehicles` - Featured vehicle grid
- `ServicesSection` - Services numbered grid
- `FeaturedBlogPostsWrapper` - Blog posts grid
- `AboutSection` - About content section

### Shared Components
- `PageHero` - Standard page hero (smaller than homepage hero)
- `TitleBlock` - Section title with optional description and action
- `VehicleCard` - Individual vehicle card
- `BlogCard` - Individual blog post card
- `ServiceCard` - Individual service card

### Contact Page Components
- `ContactForm` - Multi-step contact form
- `ContactInfoCard` - Contact information card
- `QuickContactCards` - Grid of quick contact options

### Custom Components
You can request new components by describing what you need in the prompt. The development team will create them and map them to your section.

---

## Section Ordering

Sections are rendered in order based on the **Sort Order** field:

```
Sort Order 0: First section (after hero)
Sort Order 1: Second section
Sort Order 2: Third section
...and so on
```

**Tip:** Use increments of 10 (0, 10, 20, 30) to leave room for inserting sections later without renumbering everything.

---

## Background Colors

Choose from predefined background colors:

| Color | CSS Class | Usage |
|-------|-----------|-------|
| **White** | `bg-white` | Default, clean sections |
| **Light Gray** | `bg-neutral-50` | Subtle variation, alternating sections |
| **Dark Blue Primary** | `bg-dark-blue-primary` | Main dark sections (matches header/footer) |
| **Navy Primary** | `bg-navy-primary` | Content hero backgrounds, service pages |
| **Navy Secondary** | `bg-navy-secondary` | Cards, elevated surfaces |

**Pattern:** Alternate between white and light gray for light sections, use navy/dark blue for dramatic sections.

---

## Vertical Padding

Control spacing above and below sections:

| Size | CSS Classes | Usage |
|------|-------------|-------|
| **None** | `py-0` | No padding (rare) |
| **Small** | `py-12` | Tight spacing |
| **Medium** | `py-16 sm:py-20` | Standard spacing |
| **Large** | `py-16 sm:py-20 lg:py-24` | Generous spacing (recommended) |

**Default:** Use "Large" for most sections to maintain consistent rhythm.

---

## Writing Effective Prompts

### Good Prompt Example ✅

```
Display the 4 most recent featured vehicles in a responsive grid 
(1 column on mobile, 2 on tablet, 4 on desktop). Each vehicle card 
should show:
- Vehicle image with hover zoom effect
- Year, make, model, chassis (e.g., "2003 BMW E39 M5")
- Price (or "Call For Price" if configured)
- 3 key features as bullet points
- "View Details" button

Include a "View All Inventory" button below the grid linking to 
/vehicles. Use the VehicleCard component for consistency.
```

**Why it's good:**
- Specific about layout and responsiveness
- Lists exactly what data to display
- Mentions hover effects and interactions
- Specifies component to use
- Clear about CTAs and links

### Bad Prompt Example ❌

```
Show some vehicles
```

**Why it's bad:**
- Too vague
- No layout specification
- Doesn't say which vehicles or how many
- No mention of what data to display
- No component reference

### Prompt Template

```
Display [what content] in a [layout description] with [number] 
[items/columns]. Each [item] should show:
- [Field 1]
- [Field 2]
- [Field 3]

[Describe interactions/hover effects]

Include a [CTA description] linking to [URL]. Use [component name] 
for consistency.
```

---

## Structured Data (JSON-LD)

For advanced SEO, you can add custom JSON-LD structured data:

### Example: Organization Schema (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Enthusiast Auto Group",
  "description": "The leading BMW preservation facility...",
  "url": "https://enthusiastauto.com",
  "logo": "https://enthusiastauto.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "11608 Reading Rd",
    "addressLocality": "Cincinnati",
    "addressRegion": "OH",
    "postalCode": "45241",
    "addressCountry": "US"
  },
  "telephone": "+1-513-554-1269",
  "email": "info@enthusiastauto.com",
  "sameAs": [
    "https://facebook.com/enthusiastauto",
    "https://instagram.com/enthusiastauto"
  ]
}
```

### Example: LocalBusiness Schema (Contact Page)

```json
{
  "@context": "https://schema.org",
  "@type": "AutomotiveDealer",
  "name": "Enthusiast Auto Group",
  "image": "https://enthusiastauto.com/og-image.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "11608 Reading Rd",
    "addressLocality": "Cincinnati",
    "addressRegion": "OH",
    "postalCode": "45241"
  },
  "telephone": "+1-513-554-1269",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ]
}
```

---

## Publishing Workflow

1. **Create Page**: Add new page document in Sanity Studio
2. **Configure SEO**: Fill in all meta tags
3. **Design Hero**: Set up hero section with image and CTAs
4. **Add Sections**: Define sections with prompts
5. **Preview**: Use preview mode to see changes
6. **Toggle Published**: Set "Published" to true
7. **Set Published Date**: Record when page went live

**Draft Mode:** Keep "Published" toggled off while working on the page. Toggle on when ready to go live.

---

## Frontend Integration

### Fetching Page Data

```typescript
// lib/sanity/queries/pages.ts
export async function getPageBySlug(slug: string) {
  return await client.fetch(
    `*[_type == "page" && slug.current == $slug && isPublished == true][0] {
      _id,
      title,
      slug,
      pageType,
      seo {
        metaTitle,
        metaDescription,
        ogTitle,
        ogDescription,
        "ogImage": ogImage.asset->url,
        keywords,
        noIndex
      },
      hero {
        enabled,
        size,
        eyebrow,
        title,
        titleHighlight,
        subtitle,
        "backgroundImage": backgroundImage.asset->url,
        backgroundImageUrl,
        overlay,
        ctas[] {
          label,
          href,
          variant
        }
      },
      sections[] {
        sectionId,
        component,
        prompt,
        enabled,
        backgroundColor,
        paddingY,
        sortOrder
      } | order(sortOrder asc),
      structuredData,
      publishedAt,
      updatedAt
    }`,
    { slug }
  );
}
```

### Rendering Page Sections

```typescript
// app/[page]/page.tsx
import { getPageBySlug } from "@/lib/sanity/queries/pages";
import { PageHero } from "@/components/shared/PageHero";
import { SectionRenderer } from "@/components/shared/SectionRenderer";

export default async function DynamicPage({ params }) {
  const page = await getPageBySlug(params.page);

  if (!page) notFound();

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
      {page.sections
        ?.filter((section) => section.enabled)
        .map((section) => (
          <SectionRenderer key={section.sectionId} section={section} />
        ))}

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

// Generate metadata
export async function generateMetadata({ params }) {
  const page = await getPageBySlug(params.page);

  return {
    title: page.seo.metaTitle,
    description: page.seo.metaDescription,
    openGraph: {
      title: page.seo.ogTitle || page.seo.metaTitle,
      description: page.seo.ogDescription || page.seo.metaDescription,
      images: page.seo.ogImage ? [page.seo.ogImage] : [],
    },
    robots: {
      index: !page.seo.noIndex,
      follow: !page.seo.noIndex,
    },
  };
}
```

### Section Renderer Component

```typescript
// components/shared/SectionRenderer.tsx
import { FeaturedVehicles } from "./FeaturedVehicles";
import { ServicesSection } from "./ServicesSection";
import { FeaturedBlogPostsWrapper } from "./FeaturedBlogPostsWrapper";
import { AboutSection } from "./AboutSection";

const COMPONENT_MAP = {
  FeaturedVehicles,
  ServicesSection,
  FeaturedBlogPostsWrapper,
  AboutSection,
  // Add more components as needed
};

export function SectionRenderer({ section }) {
  const Component = COMPONENT_MAP[section.component];

  if (!Component) {
    console.warn(`Component "${section.component}" not found`);
    return null;
  }

  const bgColorMap = {
    white: "bg-white",
    "neutral-50": "bg-neutral-50",
    "dark-blue-primary": "bg-[#0a0c10]",
    "navy-primary": "bg-[#141721]",
    "navy-secondary": "bg-[#1f2233]",
  };

  const paddingMap = {
    none: "py-0",
    small: "py-12",
    medium: "py-16 sm:py-20",
    large: "py-16 sm:py-20 lg:py-24",
  };

  return (
    <section
      id={section.sectionId}
      className={`${bgColorMap[section.backgroundColor]} ${paddingMap[section.paddingY]}`}
    >
      <Component />
    </section>
  );
}
```

---

## Best Practices

### SEO
- ✅ Unique meta title and description for every page
- ✅ Include primary keywords naturally
- ✅ Keep titles under 60 chars, descriptions under 160 chars
- ✅ Add Open Graph images for social sharing
- ✅ Use structured data for rich search results

### Hero Sections
- ✅ Use high-quality images (1920x1080px minimum)
- ✅ Keep titles concise and impactful
- ✅ Limit to 2 CTAs maximum
- ✅ Ensure text is readable over background image (adjust overlay)

### Section Prompts
- ✅ Be specific about layout and responsiveness
- ✅ List exactly what data to display
- ✅ Mention component names for consistency
- ✅ Describe interactions and hover effects
- ✅ Specify CTAs and links

### Content Strategy
- ✅ Alternate background colors for visual rhythm
- ✅ Use consistent vertical padding (Large for most sections)
- ✅ Order sections logically (most important first)
- ✅ Enable/disable sections for A/B testing

---

## Troubleshooting

### Page Not Showing on Frontend

1. Check "Published" toggle is ON
2. Verify slug matches frontend route
3. Ensure ISR revalidation has occurred (wait 60s or trigger webhook)
4. Check browser console for errors

### Hero Not Displaying

1. Verify "Show Hero" toggle is ON
2. Check background image is uploaded or URL is valid
3. Ensure title or subtitle is filled in
4. Verify hero size is not "none"

### Section Not Rendering

1. Check "Enabled" toggle is ON for that section
2. Verify component name matches COMPONENT_MAP
3. Check browser console for component errors
4. Ensure sort order is correct

### SEO Tags Not Appearing

1. Verify all required SEO fields are filled
2. Check generateMetadata function is implemented
3. View page source to confirm meta tags are present
4. Clear cache and hard refresh browser

---

## Support

For questions or issues:
- **Development Team**: Contact your dev team for component creation or technical issues
- **Content Team**: Refer to this guide for content management questions
- **Sanity Support**: https://www.sanity.io/help

---

## Changelog

- **2026-02-09**: Initial page content type created with hero, SEO, and section support
