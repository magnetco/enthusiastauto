# Story 6.1: Unified Search Infrastructure

Status: Draft

## Story

As a **developer**,
I want **a unified search system that queries both Sanity (vehicles) and Shopify (parts) and returns ranked results**,
so that **users can search across the entire platform from a single search interface**.

## Acceptance Criteria

1. **Search Index Integration** - Search system indexes both vehicles (Sanity) and parts (Shopify) in a unified searchable format
2. **Relevance Ranking** - Results ranked by relevance with configurable weights (exact match > partial match > metadata)
3. **Fuzzy Matching** - Search supports fuzzy matching for typos and partial queries with configurable thresholds
4. **Performance Target** - Search queries return results within 300ms for 95th percentile (NFR009 compliance)
5. **Real-Time Index Updates** - Indexes update within 15 minutes of content changes in either Sanity or Shopify (NFR008)
6. **Fallback Handling** - System gracefully handles search service unavailability with cached fallback
7. **Field Weighting** - Search configuration allows weighting different fields (title, description, tags, SKU, VIN) for relevance
8. **Result Format** - Search returns unified result objects with type discrimination (vehicle vs part) and consistent structure

## Tasks / Subtasks

- [ ] **Task 1: Install and configure Fuse.js** (AC: #1, #3, #7)
  - [ ] Install Fuse.js v7.0.0 (`pnpm add fuse.js`)
  - [ ] Create `lib/search/fuse.ts` with Fuse.js configuration
  - [ ] Define searchable fields and weights for vehicles (title, year, make, model, VIN, price, description)
  - [ ] Define searchable fields and weights for parts (title, handle, vendor, tags, price, description)
  - [ ] Configure fuzzy matching thresholds (threshold: 0.3 for balanced precision/recall)
  - [ ] Set up field weighting config (title: 2.0, tags: 1.5, description: 1.0, metadata: 0.8)
  - [ ] Export configured Fuse.js instances for vehicles and parts

- [ ] **Task 2: Create unified search orchestration service** (AC: #1, #2, #8)
  - [ ] Create `lib/search/unified.ts` for search orchestration logic
  - [ ] Implement `searchAll(query)` function that queries both Sanity and Shopify
  - [ ] Fetch vehicles from Sanity with title/make/model/year matching
  - [ ] Fetch parts from Shopify with title/handle/vendor/tag matching
  - [ ] Merge results from both sources into unified array
  - [ ] Apply relevance scoring across merged results
  - [ ] Sort by combined relevance score (Fuse.js score + manual boosts)
  - [ ] Return unified result objects with `{ type: 'vehicle' | 'product', item: T, score: number }`

- [ ] **Task 3: Implement search data indexing** (AC: #1, #5)
  - [ ] Create `lib/search/indexer.ts` for building search indexes
  - [ ] Implement vehicle index builder fetching all vehicles from Sanity
  - [ ] Implement product index builder fetching all products from Shopify
  - [ ] Transform data into Fuse.js-compatible format (flat objects with searchable fields)
  - [ ] Cache built indexes in memory with TTL (15 minutes per NFR008)
  - [ ] Implement index refresh trigger on cache expiration
  - [ ] Add index warming on application startup

- [ ] **Task 4: Add performance optimization and caching** (AC: #4, #6)
  - [ ] Implement in-memory result caching with LRU eviction
  - [ ] Set cache TTL to 5 minutes for search results
  - [ ] Add cache key generation based on query + filters
  - [ ] Implement cache warming for popular search terms (BMW, E46, M3, parts, etc.)
  - [ ] Add performance monitoring with timing metrics
  - [ ] Log slow queries (>300ms) for optimization
  - [ ] Implement fallback to cached results if index rebuild fails

- [ ] **Task 5: Create search API route** (AC: #1, #4)
  - [ ] Create `app/api/search/route.ts` API endpoint
  - [ ] Accept query parameters: `q` (query string), `type` (vehicles|parts|all), `limit` (default 20)
  - [ ] Validate query input (min 2 characters, max 100 characters)
  - [ ] Call unified search service with query and filters
  - [ ] Return JSON response with results array and metadata (totalResults, searchTime)
  - [ ] Add error handling with 400/500 status codes
  - [ ] Implement rate limiting (100 requests/min per IP)
  - [ ] Add response caching headers (Cache-Control: public, max-age=300)

- [ ] **Task 6: Integrate webhook handlers for index updates** (AC: #5)
  - [ ] Update Sanity webhook handler to trigger search index refresh on vehicle changes
  - [ ] Update Shopify webhook handler (if exists) to trigger index refresh on product changes
  - [ ] Implement debounced index refresh (wait 1 minute after last change to rebuild)
  - [ ] Add webhook validation for security
  - [ ] Log index refresh events for monitoring
  - [ ] Test webhook triggering with Sanity Studio vehicle updates

- [ ] **Task 7: Add TypeScript types and interfaces** (AC: #8)
  - [ ] Create `types/search.ts` with search-related type definitions
  - [ ] Define `SearchResult<T>` interface with type discrimination
  - [ ] Define `SearchQuery` interface for query parameters
  - [ ] Define `SearchResponse` interface for API responses
  - [ ] Define `SearchableVehicle` and `SearchableProduct` types
  - [ ] Export all types for use across application

- [ ] **Task 8: Write unit tests for search functionality** (AC: #1, #2, #3, #4)
  - [ ] Test Fuse.js configuration with sample vehicle data
  - [ ] Test Fuse.js configuration with sample product data
  - [ ] Test unified search orchestration merges results correctly
  - [ ] Test relevance scoring ranks exact matches higher than partial
  - [ ] Test fuzzy matching handles typos (e.g., "BNW" → "BMW")
  - [ ] Test performance meets <300ms target with 100+ items
  - [ ] Test cache invalidation after TTL expiration
  - [ ] Test fallback behavior when Sanity/Shopify unavailable
  - [ ] Test API route validation rejects invalid queries
  - [ ] Test webhook handlers trigger index refresh

- [ ] **Task 9: Document search architecture and usage** (AC: #7)
  - [ ] Document Fuse.js configuration in code comments
  - [ ] Document search API endpoint in README or API docs
  - [ ] Document search index structure and refresh strategy
  - [ ] Document field weighting rationale and tuning guide
  - [ ] Add JSDoc comments to all exported functions

## Dev Notes

### Architecture Context

**Search Strategy (ADR-005):**
- **Phase 2a (MVP):** Client-side search with Fuse.js - zero cost, sufficient for <500 items
- **Phase 2b (Future):** Upgrade to Meilisearch Cloud when inventory >200 items or latency >300ms
- **Current Scope:** Story 6.1 implements Fuse.js foundation with clear upgrade path

**Search Service Components:**
- `lib/search/unified.ts` - Main orchestration layer querying both CMSs
- `lib/search/fuse.ts` - Fuse.js client configuration and instances
- `lib/search/indexer.ts` - Index building and caching logic
- `app/api/search/route.ts` - Public search API endpoint

**Performance Requirements (NFR009):**
- 95th percentile latency <300ms
- In-memory caching with 5-minute TTL
- Index refresh within 15 minutes of content changes
- Cache warming for popular terms

**Data Sources:**
- **Sanity CMS:** Vehicles (title, year, make, model, trim, VIN, price, description, status)
- **Shopify Storefront API:** Products (title, handle, vendor, tags, price, description, availability)

### Project Structure Notes

**New Files to Create:**
```
lib/
├── search/
│   ├── unified.ts          # Main search orchestration
│   ├── fuse.ts             # Fuse.js configuration
│   ├── indexer.ts          # Index building & caching
│   └── recommendations.ts  # Future: Story 6.3
app/
└── api/
    └── search/
        └── route.ts         # Search API endpoint
types/
└── search.ts               # Search type definitions
```

**Dependencies to Install:**
- `fuse.js@^7.0.0` - Client-side fuzzy search library

**Existing Integrations:**
- Sanity client: `lib/sanity/client.ts` (use for vehicle queries)
- Shopify client: `lib/shopify/client.ts` (use for product queries)
- Cache utilities: `lib/cache/memory.ts` (use for result caching)

**Testing Considerations:**
- Unit tests with Vitest for search logic
- Mock Sanity/Shopify clients in tests
- Performance tests with 100+ items dataset
- E2E tests will be added in Story 6.2 (Search UI)

### References

**Requirements Sources:**
- [Source: docs/PRD.md#Epic 6: Advanced Search & Discovery] - Business requirements, NFR009 performance target
- [Source: docs/epic-stories.md#Story 6.1] - Detailed acceptance criteria, 13 point estimate
- [Source: docs/solution-architecture.md#ADR-005] - Fuse.js decision, upgrade path to Meilisearch
- [Source: docs/solution-architecture.md#Section 11.1] - Search Service in Business Logic Layer
- [Source: docs/solution-architecture.md#NFR009] - Search performance requirements (<300ms, fuzzy matching)

**Architecture References:**
- [Source: docs/solution-architecture.md#Section 1.1] - Fuse.js v7.0.0 in technology stack
- [Source: docs/solution-architecture.md#Section 13] - File structure: lib/search/, components/search/
- [Source: docs/solution-architecture.md#ADR-006] - In-memory cache strategy
- [Source: docs/solution-architecture.md#Section 8] - Sanity client usage patterns
- [Source: docs/solution-architecture.md#Section 8] - Shopify client usage patterns

**Related Stories:**
- Story 6.2 (next) - Unified Search UI & Results Page (depends on 6.1 search infrastructure)
- Story 6.3 - Recommendation Engine (uses search infrastructure for cross-discovery)
- Story 3.3 - Vehicle Listing Page (vehicle data source for search index)
- Story 4.4 - Cross-Content Linking (will use search for "compatible parts" features)

## Dev Agent Record

### Context Reference

- `docs/stories/story-context-6.6.1.xml` (Generated: 2025-10-23)

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

### File List

### Change Log

- **2025-10-23:** Story created by create-story workflow (v6.0). Story defines unified search infrastructure using Fuse.js per ADR-005. 8 acceptance criteria covering indexing, relevance, fuzzy matching, performance, caching, fallback. 9 tasks with 60+ subtasks covering: Fuse.js setup, orchestration service, indexing, caching, API routes, webhooks, types, tests, documentation. Next: Run story-context to generate implementation context, then dev-story for implementation.
