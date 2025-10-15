# Data Models Documentation

**Project:** Enthusiast Auto Ecommerce Site
**File:** `lib/shopify/types.ts`
**Generated:** 2025-10-14

---

## Overview

This application uses **TypeScript** for type safety across all data structures. All data originates from Shopify's Storefront API, so there is no traditional database schema. Instead, TypeScript types define the shape of data received from and sent to Shopify.

**Key Characteristics:**

- No local database (Shopify is the source of truth)
- GraphQL-based API interactions
- Full type safety with TypeScript
- Transformation layer between Shopify and application

---

## Type System Architecture

### Core Patterns

**1. Shopify Types (`Shopify*`)**

- Raw response types from Shopify API
- Contain GraphQL `Connection<T>` structures
- Example: `ShopifyProduct`, `ShopifyCart`

**2. Application Types**

- Flattened, simplified versions for application use
- Remove GraphQL connection boilerplate
- Example: `Product`, `Cart`

**3. Operation Types (`Shopify*Operation`)**

- Define GraphQL query/mutation structure
- Include both `data` response and `variables` input
- Example: `ShopifyProductOperation`

---

## Core Data Models

### Product

**Application Type:**

```typescript
export type Product = Omit<ShopifyProduct, "variants" | "images"> & {
  variants: ProductVariant[];
  images: Image[];
};
```

**Transformed from:** `ShopifyProduct`

**Fields:**

```typescript
{
  id: string;                    // Global Shopify ID
  handle: string;                // URL-safe identifier
  availableForSale: boolean;     // Stock availability
  title: string;                 // Product name
  description: string;           // Plain text description
  descriptionHtml: string;       // HTML description
  options: ProductOption[];      // Variant options (size, color, etc.)
  priceRange: {
    maxVariantPrice: Money;      // Highest variant price
    minVariantPrice: Money;      // Lowest variant price
  };
  variants: ProductVariant[];    // Available variants
  featuredImage: Image;          // Primary product image
  images: Image[];               // All product images
  seo: SEO;                      // SEO metadata
  tags: string[];                // Product tags
  updatedAt: string;             // Last update timestamp
}
```

**Example:**

```typescript
const product: Product = {
  id: "gid://shopify/Product/123456",
  handle: "awesome-t-shirt",
  title: "Awesome T-Shirt",
  description: "The best t-shirt you'll ever own",
  availableForSale: true,
  priceRange: {
    minVariantPrice: {
      amount: "29.99",
      currencyCode: "USD",
    },
    maxVariantPrice: {
      amount: "34.99",
      currencyCode: "USD",
    },
  },
  variants: [
    {
      id: "gid://shopify/ProductVariant/789",
      title: "Small / Red",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Small" },
        { name: "Color", value: "Red" },
      ],
      price: {
        amount: "29.99",
        currencyCode: "USD",
      },
    },
  ],
  images: [
    {
      url: "https://cdn.shopify.com/...",
      altText: "Awesome T-Shirt - Red",
      width: 1000,
      height: 1000,
    },
  ],
  seo: {
    title: "Awesome T-Shirt | Your Store",
    description: "Buy the best t-shirt online",
  },
  tags: ["new", "featured"],
  updatedAt: "2025-10-14T00:00:00Z",
};
```

---

### ProductVariant

**Type Definition:**

```typescript
export type ProductVariant = {
  id: string; // Global variant ID
  title: string; // Variant name
  availableForSale: boolean; // Stock status
  selectedOptions: {
    name: string; // Option name (Size, Color, etc.)
    value: string; // Option value (Small, Red, etc.)
  }[];
  price: Money; // Variant price
};
```

**Purpose:** Represents different versions of a product (size, color combinations)

**Example:**

```typescript
const variant: ProductVariant = {
  id: "gid://shopify/ProductVariant/789",
  title: "Medium / Blue",
  availableForSale: true,
  selectedOptions: [
    { name: "Size", value: "Medium" },
    { name: "Color", value: "Blue" },
  ],
  price: {
    amount: "31.99",
    currencyCode: "USD",
  },
};
```

