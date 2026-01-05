# Architecture Document

**Project:** Enthusiast Auto Ecommerce Platform
**Date:** 2025-10-21

## Executive Summary

This document defines the technical architecture for the Enthusiast Auto platform, a unified e-commerce site that integrates vehicle inventory and parts shopping. The platform combines Next.js 15, dual-CMS integration (Sanity for vehicles, Shopify for parts), and user management to provide a seamless shopping experience.

**Key Architectural Decisions:**
- **Architecture Pattern:** Next.js 15 application with dual-CMS integration (Sanity + Shopify)
- **Rendering Strategy:** Hybrid SSR/SSG/ISR optimized per page type
- **Database:** Vercel Postgres with Prisma ORM for user data, favorites, and sessions
- **Authentication:** NextAuth.js with Google/Facebook OAuth and email/password
- **Hosting:** Vercel with auto-deploy CI/CD and edge caching
- **Search:** Client-side Fuse.js for unified search

## 1. Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js | 15.3.0 |
| **Language** | TypeScript | 5.8.2 |
| **UI Library** | React | 19.0.0 |
| **Styling** | Tailwind CSS | 4.0.14 |
| **Component Library** | ShadCN UI | Latest |
| **Database** | Vercel Postgres | Latest |
| **ORM** | Prisma | 5.21.1 |
| **Authentication** | NextAuth.js | 5.0.0-beta |
| **CMS (Vehicles)** | Sanity CMS | 3.62.0 |
| **E-commerce** | Shopify Storefront API | 2024-10 |
| **Hosting** | Vercel | Latest |
| **State Management** | React Context API | 19.0.0 |
| **Email Service** | Resend | 4.0.1 |
| **Monitoring** | Sentry | 8.40.0 |
| **Search** | Fuse.js | 7.0.0 |
| **Caching** | In-Memory + Vercel Edge | N/A |
| **Icon Library** | Lucide React | 0.468.0 |
| **Forms** | React Hook Form | 7.54.0 |
| **HTTP Client** | Native Fetch API | Built-in |
| **CSV Processing** | Papa Parse | 5.4.1 |
| **Date Handling** | date-fns | 4.1.0 |
| **Testing Framework** | Vitest | 2.1.0 |
| **E2E Testing** | Playwright | 1.49.0 |
| **Linting** | ESLint | 9.15.0 |
| **Formatting** | Prettier | 3.4.0 |
| **CI/CD** | Vercel Auto-Deploy | Built-in |

## 2. Application Architecture

### 2.1 Architecture Pattern

**Pattern:** Next.js Application with Dual-CMS Integration

```
┌─────────────────────────────────────────────────────────┐
│           Next.js 15 Application                        │
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

**Dual-CMS Strategy:**
- **Sanity CMS:** Vehicle content (specs, images, service history)
- **Shopify API:** Parts e-commerce (cart, checkout, payments)

**Hybrid Rendering:**
- **SSG (Static):** Product listings, static pages
- **ISR (Incremental Static):** Vehicle pages revalidate via webhooks
- **SSR (Server-Side):** User dashboard, personalized content
- **Client-Side:** Search, filters

### 2.2 Server-Side Rendering Strategy

| Page Type | Strategy | Revalidation |
|-----------|----------|--------------|
| **Product Listing** | SSG | On-demand (Shopify webhook) |
| **Product Detail** | SSG + ISR | 300s + webhook |
| **Vehicle Listing** | ISR | 60s + webhook |
| **Vehicle Detail** | ISR | 60s + webhook |
| **Homepage** | ISR | 60s |
| **Search Results** | Client-Side | N/A |
| **User Dashboard** | SSR | N/A |
| **My Garage (Favorites)** | SSR | N/A |
| **Auth Pages** | SSG | N/A |

**ISR Implementation:**

```typescript
// app/vehicles/[slug]/page.tsx
export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function generateStaticParams() {
  const vehicles = await sanity.fetch(`
    *[_type == "vehicle" && status == "current"][0...50] {
      "slug": slug.current
    }
  `);
  return vehicles.map(v => ({ slug: v.slug }));
}
```

**Webhook-Driven Revalidation:**

```typescript
// app/api/revalidate/vehicle/[slug]/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  // Verify webhook signature
  const isValid = await verifyWebhookSignature(req, 'sanity');
  if (!isValid) return new Response('Invalid signature', { status: 401 });

  // Revalidate vehicle page
  revalidatePath(`/vehicles/${params.slug}`);
  revalidatePath('/vehicles');

  return new Response('Revalidated', { status: 200 });
}
```

### 2.3 Page Routing and Navigation

**Route Structure:**

```
/                           # Homepage (ISR)
├── /vehicles               # Vehicle listing (ISR, 60s)
│   └── /[slug]            # Vehicle detail (ISR, 60s + webhook)
├── /products              # Product listing (SSG)
│   ├── /[handle]          # Product detail (SSG + ISR)
│   └── /search            # Search results (Client)
├── /search                # Unified search (Client + SSR hybrid)
├── /account                # User dashboard (SSR, protected)
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

