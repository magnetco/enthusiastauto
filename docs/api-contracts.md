# API Contracts Documentation

**Project:** Enthusiast Auto Ecommerce Site
**API:** Shopify Storefront GraphQL API
**Generated:** 2025-10-14

---

## Overview

This application integrates with the **Shopify Storefront API** via GraphQL to provide headless e-commerce functionality. All product, cart, and content data is managed through Shopify's backend.

**API Type:** GraphQL
**Version:** 2024-01
**Protocol:** HTTPS
**Authentication:** Storefront Access Token

---

## API Configuration

### Endpoint

```
https://{SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json
```

**Environment Variables:**

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_access_token_here
```

### Authentication

**Method:** Header-based token authentication

```http
POST /api/2024-01/graphql.json
Content-Type: application/json
X-Shopify-Storefront-Access-Token: {SHOPIFY_STOREFRONT_ACCESS_TOKEN}
```

**Permissions:** Read-only access to storefront data

- Products and collections
- Cart operations
- CMS pages and menus
- No admin access

---

## Client Implementation

**Location:** `lib/shopify/index.ts`

### Core Function: shopifyFetch

```typescript
async function shopifyFetch<T>({
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T }>
```

**Features:**

- Automatic authentication
- Error handling
- Type-safe responses
- GraphQL error parsing

**Error Handling:**

```typescript
{
  cause: string; // Error cause
  status: number; // HTTP status code
  message: string; // Error message
  query: string; // Original GraphQL query
}
```

---

## GraphQL Fragments

Reusable data structures for consistent querying.

### Image Fragment

**File:** `lib/shopify/fragments/image.ts`

```graphql
fragment image on Image {
  url
  altText
  width
  height
}
```

**Fields:**

- `url` (String!) - Image URL from Shopify CDN
- `altText` (String) - Accessibility text
- `width` (Int!) - Image width in pixels
- `height` (Int!) - Image height in pixels

---

### SEO Fragment

**File:** `lib/shopify/fragments/seo.ts`

```graphql
fragment seo on SEO {
  description
  title
}
```

**Fields:**

- `title` (String) - SEO title (meta title)
- `description` (String) - SEO description (meta description)

---

### Product Fragment

**File:** `lib/shopify/fragments/product.ts`

```graphql
fragment product on Product {
  id
  handle
  availableForSale
  title
  description
  descriptionHtml
  options {
    id
    name
    values
  }
  priceRange {
    maxVariantPrice {
      amount
      currencyCode
    }
    minVariantPrice {
      amount
      currencyCode
    }
  }
  variants(first: 250) {
    edges {
      node {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
      }
    }
  }
  featuredImage {
    ...image
  }
  images(first: 20) {
    edges {
      node {
        ...image
      }
    }
  }
  seo {
    ...seo
  }
  tags
  updatedAt
}
```

**Key Fields:**

- `id` (ID!) - Global product ID
- `handle` (String!) - URL-safe identifier
- `title` (String!) - Product name
- `description` (String!) - Plain text description
- `descriptionHtml` (HTML!) - Rich HTML description
- `variants` - Up to 250 product variants (size, color, etc.)
- `images` - Up to 20 product images
- `tags` - Product tags (used for filtering/hiding)

---

### Cart Fragment

**File:** `lib/shopify/fragments/cart.ts`

```graphql
fragment cart on Cart {
  id
  checkoutUrl
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions {
              name
              value
            }
            product {
              ...product
            }
          }
        }
      }
    }
  }
  totalQuantity
}
```

**Key Fields:**

- `id` (ID!) - Cart ID (stored in cookies)
- `checkoutUrl` (URL!) - Shopify checkout URL
- `cost` - Pricing breakdown (subtotal, tax, total)
- `lines` - Cart items (up to 100)
- `totalQuantity` (Int!) - Total items in cart

---

## Queries

### 1. Get Product

**Function:** `getProduct(handle: string): Promise<Product | undefined>`
**File:** `lib/shopify/queries/product.ts`
**Cache:** Days (with cacheTag)

```graphql
query getProduct($handle: String!) {
  product(handle: $handle) {
    ...product
  }
}
```

**Variables:**

```typescript
{
  handle: string; // Product URL handle (e.g., "awesome-t-shirt")
}
```

**Example:**

```typescript
const product = await getProduct("awesome-t-shirt");
```

**Response:**

```typescript
{
  id: "gid://shopify/Product/123",
  handle: "awesome-t-shirt",
  title: "Awesome T-Shirt",
  description: "The best t-shirt ever",
  priceRange: {
    minVariantPrice: {
      amount: "29.99",
      currencyCode: "USD"
    }
  },
  // ... full product data
}
```

---

### 2. Get Products

**Function:** `getProducts({ query?, reverse?, sortKey? }): Promise<Product[]>`
**File:** `lib/shopify/queries/product.ts`
**Cache:** Days (with cacheTag)

```graphql
query getProducts(
  $sortKey: ProductSortKeys
  $reverse: Boolean
  $query: String
) {
  products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
    edges {
      node {
        ...product
      }
    }
  }
}
```

**Variables:**

```typescript
{
  query?: string           // Search query
  sortKey?: string         // Sort key (TITLE, PRICE, CREATED_AT, etc.)
  reverse?: boolean        // Reverse sort order
}
```

**Example:**

```typescript
const products = await getProducts({
  sortKey: "PRICE",
  reverse: false,
});
```

---

### 3. Get Product Recommendations

**Function:** `getProductRecommendations(productId: string): Promise<Product[]>`
**File:** `lib/shopify/queries/product.ts`
**Cache:** Days (with cacheTag)

```graphql
query getProductRecommendations($productId: ID!) {
  productRecommendations(productId: $productId) {
    ...product
  }
}
```

**Variables:**

```typescript
{
  productId: string; // Global product ID
}
```

**Example:**

```typescript
const recommendations = await getProductRecommendations(
  "gid://shopify/Product/123",
);
```

---

### 4. Get Collection

**Function:** `getCollection(handle: string): Promise<Collection | undefined>`
**File:** `lib/shopify/queries/collection.ts`
**Cache:** Days (with cacheTag)

```graphql
query getCollection($handle: String!) {
  collection(handle: $handle) {
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
  }
}
```

**Variables:**

```typescript
{
  handle: string; // Collection handle (e.g., "summer-collection")
}
```

**Example:**

```typescript
const collection = await getCollection("summer-collection");
```

---

### 5. Get Collection Products

**Function:** `getCollectionProducts({ collection, reverse?, sortKey? }): Promise<Product[]>`
**File:** `lib/shopify/queries/collection.ts`
**Cache:** Days (with cacheTag)

```graphql
query getCollectionProducts(
  $handle: String!
  $sortKey: ProductCollectionSortKeys
  $reverse: Boolean
) {
  collection(handle: $handle) {
    products(sortKey: $sortKey, reverse: $reverse, first: 100) {
      edges {
        node {
          ...product
        }
      }
    }
  }
}
```

**Variables:**

```typescript
{
  collection: string       // Collection handle
  sortKey?: string         // Sort key
  reverse?: boolean        // Reverse order
}
```

**Example:**

```typescript
const products = await getCollectionProducts({
  collection: "summer-collection",
  sortKey: "PRICE",
  reverse: false,
});
```

---

### 6. Get Collections

**Function:** `getCollections(): Promise<Collection[]>`
**File:** `lib/shopify/queries/collection.ts`
**Cache:** Days (with cacheTag)

```graphql
query getCollections {
  collections(first: 100, sortKey: TITLE) {
    edges {
      node {
        handle
        title
        description
        seo {
          ...seo
        }
        updatedAt
      }
    }
  }
}
```

**Example:**

```typescript
const collections = await getCollections();
```

**Note:** Automatically adds "All" collection and filters out `hidden-*` collections.

---

### 7. Get Cart

**Function:** `getCart(): Promise<Cart | undefined>`
**File:** `lib/shopify/queries/cart.ts`
**Cache:** None (real-time)

```graphql
query getCart($cartId: ID!) {
  cart(id: $cartId) {
    ...cart
  }
}
```

**Variables:**

```typescript
{
  cartId: string; // Cart ID from cookies
}
```

**Example:**

```typescript
const cart = await getCart();
```

**Note:** Returns `undefined` if no cart or cart has been checked out.

---

### 8. Get Menu

**Function:** `getMenu(handle: string): Promise<Menu[]>`
**File:** `lib/shopify/queries/menu.ts`
**Cache:** Days (with cacheTag)

```graphql
query getMenu($handle: String!) {
  menu(handle: $handle) {
    items {
      title
      url
    }
  }
}
```

**Variables:**

```typescript
{
  handle: string; // Menu handle (e.g., "main-menu")
}
```

**Example:**

```typescript
const menu = await getMenu("main-menu");
```

**Response:**

```typescript
[
  { title: "Home", path: "/" },
  { title: "Shop", path: "/search" },
  { title: "About", path: "/about" },
];
```

---

### 9. Get Page

**Function:** `getPage(handle: string): Promise<Page>`
**File:** `lib/shopify/queries/page.ts`
**Cache:** None

```graphql
query getPage($handle: String!) {
  pageByHandle(handle: $handle) {
    id
    title
    handle
    body
    bodySummary
    seo {
      ...seo
    }
    createdAt
    updatedAt
  }
}
```

**Variables:**

```typescript
{
  handle: string; // Page handle (e.g., "about-us")
}
```

**Example:**

```typescript
const page = await getPage("about-us");
```

---

### 10. Get Pages

**Function:** `getPages(): Promise<Page[]>`
**File:** `lib/shopify/queries/page.ts`
**Cache:** None

```graphql
query getPages {
  pages(first: 100) {
    edges {
      node {
        id
        title
        handle
        body
        bodySummary
        seo {
          ...seo
        }
        createdAt
        updatedAt
      }
    }
  }
}
```

**Example:**

```typescript
const pages = await getPages();
```

---

## Mutations

### 1. Create Cart

**Function:** `createCart(): Promise<Cart>`
**File:** `lib/shopify/mutations/cart.ts`

```graphql
mutation createCart($lineItems: [CartLineInput!]) {
  cartCreate(input: { lines: $lineItems }) {
    cart {
      ...cart
    }
  }
}
```

**Example:**

```typescript
const cart = await createCart();
```

**Note:** Creates empty cart and stores ID in cookies.

---

### 2. Add to Cart

**Function:** `addToCart(lines: { merchandiseId: string; quantity: number }[]): Promise<Cart>`
**File:** `lib/shopify/mutations/cart.ts`

```graphql
mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ...cart
    }
  }
}
```

**Variables:**

```typescript
{
  cartId: string,              // From cookies
  lines: [
    {
      merchandiseId: string,   // Variant ID
      quantity: number         // Quantity to add
    }
  ]
}
```

**Example:**

```typescript
const updatedCart = await addToCart([
  {
    merchandiseId: "gid://shopify/ProductVariant/456",
    quantity: 2,
  },
]);
```

---

### 3. Update Cart

**Function:** `updateCart(lines: { id: string; merchandiseId: string; quantity: number }[]): Promise<Cart>`
**File:** `lib/shopify/mutations/cart.ts`

```graphql
mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      ...cart
    }
  }
}
```

**Variables:**

```typescript
{
  cartId: string,
  lines: [
    {
      id: string,             // Cart line ID
      merchandiseId: string,  // Variant ID
      quantity: number        // New quantity
    }
  ]
}
```

**Example:**

```typescript
const updatedCart = await updateCart([
  {
    id: "gid://shopify/CartLine/789",
    merchandiseId: "gid://shopify/ProductVariant/456",
    quantity: 3,
  },
]);
```

---

### 4. Remove from Cart

**Function:** `removeFromCart(lineIds: string[]): Promise<Cart>`
**File:** `lib/shopify/mutations/cart.ts`

```graphql
mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      ...cart
    }
  }
}
```

**Variables:**

```typescript
{
  cartId: string,
  lineIds: string[]  // Array of cart line IDs to remove
}
```

**Example:**

```typescript
const updatedCart = await removeFromCart(["gid://shopify/CartLine/789"]);
```

---

## Data Transformation

### Reshaping Functions

**Location:** `lib/shopify/index.ts`

The client includes helper functions to transform Shopify's GraphQL response format into simpler, flattened structures:

#### removeEdgesAndNodes

```typescript
const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};
```

**Purpose:** Converts GraphQL connection format to simple arrays

**Before:**

```typescript
{
  edges: [
    { node: { id: 1, title: "Product A" } },
    { node: { id: 2, title: "Product B" } },
  ];
}
```

**After:**

```typescript
[
  { id: 1, title: "Product A" },
  { id: 2, title: "Product B" },
];
```

#### reshapeProduct

Transforms Shopify product data:

- Flattens image arrays
- Flattens variant arrays
- Adds alt text to images
- Filters hidden products (tag-based)

#### reshapeCart

Transforms cart data:

- Flattens line items
- Adds default tax amount (0.0) if missing

#### reshapeCollection

Transforms collection data:

- Adds `path` field for routing

---

## Caching Strategy

### Cache Tags

**Location:** `lib/constants.ts`

```typescript
export const TAGS = {
  collections: "collections",
  products: "products",
};
```

### Cache Directives

**Server Components with Caching:**

```typescript
"use cache";
cacheTag(TAGS.products);
cacheLife("days");
```

**Functions with caching:**

- `getProduct()` - Tagged with `products`
- `getProducts()` - Tagged with `products`
- `getProductRecommendations()` - Tagged with `products`
- `getCollection()` - Tagged with `collections`
- `getCollectionProducts()` - Tagged with `collections` + `products`
- `getCollections()` - Tagged with `collections`
- `getMenu()` - Tagged with `collections`

**Functions without caching:**

- Cart operations (real-time)
- Page queries (dynamic content)

---

## Revalidation

### On-Demand Revalidation

**Endpoint:** `/api/revalidate`
**Function:** `revalidate(req: NextRequest): Promise<NextResponse>`

**Webhook Topics Supported:**

- `collections/create`
- `collections/update`
- `collections/delete`
- `products/create`
- `products/update`
- `products/delete`

**Request:**

```http
POST /api/revalidate?secret={SHOPIFY_REVALIDATION_SECRET}
X-Shopify-Topic: products/update
Content-Type: application/json

