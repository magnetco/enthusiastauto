# Sanity CMS Content Strategy

This document outlines what content should be managed in Sanity CMS for Enthusiast Auto Group.

---

## Current Content Types

### ✅ Vehicles (Implemented)
**Status:** Complete  
**Schema:** `studio/schemas/vehicle.ts`

The core inventory management system with comprehensive fields for:
- Vehicle specifications (chassis, mileage, colors, engine, transmission)
- Pricing and availability
- Multiple image galleries (exterior, interior, sold shots)
- Rich text content (highlights, overview, history)
- Status management (current, sold, draft)
- Featured vehicle flags

---

### ✅ Blog Posts (Implemented)
**Status:** Complete  
**Schema:** `studio/schemas/post.ts`

Magazine-style blog content with:
- Title, slug, excerpt
- Categories (Events, Around The Shop, Videos)
- Rich text body with embedded images
- Featured post flag
- Location and publish date

---

### ✅ Services (Just Added)
**Status:** New - Ready to implement  
**Schema:** `studio/schemas/service.ts`

Service offerings with:
- Service title, slug, description
- Icon selection for navigation
- Hero image and gallery
- Rich text overview
- Key features list
- Flexible pricing (starting price, range, or "Request Quote")
- Duration estimates
- Featured/active flags
- SEO metadata

**Next Steps:**
1. Migrate hardcoded services from `website/lib/config/navigation.ts` to Sanity
2. Update website to fetch services from Sanity API
3. Update navigation menus to be dynamic

---

## Recommended Future Content Types

### 🔄 Team Members
**Priority:** Medium  
**Why:** About page currently has no team information

```typescript
// Suggested fields:
- name
- title/role
- bio (rich text)
- photo
- email (optional)
- specialties/expertise
- sortOrder
- isActive
```

**Benefits:**
- Easy team updates without code deployment
- Consistent formatting across pages
- Can be featured on About page, service pages, blog posts

---

### 🔄 Testimonials / Reviews
**Priority:** High  
**Why:** Social proof is critical for high-value vehicle sales

```typescript
// Suggested fields:
- customerName
- customerLocation (optional)
- rating (1-5 stars)
- testimonialText (rich text)
- vehiclePurchased (reference to vehicle, optional)
- serviceUsed (reference to service, optional)
- date
- featured (boolean)
- photo (optional)
- videoUrl (optional)
```

**Benefits:**
- Display on homepage, vehicle pages, service pages
- Build trust with potential buyers
- Showcase successful transactions

---

### 🔄 FAQ Items
**Priority:** Medium  
**Why:** Reduce support inquiries, improve SEO

```typescript
// Suggested fields:
- question
- answer (rich text)
- category (Buying, Selling, Services, Shipping, etc.)
- relatedTo (vehicles, services, general)
- sortOrder
- isActive
```

**Benefits:**
- Centralized FAQ management
- Can be filtered by category
- Improves SEO with structured data
- Reduces repetitive customer inquiries

---

### 🔄 Press / Media Mentions
**Priority:** Low  
**Why:** Build credibility, showcase media coverage

```typescript
// Suggested fields:
- publicationName
- articleTitle
- articleUrl
- excerpt
- publishedDate
- logo (publication logo)
- featured (boolean)
```

**Benefits:**
- "As Featured In" section on homepage
- Builds brand authority
- Easy to maintain

---

### 🔄 Events
**Priority:** Low-Medium  
**Why:** Track car shows, meetups, open houses

```typescript
// Suggested fields:
- eventName
- slug
- description (rich text)
- eventDate
- endDate (optional)
- location
- registrationUrl (optional)
- images
- isPublic (boolean)
```

**Benefits:**
- Promote community engagement
- Calendar integration
- Archive past events

---

### 🔄 Site Settings (Singleton)
**Priority:** High  
**Why:** Centralize global settings without code changes

```typescript
// Suggested fields:
- siteName
- tagline
- contactEmail
- contactPhone
- address
- socialMedia (object: facebook, instagram, youtube, etc.)
- businessHours
- announcementBanner (text, link, active flag)
- maintenanceMode (boolean)
```

**Benefits:**
- Update contact info without deployment
- Toggle announcement banners
- Manage social links centrally

---

### 🔄 Service Packages / Bundles
**Priority:** Medium  
**Why:** Offer curated service combinations