### 2.4 Data Fetching Approach

**Sanity CMS (Vehicles):**

```typescript
// lib/sanity/client.ts
import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: '2024-10-21',
  token: process.env.SANITY_API_TOKEN,
});
```

**Shopify API (Products):**

```typescript
// lib/shopify/client.ts
export async function shopifyFetch(query: string, variables = {}) {
  const res = await fetch(process.env.SHOPIFY_GRAPHQL_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error('Shopify API error');
  return res.json();
}
```

**Vercel Postgres (User Data):**

```typescript
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Caching Strategy:**

| Data Source | Cache Layer | TTL | Invalidation |
|-------------|------------|-----|--------------|
| Sanity (vehicles) | Next.js fetch cache + ISR | 60s | Webhook on content change |
| Shopify (products) | Next.js fetch cache | 300s | Webhook on inventory change |
| Postgres (users) | No cache | N/A | N/A |
| Images (Sanity CDN) | Vercel Edge + browser | 1 year | Version in URL |
| Images (Shopify CDN) | Vercel Edge + browser | 1 year | Version in URL |

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

Key fields:
- `title`, `slug`, `year`, `model`, `trim`
- `price`, `mileage`, `status` (current/sold)
- `images[]` (array of images)
- `description`, `specifications` (object)
- `serviceHistory[]` (array of service records)

### 3.2 Data Models and Relationships

**Entity Relationship:**

```
┌────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  User (PG)     │     │  Vehicle     │     │   Product       │
│  - id          │────<│  (Sanity)    │     │   (Shopify)     │
│  - email       │  1:N│  - _id       │     │   - id          │
│  - name        │     │  - model     │     │   - title       │
└────────────────┘     │  - year      │     │   - price       │
         │             │  - status    │     │   - tags        │
         │             └──────────────┘     └─────────────────┘
         │                      │                      │
         │                      └──────────┬───────────┘
         │                                 │
         │             ┌───────────────────▼──────────┐
         └────────────>│   UserFavorite (PG)         │
                  1:N  │   - userId                   │
                       │   - itemType (vehicle/product)│
                       │   - itemId                   │
                       └──────────────────────────────┘
```

**Cross-CMS Linking Strategy:**

Vehicle → Compatible Parts: Match vehicle model/year with product fitment tags in Shopify.

Product → Compatible Vehicles: Query Sanity for vehicles matching product fitment tags.

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

### 4.2 Authentication Endpoints

**NextAuth.js Configuration:**

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
    GoogleProvider({ /* ... */ }),
    FacebookProvider({ /* ... */ }),
    EmailProvider({ /* ... */ }),
  ],
  session: {
    strategy: 'database' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
```

### 4.3 Server Actions

**Server Actions for Mutations:**

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

  revalidatePath('/account/garage');
  return { success: true };
}
```

## 5. Authentication and Authorization

### 5.1 Auth Strategy

**Authentication Provider:** NextAuth.js v5

**Supported Methods:**
1. Email/Password (via Email Magic Link)
2. Google OAuth
3. Facebook OAuth

**Session Storage:** Database sessions (Postgres)

### 5.2 Protected Routes

**Middleware-Based Protection:**

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
  matcher: [
    '/account/:path*',
    '/api/favorites/:path*',
  ],
};
```

