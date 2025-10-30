## Enthusiast Auto Group — Creative Brief for Figma Design System and Pages

### Purpose
Deliver a cohesive, conversion-oriented multi-breakpoint design system and full set of high-fidelity page designs for Enthusiast Auto Group (EAG). Designs must support a premium motorsport aesthetic, emphasize trust and provenance, and streamline discovery across vehicles, parts, and services.

### Context and Continuity
- We are replatforming from Webflow to Next.js with Sanity CMS.
- Maintain visual continuity with the current live site we recently launched—refine and systematize, don’t reinvent core brand visuals.
- Content management: Sanity will power content pages and vehicle inventory (vehicle content management).
- Ecommerce: Shopify Storefront will handle cart/checkout. Parts/merchandise catalog flows through Spark Shipping into Shopify; product detail routes use `/product/[handle]`.
- Goal for designers: design with these systems in mind so our components map cleanly to implementation.

### Quick Start for Designers
1) Work in two Figma pages: “Concepts” (explorations) and “Designs” (final).
2) On “Designs”, place master section components on the left (Components area) with variants for Desktop/Tablet/Mobile and creative layouts.
3) Build each page (Desktop 1440, Tablet 768, Mobile 390) side-by-side using only instances of those master components.
4) Use consistent tokens: color, type, spacing, grids. Prefer auto-layout everywhere.
5) Cover loading/empty/error states as component variants.
6) Keep changes aligned to the current site’s look; elevate clarity, hierarchy, and system consistency.

### Objectives
- Elevate brand perception while preserving performance heritage credibility
- Increase product and vehicle discovery via clear IA, filters, and search
- Improve add-to-cart and lead generation (vehicle inquiries, service contact)
- Ensure design system consistency for rapid engineering implementation

### Audience
- Existing BMW/M performance enthusiasts
- High-intent buyers researching inventory
- DIY and professional mechanics purchasing parts
- Owners seeking expert services and provenance documentation

### Brand Tone and Visual Direction
- Precision, authenticity, motorsport heritage
- High-contrast typographic hierarchy; editorial-grade imagery
- Dark-on-light primary theme with flexible dark accents (not full dark mode)
- Use generous spacing and clear grid to foreground photography

### Accessibility & Usability
- Target WCAG 2.1 AA
- Minimum 16px base type; comfortable tap targets
- Respect reduced motion; avoid text set over busy imagery

### Technical/Implementation Notes
- Designs must be directly implementable in Next.js/React with Tailwind
- Sections modeled as master components with variant props corresponding to breakpoints and creative variations
- Keep auto-layout, spacing tokens, and typography tokens consistent across components

---

## Figma File Structure Requirements

1) Page: “Designs”
- Contains final page frames for each route at three breakpoints shown side-by-side: Desktop (1440), Tablet (768), Mobile (390)
- Each page composed exclusively of section components (no detached layers)
- Left side of canvas: “Components” area showing master components, each with:
  - Variants per breakpoint (desktop/tablet/mobile)
  - Additional creative variations as nested variants (e.g., image-left, image-right, compact)
  - Clear property naming (Breakpoint, Layout, Theme, State)
- Main page frames reference these components; no local overrides beyond text and imagery

2) Page: “Concepts”
- Early art direction, moodboards, layout explorations, and alternative hero/section concepts
- Use frames labeled with concept themes; annotate rationale, pros/cons

Tokens/Guidelines (in a separate section at top of “Designs” page or a dedicated “Foundations” frame):
- Color styles with semantic roles (foreground, background, accent, critical)
- Typography styles with scale and usage guidance
- Spacing scale, grid, and container widths
- Elevation/shadows for cards, overlays, flyouts
- Interaction states (hover, focus, active, disabled)

---

## Global Components (Master Components in “Components” Section)

- Header (global navigation)
  - Variants: Desktop/Tablet/Mobile; sticky vs static; with/without utility bar
  - States: Auth vs guest, cart count, favorites count
- Footer (rich)
  - Variants: Full, compact; with newsletter; legal-only
- Announcement Bar
  - Variants: Info, promo, alert; dismissible
- Hero Section
  - Variants: Image-left, image-right, full-bleed, video
- Section: Vehicle Selector
  - Variants: Inline compact (header), full-width module, modal
- Section: Filter Panel/Badges
  - Variants: Docked side panel (desktop), sheet/drawer (tablet/mobile)
- Product/Vehicle Card
  - Variants: Vehicle vs Part; with badges; compact list mode vs grid
- Product Grid
  - Variants: 4-col/3-col/2-col; empty state; loading state
- Content Blocks
  - Variants: Feature list; media + copy; testimonial; stats
- CTA Bar
  - Variants: Primary, secondary, subtle; with icons
- Search Bar + Autocomplete
  - Variants: Global header; page-embedded
- Pagination & Sort
  - Variants: Numbers, load-more; sort and view toggles
- Banners/Trust Badges
  - Variants: Certifications, provenance, warranty
- Forms (generic)
  - Variants: Stacked vs inline; success/error states
- Toasts/Notifications
  - Variants: Success, error, info

---

## Page-by-Page Breakdown (All pages require Desktop, Tablet, Mobile side-by-side)

Note: Each page frame must be assembled from the master section components above. Where a section is unique, create a new master with variants.

