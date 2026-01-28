# Phase 19: Enhanced Search

**Epic**: Upgrade search infrastructure with server-side search, advanced filtering, and saved searches

**Priority**: Medium  
**Estimated Effort**: Large (3-4 weeks)  
**Dependencies**: Phase 3 (Search & Discovery)

---

## Overview

Replace client-side Fuse.js search with robust server-side search using Algolia or Meilisearch, add advanced filtering capabilities, implement saved searches, and provide flexible sorting options.

---

## User Stories

### Story 1: Server-Side Search with Algolia/Meilisearch

**As a** site visitor  
**I want to** search vehicles and products with instant, accurate results  
**So that** I can quickly find what I'm looking for

**Acceptance Criteria:**
- [ ] Sub-100ms search response time
- [ ] Typo tolerance (fuzzy matching)
- [ ] Synonym support (e.g., "M3" → "M Series 3")
- [ ] Faceted search with filters
- [ ] Highlighting of matched terms
- [ ] Search analytics (popular queries, no-result queries)
- [ ] Handles 10,000+ products and vehicles
- [ ] Real-time index updates via webhooks
- [ ] Fallback to client-side search if service unavailable

**Technical Decision: Meilisearch vs. Algolia**

**Meilisearch (Recommended):**
- ✅ Open source, self-hostable
- ✅ Lower cost (free tier generous)
- ✅ Simple API, fast setup
- ✅ Great typo tolerance
- ✅ Supports filtering and faceting
- ❌ Less mature than Algolia
- ❌ Fewer advanced features

**Algolia:**
- ✅ Industry leader, battle-tested
- ✅ Advanced features (AI, personalization)
- ✅ Excellent documentation
- ✅ Built-in analytics
- ❌ Expensive at scale
- ❌ Vendor lock-in

**Recommendation**: Start with Meilisearch for cost efficiency, migrate to Algolia if advanced features needed.

**Technical Tasks:**
- [ ] Set up Meilisearch instance (Railway, Fly.io, or self-hosted)
- [ ] Create search indexes for vehicles and products
- [ ] Build indexing pipeline (sync on create/update/delete)
- [ ] Implement search API route
- [ ] Update SearchBar component to use new API
- [ ] Add search result highlighting
- [ ] Configure synonyms and stop words
- [ ] Set up webhook-based reindexing

**Files to Create:**
- `website/lib/search/meilisearch.ts`
- `website/lib/search/indexer-meilisearch.ts`
- `website/app/api/search/v2/route.ts`
- `website/scripts/reindex-search.ts`

**Files to Modify:**
- `website/components/layout/navbar/search.tsx`
- `website/app/search/page.tsx`
- `website/lib/search/fuse.ts` (keep as fallback)

**Meilisearch Index Schema:**
```typescript
// Vehicles index
{
  uid: 'vehicles',
  primaryKey: 'id',
  searchableAttributes: [
    'title',
    'make',
    'model',
    'chassis',
    'year',
    'vin',
    'description',
  ],
  filterableAttributes: [
    'status',
    'chassis',
    'year',
    'price',
    'mileage',
  ],
  sortableAttributes: ['price', 'year', 'mileage', 'createdAt'],
  rankingRules: [
    'words',
    'typo',
    'proximity',
    'attribute',
    'sort',
    'exactness',
  ],
}
```

---

### Story 2: Advanced Filtering

**As a** user searching for vehicles or products  
**I want to** filter results by multiple criteria  
**So that** I can narrow down to exactly what I need

**Acceptance Criteria:**

**Vehicle Filters:**
- [ ] Price range slider (min/max)
- [ ] Year range slider (min/max)
- [ ] Mileage range slider (min/max)
- [ ] Chassis codes (multi-select)
- [ ] Status (Available, Sold, Pending)
- [ ] Transmission (Manual, Automatic)
- [ ] Exterior color (multi-select)
- [ ] Interior color (multi-select)

**Product Filters:**
- [ ] Price range slider
- [ ] Category (multi-select)
- [ ] Fitment (by vehicle model)
- [ ] Brand (multi-select)
- [ ] In stock / Out of stock
- [ ] On sale

**Filter UX:**
- [ ] Filters persist in URL query params
- [ ] Active filters shown as removable badges
- [ ] "Clear all filters" button
- [ ] Filter count badges (e.g., "Price (2)")
- [ ] Mobile: Filters in slide-out drawer
- [ ] Desktop: Filters in left sidebar
- [ ] Real-time result count as filters change
- [ ] Filters collapse/expand

**Technical Tasks:**
- [ ] Build FilterPanel component with all filter types
- [ ] Implement URL state management (useSearchParams)
- [ ] Create filter query builder for search API
- [ ] Add filter aggregations to search response
- [ ] Optimize filter queries for performance
- [ ] Add filter presets (e.g., "Under $50k", "E46 M3s")

**Files to Create:**
- `website/components/search/FilterPanel.tsx`
- `website/components/search/RangeSlider.tsx`
- `website/components/search/FilterBadges.tsx`

**Files to Modify:**
- `website/app/search/page.tsx`
- `website/components/vehicles/VehicleFilters.tsx`
- `website/app/api/search/v2/route.ts`

**Filter Query Example:**
```typescript
const searchParams = {
  q: 'M3',
  filters: [
    'status = available',
    'chassis IN [E46, E92]',
    'price >= 30000 AND price <= 60000',
    'year >= 2000',
  ].join(' AND '),
  sort: ['price:asc'],
  limit: 20,
  offset: 0,
}
```