{
  // Shopify webhook payload
}
```

**Response:**

```json
{
  "status": 200,
  "revalidated": true,
  "now": 1700000000000
}
```

**Flow:**

1. Shopify sends webhook on product/collection change
2. Endpoint verifies secret token
3. Invalidates appropriate cache tags
4. Next request fetches fresh data

**Setup in Shopify:**

1. Go to Settings → Notifications → Webhooks
2. Create webhook:
   - URL: `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - Format: JSON
   - Event: Products update, Collections update

---

## Error Handling

### Common Errors

**Invalid Access Token (401):**

```typescript
{
  status: 401,
  message: "Invalid Storefront Access Token"
}
```

**Rate Limiting (429):**

```typescript
{
  status: 429,
  message: "Throttled"
}
```

**GraphQL Errors:**

```typescript
{
  status: 200,
  message: "Field 'xyz' doesn't exist on type 'Product'",
  query: "query { ... }"
}
```

### Error Recovery

**Type Guards:**

```typescript
import { isShopifyError } from "lib/type-guards";

if (isShopifyError(e)) {
  // Handle Shopify-specific error
}
```

**Automatic Retries:** Not implemented (can be added via fetch wrapper)

---

## Rate Limits

**Shopify Storefront API Limits:**

- Default: Based on shop plan
- Typical: 2 requests per second
- Burst: Higher limits for short periods
- Exceeded: 429 status code

