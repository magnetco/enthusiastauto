# Unified Search Infrastructure

This directory contains the unified search system for Enthusiast Auto, implementing a client-side search solution using Fuse.js that queries both Sanity CMS (vehicles) and Shopify (parts).

## Architecture

### Overview

The search system consists of four main components:

1. **Type Definitions** (`types/search.ts`) - TypeScript interfaces and types
2. **Fuse.js Configuration** (`lib/search/fuse.ts`) - Search engine configuration
3. **Indexer** (`lib/search/indexer.ts`) - Data fetching and caching
4. **Unified Search** (`lib/search/unified.ts`) - Search orchestration and ranking
5. **API Route** (`app/api/search/route.ts`) - Public search endpoint

### Data Flow

```
User Query → API Route → Unified Search → [Vehicle Index, Product Index] → Fuse.js → Ranked Results
                                                    ↓                             ↑
                                              Cache (15 min TTL)            Cache (5 min TTL)
```

## Components

### 1. Type Definitions (`types/search.ts`)

Defines all search-related TypeScript types:

- `SearchResult<T>` - Unified result with type discrimination (vehicle | product)
- `SearchQuery` - API query parameters
- `SearchResponse` - API response format
- `SearchableVehicle` - Flattened vehicle data for Fuse.js
- `SearchableProduct` - Flattened product data for Fuse.js
- `FuseConfig` - Fuse.js configuration options

### 2. Fuse.js Configuration (`lib/search/fuse.ts`)

Configures fuzzy search engine with field weighting:

**Vehicle Fields & Weights:**
- `listingTitle`: 2.0 (highest priority)
- `chassis`: 1.5
- `vin`: 1.5
- `status`: 1.0
- `inventoryStatus`: 1.0
- `slug`: 0.8

**Product Fields & Weights:**
- `title`: 2.0 (highest priority)
- `tags`: 1.5
- `description`: 1.0
- `vendor`: 0.8
- `productType`: 0.8
- `handle`: 0.8

**Configuration:**
- Threshold: 0.3 (balanced precision/recall)
- Min match length: 2 characters
- Fuzzy matching enabled for typos

### 3. Indexer (`lib/search/indexer.ts`)

Manages search index building and caching:

**Functions:**
- `buildVehicleIndex()` - Fetches vehicles from Sanity
- `buildProductIndex()` - Fetches products from Shopify
- `getVehicleIndex()` - Returns cached or fresh vehicle index
- `getProductIndex()` - Returns cached or fresh product index
- `refreshVehicleIndex()` - Manual index refresh trigger
- `refreshProductIndex()` - Manual index refresh trigger
- `refreshAllIndexes()` - Refreshes all indexes
- `warmSearchCache()` - Pre-builds indexes on startup

**Caching:**
- Index TTL: 15 minutes (per NFR008 requirement)
- Auto-refresh on cache expiration
- Manual refresh via webhook handlers

### 4. Unified Search (`lib/search/unified.ts`)

Orchestrates search across both data sources:

**Main Function:**
```typescript
searchAll(
  query: string,
  type: 'vehicles' | 'parts' | 'all' = 'all',
  limit: number = 20
): Promise<SearchResult[]>
```

**Features:**
- Searches both Sanity and Shopify
- Merges and ranks results by relevance
- Caches results for 5 minutes
- Logs slow queries (>300ms)
- Cache warming for popular terms

**Performance:**
- Result cache TTL: 5 minutes
- Target latency: <300ms (NFR009)
- Popular terms pre-cached: BMW, E46, M3, parts, etc.

### 5. API Route (`app/api/search/route.ts`)

Public search endpoint with validation and rate limiting:

**Endpoint:** `GET /api/search`

**Query Parameters:**
- `q` (required) - Search query (2-100 chars)
- `type` (optional) - Content filter: `vehicles`, `parts`, or `all` (default)
- `limit` (optional) - Results limit (default: 20, max: 100)

**Response:**
```json
{
  "results": [
    {
      "type": "vehicle" | "product",
      "item": { /* vehicle or product data */ },
      "score": 0.12
    }
  ],
  "totalResults": 10,
  "searchTime": 45
}
```

**Security:**
- Rate limiting: 100 requests/minute per IP
- Input validation (length, type)
- Error handling with appropriate status codes