**Access Matrix:**

| Feature | Guest | Authenticated User |
|---------|-------|-------------------|
| Browse vehicles/products | ✅ Yes | ✅ Yes |
| Search | ✅ Yes | ✅ Yes |
| View details | ✅ Yes | ✅ Yes |
| Add to cart | ✅ Yes | ✅ Yes |
| Save to garage | ❌ No | ✅ Yes |
| View favorites | ❌ No | ✅ Yes |
| Order history | ❌ No | ✅ Yes |
| Profile management | ❌ No | ✅ Yes |

## 6. State Management

### 6.1 Server State

**Strategy:** Server Components + ISR/SSR

Data fetching in Server Components (no client-side state library needed).

### 6.2 Client State

**Strategy:** React Context API for app-level state

**FilterContext (existing):**

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

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
```

### 6.3 Form State

**Strategy:** React Hook Form for complex forms

## 7. UI/UX Architecture

### 7.1 Component Structure

**Component Organization:**

```
components/
├── shared/             # Shared components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── UnifiedSearchBar.tsx
│   └── UserMenu.tsx
├── vehicles/           # Vehicle components
│   ├── VehicleCard.tsx
│   ├── VehicleGrid.tsx
│   ├── VehicleDetail.tsx
│   └── VehicleGallery.tsx
├── products/           # Product components
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   └── FilterPanel.tsx
├── account/            # User components
│   ├── UserDashboard.tsx
│   ├── MyGarage.tsx
│   └── UserProfile.tsx
├── search/             # Search components
│   ├── SearchResults.tsx
│   └── RecommendationCarousel.tsx
└── ui/                 # ShadCN components
    ├── button.tsx
    ├── card.tsx
    └── ...
```

**Component Design Principles:**
1. Server Components by default, `'use client'` only when needed
2. Composition over Props
3. Accessibility First (WCAG 2.1 AA)
4. TypeScript Strict

## 8. Performance Optimization

### 8.1 SSR Caching

**Vercel Edge Caching:**
- ISR pages cached globally at 300+ edge locations
- Cache-Control headers automatic
- 60s revalidation for vehicles, 300s for products

### 8.2 Image Optimization

**Next.js Image Component:**

```typescript
<Image
  src={vehicle.images[0].url}
  alt={vehicle.title}
  width={800}
  height={600}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
  priority
/>
```

**Image CDN Strategy:**
- Sanity Images: Sanity CDN with automatic WebP/AVIF conversion
- Shopify Images: Shopify CDN with query params for sizing
- Next.js: Further optimization layer

### 8.3 Code Splitting

**Automatic Route-Based Splitting:**
- Each route gets own bundle
- Dynamic imports for heavy components

## 9. SEO and Meta Tags

### 9.1 Meta Tag Strategy

**Dynamic Meta Tags (Next.js Metadata API):**

```typescript
// app/vehicles/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const vehicle = await getVehicle(params.slug);

  return {
    title: `${vehicle.year} ${vehicle.model} ${vehicle.trim} for Sale | Enthusiast Auto`,
    description: `${vehicle.year} BMW ${vehicle.model} - $${vehicle.price.toLocaleString()}`,
    openGraph: {
      title: vehicle.title,
      description: vehicle.description,
      images: [vehicle.images[0].url],
      type: 'product',
    },
  };
}
```

### 9.2 Sitemap

**Dynamic Sitemap Generation:**

```typescript
// app/sitemap.ts
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
  ];
}
```

## 10. Deployment Architecture

### 10.1 Hosting Platform

**Platform:** Vercel

**Vercel Features:**
- Serverless Functions (Next.js API routes)
- Edge Network (global CDN)
- Preview Deployments (auto-deploy per git branch)
- Environment Variables (per environment)
- Web Analytics (Core Web Vitals)
- Image Optimization (automatic WebP/AVIF)

**Deployment Pipeline:**

```
GitHub Repository (main branch)
        │
        │ git push
        ▼
  Vercel Auto-Deploy
        │
        ├──> Build (next build)
        ├──> Deploy to Edge Network
        └──> Production Live
