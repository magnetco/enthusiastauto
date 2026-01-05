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

## User Features

### Shopping & E-commerce
**Browse and Purchase BMW Parts:**
- Browse the complete catalog of BMW parts and accessories
- View detailed product pages with high-resolution images and descriptions
- Filter products by BMW fitment (year, model, trim) to find compatible parts
- Select product variants (size, color, material, etc.)
- Add items to shopping cart with quantity selection
- Manage cart items (update quantities, remove items)
- Proceed to secure checkout via Shopify
- View product recommendations and related items

**Guest Shopping:**
- Browse and purchase without creating an account
- Cart persists across sessions using cookies

### Vehicle Inventory
**Browse BMW Vehicles for Sale:**
- View curated inventory of BMW vehicles
- Browse vehicle listings with detailed specifications
- View vehicle detail pages with photo galleries
- See vehicle specifications (mileage, chassis, exterior color, etc.)
- View service history and maintenance records
- Filter vehicles by various criteria

### Search & Discovery
**Find What You're Looking For:**
- Unified search across both vehicles and products
- Search autocomplete with suggestions as you type
- Filter results by category, vendor, price range, and more
- Filter badges to quickly see and remove active filters
- Browse products by collection/category
- View featured vehicles and popular parts on homepage

### User Account & Authentication
**Create and Manage Your Account:**
- Sign up with email and password
- Sign in with Google or Facebook OAuth
- Reset forgotten passwords via email
- Manage profile information (name, email, profile image)
- Add and manage shipping addresses
- Change account password
- Connect or disconnect OAuth accounts
- Delete account (with confirmation)

### My Garage (Favorites)
**Save Your Favorites:**
- Save favorite vehicles to your garage (requires account)
- Save favorite products to your garage (requires account)
- View all saved items in one place at `/account/garage`
- See up to 50 saved items (vehicles + products combined)
- Remove items from your garage
- Quick access to saved items with direct links

### Services
**Request BMW Services:**
- View available services (cosmetic repairs, conditioning, rejuvenation)
- Submit service request forms
- Contact service team via phone or form
- Learn about service offerings and pricing

### General Features
- Responsive design that works on desktop, tablet, and mobile
- Fast page loads with optimized images and caching
- SEO-optimized pages for better search engine visibility
- Accessible interface following web standards

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