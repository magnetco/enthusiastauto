# AGENTS.md

AI agent guidance for Enthusiast Auto Group platform development.

---

## Project Overview

**Enthusiast Auto Group (EAG)** is a BMW preservation facility specializing in classic and high-end BMW M models. This is a multi-app monorepo with three independent applications:

| App | Port | Purpose |
|-----|------|---------|
| **website** | 3040 | Next.js 15 e-commerce platform |
| **studio** | 5040 | Sanity CMS for vehicle content |
| **data** | 4040 (frontend) / 4041 (API) | Express + React admin dashboard |

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19 Server Components, TypeScript 5.9
- **Styling**: Tailwind CSS v4.1, ShadCN UI components
- **CMS**: Sanity v5 (vehicles, blog, services)
- **E-commerce**: Shopify Storefront API (parts, merchandise)
- **Database**: Vercel Postgres (Neon) with Prisma ORM v7
- **Auth**: NextAuth.js v5 with database sessions
- **Hosting**: Vercel (website), Sanity.io (studio)

---

## Architecture

### Dual-CMS Strategy

- **Sanity CMS**: Vehicle content, services, blog posts, static pages — rich editing experience with full control over hero sections, SEO, and page structure
- **Shopify API**: Parts e-commerce (cart, checkout, payments) — handles all commerce complexity

### Data Ownership

| Data | Source | Reason |
|------|--------|--------|
| Vehicles | Sanity | Rich content editing, custom fields |
| Services | Sanity | Service offerings, pricing, descriptions |
| Pages | Sanity | Static page content, hero sections, SEO |
| Blog Posts | Sanity | Article content, categories, featured posts |
| Products | Shopify | Cart, checkout, inventory, payments |
| Users, Favorites | Vercel Postgres | Auth sessions, cross-CMS favorites |

### Hybrid Rendering Strategy

| Page Type | Strategy | Revalidation |
|-----------|----------|--------------|
| Vehicle pages | ISR | 60s + webhook |
| Product pages | SSG + ISR | 300s + webhook |
| User dashboard | SSR | N/A |
| Search | Client-side | N/A |

### Caching Strategy

| Source | Cache | TTL | Invalidation |
|--------|-------|-----|--------------|
| Sanity | Next.js ISR | 60s | Webhook |
| Shopify | Next.js fetch | 300s | Webhook |
| Postgres | None | N/A | N/A |
| Images | CDN + Edge | 1 year | URL versioning |

---

## Key Routes

### Public Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage - hero, featured vehicles, parts |
| `/vehicles` | `app/vehicles/page.tsx` | Inventory listing with chassis filters |
| `/vehicles/[slug]` | `app/vehicles/[slug]/page.tsx` | Vehicle detail page (VDP) |
| `/parts` | `app/parts/page.tsx` | Parts catalog with fitment filtering |
| `/merchandise` | `app/merchandise/page.tsx` | Apparel, accessories, collectibles |
| `/product/[handle]` | `app/product/[handle]/page.tsx` | Product detail page (PDP) |
| `/services` | `app/services/page.tsx` | Services overview |
| `/services/[slug]` | `app/services/[slug]/page.tsx` | Individual service page |
| `/blog` | `app/blog/page.tsx` | Blog listing |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Blog post |
| `/search` | `app/search/page.tsx` | Search results |
| `/sell` | `app/sell/page.tsx` | Sell, Consign, or Auction your BMW |

### Authentication

| Route | File | Description |
|-------|------|-------------|
| `/auth/signin` | `app/auth/signin/page.tsx` | Sign in |
| `/auth/signup` | `app/auth/signup/page.tsx` | Registration |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Request reset |

### Protected Routes (Account)

| Route | File | Description |
|-------|------|-------------|
| `/account` | `app/account/page.tsx` | Dashboard |
| `/account/profile` | `app/account/profile/page.tsx` | Profile management |
| `/account/garage` | `app/account/garage/page.tsx` | My Garage - saved vehicles, fitment |

### API Routes

| Route | Purpose |
|-------|---------|
| `/api/auth/*` | Authentication (NextAuth, signup, reset, verify) |
| `/api/search` | Product search |
| `/api/recommendations` | Product recommendations |
| `/api/user/*` | Profile, addresses, favorites, garage |
| `/api/contact/*` | Contact forms, inquiries |
| `/api/services/request` | Service appointments |
| `/api/revalidate` | Cache revalidation |

---

## Design Standards

### Color System

Define colors in three tiers:

| Tier | Purpose | Examples |
|------|---------|----------|
| **Base** | Raw palette values | `--color-navy-900`, `--color-blue-500` |
| **Semantic** | Theme-aware tokens | `--background`, `--foreground`, `--primary` |
| **Component** | Specific use cases | Card backgrounds, button hovers, badges |

#### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Brand Red** | `#F90020` | Primary CTAs, accents, alerts |
| **Deep Blue** | `#005A90` | Links on light backgrounds, headers |
| **Blue** | `#2E90FA` | Focus rings, interactive elements |
| **Dark Blue Primary** | `#0a0c10` | Main dark sections (header, footer, about) |
| **Dark Blue Tertiary** | `#0a0d11` | Alternative dark sections (expanded nav) |
| **Navy Primary** | `#141721` | Service pages, content hero backgrounds |
| **Navy Secondary** | `#1f2233` | Cards, elevated surfaces |
| **White** | `#FFFFFF` | Light backgrounds, text on dark |
| **Gray 200** | `#DFE5EA` | Borders, dividers |
| **Gray 400** | `#CCCCCC` | Muted elements, inputs |

**DO:**
- Use semantic tokens (`--primary`, `--muted-foreground`) in components
- Define both light and dark mode values for all semantic tokens
- Document component-specific color patterns
- Use `#0a0c10` for main dark sections (header, footer, menus)
- Use `#141721` for content hero sections and service pages
- Use `#1f2233` for cards and elevated surfaces

**DON'T:**
- Use raw Tailwind color classes (`text-blue-500`) — map to semantic tokens
- Use arbitrary hex values not defined in the token system
- Mix color systems — stick to the defined palette
- Use pure black (`#000000` or `#0a0a0a`) for structural backgrounds — use blue-tinted dark colors instead
- Change semi-transparent black overlays (`bg-black/30`, `bg-black/50`) — these are intentional for image overlays

### Typography

| Use | Font | Weight |
|-----|------|--------|
| **Headlines** | Chromatic Gothic | Regular (uppercase) |
| **Body** | Figtree | 400, 500, 600 |
| **Mono** | System mono | 400 |

**Scale:** micro → mini → small → base → regular → large → xl → title-3 → title-2 → title-1 → hero

- Define font sizes with paired `line-height` and `letter-spacing`
- Use negative letter-spacing for headings (tighter tracking)
- Base body text: 14–16px with ~1.5 line-height

### Spacing

Use a consistent 4px or 8px base grid:

| Category | Values | Usage |
|----------|--------|-------|
| Tight | 4px, 8px, 12px | Element gaps, icon spacing |
| Standard | 16px, 20px, 24px | Card padding, form gaps |
| Large | 32px, 48px, 64px | Section spacing |
| Page | 16px → 32px (responsive) | Edge gutters |

### Shadows & Elevation

```css
--shadow-tiny:   0 1px 1px rgba(0,0,0,0.09);
--shadow-low:    0 2px 4px rgba(0,0,0,0.1);
--shadow-medium: 0 4px 24px rgba(0,0,0,0.2);
--shadow-high:   0 7px 32px rgba(0,0,0,0.35);
```

### Animation

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-instant` | 0s | Immediate feedback |
| `--duration-quick` | 100ms | Micro-interactions |
| `--duration-base` | 250ms | Standard transitions |
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General motion |

**Always support `prefers-reduced-motion`:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Accessibility

| Requirement | Standard |
|-------------|----------|
| Compliance target | WCAG 2.1 AA |
| Body text contrast | 4.5:1 minimum |
| Large text contrast | 3:1 minimum |
| Focus ring | 2px visible ring with offset |
| Keyboard nav | All interactive elements focusable |

---

## Component Standards

### Component Model

- **Server Components by default** — only add `'use client'` when required
- Prefer composition over prop drilling
- TypeScript strict mode — no `any` without justification

### When to Use Client Components

Add `'use client'` only for:
- `useState`, `useEffect`, `useContext`
- Event handlers (onClick, onChange)
- Browser-only APIs (localStorage, window)
- Third-party client libraries

### Organization

```
components/
├── ui/              # Primitives (button, card, input, dialog)
├── shared/          # Cross-feature (carousels, modals, tables)
├── layout/          # Structure (navbar, footer, sidebar)
├── vehicles/        # VehicleCard, VehicleGrid, VehicleGallery
├── cart/            # Cart modal, add-to-cart
├── favorites/       # FavoriteButton, GarageItemCard
├── account/         # ProfileForm, dashboard components
└── search/          # SearchBar, SearchResults
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component files | PascalCase | `ProductCard.tsx` |
| Exports | Named, matching file | `export function ProductCard()` |
| Props interface | `[Component]Props` | `interface ProductCardProps` |
| Utility files | kebab-case | `format-price.ts` |

