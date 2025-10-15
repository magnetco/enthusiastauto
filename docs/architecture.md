# Architecture Documentation

**Project:** Enthusiast Auto Ecommerce Site
**Architecture Type:** Next.js SSR Monolith
**Generated:** 2025-10-14

---

## Executive Summary

**Enthusiast Auto Ecommerce Site** is a high-performance, server-rendered Next.js 15 e-commerce application built on the App Router architecture. The application serves as a headless storefront for Shopify, leveraging React Server Components, Server Actions, and modern React 19 patterns to deliver an optimized shopping experience.

**Key Characteristics:**

- **Monolithic Architecture** - Single cohesive codebase
- **Server-Side Rendering (SSR)** - Fast initial page loads, SEO-optimized
- **Headless Commerce** - Shopify Storefront API as backend
- **Edge-Ready** - Optimized for Vercel Edge Network deployment
- **Type-Safe** - Full TypeScript implementation

---

## Technology Stack

### Core Framework

| Technology     | Version         | Purpose                                   |
| -------------- | --------------- | ----------------------------------------- |
| **Next.js**    | 15.3.0 (canary) | React framework with App Router, SSR, ISR |
| **React**      | 19.0.0          | UI library with Server Components         |
| **TypeScript** | 5.8.2           | Type-safe development                     |

### Frontend

| Technology       | Version | Purpose                            |
| ---------------- | ------- | ---------------------------------- |
| **Tailwind CSS** | 4.0.14  | Utility-first styling framework    |
| **Headless UI**  | 2.2.0   | Unstyled, accessible UI components |
| **Heroicons**    | 2.2.0   | SVG icon library                   |
| **Geist**        | 1.3.1   | Vercel's custom font family        |
| **Sonner**       | 2.0.1   | Toast notifications                |

### Backend & API

| Technology                    | Version | Purpose                               |
| ----------------------------- | ------- | ------------------------------------- |
| **Shopify Storefront API**    | -       | Headless commerce backend (GraphQL)   |
| **Next.js Server Components** | 15.3.0  | Server-side rendering & data fetching |
| **Next.js Server Actions**    | 15.3.0  | Server-side mutations                 |

### Build & Development Tools

| Technology    | Version | Purpose                              |
| ------------- | ------- | ------------------------------------ |
| **pnpm**      | -       | Fast, disk-efficient package manager |
| **Turbopack** | -       | Next.js 15 bundler (dev mode)        |
| **PostCSS**   | 8.5.3   | CSS processing                       |
| **Prettier**  | 3.5.3   | Code formatting with Tailwind plugin |

---

## Architecture Pattern

### Monolithic SSR Application

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  React 19 Components (Hydrated)                  │  │
│  │  - Client Components (cart, search, interactive) │  │
│  │  - Optimistic UI Updates                         │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/HTTPS
                         │
┌────────────────────────▼────────────────────────────────┐
│              Next.js 15 App (Server)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │  App Router (File-System Routing)                │  │
│  │  - Server Components (default)                   │  │
│  │  - Server Actions (mutations)                    │  │
│  │  - API Routes (/api/revalidate)                  │  │
│  │  - Static Generation + ISR                       │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Business Logic (lib/)                           │  │
│  │  - Shopify GraphQL Client                        │  │
│  │  - Data fetching functions                       │  │
│  │  - Type definitions                              │  │
│  │  - Utility functions                             │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ GraphQL (HTTPS)
                         │
┌────────────────────────▼────────────────────────────────┐
│              Shopify Storefront API                      │
│  - Product catalog                                       │
│  - Collections & categories                              │
│  - Shopping cart                                         │
│  - Customer data                                         │
│  - CMS pages & menus                                     │
└──────────────────────────────────────────────────────────┘
```

### Rendering Strategy

**Hybrid Rendering Model:**

1. **Server Components** (Default)

   - Render on server
   - Fetch data directly from Shopify API
   - Zero JavaScript sent to client
   - Used for: Product listings, static content, SEO

2. **Client Components** (`'use client'`)

   - Interactive UI elements
   - State management
   - Event handlers
   - Used for: Cart, search filters, modals

3. **Static Generation + ISR**
   - Build-time rendering for product pages
   - On-demand revalidation via webhook
   - Stale-while-revalidate pattern

---

## Data Architecture

### Data Flow

```
User Request
    ↓
Next.js Server Component
    ↓
lib/shopify/index.ts (GraphQL Client)
    ↓
Shopify Storefront API
    ↓
GraphQL Query/Mutation
    ↓
Response (typed with TypeScript)
    ↓
React Component Rendering
    ↓
