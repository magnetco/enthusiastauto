# Solution Architecture Document

**Project:** Enthusiast Auto Ecommerce Site (Phase 2: Unified Platform)
**Date:** 2025-10-21
**Author:** Mike

## Executive Summary

This document defines the technical architecture for Phase 2 of the Enthusiast Auto platform, transforming the existing BMW parts e-commerce site (shop.enthusiastauto.com) into a unified platform that integrates both vehicle inventory and parts shopping. Phase 1 (10 stories, 50 points) successfully delivered the parts e-commerce foundation using Next.js 15, Shopify integration, and intelligent vehicle fitment filtering. Phase 2 adds 20 stories (141 points) across 4 new epics: Vehicle Inventory Integration (Sanity CMS), Unified Site Architecture, User Management System (NextAuth.js + Vercel Postgres), and Advanced Search & Discovery.

**Key Architectural Decisions:**
- **Architecture Pattern:** Monolithic Next.js 15 application with dual-CMS integration (Sanity + Shopify)
- **Rendering Strategy:** Hybrid SSR/SSG/ISR optimized per page type (static for products, ISR for vehicles, SSR for user dashboard)
- **Database:** Vercel Postgres with Prisma ORM for user data, favorites, and sessions
- **Authentication:** NextAuth.js with Google/Facebook OAuth and email/password
- **Hosting:** Vercel with auto-deploy CI/CD and edge caching
- **Search:** Client-side Fuse.js (Phase 2a) with future upgrade path to Meilisearch Cloud

**Critical Success Factors:**
- Seamless cross-discovery between vehicles and parts (NFR009: <300ms search)
- Real-time inventory status via Sanity webhooks (NFR006: <60s revalidation)
- Bandwidth optimization for image-heavy site (10-30 images per vehicle, monitoring critical)
- Mobile-first performance (60%+ traffic, Lighthouse 85+ target per NFR001)

## 1. Technology Stack and Decisions

### 1.1 Technology and Library Decision Table

| Category | Technology | Version | Justification |
|----------|-----------|---------|--------------|
| **Framework** | Next.js | 15.3.0 | Best-in-class React framework with App Router for SSR/SSG/ISR hybrid rendering, optimal Vercel integration, brownfield continuity from Phase 1 |
| **Language** | TypeScript | 5.8.2 | Type safety critical for dual-CMS integration complexity, catches errors at compile time, excellent for team learning React (fairly new developer) |
| **UI Library** | React | 19.0.0 | Industry standard, Phase 1 foundation, rich ecosystem for e-commerce components |
| **Styling** | Tailwind CSS | 4.0.14 | Utility-first CSS reduces bundle size, mobile-first responsive design built-in, Phase 1 design system established |
| **Component Library** | ShadCN UI | Latest | Copy-paste components reduce React learning curve, built on Radix UI for accessibility (WCAG AA compliance), Phase 1 implementation complete |
| **Database** | Vercel Postgres | Latest | Free tier for development, native Vercel integration (no external hosting), auto-scaling, ACID compliance for user data |
| **ORM** | Prisma | 5.21.1 | Type-safe database queries auto-generate TypeScript types, excellent Next.js integration, migration management, helpful for React beginners |
| **Authentication** | NextAuth.js | 5.0.0-beta | Self-hosted auth (no vendor lock-in), supports social OAuth + email/password, Prisma adapter for Postgres, production-ready |
| **CMS (Vehicles)** | Sanity CMS | 3.62.0 | Headless CMS for vehicle content, editor-friendly Studio, image CDN included (bandwidth optimization), real-time webhooks, CSV import support confirmed |
| **E-commerce** | Shopify Storefront API | 2024-10 | Phase 1 integration proven, handles cart/checkout/payments, real-time inventory, no custom payment logic needed |
| **Hosting** | Vercel | Latest | Optimal Next.js performance, global CDN, serverless functions, preview deployments, free tier for development, auto-deploy CI/CD |
| **State Management** | React Context API | 19.0.0 | Sufficient for app-level state (FilterContext, CartContext proven in Phase 1), no external library overhead, native to React |
| **Email Service** | Resend | 4.0.1 | Transactional emails (verification, password reset), React Email template support, free tier 100/day, modern DX |
| **Monitoring** | Sentry | 8.40.0 | Error tracking + performance monitoring, source maps support, free tier 5k errors/month, critical for dual-CMS complexity debugging |
| **Search (Phase 2a)** | Fuse.js | 7.0.0 | Client-side fuzzy search, zero cost, sufficient for MVP scale (<500 items), instant filtering UX |
| **Search (Phase 2b)** | Meilisearch Cloud | N/A (future) | Upgrade path when inventory exceeds 200 items, <300ms search (NFR009), typo tolerance, free tier 100k docs |
| **Caching** | In-Memory + Vercel Edge | N/A | Free tier strategy: in-memory cache for API responses, Vercel Edge for static assets, Upstash Redis upgrade path if needed |
| **Icon Library** | Lucide React | 0.468.0 | Lightweight SVG icons, tree-shakeable, Phase 1 consistency, accessibility-friendly |
| **Forms** | React Hook Form | 7.54.0 | Uncontrolled form performance, validation, minimal re-renders, user-friendly for complex forms (vehicle inquiry, auth) |
| **HTTP Client** | Native Fetch API | Built-in | Next.js fetch with automatic caching, no external dependency, sufficient for REST APIs |
| **CSV Processing** | Papa Parse | 5.4.1 | Vehicle data migration from CSV, streaming support for large files, error handling |
| **Date Handling** | date-fns | 4.1.0 | Lightweight date utilities, tree-shakeable, no moment.js bloat |
| **Testing Framework** | Vitest | 2.1.0 | Fast unit tests, compatible with Next.js, ESM support |
| **E2E Testing** | Playwright | 1.49.0 | Browser automation, component testing, Phase 1 validation proven |
| **Linting** | ESLint | 9.15.0 | Code quality, Next.js plugin, accessibility linting (eslint-plugin-jsx-a11y) |
| **Formatting** | Prettier | 3.4.0 | Consistent code style, auto-format on save |
| **CI/CD** | Vercel Auto-Deploy | Built-in | Zero config, preview per branch, automatic production deploys on main |

**Dependency Philosophy:**
- **Minimize external dependencies** to reduce bundle size and security surface
- **Leverage Next.js built-ins** (Image, Link, fetch) over third-party alternatives
- **Free tier first** with clear upgrade paths when scale demands
- **Type-safe everything** to catch errors early (helps React learning curve)

## 2. Application Architecture

### 2.1 Architecture Pattern

**Pattern:** Monolithic Next.js Application with Dual-CMS Integration

```
┌─────────────────────────────────────────────────────────┐
│           Next.js 15 Application (Monolith)             │
│  ┌──────────────────────────────────────────────────┐  │
│  │              App Router Pages                     │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┐   │  │
│  │  │ Products │ Vehicles │   User   │  Search  │   │  │
│  │  │  (SSG)   │  (ISR)   │  (SSR)   │ (Client) │   │  │
│  │  └──────────┴──────────┴──────────┴──────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Business Logic Layer (lib/)              │  │
│  │  ┌────────┬─────────┬─────────┬─────────────┐    │  │
│  │  │Vehicle │ Product │  User   │   Search    │    │  │
│  │  │Service │ Service │ Service │   Service   │    │  │
│  │  └────────┴─────────┴─────────┴─────────────┘    │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │        API Routes (/api)                          │  │
│  │  - NextAuth endpoints                             │  │
│  │  - Sanity webhooks (revalidation)                 │  │
│  │  - Shopify webhooks (inventory)                   │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────┬──────────────┬───────────┬─────────┘
                   │              │           │
                   ▼              ▼           ▼
        ┌──────────────┐  ┌───────────┐  ┌─────────────┐
        │  Sanity CMS  │  │  Shopify  │  │   Vercel    │
        │  (Vehicles)  │  │    API    │  │  Postgres   │
        │  - Content   │  │  - Cart   │  │  - Users    │
        │  - Images    │  │  - Orders │  │  - Favorites│
        │  - Webhooks  │  │  - Stock  │  │  - Sessions │
        └──────────────┘  └───────────┘  └─────────────┘
```

**Architecture Rationale:**

1. **Monolithic Over Microservices:**
   - Single Next.js app simplifies deployment and debugging
   - Shared navigation, search, and user state require single context
   - Team size (fairly new to React) benefits from single codebase
   - Future migration to microservices possible if scale demands (extract services to APIs)

2. **Dual-CMS Strategy:**
   - **Sanity CMS:** Vehicle content (specs, images, service history) requires flexible schema and editor-friendly interface
   - **Shopify API:** Parts e-commerce proven in Phase 1, handles cart/checkout/payments robustly
   - **No single CMS:** Neither Sanity nor Shopify alone handles both content types optimally

3. **Hybrid Rendering:**
   - **SSG (Static):** Product listings, static pages (fast, cacheable)
   - **ISR (Incremental Static):** Vehicle pages revalidate via webhooks (<60s per NFR006)
   - **SSR (Server-Side):** User dashboard, personalized content (auth-required)
   - **Client-Side:** Search, filters (instant feedback, no server round-trip)

**Trade-offs Accepted:**
- ✅ **Pros:** Simpler deployment, unified state, faster development, easier debugging
- ⚠️ **Cons:** Larger bundle size (mitigated by code splitting), entire app scales together (acceptable for projected traffic)

### 2.2 Server-Side Rendering Strategy

**Rendering Decision Matrix:**