```

### 10.2 CDN Strategy

| Asset Type | CDN | Cache Duration | Invalidation |
|------------|-----|----------------|--------------|
| Static pages (SSG) | Vercel Edge | Until revalidation | Webhook |
| ISR pages | Vercel Edge | 60-300s | Webhook + time |
| Images (Sanity) | Sanity CDN → Vercel Edge | 1 year | URL versioning |
| Images (Shopify) | Shopify CDN → Vercel Edge | 1 year | URL versioning |
| JS bundles | Vercel Edge | 1 year | Hash in filename |
| CSS files | Vercel Edge | 1 year | Hash in filename |

## 11. Component and Integration Overview

### 11.1 Major Modules

**Presentation Layer:**
1. Shared Components - Navigation, Search, User Menu, Layout
2. Vehicle Components - VehicleCard, VehicleGrid, VehicleDetail, VehicleGallery
3. Product Components - ProductCard, ProductGrid, FilterPanel
4. User Components - AuthForms, UserDashboard, MyGarage, UserProfile
5. Search & Discovery - UnifiedSearchBar, SearchResults, RecommendationCarousel

**Business Logic Layer:**
6. Vehicle Service - Sanity queries, filter logic
7. Product Service - Shopify queries, fitment matching
8. User Service - NextAuth config, favorites CRUD, profile management
9. Search Service - Unified search orchestration, Fuse.js integration
10. Integration Layer - Webhooks (Sanity/Shopify), ISR revalidation

**Data Layer:**
11. Sanity CMS - Vehicle content, images, service records
12. Shopify API - Product catalog, cart, checkout
13. Vercel Postgres - Users, sessions, favorites

### 11.2 Page Structure

**App Router Structure:**

```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Homepage (ISR)
├── vehicles/
│   ├── page.tsx                 # Vehicle listing (ISR, 60s)
│   └── [slug]/
│       └── page.tsx             # Vehicle detail (ISR, 60s + webhook)
├── products/
│   ├── page.tsx                 # Product listing (SSG)
│   └── [handle]/
│       └── page.tsx             # Product detail (SSG + ISR)
├── search/
│   └── page.tsx                 # Unified search (Client + SSR)
├── account/
│   ├── layout.tsx               # Protected layout
│   ├── page.tsx                 # Dashboard home (SSR)
│   ├── garage/
│   │   └── page.tsx             # My Garage favorites (SSR)
│   └── profile/
│       └── page.tsx             # User profile (SSR)
├── auth/
│   ├── signin/
│   │   └── page.tsx            # Sign in (SSG)
│   ├── signup/
│   │   └── page.tsx             # Sign up (SSG)
│   └── reset-password/
│       └── page.tsx             # Password reset (SSG)
└── api/
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts         # NextAuth endpoints
    ├── revalidate/
    │   └── vehicle/[slug]/
    │       └── route.ts         # Sanity webhook (ISR revalidation)
    └── favorites/
        ├── add/
        │   └── route.ts         # Add to garage (POST, protected)
        └── remove/
            └── route.ts         # Remove from garage (DELETE, protected)
```

### 11.3 Third-Party Integrations

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

## 12. Security

### 12.1 Authentication & Authorization

- NextAuth.js with secure session cookies (httpOnly, sameSite, secure)
- Database sessions (revocable)
- OAuth providers (Google, Facebook) for secure social login
- Protected routes via middleware
- CSRF protection (built into NextAuth)

### 12.2 Data Protection

- HTTPS only (Vercel enforces SSL)
- Environment variables never committed
- Secrets stored in Vercel dashboard (encrypted at rest)
- Database credentials rotated (Vercel Postgres auto-rotation)
- User data encrypted at rest (Vercel Postgres default)

### 12.3 API Security

- Webhook signature verification (HMAC SHA256)
- Input validation (Zod schemas)
- SQL injection prevention (Prisma parameterized queries)
- XSS prevention (React auto-escapes)

---

_This document provides a high-level overview of the Enthusiast Auto platform architecture. For detailed implementation questions, refer to the codebase or use AI/LLM tools to explore specific components._
