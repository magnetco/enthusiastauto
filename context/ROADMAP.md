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

### Phase 8: Data Admin App
- [x] Create /data CRUD app for admins
- [x] Express API server with Neon connection
- [x] React + Vite frontend
- [x] User management routes
- [x] Account management routes

## In Progress

### Homepage UI Redesign
- [x] Dark header with white text and BMW M branding
- [x] Full-height hero section (70-90vh) with "THE LEADING BMW PRESERVATION FACILITY" headline
- [x] Redesigned inventory section with "// INVENTORY" heading
- [x] Homepage services section with numbered offerings (01-04)
- [x] Expanded navigation with Inventory dropdown
- [x] BMW M logo icon component

### Sanity Studio Improvements
- [ ] Preview mode for draft vehicles
- [ ] Better image management workflow

## Planned

### Data Admin Enhancements
- [ ] View/manage favorites
- [ ] View/manage service requests
- [ ] Database analytics dashboard
- [ ] Activity logs

### Enhanced Search
- [ ] Server-side search for better performance
- [ ] Search analytics
- [ ] Popular searches

### My Garage Enhancements
- [x] Popular compatible parts on vehicle PDP (deferred loading with skeleton UI)
- [x] Shopify BEST_SELLING sort for popularity ranking
- [ ] Garage vehicle cards with inline parts preview (5-10 parts per saved vehicle)
- [ ] "Parts for your garage" aggregated recommendations section
- [ ] Garage-based personalized homepage recommendations
- [ ] Saved vehicle fitment alerts (notify when compatible parts are added)

### Recommendations
- [ ] "You may also like" on vehicle pages
- [x] Compatible parts for viewed vehicles (deferred async loading)
- [ ] Recently viewed items

### Performance
- [ ] Image optimization audit
- [ ] Core Web Vitals improvements
- [ ] Edge caching optimization

### Analytics
- [ ] User behavior tracking
- [ ] Conversion funnel analysis
- [ ] A/B testing infrastructure

## Technical Debt

- [ ] Fix localStorage SSR error on homepage
- [ ] Fix React type mismatch in reset-password page
- [ ] Migrate from deskTool to structureTool in Sanity
- [ ] Add E2E tests with Playwright
- [ ] Improve error boundaries
- [ ] Add Sentry error monitoring

## Known Issues

- **Turbopack**: Doesn't work with this project structure (pnpm + subdirectory). Using webpack bundler instead.
- **localStorage error**: Node.js 25 with Cursor's injected `--localstorage-file` flag causes SSR errors. The flag enables experimental localStorage in Node.js but provides an invalid path. This is an environmental issue, not a code issue. Workaround: use an older Node.js version (< 22) or ensure the flag is properly configured.
- **React types**: Type mismatch between @types/react versions causes build errors
