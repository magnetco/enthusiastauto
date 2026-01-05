# Enthusiast Auto Platform

BMW enthusiast e-commerce platform combining headless Shopify (parts) with Sanity-powered vehicle inventory. Built on Next.js 15 with modern React patterns and a unified shopping experience.

## Status

**Current Phase:** Production-ready platform with core features implemented

- ✅ **Phase 1 Complete:** Parts e-commerce (Shopify), fitment filtering, cart/checkout
- ✅ **Phase 2 Complete:** Vehicle inventory (Sanity), unified search, user accounts, favorites/garage
- ✅ **Authentication:** NextAuth.js with email/password, Google, and Facebook OAuth
- ✅ **User Features:** Profile management, garage (favorites), service requests

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15.3.0 (App Router) |
| **Language** | TypeScript 5.8.2 |
| **UI Library** | React 19.0.0 |
| **Styling** | Tailwind CSS 4.0.14 |
| **Components** | ShadCN UI (Radix UI primitives) |
| **E-commerce** | Shopify Storefront API (headless) |
| **CMS (Vehicles)** | Sanity CMS 4.x |
| **Database** | Vercel Postgres (via Prisma ORM) |
| **Authentication** | NextAuth.js 5.0 (beta) |
| **Email** | Resend |
| **Search** | Fuse.js (client-side) |
| **Testing** | Vitest + Playwright |
| **Hosting** | Vercel |

## Key Features

### E-commerce
- Headless Shopify storefront with product browsing and detail pages
- Shopping cart with persistent state
- Fitment-first filtering for BMW models (year/model/trim)
- Product recommendations and related items
- Variant selection (size, color, etc.)

### Vehicle Inventory
- Sanity CMS-powered vehicle listings
- Vehicle detail pages with galleries and specifications
- Service history tracking
- ISR (Incremental Static Regeneration) with webhook revalidation

### User Features
- User authentication (email/password, Google OAuth, Facebook OAuth)
- User profiles with address management
- **My Garage:** Save favorite vehicles and products
- Service request forms
- Account management (password changes, connected accounts)

### Search & Discovery
- Unified search across vehicles and products
- Filter panels and badge-based filtering
- Search autocomplete
- Collection-based browsing

### Performance
- Hybrid rendering (SSG, ISR, SSR) optimized per page type
- Image optimization via Next.js Image component
- Edge caching via Vercel CDN
- Webhook-driven revalidation for real-time content updates

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- Access to shared project credentials (database, API keys, etc.)

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma Client (connects to shared database)
pnpm prisma generate

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see the application.

### Environment Variables

This project uses a **shared database and services**. Get the `.env` file from your team lead or shared credentials store. The environment variables connect to:

- **Shared Vercel Postgres database** (all developers use the same database)
- **Shared Shopify store** (Storefront API)
- **Shared Sanity project** (vehicle content)
- **Shared email service** (Resend)
- **Shared authentication secrets** (NextAuth)

**Important:** Do not create your own database or run migrations. The database is already set up and shared by the team. Only run `pnpm prisma generate` to generate the Prisma Client for local development.

If you need access to the `.env` file, contact your team lead.

## Project Structure

```
enthusiastauto/
├── app/                    # Next.js App Router pages
│   ├── [page]/            # Dynamic CMS pages
│   ├── account/           # User account pages (protected)
│   │   ├── garage/        # My Garage (favorites)
│   │   └── profile/       # User profile
│   ├── auth/              # Authentication pages
│   ├── product/           # Product detail pages
│   ├── vehicles/          # Vehicle listing and detail
│   ├── search/            # Unified search
│   ├── services/          # Service request pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── revalidate/    # ISR revalidation webhooks
│   │   └── user/          # User API endpoints
│   └── studio/            # Embedded Sanity Studio
├── components/            # React components
│   ├── account/           # Account management components
│   ├── cart/              # Shopping cart components
│   ├── favorites/         # Garage/favorites components
│   ├── layout/            # Layout components (navbar, footer)
│   ├── product/           # Product-specific components
│   ├── search/            # Search components
│   ├── services/          # Service request components
│   ├── shared/            # Shared/reusable components
│   ├── ui/                # ShadCN UI components
│   └── vehicles/          # Vehicle-specific components
├── lib/                   # Business logic and utilities
│   ├── auth/              # Authentication configuration
│   ├── db/                # Database client (Prisma)
│   ├── favorites/         # Favorites/garage logic
│   ├── profile/           # User profile logic
│   ├── recommendations/   # Recommendation engine
│   ├── sanity/            # Sanity client
│   ├── search/            # Search implementation
│   └── shopify/           # Shopify API integration
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Prisma schema
│   └── migrations/        # Database migrations
├── sanity/                # Sanity CMS configuration
│   ├── schemas/           # Sanity schema definitions
│   └── lib/               # Sanity utilities
├── scripts/               # Utility scripts
│   └── import-vehicles.ts # Vehicle import script
├── context/               # Project documentation
│   └── architecture.md    # Detailed architecture docs
└── emails/                # Email templates (React Email)
```

## Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Production build
pnpm start            # Start production server

# Database
pnpm prisma generate  # Generate Prisma Client (connect to shared DB)
pnpm prisma studio    # Open Prisma Studio (view shared database)
# Note: Do not run migrations - database is managed centrally

# Testing
pnpm test             # Run tests
pnpm test:watch       # Watch mode
pnpm test:ui          # Vitest UI
pnpm test:coverage    # Coverage report

# Code Quality
pnpm prettier         # Format code
pnpm prettier:check   # Check formatting

# Utilities
pnpm import:vehicles  # Import vehicles from CSV
```

## Documentation

### Architecture Documentation
See `/context/architecture.md` for comprehensive architecture documentation including:
- System architecture and design decisions
- Data models and relationships
- API design
- Rendering strategies (SSG/ISR/SSR)
- Security considerations
- Performance optimization strategies

### Sanity CMS
- Studio embedded at `/studio`
- Schema definitions in `sanity/schemas/`

### Database Schema
- Prisma schema in `prisma/schema.prisma`
- Run `pnpm prisma studio` to explore the shared database
- All developers connect to the same shared database

## Deployment

**Vercel Auto-deployment:** Vercel automatically deploys from the main branch with:
- Preview deployments for pull requests
- Production deployments for main branch commits
- Automatic ISR revalidation via webhooks

## Development Guidelines

### Component Patterns
- **Server Components by default:** Only use `'use client'` when needed (interactivity, hooks, browser APIs)
- **TypeScript:** Strict mode enabled, type everything
- **Styling:** Tailwind CSS with ShadCN UI components
- **Forms:** React Hook Form with Zod validation

### Code Style
- Prettier configured for automatic formatting
- ESLint for linting (if configured)
- Component naming: PascalCase
- File naming: kebab-case for routes, PascalCase for components

## Contributing

1. Create a feature branch
2. Make your changes
3. Format code: `pnpm prettier`
4. Submit a pull request