HTML sent to browser
```

### Data Models

**No Traditional Database** - All data stored in Shopify:

**Core Entities:**

- **Product** - SKU, title, description, images, variants, price
- **Collection** - Product groupings, filters
- **Cart** - Session-based shopping cart
- **Menu** - Navigation structure
- **Page** - CMS pages (About, FAQ, etc.)

**TypeScript Types** (`lib/shopify/types.ts`):

```typescript
type Product = {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: Image[];
  variants: ProductVariant[];
  priceRange: Money;
  seo: SEO;
};
```

### GraphQL Integration

**Architecture:** Client → GraphQL → Shopify

**GraphQL Components** (`lib/shopify/`):

1. **Fragments** (`fragments/`)

   - Reusable data structures
   - Files: `cart.ts`, `image.ts`, `product.ts`, `seo.ts`

2. **Queries** (`queries/`)

   - Data fetching operations
   - Files: `cart.ts`, `collection.ts`, `menu.ts`, `page.ts`, `product.ts`

3. **Mutations** (`mutations/`)

   - Data modification operations
   - Files: `cart.ts` (add, update, remove items)

4. **Client** (`index.ts`)
   - GraphQL client configuration
   - Authentication (Storefront Access Token)
   - Request/response handling
   - Error handling

---

## API Design

### Internal API Routes

**Base:** `/api`

| Endpoint          | Method | Purpose                                |
| ----------------- | ------ | -------------------------------------- |
| `/api/revalidate` | POST   | Webhook for on-demand ISR revalidation |

**Revalidation Flow:**

```
Shopify Admin (Product Update)
    ↓ Webhook
/api/revalidate?secret=XXX
    ↓ Verify Secret
    ↓ Revalidate Paths
Next.js Cache Cleared
    ↓
Next Request → Fresh Data
```

### External API (Shopify GraphQL)

**Endpoint:** `https://{SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`

**Authentication:**

- Header: `X-Shopify-Storefront-Access-Token`
- Token stored in environment variables

**Key Operations:**

**Queries:**

```graphql
# Get Product
query getProduct($handle: String!) {
  product(handle: $handle) {
    id
    title
    description
    # ... (see fragments/product.ts)
  }
}

# Get Collection
query getCollection($handle: String!) {
  collection(handle: $handle) {
    title
    products(first: 100) {
      edges {
        node { ... }
      }
    }
  }
}

# Get Cart
query getCart($cartId: ID!) {
  cart(id: $cartId) {
    id
    lines { ... }
    cost { ... }
  }
}
```

**Mutations:**

```graphql
# Add to Cart
mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { ... }
  }
}

# Update Cart
mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart { ... }
  }
}
```

---

## Component Architecture

### Component Organization

```
components/
├── cart/              # Shopping cart functionality (8 files)
│   ├── add-to-cart.tsx
│   ├── cart-context.tsx     # Cart state management
│   ├── modal.tsx
│   └── ...
├── layout/            # Site-wide layout (7 files)
│   ├── navbar/
│   ├── search/
│   └── footer.tsx
├── product/           # Product displays (4 files)
│   ├── gallery.tsx
│   ├── variant-selector.tsx
│   └── ...
├── grid/              # Product grids (3 files)
└── [standalone]/      # Utility components (10 files)
```

**Total:** 33 component files

### Component Patterns

**Server Components** (Default):

```tsx
// app/page.tsx
import { getProducts } from "lib/shopify";

export default async function HomePage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

**Client Components** (Interactive):

```tsx
"use client";

import { useState } from "react";

export function AddToCart({ productId }) {
  const [pending, setPending] = useState(false);
  // ... interactive logic
}
```

**Composition Pattern:**

- Server Components fetch data
- Pass data as props to Client Components
- Client Components handle interactivity
- Optimistic UI updates for cart operations

---

## Deployment Architecture

### Platform: Vercel

**Deployment Strategy:** Git-based continuous deployment

```
GitHub Repository (main branch)
    ↓ Push/Merge
Vercel Build Pipeline
    ↓ Build
    ├── Next.js build
    ├── TypeScript compilation
    ├── Asset optimization
    └── Image optimization
    ↓ Deploy
Vercel Edge Network (Global CDN)
    ├── Static assets (CDN)
    ├── Server-rendered pages (Edge Functions)
    └── ISR cache
    ↓