---

### ProductOption

**Type Definition:**

```typescript
export type ProductOption = {
  id: string; // Option ID
  name: string; // Option name (e.g., "Size", "Color")
  values: string[]; // Available values
};
```

**Purpose:** Defines configurable product options

**Example:**

```typescript
const options: ProductOption[] = [
  {
    id: "opt1",
    name: "Size",
    values: ["Small", "Medium", "Large", "XL"],
  },
  {
    id: "opt2",
    name: "Color",
    values: ["Red", "Blue", "Black", "White"],
  },
];
```

---

### Cart

**Application Type:**

```typescript
export type Cart = Omit<ShopifyCart, "lines"> & {
  lines: CartItem[];
};
```

**Transformed from:** `ShopifyCart`

**Fields:**

```typescript
{
  id: string | undefined;        // Cart ID (undefined if no cart)
  checkoutUrl: string;           // Shopify checkout URL
  cost: {
    subtotalAmount: Money;       // Subtotal before tax
    totalAmount: Money;          // Total with tax
    totalTaxAmount: Money;       // Tax amount
  };
  lines: CartItem[];             // Cart items (flattened)
  totalQuantity: number;         // Total items in cart
}
```

**Example:**

```typescript
const cart: Cart = {
  id: "gid://shopify/Cart/abc123",
  checkoutUrl: "https://your-store.myshopify.com/checkout/...",
  cost: {
    subtotalAmount: {
      amount: "59.98",
      currencyCode: "USD",
    },
    totalAmount: {
      amount: "64.78",
      currencyCode: "USD",
    },
    totalTaxAmount: {
      amount: "4.80",
      currencyCode: "USD",
    },
  },
  lines: [
    {
      id: "gid://shopify/CartLine/xyz",
      quantity: 2,
      cost: {
        totalAmount: {
          amount: "59.98",
          currencyCode: "USD",
        },
      },
      merchandise: {
        id: "gid://shopify/ProductVariant/789",
        title: "Small / Red",
        selectedOptions: [
          { name: "Size", value: "Small" },
          { name: "Color", value: "Red" },
        ],
        product: {
          id: "gid://shopify/Product/123",
          handle: "awesome-t-shirt",
          title: "Awesome T-Shirt",
          featuredImage: {
            /* ... */
          },
        },
      },
    },
  ],
  totalQuantity: 2,
};
```

---

### CartItem

**Type Definition:**

```typescript
export type CartItem = {
  id: string | undefined; // Cart line ID
  quantity: number; // Item quantity
  cost: {
    totalAmount: Money; // Line total
  };
  merchandise: {
    id: string; // Variant ID
    title: string; // Variant title
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct; // Parent product
  };
};
```

**Purpose:** Individual item in shopping cart

---

### CartProduct

**Type Definition:**

```typescript
export type CartProduct = {
  id: string; // Product ID
  handle: string; // Product handle
  title: string; // Product title
  featuredImage: Image; // Product image
};
```

**Purpose:** Simplified product reference for cart items

---

### Collection

**Application Type:**

```typescript
export type Collection = ShopifyCollection & {
  path: string; // Application route path
};
```

**Transformed from:** `ShopifyCollection`

**Fields:**

```typescript
{
  handle: string; // Collection handle
  title: string; // Collection name
  description: string; // Collection description
  seo: SEO; // SEO metadata
  updatedAt: string; // Last update
  path: string; // Route path (e.g., "/search/summer")
}
```

**Example:**

```typescript
const collection: Collection = {
  handle: "summer-collection",
  title: "Summer Collection",
  description: "Cool products for hot days",
  seo: {
    title: "Summer Collection | Your Store",
    description: "Browse our summer collection",
  },
  updatedAt: "2025-10-14T00:00:00Z",
  path: "/search/summer-collection",
};
```

---

### Image

**Type Definition:**

```typescript
export type Image = {
  url: string; // CDN image URL
  altText: string; // Accessibility text
  width: number; // Image width (px)
  height: number; // Image height (px)
};
```

**Purpose:** Product and media images

**Example:**

