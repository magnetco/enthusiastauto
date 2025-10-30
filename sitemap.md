## Enthusiast Auto — Application Sitemap

This sitemap reflects the current Next.js App Router structure and service endpoints in this repository. It is organized by user-facing pages, dynamic routes, account/ecommerce flows, CMS-driven content, and internal API routes.

### Top-Level Navigation (per header design)
- **Home**: `/`
- **Inventory**: `/vehicles`
  - Vehicle detail: `/vehicles/[slug]`
- **Services**: `/services`
- **Sell your car**: `/[page]` (CMS route; page: "sell-your-car" or similar)
- **Under the hood (Blog)**: `/[page]` (CMS route; page: "under-the-hood" and article pages)
- **EAG Collection**: `/[page]` (CMS route; page: "eag-collection")
- **Parts**: `/parts` (Merch/parts listing)
- **Merchandise**: `/[page]` (CMS route; page: "merchandise")
- **Contact**: `/[page]` (CMS route; page: "contact")
- **Search**: `/search`
  - Search by collection: `/search/[collection]`
- **Product**: `/product/[handle]` (Shopify product handle / Spark Shipping catalog item)

### Account Area
- **Account Hub**: `/account`
  - Profile: `/account/profile`
  - Garage: `/account/garage`
  - Orders: `/account/orders` (planned)
  - Addresses: `/account/addresses` (planned)
  - Saved items / Favorites: handled via API, surfaced in UI components

Notes
- Orders and addresses will integrate with Shopify Storefront API customer endpoints. Shipping addresses map to the customer's default and additional addresses in Shopify; order history lists past orders and line items (vehicles are informational; merchandise/parts originate from Shopify/Spark catalogs).
- Authentication uses NextAuth at `/api/auth/[...nextauth]` and related flows below.

### Auth Flows
- Sign in: `/auth/signin`
- Sign up: `/auth/signup`
- Reset password request: `/auth/reset-password`
- Reset password confirm: `/auth/reset-password/[token]`

### CMS Pages (Sanity)
- Generic CMS route: `/[page]`
  - Examples: `under-the-hood`, `sell-your-car`, `eag-collection`, `merchandise`, `contact`, and other static content pages. The actual slugs are managed in Sanity’s "Inventory" and related collections.

### Developer/Studio
- Sanity Studio: `/studio/[[...tool]]`

### SEO/Infra
- Robots: `/robots`
- Sitemap: `/sitemap`

---

## API Routes (internal)

All API routes live under `/api`. HTTP verbs vary per route; most are `GET` or `POST` as indicated by implementation.

### Auth
- `/api/auth/[...nextauth]`
- `/api/auth/signup`
- `/api/auth/verify-email`
- `/api/auth/reset-password` (initiate)
- `/api/auth/reset-password/validate`
- `/api/auth/reset-password/confirm`

### User
- `/api/user/account` — account overview
- `/api/user/accounts/[provider]` — connected OAuth providers
- `/api/user/profile` — read/update profile
- `/api/user/password` — change password
- `/api/user/avatar` — upload/update avatar
- `/api/user/addresses` — list/create address
- `/api/user/addresses/[id]` — update/delete address
- `/api/user/favorites` — list/update favorites

### Search & Recommendations
- `/api/search`
- `/api/recommendations`

### Content & Services
- `/api/contact/vehicle` — send vehicle inquiry
- `/api/services/request` — service request form

### Preview/Cache/Validation
- `/api/preview` — enable draft preview
- `/api/disable-preview` — disable draft preview
- `/api/revalidate` — global ISR revalidate
- `/api/revalidate/vehicle/[slug]` — revalidate a vehicle page

---

## Ecommerce & Data Sources

- **Vehicles/Inventory**: Managed in Sanity CMS. Listing at `/vehicles`, detail at `/vehicles/[slug]`.
- **Merchandise/Parts**: Sourced from Spark Shipping API catalog and surfaced via Shopify Storefront for checkout. Product detail uses `/product/[handle]` where `handle` maps to Shopify product handles.
- **Cart & Checkout**: Client-side flows powered by Shopify Storefront API. UI components in `components/cart/*` manage cart state and mutations against Storefront; server does not expose cart endpoints in this repo.

---

## Planned Routes (to implement)

These are identified business needs aligned with Shopify customer APIs:

- `/account/orders` — order history list (Shopify Customer.orders)
- `/account/orders/[orderId]` — order detail view
- `/account/addresses` — manage customer addresses
- `/account/addresses/new` — create address
- `/account/addresses/[id]` — edit/remove address

Each of the above should authenticate the user (NextAuth) and read/write via Shopify Storefront customer access tokens. Server actions or API routes may be added if required for secure mutations.

---

## Route Inventory (from codebase)

Pages
- `/` → `app/page.tsx`
- `/vehicles` → `app/vehicles/page.tsx`
- `/vehicles/[slug]` → `app/vehicles/[slug]/page.tsx`
- `/services` → `app/services/page.tsx`
- `/parts` → `app/parts/page.tsx`
- `/product/[handle]` → `app/product/[handle]/page.tsx`
- `/search` → `app/search/page.tsx`
- `/search/[collection]` → `app/search/[collection]/page.tsx`
- `/account` → `app/account/page.tsx`
- `/account/profile` → `app/account/profile/page.tsx`
- `/account/garage` → `app/account/garage/page.tsx`
- `/auth/signin` → `app/auth/signin/page.tsx`
- `/auth/signup` → `app/auth/signup/page.tsx`
- `/auth/reset-password` → `app/auth/reset-password/page.tsx`
- `/auth/reset-password/[token]` → `app/auth/reset-password/[token]/page.tsx`
- `/[page]` → `app/[page]/page.tsx` (CMS)
- `/studio/[[...tool]]` → `app/studio/[[...tool]]/page.tsx`
- `/robots` → `app/robots.ts`
- `/sitemap` → `app/sitemap.ts`

APIs
- See API section above; files live under `app/api/*`.

---

Last updated: generated from repository structure on commit in working tree at time of authoring.


