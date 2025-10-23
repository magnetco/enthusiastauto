# Enthusiast Auto Ecommerce Site - Epic Breakdown

**Author:** Mike
**Date Created:** 2025-10-14
**Last Updated:** 2025-10-21 (Unified Platform Expansion)
**Project Level:** 3 (Complex system - subsystems and integrations)
**Target Scale:** 32-40 stories, 6 epics
**Status:** Phase 1 Complete (Epics 1-2) | Phase 2 Planning (Epics 3-6)

---

## Epic Overview

This project has evolved from a BMW parts e-commerce platform (Phase 1) into a comprehensive unified platform integrating both parts shopping and vehicle inventory (Phase 2).

**Phase 1 (✅ Complete - 10 stories, 50 points):**

**Epic 1: Core E-commerce Foundation & Vehicle Fitment** (8 stories, 42 points)
- ✅ Established essential marketplace functionality with Shopify integration
- ✅ Implemented intelligent vehicle fitment filtering system
- ✅ Delivered core product discovery and purchase capabilities

**Epic 2: Enhanced UX & Cross-Site Integration** (2 stories, 8 points)
- ✅ Delivered superior user experience with modern ShadCN design system
- ✅ Implemented responsive design and mobile optimization
- ⚠️ Story 1.11 (Webflow Devlink) removed during expansion planning

**Phase 2 (📋 Planning - Estimated 22-30 stories, 100-140 points):**

**Epic 3: Vehicle Inventory Integration** (6-8 stories, est. 35-45 points)
- Integrate Sanity CMS for vehicle content management
- Create browsable vehicle inventory with rich media galleries
- Enable vehicle status tracking and editor workflows

**Epic 4: Unified Site Architecture** (4-6 stories, est. 20-30 points)
- Create seamless unified navigation and routing
- Redesign homepage for both vehicles and parts
- Implement cross-content linking and discovery

**Epic 5: User Management System** (7-9 stories, est. 30-40 points)
- Implement user authentication and registration
- Build "My Garage" favorites system
- Create user dashboard with personalized features

**Epic 6: Advanced Search & Discovery** (5-7 stories, est. 25-35 points)
- Build unified search across vehicles and parts
- Implement recommendation engine
- Create cross-discovery features (compatible parts, vehicles with part)

---

## Epic 1: Core E-commerce Foundation & Vehicle Fitment

**Goal:** Establish the essential BMW parts marketplace with intelligent fitment filtering

**Priority:** Must Have - Core MVP functionality
**Estimated Duration:** 3-4 sprints
**Dependencies:** Shopify product data must include year-make-model tags

---

### Story 1: Product Listing Page with Shopify Integration

**As a** BMW enthusiast
**I want to** view a grid of available BMW parts from the Shopify inventory
**So that** I can browse the curated product catalog

**Acceptance Criteria:**

- Product listing page displays products in responsive grid layout
- Each product card shows: image, title, price, vendor, compatibility indicator
- Products are fetched in real-time from Shopify API
- Accurate inventory status is displayed (in stock / out of stock)
- Loading states are shown during data fetch
- Error handling for API failures with user-friendly messages
- Products display correctly on mobile, tablet, and desktop viewports

**Technical Notes:**

- Use Shopify Storefront API or existing commerce template integration
- Implement pagination or infinite scroll for large catalogs
- Cache strategy for performance

**Effort:** 5 points

---

### Story 2: Vehicle Fitment Filter (Year-Make-Model)

**As a** BMW owner
**I want to** filter products by my specific vehicle's year, make, and model
**So that** I only see parts that are compatible with my BMW

**Acceptance Criteria:**

- Vehicle selector interface with Year dropdown (e.g., 2001-2024)
- Make is pre-set to "BMW" (can be hidden or displayed)
- Model dropdown populated with BMW models (E46, E90, F30, G80, etc.)
- Filter applies immediately when selections are made
- Selected vehicle is saved to local storage/session
- "Clear filters" option resets vehicle selection
- Product count updates dynamically as filters are applied
- Products without fitment tags are either hidden or marked as "universal fit"

**Technical Notes:**

- Parse year-make-model from Shopify product tags (e.g., "2001-2006-E46")
- Consider multi-year ranges (e.g., E46 fits 1999-2006)
- Vehicle selection persists across page navigation