---

### Story 3: Saved Searches

**As a** logged-in user  
**I want to** save my search criteria  
**So that** I can quickly re-run searches and get notified of new matches

**Acceptance Criteria:**
- [ ] "Save Search" button on search results page
- [ ] Name saved searches (e.g., "E46 M3 under $50k")
- [ ] View saved searches in account dashboard
- [ ] One-click to re-run saved search
- [ ] Edit saved search criteria
- [ ] Delete saved searches
- [ ] Optional: Email notifications for new matches (daily digest)
- [ ] Limit: 10 saved searches per user
- [ ] Saved searches include all filters and sort options

**Technical Tasks:**
- [ ] Create SavedSearch database table
- [ ] Build SavedSearch CRUD API
- [ ] Add "Save Search" UI to search page
- [ ] Create saved searches management page
- [ ] Implement notification system (optional)
- [ ] Schedule daily job to check for new matches

**Database Schema:**
```sql
CREATE TABLE "SavedSearch" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "query" TEXT NOT NULL,
  "filters" JSONB NOT NULL,
  "sortBy" TEXT,
  "type" TEXT NOT NULL, -- 'vehicle' | 'product'
  "notifyOnMatch" BOOLEAN DEFAULT false,
  "lastNotified" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
```

**Files to Create:**
- `website/components/search/SaveSearchButton.tsx`
- `website/components/account/SavedSearches.tsx`
- `website/app/api/user/saved-searches/route.ts`
- `website/app/account/saved-searches/page.tsx`
- `website/lib/db/queries/saved-searches.ts`

**Files to Modify:**
- `website/app/search/page.tsx`
- `website/app/account/page.tsx` (add link to saved searches)
- `website/prisma/schema.prisma`

---

### Story 4: Search Result Sorting Options

**As a** user viewing search results  
**I want to** sort results by different criteria  
**So that** I can find the most relevant or best-value items first

**Acceptance Criteria:**

**Vehicle Sorting:**
- [ ] Relevance (default)
- [ ] Price: Low to High
- [ ] Price: High to Low
- [ ] Year: Newest First
- [ ] Year: Oldest First
- [ ] Mileage: Low to High
- [ ] Recently Added

**Product Sorting:**
- [ ] Relevance (default)
- [ ] Price: Low to High
- [ ] Price: High to Low
- [ ] Best Selling
- [ ] Newest Arrivals
- [ ] Name: A-Z

**Sort UX:**
- [ ] Sort dropdown in top-right of results
- [ ] Sort persists in URL
- [ ] Sort works with filters
- [ ] Mobile-friendly dropdown
- [ ] Keyboard accessible

**Technical Tasks:**
- [ ] Add sort parameter to search API
- [ ] Build SortDropdown component
- [ ] Update search query builder to handle sort
- [ ] Ensure sort fields are indexed
- [ ] Add sort to saved searches

**Files to Create:**
- `website/components/search/SortDropdown.tsx`

**Files to Modify:**
- `website/app/search/page.tsx`
- `website/app/api/search/v2/route.ts`
- `website/lib/search/meilisearch.ts`

---

## Design Considerations

### Search Performance
- Cache popular queries (Redis or Vercel KV)
- Implement query debouncing (300ms)
- Pagination with cursor-based approach
- Lazy load search results (infinite scroll or pagination)

### Search Quality
- Boost exact matches
- Penalize very old vehicles (sold)
- Custom ranking for featured vehicles
- A/B test ranking algorithms

### User Experience
- Show "No results" with suggestions
- "Did you mean?" for typos
- Recent searches (localStorage)
- Popular searches (trending)
- Search history (logged-in users)

---

## Testing Requirements

- [ ] Unit tests for search query builder
- [ ] Integration tests for search API
- [ ] E2E tests for search flows
- [ ] Performance tests (search latency)
- [ ] Load tests (concurrent searches)
- [ ] Accessibility tests for filters and sort

---

## Success Metrics

- **Search Speed**: < 100ms p95 response time
- **Search Quality**: < 5% no-result searches
- **Engagement**: 40%+ of users use search
- **Conversion**: 2x higher conversion rate for search users
- **Saved Searches**: 20%+ of logged-in users save searches

---

## Migration Plan

1. **Phase 1**: Set up Meilisearch, create indexes
2. **Phase 2**: Build new search API (v2), keep v1 running
3. **Phase 3**: A/B test new search (50/50 split)
4. **Phase 4**: Full rollout if metrics improve
5. **Phase 5**: Deprecate old search (Fuse.js as fallback only)

---

## Cost Estimation

**Meilisearch Hosting:**
- Railway: ~$5-10/month (512MB RAM)
- Fly.io: ~$5-10/month (shared CPU)
- Self-hosted: $0 (use existing infrastructure)

**Algolia (Alternative):**
- Free tier: 10k searches/month, 10k records
- Growth: $1/1000 searches, $0.50/1000 records
- Estimated: $50-200/month at scale

---

## Documentation Needs

- [ ] Search API documentation
- [ ] Indexing pipeline guide
- [ ] Filter and sort reference
- [ ] Saved searches user guide
- [ ] Search analytics dashboard guide

---

## Future Enhancements

- AI-powered search (semantic search)
- Visual search (search by image)
- Voice search
- Search autocomplete with rich previews
- Personalized search results
- Multi-language search
