# Source Tree Analysis

**Project:** Enthusiast Auto Ecommerce Site
**Type:** Next.js 15 SSR Web Application (Monolith)
**Generated:** 2025-10-14

---

## Annotated Directory Structure

```
enthusiastauto-1/
├── app/                          # Next.js App Router (Pages & API Routes)
│   ├── [page]/                   # Dynamic page routes
│   ├── api/                      # API Routes
│   │   └── revalidate/          # On-demand ISR revalidation endpoint
│   │       └── route.ts         # → Webhook endpoint for cache invalidation
│   ├── product/                  # Product pages
│   │   └── [handle]/            # Dynamic product detail pages
│   ├── search/                   # Search functionality
│   │   └── [collection]/        # Collection/category pages
│   ├── layout.tsx               # 🎯 Root layout (app-wide wrapper)
│   ├── page.tsx                 # 🎯 Homepage entry point
│   ├── globals.css              # Global Tailwind CSS styles
│   ├── error.tsx                # Error boundary component
│   ├── robots.ts                # SEO: robots.txt generation
│   ├── sitemap.ts               # SEO: dynamic sitemap generation
│   └── opengraph-image.tsx      # SEO: OG image generation
│
├── components/                   # React UI Components (33 files)
│   ├── cart/                    # Shopping cart components
│   │   ├── add-to-cart.tsx     # Add to cart button w/ optimistic updates
│   │   ├── cart-context.tsx    # Cart state management
│   │   ├── close-cart.tsx      # Cart drawer close button
│   │   ├── delete-item-button.tsx # Remove item from cart
│   │   ├── edit-item-quantity-button.tsx # Quantity controls
│   │   ├── index.tsx           # Cart drawer/modal
│   │   ├── modal.tsx           # Cart overlay modal
│   │   └── open-cart.tsx       # Cart trigger button
│   ├── grid/                    # Product grid layouts
│   │   ├── index.tsx           # Grid container
│   │   ├── three-items.tsx     # 3-column grid
│   │   └── tile.tsx            # Individual grid tile
│   ├── icons/                   # SVG icon components
│   │   └── logo.tsx            # Brand logo
│   ├── layout/                  # Layout components
│   │   ├── navbar/             # Navigation bar
│   │   │   ├── index.tsx       # Main navbar
│   │   │   └── mobile-menu.tsx # Mobile navigation
│   │   ├── search/             # Search components
│   │   │   ├── filter.tsx      # Search filters
│   │   │   ├── index.tsx       # Search bar
│   │   │   └── collections.tsx # Collection filters
│   │   ├── footer.tsx          # Site footer
│   │   └── product-grid-items.tsx # Product grid wrapper
│   ├── product/                 # Product display components
│   │   ├── gallery.tsx         # Product image gallery
│   │   ├── product-description.tsx # Product details
│   │   ├── variant-selector.tsx # Size/color selectors
│   │   └── grid-tile-image.tsx # Product thumbnail
│   ├── carousel.tsx             # Image carousel
│   ├── label.tsx                # Badge/label component
│   ├── loading-dots.tsx         # Loading indicator
│   ├── logo-square.tsx          # Square logo variant
│   ├── price.tsx                # Price display w/ formatting
│   ├── prose.tsx                # Rich text renderer
│   └── welcome-toast.tsx        # Welcome notification
│
├── lib/                         # Shared utilities and integrations
│   ├── shopify/                 # 🔌 Shopify Storefront API Integration
│   │   ├── fragments/          # GraphQL fragments
│   │   │   ├── cart.ts         # Cart data fragment
│   │   │   ├── image.ts        # Image data fragment
│   │   │   ├── product.ts      # Product data fragment
│   │   │   └── seo.ts          # SEO metadata fragment
│   │   ├── mutations/          # GraphQL mutations
│   │   │   └── cart.ts         # Cart operations (add/update/remove)
│   │   ├── queries/            # GraphQL queries
│   │   │   ├── cart.ts         # Fetch cart
│   │   │   ├── collection.ts   # Fetch collections
│   │   │   ├── menu.ts         # Fetch navigation menus
│   │   │   ├── page.ts         # Fetch CMS pages
│   │   │   └── product.ts      # Fetch products
│   │   ├── index.ts            # 🎯 Shopify client & API functions
│   │   └── types.ts            # TypeScript type definitions
│   ├── constants.ts             # App-wide constants
│   ├── type-guards.ts           # Type validation utilities
│   └── utils.ts                 # General utility functions
│
├── fonts/                       # Custom font files
│   └── GeistVF.woff            # Geist variable font
│
├── docs/                        # Documentation
│   ├── bmm-workflow-status.md  # Workflow tracking
│   ├── project-scan-report.json # Scan state file
│   └── source-tree-analysis.md # This file
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore patterns
├── next.config.ts               # 🎯 Next.js configuration
├── package.json                 # 🎯 Dependencies and scripts
├── pnpm-lock.yaml               # Lock file for pnpm
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # 🎯 TypeScript configuration
├── README.md                    # Project documentation
└── license.md                   # License information
```