| Page Type | Strategy | Revalidation | Rationale |
|-----------|----------|--------------|-----------|
| **Product Listing** | SSG | On-demand (Shopify webhook) | Static, cacheable, infrequent changes |
| **Product Detail** | SSG + ISR | 300s + webhook | Pre-render popular products, revalidate on inventory changes |
| **Vehicle Listing** | ISR | 60s + webhook | Fresh inventory status per NFR006 |
| **Vehicle Detail** | ISR | 60s + webhook | Sanity webhook triggers on-demand revalidation |
| **Homepage** | ISR | 60s | Featured vehicles + parts, needs freshness |
| **Search Results** | Client-Side | N/A | Dynamic filtering, no pre-rendering |
| **User Dashboard** | SSR | N/A | Personalized, auth-required |
| **My Garage (Favorites)** | SSR | N/A | User-specific data from Postgres |
| **Auth Pages** | SSG | N/A | Static login/register forms |

**ISR Implementation Example:**

```typescript
// app/vehicles/[slug]/page.tsx
export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function generateStaticParams() {
  // Pre-render 50 most popular vehicles at build time
  const vehicles = await sanity.fetch(`
    *[_type == "vehicle" && status == "current"][0...50] {
      "slug": slug.current
    }
  `);
  return vehicles.map(v => ({ slug: v.slug }));
}

export default async function VehiclePage({ params }) {
  const vehicle = await sanity.fetch(`
    *[_type == "vehicle" && slug.current == $slug][0]
  `, { slug: params.slug });

  return <VehicleDetail vehicle={vehicle} />;
}
```

**Webhook-Driven Revalidation:**

```typescript
// app/api/revalidate/vehicle/[slug]/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  // 1. Verify Sanity webhook signature
  const signature = req.headers.get('sanity-webhook-signature');
  const body = await req.text();
  const expectedSig = crypto
    .createHmac('sha256', process.env.SANITY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  if (signature !== `sha256=${expectedSig}`) {
    return new Response('Invalid signature', { status: 401 });
  }

  // 2. Revalidate vehicle page
  revalidatePath(`/vehicles/${params.slug}`);

  // 3. Revalidate listing page (in case status changed)
  revalidatePath('/vehicles');

  return new Response('Revalidated', { status: 200 });
}
```

**Performance Benefits:**
- **Instant page loads:** Pre-rendered HTML served from Vercel Edge (<100ms TTFB)
- **Fresh content:** 60s revalidation + webhook keeps inventory current
- **Reduced API calls:** Cached responses reduce Sanity/Shopify API usage
- **Scalability:** Edge caching handles traffic spikes without backend load

### 2.3 Page Routing and Navigation

**Route Structure:**

```
/                           # Homepage (ISR) - Featured vehicles + parts
├── /vehicles               # Vehicle listing (ISR, 60s)
│   ├── /[slug]            # Vehicle detail (ISR, 60s + webhook)
│   └── /filter            # Client-side filtered results
├── /products              # Product listing (SSG) - existing Phase 1
│   ├── /[handle]          # Product detail (SSG + ISR)
│   ├── /search            # Search results (Client)
│   └── /compare           # Product comparison (Client)
├── /search                # Unified search (Client + SSR hybrid)
├── /dashboard             # User dashboard (SSR, protected)
│   ├── /profile           # User profile (SSR)
│   ├── /garage            # My Garage favorites (SSR)
│   └── /orders            # Order history (SSR, Shopify integration)
├── /auth                  # Auth pages (SSG)
│   ├── /signin            # Login (SSG)
│   ├── /signup            # Register (SSG)
│   └── /reset-password    # Password reset (SSG)
└── /api                   # API routes
    ├── /auth/[...nextauth] # NextAuth endpoints
    ├── /revalidate/*       # Webhook endpoints
    └── /webhooks/*         # Sanity/Shopify webhooks
```

**Navigation Components:**

```typescript
// components/shared/Navigation.tsx (Unified Header)
export function Navigation() {
  const session = useSession(); // NextAuth session
  const { vehicleSelection } = useFilters(); // Context API

  return (
    <header>
      <Logo />
      <VehicleSelector current={vehicleSelection} />
      <nav>
        <NavLink href="/vehicles">Vehicles</NavLink>
        <NavLink href="/products">Parts</NavLink>
      </nav>
      <UnifiedSearchBar />
      {session ? (
        <UserMenu user={session.user} />
      ) : (
        <Link href="/auth/signin">Sign In</Link>
      )}
      <CartIcon />
    </header>
  );
}
```

**Route Guards (Protected Routes):**

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ token }) {
      return !!token;
    },
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/favorites/:path*'],
};
```

### 2.4 Data Fetching Approach

**Data Fetching Patterns by Source:**

1. **Sanity CMS (Vehicles):**

```typescript
// lib/sanity/client.ts
import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false, // Disable CDN for fresh data
  apiVersion: '2024-10-21',
  token: process.env.SANITY_API_TOKEN, // For mutations in webhooks
});

// lib/sanity/queries.ts
export const vehicleListQuery = `
  *[_type == "vehicle" && status == $status] | order(createdAt desc) {
    _id,
    title,
    year,
    model,
    price,
    "images": images[0...3]{
      asset->{url, metadata}
    },
    status,
    "slug": slug.current
  }
`;

export async function getVehicles(status: 'current' | 'sold' = 'current') {
  return sanity.fetch(vehicleListQuery, { status });
}
```

2. **Shopify API (Products) - Existing from Phase 1:**

```typescript
// lib/shopify/client.ts (Phase 1 proven)
export async function shopifyFetch(query: string, variables = {}) {
  const res = await fetch(process.env.SHOPIFY_GRAPHQL_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!res.ok) throw new Error('Shopify API error');
  return res.json();
}
```

3. **Vercel Postgres (User Data):**

```typescript
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// lib/db/favorites.ts
export async function getUserFavorites(userId: string) {
  return prisma.userFavorite.findMany({
    where: { userId },
    include: {
      // Join with vehicle/product data as needed
    },
  });
}

export async function addToGarage(userId: string, itemType: 'vehicle' | 'product', itemId: string) {
  return prisma.userFavorite.create({
    data: { userId, itemType, itemId },
  });
}
```

**Caching Strategy:**

| Data Source | Cache Layer | TTL | Invalidation |
|-------------|------------|-----|--------------|
| Sanity (vehicles) | Next.js fetch cache + ISR | 60s | Webhook on content change |
| Shopify (products) | Next.js fetch cache | 300s | Webhook on inventory change |
| Postgres (users) | No cache (always fresh) | N/A | N/A |
| Images (Sanity CDN) | Vercel Edge + browser | 1 year | Version in URL |
| Images (Shopify CDN) | Vercel Edge + browser | 1 year | Version in URL |

**In-Memory Cache for API Rate Limiting:**

```typescript
// lib/cache/memory.ts
const cache = new Map<string, { data: any; expires: number }>();

export function getCached<T>(key: string, ttl: number, fetchFn: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return Promise.resolve(cached.data);
  }

  return fetchFn().then(data => {
    cache.set(key, { data, expires: Date.now() + ttl });
    return data;
  });
}
```

## 3. Data Architecture

### 3.1 Database Schema

**Vercel Postgres Schema (via Prisma):**

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}

generator client {
  provider = "prisma-client-js"
}

// NextAuth.js tables
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  favorites     UserFavorite[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Custom tables
model UserFavorite {
  id        String   @id @default(cuid())
  userId    String
  itemType  String   // 'vehicle' or 'product'
  itemId    String   // Sanity vehicle ID or Shopify product ID
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, itemType, itemId])
  @@index([userId])
}
```

**Sanity CMS Schema (Vehicles):**

```typescript
// sanity/schemas/vehicle.ts
export default {
  name: 'vehicle',
  title: 'Vehicle',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: Rule => Rule.required().min(1900).max(2100),
    },
    {
      name: 'model',
      title: 'Model',
      type: 'string', // E.g., 'E46', 'E90', 'X3'
      validation: Rule => Rule.required(),
    },
    {
      name: 'trim',
      title: 'Trim',
      type: 'string', // E.g., 'M3', '330i', 'xDrive28i'
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: Rule => Rule.required().min(0),
    },
    {
      name: 'mileage',
      title: 'Mileage',
      type: 'number',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Current', value: 'current' },
          { title: 'Sold', value: 'sold' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: Rule => Rule.required().min(1).max(30),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'specifications',
      title: 'Specifications',
      type: 'object',
      fields: [
        { name: 'engine', type: 'string' },
        { name: 'transmission', type: 'string' },
        { name: 'drivetrain', type: 'string' },
        { name: 'exteriorColor', type: 'string' },
        { name: 'interiorColor', type: 'string' },
        { name: 'vin', type: 'string' },
      ],
    },
    {
      name: 'serviceHistory',
      title: 'Service History',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date', type: 'date' },
            { name: 'description', type: 'text' },
            { name: 'mileage', type: 'number' },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      status: 'status',
      media: 'images.0',
    },
    prepare({ title, year, status, media }) {
      return {
        title: `${year} ${title}`,
        subtitle: status === 'current' ? '🟢 Current' : '🔴 Sold',
        media,
      };
    },
  },
};
```

### 3.2 Data Models and Relationships

**Entity Relationship Diagram:**

```
┌────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  User (PG)     │     │  Vehicle     │     │   Product       │
│  - id          │────<│  (Sanity)    │     │   (Shopify)     │
│  - email       │  1:N│  - _id       │     │   - id          │
│  - name        │     │  - model     │     │   - title       │
│  - image       │     │  - year      │     │   - price       │
└────────────────┘     │  - status    │     │   - tags        │
         │             │  - images[]  │     │   - vendor      │
         │             └──────────────┘     └─────────────────┘
         │                      │                      │
         │                      │                      │
         │                      └──────────┬───────────┘
         │                                 │
         │             ┌───────────────────▼──────────┐
         └────────────>│   UserFavorite (PG)         │
                  1:N  │   - userId                   │
                       │   - itemType (vehicle/product)│
                       │   - itemId (Sanity/_id or Shopify/id)│
                       └──────────────────────────────┘
```

**Cross-CMS Linking Strategy:**

