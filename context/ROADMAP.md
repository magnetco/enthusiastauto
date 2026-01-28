# Roadmap

What's shipped, in progress, and planned for the Enthusiast Auto platform.

## Shipped

### Phase 1: Parts E-commerce
- [x] Shopify Storefront API integration
- [x] Product listing pages with grid view
- [x] Product detail pages with variants
- [x] Shopping cart with slide-out modal
- [x] Shopify checkout redirect
- [x] Fitment filtering (by BMW model/year)
- [x] Collection/category browsing
- [x] Filter badges and faceted navigation

### Phase 2: Vehicle Inventory
- [x] Sanity CMS schema for vehicles
- [x] Vehicle listing page with filtering
- [x] Vehicle detail page with gallery
- [x] ISR with webhook revalidation
- [x] Sanity Studio embedded in app
- [x] Vehicle import script from CSV

### Phase 3: Search & Discovery
- [x] Unified search across vehicles and products
- [x] Search autocomplete with suggestions
- [x] Fuse.js client-side fuzzy search
- [x] Search results page

### Phase 4: User Accounts
- [x] NextAuth.js integration
- [x] Email/password authentication
- [x] Google OAuth
- [x] User profile management
- [x] Password reset flow
- [x] Email verification

### Phase 5: My Garage (Favorites)
- [x] Save vehicles to garage
- [x] Save products to garage
- [x] Garage page at /account/garage
- [x] Favorite button on cards
- [x] 50 item limit

### Phase 6: Services
- [x] Services landing page
- [x] Service request form
- [x] Email notifications for requests

### Phase 7: Project Restructure
- [x] Move Next.js app to /website
- [x] Separate Sanity Studio to /studio
- [x] Context documentation (OVERVIEW, ARCHITECTURE, STACK, ROADMAP)
- [x] Consolidated environment variables
- [x] Git cleanup (remove accidentally tracked node_modules and .next)

### Phase 8: Data Admin App
- [x] Create /data CRUD app for admins
- [x] Express API server with Neon connection
- [x] React + Vite frontend
- [x] User management routes
- [x] Account management routes
- [x] Favorites management
- [x] Service requests management
- [x] Sell submissions management
- [x] Vehicle import from CSV to Sanity
- [x] Version history / change tracking

### Phase 9: Homepage & UI Polish
- [x] Dark header with white text and BMW M branding
- [x] Full-height hero section with "THE LEADING BMW PRESERVATION FACILITY" headline
- [x] Homepage services section with numbered offerings (01-04)
- [x] Expanded navigation with Inventory dropdown
- [x] BMW M logo icon component

### Phase 10: Compatible Parts & Recommendations
- [x] Popular compatible parts on vehicle PDP (deferred loading with skeleton UI)
- [x] Shopify BEST_SELLING sort for popularity ranking
- [x] Compatible parts for viewed vehicles (async loading)

### Phase 11: Blog
- [x] Blog landing page with featured carousel
- [x] Blog post detail pages
- [x] Category filtering
- [x] Sanity CMS integration for posts

### Phase 12: Sell Your Car
- [x] Sell landing page with three options (Sell, Consign, Auction)
- [x] Multi-step submission wizard
- [x] Vehicle information collection
- [x] Photo upload capability
- [x] API endpoint for sell submissions
- [x] Email notifications for submissions
- [x] Database storage via data admin app

### Phase 13: Marketing Pages
- [x] About page with company story and milestones
- [x] Contact page with multiple inquiry types
- [x] Contact form with vehicle/service/parts/general options
- [x] Privacy policy page
- [x] Terms of service page

### Phase 14: Bug Fixes & Stability
- [x] localStorage SSR error fix via instrumentation.ts
- [x] Cursor IDE localStorage injection workaround
- [x] Node.js 25 compatibility improvements

### Phase 15: Testing Infrastructure
- [x] Vitest setup for unit testing
- [x] Unit tests for search functionality
- [x] Unit tests for recommendations engine
- [x] Unit tests for API routes (profile, search, contact)
- [x] Unit tests for vehicle contact form
- [x] Playwright setup for E2E testing (installed, tests pending)

## In Progress

_Nothing actively in development._

## Planned

### Phase 16: My Garage Enhancements
- [ ] Garage vehicle cards with inline parts preview
- [ ] Garage-based personalized homepage recommendations
- [ ] Vehicle maintenance tracking
- [ ] Service history integration

### Phase 17: Sanity Studio Improvements
- [ ] Preview mode for draft vehicles
- [ ] Better image management workflow
- [ ] Bulk vehicle import improvements
- [ ] Custom validation rules

### Phase 18: Performance & Analytics
- [ ] Image optimization audit
- [ ] Core Web Vitals improvements
- [ ] Analytics dashboard integration
- [ ] Conversion tracking setup

### Phase 19: Enhanced Search
- [ ] Server-side search with Algolia or Meilisearch
- [ ] Advanced filtering (price range, mileage, year)
- [ ] Saved searches
- [ ] Search result sorting options

### Phase 20: Customer Experience
- [ ] Live chat support
- [ ] Vehicle comparison tool
- [ ] Email marketing integration
- [ ] Customer reviews and testimonials

## Technical Debt

- [ ] Fix React type mismatch in reset-password page
- [ ] Migrate from deskTool to structureTool in Sanity
- [ ] Write E2E tests with Playwright (framework installed)
- [ ] Improve error boundaries
- [ ] Audit and optimize image loading performance
- [ ] Add comprehensive error logging/monitoring (e.g., Sentry)
- [ ] Implement rate limiting on API endpoints
- [ ] Expand unit test coverage beyond core features
- [ ] Add integration tests for auth flows

## Known Issues

- **Turbopack**: Doesn't work with this project structure (pnpm + subdirectory). Using webpack bundler instead.
- **React types**: Type mismatch between @types/react versions causes build errors in some auth pages