---

## Critical Directories

### 🎯 Entry Points

1. **`app/page.tsx`** - Homepage (root route `/`)
2. **`app/layout.tsx`** - Root layout with providers
3. **`lib/shopify/index.ts`** - Shopify API client initialization
4. **`next.config.ts`** - Next.js app configuration

### 📦 Core Application Structure

| Directory     | Purpose                                 | Key Files                            |
| ------------- | --------------------------------------- | ------------------------------------ |
| `app/`        | Next.js App Router pages & API routes   | page.tsx, layout.tsx, route.ts files |
| `components/` | Reusable React UI components (33 files) | cart/, product/, layout/             |
| `lib/`        | Business logic & API integrations       | shopify/, utils.ts, constants.ts     |
| `fonts/`      | Custom typography assets                | GeistVF.woff                         |

### 🔌 Integration Points

**Shopify Storefront API** (`lib/shopify/`)

- **Client:** GraphQL client with authentication
- **Queries:** Products, collections, cart, menus, pages
- **Mutations:** Cart operations (add, update, remove items)
- **Fragments:** Reusable data structures for cart, product, image, SEO
- **Types:** TypeScript definitions for Shopify data

### 🎨 UI Component Organization

```
components/
├── cart/           # 8 files - Shopping cart functionality
├── grid/           # 3 files - Product grid layouts
├── icons/          # 1 file  - SVG icons
├── layout/         # 7 files - Site-wide layout (navbar, footer, search)
├── product/        # 4 files - Product displays & galleries
└── [standalone]    # 10 files - Reusable utilities (carousel, price, etc.)
```

### 🛣️ Routing Structure

**App Router** (file-system based):

- `/` - Homepage (app/page.tsx)
- `/product/[handle]` - Product details
- `/search/[collection]` - Collection pages
- `/[page]` - CMS pages
- `/api/revalidate` - ISR revalidation webhook

---

## Technology Patterns

### Server Components

- Most components in `app/` are Server Components
- Data fetching happens on the server via Shopify API
- Reduces client-side JavaScript

### Client Components

- Cart interactions (`components/cart/`)
- Search/filtering (`components/layout/search/`)
- Interactive UI elements (carousels, modals)

### API Integration

- Shopify Storefront GraphQL API
- No traditional database
- On-demand revalidation via webhook

### Styling

- Tailwind CSS v4 utility classes
- Global styles in `app/globals.css`
- Component-level styling with Tailwind

---

## File Counts

- **Total Component Files:** 33
- **Shopify Integration Files:** 12
- **App Router Pages:** 5+ (dynamic)
- **API Routes:** 1

---

**Next:** See `project-overview.md` for high-level architecture summary
