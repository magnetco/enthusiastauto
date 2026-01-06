# Enthusiast Auto - Sitemap

A comprehensive list of all pages in the Enthusiast Auto Next.js commerce website.

> **Site Overview:** Enthusiast Auto Group (EAG) specializes in M-Series BMWs. The site sells vehicles, parts, and merchandise, offers professional services (conditioning, rejuvenation, mechanical, cosmetic), and features a **My Garage** system where users save their vehicles and get personalized parts fitment matching.

---

## Homepage

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/` | `app/page.tsx` | ✅ | Homepage - hero, featured vehicles, parts, and merchandise |

---

## About & Info Pages

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/about` | `app/about/page.tsx` | ✅ | About Enthusiast Auto Group - company story, team, mission |
| `/contact` | `app/contact/page.tsx` | ✅ | Contact page with form, phone, address, hours |
| `/privacy` | `app/privacy/page.tsx` | ✅ | Privacy policy |
| `/terms` | `app/terms/page.tsx` | ✅ | Terms of service |

---

## Sell Your Car

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/sell` | `app/sell/page.tsx` | ✅ | Vehicle selling options - Sell, Consign, or Auction your BMW with EAG |

**Page Features:**
- **Sell** - Direct sale to EAG with immediate payment
- **Consign** - EAG handles sale on your behalf with full rejuvenation
- **Auction** - EAG represents your car on Bring a Trailer, Cars&Bids, or PcarMarket
- Vehicle submission form (name, contact, vehicle details, VIN)
- Comparison of benefits for each selling option

---

## Inventory (Vehicles)

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/vehicles` | `app/vehicles/page.tsx` | ✅ | Vehicle inventory listing with filtering by chassis code (E30, E36, E46, etc.) |
| `/vehicles/[slug]` | `app/vehicles/[slug]/page.tsx` | ✅ | Individual vehicle detail page (VDP) |

**Inventory Filters:**
- Current Inventory / Sold Inventory
- Chassis codes: E24, E26, E28, E30, E31, E34, E36, E39, E46, E60, E82, E9X, F8X, F87, G8X, Z3, Z4, Z8, OTHER

---

## Parts

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/parts` | `app/parts/page.tsx` | ✅ | Parts catalog with fitment filtering |
| `/product/[handle]` | `app/product/[handle]/page.tsx` | ✅ | Product detail page (PDP) with fitment info |

---

## Merchandise

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/merchandise` | `app/merchandise/page.tsx` | ✅ | Merchandise catalog (apparel, accessories, collectibles) |
| `/product/[handle]` | `app/product/[handle]/page.tsx` | ✅ | Product detail page (shared with parts) |

---

## Services

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/services` | `app/services/page.tsx` | ✅ | Services overview/landing page |
| `/services/conditioning` | `app/services/[slug]/page.tsx` | ✅ | **Conditioning** - Paint correction, ceramic coating, protection |
| `/services/rejuvenation` | `app/services/[slug]/page.tsx` | ✅ | **Rejuvenation** - Full vehicle restoration to EAG standards |
| `/services/mechanical` | `app/services/[slug]/page.tsx` | ✅ | **Mechanical** - Engine, suspension, drivetrain services |
| `/services/cosmetic` | `app/services/[slug]/page.tsx` | ✅ | **Cosmetic** - Interior, exterior cosmetic enhancements |

**Service Page Features (Sanity CMS):**
- Hero section with service title, description, background image
- Content sections describing service offerings
- Service appointment request form

---

## Blog ("Under the Hood")

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/blog` | `app/blog/page.tsx` | ✅ | Blog listing - featured stories and all stories |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | ✅ | Individual blog post |

**Blog Categories:**
- Events
- Around The Shop
- Videos

**Content Source:** Sanity CMS

---

## Search & Collections

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/search` | `app/search/page.tsx` | ✅ | Search results across all products |
| `/search/[collection]` | `app/search/[collection]/page.tsx` | ✅ | Collection/category pages (e.g., brakes, suspension, apparel) |

---

## Authentication

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/auth/signin` | `app/auth/signin/page.tsx` | ✅ | Sign in page |
| `/auth/signup` | `app/auth/signup/page.tsx` | ✅ | User registration page |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | ✅ | Request password reset |
| `/auth/reset-password/[token]` | `app/auth/reset-password/[token]/page.tsx` | ✅ | Set new password (from email link) |

---

## Account (Authenticated Users)

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/account` | `app/account/page.tsx` | ✅ | Account dashboard/overview |
| `/account/profile` | `app/account/profile/page.tsx` | ✅ | Profile management (name, email, addresses, password) |
| `/account/garage` | `app/account/garage/page.tsx` | ✅ | **My Garage** - save vehicles, manage fitment, see compatible parts |

---

## System Pages

| Route | File | Status | Description |
|-------|------|--------|-------------|
| Error | `app/error.tsx` | ✅ | Global error boundary page |
| Loading | `app/search/loading.tsx` | ✅ | Search loading state |

---

## Components (Not Pages, but Key UI)

These are not routes but are critical UI components that appear across pages:

- **Cart Modal** - Slide-out shopping cart (`components/cart/modal.tsx`)
- **Vehicle Selector** - Choose vehicle for fitment (`components/VehicleSelector.tsx`)
- **Fitment Badge** - Shows part compatibility (`components/FitmentBadge.tsx`)
- **Filter Panel** - Product filtering UI (`components/FilterPanel.tsx`)
- **Search Autocomplete** - Live search suggestions (`components/search/SearchAutocomplete.tsx`)

---

## API Routes (Reference)

| Route | Purpose |
|-------|---------|
| `/api/auth/*` | Authentication (NextAuth, signup, password reset, email verification) |
| `/api/search` | Product search endpoint |
| `/api/recommendations` | Product recommendations |
| `/api/user/*` | User profile, addresses, favorites, garage management |
| `/api/contact/*` | Contact forms (vehicle inquiries, sell form) |
| `/api/services/request` | Service appointment submissions |
| `/api/revalidate` | Cache revalidation |

---

## Page Count Summary

| Category | Count |
|----------|-------|
| Homepage | 1 |
| About & Info | 4 |
| Sell Your Car | 1 |
| Inventory | 2 |
| Parts | 2 |
| Merchandise | 2 |
| Services | 5 |
| Blog | 2 |
| Search | 2 |
| Authentication | 4 |
| Account | 3 |
| System | 2 |
| **Total** | **30** |

---

## Content Sources

| Content Type | Source | Notes |
|--------------|--------|-------|
| Vehicles | Sanity CMS | Inventory managed in Sanity Studio |
| Products (Parts & Merch) | Shopify | E-commerce via Shopify Storefront API |
| Blog Posts | Sanity CMS | Rich text content with images |
| Service Pages | Sanity CMS | Dynamic content for each service type |
| Static Pages | Sanity CMS | About, Contact, Privacy, Terms |
| User Data | Prisma/PostgreSQL | Accounts, garage, favorites |