**Caching:**
- Response cache: 5 minutes
- Cache-Control header: `public, max-age=300, stale-while-revalidate=600`

## Usage

### Basic Search

```typescript
import { searchAll } from '@/lib/search/unified';

// Search everything
const results = await searchAll('BMW E46');

// Search only vehicles
const vehicles = await searchAll('M3', 'vehicles', 10);

// Search only parts
const parts = await searchAll('brake pads', 'parts', 20);
```

### API Usage

```bash
# Search everything
curl "https://enthusiastauto.com/api/search?q=BMW+M3"

# Search only vehicles
curl "https://enthusiastauto.com/api/search?q=E46&type=vehicles&limit=5"

# Search only parts
curl "https://enthusiastauto.com/api/search?q=spoiler&type=parts"
```

### Cache Warming

```typescript
import { warmSearchCache } from '@/lib/search/indexer';
import { warmSearchResults } from '@/lib/search/unified';

// On application startup
await warmSearchCache(); // Builds indexes
await warmSearchResults(); // Pre-searches popular terms
```

### Manual Index Refresh

```typescript
import { refreshAllIndexes } from '@/lib/search/indexer';

// Trigger refresh (called by webhook handlers)
await refreshAllIndexes();
```

## Performance

### Targets (NFR009)

- **95th percentile latency:** <300ms
- **Fuzzy matching:** Supports typos and partial queries
- **Index refresh:** Within 15 minutes of content changes (NFR008)

### Optimization Strategies

1. **Multi-layer caching:**
   - Index cache: 15 minutes
   - Result cache: 5 minutes
   - HTTP cache: 5 minutes

2. **Cache warming:**
   - Indexes pre-built on startup
   - Popular terms pre-searched

3. **Performance monitoring:**
   - Slow queries logged (>300ms)
   - Search time included in API response

## Testing

Run tests:
```bash
npm test lib/search
npm test app/api/search
```

Test files:
- `lib/search/__tests__/fuse.test.ts` - Fuse.js configuration
- `lib/search/__tests__/indexer.test.ts` - Index building and caching
- `lib/search/__tests__/unified.test.ts` - Search orchestration
- `app/api/search/__tests__/route.test.ts` - API endpoint

## Webhook Integration

### Sanity Vehicle Updates

Webhook handler at `/app/api/revalidate/vehicle/[slug]/route.ts` automatically refreshes vehicle index when vehicles are created, updated, or deleted.

### Future: Shopify Product Updates

When Shopify webhook handler is implemented, it should call `refreshProductIndex()` to update the product index.

## Future Enhancements

### Phase 2b: Meilisearch Migration

When inventory exceeds 200 items or latency exceeds 300ms:

1. Install Meilisearch Cloud (free tier: 100k docs)
2. Update indexer to use Meilisearch client
3. Keep same API interface (transparent migration)
4. Benefits: Better performance, typo tolerance, filters

See ADR-005 in solution-architecture.md for migration strategy.

## Field Weighting Tuning

To adjust relevance ranking, modify field weights in `lib/search/fuse.ts`:

```typescript
// Example: Boost chassis code importance
export const vehicleFuseConfig = {
  keys: [
    { name: "chassis", weight: 2.5 }, // Increased from 1.5
    // ...
  ]
}
```

Retest with `npm test` after changes.

## Troubleshooting

### Slow Queries

Check logs for queries exceeding 300ms:
```
[Search] Slow query detected: "complex query" took 450ms (target: <300ms)
```

**Solutions:**
- Reduce index size (filter out unnecessary data)
- Increase cache TTL
- Consider Meilisearch migration

### Stale Results

If search results don't reflect recent changes:
- Check cache TTL (15 min for indexes, 5 min for results)
- Verify webhook handlers are triggering
- Manually refresh: `refreshAllIndexes()`

### Rate Limiting

If users hit rate limits:
- Check IP-based counter in API route
- Increase limit from 100 req/min if needed
- Consider authenticated rate limiting

## Related Documentation

- [PRD Epic 6: Advanced Search & Discovery](../../../docs/PRD.md)
- [Solution Architecture ADR-005](../../../docs/solution-architecture.md)
- [Story 6.1: Unified Search Infrastructure](../../../docs/stories/story-6.1.md)
- [NFR009: Search Performance](../../../docs/solution-architecture.md#nfr009)