### ShadCN UI Guidelines

**DO:**
- Use ShadCN for primitives (Button, Dialog, Input, Select)
- Customize via CSS variables in `globals.css`
- Extend with `cn()` utility for conditional classes

**DON'T:**
- Modify files in `components/ui/` directly
- Override styles with inline props — use CSS variables
- Duplicate primitives — compose existing components

### Props & Types

```typescript
// Extend HTML element props
interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Prefer children over render props
function Card({ children, className }: CardProps) {
  return <div className={cn('card', className)}>{children}</div>;
}
```

---

## Next.js Standards

### App Router File Conventions

| File | Purpose | Required |
|------|---------|----------|
| `page.tsx` | Route UI | Yes |
| `layout.tsx` | Shared wrapper | No |
| `loading.tsx` | Suspense fallback | No |
| `error.tsx` | Error boundary | No |
| `not-found.tsx` | 404 page | No |

### Data Fetching

**DO:**
- Fetch in Server Components
- Use `fetch()` with `next: { revalidate }` for caching
- Use `Promise.all()` for parallel independent fetches
- Use Server Actions for mutations

**DON'T:**
- Fetch in `useEffect` when server fetch is possible
- Forget to handle loading and error states
- Over-fetch — select only needed fields

### Metadata & SEO

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getData(params.slug);
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.image],
    },
  };
}
```

**Required files:**
- `sitemap.ts` — Dynamic sitemap generation
- `robots.ts` — Crawler rules
- `opengraph-image.tsx` — Dynamic OG images (optional)

### Images

- Always use `next/image`
- Provide `width` + `height` or use `fill`
- Use `sizes` for responsive images
- Set `priority` for above-the-fold images
- Use CDN URLs when available (Sanity, Shopify, Cloudinary)

---

## Sanity Standards

### Schema Conventions

```typescript
defineType({
  name: 'post',           // lowercase singular
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', date: 'publishedAt' },
  },
});
```

**Conventions:**
- Lowercase singular names: `post`, `product`, `author`
- Auto-generate slugs from title
- Add validation rules for required fields
- Configure preview for studio UX

### GROQ Best Practices

**DO:**
```groq
*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...12] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "image": mainImage.asset->url
}
```

**Guidelines:**
- Project only needed fields
- Use parameters: `*[_type == $type]`
- Limit results: `[0...50]`
- Dereference (`->`) only when needed

---

## Database Standards (Prisma + Postgres)

### Schema Conventions

```prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String?
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  authorId    String
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([authorId])
  @@index([published, createdAt])
}
```

**Requirements:**
- Use `cuid()` for IDs (URL-safe, sortable)
- Include `createdAt` and `updatedAt` on all models
- Define `onDelete: Cascade` for child relations
- Add indexes on foreign keys and query filters

### Query Patterns

```typescript
// Singleton client
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Efficient queries
const posts = await prisma.post.findMany({
  where: { published: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
  select: { id: true, title: true, slug: true },
});
```

---

## Brand Voice & Content

### Brand Positioning

**Enthusiast Auto Group** is the leading BMW preservation facility — not a generic used car dealer.

**Tagline:** *The Leading BMW Preservation Facility*

### Brand Voice

| Attribute | What It Means |
|-----------|---------------|
| **Knowledgeable** | We know BMWs deeply. Speak with authority about specs, history, and care. |
| **Enthusiast-First** | We speak to fellow enthusiasts, not just buyers. Share the passion. |
| **Confident** | We stand behind our vehicles and services. No hedging or overselling. |
| **Approachable** | Expert but not elitist. Welcoming to all BMW enthusiasts. |

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| **Marketing/Hero** | Bold, aspirational | "The finest BMWs, preserved for enthusiasts." |
| **Product/Vehicle** | Detailed, authoritative | "Factory ZCP package with competition brakes and suspension." |
| **Transactional** | Clear, helpful | "Your inquiry has been received. We'll respond within 24 hours." |
| **Error/Support** | Calm, reassuring | "Something went wrong. Please try again or contact us." |

### Writing Style

- Use active voice
- Be specific, not vague ("1998 E36 M3" not "classic BMW")
- Include relevant specs and details
- Avoid superlatives without substance ("best" needs proof)

### CTAs

- Clear, action-oriented
- Primary: "Inquire Now", "Add to Cart", "Submit Request"
- Secondary: "View Details", "Learn More", "Browse Inventory"

### DO

- Speak with authority on BMW topics
- Use proper BMW terminology (chassis codes, option packages)
- Highlight what makes each vehicle special
- Be transparent about pricing and condition

### DON'T

- Use generic car-dealer language ("don't miss out!", "priced to sell!")
- Oversell or make unsubstantiated claims
- Use excessive punctuation or ALL CAPS
- Ignore the enthusiast audience

---

## Business Context

### Revenue Streams

| Stream | Model | Margin | Volume |
|--------|-------|--------|--------|
| **Vehicles** | Direct sales of curated BMW inventory | High | Low |
| **Parts** | E-commerce (Shopify) with fitment matching | Medium | High |
| **Services** | Lead generation for service appointments | High | Medium |

### User Segments

| Segment | Goal | Primary Path |
|---------|------|--------------|
| **Vehicle Buyer** | Find and purchase a quality BMW | Homepage → Vehicles → VDP → Inquiry |
| **Parts Shopper** | Buy parts for their BMW | Homepage → Parts → Filter by vehicle → Cart → Checkout |
| **Service Customer** | Request service appointment | Homepage → Services → Request Form |
| **Seller** | Sell/consign their BMW | Homepage → Sell → Submission Form |

### Conversion Goals

- **Vehicle Sales**: Inquiry form submission
- **Parts E-commerce**: Completed purchase
- **Service Leads**: Service request submission
- **Sell/Consign**: Sell submission

---

## Development Guidelines

### DO

- Use semantic tokens over raw values
- Server Components by default
- Validate all external input with Zod
- Test on real devices before launch
- Monitor Core Web Vitals post-launch
- Document component color patterns
- Add indexes on frequently queried fields

### DON'T

- Use raw Tailwind colors — map to semantic tokens
- Skip accessibility testing
- Deploy without error monitoring
- Use `any` types without justification
- Fetch in `useEffect` when server fetch works
- Commit environment secrets
- Forget `prefers-reduced-motion` support

### Security

- HTTPS enforced (Vercel)
- Webhook signature verification (HMAC SHA256)
- Database sessions (httpOnly, secure cookies)
- Input validation via Zod
- Prisma parameterized queries (SQL injection prevention)

---

## Production Launch Checklist

### Core Functionality

- [ ] All primary user flows complete without errors
- [ ] Forms submit and validate correctly
- [ ] Authentication works (sign up, sign in, password reset)
- [ ] Payment/checkout processes successfully
- [ ] Email notifications send and render properly
- [ ] Third-party integrations functional

### Performance

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 90 |
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

### SEO

- [ ] Unique `<title>` and `<meta description>` per page
- [ ] OpenGraph tags for social sharing
- [ ] `sitemap.xml` generated and submitted to Search Console
- [ ] `robots.txt` configured correctly
- [ ] Canonical URLs set
- [ ] Structured data (JSON-LD) validates

### Security

- [ ] HTTPS enforced, no mixed content
- [ ] Environment variables not exposed to client
- [ ] API endpoints validate input
- [ ] Auth tokens: httpOnly, sameSite, secure
- [ ] Webhook signatures verified
- [ ] Rate limiting on sensitive endpoints

---

## External Services

| Service | Purpose |
|---------|---------|
| Shopify | Parts e-commerce (products, cart, checkout) |
| Sanity CMS | Vehicle and content management |
| Vercel Postgres | User accounts, favorites, service requests |
| Resend | Transactional emails |
| Vercel | Hosting, CDN, serverless functions |
| Google OAuth | Social login |

---

## Quick Reference

When working on this project:

1. **Default to Server Components** — only use `'use client'` when necessary
2. **Use semantic color tokens** — never raw Tailwind colors
3. **Fetch data in Server Components** — avoid `useEffect` for data fetching
4. **Follow brand voice** — knowledgeable, enthusiast-first, confident
5. **Validate all inputs** — use Zod for API routes and forms
6. **Optimize images** — always use `next/image` with proper sizing
7. **Support accessibility** — WCAG 2.1 AA compliance, keyboard navigation
8. **Cache appropriately** — ISR for vehicles (60s), products (300s)
9. **Write for enthusiasts** — use proper BMW terminology and specs
10. **Test thoroughly** — cross-browser, responsive, performance metrics