**Effort:** 8 points

---

### Story 3: Vendor & Category Filters

**As a** user browsing parts
**I want to** filter products by vendor (brand) and category
**So that** I can narrow down my search to specific manufacturers or part types

**Acceptance Criteria:**

- Vendor filter displays all available vendors from Shopify product data
- Category filter displays Shopify categories (Exhaust, Suspension, Interior, etc.)
- Multiple filters can be applied simultaneously (e.g., vendor + category + fitment)
- Active filters are clearly indicated with visual badges
- Filter selections persist during session
- Product count updates dynamically with each filter applied
- "Clear all filters" option resets all selections

**Technical Notes:**

- Use Shopify vendor field and category taxonomy
- Consider checkbox or dropdown UI pattern
- Efficient filtering algorithm for multiple criteria

**Effort:** 5 points

---

### Story 4: Product Search Functionality

**As a** user looking for specific parts
**I want to** search by product name, part number, or keywords
**So that** I can quickly find what I need

**Acceptance Criteria:**

- Search bar prominently placed in header or above product grid
- Search executes on Enter key or search button click
- Results display matching products based on title, description, SKU, tags
- Search works in combination with active filters
- "No results" state with helpful suggestions (clear filters, browse categories)
- Search term is preserved in URL for sharing
- Minimum 2 characters required before search executes

**Technical Notes:**

- Use Shopify search API or implement client-side search
- Consider fuzzy matching for typos
- Highlight search terms in results

**Effort:** 5 points

---

### Story 5: Product Detail Page with Fitment Info

**As a** potential buyer
**I want to** view detailed information about a specific product
**So that** I can make an informed purchase decision

**Acceptance Criteria:**

- Product detail page displays: title, price, full description, multiple images
- Gallery supports image zoom and multiple views
- Fitment compatibility clearly displayed (e.g., "Fits: BMW E46 2001-2006")
- Vendor/brand information shown
- Stock availability status visible
- Add to Cart button prominently placed
- Related products or "You may also like" section (optional for MVP)
- Breadcrumb navigation back to category/listing
- Mobile-optimized layout for product details

**Technical Notes:**

- Parse and display fitment tags in user-friendly format
- Image gallery component (ShadCN or custom)
- Meta tags for SEO

**REVISED (2025-10-15):** Template already provides product detail infrastructure (route, gallery, cart, related products). Story focuses on BMW-specific enhancements (fitment badges, vendor/stock display, breadcrumbs). See `docs/stories/story-1.5-implementation-analysis.md`.

**Effort:** 3 points (revised from 5 - template provides 62% of functionality)

---

### Story 6: Shopping Cart Integration

**As a** shopper
**I want to** add products to my cart and view my cart contents
**So that** I can proceed to checkout when ready

**Acceptance Criteria:**

- "Add to Cart" button on product cards and detail pages
- Visual feedback when item is added (toast notification or modal)
- Cart icon in header shows item count
- Cart panel/page displays all items with: image, title, price, quantity
- Quantity can be updated in cart
- Items can be removed from cart
- Subtotal calculated and displayed
- "Checkout" button navigates to Shopify checkout
- Cart persists across page reloads
- Empty cart state with call-to-action to browse products

**Technical Notes:**

- Use Shopify Cart API or commerce template cart implementation
- Cart state management (Context API, Zustand, or Redux)

**Effort:** 8 points

---

### Story 7: Responsive Grid Layout Implementation

**As a** user on any device
**I want** the site to adapt to my screen size
**So that** I have an optimal browsing experience on mobile, tablet, or desktop

**Acceptance Criteria:**

- Product grid adapts: 1 column (mobile), 2-3 columns (tablet), 3-4 columns (desktop)
- All UI elements are touch-friendly on mobile (min 44px touch targets)
- Navigation collapses to hamburger menu on mobile
- Filters accessible via slide-out panel or accordion on mobile
- Images load responsively without distortion
- Typography scales appropriately for readability
- Site tested on devices from 320px to 2560px width
- No horizontal scrolling on any viewport

**Technical Notes:**

- Use CSS Grid or Flexbox with breakpoints
- Mobile-first design approach
- Consider using ShadCN responsive utilities

**Effort:** 5 points

---

### Story 8: Visual Fitment Compatibility Indicators