1. **Vehicle → Compatible Parts:**
   - Vehicle model/year stored in Sanity
   - Product fitment tags stored in Shopify (e.g., "BMW E46 2001-2006")
   - Match in application layer:

```typescript
export async function getCompatibleParts(vehicle: Vehicle) {
  const fitmentTag = `BMW ${vehicle.model} ${vehicle.year}`;

  return shopifyFetch(`
    query($tag: String!) {
      products(first: 12, query: $tag) {
        edges {
          node { id, title, priceRange, tags }
        }
      }
    }
  `, { tag: fitmentTag });
}
```

2. **Product → Compatible Vehicles:**
   - Product tags in Shopify (e.g., "BMW E46 2001-2006", "BMW X3 2011-2017")
   - Query Sanity for matching vehicles:

```typescript
export async function getCompatibleVehicles(productTags: string[]) {
  // Extract model/year from tags
  const modelYears = productTags
    .filter(tag => tag.startsWith('BMW'))
    .map(parseFitmentTag); // Extract {model, yearRange}

  return sanity.fetch(`
    *[_type == "vehicle" &&
      model in $models &&
      year >= $minYear &&
      year <= $maxYear &&
      status == "current"
    ]
  `, { models, minYear, maxYear });
}
```

### 3.3 Data Migrations Strategy

**Prisma Migrations (Postgres):**

```bash
# Generate migration
npx prisma migrate dev --name add_user_favorites

# Apply to production
npx prisma migrate deploy

# Generate Prisma Client types
npx prisma generate
```

**CSV Vehicle Import (Sanity):**

```typescript
// scripts/import-vehicles.ts
import { sanity } from '../lib/sanity/client';
import csv from 'csv-parser';
import fs from 'fs';

const results: any[] = [];

fs.createReadStream('data/vehicles.csv')
  .pipe(csv())
  .on('data', (row) => results.push(row))
  .on('end', async () => {
    console.log(`Importing ${results.length} vehicles...`);

    for (const row of results) {
      try {
        await sanity.create({
          _type: 'vehicle',
          title: `${row.year} BMW ${row.model} ${row.trim}`,
          slug: {
            _type: 'slug',
            current: slugify(`${row.year}-bmw-${row.model}-${row.trim}`),
          },
          year: parseInt(row.year),
          model: row.model,
          trim: row.trim,
          price: parseFloat(row.price),
          mileage: parseInt(row.mileage),
          status: row.status === 'sold' ? 'sold' : 'current',
          description: row.description,
          specifications: {
            engine: row.engine,
            transmission: row.transmission,
            drivetrain: row.drivetrain,
            exteriorColor: row.exterior_color,
            interiorColor: row.interior_color,
            vin: row.vin,
          },
          // Images handled separately (manual upload or batch via Sanity API)
        });
        console.log(`✓ Imported ${row.year} ${row.model}`);
      } catch (err) {
        console.error(`✗ Failed to import ${row.year} ${row.model}:`, err);
      }
    }

    console.log('Import complete!');
  });
```

**Migration Validation:**

1. **Dry Run:** Test import script with 10 records, verify Sanity Studio preview
2. **Data Validation:** Check required fields, validate ranges (year 1900-2100, price >0)
3. **Backup:** Export existing Sanity data before full import
4. **Staging First:** Run migration in Sanity staging dataset before production

## 4. API Design

### 4.1 API Structure

**API Routes Overview:**

```
/api
├── /auth
│   └── /[...nextauth]        # NextAuth.js endpoints (GET/POST)
├── /revalidate
│   └── /vehicle/[slug]       # Sanity webhook revalidation (POST)
├── /webhooks
│   ├── /sanity               # Sanity content updates (POST)
│   └── /shopify              # Shopify inventory updates (POST)
├── /favorites
│   ├── /add                  # Add to garage (POST, protected)
│   ├── /remove               # Remove from garage (DELETE, protected)
│   └── /list                 # Get user favorites (GET, protected)
└── /search
    └── /unified              # Unified search endpoint (GET, optional)
```

### 4.2 API Routes

**Authentication Endpoints (NextAuth.js):**

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: 'database' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Favorites API (Protected):**

```typescript
// app/api/favorites/add/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { itemType, itemId } = await req.json();

  if (!['vehicle', 'product'].includes(itemType)) {
    return new Response('Invalid itemType', { status: 400 });
  }

  try {
    const favorite = await prisma.userFavorite.create({
      data: {
        userId: session.user.id,
        itemType,
        itemId,
      },
    });

    return Response.json(favorite);
  } catch (err: any) {
    if (err.code === 'P2002') {
      // Already favorited
      return new Response('Already in garage', { status: 409 });
    }
    throw err;
  }
}
```

**Webhook Endpoints:**

```typescript
// app/api/revalidate/vehicle/[slug]/route.ts
import { revalidatePath } from 'next/cache';
import { verifyWebhookSignature } from '@/lib/webhooks/verify';

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const isValid = await verifyWebhookSignature(req, 'sanity');
  if (!isValid) {
    return new Response('Invalid signature', { status: 401 });
  }

  revalidatePath(`/vehicles/${params.slug}`);
  revalidatePath('/vehicles'); // Listing page

  return Response.json({ revalidated: true, now: Date.now() });
}
```

### 4.3 Form Actions and Mutations

**Server Actions (Next.js 15):**

```typescript
// app/actions/favorites.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function addToGarage(itemType: 'vehicle' | 'product', itemId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  await prisma.userFavorite.create({
    data: { userId: session.user.id, itemType, itemId },
  });

  revalidatePath('/dashboard/garage');
  return { success: true };
}

export async function removeFromGarage(favoriteId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  await prisma.userFavorite.delete({
    where: { id: favoriteId, userId: session.user.id },
  });

  revalidatePath('/dashboard/garage');
  return { success: true };
}
```

**Form Component:**

```typescript
// components/favorites/AddToGarageButton.tsx
'use client';

import { addToGarage } from '@/app/actions/favorites';
import { useTransition } from 'react';

export function AddToGarageButton({ itemType, itemId }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => addToGarage(itemType, itemId))}
      disabled={isPending}
    >
      {isPending ? 'Adding...' : 'Add to Garage'}
    </button>
  );
}
```

## 5. Authentication and Authorization

### 5.1 Auth Strategy

**Authentication Provider: NextAuth.js v5**

**Supported Methods:**
1. **Email/Password** (via Email Magic Link)
2. **Google OAuth**
3. **Facebook OAuth**

**User Flow:**

```
New User Registration:
1. User clicks "Sign Up" → /auth/signup
2. Selects provider (Google/Facebook) or enters email
3. OAuth: Redirects to provider → callback → creates User record
4. Email: Sends magic link → clicks link → creates User record
5. Redirects to /dashboard with session cookie

Returning User Login:
1. User clicks "Sign In" → /auth/signin
2. OAuth: Redirects to provider → callback → loads existing User
3. Email: Sends magic link → clicks link → loads User
4. Redirects to intended page with session
```

**Session Storage:**

```typescript
// Database sessions (not JWT)
// Pros: Revocable, no token size limits, secure
// Cons: Database query per request (mitigated by caching)

session: {
  strategy: 'database',
  maxAge: 30 * 24 * 60 * 60, // 30 days (per NFR007)
}
```

### 5.2 Session Management

**Session Cookie Configuration:**

```typescript
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true, // HTTPS only in production
    },
  },
}
```

**Session Access Patterns:**

```typescript
// Server Component (App Router)
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  return <Dashboard user={session.user} />;
}

// Client Component (useSession hook)
'use client';
import { useSession } from 'next-auth/react';

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <Skeleton />;
  if (!session) return <SignInButton />;

  return <UserDropdown user={session.user} />;
}
```

### 5.3 Protected Routes

**Middleware-Based Protection:**

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ token }) {
      return !!token; // Must have session token
    },
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',      // All dashboard routes
    '/api/favorites/:path*',  // Favorites API
  ],
};
```

**Route-Level Protection:**

```typescript
// app/dashboard/layout.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin?callbackUrl=/dashboard');

  return (
    <div>
      <DashboardNav />
      {children}
    </div>
  );
}
```

### 5.4 Role-Based Access Control

**Phase 2 Scope:** Simple authenticated vs. unauthenticated (no roles)

**Future Enhancement:**

```prisma
// Future: Add role field to User model
model User {
  id     String @id @default(cuid())
  email  String @unique
  role   String @default("customer") // customer | editor | admin
  // ...
}
```

**Current Access Matrix:**

| Feature | Guest | Authenticated User |
|---------|-------|-------------------|
| Browse vehicles/products | ✅ Yes | ✅ Yes |
| Search | ✅ Yes | ✅ Yes |
| View details | ✅ Yes | ✅ Yes |
| Add to cart | ✅ Yes | ✅ Yes |
| **Save to garage** | ❌ No | ✅ Yes |
| **View favorites** | ❌ No | ✅ Yes |
| **Order history** | ❌ No | ✅ Yes (Shopify integration) |
| **Profile management** | ❌ No | ✅ Yes |

## 6. State Management

### 6.1 Server State

**Strategy:** Server Components + ISR/SSR (no client-side state library needed)

**Data Fetching in Server Components:**

```typescript
// app/vehicles/page.tsx (Server Component)
export default async function VehiclesPage() {
  // Fetch directly in component (no useState, useEffect)
  const vehicles = await getVehicles('current');

  return <VehicleGrid vehicles={vehicles} />;
}
```

**Benefits:**
- No client-side data fetching (smaller bundle)
- Automatic deduplication (Next.js fetch cache)
- TypeScript end-to-end (Prisma/Sanity types → component props)

### 6.2 Client State

**Strategy:** React Context API for app-level state

**Existing from Phase 1:**

```typescript
// contexts/FilterContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type FilterState = {
  vehicleSelection?: { model: string; year: string };
  categories: string[];
  vendors: string[];
  searchTerm: string;
};

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    vendors: [],
    searchTerm: '',
  });

  // Persist vehicle selection to localStorage
  useEffect(() => {
    if (filters.vehicleSelection) {
      localStorage.setItem('vehicle', JSON.stringify(filters.vehicleSelection));
    }
  }, [filters.vehicleSelection]);

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilters must be used within FilterProvider');
  return context;
}
```

**Phase 2 Addition:**

```typescript
// contexts/GarageContext.tsx (Client-side favorite state)
'use client';