End Users (Worldwide)
```

### Infrastructure Components

**Vercel Edge Network:**

- Global CDN for static assets
- Edge Functions for SSR
- Automatic HTTPS/SSL
- DDoS protection

**Caching Strategy:**

- **Static Assets:** CDN-cached indefinitely
- **Product Pages:** ISR with on-demand revalidation
- **Cart:** Real-time (no caching)
- **Images:** Optimized and cached via Next/Image

### Environment Variables

**Required:**

```
SHOPIFY_STORE_DOMAIN
SHOPIFY_STOREFRONT_ACCESS_TOKEN
SITE_NAME
COMPANY_NAME
SHOPIFY_REVALIDATION_SECRET
```

**Configuration:**

- Managed in Vercel Dashboard
- Or via `vercel env pull` (CLI)

---

## Source Tree

See [`source-tree-analysis.md`](./source-tree-analysis.md) for detailed directory structure.

**Key Entry Points:**

- `app/layout.tsx` - Root layout
- `app/page.tsx` - Homepage
- `lib/shopify/index.ts` - Shopify API client
- `next.config.ts` - Next.js configuration

---

## Testing Strategy

### Current State

**Implemented:**

- **Prettier** - Code formatting validation
  ```bash
  pnpm prettier:check
  ```

**Not Yet Implemented:**

- Unit tests (Jest/Vitest)
- Integration tests
- E2E tests (Playwright)
- Visual regression tests

### Recommended Testing Approach

**Level 1: Unit Tests** (lib/, components/)

```typescript
// Example: lib/utils.test.ts
import { formatPrice } from "./utils";

test("formatPrice formats USD correctly", () => {
  expect(formatPrice(1999, "USD")).toBe("$19.99");
});
```

**Level 2: Component Tests** (React Testing Library)

```typescript
// Example: components/price.test.tsx
import { render } from '@testing-library/react';
import Price from './price';

test('Price component displays formatted amount', () => {
  const { getByText } = render(<Price amount="19.99" currencyCode="USD" />);
  expect(getByText('$19.99')).toBeInTheDocument();
});
```

**Level 3: E2E Tests** (Playwright)

```typescript
// Example: e2e/cart.spec.ts
test("user can add product to cart", async ({ page }) => {
  await page.goto("/product/test-product");
  await page.click('[data-testid="add-to-cart"]');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText("1");
});
```

---

## Performance Considerations

### Optimization Strategies

**1. Server Components**

- Reduce JavaScript bundle size
- Fetch data on server (closer to Shopify API)
- No hydration overhead for static content

**2. Image Optimization**

- Next.js Image component (`next/image`)
- Automatic format selection (AVIF, WebP)
- Lazy loading below fold
- Responsive images

**3. Code Splitting**

- Automatic route-based splitting
- Dynamic imports for heavy components
- Tree-shaking unused code

**4. Caching**

- ISR for product pages
- CDN caching for static assets
- Shopify API response caching (server-side)

**5. Edge Rendering**

- Deploy to Vercel Edge Network
- Reduce latency globally
- Faster TTFB (Time to First Byte)

### Monitoring

**Recommended Tools:**

- Vercel Analytics (built-in)
- Web Vitals tracking
- Shopify API request monitoring
- Error tracking (Sentry)

---

## Security Considerations

### Authentication & Authorization

**No User Authentication** (public storefront)

- Cart managed via session/cookies
- Checkout handled by Shopify
- No sensitive user data in Next.js app

### API Security

**Shopify Storefront API:**

- Read-only access token
- Rate limiting (Shopify-managed)
- CORS configured via Shopify Admin

**Revalidation Webhook:**

- Secret token verification
- HTTPS-only
- IP whitelisting (optional)

### Environment Variables

**Sensitive Data:**

- Never commit `.env` to version control
- Use Vercel environment variables
- Rotate tokens periodically

---

## Future Enhancements

### Potential Improvements

1. **Testing Suite**

   - Add Jest/Vitest for unit tests
   - Implement Playwright E2E tests
   - Visual regression testing

2. **Analytics**

   - Google Analytics integration
   - Conversion tracking
   - A/B testing framework

3. **Performance**

   - Implement service worker for offline support
   - Progressive Web App (PWA) features
   - Prefetching for common navigation paths

4. **Features**

   - Customer authentication
   - Wishlist functionality
   - Product reviews
   - Search autocomplete

5. **Internationalization**
   - Multi-language support
   - Multi-currency display
   - Regional content

---

## Related Documentation

- **[Development Guide](./development-guide.md)** - Setup and development workflow
- **[Source Tree Analysis](./source-tree-analysis.md)** - Detailed directory structure
- **[Component Inventory](./component-inventory.md)** - UI component catalog _(To be generated)_
- **[API Contracts](./api-contracts.md)** - Shopify API documentation _(To be generated)_
- **[Deployment Guide](./deployment-guide.md)** - Production deployment _(To be generated)_

---

**Document Version:** 1.0
**Last Updated:** 2025-10-14
**Maintained By:** Development Team
