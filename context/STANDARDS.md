# Standards

Portable standards reference for website builds. Use during development and for production launch verification.

---

## 1. Design Standards

### Color System

Define colors in three tiers:

| Tier | Purpose | Examples |
|------|---------|----------|
| **Base** | Raw palette values | `--color-navy-900`, `--color-blue-500` |
| **Semantic** | Theme-aware tokens | `--background`, `--foreground`, `--primary` |
| **Component** | Specific use cases | Card backgrounds, button hovers, badges |

**Hierarchies to define:**
- Text: primary → secondary → tertiary → quaternary (disabled/placeholder)
- Background: primary → secondary → tertiary (elevation levels)
- Border: subtle → medium → prominent

**DO:**
- Use semantic tokens (`--primary`, `--muted-foreground`) in components
- Define both light and dark mode values for all semantic tokens
- Document component-specific color patterns (cards, headers, forms)

**DON'T:**
- Use raw Tailwind color classes (`text-blue-500`) — map to semantic tokens
- Use arbitrary hex values not defined in the token system
- Mix color systems — stick to the defined palette

### Component Color Documentation Pattern

Document colors for each major component type:

```
Card (Light Mode)
├── Background:     var(--card)
├── Border:         var(--border) → var(--border-hover)
├── Title:          var(--foreground)
├── Description:    var(--muted-foreground)
└── Accent:         var(--primary)

Header (Dark Mode)
├── Background:     var(--background)
├── Text Primary:   var(--foreground)
├── Text Muted:     var(--muted-foreground)
├── Border:         var(--border)
└── Focus Ring:     var(--ring)
```

### Typography

- Define font sizes with paired `line-height` and `letter-spacing`
- Use negative letter-spacing for headings (tighter tracking)
- Base body text: 14–16px with ~1.5 line-height

**Scale:** micro → mini → small → base → regular → large → xl → title-3 → title-2 → title-1 → hero

**Font families:**
- Body: One clean sans-serif (system fonts or custom)
- Display (optional): For headlines and hero sections
- Mono: For code blocks and technical content

### Spacing

Use a consistent 4px or 8px base grid:

| Category | Values | Usage |
|----------|--------|-------|
| Tight | 4px, 8px, 12px | Element gaps, icon spacing |
| Standard | 16px, 20px, 24px | Card padding, form gaps |
| Large | 32px, 48px, 64px | Section spacing |
| Page | 16px → 32px (responsive) | Edge gutters |

### Shadows & Elevation

Define 3–4 shadow levels:

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

**Reduced motion:** Always support `prefers-reduced-motion`:

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

## 2. Component Standards

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
└── [feature]/       # Domain-specific (cart/, account/, blog/)
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

## 3. Token Standards

### CSS Custom Properties Structure

Define in `globals.css` using `@theme inline` (Tailwind v4) or `:root`:

```css
@theme inline {
  /* Radius scale */
  --radius-4: 0.25rem;
  --radius-8: 0.5rem;
  --radius-16: 1rem;
  --radius-full: 9999px;
  --radius: var(--radius-8);

  /* Typography */
  --font-size-base: 0.875rem;
  --line-height-base: 1.57;
  --letter-spacing-base: -0.006em;

  /* Layout */
  --page-x: 1rem;
  --page-x-lg: 2rem;
  --container-max: 80rem;
  --header-height: 64px;

  /* Animation */
  --duration-quick: 0.1s;
  --duration-base: 0.25s;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Theme Variables (ShadCN Pattern)

```css
:root {
  /* Backgrounds */
  --background: #ffffff;
  --foreground: #1a1a1a;
  --card: #f8f8f8;
  --card-foreground: #1a1a1a;
  --popover: #ffffff;
  --popover-foreground: #1a1a1a;

  /* Brand */
  --primary: #0066cc;
  --primary-foreground: #ffffff;
  --secondary: #f4f4f4;
  --secondary-foreground: #1a1a1a;

  /* States */
  --muted: #f4f4f4;
  --muted-foreground: #6b7280;
  --accent: #0066cc;
  --accent-foreground: #ffffff;
  --destructive: #dc2626;

  /* UI */
  --border: #e5e7eb;
  --input: #e5e7eb;
  --ring: #0066cc;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ffffff;
  --card: #1a1a1a;
  --card-foreground: #ffffff;
  /* ... override all tokens */
}
```

### Token Naming Conventions

| Category | Pattern | Examples |
|----------|---------|----------|
| Colors | `--color-[category]-[variant]` | `--color-text-secondary` |
| Radius | `--radius-[size]` | `--radius-8`, `--radius-full` |
| Spacing | `--[context]-[property]` | `--page-x`, `--header-height` |
| Typography | `--font-size-[scale]` | `--font-size-base` |
| Shadows | `--shadow-[level]` | `--shadow-low`, `--shadow-high` |
| Duration | `--duration-[speed]` | `--duration-quick` |

---

## 4. Next.js Standards

### App Router File Conventions

| File | Purpose | Required |
|------|---------|----------|
| `page.tsx` | Route UI | Yes |
| `layout.tsx` | Shared wrapper | No |
| `loading.tsx` | Suspense fallback | No |
| `error.tsx` | Error boundary | No |
| `not-found.tsx` | 404 page | No |

### Rendering Strategy

| Strategy | When to Use | Example |
|----------|-------------|---------|
| **SSG** | Static content | Marketing, docs, about |
| **ISR** | Semi-dynamic | Products, listings (revalidate: 60–300s) |
| **SSR** | User-specific | Dashboards, account pages |
| **CSR** | Interactive | Search, filters, real-time |

```typescript
// ISR: revalidate every 60 seconds
export const revalidate = 60;

