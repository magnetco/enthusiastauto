# Architecture

Enthusiast Auto platform technical architecture.

## Applications

| App | Port | Purpose |
|-----|------|---------|
| **website** | 3000 | Next.js 15 e-commerce platform |
| **studio** | 3333 | Sanity CMS for vehicle content |
| **data** | 4000 | Express + React admin dashboard |

Each app is independent with its own `package.json`. Shared environment via `.env.local` at project root.

## Core Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 (website)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  App Router: /vehicles (ISR) | /product (SSG) |        │ │
│  │              /account (SSR)  | /search (Client)        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  lib/: sanity/ | shopify/ | auth/ | db/ | search/      │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────┬──────────────┬──────────────┬───────────┘
                    │              │              │
                    ▼              ▼              ▼
             ┌───────────┐  ┌───────────┐  ┌─────────────┐
             │  Sanity   │  │  Shopify  │  │   Vercel    │
             │ (Vehicles)│  │  (Parts)  │  │  Postgres   │
             │ - Content │  │ - Cart    │  │ - Users     │
             │ - Images  │  │ - Checkout│  │ - Favorites │
             └───────────┘  └───────────┘  └─────────────┘
```

## Key Architectural Decisions

### Dual-CMS Strategy
- **Sanity CMS**: Vehicle content (specs, images, service history) — rich editing experience
- **Shopify API**: Parts e-commerce (cart, checkout, payments) — handles all commerce complexity

### Hybrid Rendering
| Page Type | Strategy | Revalidation |
|-----------|----------|--------------|
| Vehicle pages | ISR | 60s + webhook |
| Product pages | SSG + ISR | 300s + webhook |
| User dashboard | SSR | N/A |
| Search | Client-side | N/A |

### Data Ownership
| Data | Source | Reason |
|------|--------|--------|
| Vehicles | Sanity | Rich content editing, custom fields |
| Products | Shopify | Cart, checkout, inventory, payments |
| Users, Favorites | Vercel Postgres | Auth sessions, cross-CMS favorites |

### Cross-CMS Linking
- **Vehicle → Parts**: Match vehicle model/year with product fitment tags
- **Favorites**: UserFavorite table stores `itemType` (vehicle/product) + `itemId`

## Route Structure

```
/                     # Homepage (ISR)
/vehicles             # Vehicle listing (ISR)
/vehicles/[slug]      # Vehicle detail (ISR + webhook)
/parts                # Parts landing
/product/[handle]     # Product detail (SSG + ISR)
/search               # Unified search (Client)
/search/[collection]  # Collection pages
/services             # Service request
/account              # User dashboard (SSR, protected)
/account/garage       # My Garage favorites (SSR)
/account/profile      # User profile (SSR)
/auth/signin          # Sign in
/auth/signup          # Sign up
/api/auth/*           # NextAuth endpoints
/api/revalidate/*     # Webhook handlers
```

## Authentication

- **Provider**: NextAuth.js v5 with database sessions
- **Methods**: Email/password, Google OAuth
- **Protected routes**: `/account/*`, `/api/user/*` via middleware
- **Session storage**: Vercel Postgres (revocable sessions)

## Caching Strategy

| Source | Cache | TTL | Invalidation |
|--------|-------|-----|--------------|
| Sanity | Next.js ISR | 60s | Webhook |
| Shopify | Next.js fetch | 300s | Webhook |
| Postgres | None | N/A | N/A |
| Images | CDN + Edge | 1 year | URL versioning |

## Component Organization

```
components/
├── layout/      # Navbar, footer, breadcrumbs
├── vehicles/    # VehicleCard, VehicleGrid, VehicleGallery
├── cart/        # Cart modal, add-to-cart
├── favorites/   # FavoriteButton, GarageItemCard
├── account/     # ProfileForm, dashboard components
├── search/      # SearchBar, SearchResults
├── shared/      # RecommendationCarousel, common components
└── ui/          # ShadCN primitives (button, card, etc.)
```

**Principles**:
- Server Components by default
- `'use client'` only when needed (interactivity, hooks)
- Composition over props drilling

## Deployment

- **Hosting**: Vercel (website), Sanity.io (studio)
- **Database**: Vercel Postgres (Neon)
- **CI/CD**: GitHub → Vercel auto-deploy
- **Preview**: Auto-deploy per branch

## Security

- HTTPS enforced (Vercel)
- Webhook signature verification (HMAC SHA256)
- Database sessions (httpOnly, secure cookies)
- Input validation via Zod
- Prisma parameterized queries (SQL injection prevention)