**As a** user with a selected vehicle
**I want to** see clear visual indicators showing which products are compatible
**So that** I can quickly identify suitable parts

**Acceptance Criteria:**

- Compatible products show green checkmark or "Fits Your BMW" badge
- Badge appears on product cards in listing view
- Badge prominent on product detail page
- Tooltip or label explains compatibility (e.g., "Compatible with E46 2001-2006")
- Universal fit products indicated differently ("Universal Fit" badge)
- Products without fitment data show "Check Fitment" or similar warning
- Consistent badge design across all views

**Technical Notes:**

- Match selected vehicle against product tags
- Use consistent iconography (checkmark, warning icons)
- Consider color accessibility (don't rely on color alone)

**Effort:** 3 points

---

## Epic 2: Enhanced UX & Cross-Site Integration

**Goal:** Deliver superior user experience and seamless integration with main site

**Priority:** Should Have - Differentiation features
**Estimated Duration:** 2-3 sprints
**Dependencies:** Epic 1 completion; Webflow Devlink account access

---

### Story 10: ShadCN Component Integration & Design System

**As a** user interacting with the site
**I want** a modern, consistent, and accessible interface
**So that** my experience is delightful and intuitive

**Acceptance Criteria:**

- ShadCN components used for: buttons, cards, dropdowns, modals, toasts
- Consistent color palette and typography throughout site
- Design system documented (colors, spacing, component usage)
- All interactive elements have hover/focus/active states
- Accessible components (ARIA labels, keyboard navigation)
- Dark mode support (optional for MVP)
- Loading skeletons for async content
- Form inputs styled with ShadCN patterns
- Visual design exceeds enthusiastauto.com quality

**Technical Notes:**

- Install and configure ShadCN UI library
- Customize theme to match brand
- Ensure compatibility with existing commerce template

**Effort:** 8 points

---

### Story 11: Webflow Devlink Integration (Nav/Footer)

**As a** user navigating between enthusiastauto.com and shop subdomain
**I want** consistent navigation and branding
**So that** I feel I'm within the same ecosystem

**Acceptance Criteria:**

- Navigation bar shared from enthusiastauto.com via Webflow Devlink
- Footer shared from enthusiastauto.com via Webflow Devlink
- Navigation links work correctly (absolute URLs to main site)
- Shop link in nav highlights when on shop.enthusiastauto.com
- Shared components update automatically when changed in Webflow
- Styling/CSS from Webflow components doesn't conflict with shop styles
- Components responsive on shop site
- Fallback UI if Webflow components fail to load

**Technical Notes:**

- Set up Webflow Devlink and sync components
- May require Webflow Code Components feature
- Namespace CSS to avoid conflicts
- CORS configuration if needed

**Effort:** 13 points (Complex - new integration)

---

### Story 12: Persistent Cart State Between Sites

**As a** customer browsing both enthusiastauto.com and shop subdomain
**I want** my cart to persist across both sites
**So that** I don't lose items when navigating between properties

**Acceptance Criteria:**

- Cart contents saved when user navigates to enthusiastauto.com
- Cart contents restored when user returns to shop.enthusiastauto.com
- Cart ID or session token shared between domains
- Cart sync happens in real-time (within 1-2 seconds)
- Cart merges intelligently if items added on both sites
- User sees loading state during cart sync
- Fallback to local cart if cross-domain sync fails
- Works across different devices if user logged in (future)

**Technical Notes:**

- Use shared cookie domain (.enthusiastauto.com)
- Shopify cart API for cart ID persistence
- LocalStorage + server-side cart backup
- Consider security implications of cross-domain sharing

**Effort:** 13 points (Complex - cross-domain state management)

---

**Note:** Stories 1.11 (Webflow Devlink) and 1.12 (Persistent Cart) were removed during Phase 2 expansion planning as the project pivoted to unified platform architecture.

---

## Epic 3: Vehicle Inventory Integration (Phase 2)

**Goal:** Integrate Sanity CMS for vehicle content management and create browsable vehicle inventory with rich media galleries

**Priority:** Must Have - Foundation for unified platform
**Estimated Duration:** 4-5 sprints
**Dependencies:** Sanity CMS account; vehicle data and photos from existing enthusiastauto.com

---

### Story 3.1: Sanity CMS Setup & Configuration

**As a** developer
**I want** Sanity CMS integrated with the Next.js application
**So that** we can manage vehicle content through a headless CMS

**Prerequisites:**
- Sanity CMS account created
- Project repository structure reviewed

**Acceptance Criteria:**

- Sanity Studio installed and configured locally
- Sanity project created with appropriate dataset (production/staging)
- Sanity client configured in Next.js app for data fetching
- Basic Sanity Studio deployed and accessible to content editors
- Environment variables configured for Sanity project ID and dataset
- Sanity API authentication working correctly
- Sanity Studio customized with Enthusiast Auto branding

**Technical Notes:**

- Use @sanity/next-loader for efficient data fetching in Next.js 15
- Configure CORS for Sanity Studio access
- Set up Sanity webhooks for ISR revalidation

**Effort:** 5 points

---

### Story 3.2: Vehicle Schema & Data Models

**As a** content editor
**I want** comprehensive vehicle schemas in Sanity Studio
**So that** I can manage all vehicle information in a structured way

**Prerequisites:**
- Story 3.1 complete (Sanity CMS setup)
- Vehicle data structure documented from existing site

**Acceptance Criteria:**

- Vehicle schema includes: title, year, make, model, trim, VIN, mileage, price, status (current/sold)
- Specifications schema: engine, transmission, drivetrain, exterior color, interior color, features array
- Service history schema: date, type, mileage, description, cost
- Photo gallery field supporting 10-30 images with captions
- SEO fields: meta title, meta description, slug
- Rich text editor for vehicle description and condition notes
- Reference fields for related content (compatible parts - future)
- Validation rules ensure required fields are completed

**Technical Notes:**

- Use Sanity's portable text for rich content
- Image fields use Sanity's image asset management
- Consider structured arrays for features and service records

**Effort:** 8 points

---

### Story 3.3: Vehicle Listing Page

**As a** BMW enthusiast
**I want to** browse all available vehicles in a visually appealing grid
**So that** I can discover vehicles for sale

**Prerequisites:**
- Story 3.2 complete (vehicle schemas)
- Sample vehicle data entered in Sanity

**Acceptance Criteria:**

- Vehicle listing page accessible at /vehicles route
- Vehicles display in responsive grid (1-col mobile, 2-col tablet, 3-col desktop)
- Each vehicle card shows: hero image, year/make/model, price, mileage, status badge
- Filtering by model (E46, E90, X3, etc.), year range, price range, status
- Sorting by: price (low/high), year (new/old), mileage (low/high), recently added
- Loading states for data fetching
- Empty state when no vehicles match filters
- "Sold" vehicles visually distinguished with overlay/badge

**Technical Notes:**

- Use Sanity GROQ queries for filtering and sorting
- Implement ISR with 60-second revalidation
- Next.js Image component for optimized images

**Effort:** 8 points

---

### Story 3.4: Vehicle Detail Page with Photo Gallery

**As a** potential buyer
**I want to** view comprehensive vehicle information with high-quality photos
**So that** I can evaluate the vehicle before contacting the seller

**Prerequisites:**
- Story 3.3 complete (vehicle listing page)
- High-quality vehicle photos uploaded to Sanity

**Acceptance Criteria:**

- Vehicle detail page accessible at /vehicles/[slug]
- Full-screen photo gallery with 10-30 images, thumbnails, and navigation arrows
- Comprehensive vehicle information: specs, features, description, service history
- Price, mileage, VIN, and availability status prominently displayed
- Breadcrumb navigation (Home > Vehicles > [Year Model])
- "Contact Us" / "Inquire" button for interested buyers
- "Back to Inventory" link
- SEO optimization with schema.org structured data for automotive listings
- Social sharing meta tags (Open Graph, Twitter Cards)

**Technical Notes:**

- Use Next.js dynamic routes with generateStaticParams for SSG
- Implement image gallery with keyboard navigation and swipe gestures
- Schema.org Vehicle markup for rich snippets

**Effort:** 8 points

---

### Story 3.5: Vehicle Status Management & Real-Time Updates

**As a** content editor
**I want to** update vehicle status (current/sold) instantly
**So that** the website always reflects accurate inventory availability

**Prerequisites:**
- Story 3.4 complete (vehicle detail pages)
- Sanity webhooks configured

**Acceptance Criteria:**

- Editors can mark vehicles as "sold" in Sanity Studio
- Status change triggers webhook to revalidate affected pages
- Listing page updates within 60 seconds of status change
- Detail page shows "SOLD" overlay/badge when vehicle is sold
- Sold vehicles optionally hidden from main listing (filterable)
- Status history tracked in Sanity (when sold, by whom)
- Email notification sent to admin when vehicle marked sold (optional)

**Technical Notes:**

- Configure Sanity webhooks to trigger Next.js On-Demand ISR
- Use Next.js revalidatePath API
- Consider using Sanity's GROQ-powered webhooks for targeted revalidation

**Effort:** 5 points

---

### Story 3.6: Sanity Studio Workflow & Editor Training

**As a** non-technical staff member
**I want** an intuitive CMS interface with clear workflows
**So that** I can manage vehicle inventory without developer assistance

**Prerequisites:**
- Story 3.2 complete (vehicle schemas)
- All vehicle data fields finalized

**Acceptance Criteria:**

- Sanity Studio interface customized for Enthusiast Auto workflow
- Document templates for new vehicle listings
- Bulk image upload working smoothly
- Field descriptions and help text for editors
- Required field validation prevents incomplete publishing
- Draft/published workflow with preview functionality
- Editor training documentation created
- Training session conducted with content team

**Technical Notes:**

- Customize Sanity Studio desk structure
- Add custom input components if needed
- Configure Sanity preview functionality

**Effort:** 3 points

---

## Epic 4: Unified Site Architecture (Phase 2)

**Goal:** Create seamless unified navigation and routing structure that integrates vehicles and parts experiences

**Priority:** Must Have - Essential for cohesive user experience
**Estimated Duration:** 3-4 sprints
**Dependencies:** Epic 3 (vehicle pages exist); current parts infrastructure

---

### Story 4.1: Unified Navigation Header

**As a** user
**I want** consistent navigation that works across vehicles and parts sections
**So that** I can easily switch between browsing vehicles and shopping for parts

**Prerequisites:**
- Epic 1 complete (parts navigation exists)
- Epic 3 story 3.3 complete (vehicle pages exist)

**Acceptance Criteria:**

- Navigation header includes: "Vehicles", "Parts", "About", "Contact"
- Active section highlighted in navigation
- Mobile hamburger menu includes all sections
- Search bar accessible from header (unified search - Epic 6)
- Cart icon visible across all pages
- User account link (login/profile) if authenticated (Epic 5)
- Responsive design works on all viewports
- Navigation state persists across client-side routing

**Technical Notes:**

- Update existing navbar component to include vehicle links
- Use Next.js Link with active state detection
- Ensure navigation is server-rendered for SEO

**Effort:** 5 points

---

### Story 4.2: Homepage Redesign for Dual Content

**As a** visitor
**I want** a homepage that showcases both vehicles and parts
**So that** I understand this is a unified BMW enthusiast platform

**Prerequisites:**
- Epic 3 complete (vehicle inventory exists)
- Epic 1 complete (parts catalog exists)

**Acceptance Criteria:**

- Hero section highlights the unified platform value proposition
- "Featured Vehicles" section shows 3-4 current inventory highlights
- "Popular Parts" section shows 6-8 bestselling or featured parts
- Clear CTAs for "Browse Vehicles" and "Shop Parts"
- About section explaining Enthusiast Auto's unique offering
- Responsive layout optimized for mobile-first
- Fast page load (<2s) with optimized images
- SEO optimized with proper meta tags and headings

**Technical Notes:**

- Use Next.js Server Components for static content
- Fetch featured vehicles and parts at build time
- Implement ISR with 5-minute revalidation

**Effort:** 8 points

---

### Story 4.3: Routing Architecture & URL Structure

**As a** developer
**I want** clean, SEO-friendly URL structure
**So that** users and search engines can navigate the site intuitively

**Prerequisites:**
- Epic 3 complete (vehicle pages)
- Epic 1 complete (parts pages)

**Acceptance Criteria:**

- URL structure: /vehicles/*, /parts/*, /search, /account/*
- Vehicle URLs: /vehicles (listing), /vehicles/[slug] (detail)
- Parts URLs: /parts (listing), /parts/[category], /product/[handle]
- Search URL: /search?q=[query]&type=[vehicles|parts|all]
- Breadcrumbs reflect URL hierarchy on all pages
- 301 redirects for any legacy URLs from old site
- Sitemap.xml includes all dynamic routes
- Canonical URLs configured correctly

**Technical Notes:**

- Review and optimize Next.js App Router structure
- Generate dynamic sitemaps for Sanity and Shopify content
- Implement proper metadata for all route segments

**Effort:** 5 points

---

### Story 4.4: Cross-Content Linking Components

**As a** user viewing a vehicle
**I want to** see compatible parts recommendations
**So that** I can discover parts for the vehicle I'm interested in

**As a** user viewing a product
**I want to** see which vehicles currently in stock use this part
**So that** I can understand real-world fitment examples

**Prerequisites:**
- Story 4.3 complete (routing established)
- Epic 3 complete (vehicle data available)

**Acceptance Criteria:**

- Vehicle detail pages show "Compatible Parts" section with 4-6 relevant products
- Part recommendations based on vehicle year/model/trim
- Product detail pages show "Vehicles in Stock" section if applicable
- Click on recommended item navigates to appropriate detail page
- Cross-links maintain user context (breadcrumbs, back navigation)
- Empty state if no matching content ("No vehicles currently in stock with this part")
- Recommendation logic considers fitment tags from both systems

**Technical Notes:**

- Create shared components for cross-content recommendations
- Use vehicle fitment data to match with Shopify product tags
- Cache recommendation queries for performance

**Effort:** 8 points

---

## Epic 5: User Management System (Phase 2)

**Goal:** Implement user authentication and personalized features including favorites, garage, and account management

**Priority:** Should Have - Enables engagement and personalization
**Estimated Duration:** 4-5 sprints
**Dependencies:** Database for user data; authentication service

---

### Story 5.1: User Authentication with NextAuth.js

**As a** user
**I want to** create an account and log in securely
**So that** I can access personalized features

**Prerequisites:**
- Database configured (PostgreSQL, MongoDB, or Supabase)
- NextAuth.js library evaluated and approved

**Acceptance Criteria:**

- User registration with email and password
- Email verification for new accounts
- Secure login with JWT session tokens
- Password reset flow via email
- Session management with 30-day expiration
- Logout functionality clears session
- Protected routes redirect to login when unauthenticated
- Error handling for invalid credentials, duplicate emails

**Technical Notes:**

- Use NextAuth.js v5 (Auth.js) for Next.js 15 compatibility
- Configure database adapter for user storage
- Implement CSRF protection and secure cookies

**Effort:** 8 points

---

### Story 5.2: Social Login Integration

**As a** user
**I want to** sign in with Google or Facebook
**So that** I can access the site quickly without creating a new password

**Prerequisites:**
- Story 5.1 complete (email/password auth working)
- OAuth apps created for Google and Facebook

**Acceptance Criteria:**

- "Sign in with Google" button functional
- "Sign in with Facebook" button functional
- OAuth flow redirects properly after authentication
- User profile data (name, email, avatar) imported from provider
- Existing users can link social accounts to email account
- First-time social login creates new account automatically
- Error handling for OAuth failures or cancelled flows

**Technical Notes:**

- Configure OAuth providers in NextAuth.js
- Handle account linking scenarios
- Store provider tokens securely if needed for future API access

**Effort:** 5 points

---

### Story 5.3: User Profile & Account Settings

**As a** registered user
**I want to** manage my profile information and account settings
**So that** I can keep my information up-to-date

**Prerequisites:**
- Story 5.1 complete (authentication working)
- User database schema includes profile fields

**Acceptance Criteria:**

- Profile page shows: name, email, avatar, account creation date
- User can edit: name, avatar image
- User can change password (if email/password account)
- User can update saved addresses (shipping, billing)
- User can manage saved payment methods (Shopify integration)
- User can view linked social accounts
- User can delete account (with confirmation dialog)
- Form validation ensures data integrity

**Technical Notes:**

- Create profile page at /account/profile
- Integrate with Shopify Customer API for addresses/payment if applicable
- Implement secure password change flow

**Effort:** 8 points

---

### Story 5.4: "My Garage" - Save Favorite Vehicles & Parts

**As a** registered user
**I want to** save favorite vehicles and parts to "My Garage"
**So that** I can easily return to items I'm interested in

**Prerequisites:**
- Story 5.1 complete (user authentication)
- Database schema for favorites/garage

**Acceptance Criteria:**

- "Add to Garage" button on vehicle detail pages (heart icon)
- "Add to Favorites" button on product detail pages
- My Garage page at /account/garage shows saved items
- Separate tabs/sections for "Saved Vehicles" and "Saved Parts"
- Remove items from garage with confirmation
- Garage persists across sessions and devices
- Empty state when no saved items
- Limit of 50 saved items per user (configurable)

**Technical Notes:**

- Create favorites table with userId, itemId, itemType, createdAt
- Use optimistic UI updates for adding/removing favorites
- Query garage items efficiently with proper indexing

**Effort:** 8 points

---

### Story 5.5: Purchase History Integration

**As a** registered user
**I want to** view my purchase history
**So that** I can track orders and reference past purchases

**Prerequisites:**
- Story 5.3 complete (user profile exists)
- Shopify Customer API integration working

**Acceptance Criteria:**

- Purchase history page at /account/orders
- List of all past orders with: date, order number, items, total, status
- Order detail view shows full receipt information
- Link to Shopify order tracking page
- Filter orders by date range or status
- Export order history to CSV/PDF (optional)
- Empty state for users with no purchases
- Privacy: users only see their own orders

**Technical Notes:**

- Integrate Shopify Customer API or Admin API
- Link Shopify customer ID to user account on first purchase
- Cache order data with periodic refresh

**Effort:** 5 points

---

### Story 5.6: User Dashboard with Recommendations

**As a** registered user
**I want** a personalized dashboard when I log in
**So that** I see relevant content based on my interests

**Prerequisites:**
- Story 5.4 complete (My Garage functionality)
- Epic 6 Story 6.3 complete (recommendation engine - or basic version)

**Acceptance Criteria:**

- Dashboard at /account shows: welcome message with user name
- "My Garage" summary (X vehicles, Y parts saved) with quick links
- "Recommended for You" section based on garage items and browsing history
- Recent purchase summary (if any)
- Quick actions: "Browse Vehicles", "Shop Parts", "View Garage"
- Responsive design for mobile dashboard
- Dashboard loads quickly (<1s) with proper caching

**Technical Notes:**

- Create dashboard page at /account or /account/dashboard
- Fetch user data, garage items, and recommendations in parallel
- Use React Suspense for loading states

**Effort:** 5 points

---

## Epic 6: Advanced Search & Discovery (Phase 2)

**Goal:** Enable intelligent unified search across vehicles and parts with recommendation engine and cross-discovery features

**Priority:** Should Have - Key differentiator for unified platform
**Estimated Duration:** 3-4 sprints
**Dependencies:** Epic 3 (vehicles), Epic 1 (parts), search infrastructure decision

---

### Story 6.1: Unified Search Infrastructure

**As a** developer
**I want** a unified search system that queries both Sanity and Shopify
**So that** users can search vehicles and parts in one place

**Prerequisites:**
- Search infrastructure chosen (Algolia, Meilisearch, or custom)
- Epic 3 complete (vehicle data available)

**Acceptance Criteria:**

- Search index includes both vehicles and parts
- Search queries return results from both content types
- Results ranked by relevance (exact match > partial match > metadata)
- Search supports fuzzy matching for typos
- Search performance <300ms for 95th percentile
- Indexes update within 15 minutes of content changes
- Search configuration allows weighting different fields
- Fallback to basic search if service unavailable

**Technical Notes:**

- Evaluate Algolia vs. Meilisearch vs. custom solution
- Configure Sanity and Shopify webhooks to update indexes
- Implement search result scoring algorithm

**Effort:** 13 points (complex infrastructure decision)

---

### Story 6.2: Unified Search UI & Results Page

**As a** user
**I want to** search for vehicles or parts from a single search bar
**So that** I can quickly find what I'm looking for

**Prerequisites:**
- Story 6.1 complete (search infrastructure working)
- Story 4.1 complete (unified navigation)

**Acceptance Criteria:**

- Search bar in header accessible on all pages
- Search autocomplete shows suggestions as user types
- Search results page at /search displays both vehicles and parts
- Filter results by type: "All", "Vehicles", "Parts"
- Results show: thumbnail, title, price, relevance snippet
- Pagination or infinite scroll for large result sets
- Empty state with helpful suggestions if no results
- Search highlights query terms in results

**Technical Notes:**

- Debounce autocomplete requests (300ms)
- Use query parameters for search state (?q=query&type=all)
- Implement with Next.js App Router and search params

**Effort:** 8 points

---

### Story 6.3: Recommendation Engine - Basic Algorithm

**As a** user
**I want to** see personalized recommendations based on my activity
**So that** I discover relevant vehicles and parts I might not have found

**Prerequisites:**
- Story 5.4 complete (My Garage exists)
- User browsing history tracked (cookies or database)

**Acceptance Criteria:**

- Recommendation algorithm considers: garage items, browsing history, purchase history
- Recommendations shown on: homepage, dashboard, vehicle/product pages
- "Recommended for You" section shows 4-6 relevant items
- Recommendations refresh periodically (daily or weekly)
- Mix of vehicles and parts in recommendations (if user has both in garage)
- Recommendation generation completes in <200ms
- Fallback to popular/featured items for new users
- Recommendations exclude items already in garage

**Technical Notes:**

- Start with simple rule-based recommendations (collaborative filtering future)
- Track user activity events (view, add to garage, purchase)
- Generate recommendations asynchronously or on-demand

**Effort:** 13 points (complex algorithm design)

---

### Story 6.4: SEO Optimization & Schema Markup

**As a** business owner
**I want** excellent SEO across all pages
**So that** we rank well in search results and attract organic traffic

**Prerequisites:**
- Epic 3 complete (vehicle pages)
- Epic 4 complete (unified site architecture)

**Acceptance Criteria:**

- All pages have unique, descriptive meta titles and descriptions
- Vehicle pages use schema.org Vehicle structured data
- Product pages use schema.org Product structured data
- Homepage uses schema.org Organization markup
- Breadcrumb markup on all pages
- Dynamic sitemap.xml includes all pages
- Robots.txt properly configured
- Lighthouse SEO score 95+ on all page types
- Open Graph and Twitter Card meta tags for social sharing

**Technical Notes:**

- Use Next.js metadata API for dynamic meta tags
- Generate JSON-LD structured data for each page type
- Automate sitemap generation with build hooks

**Effort:** 5 points

---

## Phase 2 Story Summary

**Epic 3: Vehicle Inventory Integration** - 6 stories, 37 points
**Epic 4: Unified Site Architecture** - 4 stories, 26 points
**Epic 5: User Management System** - 6 stories, 39 points
**Epic 6: Advanced Search & Discovery** - 4 stories, 39 points

**Phase 2 Total:** 20 stories, 141 points

**Combined Project Total:**
- **Phase 1:** 10 stories, 50 points (✅ Complete)
- **Phase 2:** 20 stories, 141 points (📋 Planning)
- **Grand Total:** 30 stories, 191 points

Estimated Phase 2 delivery: 8-10 sprints (assuming 2-week sprints, team velocity 15-18 points)

---

## Success Metrics

**After Phase 1 (✅ Achieved):**
- ✅ Users can filter and find BMW parts by vehicle compatibility
- ✅ Products can be added to cart and purchased via Shopify
- ✅ Site is fully responsive and functional
- ✅ Design quality exceeds main enthusiastauto.com site

**After Phase 2 Completion:**

**Epic 3 Success:**
- Editors can publish vehicle listings in <15 minutes
- Vehicle pages load in <2 seconds with high-quality galleries
- Vehicle inventory reflects current availability in real-time

**Epic 4 Success:**
- 30%+ of vehicle page visitors explore compatible parts
- Unified navigation has <5% bounce rate from confusion
- Homepage engagement increases 20%+ vs Phase 1

**Epic 5 Success:**
- 25%+ user registration rate within 3 months
- 40%+ of registered users save items to My Garage
- Returning user rate increases 35%+ vs Phase 1

**Epic 6 Success:**
- Unified search used by 50%+ of visitors
- Search result click-through rate >30%
- Personalized recommendations drive 15%+ of discovery traffic

---

_This epic breakdown has evolved to Level 3 complexity - providing comprehensive story details with clear acceptance criteria, prerequisites, and technical notes for a complex system with multiple subsystems and integrations._