```typescript
const image: Image = {
  url: "https://cdn.shopify.com/s/files/1/...",
  altText: "Awesome T-Shirt in Red",
  width: 1000,
  height: 1000,
};
```

---

### Money

**Type Definition:**

```typescript
export type Money = {
  amount: string; // Price amount (string for precision)
  currencyCode: string; // ISO currency code
};
```

**Purpose:** Represents monetary values

**Example:**

```typescript
const price: Money = {
  amount: "29.99",
  currencyCode: "USD",
};
```

**Note:** Amount is a string to preserve decimal precision (not a floating point number).

---

### SEO

**Type Definition:**

```typescript
export type SEO = {
  title: string; // Meta title
  description: string; // Meta description
};
```

**Purpose:** Search engine optimization metadata

**Example:**

```typescript
const seo: SEO = {
  title: "Awesome T-Shirt | Your Store",
  description:
    "Buy the best t-shirt online. Available in multiple colors and sizes.",
};
```

---

### Page

**Type Definition:**

```typescript
export type Page = {
  id: string; // Page ID
  title: string; // Page title
  handle: string; // URL handle
  body: string; // Page HTML content
  bodySummary: string; // Plain text summary
  seo?: SEO; // SEO metadata (optional)
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last update timestamp
};
```

**Purpose:** CMS pages (About, FAQ, etc.)

**Example:**

```typescript
const page: Page = {
  id: "gid://shopify/Page/456",
  title: "About Us",
  handle: "about-us",
  body: "<h1>About Our Company</h1><p>We are...</p>",
  bodySummary: "About Our Company We are...",
  seo: {
    title: "About Us | Your Store",
    description: "Learn about our company",
  },
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-10-14T00:00:00Z",
};
```

---

### Menu

**Type Definition:**

```typescript
export type Menu = {
  title: string; // Menu item title
  path: string; // Application route path
};
```

**Purpose:** Navigation menu items

**Example:**

```typescript
const menuItems: Menu[] = [
  { title: "Home", path: "/" },
  { title: "Shop", path: "/search" },
  { title: "Summer", path: "/search/summer-collection" },
  { title: "About", path: "/about" },
];
```

---

## GraphQL Connection Types

### Connection<T>

**Type Definition:**

```typescript
export type Connection<T> = {
  edges: Array<Edge<T>>;
};
```

**Purpose:** GraphQL pagination wrapper

**Example:**

```typescript
const productsConnection: Connection<Product> = {
  edges: [{ node: product1 }, { node: product2 }, { node: product3 }],
};
```

---

### Edge<T>

**Type Definition:**

```typescript
export type Edge<T> = {
  node: T;
};
```

**Purpose:** Individual connection item wrapper

---

## Shopify Raw Types

### ShopifyProduct

**Type Definition:**

```typescript
export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>; // GraphQL connection
  featuredImage: Image;
  images: Connection<Image>; // GraphQL connection
  seo: SEO;
  tags: string[];
  updatedAt: string;
};
```

**Purpose:** Raw product data from Shopify API (before transformation)

**Note:** Variants and images use `Connection<T>` wrapper

---

### ShopifyCart

**Type Definition:**

```typescript
export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>; // GraphQL connection
  totalQuantity: number;
};
```

**Purpose:** Raw cart data from Shopify API (before transformation)

---

### ShopifyCollection

**Type Definition:**

```typescript
export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};
```

**Purpose:** Raw collection data from Shopify API

---

## Operation Types

Operation types define the structure of GraphQL requests and responses.

### Query Operations

**ShopifyProductOperation:**

```typescript
export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};
```

**ShopifyProductsOperation:**

```typescript
export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};
```

**ShopifyCollectionOperation:**

```typescript
export type ShopifyCollectionOperation = {
  data: {
    collection: ShopifyCollection;
  };
  variables: {
    handle: string;
  };
};
```

**ShopifyCartOperation:**

```typescript
export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};
```

### Mutation Operations

**ShopifyCreateCartOperation:**

```typescript
export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};
```

**ShopifyAddToCartOperation:**

```typescript
export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};
```

