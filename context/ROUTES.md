# Routes

All pages, API endpoints, and key components.

---

## Homepage

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage - hero, featured vehicles, parts, merchandise |

---

## About & Info

| Route | File | Description |
|-------|------|-------------|
| `/about` | `app/about/page.tsx` | Company story, team, mission |
| `/contact` | `app/contact/page.tsx` | Contact form, phone, address, hours |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |
| `/terms` | `app/terms/page.tsx` | Terms of service |

---

## Sell Your Car

| Route | File | Description |
|-------|------|-------------|
| `/sell` | `app/sell/page.tsx` | Sell, Consign, or Auction your BMW |

**Options:**
- **Sell** — Direct sale to EAG with immediate payment
- **Consign** — EAG handles sale on your behalf
- **Auction** — EAG represents on BaT, Cars&Bids, PcarMarket

---

## Vehicles

| Route | File | Description |
|-------|------|-------------|
| `/vehicles` | `app/vehicles/page.tsx` | Inventory listing with chassis filters |
| `/vehicles/[slug]` | `app/vehicles/[slug]/page.tsx` | Vehicle detail page (VDP) |

**Filters:** Current/Sold, Chassis codes (E30, E36, E46, F8X, G8X, etc.)

---

## Parts & Merchandise

| Route | File | Description |
|-------|------|-------------|
| `/parts` | `app/parts/page.tsx` | Parts catalog with fitment filtering |
| `/merchandise` | `app/merchandise/page.tsx` | Apparel, accessories, collectibles |
| `/product/[handle]` | `app/product/[handle]/page.tsx` | Product detail page (PDP) |

---

## Services

| Route | File | Description |
|-------|------|-------------|
| `/services` | `app/services/page.tsx` | Services overview |
| `/services/[slug]` | `app/services/[slug]/page.tsx` | Individual service page |

**Service Types:** Conditioning, Rejuvenation, Mechanical, Cosmetic

---

## Blog

| Route | File | Description |
|-------|------|-------------|
| `/blog` | `app/blog/page.tsx` | Blog listing |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Blog post |

**Categories:** Events, Around The Shop, Videos

---

## Search

| Route | File | Description |
|-------|------|-------------|
| `/search` | `app/search/page.tsx` | Search results |
| `/search/[collection]` | `app/search/[collection]/page.tsx` | Collection pages |

---

## Authentication

| Route | File | Description |
|-------|------|-------------|
| `/auth/signin` | `app/auth/signin/page.tsx` | Sign in |
| `/auth/signup` | `app/auth/signup/page.tsx` | Registration |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Request reset |
| `/auth/reset-password/[token]` | `app/auth/reset-password/[token]/page.tsx` | Set new password |

---

## Account (Protected)

| Route | File | Description |
|-------|------|-------------|
| `/account` | `app/account/page.tsx` | Dashboard |
| `/account/profile` | `app/account/profile/page.tsx` | Profile management |
| `/account/garage` | `app/account/garage/page.tsx` | My Garage - saved vehicles, fitment |

---

## System

| Route | File | Description |
|-------|------|-------------|
| Error | `app/error.tsx` | Error boundary |
| Loading | `app/search/loading.tsx` | Search loading state |

---

## API Routes

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

## Key Components

| Component | File | Purpose |
|-----------|------|---------|
| Cart Modal | `components/cart/modal.tsx` | Slide-out shopping cart |
| Vehicle Selector | `components/VehicleSelector.tsx` | Fitment vehicle picker |
| Fitment Badge | `components/FitmentBadge.tsx` | Part compatibility indicator |
| Filter Panel | `components/FilterPanel.tsx` | Product filtering UI |
| Search Autocomplete | `components/search/SearchAutocomplete.tsx` | Live search suggestions |

---

## Content Sources

| Content | Source |
|---------|--------|
| Vehicles | Sanity CMS |
| Products | Shopify Storefront API |
| Blog Posts | Sanity CMS |
| Service Pages | Sanity CMS |
| User Data | Prisma / PostgreSQL |

---

## Page Count

| Category | Count |
|----------|-------|
| Homepage | 1 |
| About & Info | 4 |
| Sell | 1 |
| Vehicles | 2 |
| Parts & Merch | 3 |
| Services | 5 |
| Blog | 2 |
| Search | 2 |
| Auth | 4 |
| Account | 3 |
| System | 2 |
| **Total** | **29** |