1) Home (`/`)
- Sections (example order):
  1. Announcement Bar (optional)
  2. Header
  3. Hero (editorial vehicle imagery + key value prop)
  4. Vehicle Selector (quick select by model/chassis)
  5. Featured Vehicles Grid (curated inventory)
  6. Featured Parts Grid (top-selling or new)
  7. Services Teaser (CTA to Services)
  8. Editorial/Provenance Block (trust, heritage)
  9. Newsletter CTA (optional)
  10. Footer

2) Vehicles Index (`/vehicles`)
- Elements:
  - Search/Filters: Make, model, year, mileage, price, transmission, color, provenance tags
  - Product Grid: Vehicle cards, empty/loading states
  - Sort & view controls; applied filter badges
  - SEO copy block (collapsible on mobile)

3) Vehicle Detail (`/vehicles/[slug]`)
- Elements:
  - Media gallery (image-first; video variant)
  - Title, key specs, badges (e.g., 1-owner, original paint)
  - Price, inquiry CTA (primary), schedule viewing, share/favorite
  - Detailed specification tabs/accordion (Overview, Specs, Service history, Provenance docs)
  - Similar Vehicles carousel
  - SEO content block

4) Parts Index (`/parts` or `/search/parts` depending on IA)
- Elements:
  - Category navigation, filters (fitment, price, brand, availability)
  - Search within parts
  - Product Grid (Part cards)
  - Pagination or load-more

5) Part Detail (`/product/[handle]`)
- Elements:
  - Media (image/video), title, brand, fitment badge
  - Price, add-to-cart; stock status; quantity
  - Fitment and compatibility table
  - Description, specs, installation notes
  - Related parts upsell

6) Services (`/services`)
- Elements:
  - Services hero (credibility, facility imagery)
  - Service offering cards (diagnostics, restoration, performance tuning)
  - Process overview (steps)
  - Trust proof (certifications, team)
  - Inquiry form CTA

7) Search Results (`/search` and `/search/[collection]`)
- Elements:
  - Unified search bar w/ autocomplete
  - Tabs or scopes (All, Vehicles, Parts, Content)
  - Results list with type-specific cards
  - Filters by scope; empty state guidance

8) Account Overview (`/account`)
- Elements:
  - Profile summary (avatar, email, saved vehicles/parts counts)
  - Quick links to Garage, Orders, Favorites, Settings

9) Account: Garage (`/account/garage`)
- Elements:
  - Saved vehicles list; notes; reminders
  - Maintenance timeline component (concept)

10) Account: Favorites / Wishlist (`/favorites` or `/wishlist`)
- Elements:
  - Favorited vehicles and parts grids; bulk actions; share

11) Auth: Sign In / Sign Up / Reset (`/auth/...`)
- Elements:
  - Minimal, trust-forward forms; SSO variant if planned
  - Error/success states; password requirements

12) Cart & Mini-Cart
- Elements:
  - Mini-cart drawer (global component variant)
  - Full cart page: items, price summary, shipping est., upsells

13) Sell Your Car (`/[page]` → `sell-your-car`)
- Elements:
  - Persuasive hero, credibility signals
  - How it works (steps), required info checklist
  - Lead capture form CTA

14) Under the Hood (Blog)
- Parent > child set:
  - Index (`/[page]` → `under-the-hood`): article list, categories/tags, featured story
  - Article (`/[page]` → `under-the-hood/[slug]`): hero image, byline/date, body content, related posts

15) EAG Collection (`/[page]` → `eag-collection`)
- Elements:
  - Curated gallery/cards, collection story block
  - Links to related vehicles/content

16) Merchandise (Landing) (`/[page]` → `merchandise`)
- Elements:
  - Featured products, editorial blocks
  - CTA to Parts index where applicable

17) Contact (`/[page]` → `contact` or `/contact`)
- Elements:
  - Contact form, map/location, hours
  - Department routing (sales, service, parts)

18) Error/Empty States
- Elements:
  - 404, 500, empty search, empty cart; clear recovery CTAs

19) Planned Account Pages (if included in scope)
- Orders (`/account/orders`) and Order Detail (`/account/orders/[orderId]`)
- Addresses (`/account/addresses`) with create/edit views
- Note: design components should reuse global form, list, and detail patterns

---

## Breakpoint Requirements
- Desktop: 1440px wide canvas, 12-column grid, 80–120px gutters
- Tablet: 768px wide canvas, 8-column grid, 32px gutters
- Mobile: 390px wide canvas, 4-column grid, 16px gutters
- All components must have breakpoint variants with consistent spacing tokens

---

## Deliverables Checklist
- Figma file with two pages: “Designs” (final), “Concepts” (explorations)
- “Designs” page includes:
  - Components section on the left with master components and variant sets
  - Page frames for every route listed, at three breakpoints side-by-side
  - Strict component usage; no detached layers in final
- Tokenized foundations (color, type, spacing, shadows, grids)
- Annotations on interaction states and empty/loading/error states

---

## Content & Asset Guidance
- Photography: High-resolution, minimal compression; avoid busy backgrounds for text overlays
- Copy: Concise, technical where needed; emphasize provenance and performance credibility
- Icons: Simple outline set; consistent stroke

---

## Review & Handoff Process
1. Concept Review (Concepts page): choose art direction and section approaches
2. Component System Review: verify variant set completeness across breakpoints
3. Page Review: verify composition, IA, and state coverage
4. Handoff: provide component/property mapping notes for engineering; ensure library is organized and named consistently

---

## Notes for Engineering Parity
- Each section component should map to a React component with props for variant controls (e.g., layout, theme, density)
- Ensure states for loading/empty/error exist as component variants to match skeletons and error boundaries
- Provide sample data in page frames to approximate real content lengths