**ShopifyUpdateCartOperation:**

```typescript
export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};
```

**ShopifyRemoveFromCartOperation:**

```typescript
export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};
```

---

## Utility Types

### Maybe<T>

**Type Definition:**

```typescript
export type Maybe<T> = T | null;
```

**Purpose:** Represents optional/nullable values

**Example:**

```typescript
const image: Maybe<Image> = product.featuredImage;
// image can be Image or null
```

---

## Data Transformation

### Shopify → Application Types

**Location:** `lib/shopify/index.ts`

**Key Transformations:**

1. **removeEdgesAndNodes**

   - Converts `Connection<T>` to `T[]`
   - Flattens GraphQL pagination structure

2. **reshapeProduct**

   - `ShopifyProduct` → `Product`
   - Flattens `variants` and `images` arrays
   - Adds alt text to images
   - Filters hidden products

3. **reshapeCart**

   - `ShopifyCart` → `Cart`
   - Flattens cart line items
   - Adds default tax amount

4. **reshapeCollection**
   - `ShopifyCollection` → `Collection`
   - Adds application `path` field

---

## Type Guards

**Location:** `lib/type-guards.ts`

**isShopifyError:**

```typescript
export function isShopifyError(error: unknown): error is ShopifyError {
  // Type guard for Shopify-specific errors
}
```

**Purpose:** Safely check if error is from Shopify API

---

## ID Format

### Shopify Global IDs

All Shopify IDs follow the Global ID format:

```
gid://shopify/{ResourceType}/{ID}
```

**Examples:**

- Product: `gid://shopify/Product/123456789`
- Variant: `gid://shopify/ProductVariant/987654321`
- Cart: `gid://shopify/Cart/abc123def456`
- Collection: `gid://shopify/Collection/111222333`

**Important:** Always use the full Global ID when making API requests.

---

## Validation & Type Safety

### TypeScript Strict Mode

**Configuration:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Benefits:**

- Compile-time type checking
- Prevents runtime errors
- Auto-completion in IDEs
- Refactoring safety

### Runtime Validation

**Not Implemented:** No runtime type validation (Zod, io-ts)

**Recommendation:** Consider adding Zod for runtime validation at API boundaries:

```typescript
import { z } from "zod";

const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.object({
    amount: z.string(),
    currencyCode: z.string(),
  }),
});

// Validate at runtime
const product = ProductSchema.parse(data);
```

---

## Extending Data Models

### Adding New Fields

**1. Update Shopify Fragment:**

```graphql
// lib/shopify/fragments/product.ts
fragment product on Product {
  id
  title
  // Add new field
  metafield(namespace: "custom", key: "my_field") {
    value
  }
}
```

**2. Update TypeScript Type:**

```typescript
// lib/shopify/types.ts
export type Product = {
  id: string;
  title: string;
  // Add new field
  customField?: string;
};
```

**3. Update Transformation:**

```typescript
// lib/shopify/index.ts
const reshapeProduct = (product: ShopifyProduct) => {
  return {
    ...product,
    customField: product.metafield?.value,
  };
};
```

---

## Common Patterns

### Handling Optional Data

```typescript
// Use optional chaining
const imageUrl = product.featuredImage?.url;

// Use nullish coalescing
const title = product.title ?? "Untitled Product";

// Type guard
if (product.seo) {
  console.log(product.seo.title);
}
```

### Type Narrowing

```typescript
// Discriminated unions
type Response =
  | { success: true; data: Product }
  | { success: false; error: string };

function handleResponse(response: Response) {
  if (response.success) {
    // TypeScript knows data exists here
    console.log(response.data.title);
  } else {
    // TypeScript knows error exists here
    console.error(response.error);
  }
}
```

---

## Related Documentation

- **[API Contracts](./api-contracts.md)** - GraphQL queries and mutations
- **[Architecture](./architecture.md)** - Data architecture overview
- **[Development Guide](./development-guide.md)** - TypeScript setup

---

**Document Version:** 1.0
**Last Updated:** 2025-10-14
**TypeScript Version:** 5.8.2