// SSR: no caching
export const dynamic = 'force-dynamic';

// SSG: generate at build time
export async function generateStaticParams() {
  const items = await getItems();
  return items.map((item) => ({ slug: item.slug }));
}
```

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

### API Routes

```
app/api/
├── auth/[...nextauth]/   # Auth (NextAuth.js)
├── webhooks/             # External integrations
│   ├── sanity/
│   └── stripe/
├── revalidate/           # ISR triggers
└── [resource]/           # REST endpoints
```

**Requirements:**
- Validate input with Zod
- Verify webhook signatures
- Return appropriate status codes
- Handle errors gracefully

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

## 5. Sanity Standards

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
    defineField({
      name: 'publishedAt',
      type: 'datetime',
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

**DON'T:**
```groq
// Avoid: fetches all fields
*[_type == "post"]

// Avoid: no limit
*[_type == "post"] { ... }
```

**Guidelines:**
- Project only needed fields
- Use parameters: `*[_type == $type]`
- Limit results: `[0...50]`
- Dereference (`->`) only when needed

### Webhooks & Revalidation

1. Configure webhook in Sanity dashboard → API → Webhooks
2. Point to `/api/webhooks/sanity`
3. Verify signature with HMAC
4. Call `revalidatePath()` or `revalidateTag()`

### Preview Mode

```typescript
// app/api/preview/route.ts
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const slug = request.nextUrl.searchParams.get('slug');

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  draftMode().enable();
  redirect(`/posts/${slug}`);
}
```

---

## 6. Database Standards (Prisma + Neon/Postgres)

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
- Use `@@unique` for composite constraints

### Connection Configuration

```env
# Pooled connection (serverless/edge functions)
POSTGRES_PRISMA_URL="postgres://...?pgbouncer=true&connect_timeout=15"

# Direct connection (migrations only)
DATABASE_URL="postgres://..."
```

### Migration Workflow

1. Edit `schema.prisma`
2. `prisma migrate dev --name add_posts_table`
3. Commit migration SQL files
4. Production: `prisma migrate deploy`

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

// Upsert pattern
await prisma.favorite.upsert({
  where: { userId_itemId: { userId, itemId } },
  update: { updatedAt: new Date() },
  create: { userId, itemId, itemType },
});
```

---

## 7. Production Launch Checklist

### Core Functionality

- [ ] All primary user flows complete without errors
- [ ] Forms submit and validate correctly
- [ ] Authentication works (sign up, sign in, password reset)
- [ ] Payment/checkout processes successfully (if applicable)
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

- [ ] No render-blocking resources
- [ ] Images optimized and lazy-loaded
- [ ] Fonts preloaded or using `font-display: swap`
- [ ] JavaScript bundles code-split

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
- [ ] CSP headers configured (if applicable)

### Cross-Browser & Device

| Browser | Versions |
|---------|----------|
| Chrome | Latest 2 |
| Firefox | Latest 2 |
| Safari | Latest 2 |
| Edge | Latest 2 |
| iOS Safari | Latest 2 |
| Android Chrome | Latest |

- [ ] Responsive: 320px, 768px, 1024px, 1440px
- [ ] Touch interactions work
- [ ] No horizontal scroll on any viewport

### Error Handling

- [ ] Custom 404 page
- [ ] Custom 500 error page
- [ ] Error monitoring configured (Sentry, etc.)
- [ ] Error boundaries catch React errors
- [ ] Graceful degradation for failed API calls

### Infrastructure

- [ ] DNS configured correctly
- [ ] SSL certificate valid
- [ ] Environment variables set in production
- [ ] Database migrations applied
- [ ] CDN/edge caching configured
- [ ] Analytics installed
- [ ] Cookie consent (if required)

---

## Quick Reference

### DO

- Use semantic tokens over raw values
- Server Components by default
- Validate all external input
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