```typescript
// Suggested fields:
- packageName
- slug
- description
- includedServices (array of service references)
- pricing
- savings (vs. individual services)
- duration
- isActive
```

**Benefits:**
- Upsell service combinations
- Simplify complex service offerings
- Track popular packages

---

### 🔄 Parts Categories (if not using Shopify)
**Priority:** Low  
**Why:** Only if moving away from Shopify for parts

Currently parts are managed in Shopify, which is the right approach for e-commerce. Only consider moving to Sanity if you need:
- Custom fitment logic
- Deep integration with vehicle inventory
- Non-standard product attributes

**Recommendation:** Keep parts in Shopify for now.

---

## Content NOT Suitable for Sanity

### ❌ User Accounts
**Manage in:** Vercel Postgres (Prisma)  
**Why:** Auth, sessions, and user data require relational database

### ❌ Shopping Cart / Orders
**Manage in:** Shopify  
**Why:** E-commerce platform handles cart, checkout, payments

### ❌ Form Submissions
**Manage in:** Vercel Postgres or email service  
**Why:** Transactional data, not content

### ❌ Analytics / Metrics
**Manage in:** Analytics platform (Vercel Analytics, Google Analytics)  
**Why:** Time-series data, not content

---

## Implementation Priority

### Phase 1: Core Content (Complete)
- ✅ Vehicles
- ✅ Blog Posts
- ✅ Services (schema ready)

### Phase 2: Trust & Credibility
- 🔄 Testimonials
- 🔄 Site Settings
- 🔄 FAQ Items

### Phase 3: Team & Community
- 🔄 Team Members
- 🔄 Events
- 🔄 Press Mentions

### Phase 4: Advanced
- 🔄 Service Packages
- 🔄 (Future content types as needed)

---

## Migration Notes

### Services Migration
The current services are hardcoded in `website/lib/config/navigation.ts`:

```typescript
services: [
  {
    title: "Conditioning & Protection",
    href: "/services/conditioning",
    description: "Paint correction, ceramic coating, and preservation treatments",
    icon: "sparkles",
  },
  // ... more services
]
```

**Migration Steps:**
1. Create service documents in Sanity Studio
2. Update `website/app/services/[slug]/page.tsx` to fetch from Sanity
3. Update navigation components to fetch services dynamically
4. Add revalidation webhook for real-time updates
5. Remove hardcoded services from `navigation.ts`

---

## Best Practices

### Content Modeling
- Use **references** for relationships (e.g., testimonial → vehicle)
- Use **rich text** for formatted content (not plain strings)
- Use **slugs** for URL-friendly identifiers
- Use **booleans** for visibility/featured flags
- Use **numbers** for sort order

### SEO
- Always include `metaTitle` and `metaDescription` fields
- Add `alt` text to all images
- Use structured data where applicable
- Generate sitemaps from Sanity content

### Performance
- Use `select` in GROQ queries to project only needed fields
- Set appropriate ISR revalidation times (60s for vehicles, 300s for services)
- Use Sanity CDN for images
- Implement webhook-based revalidation for instant updates

### Content Strategy
- **Vehicles:** Update frequently (daily/weekly)
- **Blog Posts:** Regular cadence (weekly/monthly)
- **Services:** Update quarterly or as offerings change
- **Testimonials:** Add as received
- **Site Settings:** Update as needed (infrequent)

---

## Questions to Consider

1. **Do you want to manage homepage hero content in Sanity?**
   - Pros: Easy to update hero images/text without deployment
   - Cons: Adds complexity, may not change often enough to justify

2. **Do you want to manage navigation menus in Sanity?**
   - Pros: Non-technical users can update menus
   - Cons: Navigation is structural and rarely changes

3. **Do you want to manage email templates in Sanity?**
   - Pros: Update email content without code changes
   - Cons: Email templates often need code-level control

4. **Do you want to manage pricing in Sanity?**
   - Pros: Update prices without deployment
   - Cons: Vehicle prices are already in Sanity; service prices are now too

---

## Conclusion

The addition of **Services** to Sanity CMS completes the core content management needs for Enthusiast Auto Group. The next priority should be **Testimonials** and **Site Settings** to improve trust and reduce deployment friction for common updates.

All content types should follow the established patterns:
- Proper TypeScript types
- Validation rules
- SEO fields
- Preview configurations
- Appropriate icons (no more emojis!)
