# Roadmap

What's shipped, in progress, and planned for the Enthusiast Auto platform.

**Last Updated:** February 10, 2026

## Summary

| Status | Phases | Description |
|--------|--------|-------------|
| ✅ **Shipped** | 20 phases | Core platform, e-commerce, CMS, admin tools, design system |
| 🔄 **In Progress** | 0 phases | Nothing actively in development |
| 📋 **Planned** | 7 phases | Analytics, AI, marketing automation, enhanced search |
| 🔧 **Technical Debt** | 16 items | Testing, optimization, missing features |

**Total Features Delivered:** 150+ features across 20 completed phases

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

### Phase 16: Vehicle Detail Page (VDP) Redesign
- [x] Modern single-column layout with tabbed navigation
- [x] 16:9 aspect ratio hero image carousel with keyboard navigation
- [x] Sticky tab navigation with smooth scrolling
- [x] Dark-themed specs section with highlights and specifications grid
- [x] Lazy-loaded gallery (8 initial images, load more in batches)
- [x] Fullscreen lightbox with keyboard navigation
- [x] Vehicle documentation viewer with radio sidebar
- [x] FAQ accordion with inquiry form integration
- [x] Similar vehicles recommendations section
- [x] Social sharing with native Web Share API
- [x] "New" badge for vehicles < 21 days old
- [x] Mobile-responsive throughout
- [x] Schema updates for documentation and FAQs

### Phase 17: Data Admin App Enhancements
- [x] Kanban board view for Service Requests
- [x] Kanban board view for Sell Submissions
- [x] Drag-and-drop workflow management
- [x] Service Request detail modal with full customer workflow
- [x] Sell Submission detail modal with comprehensive information
- [x] Status management with 6 workflow states
- [x] Quick action buttons (email, call, copy details)
- [x] Timeline view with status change history
- [x] Internal notes section
- [x] View toggle (Table ↔ Kanban)
- [x] Dark/light theme toggle in Settings
- [x] Settings page with appearance controls
- [x] Consolidated Documentation page
- [x] Sidebar reorganization with Customers, Inventory, Parts, System sections
- [x] Shopify admin deep links
- [x] Animated loader component matching brand design

### Phase 18: Content Management & Import Tools
- [x] Sanity CMS page management system
- [x] Full SEO control (meta tags, Open Graph, structured data)
- [x] Flexible hero sections with 4 size options
- [x] Prompt-based section system (no page builder needed)
- [x] Blog post import script from live site
- [x] Blog image download and migration (8 posts)
- [x] Vehicle inventory scraper from Webflow
- [x] Vehicle data sync to Sanity script
- [x] Inventory comparison tool (live site vs Sanity)
- [x] CSV vehicle import improvements
- [x] Type-safe page queries with TypeScript

### Phase 19: Visual Design System
- [x] Chassis icon component with fallback handling
- [x] Visual icon grid for vehicle filters (20 chassis codes)
- [x] Clickable icon cards with selected state indicators
- [x] Animated loader with rotating gradient border
- [x] Multiple loader variants (full-page, inline, lazy-loading)
- [x] Semantic color token system migration
- [x] Converted all raw Tailwind colors to semantic tokens
- [x] Accessibility improvements (prefers-reduced-motion support)
- [x] GPU-accelerated animations
- [x] Consistent brand gradient across components

### Phase 20: Database & Infrastructure
- [x] Database migration to new Neon Postgres instance
- [x] Migration scripts with verification tools
- [x] Database backup and restore capabilities
- [x] Connection pooling optimization
- [x] Database health monitoring tools
- [x] Zero downtime migration strategy
- [x] Data integrity verification

## In Progress

_Nothing actively in development._

## Planned

### Phase 21: My Garage Enhancements
- [ ] Garage vehicle cards with inline parts preview
- [ ] Garage-based personalized homepage recommendations
- [ ] Vehicle maintenance tracking
- [ ] Service history integration
- [ ] Fitment-based parts recommendations

### Phase 22: Sanity Studio Improvements
- [ ] Preview mode for draft vehicles
- [ ] Better image management workflow
- [ ] Custom validation rules for vehicle data
- [ ] Bulk editing capabilities
- [ ] Content scheduling and publishing workflows

### Phase 23: Performance & Analytics
- [ ] Image optimization audit
- [ ] Core Web Vitals improvements
- [ ] Google Analytics 4 integration
- [ ] Conversion tracking setup
- [ ] Custom event tracking (vehicle views, parts added to cart)
- [ ] Funnel analysis
- [ ] User behavior tracking

### Phase 24: Enhanced Search
- [ ] Server-side search with Algolia or Meilisearch
- [ ] Advanced filtering (price range, mileage, year)
- [ ] Saved searches
- [ ] Search result sorting options
- [ ] Search analytics and popular queries

### Phase 25: Customer Experience
- [ ] Live chat support
- [ ] Vehicle comparison tool (side-by-side specs)
- [ ] Email marketing integration (Mailchimp/SendGrid)
- [ ] Customer reviews and testimonials
- [ ] Automated email campaigns (drip sequences)
- [ ] Newsletter management
- [ ] Customer segmentation

### Phase 26: AI & Automation
- [ ] AI-powered chatbot for customer support
- [ ] BMW model expertise and specifications
- [ ] Parts fitment assistance via chat
- [ ] Lead qualification automation
- [ ] Sentiment analysis on customer inquiries
- [ ] Automated response suggestions
- [ ] Natural language processing for inquiries

### Phase 27: Marketing Automation
- [ ] Marketing dashboard with real-time metrics
- [ ] Campaign performance tracking
- [ ] ROI measurement tools
- [ ] A/B test management
- [ ] Lead source attribution
- [ ] Social media post scheduling
- [ ] Landing page builder

## Technical Debt

- [ ] Fix React type mismatch in reset-password page
- [ ] Migrate from deskTool to structureTool in Sanity
- [ ] Write E2E tests with Playwright (framework installed)
- [ ] Improve error boundaries across the application
- [ ] Add comprehensive error logging/monitoring (e.g., Sentry)
- [ ] Implement rate limiting on API endpoints
- [ ] Expand unit test coverage beyond core features
- [ ] Add integration tests for auth flows
- [ ] Download remaining 18 chassis icons (manual download required)
- [ ] Implement favorites API integration in VehicleHeroClient
- [ ] Add global FAQ schema in Sanity (currently returns empty array)
- [ ] Optimize animated loader performance on low-end devices
- [ ] Add PDF export functionality for vehicle details
- [ ] Add dynamic OG image generation for vehicles
- [ ] Implement internal notes save functionality in Service Request detail
- [ ] Add image upload for sell submissions in data admin app

## Known Issues

- **Turbopack**: Doesn't work with this project structure (pnpm + subdirectory). Using webpack bundler instead.
- **React types**: Type mismatch between @types/react versions causes build errors in some auth pages