**Mitigation:**

- Server-side caching (Next.js cache)
- ISR for static content
- Batched requests where possible

---

## Type Definitions

**File:** `lib/shopify/types.ts`

Key TypeScript types:

- `Product` - Product data
- `Cart` - Shopping cart
- `Collection` - Product collection
- `Image` - Image data
- `Money` - Price with currency
- `Page` - CMS page
- `Menu` - Navigation menu
- `ShopifyProduct` - Raw Shopify response
- Operation types for each query/mutation

See [Data Models documentation](./data-models.md) for complete type definitions.

---

## Testing the API

### Manual Testing

**1. Test Product Query:**

```bash
curl -X POST https://your-store.myshopify.com/api/2024-01/graphql.json \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Storefront-Access-Token: YOUR_TOKEN" \
  -d '{"query": "{ products(first: 1) { edges { node { title } } } }"}'
```

**2. Test via Application:**

```typescript
// In a Server Component
const products = await getProducts({ query: "test" });
console.log(products);
```

### GraphQL Playground

**Shopify GraphQL Admin API Explorer:**
https://shopify.dev/docs/api/storefront

(Requires Shopify Partner account)

---

## Security Considerations

### API Token Security

**Do:**

- ✅ Store token in environment variables
- ✅ Never commit `.env` to version control
- ✅ Use server-side requests only
- ✅ Rotate tokens periodically

**Don't:**

- ❌ Expose token in client-side code
- ❌ Hardcode token in source files
- ❌ Share token publicly

### Webhook Security

**Secret Verification:**

```typescript
const secret = req.nextUrl.searchParams.get("secret");
if (secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
  return NextResponse.json({ status: 401 });
}
```

**HTTPS Only:** Ensure webhooks only accept HTTPS requests

---

## Related Documentation

- **[Architecture](./architecture.md)** - API integration architecture
- **[Data Models](./data-models.md)** - TypeScript type definitions
- **[Development Guide](./development-guide.md)** - Environment setup

---

**Document Version:** 1.0
**Last Updated:** 2025-10-14
**API Version:** Shopify Storefront API 2024-01