import { createContext, useContext, useState } from 'react';
import { addToGarage, removeFromGarage } from '@/app/actions/favorites';

type GarageState = {
  favorites: UserFavorite[];
  addFavorite: (itemType: string, itemId: string) => Promise<void>;
  removeFavorite: (favoriteId: string) => Promise<void>;
};

export function GarageProvider({ children, initialFavorites }: Props) {
  const [favorites, setFavorites] = useState(initialFavorites);

  const addFavorite = async (itemType: string, itemId: string) => {
    await addToGarage(itemType, itemId);
    // Optimistic update
    setFavorites(prev => [...prev, { itemType, itemId }]);
  };

  return (
    <GarageContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </GarageContext.Provider>
  );
}
```

### 6.3 Form State

**Strategy:** React Hook Form for complex forms

```typescript
// components/auth/SignUpForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    // Call NextAuth signUp or custom API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* ... */}
    </form>
  );
}
```

### 6.4 Caching Strategy

**Multi-Layer Caching:**

1. **Vercel Edge Cache:** ISR pages cached globally
2. **Next.js Fetch Cache:** API responses cached per request (5-minute default)
3. **In-Memory Cache:** Shopify/Sanity responses cached in serverless functions

```typescript
// lib/cache/strategy.ts
export const CACHE_CONFIG = {
  sanity: {
    vehicles: 60, // 60s (matches ISR revalidation)
    vehicle: 60,
  },
  shopify: {
    products: 300, // 5 minutes
    product: 300,
    cart: 0, // No cache (always fresh)
  },
  postgres: {
    favorites: 0, // No cache (always fresh)
    user: 300, // 5 minutes (profile data)
  },
};
```

**Cache Invalidation:**

| Trigger | Action |
|---------|--------|
| Sanity content update | Webhook → `revalidatePath()` |
| Shopify inventory change | Webhook → `revalidatePath()` |
| User adds favorite | Server Action → `revalidatePath('/dashboard/garage')` |
| Manual revalidation | Sanity Studio button → API call |

## 7. UI/UX Architecture

### 7.1 Component Structure

**Component Organization (Feature-Based):**

```
components/
├── shared/             # Cross-epic components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── UnifiedSearchBar.tsx
│   └── UserMenu.tsx
├── vehicles/           # Epic 3
│   ├── VehicleCard.tsx
│   ├── VehicleGrid.tsx
│   ├── VehicleDetail.tsx
│   ├── VehicleGallery.tsx
│   ├── VehicleFilters.tsx
│   └── VehicleStatus.tsx
├── products/           # Epic 1 (existing)
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── FilterPanel.tsx
│   └── FitmentBadge.tsx
├── user/              # Epic 5
│   ├── AuthForms.tsx
│   ├── UserDashboard.tsx
│   ├── MyGarage.tsx
│   └── UserProfile.tsx
├── search/            # Epic 6
│   ├── SearchResults.tsx
│   ├── RecommendationCarousel.tsx
│   └── CrossDiscoveryLinks.tsx
└── ui/                # ShadCN components
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── input.tsx
    └── ...
```

**Component Design Principles:**

1. **Server Components by Default:** Use 'use client' only when needed (interactions, state)
2. **Composition over Props:** Small, focused components composed together
3. **Accessibility First:** WCAG 2.1 AA compliance via ShadCN primitives
4. **TypeScript Strict:** All props typed, no implicit any

**Example Component:**

```typescript
// components/vehicles/VehicleCard.tsx (Server Component)
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { AddToGarageButton } from './AddToGarageButton'; // Client Component

type Props = {
  vehicle: {
    _id: string;
    title: string;
    year: number;
    model: string;
    price: number;
    images: { url: string }[];
    status: 'current' | 'sold';
    slug: string;
  };
};

export function VehicleCard({ vehicle }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-lg border">
      <Link href={`/vehicles/${vehicle.slug}`}>
        <div className="aspect-[4/3] relative">
          <Image
            src={vehicle.images[0].url}
            alt={vehicle.title}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{vehicle.title}</h3>
            <p className="text-2xl font-bold mt-2">
              ${vehicle.price.toLocaleString()}
            </p>
          </div>
          <Badge variant={vehicle.status === 'current' ? 'success' : 'secondary'}>
            {vehicle.status === 'current' ? 'Available' : 'Sold'}
          </Badge>
        </div>

        <div className="mt-4 flex gap-2">
          <Link href={`/vehicles/${vehicle.slug}`} className="btn-primary flex-1">
            View Details
          </Link>
          <AddToGarageButton vehicleId={vehicle._id} />
        </div>
      </div>
    </article>
  );
}
```

### 7.2 Styling Approach

**Styling Stack:**
- Tailwind CSS 4 (utility-first)
- CSS variables for theming (design tokens from UX spec)
- ShadCN components (pre-styled with Tailwind)

**Design Tokens (app/globals.css):**

```css
@layer base {
  :root {
    /* Brand Colors */
    --brand-red: 13 88% 48%;      /* #D12026 */
    --brand-navy: 245 47% 27%;    /* #292664 */
    --brand-blue: 204 61% 56%;    /* #529BCA */
    --brand-dark: 210 32% 12%;    /* #141C27 */

    /* Semantic Colors */
    --success: 142 71% 45%;       /* Green for "Fits Your BMW" */
    --warning: 38 92% 50%;        /* Yellow for "Check Fitment" */
    --error: 0 84% 60%;           /* Red for errors */

    /* Neutral Scale */
    --neutral-50: 0 0% 98%;
    --neutral-100: 0 0% 96%;
    --neutral-800: 0 0% 15%;
    --neutral-900: 0 0% 9%;

    /* Typography */
    --font-sans: 'Inter', -apple-system, system-ui, sans-serif;
    --font-display: 'Outfit', var(--font-sans);

    /* Spacing */
    --space-unit: 0.25rem; /* 4px base */

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }
}
```

**Responsive Design:**

```typescript
// Mobile-first Tailwind classes
<div className="
  grid
  grid-cols-1        // 1 column on mobile
  sm:grid-cols-2     // 2 columns on tablet (640px+)
  lg:grid-cols-3     // 3 columns on desktop (1024px+)
  xl:grid-cols-4     // 4 columns on large desktop (1280px+)
  gap-4 sm:gap-6 lg:gap-8
">
```

### 7.3 Responsive Design

**Breakpoints (Tailwind defaults):**

```javascript
// tailwind.config.ts
theme: {
  screens: {
    'sm': '640px',   // Tablet
    'md': '768px',   // Desktop
    'lg': '1024px',  // Large desktop
    'xl': '1280px',  // XL desktop
    '2xl': '1536px', // 2XL desktop
  }
}
```

**Mobile-First Patterns:**

1. **Product/Vehicle Grids:**
   - Mobile: 1 column, full-width cards
   - Tablet: 2 columns
   - Desktop: 3-4 columns

2. **Navigation:**
   - Mobile: Hamburger menu, collapsible search
   - Desktop: Full nav, expanded search bar

3. **Filters:**
   - Mobile: Slide-out drawer (HeadlessUI Dialog)
   - Desktop: Fixed sidebar

4. **Images:**
   - All: Next.js Image with responsive sizes
   - Mobile: 400px width served (not 2000px)
   - Desktop: 800px width

**Touch Targets (WCAG AA):**

```typescript
// Minimum 44x44px touch targets
<button className="min-h-[44px] min-w-[44px] touch-manipulation">
```

### 7.4 Accessibility

**WCAG 2.1 AA Compliance:**

1. **Color Contrast:**
   - Body text: 13.1:1 (neutral-800 on white)
   - Brand blue links: 3.1:1 (requires underline)
   - Success badges: 4.5:1 minimum

2. **Keyboard Navigation:**
   - All interactive elements tabbable
   - Focus indicators visible (2px brand-blue ring)
   - Skip links to main content

3. **Screen Readers:**
   - Semantic HTML (`<nav>`, `<main>`, `<article>`)
   - ARIA labels on icon buttons
   - Alt text on all images
   - Live regions for dynamic content (`aria-live="polite"`)

4. **Forms:**
   - Labels associated with inputs (`htmlFor`)
   - Error messages linked via `aria-describedby`
   - Required fields marked (`required` + visual indicator)

**Accessibility Testing:**

```bash
# Automated
npx @axe-core/cli http://localhost:3000

# Manual
# - VoiceOver (macOS): Cmd+F5
# - NVDA (Windows): Free download
# - Keyboard only: Unplug mouse, Tab through all pages
```

## 8. Performance Optimization

### 8.1 SSR Caching

**Vercel Edge Caching:**

- ISR pages cached globally at 300+ edge locations
- Cache-Control headers automatic (`s-maxage`, `stale-while-revalidate`)
- 60s revalidation for vehicles, 300s for products

### 8.2 Static Generation

**Build-Time Pre-Rendering:**

```typescript
// app/vehicles/[slug]/page.tsx
export async function generateStaticParams() {
  // Pre-render 50 most popular vehicles
  const vehicles = await sanity.fetch(`
    *[_type == "vehicle" && status == "current"]
    | order(views desc)[0...50] {
      "slug": slug.current
    }
  `);

  return vehicles.map(v => ({ slug: v.slug }));
}
```

**On-Demand ISR:**

- Less popular vehicles rendered on first request
- Cached after first render (subsequent requests instant)
- 60s background revalidation keeps cache fresh

### 8.3 Image Optimization

**Critical for Image-Heavy Site:**

```typescript
// Next.js Image component (automatic optimization)
<Image
  src={vehicle.images[0].url}
  alt={vehicle.title}
  width={800}
  height={600}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"  // Below-fold images
  priority        // Above-fold hero image
/>
```

**Image CDN Strategy:**

- **Sanity Images:** Sanity CDN with automatic WebP/AVIF conversion
- **Shopify Images:** Shopify CDN with query params for sizing
- **Next.js:** Further optimization layer (format conversion, responsive sizes)

**Bandwidth Monitoring:**

```typescript
// Vercel Analytics API (weekly check)
// Monitor bandwidth usage for 10-30 images per vehicle
// Alert if approaching 100GB/month (Hobby plan limit)
```

### 8.4 Code Splitting

**Automatic Route-Based Splitting:**

```typescript
// Each route gets own bundle
// /vehicles → vehicles bundle (~50KB)
// /products → products bundle (~45KB)
// /dashboard → dashboard bundle (~30KB)
```

**Dynamic Imports for Heavy Components:**

```typescript
// components/vehicles/VehicleGallery.tsx
import dynamic from 'next/dynamic';

const LightboxModal = dynamic(() => import('./LightboxModal'), {
  loading: () => <Skeleton />,
  ssr: false, // Client-side only
});
```

**Bundle Analysis:**

```bash
# Analyze bundle size
ANALYZE=true npm run build

# Target: Total bundle <200KB (gzipped)
```

## 9. SEO and Meta Tags

### 9.1 Meta Tag Strategy

**Dynamic Meta Tags (Next.js Metadata API):**

```typescript
// app/vehicles/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const vehicle = await getVehicle(params.slug);

  return {
    title: `${vehicle.year} ${vehicle.model} ${vehicle.trim} for Sale | Enthusiast Auto`,
    description: `${vehicle.year} BMW ${vehicle.model} ${vehicle.trim} - ${vehicle.mileage} miles - $${vehicle.price.toLocaleString()}. ${vehicle.description.slice(0, 150)}...`,
    openGraph: {
      title: vehicle.title,
      description: vehicle.description,
      images: [vehicle.images[0].url],
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: vehicle.title,
      description: vehicle.description,
      images: [vehicle.images[0].url],
    },
  };
}
```

### 9.2 Sitemap

**Dynamic Sitemap Generation:**

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await sanity.fetch(`*[_type == "vehicle"] { "slug": slug.current, _updatedAt }`);
  const products = await getProducts();

  return [
    {
      url: 'https://shop.enthusiastauto.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...vehicles.map(v => ({
      url: `https://shop.enthusiastauto.com/vehicles/${v.slug}`,
      lastModified: new Date(v._updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...products.map(p => ({
      url: `https://shop.enthusiastauto.com/products/${p.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ];
}
```

### 9.3 Structured Data

**Schema.org Markup (Vehicles):**

```typescript
// components/vehicles/VehicleDetail.tsx
export function VehicleDetail({ vehicle }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: vehicle.title,
    manufacturer: 'BMW',
    model: vehicle.model,
    vehicleModelDate: vehicle.year,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.mileage,
      unitCode: 'SMI',
    },
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'USD',
      availability: vehicle.status === 'current'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    image: vehicle.images.map(img => img.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Component JSX */}
    </>
  );
}
```

## 10. Deployment Architecture

### 10.1 Hosting Platform

**Platform:** Vercel (confirmed preference)

**Vercel Features Leveraged:**
- Serverless Functions (Next.js API routes)
- Edge Network (global CDN for static assets + ISR)
- Preview Deployments (auto-deploy per git branch)
- Environment Variables (per environment)
- Web Analytics (Core Web Vitals)
- Image Optimization (automatic WebP/AVIF)

**Architecture Diagram:**

```
GitHub Repository (main branch)
        │
        │ git push
        ▼
  Vercel Auto-Deploy
        │
        ├──> Build (next build)
        │    - Pre-render SSG pages
        │    - Compile TypeScript
        │    - Optimize images
        │
        ├──> Deploy to Edge Network
        │    - Static assets → 300+ locations
        │    - Serverless functions → US region
        │
        └──> Production Live
             https://shop.enthusiastauto.com
```

### 10.2 CDN Strategy

**Content Delivery:**

| Asset Type | CDN | Cache Duration | Invalidation |
|------------|-----|----------------|--------------|
| Static pages (SSG) | Vercel Edge | Until revalidation | Webhook |
| ISR pages | Vercel Edge | 60-300s | Webhook + time |
| Images (Sanity) | Sanity CDN → Vercel Edge | 1 year | URL versioning |
| Images (Shopify) | Shopify CDN → Vercel Edge | 1 year | URL versioning |
| JS bundles | Vercel Edge | 1 year | Hash in filename |
| CSS files | Vercel Edge | 1 year | Hash in filename |

**Cache Headers (Automatic):**

```
# ISR page (60s revalidation)
Cache-Control: s-maxage=60, stale-while-revalidate

# Static assets
Cache-Control: public, max-age=31536000, immutable
```

### 10.3 Edge Functions

**Use Cases:**

1. **Geolocation (future):** Redirect based on user location
2. **A/B Testing (future):** Serve different variants
3. **Auth checks:** Middleware redirects for protected routes

**Current:** Standard Vercel serverless functions (no edge-specific logic needed for Phase 2)

### 10.4 Environment Configuration

**Environment Variables:**

```bash
# .env.local (development)
# .env.production (Vercel dashboard)

# Database
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://...?pgbouncer=true"

# NextAuth.js
NEXTAUTH_URL="https://shop.enthusiastauto.com"
NEXTAUTH_SECRET="<random-32-char-string>"
GOOGLE_CLIENT_ID="<oauth-client-id>"
GOOGLE_CLIENT_SECRET="<oauth-secret>"
FACEBOOK_CLIENT_ID="<oauth-client-id>"
FACEBOOK_CLIENT_SECRET="<oauth-secret>"

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID="<project-id>"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="<write-token>"
SANITY_WEBHOOK_SECRET="<random-string>"

# Shopify
SHOPIFY_STORE_DOMAIN="<store>.myshopify.com"
SHOPIFY_STOREFRONT_TOKEN="<storefront-api-token>"
SHOPIFY_GRAPHQL_URL="https://<store>.myshopify.com/api/2024-10/graphql.json"
SHOPIFY_WEBHOOK_SECRET="<random-string>"

# Resend (Email)
RESEND_API_KEY="<api-key>"
EMAIL_FROM="noreply@enthusiastauto.com"

# Sentry (Monitoring)
SENTRY_DSN="<sentry-dsn>"
SENTRY_AUTH_TOKEN="<auth-token>"

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="<analytics-id>"
```

**Environment Separation:**

```
Development:  .env.local → localhost:3000
Preview:      Vercel env vars → <branch>-enthusiastauto.vercel.app
Production:   Vercel env vars → shop.enthusiastauto.com
```

## 11. Component and Integration Overview

### 11.1 Major Modules

**13 Logical Components (from Step 4 analysis):**

**Presentation Layer (5):**
1. **Shared Components** - Navigation, Search, User Menu, Layout
2. **Vehicle Components** - VehicleCard, VehicleGrid, VehicleDetail, VehicleGallery
3. **Product Components** - ProductCard, ProductGrid, FilterPanel (existing Phase 1)
4. **User Components** - AuthForms, UserDashboard, MyGarage, UserProfile
5. **Search & Discovery** - UnifiedSearchBar, SearchResults, RecommendationCarousel

**Business Logic Layer (5):**
6. **Vehicle Service** - Sanity queries, filter logic, CSV import
7. **Product Service** - Shopify queries, fitment matching (existing Phase 1)
8. **User Service** - NextAuth config, favorites CRUD, profile management
9. **Search Service** - Unified search orchestration, Fuse.js integration
10. **Integration Layer** - Webhooks (Sanity/Shopify), ISR revalidation

**Data Layer (3):**
11. **Sanity CMS** - Vehicle content, images, service records
12. **Shopify API** - Product catalog, cart, checkout
13. **Vercel Postgres** - Users, sessions, favorites

### 11.2 Page Structure

**App Router Structure:**

```
app/
├── layout.tsx                    # Root layout (Navigation, Footer, Providers)
├── page.tsx                      # Homepage (ISR)
├── (vehicles)/
│   ├── vehicles/
│   │   ├── page.tsx             # Vehicle listing (ISR, 60s)
│   │   └── [slug]/
│   │       └── page.tsx         # Vehicle detail (ISR, 60s + webhook)
├── (products)/
│   ├── products/
│   │   ├── page.tsx             # Product listing (SSG)
│   │   ├── [handle]/
│   │   │   └── page.tsx         # Product detail (SSG + ISR)
│   │   └── compare/
│   │       └── page.tsx         # Product comparison (Client)
├── (search)/
│   └── search/
│       └── page.tsx             # Unified search (Client + SSR)
├── (user)/
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard layout (protected)
│   │   ├── page.tsx             # Dashboard home (SSR)
│   │   ├── garage/
│   │   │   └── page.tsx         # My Garage (SSR)
│   │   ├── profile/
│   │   │   └── page.tsx         # User profile (SSR)
│   │   └── orders/
│   │       └── page.tsx         # Order history (SSR)
├── (auth)/
│   └── auth/
│       ├── signin/
│       │   └── page.tsx         # Sign in (SSG)
│       ├── signup/
│       │   └── page.tsx         # Sign up (SSG)
│       └── error/
│           └── page.tsx         # Auth error (SSG)
└── api/
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts         # NextAuth endpoints
    ├── revalidate/
    │   └── vehicle/[slug]/
    │       └── route.ts         # Sanity webhook
    ├── webhooks/
    │   ├── sanity/
    │   │   └── route.ts         # Sanity content updates
    │   └── shopify/
    │       └── route.ts         # Shopify inventory updates
    └── favorites/
        ├── add/
        │   └── route.ts         # Add to garage (protected)
        └── remove/
            └── route.ts         # Remove from garage (protected)
```

### 11.3 Shared Components

**Cross-Epic Components:**

```typescript
// components/shared/Navigation.tsx
export function Navigation() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <VehicleSelector />
          <nav className="hidden md:flex space-x-6">
            <NavLink href="/vehicles">Vehicles</NavLink>
            <NavLink href="/products">Parts</NavLink>
          </nav>
          <div className="flex items-center gap-4">
            <UnifiedSearchBar />
            <UserMenu />
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}

// components/shared/UnifiedSearchBar.tsx (Epic 6)
'use client';

export function UnifiedSearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="search"
        placeholder="Search vehicles and parts..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-64 md:w-96 px-4 py-2 border rounded-lg"
      />
      <SearchIcon className="absolute right-3 top-2.5 text-gray-400" />
    </form>
  );
}
```

### 11.4 Third-Party Integrations

**External Service Dependencies:**

| Service | Purpose | Integration Point | Fallback Strategy |
|---------|---------|-------------------|-------------------|
| **Sanity CMS** | Vehicle content | Sanity Client + webhooks | Cached ISR pages (60s stale data acceptable) |
| **Shopify API** | Parts e-commerce | Storefront GraphQL API | Error message, retry with exponential backoff |
| **Vercel Postgres** | User data | Prisma ORM | Connection pooling (PgBouncer), retry on timeout |
| **NextAuth.js** | Authentication | Database adapter | Session cookie fallback, login redirect |
| **Resend** | Transactional email | REST API | Queue failed emails, retry async |
| **Sentry** | Error monitoring | SDK auto-capture | Non-blocking (errors logged locally if Sentry down) |

**Webhook Security:**

```typescript
// lib/webhooks/verify.ts
import crypto from 'crypto';

export function verifyWebhookSignature(
  req: Request,
  provider: 'sanity' | 'shopify'
): boolean {
  const signature = req.headers.get(`${provider}-webhook-signature`);
  const secret = process.env[`${provider.toUpperCase()}_WEBHOOK_SECRET`]!;

  const body = await req.text();
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return signature === `sha256=${expectedSig}`;
}
```

## 12. Architecture Decision Records

**Key Decisions with Rationale:**

### ADR-001: Monolithic Next.js over Microservices

**Decision:** Use single Next.js application for both vehicles and parts

**Rationale:**
- **Team Size:** Fairly new to React, single codebase reduces cognitive load
- **Shared Context:** Cross-discovery, navigation, user state require single app context
- **Deployment Simplicity:** One Vercel project vs. orchestrating multiple services
- **Future Flexibility:** Can extract services to APIs if scale demands

**Trade-offs:**
- ✅ Faster development, easier debugging, shared code
- ⚠️ Larger bundle size (mitigated by code splitting)

### ADR-002: Dual-CMS (Sanity + Shopify) over Single CMS

**Decision:** Keep Shopify for products, add Sanity for vehicles

**Rationale:**
- **Shopify Proven:** Phase 1 parts e-commerce works well, handles cart/checkout robustly
- **Sanity Strengths:** Editor-friendly for vehicle content, flexible schema, image CDN, CSV import
- **No Single Solution:** Neither CMS alone handles both use cases optimally (Shopify too rigid for vehicle content, Sanity lacks e-commerce features)

**Trade-offs:**
- ✅ Best tool for each job, flexible vehicle content management
- ⚠️ Dual integration complexity (webhook coordination, unified search)

### ADR-003: Hybrid SSR/SSG/ISR Rendering

**Decision:** Mix rendering strategies per page type

**Rationale:**
- **Products (SSG):** Infrequent changes, benefit from static caching
- **Vehicles (ISR):** Fresh inventory status (<60s per NFR006), balance static performance + freshness
- **User Dashboard (SSR):** Personalized, no pre-rendering needed
- **Search (Client):** Instant filtering UX, no server round-trip

**Trade-offs:**
- ✅ Optimal performance per page type
- ⚠️ Increased complexity (understand which pattern for which page)

### ADR-004: Vercel Postgres + Prisma over Supabase

**Decision:** Use Vercel Postgres with Prisma ORM for user data

**Rationale:**
- **Vercel Native:** Seamless integration, same dashboard, auto-scaling
- **Free Tier:** Sufficient for development (10GB storage, 100GB bandwidth)
- **Prisma:** Type-safe queries, excellent Next.js DX, helpful for React learning
- **Supabase Alternative:** Considered but rejected (different hosting, additional vendor)

**Trade-offs:**
- ✅ Native integration, type safety, simple DX
- ⚠️ Vendor lock-in to Vercel (acceptable, can migrate Postgres elsewhere if needed)

### ADR-005: Client-Side Search (Fuse.js) First, Meilisearch Later

**Decision:** Start with free client-side search, upgrade when needed

**Rationale:**
- **Cost:** Fuse.js free, Meilisearch $0-29/mo
- **Scale:** MVP inventory <500 items, client-side sufficient
- **Upgrade Path:** Clear migration to Meilisearch when >200 items or <300ms latency needed
- **NFR009 Compliance:** Client-side meets <300ms for initial scale

**Trade-offs:**
- ✅ Zero cost for MVP, sufficient for launch
- ⚠️ Migration effort when upgrading (acceptable, planned)

### ADR-006: In-Memory Cache over Redis (Initially)

**Decision:** Start with in-memory caching, upgrade to Redis if needed

**Rationale:**
- **Cost:** In-memory free, Upstash Redis $0-10/mo
- **Serverless:** Cold starts lose in-memory cache, but acceptable for low traffic
- **Upgrade Path:** Add Upstash Redis if Shopify API rate limits become issue

**Trade-offs:**
- ✅ Zero cost, simple implementation
- ⚠️ Cache lost on cold start (acceptable for projected traffic)

### ADR-007: NextAuth.js Database Sessions over JWT

**Decision:** Store sessions in Postgres database, not JWT tokens

**Rationale:**
- **Revocable:** Can invalidate sessions (logout, security breach)
- **No Size Limits:** JWT tokens have 4KB limit, database sessions unlimited
- **Security:** Session IDs in cookies (not entire session data)
- **GDPR:** Easier to delete user data (cascade delete sessions)

**Trade-offs:**
- ✅ Revocable, secure, compliant
- ⚠️ Database query per request (mitigated by connection pooling)

## 13. Implementation Guidance

### 13.1 Development Workflow

**Local Development Setup:**

```bash
# 1. Clone repository
git clone <repo-url>
cd enthusiastauto-1

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Set up database
npx prisma migrate dev

# 5. Import sample vehicle data (optional)
npm run import-vehicles -- data/sample-vehicles.csv

# 6. Run development server
npm run dev
# Open http://localhost:3000
```

**Git Workflow:**

```bash
# Create feature branch
git checkout -b feature/epic-3-vehicle-listing

# Make changes, commit often
git add .
git commit -m "feat(vehicles): add vehicle listing page"

# Push to GitHub (triggers Vercel preview deploy)
git push origin feature/epic-3-vehicle-listing

# Create PR, review preview deployment
# Merge to main → auto-deploy to production
```

**Testing Workflow:**

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format
```

### 13.2 File Organization

**Recommended Structure:**

```
enthusiastauto-1/
├── app/                      # Next.js App Router
│   ├── (vehicles)/          # Route group
│   ├── (products)/          # Route group
│   ├── (user)/              # Route group (protected)
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── shared/              # Cross-epic components
│   ├── vehicles/            # Epic 3 components
│   ├── products/            # Epic 1 components (existing)
│   ├── user/                # Epic 5 components
│   ├── search/              # Epic 6 components
│   └── ui/                  # ShadCN components
├── lib/
│   ├── sanity/              # Sanity client, queries
│   ├── shopify/             # Shopify client, queries (existing)
│   ├── db/                  # Prisma client, queries
│   ├── auth/                # NextAuth config
│   ├── search/              # Search logic (Fuse.js)
│   ├── webhooks/            # Webhook verification
│   └── utils/               # Shared utilities
├── contexts/                # React contexts (FilterContext, etc.)
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript types
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration history
├── sanity/
│   ├── schemas/             # Sanity schemas
│   └── sanity.config.ts     # Sanity Studio config
├── scripts/
│   └── import-vehicles.ts   # CSV import script
├── public/                  # Static assets
├── docs/                    # Documentation
│   ├── PRD.md
│   ├── ux-specification.md
│   ├── solution-architecture.md
│   └── epic-stories.md
├── .env.example             # Environment variable template
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

### 13.3 Naming Conventions

**Files:**
- Components: PascalCase (`VehicleCard.tsx`)
- Utilities: camelCase (`formatPrice.ts`)
- API routes: kebab-case (`add-to-garage/route.ts`)
- Pages: kebab-case folders (`vehicle-detail/page.tsx`)

**Components:**
- React Components: PascalCase (`export function VehicleCard()`)
- Props types: `{ComponentName}Props` (`type VehicleCardProps = {...}`)
- Hooks: camelCase with `use` prefix (`useVehicleFilters`)

**Database:**
- Tables: PascalCase (`UserFavorite`)
- Columns: camelCase (`userId`, `createdAt`)

**Constants:**
- SCREAMING_SNAKE_CASE (`CACHE_TTL`, `MAX_IMAGE_SIZE`)

### 13.4 Best Practices

**React/Next.js:**
1. Server Components by default, `'use client'` only when needed
2. Use TypeScript strict mode, no implicit `any`
3. Fetch data in Server Components (no `useEffect` for data fetching)
4. Use Server Actions for mutations (no client-side API calls)
5. Memoize expensive calculations (`useMemo`, `useCallback`)

**Performance:**
1. Lazy load below-fold images (`loading="lazy"`)
2. Dynamic import heavy components (`next/dynamic`)
3. Monitor bundle size with `ANALYZE=true npm run build`
4. Use `next/image` for all images (automatic optimization)
5. Debounce search input (300ms per UX spec)

**Security:**
1. Never commit secrets to git (use `.env.local`)
2. Verify webhook signatures before processing
3. Sanitize user input (use Zod for validation)
4. Use HTTPS only in production (Vercel default)
5. Rate limit API endpoints (implement if abuse detected)

**Accessibility:**
1. Use semantic HTML (`<nav>`, `<main>`, `<article>`)
2. Include alt text on all images
3. Label all form inputs (`htmlFor`)
4. Keyboard navigable (test without mouse)
5. ARIA labels on icon buttons

## 14. Proposed Source Tree

```
enthusiastauto-1/
├── app/
│   ├── layout.tsx                      # Root layout (Navigation, Providers)
│   ├── page.tsx                        # Homepage (ISR, featured vehicles+parts)
│   ├── globals.css                     # Tailwind base, design tokens
│   ├── (vehicles)/
│   │   └── vehicles/
│   │       ├── page.tsx                # Vehicle listing (ISR, 60s)
│   │       ├── [slug]/
│   │       │   └── page.tsx            # Vehicle detail (ISR, 60s + webhook)
│   │       └── loading.tsx             # Loading skeleton
│   ├── (products)/
│   │   └── products/
│   │       ├── page.tsx                # Product listing (SSG) [Phase 1]
│   │       ├── [handle]/
│   │       │   └── page.tsx            # Product detail (SSG + ISR) [Phase 1]
│   │       └── compare/
│   │           └── page.tsx            # Comparison (Client) [Phase 1]
│   ├── (search)/
│   │   └── search/
│   │       └── page.tsx                # Unified search (Client + SSR)
│   ├── (user)/
│   │   └── dashboard/
│   │       ├── layout.tsx              # Protected layout (auth required)
│   │       ├── page.tsx                # Dashboard home (SSR)
│   │       ├── garage/
│   │       │   └── page.tsx            # My Garage favorites (SSR)
│   │       ├── profile/
│   │       │   └── page.tsx            # User profile (SSR)
│   │       └── orders/
│   │           └── page.tsx            # Order history (SSR, Shopify)
│   ├── (auth)/
│   │   └── auth/
│   │       ├── signin/
│   │       │   └── page.tsx            # Sign in (SSG)
│   │       ├── signup/
│   │       │   └── page.tsx            # Sign up (SSG)
│   │       └── error/
│   │           └── page.tsx            # Auth error (SSG)
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts            # NextAuth endpoints
│   │   ├── revalidate/
│   │   │   └── vehicle/
│   │   │       └── [slug]/
│   │   │           └── route.ts        # Sanity webhook (ISR revalidation)
│   │   ├── webhooks/
│   │   │   ├── sanity/
│   │   │   │   └── route.ts            # Sanity content updates
│   │   │   └── shopify/
│   │   │       └── route.ts            # Shopify inventory updates
│   │   └── favorites/
│   │       ├── add/
│   │       │   └── route.ts            # Add to garage (POST, protected)
│   │       └── remove/
│   │           └── route.ts            # Remove from garage (DELETE, protected)
│   ├── sitemap.ts                      # Dynamic sitemap generation
│   ├── robots.ts                       # Robots.txt
│   └── manifest.ts                     # Web app manifest
├── components/
│   ├── shared/
│   │   ├── Navigation.tsx              # Unified header (vehicles+parts)
│   │   ├── Footer.tsx                  # Shared footer
│   │   ├── UnifiedSearchBar.tsx        # Search bar (Epic 6)
│   │   ├── UserMenu.tsx                # User dropdown (auth)
│   │   ├── Logo.tsx
│   │   └── CartIcon.tsx                # [Phase 1]
│   ├── vehicles/
│   │   ├── VehicleCard.tsx             # Vehicle card (listing)
│   │   ├── VehicleGrid.tsx             # Vehicle grid layout
│   │   ├── VehicleDetail.tsx           # Vehicle detail page
│   │   ├── VehicleGallery.tsx          # Image gallery (10-30 images)
│   │   ├── VehicleFilters.tsx          # Filters (model, year, price, status)
│   │   ├── VehicleStatus.tsx           # Current/Sold badge
│   │   └── AddToGarageButton.tsx       # Client component (favorites)
│   ├── products/
│   │   ├── ProductCard.tsx             # [Phase 1]
│   │   ├── ProductGrid.tsx             # [Phase 1]
│   │   ├── FilterPanel.tsx             # [Phase 1]
│   │   ├── FitmentBadge.tsx            # [Phase 1]
│   │   └── CartModal.tsx               # [Phase 1]
│   ├── user/
│   │   ├── SignInForm.tsx              # Email/password login form
│   │   ├── SignUpForm.tsx              # Registration form
│   │   ├── SocialAuthButtons.tsx       # Google/Facebook OAuth
│   │   ├── UserDashboard.tsx           # Dashboard layout
│   │   ├── MyGarage.tsx                # Favorites list
│   │   └── UserProfile.tsx             # Profile editor
│   ├── search/
│   │   ├── SearchResults.tsx           # Unified search results
│   │   ├── ResultTabs.tsx              # All/Vehicles/Parts tabs
│   │   ├── RecommendationCarousel.tsx  # Cross-discovery
│   │   └── CrossDiscoveryLinks.tsx     # "Compatible parts" links
│   └── ui/                             # ShadCN components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ...                         # [Phase 1 + additions]
├── lib/
│   ├── sanity/
│   │   ├── client.ts                   # Sanity client instance
│   │   ├── queries.ts                  # GROQ queries (vehicles)
│   │   └── image.ts                    # Image URL builder
│   ├── shopify/
│   │   ├── client.ts                   # Shopify GraphQL client [Phase 1]
│   │   ├── queries.ts                  # GraphQL queries [Phase 1]
│   │   └── types.ts                    # Shopify types [Phase 1]
│   ├── db/
│   │   ├── prisma.ts                   # Prisma client instance
│   │   ├── favorites.ts                # Favorites CRUD operations
│   │   └── users.ts                    # User CRUD operations
│   ├── auth/
│   │   └── nextauth.ts                 # NextAuth configuration
│   ├── search/
│   │   ├── unified.ts                  # Unified search orchestration
│   │   ├── fuse.ts                     # Fuse.js client-side search
│   │   └── recommendations.ts          # Cross-discovery logic
│   ├── webhooks/
│   │   ├── verify.ts                   # Signature verification
│   │   └── handlers.ts                 # Webhook processing
│   ├── cache/
│   │   ├── memory.ts                   # In-memory cache implementation
│   │   └── strategy.ts                 # Cache TTL configuration
│   └── utils/
│       ├── format.ts                   # Price, date formatting
│       ├── fitment.ts                  # Fitment tag parsing [Phase 1]
│       └── slugify.ts                  # URL slug generation
├── contexts/
│   ├── FilterContext.tsx               # Filter state (vehicles+products) [Phase 1]
│   ├── GarageContext.tsx               # Favorites state (client-side)
│   └── CartContext.tsx                 # Cart state [Phase 1]
├── hooks/
│   ├── useFilters.ts                   # Filter hook [Phase 1]
│   ├── useGarage.ts                    # Garage/favorites hook
│   ├── useDebounce.ts                  # Debounce hook [Phase 1]
│   └── useMediaQuery.ts                # Responsive hook
├── types/
│   ├── vehicle.ts                      # Vehicle types (from Sanity)
│   ├── product.ts                      # Product types [Phase 1]
│   ├── user.ts                         # User types (extended from NextAuth)
│   └── index.ts                        # Barrel exports
├── prisma/
│   ├── schema.prisma                   # Postgres schema (Users, Favorites, Sessions)
│   ├── migrations/                     # Migration history
│   └── seed.ts                         # Seed script (test data)
├── sanity/
│   ├── schemas/
│   │   ├── vehicle.ts                  # Vehicle schema
│   │   ├── serviceHistory.ts           # Service record schema
│   │   └── index.ts                    # Schema registry
│   ├── sanity.config.ts                # Sanity Studio config
│   └── sanity.cli.ts                   # Sanity CLI config
├── scripts/
│   ├── import-vehicles.ts              # CSV → Sanity import script
│   └── setup-db.sh                     # Local Postgres setup (Docker)
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   └── placeholder-vehicle.jpg
│   ├── fonts/
│   │   ├── Inter-var.woff2
│   │   └── Outfit-var.woff2
│   └── favicon.ico
├── docs/
│   ├── PRD.md                          # Product requirements
│   ├── ux-specification.md             # UX/UI specification
│   ├── solution-architecture.md        # This document
│   ├── epic-stories.md                 # Epic breakdown
│   └── bmm-workflow-status.md          # Workflow status
├── .env.example                        # Environment variable template
├── .env.local                          # Local environment variables (gitignored)
├── .gitignore
├── next.config.js                      # Next.js configuration
├── tailwind.config.ts                  # Tailwind configuration
├── tsconfig.json                       # TypeScript configuration
├── prettier.config.js                  # Prettier configuration
├── eslint.config.js                    # ESLint configuration
├── package.json                        # Dependencies
├── package-lock.json
└── README.md
```

**Critical Folders:**

- **app/** - Next.js App Router pages and API routes. All routing logic lives here. Server Components by default.
- **components/** - React components organized by epic/feature. Shared components in `shared/`, epic-specific in their own folders.
- **lib/** - Business logic layer. Services for data fetching (Sanity, Shopify, Postgres), utilities, and integrations. No React components here.
- **prisma/** - Database schema and migrations. Run `npx prisma migrate dev` after schema changes.
- **sanity/** - Sanity CMS configuration and schemas. Edit in `schemas/`, preview in Sanity Studio.

## 15. Testing Strategy

### 15.1 Unit Tests

**Tool:** Vitest (fast, ESM-compatible)

**Coverage Areas:**
- Utilities (formatPrice, parseFitmentTag, slugify)
- Pure functions (filterProducts, matchVehicle)
- React hooks (useDebounce, useFilters)

**Example Test:**

```typescript
// lib/utils/fitment.test.ts
import { describe, it, expect } from 'vitest';
import { parseFitmentTag } from './fitment';

describe('parseFitmentTag', () => {
  it('parses BMW fitment tag with model and year range', () => {
    const result = parseFitmentTag('BMW E46 2001-2006');
    expect(result).toEqual({
      model: 'E46',
      yearStart: 2001,
      yearEnd: 2006,
    });
  });

  it('returns null for invalid tag', () => {
    const result = parseFitmentTag('Invalid Tag');
    expect(result).toBeNull();
  });
});
```

### 15.2 Integration Tests

**Tool:** Vitest + React Testing Library

**Coverage Areas:**
- Component integration (VehicleCard with AddToGarageButton)
- Context providers (FilterContext, GarageContext)
- Server Actions (addToGarage, removeFromGarage)

**Example Test:**

```typescript
// components/vehicles/VehicleCard.test.tsx
import { render, screen } from '@testing-library/react';
import { VehicleCard } from './VehicleCard';

describe('VehicleCard', () => {
  const mockVehicle = {
    _id: '123',
    title: '2005 BMW E46 M3',
    year: 2005,
    model: 'E46',
    price: 35000,
    images: [{ url: '/test.jpg' }],
    status: 'current',
    slug: '2005-bmw-e46-m3',
  };

  it('renders vehicle title and price', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    expect(screen.getByText('2005 BMW E46 M3')).toBeInTheDocument();
    expect(screen.getByText('$35,000')).toBeInTheDocument();
  });

  it('displays "Available" badge for current status', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });
});
```

### 15.3 E2E Tests

**Tool:** Playwright

**Coverage Areas:**
- Critical user flows (search, add to garage, checkout)
- Cross-browser testing (Chrome, Safari, Firefox)
- Mobile viewport testing (responsive design)

**Example Test:**

```typescript
// e2e/vehicles/search-and-favorite.spec.ts
import { test, expect } from '@playwright/test';

test('search for vehicle and add to garage', async ({ page }) => {
  // Navigate to homepage
  await page.goto('/');

  // Search for E46
  await page.fill('input[type="search"]', 'E46');
  await page.press('input[type="search"]', 'Enter');

  // Wait for search results
  await page.waitForSelector('[data-testid="vehicle-card"]');

  // Click first result
  await page.click('[data-testid="vehicle-card"]:first-child a');

  // Verify vehicle detail page
  await expect(page).toHaveURL(/\/vehicles\/.+/);

  // Add to garage (requires auth)
  await page.click('button:has-text("Add to Garage")');

  // Should redirect to sign in
  await expect(page).toHaveURL('/auth/signin');
});
```

### 15.4 Coverage Goals

**Target Coverage:**
- Unit tests: 80%+ for utilities and pure functions
- Integration tests: 70%+ for components and contexts
- E2E tests: 100% coverage of critical user flows

**Critical Flows to E2E Test:**
1. ✅ Browse vehicles, filter by model/year, view details
2. ✅ Search products, filter by fitment, add to cart
3. ✅ Sign up with email, verify, log in
4. ✅ Add vehicle to garage, view garage, remove favorite
5. ✅ Unified search (vehicles + products)
6. ✅ View compatible parts from vehicle page
7. ✅ Complete checkout flow (Shopify)

**Testing Specialist Section:**

**Note:** Testing strategy is straightforward for Level 3 web app with dual-CMS integration. No specialist testing agent needed. Standard Vitest + Playwright + React Testing Library sufficient for coverage goals. See Epic-level tech specs for detailed test plans per feature.

## 16. DevOps and CI/CD

**CI/CD Strategy:** Vercel Auto-Deploy (zero config)

**Deployment Pipeline:**

```
1. Developer pushes to feature branch
   ↓
2. GitHub triggers Vercel build
   ↓
3. Vercel runs:
   - npm install
   - npm run lint (ESLint)
   - npm run type-check (TypeScript)
   - npx prisma generate (Prisma Client)
   - next build (SSG/ISR pre-rendering)
   ↓
4. Deploy to preview URL: <branch>-enthusiastauto.vercel.app
   ↓
5. Developer reviews preview, merges PR
   ↓
6. GitHub triggers production deploy
   ↓
7. Vercel deploys to shop.enthusiastauto.com
   ↓
8. Post-deploy:
   - Sentry release tracking
   - Vercel Analytics enabled
   - Smoke tests (optional future enhancement)
```

**Environment-Specific Builds:**

| Environment | Branch | URL | Database | Sanity Dataset |
|-------------|--------|-----|----------|----------------|
| Development | local | localhost:3000 | Local Postgres | `development` |
| Preview | feature/* | <branch>.vercel.app | Vercel Postgres (staging) | `staging` |
| Production | main | shop.enthusiastauto.com | Vercel Postgres (prod) | `production` |

**Database Migrations:**

```bash
# Development (local)
npx prisma migrate dev --name add_favorites_table

# Preview (automatic via Vercel build)
npx prisma migrate deploy

# Production (automatic via Vercel build)
npx prisma migrate deploy
```

**Rollback Strategy:**

```bash
# Vercel instant rollback (via dashboard)
# Select previous deployment → Promote to production
# Downtime: <10 seconds
```

**DevOps Specialist Section:**

**Note:** DevOps complexity is LOW for Vercel-hosted Next.js app. No Kubernetes, no multi-cloud orchestration, no complex IaC. Vercel handles infrastructure, scaling, CDN, SSL certificates. No specialist DevOps agent needed. Standard Vercel dashboard sufficient for monitoring, rollbacks, environment management.

**Future Enhancements (if scale demands):**
- Custom GitHub Actions for test automation before deploy
- Database backup automation (Vercel Postgres snapshots)
- Load testing with k6 or Artillery

## 17. Security

**Security Checklist:**

### 17.1 Authentication & Authorization

- ✅ NextAuth.js with secure session cookies (httpOnly, sameSite, secure)
- ✅ Database sessions (revocable, no JWT token exposure)
- ✅ Password hashing (handled by NextAuth email provider + Resend magic links)
- ✅ OAuth providers (Google, Facebook) for secure social login
- ✅ Protected routes via middleware (unauthorized redirects)
- ✅ CSRF protection (built into NextAuth)

### 17.2 Data Protection

- ✅ HTTPS only (Vercel enforces SSL, auto-redirects HTTP → HTTPS)
- ✅ Environment variables never committed (`.gitignore` includes `.env.local`)
- ✅ Secrets stored in Vercel dashboard (encrypted at rest)
- ✅ Database credentials rotated (Vercel Postgres auto-rotation)
- ✅ User data encrypted at rest (Vercel Postgres default)

### 17.3 API Security

- ✅ Webhook signature verification (HMAC SHA256 for Sanity/Shopify)
- ✅ Rate limiting (implement if abuse detected, Vercel Edge Config)
- ✅ Input validation (Zod schemas for all form inputs)
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ XSS prevention (React auto-escapes, no `dangerouslySetInnerHTML` except JSON-LD)

### 17.4 Compliance

- ✅ GDPR compliance:
  - User data export endpoint (future: `/api/user/export`)
  - User data deletion (cascade delete on User model)
  - Cookie consent banner (implement with CookieConsent library)
  - Privacy policy page (link in footer)

- ✅ CCPA compliance:
  - Same as GDPR (right to access, delete)

- ✅ WCAG 2.1 AA accessibility compliance (per NFR sections, UX spec)

### 17.5 Monitoring & Incident Response

- ✅ Error tracking: Sentry captures exceptions, stack traces
- ✅ Performance monitoring: Vercel Analytics (Core Web Vitals)
- ✅ Uptime monitoring: Vercel auto-alerts on deployment failures
- ✅ Security audits:
  ```bash
  npm audit          # Check for vulnerable dependencies
  npm audit fix      # Auto-fix vulnerabilities
  ```

**Security Specialist Section:**

**Note:** Security complexity is MODERATE for Level 3 web app with user authentication. No HIPAA/PCI/SOC2 compliance needed (Shopify handles payments), no high-sensitivity data beyond user emails/favorites. NextAuth.js + Vercel best practices provide solid baseline. No specialist security agent needed for Phase 2.

**Handled Inline:**
- HTTPS enforcement (Vercel default)
- Session security (NextAuth database sessions)
- Webhook signature verification (implemented in API routes)
- Input validation (Zod schemas)
- Dependency audits (npm audit in CI/CD)

**Future Enhancements:**
- Penetration testing (post-launch, annual)
- Bug bounty program (if user base grows)
- Security headers (Content-Security-Policy, X-Frame-Options via next.config.js)

---

## Specialist Sections

**Summary of Specialist Section Handling:**

All three specialist areas (Testing, DevOps, Security) assessed as **SIMPLE** for this Level 3 web application architecture:

1. **Testing:** Standard web app testing with Vitest + Playwright + React Testing Library. No mission-critical UI requiring comprehensive visual regression testing. Handled inline in Section 15.

2. **DevOps:** Vercel-hosted Next.js app with auto-deploy CI/CD. No Kubernetes, no multi-cloud orchestration, no complex infrastructure. Handled inline in Section 16.

3. **Security:** Standard authentication with NextAuth.js, no HIPAA/PCI/SOC2 compliance, Shopify handles payments. Best practices sufficient. Handled inline in Section 17.

**No specialist agent placeholders needed.** All sections complete and actionable for implementation.

---

_Generated using BMad Method Solution Architecture workflow_
_Date: 2025-10-21_
_Architect: Mike_
